const INSTAGRAM_API_VERSION = "v25.0";
const INSTAGRAM_API_HOST = "https://graph.instagram.com";
const REQUEST_TIMEOUT_MS = 15000;
const INSTAGRAM_MEDIA_FIELDS = [
  "id",
  "media_type",
  "media_product_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "caption",
  "timestamp",
].join(",");

export class InstagramApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "InstagramApiError";
    this.status = details.status;
    this.code = details.code;
    this.metaError = details.metaError;
  }
}

function getMetaErrorDetails(payload) {
  const error = payload?.error;

  if (!error) {
    return undefined;
  }

  return {
    code: error.code,
    type: error.type,
    message: error.message,
    error_subcode: error.error_subcode,
  };
}

export async function fetchInstagramReels() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !instagramUserId) {
    throw new InstagramApiError(
      "Credenciais do Instagram ainda não configuradas.",
      { status: 503, code: "INSTAGRAM_NOT_CONFIGURED" }
    );
  }

  const url = new URL(
    `${INSTAGRAM_API_HOST}/${INSTAGRAM_API_VERSION}/${encodeURIComponent(
      instagramUserId
    )}/media`
  );
  url.searchParams.set("fields", INSTAGRAM_MEDIA_FIELDS);
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("limit", "25");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  let payload;
  try {
    response = await fetch(url, { signal: controller.signal });
    try {
      payload = await response.json();
    } catch (error) {
      throw new InstagramApiError(
        "A API do Instagram devolveu uma resposta inválida.",
        { status: 502, code: "INSTAGRAM_INVALID_RESPONSE", cause: error }
      );
    }
  } catch (error) {
    if (error instanceof InstagramApiError) {
      throw error;
    }

    const timedOut = controller.signal.aborted || error?.name === "AbortError";
    throw new InstagramApiError(
      timedOut
        ? "A solicitação ao Instagram excedeu o tempo limite."
        : "Não foi possível comunicar com a API do Instagram.",
      {
        status: timedOut ? 504 : 502,
        code: timedOut ? "INSTAGRAM_TIMEOUT" : "INSTAGRAM_CONNECTION_ERROR",
        cause: error,
      }
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok || payload?.error) {
    const metaError = getMetaErrorDetails(payload);
    const errorCode = Number(metaError?.code) === 190
      ? "INSTAGRAM_TOKEN_INVALID"
      : Number(metaError?.code) === 10 || Number(metaError?.code) === 200
        ? "INSTAGRAM_PERMISSION_ERROR"
        : "INSTAGRAM_UPSTREAM_ERROR";

    throw new InstagramApiError(
      errorCode === "INSTAGRAM_TOKEN_INVALID"
        ? "O token do Instagram expirou ou é inválido."
        : errorCode === "INSTAGRAM_PERMISSION_ERROR"
          ? "O token do Instagram não possui as permissões necessárias."
          : "A API do Instagram recusou a solicitação.",
      {
        status: response.status || 502,
        code: errorCode,
        metaError,
      }
    );
  }

  if (!Array.isArray(payload?.data)) {
    throw new InstagramApiError(
      "A API do Instagram devolveu uma resposta inválida.",
      { status: 502, code: "INSTAGRAM_INVALID_RESPONSE" }
    );
  }

  return payload.data
    .filter(
      (media) =>
        media.media_product_type === "REELS" &&
        typeof media.media_url === "string" &&
        media.media_url.trim()
    )
    .sort(
      (first, second) =>
        new Date(second.timestamp || 0) - new Date(first.timestamp || 0)
    )
    .slice(0, 5)
    .map((media) => ({
      id: media.id,
      media_type: media.media_type || null,
      media_product_type: media.media_product_type || null,
      media_url: media.media_url || null,
      thumbnail_url: media.thumbnail_url || null,
      permalink: media.permalink || null,
      caption: media.caption || null,
      timestamp: media.timestamp || null,
    }));
}
