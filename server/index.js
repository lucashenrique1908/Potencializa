import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  fetchInstagramReels,
  InstagramApiError,
} from "./services/instagram.js";
import {
  fetchYouTubeVideos,
  YouTubeServiceError,
} from "./services/youtube.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = new Set(
  [
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_ORIGIN,
    "https://potencializavideos.com",
    "https://www.potencializavideos.com",
    "https://riqueecode.github.io",
    "https://potencializa-nine.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      origin.endsWith(".github.io") ||
      origin.endsWith(".pages.dev")
    ) {
      callback(null, true);
      return;
    }

    callback(new Error("Origem não autorizada pelo CORS."));
  },
  credentials: false,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/instagram/reels", async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    res.json(await fetchInstagramReels());
  } catch (error) {
    const isInstagramError = error instanceof InstagramApiError;
    if (isInstagramError && error.metaError) {
      console.error("Erro da API do Instagram:", {
        status: error.status,
        code: error.metaError.code,
        type: error.metaError.type,
        error_subcode: error.metaError.error_subcode,
      });
    } else {
      console.error("Erro ao buscar Reels do Instagram:", {
        status: isInstagramError ? error.status : 502,
        code: isInstagramError ? error.code : "INSTAGRAM_INTERNAL_ERROR",
      });
    }

    res.status(isInstagramError ? error.status || 502 : 502).json({
      error: isInstagramError ? error.message : "Erro ao buscar Reels do Instagram",
      code: isInstagramError ? error.code || "INSTAGRAM_UPSTREAM_ERROR" : "INSTAGRAM_INTERNAL_ERROR",
    });
  }
});

app.get("/api/youtube/playlist", async (req, res) => {
  try {
    const videos = await fetchYouTubeVideos();
    res.set("Cache-Control", "public, max-age=300");
    res.json(videos);
  } catch (error) {
    const isServiceError = error instanceof YouTubeServiceError;
    const status = isServiceError ? error.status : 500;
    const code = isServiceError ? error.code : "YOUTUBE_INTERNAL_ERROR";
    const message = isServiceError
      ? error.message
      : "Não foi possível carregar os vídeos do YouTube.";

    console.error("Erro ao carregar vídeos do YouTube:", { status, code });
    res.set("Cache-Control", "no-store").status(status).json({ error: message, code });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
