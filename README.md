# ONEDRAW Web Application

Official ONEDRAW marketing site and Robinhood Chain mainnet application.

## Mainnet configuration

The repository contains only public chain configuration: chain ID, public RPC, explorer URL, deployed contract addresses and deployment block. It does not contain private keys, keystores, operator automation, relayer credentials or protected RPC credentials.

## Local verification

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run preview
```

## Deploying with Vercel

1. Import this GitHub repository in Vercel.
2. Keep the detected framework as **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

`vercel.json` includes the SPA rewrite required for routes such as `/app`, `/transparency`, `/docs` and `/app/results`.

## Public protocol source

The protocol transparency repository is available at [failinginno/ONEDRAWA-Transparent](https://github.com/failinginno/ONEDRAWA-Transparent).
