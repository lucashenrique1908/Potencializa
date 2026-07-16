import { useEffect, useMemo, useState } from "react";
import "./ContactForm.css";

const SERVICE_OPTIONS = [
	"Design Gráfico",
	"Gestão de tráfego",
	"Captação",
	"Criação de Websites",
	"Criação de Landing page",
	"Pacote Starter",
	"Pacote Premium",
	"Pacote Expert",
	"Plano Start",
	"Plano Potência",
	"Plano Autoridade",
	"Plano Escala",
	"Plano Domínio",
	"Outro",
];

const DEFAULT_PHONE_PLACEHOLDER = "Digite seu telefone";

const ISO_REGION_CODES = [
	"AD",
	"AE",
	"AF",
	"AG",
	"AI",
	"AL",
	"AM",
	"AO",
	"AQ",
	"AR",
	"AS",
	"AT",
	"AU",
	"AW",
	"AX",
	"AZ",
	"BA",
	"BB",
	"BD",
	"BE",
	"BF",
	"BG",
	"BH",
	"BI",
	"BJ",
	"BL",
	"BM",
	"BN",
	"BO",
	"BQ",
	"BR",
	"BS",
	"BT",
	"BV",
	"BW",
	"BY",
	"BZ",
	"CA",
	"CC",
	"CD",
	"CF",
	"CG",
	"CH",
	"CI",
	"CK",
	"CL",
	"CM",
	"CN",
	"CO",
	"CR",
	"CU",
	"CV",
	"CW",
	"CX",
	"CY",
	"CZ",
	"DE",
	"DJ",
	"DK",
	"DM",
	"DO",
	"DZ",
	"EC",
	"EE",
	"EG",
	"EH",
	"ER",
	"ES",
	"ET",
	"FI",
	"FJ",
	"FK",
	"FM",
	"FO",
	"FR",
	"GA",
	"GB",
	"GD",
	"GE",
	"GF",
	"GG",
	"GH",
	"GI",
	"GL",
	"GM",
	"GN",
	"GP",
	"GQ",
	"GR",
	"GS",
	"GT",
	"GU",
	"GW",
	"GY",
	"HK",
	"HM",
	"HN",
	"HR",
	"HT",
	"HU",
	"ID",
	"IE",
	"IL",
	"IM",
	"IN",
	"IO",
	"IQ",
	"IR",
	"IS",
	"IT",
	"JE",
	"JM",
	"JO",
	"JP",
	"KE",
	"KG",
	"KH",
	"KI",
	"KM",
	"KN",
	"KP",
	"KR",
	"KW",
	"KY",
	"KZ",
	"LA",
	"LB",
	"LC",
	"LI",
	"LK",
	"LR",
	"LS",
	"LT",
	"LU",
	"LV",
	"LY",
	"MA",
	"MC",
	"MD",
	"ME",
	"MF",
	"MG",
	"MH",
	"MK",
	"ML",
	"MM",
	"MN",
	"MO",
	"MP",
	"MQ",
	"MR",
	"MS",
	"MT",
	"MU",
	"MV",
	"MW",
	"MX",
	"MY",
	"MZ",
	"NA",
	"NC",
	"NE",
	"NF",
	"NG",
	"NI",
	"NL",
	"NO",
	"NP",
	"NR",
	"NU",
	"NZ",
	"OM",
	"PA",
	"PE",
	"PF",
	"PG",
	"PH",
	"PK",
	"PL",
	"PM",
	"PN",
	"PR",
	"PS",
	"PT",
	"PW",
	"PY",
	"QA",
	"RE",
	"RO",
	"RS",
	"RU",
	"RW",
	"SA",
	"SB",
	"SC",
	"SD",
	"SE",
	"SG",
	"SH",
	"SI",
	"SJ",
	"SK",
	"SL",
	"SM",
	"SN",
	"SO",
	"SR",
	"SS",
	"ST",
	"SV",
	"SX",
	"SY",
	"SZ",
	"TC",
	"TD",
	"TF",
	"TG",
	"TH",
	"TJ",
	"TK",
	"TL",
	"TM",
	"TN",
	"TO",
	"TR",
	"TT",
	"TV",
	"TW",
	"TZ",
	"UA",
	"UG",
	"UM",
	"US",
	"UY",
	"UZ",
	"VA",
	"VC",
	"VE",
	"VG",
	"VI",
	"VN",
	"VU",
	"WF",
	"WS",
	"YE",
	"YT",
	"ZA",
	"ZM",
	"ZW",
];

const getCountryCodes = () => {
	if (
		typeof Intl === "undefined" ||
		typeof Intl.supportedValuesOf !== "function"
	) {
		return ISO_REGION_CODES;
	}

	try {
		const values = Intl.supportedValuesOf("region");
		return Array.isArray(values) && values.length ? values : ISO_REGION_CODES;
	} catch {
		return ISO_REGION_CODES;
	}
};

const COUNTRY_CODES = getCountryCodes();
const englishDisplay =
	typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
		? new Intl.DisplayNames(["en"], { type: "region" })
		: null;
const portugueseDisplay =
	typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function"
		? new Intl.DisplayNames(["pt"], { type: "region" })
		: null;

const COUNTRY_OPTIONS = Array.from(
	new Set(
		COUNTRY_CODES.flatMap((code) => {
			if (englishDisplay && portugueseDisplay) {
				return [englishDisplay.of(code), portugueseDisplay.of(code)].filter(
					Boolean,
				);
			}
			if (englishDisplay) {
				return [englishDisplay.of(code)].filter(Boolean);
			}
			if (portugueseDisplay) {
				return [portugueseDisplay.of(code)].filter(Boolean);
			}
			return [code];
		}),
	),
).sort((a, b) => a.localeCompare(b));

