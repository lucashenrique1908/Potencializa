import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Reels from "./components/Reels/Reels.jsx";
import About from "./components/About/About.jsx";
import MissionValues from "./components/MissionValues/MissionValues.jsx";
import Results from "./components/Results/Results.jsx";
import CaseStudy from "./components/CaseStudy/CaseStudy.jsx";
import VideoPackages from "./components/VideoPackages/VideoPackages.jsx";
import SocialMedia from "./components/SocialMedia/SocialMedia.jsx";
import Plans from "./components/Plans/Plans.jsx";
import ExtraServices from "./components/ExtraServices/ExtraServices.jsx";
import CTA from "./components/CTA/CTA.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ContactModal from "./components/ContactModal/ContactModal.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./styles/theme-overrides.css";

function App() {
	const [isContactOpen, setContactOpen] = useState(false);

	useEffect(() => {
		const cards = document.querySelectorAll(".scroll-highlight");
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-highlighted");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.2 }
		);

		cards.forEach((card) => observer.observe(card));
		return () => observer.disconnect();
	}, []);

	const openContact = () => setContactOpen(true);
	const closeContact = () => setContactOpen(false);

	return (
		<ThemeProvider>
			<div className="app-root">
				<Navbar onOpenContact={openContact} />
				<Reels />
				<main>
					<Hero onOpenContact={openContact} />
					<About />
					<MissionValues />
					<Results />
					<CaseStudy />
					<VideoPackages onOpenContact={openContact} />
					<SocialMedia />
					<Plans onOpenContact={openContact} />
					<ExtraServices />
					<CTA />
				</main>
				<Footer onOpenContact={openContact} />
				<ContactModal isOpen={isContactOpen} onClose={closeContact} />
			</div>
		</ThemeProvider>
	);
}

export default App;
