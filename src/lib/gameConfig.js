// src/lib/gameConfig.js
// ✏️ Editá los equipos y el pool de códigos acá

export const TEAMS = [
  { id: "rojo",     name: "Equipo Rojo",    color: "#ef4444", emoji: "🔴", bg: "#450a0a" },
  { id: "azul",     name: "Equipo Azul",    color: "#3b82f6", emoji: "🔵", bg: "#0c1a3a" },
  { id: "verde",    name: "Equipo Verde",   color: "#22c55e", emoji: "🟢", bg: "#0a2e10" },
  { id: "amarillo", name: "Equipo Amarillo",color: "#eab308", emoji: "🟡", bg: "#2d2000" },
  { id: "morado",   name: "Equipo Morado",  color: "#a855f7", emoji: "🟣", bg: "#1e0a2e" },
  { id: "naranja",  name: "Equipo Naranja", color: "#f97316", emoji: "🟠", bg: "#2e1000" },
];

export const TOTAL_BOMBS = 5;

// 🔑 POOL COMPLETO de códigos disponibles para sortear
// Cargá todos los códigos que van a estar pegados en las espaldas
// La app sortea 5 al azar por equipo cuando iniciás nueva partida
// Necesitás al menos: TEAMS.length × TOTAL_BOMBS códigos únicos
export const CODE_POOL = [
[
"48392","72510","10933","66291","55120",
"90831","22378","67420","31588","78123",
"45672","99841","30217","61459","87034",
"52918","74360","18427","69153","40782",
"93641","25870","77419","62035","14596",
"88902","51764","30958","76241","48107",
"95430","23084","67512","39841","82057",
"14763","59028","70491","36125","92840",
"51609","87421","60378","24519","79134",
"43067","98215","31840","65729","20486"
]
];

// PIN para acceder al panel de administrador
export const ADMIN_PIN = "2310";
