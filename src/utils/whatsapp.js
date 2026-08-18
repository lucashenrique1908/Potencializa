export const DEFAULT_WHATSAPP_NUMBER = "351928359241";

export function buildWhatsAppUrl({
	number = DEFAULT_WHATSAPP_NUMBER,
	message = "",
	plan = "",
	context = "",
	url,
} = {}) {
	if (url) return url;

	const payload = [
		message,
		plan ? `Plano: ${plan}` : "",
		context ? `Contexto: ${context}` : "",
	].filter(Boolean).join("\n");

	const encodedMessage = encodeURIComponent(payload);
	return `https://wa.me/${number}?text=${encodedMessage}`;
}

export function openWhatsAppLink(options = {}) {
	const targetUrl = buildWhatsAppUrl(options);

	if (typeof window === "undefined") {
		return targetUrl;
	}

	window.open(targetUrl, "_blank", "noopener,noreferrer");
	return targetUrl;
}
