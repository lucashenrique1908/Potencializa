const DEVELOPMENT_API_URL = "http://localhost:3001";
const API_URL = import.meta.env.VITE_API_URL?.trim()
	|| (import.meta.env.DEV ? DEVELOPMENT_API_URL : "");
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@edilenemagalhaesmendel";

function isValidVideo(video) {
	return video
		&& typeof video === "object"
		&& !Array.isArray(video)
		&& typeof video.id === "string"
		&& video.id.length > 0
		&& typeof video.videoId === "string"
		&& VIDEO_ID_PATTERN.test(video.videoId)
		&& typeof video.title === "string"
		&& video.title.trim().length > 0
		&& typeof video.description === "string"
		&& (video.thumbnail === null || (typeof video.thumbnail === "string" && video.thumbnail.startsWith("https://")))
		&& video.videoUrl === `https://www.youtube.com/watch?v=${encodeURIComponent(video.videoId)}`
		&& (video.publishedAt === null || typeof video.publishedAt === "string");
}

export async function fetchYouTubeVideos() {
	if (!API_URL) {
		throw new Error("VITE_API_URL não está configurada para este ambiente.");
	}

	const response = await fetch(`${API_URL.replace(/\/$/, "")}/api/youtube/playlist`, {
		headers: { Accept: "application/json" },
	});

	let videos;
	try {
		videos = await response.json();
	} catch {
		if (!response.ok) {
			throw new Error(`O backend do YouTube respondeu com o status ${response.status}.`);
		}
		throw new Error("O backend do YouTube devolveu uma resposta inválida.");
	}

	if (!response.ok) {
		throw new Error(
			typeof videos?.error === "string"
				? videos.error
				: `O backend do YouTube respondeu com o status ${response.status}.`,
		);
	}

	if (!Array.isArray(videos) || !videos.every(isValidVideo)) {
		throw new Error("O backend do YouTube devolveu vídeos num formato inválido.");
	}

	return videos;
}
