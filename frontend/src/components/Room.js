import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MusicPlayer from "./MusicPlayer";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 24px",
    background: "linear-gradient(135deg, #0a0a0f 0%, #12121f 100%)",
  },
  header: {
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  logo: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "20px",
    fontWeight: 700,
    color: "#1db954",
  },
  codeChip: {
    background: "#16161f",
    border: "1px solid #2a2a3a",
    borderRadius: "8px",
    padding: "6px 14px",
    fontSize: "14px",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    letterSpacing: "3px",
    color: "#f0f0f5",
  },
  spotifyBanner: {
    background: "#1a2a1a",
    border: "1px solid #1db954",
    borderRadius: "12px",
    padding: "16px 20px",
    width: "100%",
    maxWidth: "420px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  spotifyText: { fontSize: "14px", color: "#aaddaa" },
  spotifyBtn: {
    background: "#1db954",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    whiteSpace: "nowrap",
  },
  settingsCard: {
    background: "#16161f",
    border: "1px solid #2a2a3a",
    borderRadius: "16px",
    padding: "24px",
    width: "100%",
    maxWidth: "420px",
    marginBottom: "20px",
  },
  settingsTitle: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "14px",
    fontWeight: 700,
    color: "#8888aa",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  settingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "14px",
  },
  settingLabel: { color: "#aaaacc" },
  settingValue: { color: "#f0f0f5", fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" },
  toggle: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
  },
  toggleBtn: (active) => ({
    flex: 1,
    padding: "8px",
    background: active ? "#1db954" : "#0f0f1a",
    color: active ? "#000" : "#8888aa",
    border: `1px solid ${active ? "#1db954" : "#2a2a3a"}`,
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  }),
  saveBtn: {
    width: "100%",
    padding: "11px",
    background: "#1db954",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    marginTop: "16px",
  },
  leaveBtn: {
    background: "transparent",
    border: "1px solid #ff4466",
    color: "#ff4466",
    borderRadius: "10px",
    padding: "11px 24px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    width: "100%",
    maxWidth: "420px",
    marginTop: "8px",
  },
};

export default function Room() {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [song, setSong] = useState(null);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPause, setSettingsPause] = useState(false);
  const [settingsVotes, setSettingsVotes] = useState(2);

  // Fetch room data
  const getRoomDetails = useCallback(() => {
    fetch(`/api/get-room/?code=${roomCode}`)
      .then((res) => {
        if (!res.ok) {
          navigate("/");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setRoom(data);
        setSettingsPause(data.guest_can_pause);
        setSettingsVotes(data.votes_to_skip);
        if (data.is_host) authenticateSpotify();
      });
  }, [roomCode]);

  const authenticateSpotify = () => {
    fetch("/spotify/is-authenticated/")
      .then((res) => res.json())
      .then((data) => {
        setSpotifyAuthenticated(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url/")
            .then((res) => res.json())
            .then((data) => window.location.replace(data.url));
        }
      });
  };

  const getCurrentSong = useCallback(() => {
    fetch("/spotify/current-song/")
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) setSong(data);
      });
  }, []);

  useEffect(() => {
    getRoomDetails();
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, [getRoomDetails, getCurrentSong]);

  const handlePause = () => {
    fetch("/spotify/pause/", { method: "PUT" });
  };

  const handlePlay = () => {
    fetch("/spotify/play/", { method: "PUT" });
  };

  const handleSkip = () => {
    fetch("/spotify/skip/", { method: "POST" });
  };

  const saveSettings = () => {
    fetch("/api/update-room/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: roomCode,
        guest_can_pause: settingsPause,
        votes_to_skip: settingsVotes,
      }),
    }).then((res) => {
      if (res.ok) {
        setRoom((prev) => ({
          ...prev,
          guest_can_pause: settingsPause,
          votes_to_skip: settingsVotes,
        }));
        setShowSettings(false);
      }
    });
  };

  const leaveRoom = () => {
    fetch("/api/leave-room/", { method: "POST" }).then(() => navigate("/"));
  };

  if (!room) return null;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>🎵 Music Party</div>
        <div style={styles.codeChip}>{roomCode}</div>
      </div>

      {room.is_host && !spotifyAuthenticated && (
        <div style={styles.spotifyBanner}>
          <div style={styles.spotifyText}>Connect Spotify to control music</div>
          <button style={styles.spotifyBtn} onClick={authenticateSpotify}>
            Connect
          </button>
        </div>
      )}

      <MusicPlayer
        song={song}
        isHost={room.is_host}
        guestCanPause={room.guest_can_pause}
        onPause={handlePause}
        onPlay={handlePlay}
        onSkip={handleSkip}
      />

      {room.is_host && (
        <div style={{ ...styles.settingsCard, cursor: "pointer" }} onClick={() => setShowSettings(!showSettings)}>
          <div style={{ ...styles.settingsTitle, marginBottom: showSettings ? "16px" : 0 }}>
            {showSettings ? "▾" : "▸"} Room Settings
          </div>

          {showSettings && (
            <>
              <div style={styles.settingRow}>
                <span style={styles.settingLabel}>Guest playback controls</span>
              </div>
              <div style={styles.toggle} onClick={(e) => e.stopPropagation()}>
                <button style={styles.toggleBtn(settingsPause)} onClick={() => setSettingsPause(true)}>
                  Allow
                </button>
                <button style={styles.toggleBtn(!settingsPause)} onClick={() => setSettingsPause(false)}>
                  Host only
                </button>
              </div>

              <div style={{ ...styles.settingRow, marginTop: "16px" }}>
                <span style={styles.settingLabel}>Votes to skip</span>
                <span style={styles.settingValue}>{settingsVotes}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={settingsVotes}
                onChange={(e) => setSettingsVotes(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#1db954" }}
                onClick={(e) => e.stopPropagation()}
              />

              <button style={styles.saveBtn} onClick={(e) => { e.stopPropagation(); saveSettings(); }}>
                Save Settings
              </button>
            </>
          )}
        </div>
      )}

      {!room.is_host && (
        <div style={styles.settingsCard}>
          <div style={styles.settingsTitle}>Room Info</div>
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>Guest controls</span>
            <span style={styles.settingValue}>{room.guest_can_pause ? "On" : "Off"}</span>
          </div>
          <div style={styles.settingRow}>
            <span style={styles.settingLabel}>Votes to skip</span>
            <span style={styles.settingValue}>{room.votes_to_skip}</span>
          </div>
        </div>
      )}

      <button style={styles.leaveBtn} onClick={leaveRoom}>
        Leave Room
      </button>
    </div>
  );
}
