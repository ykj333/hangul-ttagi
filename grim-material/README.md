# 그림교구실

Reference: https://geurim-gyogu-lab.kujong.chatgpt.site
Rebuilt from observed public behavior and supplied screenshot; not a source export.
Independent Next.js 16.4 app. Run `npm ci`, `npm run dev` (port 3002).
Checks: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.

Server-only OPENAI_API_KEY and OPENAI_IMAGE_MODEL=gpt-image-2.5-flare. Private Vercel Blob store uses production project OIDC identity and BLOB_STORE_ID without a static token. Missing quota configuration fails closed.

Public users share two attempts per Korean calendar day, including failures. Immutable numbered Blob slots atomically reserve attempts before OpenAI. Boundary tests use isolated counters without paid calls. Origin and fields are validated first.

No login or cloud image library. IndexedDB keeps the latest 12 generated PNGs in the current device/browser. Download PNG for permanent storage; print uses the browser print dialog.

Vercel root: grim-material. Repository: ykj333/hangul-ttagi; branch: codex/grim-material. Never commit env files, Vercel linkage or root credentials.
