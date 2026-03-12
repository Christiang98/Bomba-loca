// src/hooks/useGame.js
import { useState, useEffect } from "react";
import {
  doc, getDoc, setDoc, updateDoc, onSnapshot, collection, getDocs
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { TEAMS, TOTAL_BOMBS, VALID_CODES } from "../lib/gameConfig";

// Inicializa el juego en Firestore (solo la primera vez)
export async function initializeGame() {
  const gameRef = doc(db, "game", "state");
  const snap = await getDoc(gameRef);
  if (!snap.exists()) {
    const teams = {};
    TEAMS.forEach((t) => {
      teams[t.id] = { bombs: TOTAL_BOMBS, name: t.name };
    });
    await setDoc(gameRef, { teams, started: true });
  }

  // Inicializar códigos
  const codesRef = doc(db, "game", "codes");
  const codesSnap = await getDoc(codesRef);
  if (!codesSnap.exists()) {
    const codes = {};
    VALID_CODES.forEach((c) => {
      codes[c.toUpperCase()] = { used: false, usedBy: null };
    });
    await setDoc(codesRef, codes);
  }
}

// Resetear el juego completo
export async function resetGame() {
  const gameRef = doc(db, "game", "state");
  const teams = {};
  TEAMS.forEach((t) => {
    teams[t.id] = { bombs: TOTAL_BOMBS, name: t.name };
  });
  await setDoc(gameRef, { teams, started: true });

  const codesRef = doc(db, "game", "codes");
  const codes = {};
  VALID_CODES.forEach((c) => {
    codes[c.toUpperCase()] = { used: false, usedBy: null };
  });
  await setDoc(codesRef, codes);
}

// Hook para escuchar el estado de los equipos en tiempo real
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

// Función para desactivar bomba
export async function deactivateBomb(teamId, code) {
  const upperCode = code.trim().toUpperCase();

  // 1. Verificar si el código es válido
  if (!VALID_CODES.includes(upperCode)) {
    return { success: false, message: "❌ Código incorrecto" };
  }

  // 2. Verificar si ya fue usado
  const codesRef = doc(db, "game", "codes");
  const codesSnap = await getDoc(codesRef);
  const codesData = codesSnap.data();

  if (!codesData[upperCode]) {
    return { success: false, message: "❌ Código incorrecto" };
  }

  if (codesData[upperCode].used) {
    return { success: false, message: "⚠️ Este código ya fue usado" };
  }

  // 3. Verificar bombas restantes
  const gameRef = doc(db, "game", "state");
  const gameSnap = await getDoc(gameRef);
  const gameData = gameSnap.data();
  const currentBombs = gameData.teams[teamId].bombs;

  if (currentBombs <= 0) {
    return { success: false, message: "✅ ¡Tu equipo ya desactivó todas las bombas!" };
  }

  // 4. Marcar código como usado
  await updateDoc(codesRef, {
    [`${upperCode}.used`]: true,
    [`${upperCode}.usedBy`]: teamId,
  });

  // 5. Reducir bomba del equipo
  await updateDoc(gameRef, {
    [`teams.${teamId}.bombs`]: currentBombs - 1,
  });

  const remaining = currentBombs - 1;
  if (remaining === 0) {
    return { success: true, message: "🏆 ¡ÚLTIMA BOMBA DESACTIVADA! ¡GANARON!" };
  }
  return { success: true, message: `💥 ¡Bomba desactivada! Quedan ${remaining}` };
}
