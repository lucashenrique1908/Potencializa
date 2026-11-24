const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 15000;
const MAX_RESULTS_PER_PAGE = 50;
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const DEFAULT_CHANNEL_HANDLE = "@edilenemagalhaesmendel";
const UNAVAILABLE_VIDEO_TITLE = /^(private|deleted) video$/i;
const QUOTA_ERROR_REASONS = new Set([
	"quotaExceeded",
	"dailyLimitExceeded",
	"rateLimitExceeded",
	"userRateLimitExceeded",
]);

let cachedVideos = null;
let cacheExpiresAt = 0;
let inFlightRefresh = null;

export class YouTubeServiceError extends Error {
	constructor(message, status, code) {
		super(message);
		this.name = "YouTubeServiceError";
		this.status = status;
		this.code = code;
	}
}

function configuration() {
	const apiKey = process.env.YOUTUBE_API_KEY?.trim();
	const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE?.trim() || DEFAULT_CHANNEL_HANDLE;

	if (!apiKey) {
		throw new YouTubeServiceError(
			"A variável YOUTUBE_API_KEY não está configurada no backend.",
			503,
			"YOUTUBE_NOT_CONFIGURED",
		);
	}

	return {
		apiKey,
		channelHandle: channelHandle.startsWith("@") ? channelHandle : `@${channelHandle}`,
	};
}

function apiError(response, payload) {
	const reason = payload?.error?.errors?.find((item) => item?.reason)?.reason;

	if (QUOTA_ERROR_REASONS.has(reason)) {
		return new YouTubeServiceError(
			"A quota da API do YouTube foi excedida.",
			503,
			"YOUTUBE_QUOTA_EXCEEDED",
		);
	}

	if (reason === "keyInvalid" || reason === "accessNotConfigured" || reason === "ipRefererBlocked") {
		return new YouTubeServiceError(
			"A chave ou a API do YouTube não está configurada corretamente.",
			503,
			"YOUTUBE_API_CONFIGURATION_ERROR",
		);
	}

	if (reason === "channelNotFound") {
		return new YouTubeServiceError("O canal configurado não foi encontrado.", 404, "YOUTUBE_CHANNEL_NOT_FOUND");
	}

	if (reason === "playlistNotFound" || reason === "playlistItemsNotAccessible") {
		return new YouTubeServiceError(
			"A playlist de uploads do canal não está disponível.",
			502,
			"YOUTUBE_UPLOADS_PLAYLIST_UNAVAILABLE",
		);
	}

	if (response.status === 401 || response.status === 403) {
		return new YouTubeServiceError(
			"A API do YouTube recusou a solicitação.",
			502,
			"YOUTUBE_API_FORBIDDEN",
		);
	}

	return new YouTubeServiceError(
		"A API do YouTube não conseguiu concluir a solicitação.",
		502,
		"YOUTUBE_UPSTREAM_ERROR",
	);
}

async function requestYouTubeApi(resource, parameters, apiKey) {
	const url = new URL(`${YOUTUBE_API_URL}/${resource}`);
	for (const [name, value] of Object.entries(parameters)) {
		if (value !== undefined && value !== null) url.searchParams.set(name, value);
	}
	url.searchParams.set("key", apiKey);

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		let response;
		try {
			response = await fetch(url, { signal: controller.signal });
		} catch (error) {
			if (controller.signal.aborted || error?.name === "AbortError") {
				throw new YouTubeServiceError("A solicitação ao YouTube excedeu o tempo limite.", 504, "YOUTUBE_TIMEOUT");
			}
			throw new YouTubeServiceError("Não foi possível comunicar com a API do YouTube.", 502, "YOUTUBE_CONNECTION_ERROR");
		}

		let payload;
		try {
			payload = await response.json();
		} catch (error) {
			if (controller.signal.aborted || error?.name === "AbortError") {
				throw new YouTubeServiceError("A solicitação ao YouTube excedeu o tempo limite.", 504, "YOUTUBE_TIMEOUT");
			}
			if (!response.ok) throw apiError(response, null);
			throw new YouTubeServiceError("A API do YouTube devolveu uma resposta inválida.", 502, "YOUTUBE_INVALID_RESPONSE");
		}

		if (!response.ok) throw apiError(response, payload);
		return payload;
	} finally {
		clearTimeout(timeout);
	}
}

function requireItems(payload) {
	if (!payload || !Array.isArray(payload.items)) {
		throw new YouTubeServiceError("A API do YouTube devolveu uma resposta inválida.", 502, "YOUTUBE_INVALID_RESPONSE");
	}
	return payload.items;
}

