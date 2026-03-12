import { useState } from "react";
import { startNewGame } from "../hooks/useGame";
import { TEAMS, TOTAL_BOMBS, ADMIN_PIN } from "../lib/gameConfig";

export default function Admin({ onBack }) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { assigned }
  const [confirm, setConfirm] = useState(false);

  function handlePin() {
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin("");
    }
  }

  async function handleNewGame() {
    setLoading(true);
    setResult(null);
    try {
      const assigned = await startNewGame();
      setResult(assigned);
      setConfirm(false);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  // PIN screen
  if (!unlocked) {
    return (
      <div className="page admin-page">
        <div className="board-topbar">
          <button className="back-btn" onClick={onBack}>← Volver</button>
          <span className="team-topbadge" style={{"--team-color":"var(--gold2)"}}>⚙️ Admin</span>
          <span style={{width:70}}/>
        </div>
        <div className="admin-pin-wrap">
          <img src="/logo.png" alt="logo" className="battalion-logo" style={{marginBottom:8}} />
          <div className="admin-pin-title">Panel de Administrador</div>
          <div className="admin-pin-sub">Ingresá el PIN para continuar</div>
          <input
            className="code-input"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handlePin()}
            placeholder="••••"
            maxLength={8}
          />
          {pinError && (
            <div className="message-box error" style={{marginTop:8}}>PIN incorrecto</div>
          )}
          <button className="deactivate-btn" onClick={handlePin} style={{marginTop:4}}>
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  // Admin panel
  return (
    <div className="page admin-page">
      <div className="board-topbar">
        <button className="back-btn" onClick={onBack}>← Volver</button>
        <span className="team-topbadge" style={{"--team-color":"var(--gold2)"}}>⚙️ Admin</span>
        <span style={{width:70}}/>
      </div>

      <div className="admin-body">
        <div className="admin-section-title">Control de Partida</div>

        {/* New game button */}
        {!confirm ? (
          <button className="admin-danger-btn" onClick={() => setConfirm(true)}>
            🎲 Nueva Partida — Sortear Códigos
          </button>
        ) : (
          <div className="admin-confirm-box">
            <div className="admin-confirm-text">
              ⚠️ Esto borrará la partida actual y sorteará códigos nuevos para todos los equipos. ¿Confirmar?
            </div>
            <div className="admin-confirm-btns">
              <button className="admin-cancel-btn" onClick={() => setConfirm(false)}>
                Cancelar
              </button>
              <button className="admin-ok-btn" onClick={handleNewGame} disabled={loading}>
                {loading ? "Sorteando..." : "Sí, nueva partida"}
              </button>
            </div>
          </div>
        )}

        {/* Result: codes per team */}
        {result && (
          <div className="admin-result">
            <div className="admin-result-title">
              ✅ ¡Partida iniciada! Códigos asignados:
            </div>
            <div className="admin-teams-list">
              {TEAMS.map((team) => (
                <div
                  key={team.id}
                  className="admin-team-card"
                  style={{"--team-color": team.color}}
                >
                  <div className="admin-team-name">
                    {team.emoji} {team.name}
                  </div>
                  <div className="admin-codes-grid">
                    {result[team.id].map((code) => (
                      <span key={code} className="admin-code-chip">{code}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-hint">
              Pegá estos códigos en las espaldas de los jugadores de cada equipo (o mezclados entre todos)
            </div>
          </div>
        )}

        <div className="admin-info-box">
          <div className="admin-info-title">ℹ️ Cómo funciona</div>
          <div className="admin-info-text">
            Al iniciar nueva partida, la app sortea <strong>{TOTAL_BOMBS} códigos al azar</strong> de tu pool por cada equipo ({TEAMS.length} equipos × {TOTAL_BOMBS} = {TEAMS.length * TOTAL_BOMBS} códigos en total). Los datos anteriores se borran automáticamente.
          </div>
        </div>
      </div>
    </div>
  );
}
