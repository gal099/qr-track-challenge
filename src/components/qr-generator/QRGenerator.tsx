'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { HexColorPicker } from 'react-colorful'
import QRCode from 'qrcode'
import { isValidUrl } from '@/lib/utils-client'

export default function QRGenerator() {
  const [targetUrl, setTargetUrl] = useState('')
  const [author, setAuthor] = useState('')
  const [authorError, setAuthorError] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    qrCodeDataUrl: string
    shortUrl: string
    analyticsUrl: string
  } | null>(null)
  const [error, setError] = useState('')
  const [showFgPicker, setShowFgPicker] = useState(false)
  const [showBgPicker, setShowBgPicker] = useState(false)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const generatePreview = useCallback(async () => {
    if (!targetUrl || !isValidUrl(targetUrl)) {
      setPreviewDataUrl(null)
      return
    }

    setIsPreviewLoading(true)
    try {
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        color: { dark: fgColor, light: bgColor },
        width: 256,
        margin: 2,
      })
      setPreviewDataUrl(dataUrl)
    } catch {
      setPreviewDataUrl(null)
    } finally {
      setIsPreviewLoading(false)
    }
  }, [targetUrl, fgColor, bgColor])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      generatePreview()
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [generatePreview])

  const validateAuthor = (value: string): string => {
    const trimmed = value.trim()
    if (!trimmed) {
      return 'Author is required'
    }
    if (trimmed.length < 2) {
      return 'Author must be at least 2 characters'
    }
    if (trimmed.length > 30) {
      return 'Author must be at most 30 characters'
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) {
      return 'Author can only contain letters, numbers, and spaces'
    }
    return ''
  }

  const handleAuthorChange = (value: string) => {
    setAuthor(value)
    const error = validateAuthor(value)
    setAuthorError(error)
  }

  const isAuthorValid = author.trim().length >= 2 &&
    author.trim().length <= 30 &&
    /^[a-zA-Z0-9\s]+$/.test(author.trim())

  const handleGenerate = async () => {
    setError('')
    setResult(null)

    if (!targetUrl) {
      setError('Please enter a URL')
      return
    }

    const authorValidationError = validateAuthor(author)
    if (authorValidationError) {
      setAuthorError(authorValidationError)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_url: targetUrl,
          author: author.trim(),
          fg_color: fgColor,
          bg_color: bgColor,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate QR code')
      }

      setResult({
        qrCodeDataUrl: data.data.qr_code_data_url,
        shortUrl: data.data.short_url,
        analyticsUrl: data.data.analytics_url,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result) return

    const link = document.createElement('a')
    link.href = result.qrCodeDataUrl
    link.download = 'qr-code.png'
    link.click()
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label
            htmlFor="url"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Target URL
          </label>
          <input
            id="url"
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* Author Input */}
        <div>
          <label
            htmlFor="author"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Author
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => handleAuthorChange(e.target.value)}
            placeholder="Your name or identifier"
            maxLength={30}
            className={`w-full rounded-lg border px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 ${
              authorError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
            }`}
          />
          {authorError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {authorError}
            </p>
          )}
        </div>

        {/* Color Pickers */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Foreground Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Foreground Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFgPicker(!showFgPicker)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <div
                  className="h-8 w-8 rounded border border-gray-300"
                  style={{ backgroundColor: fgColor }}
                />
                <span className="font-mono text-sm text-gray-700 dark:text-white">
                  {fgColor}
                </span>
              </button>
              {showFgPicker && (
                <div className="absolute left-0 top-full z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowFgPicker(false)}
                  />
                  <div className="relative">
                    <HexColorPicker color={fgColor} onChange={setFgColor} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Color
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowBgPicker(!showBgPicker)}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-600 dark:bg-gray-700"
              >
                <div
                  className="h-8 w-8 rounded border border-gray-300"
                  style={{ backgroundColor: bgColor }}
                />
                <span className="font-mono text-sm text-gray-700 dark:text-white">
                  {bgColor}
                </span>
              </button>
              {showBgPicker && (
                <div className="absolute left-0 top-full z-10 mt-2">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowBgPicker(false)}
                  />
                  <div className="relative">
                    <HexColorPicker color={bgColor} onChange={setBgColor} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </h3>
          <div className="flex min-h-[200px] items-center justify-center">
            {isPreviewLoading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Generating preview...
                </span>
              </div>
            ) : previewDataUrl ? (
              <Image
                src={previewDataUrl}
                alt="QR Code Preview"
                width={256}
                height={256}
                className="rounded-lg border border-gray-300 dark:border-gray-600"
                unoptimized
              />
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Enter a valid URL to see preview
              </p>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || !targetUrl || !isAuthorValid}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
          {loading ? 'Generating...' : 'Generate QR Code'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 rounded-lg border border-gray-200 p-6 dark:border-gray-700">
            <div className="flex justify-center">
              <Image
                src={result.qrCodeDataUrl}
                alt="Generated QR Code"
                width={512}
                height={512}
                className="rounded-lg border border-gray-300 dark:border-gray-600"
                unoptimized
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Short URL
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={result.shortUrl}
                    readOnly
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => handleCopy(result.shortUrl)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700"
                >
                  Download PNG
                </button>
                <a
                  href={result.analyticsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-center font-medium text-white hover:bg-purple-700"
                >
                  View Analytics
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
