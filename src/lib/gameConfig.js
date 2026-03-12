// src/lib/gameConfig.js
// ✏️ PERSONALIZÁ los equipos y los códigos válidos acá

export const TEAMS = [
  { id: "rojo",     name: "Equipo Rojo",      color: "#ef4444", emoji: "🔴", bg: "#450a0a" },
  { id: "azul",     name: "Equipo Azul",       color: "#3b82f6", emoji: "🔵", bg: "#0c1a3a" },
  { id: "verde",    name: "Equipo Verde",      color: "#22c55e", emoji: "🟢", bg: "#0a2e10" },
  { id: "amarillo", name: "Equipo Amarillo",   color: "#eab308", emoji: "🟡", bg: "#2d2000" },
  { id: "morado",   name: "Equipo Morado",     color: "#a855f7", emoji: "🟣", bg: "#1e0a2e" },
  { id: "naranja",  name: "Equipo Naranja",    color: "#f97316", emoji: "🟠", bg: "#2e1000" },
];

export const TOTAL_BOMBS = 5;

// 🔑 Códigos válidos para desactivar bombas
// Cada código solo puede usarse UNA vez en todo el juego
// Generá 30+ códigos únicos (uno por participante en la espalda)
export const VALID_CODES = [
  "ALPHA1", "ALPHA2", "ALPHA3", "ALPHA4", "ALPHA5",
  "BRAVO1", "BRAVO2", "BRAVO3", "BRAVO4", "BRAVO5",
  "DELTA1", "DELTA2", "DELTA3", "DELTA4", "DELTA5",
  "ECHO01", "ECHO02", "ECHO03", "ECHO04", "ECHO05",
  "FOXT01", "FOXT02", "FOXT03", "FOXT04", "FOXT05",
  "GOLF01", "GOLF02", "GOLF03", "GOLF04", "GOLF05",
  "HOTEL1", "HOTEL2", "INDIA1", "INDIA2", "JULIET",
];