function getPhonePlaceholder(country) {
	const value = country?.trim().toLowerCase();
	if (!value) {
		return DEFAULT_PHONE_PLACEHOLDER;
	}

	if (/(portugal|pt)/i.test(value)) {
		return "+351 912 345 678";
	}
	if (/(brasil|brazil)/i.test(value)) {
		return "+55 91 23456-7890";
	}
	if (/(estados unidos|united states|eua)/i.test(value)) {
		return "+1 202 555 0143";
	}
	if (/(espanha|spain)/i.test(value)) {
		return "+34 612 345 678";
	}
	if (/(frança|france)/i.test(value)) {
		return "+33 6 12 34 56 78";
	}
	if (/(alemanha|germany)/i.test(value)) {
		return "+49 1512 3456789";
	}
	if (/(angola)/i.test(value)) {
		return "+244 923 456 789";
	}
	if (/(moçambique|mozambique)/i.test(value)) {
		return "+258 84 123 4567";
	}
	if (/(canadá|canada)/i.test(value)) {
		return "+1 613 555 0123";
	}
	if (/(reino unido|united kingdom|uk)/i.test(value)) {
		return "+44 7911 123456";
	}
	return "+[código] (XX) XXXXX-XXXX";
}

export default function ContactForm({ onSuccess, showTitle = false }) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		country: "",
		service: "",
		message: "",
	});
	const [phonePlaceholder, setPhonePlaceholder] = useState(
		DEFAULT_PHONE_PLACEHOLDER,
	);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setPhonePlaceholder(getPhonePlaceholder(formData.country));
	}, [formData.country]);

	const options = useMemo(() => COUNTRY_OPTIONS, []);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handlePhoneFocus = () => {
		if (!formData.country) {
			setPhonePlaceholder(
				"Por favor, escolha o país de origem no campo de localização",
			);
		}
	};

	const handlePhoneBlur = () => {
		if (!formData.country) {
			setPhonePlaceholder(DEFAULT_PHONE_PLACEHOLDER);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const currentForm = event.currentTarget;
		if (!currentForm.checkValidity()) {
			currentForm.reportValidity();
			return;
		}

		setIsSubmitting(true);
		const whatsappText = `Nome: ${formData.name}%0AEmail: ${formData.email}%0ATelefone: ${formData.phone}%0ALocalização: ${formData.country}%0AServiço: ${formData.service}%0AMensagem: ${formData.message}`;
		const whatsappUrl = `https://wa.me/351928359241?text=${encodeURIComponent(whatsappText)}`;
		window.open(whatsappUrl, "_blank");
		setTimeout(() => {
			setIsSubmitting(false);
			setConfirmationOpen(true);
			onSuccess?.();
			setFormData({
				name: "",
				email: "",
				phone: "",
				country: "",
				service: "",
				message: "",
			});
			setPhonePlaceholder(DEFAULT_PHONE_PLACEHOLDER);
		}, 100);
	};

	const closeConfirmation = () => {
		setConfirmationOpen(false);
	};

	return (
		<>
			{showTitle && (
				<div className="contact-form__header">
					<h3>Fale com a nossa equipe</h3>
					<p>
						Preencha os dados abaixo para receber nosso contato via WhatsApp.
					</p>
				</div>
			)}
			<form className="contact-form" onSubmit={handleSubmit} noValidate>
				<div className="contact-form__grid">
					<label className="contact-form__field">
						<span>Nome</span>
						<input
							required
							type="text"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Seu nome ou da sua empresa"
						/>
					</label>

					<label className="contact-form__field">
						<span>Email</span>
						<input
							required
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Ex: Minhaempresa@gmail.com"
						/>
					</label>

					<label className="contact-form__field">
						<span>Localização</span>
						<input
							required
							list="country-list"
							name="country"
							value={formData.country}
							onChange={handleChange}
							placeholder="Digite seu país"
						/>
						<datalist id="country-list">
							{options.map((country) => (
								<option key={country} value={country} />
							))}
						</datalist>
					</label>

					<label className="contact-form__field">
						<span>Telefone</span>
						<input
							required
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							onFocus={handlePhoneFocus}
							onBlur={handlePhoneBlur}
							placeholder={phonePlaceholder}
						/>
					</label>

					<label className="contact-form__field contact-form__field--full">
						<span>Serviços</span>
						<select
							required
							name="service"
							value={formData.service}
							onChange={handleChange}
						>
							<option value="" disabled>
								Selecione um serviço
							</option>
							{SERVICE_OPTIONS.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</select>
					</label>
				</div>

				<label className="contact-form__field contact-form__field--full">
					<span>Mensagem</span>
					<textarea
						name="message"
						value={formData.message}
						onChange={handleChange}
						placeholder="Nos conte mais sobre seu projeto (Opcional)"
						rows="5"
					/>
				</label>

				<button
					type="submit"
					className="btn btn--primary btn--specialist contact-form__submit"
					disabled={isSubmitting}
				>
					Enviar
				</button>
			</form>

			{confirmationOpen && (
				<div className="contact-form__confirmation">
					<div className="contact-form__confirmation-card">
						<button
							className="contact-form__confirmation-close"
							onClick={closeConfirmation}
							aria-label="Fechar"
						>
							×
						</button>
						<p>
							Muito Obrigado Pelo interesse e tempo prestado conosco, Iremos
							Contactar o mais breve possível. E não se Esqueca: Criar é o
							começo. Potencializar é o que nos move.
						</p>
					</div>
				</div>
			)}
		</>
	);
}
