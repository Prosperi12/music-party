# Music Party 🎵

A full-stack Django + React app where users create/join rooms, control Spotify playback, and vote to skip songs.

---

## Architecture

```
Browser → Django (port 8000)
             ├── /           → serves React HTML shell
             ├── /api/       → room CRUD endpoints (SQLite)
             └── /spotify/   → Spotify OAuth + playback control
```

**Data flow:**
1. Django serves `index.html` which loads the React bundle (`main.js`)
2. React Router handles all client-side navigation (`/`, `/create`, `/room/:code`)
3. React `fetch()`es to `/api/` and `/spotify/` for all data
4. Django hits SQLite for room data, Spotify API for music

---

## Setup

### 1. Clone & create virtual environment
```bash
cd music_party
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Django migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Install & build React frontend
```bash
cd frontend
npm install
npm run dev        # watches for changes during development
# npm run build    # one-time production build
```

### 5. Register Spotify app
1. Go to https://developer.spotify.com/dashboard
2. Create an app
3. Add `http://127.0.0.1:8000/spotify/redirect` as a Redirect URI
4. Copy your Client ID and Client Secret into `music_party/settings.py`

### 6. Run the server (new terminal tab)
```bash
# From project root, with venv active:
python manage.py runserver
```

Visit http://127.0.0.1:8000

---

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/rooms/` | List all rooms |
| GET | `/api/get-room/?code=XXXXXX` | Get room by code |
| POST | `/api/create-room/` | Create a room |
| POST | `/api/join-room/` | Join a room |
| GET | `/api/user-in-room/` | Check if user is in a room |
| POST | `/api/leave-room/` | Leave current room |
| PATCH | `/api/update-room/` | Update room settings (host only) |
| GET | `/spotify/get-auth-url/` | Get Spotify login URL |
| GET | `/spotify/is-authenticated/` | Check Spotify auth status |
| GET | `/spotify/current-song/` | Get current playing song |
| PUT | `/spotify/pause/` | Pause playback |
| PUT | `/spotify/play/` | Resume playback |
| POST | `/spotify/skip/` | Vote to skip song |

---

## Features
- Create a room with a unique 6-character code
- Set guest playback permissions and votes-to-skip threshold
- Join any room with its code
- Spotify OAuth — host connects their account
- Real-time song polling (updates every second)
- Vote to skip — song skips when enough votes accumulate
- Host can update room settings live
- Guests see current song, can vote to skip, and control playback if allowed
