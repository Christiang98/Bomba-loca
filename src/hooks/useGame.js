// src/hooks/useGame.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { TEAMS, TOTAL_BOMBS, CODE_POOL } from "../lib/gameConfig";

// Shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Sortear códigos: 5 únicos por equipo
function drawCodes() {
  const needed = TEAMS.length * TOTAL_BOMBS;
  const pool = shuffle(CODE_POOL).slice(0, needed);
  const assigned = {};
  TEAMS.forEach((t, i) => {
    assigned[t.id] = pool.slice(i * TOTAL_BOMBS, (i + 1) * TOTAL_BOMBS);
  });
  return assigned;
}

// Inicializar juego (solo si no existe)
export async function initializeGame() {
  const gameRef = doc(db, "game", "state");
  const snap = await getDoc(gameRef);
  if (!snap.exists()) {
    await startNewGame();
  }
}

// Nueva partida: sortea códigos y resetea todo
export async function startNewGame() {
  const assigned = drawCodes();

  // Estado de equipos
  const teams = {};
  TEAMS.forEach((t) => {
    teams[t.id] = { bombs: TOTAL_BOMBS, name: t.name, codes: assigned[t.id] };
  });
  await setDoc(doc(db, "game", "state"), { teams, startedAt: Date.now() });

  // Códigos válidos (todos los sorteados, marcados como no usados)
  const codes = {};
  Object.values(assigned).flat().forEach((c) => {
    codes[c] = { used: false, usedBy: null };
  });
  await setDoc(doc(db, "game", "codes"), codes);

  return assigned;
}

// Hook estado de equipos en tiempo real
export function useTeams() {
  const [teams, setTeams] = useState(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "game", "state"), (snap) => {
      if (snap.exists()) setTeams(snap.data().teams);
    });
    return unsub;
  }, []);
  return teams;
}

// Desactivar bomba
export async function deactivateBomb(teamId, code) {
  const upperCode = code.trim().toUpperCase();

  const codesRef = doc(db, "game", "codes");
  const codesSnap = await getDoc(codesRef);
  const codesData = codesSnap.exists() ? codesSnap.data() : {};

  if (!codesData[upperCode]) {
    return { success: false, message: "❌ Código incorrecto" };
  }
  if (codesData[upperCode].used) {
    return { success: false, message: "⚠️ Este código ya fue usado" };
  }

  const gameRef = doc(db, "game", "state");
  const gameSnap = await getDoc(gameRef);
  const gameData = gameSnap.data();
  const currentBombs = gameData.teams[teamId].bombs;

  if (currentBombs <= 0) {
    return { success: false, message: "✅ ¡Ya desactivaron todas sus bombas!" };
  }

  await updateDoc(codesRef, {
    [`${upperCode}.used`]: true,
    [`${upperCode}.usedBy`]: teamId,
  });
  await updateDoc(gameRef, {
    [`teams.${teamId}.bombs`]: currentBombs - 1,
  });

  const remaining = currentBombs - 1;
  if (remaining === 0) {
    return { success: true, message: "🏆 ¡ÚLTIMA BOMBA! ¡GANARON LA MISIÓN!" };
  }
  return { success: true, message: `💥 ¡Bomba desactivada! Quedan ${remaining}` };
}
