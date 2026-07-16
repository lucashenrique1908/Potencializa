import { useEffect } from "react";
import "./ContactModal.css";
import ContactForm from "../ContactForm/ContactForm.jsx";

function ContactModal({ isOpen, onClose }) {
	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	return (
		<div className="contact-modal" role="dialog" aria-modal="true">
			<div className="contact-modal__backdrop" onClick={onClose} />
			<div className="contact-modal__panel">
				<button
					className="contact-modal__close"
					onClick={onClose}
					aria-label="Fechar"
				>
					×
				</button>
				<div className="contact-modal__content">
					<h2>Fale com um especialista</h2>
					<p>Preencha seus dados para iniciar o contato via WhatsApp.</p>
					<ContactForm showTitle={false} />
				</div>
			</div>
		</div>
	);
}

export default ContactModal;
