# Google Calendar Clone
# Calendar App (Personal Build)

This repository contains a calendar application built with TypeScript and React. It provides a modern calendar UI, calendar management, schedule (event/task) creation, and support for public holiday calendars. The app uses Firebase for authentication and Firestore for optional cloud persistence. A small server component is included to safely fetch public holiday calendars from the Google Calendar API.

This README documents how to set up and run the project locally and highlights the main parts of the stack.

![alt text](image.png)
![alt text](image-1.png)

## Features
- Create and manage calendars
- Mini monthly calendar navigation
- Event and task scheduling with a simple dialog UI
- Multiple calendar views: Day, Week, 4 Days, Month
- External public holiday calendars (fetch via Google Calendar API)
- User authentication (Firebase) and optional Firestore sync

## Architecture overview
- Frontend: React + TypeScript (Create React App), SCSS for styling
- Backend: small Express server (TypeScript) that calls Google Calendar API
- Authentication & persistence: Firebase Auth + Firestore (client-side SDK)

High-level flow:
- The React client renders the calendar UI and communicates with the small server for holiday data at `/api/:region`.
- Authenticated users have their calendars/schedules saved to Firestore; unauthenticated users use localStorage as a fallback.

## Quickstart — local development (Windows / PowerShell)

Prerequisites:
- Node.js (v18+ recommended)
- npm (bundled with Node)

1) Clone the repo and install dependencies for Frontend and backend:

```powershell
cd "C:\path\to\google-calendar-clone-main\Frontend"
npm install

cd "C:\path\to\google-calendar-clone-main\backend"
npm install
```

2) Environment variables

-- Frontend: create `Frontend/.env` (and `Frontend/.env.development` if you want) and set the holiday API url used by the Frontend. Example:

```dotenv
REACT_APP_HOLIDAY_API_URL=http://localhost:5000/api
```

-- Backend: create `backend/.env` with Google API settings. Minimal example:

```dotenv
API_KEY=YOUR_GOOGLE_API_KEY
CALENDAR_ID=holiday@group.v.calendar.google.com
CALENDAR_REGION=en.usa
PORT=4000
```

Note: enable the Google Calendar API in Google Cloud Console and create an API key for the server.

3) Start the backend (runs on the port provided in `backend/.env` or default 5000):

```powershell
cd "C:\path\to\google-calendar-clone-main\backend"
npm run dev
```

4) Start the Frontend dev server:

```powershell
cd "C:\path\to\google-calendar-clone-main\Frontend"
npm start
```

Open http://localhost:3000 in your browser.

## Detailed setup (step-by-step)
The following steps walk you through setting up the project from scratch, including creating a Firebase project and a Google API key for the holiday calendar integration.

1) Clone repository

```powershell
# choose a directory and clone
git clone <repo-url> google-calendar-clone
cd google-calendar-clone
```

2) Install dependencies

```powershell
# Frontend
cd .\Frontend
npm install

# backend
cd ..\backend
npm install
```

3) Create backend environment variables (`backend/.env`)

Create a file named `.env` inside the `backend` folder. At minimum set:

```dotenv
API_KEY=YOUR_GOOGLE_API_KEY
CALENDAR_ID=holiday@group.v.calendar.google.com
CALENDAR_REGION=en.usa
PORT=5000
```

Notes:
- `API_KEY`: create in Google Cloud Console (see steps below). This is used by the server to call Google Calendar API.
- `CALENDAR_ID`: for public holiday calendars this is usually `holiday@group.v.calendar.google.com`.
- `CALENDAR_REGION`: optional region code used by the server to select built-in holiday calendars.

4) Create Frontend environment variables (`Frontend/.env`)

Create a `.env` file in the `Frontend` folder with the holiday API URL that points to your running backend (the Frontend uses this to fetch holidays):

```dotenv
REACT_APP_HOLIDAY_API_URL=http://localhost:5000/api
```

