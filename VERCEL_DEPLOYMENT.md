# Vercel production binding

The live application is available at `https://foryoudeeps.vercel.app/`.
The custom domain `foryoudeeps.frpboy.in` currently resolves to Vercel but
returns a Vercel 404, which means it has not been assigned to this project in
the Vercel dashboard.

## One-time dashboard action

1. Open the Vercel project that deploys `frpboy/foryoudeeps`.
2. Go to **Settings → Domains**.
3. Add `foryoudeeps.frpboy.in` and assign it to the production deployment.
4. Keep the existing Vercel DNS records when Vercel confirms they are valid.
5. Wait for the domain status to become **Valid Configuration**.
6. Open `https://foryoudeeps.frpboy.in/?preview-birthday` to test the full
   birthday experience before 15 August 2026 IST.

No application configuration should be required after the domain is correctly
attached; the repository already contains Vercel headers and a production Vite
build configuration.
