# AI Model — Choix et configuration

## Modèle principal

```
gemini-2.5-flash-lite
```

- Input : $0.10 / 1M tokens
- Output : $0.40 / 1M tokens
- Knowledge cutoff : janvier 2025
- Stable, disponible, meilleur rapport qualité/prix

## Modèle fallback

```
gemini-flash-lite-latest
```

À utiliser uniquement si `gemini-2.5-flash-lite` retourne une erreur.  
C'est un alias qui pointe toujours vers le dernier modèle Flash-Lite disponible — il fonctionnera quoi qu'il arrive, mais il est plus cher ($0.25 input / $1.50 output).

## Pourquoi pas les autres

| Modèle | Raison d'exclusion |
|--------|-------------------|
| `gemini-2.0-flash` | Déprécié, coupé juin 2026 |
| `gemini-2.0-flash-lite` | Knowledge cutoff août 2024, sera déprécié |
| `gemini-2.5-flash` | $2.50/1M output — overkill pour du parsing CV |
| `gemini-flash-lite-latest` | Alias instable, 2.5x plus cher — fallback uniquement |

## Implémentation dans route.ts

```typescript
const MODELS = {
  primary: 'gemini-2.5-flash-lite',
  fallback: 'gemini-flash-lite-latest',
}

async function callGemini(system: string, user: string, useFallback = false) {
  const model = useFallback ? MODELS.fallback : MODELS.primary

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  )

  if (!response.ok && !useFallback) {
    // Retry automatique sur le fallback
    return callGemini(system, user, true)
  }

  return response
}
```

## Coût estimé MVP

| Action | Tokens estimés | Coût |
|--------|---------------|------|
| Parse 1 CV PDF | ~3k in / ~1k out | ~$0.0007 |
| 1 message chat | ~2k in / ~800 out | ~$0.0005 |
| 1 000 parses CV | — | ~$0.70 |
| 1 000 messages chat | — | ~$0.50 |