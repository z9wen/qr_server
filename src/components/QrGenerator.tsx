import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'

const DEFAULT_VALUE = 'https://zew9.com/'
const SIZES = [256, 400, 800]

function QrGenerator() {
  const [value, setValue] = useState(DEFAULT_VALUE)
  const [size, setSize] = useState(400)
  const [preview, setPreview] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const byteLength = new TextEncoder().encode(value).length

  const apiUrl = useMemo(
    () => `${window.location.origin}/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`,
    [size, value],
  )

  useEffect(() => {
    let active = true

    if (!value.trim()) {
      setPreview('')
      setError('Enter some text or a URL to generate a QR code.')
      return
    }

    QRCode.toDataURL(value, {
      width: size,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#10261f', light: '#ffffff' },
    })
      .then((result) => {
        if (active) {
          setPreview(result)
          setError('')
        }
      })
      .catch(() => {
        if (active) setError('This value is too long to encode as a QR code.')
      })

    return () => {
      active = false
    }
  }, [size, value])

  const copyApiUrl = async () => {
    await navigator.clipboard.writeText(apiUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section className="mb-16 grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-[0_24px_80px_rgba(16,38,31,0.08)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" aria-label="QR code generator">
      <div className="min-w-0 p-6 sm:p-10">
        <div className="mb-3 flex items-center justify-between gap-4">
          <label className="text-sm font-bold text-forest" htmlFor="qr-value">Content</label>
          <span className={byteLength > 2048 ? 'text-xs font-medium text-red-600' : 'text-xs font-medium text-muted'}>
            {byteLength} / 2048 bytes
          </span>
        </div>
        <textarea
          className="min-h-36 w-full max-w-full resize-y rounded-2xl border border-line bg-paper p-4 text-sm leading-6 text-forest outline-none transition focus:border-leaf focus:ring-4 focus:ring-lime/30"
          id="qr-value"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          placeholder="https://example.com/"
        />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-bold text-forest">Output size</span>
          <div className="flex rounded-xl bg-paper p-1" role="group" aria-label="QR code size">
            {SIZES.map((option) => (
              <button
                className={`rounded-lg px-4 py-2 text-xs font-bold transition ${size === option ? 'bg-forest text-white shadow-sm' : 'text-muted hover:text-forest'}`}
                key={option}
                type="button"
                onClick={() => setSize(option)}
              >
                {option}px
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-line bg-paper p-4">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-muted">API endpoint</span>
          <code className="block overflow-hidden text-ellipsis whitespace-nowrap text-xs text-leaf">{apiUrl}</code>
        </div>

        <button
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-forest px-5 py-4 text-sm font-bold text-white transition hover:bg-leaf disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={copyApiUrl}
          disabled={!value.trim() || byteLength > 2048}
        >
          {copied ? 'Copied' : 'Copy API URL'}
          <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
        </button>
      </div>

      <div className="flex min-w-0 flex-col bg-forest p-6 text-white sm:p-10">
        <div className="mb-6 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-white/60">
          <span>Live preview</span>
          <span>{size} × {size}</span>
        </div>
        <div className="grid min-h-72 flex-1 place-items-center rounded-[1.5rem] bg-white p-7 shadow-inner">
          {preview && !error ? (
            <img className="h-auto max-h-80 w-full max-w-80" src={preview} alt="Generated QR code preview" />
          ) : (
            <p className="max-w-52 text-center text-sm leading-6 text-muted">{error}</p>
          )}
        </div>
        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white/50">GET · SVG · Cached at the edge</p>
      </div>
    </section>
  )
}

export default QrGenerator
