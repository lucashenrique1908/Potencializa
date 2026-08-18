import imgDestaque from "../assets/images/imgDestaque.jpeg";
import imgEscuro from "../assets/images/imgEscuro.jpg";
import imgProfile from "../assets/images/imgProfile.jpeg";
import imgWhite from "../assets/images/imgwhite.jpeg";

export const mediaCatalog = {
  vsl: {
    id: "vsl-fundadora",
    kind: "video",
    title: "VSL da fundadora",
    source: null,
    poster: null,
    status: "pending",
    description: "Vídeo principal da landing page. Substituir quando o arquivo real for enviado.",
  },
  reels: {
    source: "instagram",
    kind: "video_collection",
    items: [
      { id: 1, title: "Reel 1", thumbnail: imgDestaque, media_type: "IMAGE", source: null },
      { id: 2, title: "Reel 2", thumbnail: imgEscuro, media_type: "IMAGE", source: null },
      { id: 3, title: "Reel 3", thumbnail: imgProfile, media_type: "IMAGE", source: null },
      { id: 4, title: "Reel 4", thumbnail: imgWhite, media_type: "IMAGE", source: null },
      { id: 5, title: "Reel 5", thumbnail: imgDestaque, media_type: "IMAGE", source: null },
    ],
  },
  testimonials: {
    kind: "video_collection",
    items: [
      {
        id: "testimonial-1",
        title: "Depoimento 1",
        poster: imgProfile,
        source: null,
        placeholder: "Vídeo de depoimento em preparação",
      },
      {
        id: "testimonial-2",
        title: "Depoimento 2",
        poster: imgEscuro,
        source: null,
        placeholder: "Vídeo de depoimento em preparação",
      },
    ],
  },
  storymaker: {
    kind: "video_collection",
    items: [],
    status: "pending",
  },
};
