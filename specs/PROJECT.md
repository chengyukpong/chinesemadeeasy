# Project: Chinese Made Easy

## Description

A todo list web application with Google SSO authentication and real-time Firestore persistence. Each user has their own private todo list.

## Firebase Config

- **Firestore:** [View details + setup procedures](FIRESTORE.md)

Config is loaded at runtime from `/config.json`. See [Environment Setup](#environment-setup) for details.

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | ^19.2.6 | UI framework |
| Zustand | ^5.0.14 | State management |
| Firebase | ^9.23.0 | Backend (Auth + Firestore) |
| Vite | ^8.0.12 | Build tool |
| Vitest | ^4.1.8 | Test runner |

## Environment Setup

1. Clone repo
2. `npm install`
3. Copy `config.example.json` to `public/config.json`
4. Fill in your Firebase config in `public/config.json`
5. `npm run dev`

## Environments

| Environment | Config | URL |
|-------------|--------|-----|
| Dev | `public/config.json` (local) | localhost:5173 |
| UAT | Deployed `config.json` | uat.example.com |
| Prod | Deployed `config.json` | example.com |

## Deployment

- `npm run build` produces `dist/` folder (single build for all envs)
- Each environment serves its own `config.json` alongside the build
- No rebuild needed when switching environments
- Firestore rules must be deployed separately via Firebase CLI

## Config Format

`public/config.json` (gitignored):
```json
{
  "firebase": {
    "apiKey": "AIzaSy...",
    "authDomain": "your-project.firebaseapp.com",
    "projectId": "your-project-id",
    "storageBucket": "your-project.appspot.com",
    "messagingSenderId": "123456789",
    "appId": "1:123456789:web:abc123",
    "measurementId": "G-XXXXXXXXXX"
  }
}
```

`config.example.json` (tracked in git) — template for other developers.
