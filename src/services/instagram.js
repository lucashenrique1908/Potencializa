const DEV_API_URL = "http://localhost:3001";
const API_URL = import.meta.env.VITE_API_URL?.trim()
  || (import.meta.env.DEV ? DEV_API_URL : "");

export async function getInstagramReels() {
  if (!API_URL) {
    throw new Error("VITE_API_URL não configurada para este ambiente.");
  }

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/api/instagram/reels`,
    { cache: "no-store" }
  );

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Resposta inválida ao buscar Reels do Instagram");
  }

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string"
        ? data.error
        : `A API do Instagram respondeu com o status ${response.status}.`
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("Resposta inválida ao buscar Reels do Instagram");
  }

  return data;
}

export function normalizeInstagramReel(item) {
  if (!item?.id) return null;

  const caption = item.caption || "";

  return {
    id: item.id,
    mediaType: item.media_type || null,
    mediaProductType: item.media_product_type || null,
    mediaUrl: item.media_url || null,
    thumbnailUrl: item.thumbnail_url || null,
    title: caption ? caption.slice(0, 40) : "Reel",
    thumbnail: item.thumbnail_url || "",
    video: item.media_url || "",
    caption,
    timestamp: item.timestamp || null,
    permalink: item.permalink || "https://www.instagram.com/potencializa_/",
  };
}

export async function fetchInstagramReels() {
  const data = await getInstagramReels();
  return data
    .filter((item) => item?.media_url && typeof item.media_url === "string" && item.media_url.trim())
    .map(normalizeInstagramReel)
    .filter(Boolean);
}
