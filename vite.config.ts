import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import QRCode from 'qrcode'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

function localQrApi(): Plugin {
  return {
    name: 'local-qr-api',
    configureServer(server) {
      server.middlewares.use('/v1/create-qr-code', async (request, response, next) => {
        if (request.method === 'OPTIONS') {
          response.statusCode = 204
          response.setHeader('Access-Control-Allow-Origin', '*')
          response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
          response.end()
          return
        }

        if (request.method !== 'GET' || !request.url) {
          next()
          return
        }

        const url = new URL(request.url, 'http://localhost')
        const data = url.searchParams.get('data')
        const sizeInput = url.searchParams.get('size') ?? '400'
        const sizeMatch = sizeInput.match(/^(\d{2,4})(?:x(\d{2,4}))?$/i)
        const width = Number(sizeMatch?.[1])
        const height = Number(sizeMatch?.[2] ?? sizeMatch?.[1])

        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (!data) {
          response.statusCode = 400
          response.end(JSON.stringify({ error: 'Missing required query parameter: data' }))
          return
        }

        if (!sizeMatch || width !== height || width < 64 || width > 1200) {
          response.statusCode = 400
          response.end(JSON.stringify({ error: 'size must be square and between 64 and 1200px' }))
          return
        }

        if (Buffer.byteLength(data, 'utf8') > 2048) {
          response.statusCode = 413
          response.end(JSON.stringify({ error: 'data must not exceed 2048 bytes' }))
          return
        }

        try {
          const svg = await QRCode.toString(data, {
            type: 'svg',
            width,
            margin: 4,
            errorCorrectionLevel: 'M',
            color: { dark: '#10261fff', light: '#ffffffff' },
          })
          response.statusCode = 200
          response.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
          response.setHeader('Cache-Control', 'no-store')
          response.end(svg.replace('<svg ', '<svg style="position:fixed;inset:0;margin:auto" '))
        } catch {
          response.statusCode = 422
          response.end(JSON.stringify({ error: 'Unable to encode this value as a QR code' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localQrApi()],
})
