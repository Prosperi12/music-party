import React, { useState, useEffect } from "react";
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
  logo: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "48px",
    fontWeight: 700,
    letterSpacing: "-1px",
    marginBottom: "8px",
    background: "linear-gradient(90deg, #1db954, #1ed760)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    color: "#8888aa",
    fontSize: "16px",
    marginBottom: "48px",
    textAlign: "center",
  },
  card: {
    background: "#16161f",
    border: "1px solid #2a2a3a",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    width: "100%",
    padding: "14px 18px",
    background: "#0f0f1a",
    border: "1px solid #2a2a3a",
    borderRadius: "10px",
    color: "#f0f0f5",
    fontSize: "18px",
    letterSpacing: "6px",
    textAlign: "center",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  btnPrimary: {
    width: "100%",
    padding: "14px",
    background: "#1db954",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    transition: "background 0.2s, transform 0.1s",
  },
  btnSecondary: {
    width: "100%",
    padding: "14px",
    background: "transparent",
    color: "#f0f0f5",
    border: "1px solid #2a2a3a",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    transition: "border-color 0.2s",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
    color: "#44445a",
    fontSize: "13px",
  },
  divLine: {
    flex: 1,
    height: "1px",
    background: "#2a2a3a",
  },
  error: {
    color: "#ff4466",
    fontSize: "13px",
    marginBottom: "12px",
    textAlign: "center",
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
};

export default function HomePage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/user-in-room/")
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          navigate(`/room/${data.code}`);
        }
      });
  }, []);

  const joinRoom = () => {
    setError("");
    fetch("/api/join-room/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: roomCode }),
    }).then((res) => {
      if (res.ok) {
        navigate(`/room/${roomCode}`);
      } else {
        setError("Room not found. Check your code and try again.");
      }
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.logo}>🎵 Music Party</div>
      <p style={styles.tagline}>Listen together. Vote together. Vibe together.</p>

      <div style={styles.card}>
        <label style={styles.label}>Join a room</label>
        <input
          style={styles.input}
          placeholder="ROOM CODE"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={6}
          onKeyDown={(e) => e.key === "Enter" && joinRoom()}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button
          style={styles.btnPrimary}
          onClick={joinRoom}
          onMouseOver={(e) => (e.target.style.background = "#1ed760")}
          onMouseOut={(e) => (e.target.style.background = "#1db954")}
        >
          Join Room
        </button>

        <div style={styles.divider}>
          <div style={styles.divLine} />
          or
          <div style={styles.divLine} />
        </div>

        <button
          style={styles.btnSecondary}
          onClick={() => navigate("/create")}
          onMouseOver={(e) => (e.target.style.borderColor = "#5555ff")}
          onMouseOut={(e) => (e.target.style.borderColor = "#2a2a3a")}
        >
          Create a Room
        </button>
      </div>
    </div>
  );
}
