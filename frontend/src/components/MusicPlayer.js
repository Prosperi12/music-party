import React from "react";

const styles = {
  player: {
    background: "#16161f",
    border: "1px solid #2a2a3a",
    borderRadius: "16px",
    padding: "24px",
    width: "100%",
    maxWidth: "420px",
    marginBottom: "20px",
  },
  albumRow: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    marginBottom: "20px",
  },
  albumArt: {
    width: "80px",
    height: "80px",
    borderRadius: "10px",
    objectFit: "cover",
    background: "#0f0f1a",
    flexShrink: 0,
  },
  trackInfo: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "18px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "4px",
  },
  artist: {
    color: "#8888aa",
    fontSize: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  progressBar: {
    width: "100%",
    height: "4px",
    background: "#2a2a3a",
    borderRadius: "2px",
    marginBottom: "20px",
    overflow: "hidden",
  },
  progressFill: (pct) => ({
    height: "100%",
    width: `${pct}%`,
    background: "#1db954",
    borderRadius: "2px",
    transition: "width 1s linear",
  }),
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
  controlBtn: {
    background: "transparent",
    border: "none",
    color: "#f0f0f5",
    fontSize: "22px",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    background: "#1db954",
    border: "none",
    color: "#000",
    fontSize: "22px",
    cursor: "pointer",
    padding: "12px",
    borderRadius: "50%",
    width: "52px",
    height: "52px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
  voteInfo: {
    textAlign: "center",
    color: "#8888aa",
    fontSize: "12px",
    marginTop: "14px",
  },
  voteHighlight: { color: "#1db954", fontWeight: 600 },
};

export default function MusicPlayer({ song, isHost, guestCanPause, onPause, onPlay, onSkip }) {
  if (!song) {
    return (
      <div style={styles.player}>
        <div style={{ color: "#8888aa", textAlign: "center", padding: "20px 0" }}>
          No song playing — start something on Spotify!
        </div>
      </div>
    );
  }

  const pct = song.duration > 0 ? (song.time / song.duration) * 100 : 0;
  const canControl = isHost || guestCanPause;

  return (
    <div style={styles.player}>
      <div style={styles.albumRow}>
        {song.image_url && (
          <img src={song.image_url} alt="Album art" style={styles.albumArt} />
        )}
        <div style={styles.trackInfo}>
          <div style={styles.title}>{song.title}</div>
          <div style={styles.artist}>{song.artist}</div>
        </div>
      </div>

      <div style={styles.progressBar}>
        <div style={styles.progressFill(pct)} />
      </div>

      <div style={styles.controls}>
        {canControl && (
          <button
            style={styles.controlBtn}
            onClick={song.is_playing ? onPause : onPlay}
            title={song.is_playing ? "Pause" : "Play"}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2a2a3a")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {song.is_playing ? "⏸" : "▶️"}
          </button>
        )}
        <button
          style={styles.controlBtn}
          onClick={onSkip}
          title="Vote to skip"
          onMouseOver={(e) => (e.currentTarget.style.background = "#2a2a3a")}
          onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
        >
          ⏭
        </button>
      </div>

      <div style={styles.voteInfo}>
        <span style={styles.voteHighlight}>{song.votes}</span> / {song.votes_required} votes to skip
      </div>
    </div>
  );
}
