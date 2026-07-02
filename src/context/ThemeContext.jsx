import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
	const [isDark, setIsDark] = useState(() => {
		// Verificar se há tema salvo no localStorage
		const saved = localStorage.getItem("theme");
		if (saved) {
			return saved === "dark";
		}
		// Verificar preferência do sistema
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	// Atualizar o localStorage e aplicar classe ao document
	useEffect(() => {
		const theme = isDark ? "dark" : "light";
		localStorage.setItem("theme", theme);
		document.documentElement.setAttribute("data-theme", theme);
	}, [isDark]);

	const toggleTheme = () => {
		setIsDark((currentTheme) => !currentTheme);
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