5) Firebase setup (optional but recommended for user sign-in & sync)

- Go to https://console.firebase.google.com and create a new Firebase project.
- In the Firebase console add a new Web app and copy the Firebase config object (apiKey, authDomain, projectId, etc.).
- Replace the config object in `Frontend/src/firebase.config.ts` with your app values or update the file accordingly.

Enable Authentication providers (if you want Google sign-in):
- In the Firebase console go to Authentication → Sign-in method → enable Google provider and configure the consent screen.

Enable Firestore:
- In the console, go to Firestore Database and create a database in the region of your choice. Use test mode while developing, but add security rules before production.

Security rules suggestion (development only):

```text
// very permissive for development only — lock down in production
service cloud.firestore {
	match /databases/{database}/documents {
		match /{document=**} {
			allow read, write: if request.auth != null;
		}
	}
}
```

6) Create a Google API key (for the backend)

- Open Google Cloud Console: https://console.cloud.google.com/
- Create (or select) a project.
- Enable the Google Calendar API in "APIs & Services" → "Library" → search for "Google Calendar API" and enable it.
- Go to "Credentials" → Create credentials → API key. Restrict the key to the server IP/domain in production and restrict to the Calendar API.
- Copy the API key into `backend/.env` as `API_KEY`.

7) Start the backend and Frontend

Start the backend (in one terminal):

```powershell
cd .\backend
npm run dev
```

Start the Frontend (in another terminal):

```powershell
cd .\Frontend
npm start
```

Open http://localhost:3000 in your browser. The Frontend will call the backend (proxy configured in Frontend `package.json`) when you request holiday events.

8) Build for production

```powershell
cd .\Frontend
npm run build

# then serve the build folder using your preferred static hosting or copy it into a Node/express static host
```

9) Common troubleshooting
	- Make sure the backend is running on the port you set in `backend/.env` (default 5000).
	- Confirm `REACT_APP_HOLIDAY_API_URL` points at `http://localhost:5000/api`.
	- Check that your `API_KEY` is valid and the Calendar API is enabled for that project.
	- Check the backend logs for the exact Google API error.
	- Confirm backend has `cors()` enabled (backend code already includes it). Make sure the request originates from the expected host during development.
	- Make sure you are using a compatible Node version (Node 18+ recommended) and run `npm install` to update types.

10) Optional: Deploy backend as serverless (Vercel)

If you'd like, I can add an automated `dev` PowerShell script that installs dependencies and starts both Frontend and backend with one command, or I can walk you through creating Firebase credentials step-by-step and updating `Frontend/src/firebase.config.ts` securely.

## Config & important files
- Frontend entry: `Frontend/src/index.tsx`, main app `Frontend/src/App.tsx`
- Firebase config (Frontend): `Frontend/src/firebase.config.ts` — if you want to use your own Firebase project replace the values here.
- Holiday Frontend helper: `Frontend/src/api/holiday.ts` — calls the backend endpoint configured in `REACT_APP_HOLIDAY_API_URL`.
- Backend: `backend/server/server.ts` — Express app that uses `@googleapis/calendar`.

## Tech stack (explicit)
- React 18 + React DOM
- TypeScript on client and server
- Create React App (react-scripts)
- SCSS / Sass for styling
- Firebase (Auth + Firestore)
- Express (server) + ts-node-dev (dev)
- Google Calendar Node client (`@googleapis/calendar`)
- dayjs for date handling
- react-draggable and react-select for UI interactions

## Development tips
- To see holiday data in the UI you must run the backend and set a valid `API_KEY` in `backend/.env`.
-- If you don't want to use Firebase, the app will still work with localStorage for a single device — you can remove the Firebase provider from `Frontend/src/index.tsx` and adjust the store initialization.

## License & attribution
This repository is a personal project. It uses third-party data and icon assets (see `Frontend/src/assets`) — make sure to check each asset's license if you reuse them in a public/released product.

