import { instagramFallbackReels } from "../data/instagramFallback.js";

const CACHE_KEY = "potencializa.instagram.reels";
const CACHE_TTL_MS = 10 * 60 * 1000;

function getFallbackReels() {
  return instagramFallbackReels.map(normalizeInstagramReel).filter(Boolean);
}

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const cached = JSON.parse(raw);
    const isFresh = Date.now() - cached.timestamp < CACHE_TTL_MS;
    return isFresh ? cached.data : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Ignora falhas de storage e mantém a renderização funcional.
  }
}

export function normalizeInstagramReel(item) {
  if (!item) return null;

  return {
    id: item.id ?? item.permalink ?? Math.random().toString(36).slice(2),
    title: item.caption ? item.caption.slice(0, 40) : "Reel",
    thumbnail: item.thumbnail || item.media_url || "",
    video: item.media_type === "VIDEO" ? item.media_url : "",
    caption: item.caption || "",
    timestamp: item.timestamp || null,
    permalink: item.permalink || "https://www.instagram.com/potencializamkt_/",
    media_type: item.media_type || "IMAGE",
  };
}

export async function fetchInstagramReels() {
  const cached = readCache();
  if (cached?.length) {
    return cached;
  }

  try {
    const response = await fetch("/api/instagram/reels", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Endpoint de Instagram indisponível");
    }

    const data = await response.json();
    const reels = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const normalized = reels.map(normalizeInstagramReel).filter(Boolean);

    if (normalized.length) {
      writeCache(normalized);
      return normalized;
    }

    return getFallbackReels();
  } catch (error) {
    console.warn("Instagram API unavailable, using fallback data:", error);
    return getFallbackReels();
  }
}
