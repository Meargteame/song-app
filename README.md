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

## 🌐 Deployment to the Internet (Free Tier)

To deploy this full-stack application online, you need 3 components:
1. **Database:** Free cloud MongoDB database on **MongoDB Atlas**
2. **Backend API:** Hosted on **Render** / **Railway**
3. **Frontend App:** Hosted on **Vercel** / **Netlify** / **Render**

---

### Step 1: Create a Free MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (username and password).
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. In your cluster dashboard, click **Connect** → **Drivers** → Copy the connection string URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/song-app?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend (Render.com)
1. Push your code to a GitHub repository.
2. Go to [Render.com](https://dashboard.render.com/) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the following settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install -g pnpm && pnpm install && pnpm run build`
   - **Start Command:** `node dist/server.js`
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI from Step 1>`
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
6. Click **Create Web Service**. Once deployed, copy your backend URL (e.g. `https://song-app-backend.onrender.com`).

---

### Step 3: Deploy Frontend (Vercel or Netlify)

#### Option A: Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `<Your Backend Render URL, e.g. https://song-app-backend.onrender.com>`
5. Click **Deploy**.

#### Option B: Deploy both via Render Blueprint
If you connect the repo on Render using **Blueprints**, Render will automatically detect [render.yaml](file:///c:/Users/hp/Desktop/song-app/render.yaml) and deploy both the backend and frontend together. All you need to supply is your `MONGODB_URI` in the dashboard.
