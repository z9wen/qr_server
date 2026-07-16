import QRCode from 'qrcode'

const MAX_DATA_BYTES = 2048
const MIN_SIZE = 64
const MAX_SIZE = 1200

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonError(message: string, status: number) {
  return Response.json(
    { error: message },
    { status, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } },
  )
}

function parseSize(input: string | null) {
  if (!input) return 400
  const match = input.match(/^(\d{2,4})(?:x(\d{2,4}))?$/i)
  if (!match) return null

  const width = Number(match[1])
  const height = Number(match[2] ?? match[1])
  if (width !== height || width < MIN_SIZE || width > MAX_SIZE) return null
  return width
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: corsHeaders })

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url)
  const data = url.searchParams.get('data')
  const size = parseSize(url.searchParams.get('size'))

  if (!data) return jsonError('Missing required query parameter: data', 400)
  if (!size) return jsonError(`size must be square and between ${MIN_SIZE} and ${MAX_SIZE}px`, 400)
  if (new TextEncoder().encode(data).length > MAX_DATA_BYTES) {
    return jsonError(`data must not exceed ${MAX_DATA_BYTES} bytes`, 413)
  }

  try {
    const svg = await QRCode.toString(data, {
      type: 'svg',
      width: size,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#10261fff', light: '#ffffffff' },
    })

    const centeredSvg = svg.replace(
      '<svg ',
      '<svg style="position:fixed;inset:0;margin:auto" ',
    )

    return new Response(centeredSvg, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'",
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return jsonError('Unable to encode this value as a QR code', 422)
  }
}
