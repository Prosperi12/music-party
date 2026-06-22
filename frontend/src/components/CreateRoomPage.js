import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a0f 0%, #12121f 100%)",
    padding: "24px",
  },
  back: {
    position: "fixed",
    top: "24px",
    left: "24px",
    background: "transparent",
    border: "none",
    color: "#8888aa",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  card: {
    background: "#16161f",
    border: "1px solid #2a2a3a",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "6px",
  },
  subtitle: {
    color: "#8888aa",
    fontSize: "14px",
    marginBottom: "32px",
  },
  label: {
    color: "#8888aa",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "10px",
    display: "block",
  },
  sectionGap: { marginBottom: "24px" },
  toggle: {
    display: "flex",
    gap: "10px",
  },
  toggleBtn: (active) => ({
    flex: 1,
    padding: "12px",
    background: active ? "#1db954" : "#0f0f1a",
    color: active ? "#000" : "#8888aa",
    border: `1px solid ${active ? "#1db954" : "#2a2a3a"}`,
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
  }),
  sliderRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  slider: {
    flex: 1,
    accentColor: "#1db954",
    height: "4px",
    cursor: "pointer",
  },
  sliderValue: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "22px",
    fontWeight: 700,
    color: "#1db954",
    minWidth: "28px",
    textAlign: "right",
  },
  btnPrimary: {
    width: "100%",
    padding: "15px",
    background: "#1db954",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    marginTop: "32px",
    transition: "background 0.2s",
  },
};

export default function CreateRoomPage() {
  const [guestCanPause, setGuestCanPause] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const navigate = useNavigate();

  const createRoom = () => {
    fetch("/api/create-room/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_can_pause: guestCanPause,
        votes_to_skip: votesToSkip,
      }),
    })
      .then((res) => res.json())
      .then((data) => navigate(`/room/${data.code}`));
  };

  return (
    <div style={styles.page}>
      <button style={styles.back} onClick={() => navigate("/")}>
        ← Back
      </button>

      <div style={styles.card}>
        <div style={styles.title}>Create a Room</div>
        <div style={styles.subtitle}>Set your room rules, then share your code with friends.</div>

        <div style={styles.sectionGap}>
          <label style={styles.label}>Guest playback controls</label>
          <div style={styles.toggle}>
            <button style={styles.toggleBtn(guestCanPause)} onClick={() => setGuestCanPause(true)}>
              ✓ Guests can pause
            </button>
            <button style={styles.toggleBtn(!guestCanPause)} onClick={() => setGuestCanPause(false)}>
              Host only
            </button>
          </div>
        </div>

        <div style={styles.sectionGap}>
          <label style={styles.label}>Votes needed to skip</label>
          <div style={styles.sliderRow}>
            <input
              type="range"
              min={1}
              max={10}
              value={votesToSkip}
              onChange={(e) => setVotesToSkip(Number(e.target.value))}
              style={styles.slider}
            />
            <div style={styles.sliderValue}>{votesToSkip}</div>
          </div>
        </div>

        <button
          style={styles.btnPrimary}
          onClick={createRoom}
          onMouseOver={(e) => (e.target.style.background = "#1ed760")}
          onMouseOut={(e) => (e.target.style.background = "#1db954")}
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