async function getUploadsPlaylistId(apiKey, channelHandle) {
	const payload = await requestYouTubeApi(
		"channels",
		{ part: "contentDetails", forHandle: channelHandle, maxResults: "1" },
		apiKey,
	);
	const channels = requireItems(payload);
	if (channels.length === 0) {
		throw new YouTubeServiceError("O canal configurado não foi encontrado.", 404, "YOUTUBE_CHANNEL_NOT_FOUND");
	}

	const uploadsPlaylistId = channels[0]?.contentDetails?.relatedPlaylists?.uploads;
	if (typeof uploadsPlaylistId !== "string" || !uploadsPlaylistId.trim()) {
		throw new YouTubeServiceError(
			"A playlist de uploads do canal não está disponível.",
			502,
			"YOUTUBE_UPLOADS_PLAYLIST_UNAVAILABLE",
		);
	}

	return uploadsPlaylistId;
}

async function getAllPlaylistItems(apiKey, playlistId) {
	const items = [];
	const requestedPageTokens = new Set();
	let pageToken;

	while (true) {
		if (pageToken) {
			if (requestedPageTokens.has(pageToken)) {
				throw new YouTubeServiceError("A API do YouTube devolveu paginação inválida.", 502, "YOUTUBE_INVALID_RESPONSE");
			}
			requestedPageTokens.add(pageToken);
		}

		const payload = await requestYouTubeApi(
			"playlistItems",
			{
				part: "snippet,contentDetails,status",
				playlistId,
				maxResults: String(MAX_RESULTS_PER_PAGE),
				pageToken,
			},
			apiKey,
		);
		items.push(...requireItems(payload));

		const nextPageToken = payload.nextPageToken;
		if (nextPageToken === undefined || nextPageToken === null || nextPageToken === "") break;
		if (typeof nextPageToken !== "string") {
			throw new YouTubeServiceError("A API do YouTube devolveu paginação inválida.", 502, "YOUTUBE_INVALID_RESPONSE");
		}
		pageToken = nextPageToken;
	}

	return items;
}

function bestThumbnail(thumbnails) {
	for (const name of ["maxres", "standard", "high", "medium", "default"]) {
		const url = thumbnails?.[name]?.url;
		if (typeof url === "string" && url.startsWith("https://")) return url;
	}
	return null;
}

function normalizeVideo(item) {
	const snippet = item?.snippet;
	const contentDetails = item?.contentDetails;
	const videoId = contentDetails?.videoId || snippet?.resourceId?.videoId;
	const title = typeof snippet?.title === "string" ? snippet.title.trim() : "";

	if (
		typeof videoId !== "string"
		|| !VIDEO_ID_PATTERN.test(videoId)
		|| !title
		|| item?.status?.privacyStatus === "private"
		|| UNAVAILABLE_VIDEO_TITLE.test(title)
		|| (snippet?.resourceId?.kind && snippet.resourceId.kind !== "youtube#video")
	) {
		return null;
	}

	return {
		id: videoId,
		videoId,
		title,
		description: typeof snippet.description === "string" ? snippet.description : "",
		thumbnail: bestThumbnail(snippet.thumbnails),
		videoUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
		publishedAt: contentDetails?.videoPublishedAt || snippet.publishedAt || null,
	};
}

async function loadVideos() {
	const { apiKey, channelHandle } = configuration();
	const uploadsPlaylistId = await getUploadsPlaylistId(apiKey, channelHandle);
	const items = await getAllPlaylistItems(apiKey, uploadsPlaylistId);
	const videos = [];
	const seenVideoIds = new Set();

	for (const item of items) {
		const video = normalizeVideo(item);
		if (!video || seenVideoIds.has(video.videoId)) continue;
		seenVideoIds.add(video.videoId);
		videos.push(video);
	}

	return videos;
}

function copyVideos(videos) {
	return videos.map((video) => ({ ...video }));
}

export async function fetchYouTubeVideos() {
	if (cachedVideos && Date.now() < cacheExpiresAt) return copyVideos(cachedVideos);
	if (inFlightRefresh) return copyVideos(await inFlightRefresh);

	const refresh = loadVideos();
	inFlightRefresh = refresh;
	try {
		const videos = await refresh;
		cachedVideos = videos;
		cacheExpiresAt = Date.now() + CACHE_TTL_MS;
		return copyVideos(videos);
	} finally {
		if (inFlightRefresh === refresh) inFlightRefresh = null;
	}
}
