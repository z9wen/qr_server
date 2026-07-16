# QR Server

A small QR code API and test interface designed for Cloudflare Pages.

## API

```text
GET /v1/create-qr-code/?size=400x400&data=https%3A%2F%2Fexample.com
```

The response is an SVG image with edge-cache headers. `size` accepts a square
value from 64 to 1200 pixels, and `data` is limited to 2048 UTF-8 bytes.

## Local development

```bash
npm install
npm run dev
```

The Vite development server provides both the interface and the QR endpoint on
port `5173`, so no second local process or Wrangler command is required.

## Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions` (detected automatically)
- Custom domain: `api-qr-server.zew9.com`

After deployment, the endpoint is compatible with the existing QR Server URL
shape:

```text
https://api-qr-server.zew9.com/v1/create-qr-code/?size=400x400&data=...
```
