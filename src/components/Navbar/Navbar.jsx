import { useEffect, useState } from "react";
import "./Navbar.css";
import imgDark from "../../assets/images/imgEscuro.jpg";
import imgWhite from "../../assets/images/imgwhite.jpeg";
import { useTheme } from "../../context/ThemeContext.jsx";

function Navbar() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { isDark, toggleTheme } = useTheme();

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const closeMenu = () => setOpen(false);
	const themeLabel = isDark
		? "Mudar para modo claro"
		: "Mudar para modo escuro";
	const themeIcon = isDark ? "◐" : "◑";

	return (
		<header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`} id="top">
			<div className="container navbar__content">
				<a
					href="#top"
					className="navbar__brand"
					aria-label="Potencializa - Início"
				>
					<img src={isDark ? imgDark : imgWhite} alt="Logo Potencializa" />
					<span>Potencializa</span>
				</a>

				<nav
					className={`navbar__nav ${open ? "is-open" : ""}`}
					aria-label="Menu principal"
				>
					<ul>
						<li>
							<a href="#home" onClick={closeMenu}>Início</a>
						</li>
						<li>
							<a href="#about" onClick={closeMenu}>Sobre</a>
						</li>
						<li>
							<a href="#mission" onClick={closeMenu}>Missão</a>
						</li>
						<li>
							<a href="#results" onClick={closeMenu}>Resultados</a>
						</li>
						<li>
							<a href="#services" onClick={closeMenu}>Cases</a>
						</li>
						<li>
							<a href="#video-packages" onClick={closeMenu}>Pacotes</a>
						</li>
						<li>
							<a href="#social-media" onClick={closeMenu}>Mídias</a>
						</li>
						<li>
							<a href="#contact" onClick={closeMenu}>Contato</a>
						</li>
						<li className="navbar__theme-item">
							<button
								className="navbar__theme-toggle navbar__theme-toggle--menu"
								onClick={toggleTheme}
								aria-label={themeLabel}
								title={themeLabel}
							>
								{themeIcon}
							</button>
						</li>
					</ul>
				</nav>

				<div className="navbar__actions">
					<button
						className="navbar__theme-toggle"
						onClick={toggleTheme}
						aria-label={themeLabel}
						title={themeLabel}
					>
						{themeIcon}
					</button>
				</div>

				<button
					className={`navbar__toggle ${open ? "is-active" : ""}`}
					aria-expanded={open}
					aria-label={open ? "Fechar menu" : "Abrir menu"}
					onClick={() => setOpen((currentOpen) => !currentOpen)}
				>
					<span />
					<span />
					<span />
				</button>
			</div>

		<div
			className={`navbar__overlay ${open ? "is-active" : ""}`}
			onClick={closeMenu}
			aria-hidden={!open}
		/>
	</header>
	);
}

export default Navbar;
