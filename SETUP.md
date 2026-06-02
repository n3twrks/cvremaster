# Setup

## Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

## Installation

```bash
npm install
```

## Configuration

Copy the example env file and fill in your key:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

That's all that's required. The app uses `gemini-2.5-flash-lite` by default, which is cheap tier.

### Optional — change the AI model

If you want to use a different Gemini model, add these to `.env.local`:

```env
AI_MODEL_PRIMARY=gemini-2.5-flash
AI_MODEL_FALLBACK=gemini-flash-lite-latest
```

Available models: https://ai.google.dev/gemini-api/docs/models

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
npm start
```

## Deploy
You can either use it locally or deploy to Netlify/Vercel (they both have free tiers) but you will most likely have to build the backend yourself (I recommend using Supabase)
The easiest option is [Vercel](https://vercel.com) — import your GitHub repo and add `GEMINI_API_KEY` in the project environment variables and your other AI_MODEL_Keys if you use them.
