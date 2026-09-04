# Song Management App 🎵

A full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. The application provides complete CRUD operations for managing songs alongside real-time aggregated metrics across genres, artists, and albums.

---

## Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **State Management:** Redux Toolkit (RTK)
- **Side Effects / Async:** Redux-Saga
- **HTTP Client:** Axios
- **Styling:** Emotion (`@emotion/react`, `@emotion/styled`)

### Backend
- **Runtime:** Node.js + Express + TypeScript
- **Database:** MongoDB via Mongoose
- **API Architecture:** RESTful API with MongoDB Aggregation Pipelines

---

## Features

- **CRUD Operations:** Create, Read, Update, and Delete songs.
- **Genre Filtering:** Filter the song catalog by genre dynamically.
- **Analytics Dashboard:** Aggregates total songs, songs per genre, songs per artist, and albums per artist.
- **Predictable State Flow:** Strict separation of UI, business logic, and API calls using Redux Toolkit slices and Redux-Saga side-effect runners.

---

## Project Structure

```text
song-app/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection logic
│   │   ├── controllers/    # Request and response handling
│   │   ├── models/         # Mongoose schema definitions
│   │   ├── routes/         # Express endpoint definitions
│   │   ├── services/       # Database queries & aggregation pipelines
│   │   ├── types/          # Backend TypeScript interfaces
│   │   └── server.ts       # Server entry point
│   ├── .env                # Backend environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API client functions
│   │   ├── components/     # UI components (Navbar, Modal, Cards, Stats)
│   │   ├── store/
│   │   │   ├── sagas/      # Redux-Saga workers and watchers
│   │   │   ├── slices/     # Redux Toolkit reducers and actions
│   │   │   ├── hooks.ts    # Typed useDispatch and useSelector
│   │   │   └── index.ts    # Redux store configuration
│   │   ├── types/          # Frontend TypeScript definitions
│   │   ├── App.tsx         # Main application container
│   │   ├── main.tsx        # React root & Redux Provider setup
│   │   └── styles.ts       # Global styles and Emotion theme
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md

## API Reference

All requests to `/api/songs` accept and return JSON payloads.

| Method | Endpoint | Description | Payload / Query |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/songs` | Fetch all songs | Optional query: `?genre=Rock` |
| `GET` | `/api/songs/:id` | Fetch a single song by MongoDB ID | None |
| `POST` | `/api/songs` | Create a new song record | `{ "title": "string", "artist": "string", "album": "string", "genre": "string" }` |
| `PATCH` | `/api/songs/:id` | Update an existing song record | Partial fields of a song |
| `DELETE`| `/api/songs/:id` | Remove a song by ID | None |
| `GET` | `/api/songs/statistics` | Retrieve aggregated catalog statistics | None |

---
