
# Potencializa

**Digital Marketing & Social Media Platform**

Potencializa is a modern, responsive digital marketing platform designed to showcase services, pricing plans, case studies and social media content in one place.

The platform focuses on helping businesses strengthen their digital presence, communicate their value and present their services through a professional and intuitive online experience.

## Project Overview

An independent Full Stack project developed to create a complete digital experience for a digital marketing and social media company.

The platform combines a responsive frontend with backend integrations to display social media content automatically.

## Features

- Responsive landing page (desktop, tablet and mobile).
- Services and pricing sections.
- Case studies and results presentation.
- Instagram Reels integration.
- Automatic YouTube video integration.
- Social media content sections.
- Contact modal and CTA interactions.
- Light and dark theme support.
- Reusable React components.
- Scroll-based UI interactions.
- REST API integration.
- Dynamic social media content retrieval.

## Technologies

### Frontend
- React
- JavaScript
- Vite
- HTML5
- CSS3
- Font Awesome
- Swiper

### Backend
- Node.js
- Express.js
- REST API
- CORS
- Dotenv

### External APIs
- YouTube Data API v3
- Instagram API

### Tools & Deployment
- Git
- GitHub
- GitHub Pages
- Render
- Vercel

## Project Architecture

The application is divided into two main components:

**Frontend:** React application responsible for the user interface, responsive layouts, interactions and content presentation.

**Backend:** Node.js and Express server responsible for handling API requests and retrieving social media content from external services.

The frontend communicates with the backend through REST API endpoints.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/youtube/playlist` | Retrieves YouTube channel videos |
| GET | `/api/instagram/reels` | Retrieves Instagram Reels |

## Environment Variables

### Frontend

Configure the frontend API URL:

```env
VITE_API_URL=https://potencializa.onrender.com
```

For local development:

```env
VITE_API_URL=http://localhost:3001
```

### Backend

Configure the following environment variables in the backend hosting platform:

```env
PORT=3001
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_HANDLE=@edilenemagalhaesmendel
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
INSTAGRAM_USER_ID=your_instagram_user_id
FRONTEND_ORIGIN=https://potencializavideos.com
CORS_ORIGIN=
```

`YOUTUBE_CHANNEL_HANDLE` is optional if the backend already provides a default channel.

**Security:** API keys and access tokens must remain exclusively on the backend. Never expose them in frontend code or commit them to GitHub.

## Local Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Start the backend in a separate terminal:

```bash
npm start
```

Build the frontend:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

### Frontend — GitHub Pages

The project uses Vite with the following base path:

`/Potencializa/`

To build and publish the frontend:

```bash
npm run deploy
```

This command generates the production build and publishes the contents of `dist/` to the `gh-pages` branch.

GitHub Pages configuration:

1. Open repository Settings.
2. Select Pages.
3. Set Source to Deploy from a branch.
4. Select `gh-pages`.
5. Select `/ (root)`.
6. Save the configuration.

### Backend — Render

The backend is hosted on Render.

Recommended configuration:

- Runtime: Node.js
- Root Directory: repository root
- Build Command: `npm install`
- Start Command: `npm start`

Configure the backend environment variables in the Render dashboard.

Backend URL:

https://potencializa.onrender.com

Enable automatic deployment from the connected GitHub branch.

### Vercel

Vercel has also been used for frontend deployment and testing.

If deploying through Vercel, configure:

```env
VITE_API_URL=https://potencializa.onrender.com
```

## Live Project

**Website:** https://potencializavideos.com


## Repository

https://github.com/lucashenrique1908/Potencializa

## Project Status

**In Development**

The project is being progressively improved with new features, integrations and refinements to the user experience.

---

Developed as an independent Full Stack project.
