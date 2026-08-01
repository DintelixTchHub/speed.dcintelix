import { ImageResponse } from 'next/og'

export const alt = 'DCintelix Speed Test - Premium Internet Intelligence'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            marginBottom: '20px',
          }}
        >
          <svg
            width="110"
            height="110"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#00FF88" />
                <stop offset="100%" stopColor="#00D9FF" />
              </linearGradient>
            </defs>
            <path
              d="M100 20 A80 80 0 1 1 50 165"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M99 48 L142 97 L100 97 L75 73"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M100 98 L100 140" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round" />
            <path d="M100 98 L84 118" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round" />
            <path d="M100 98 L116 121" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round" />
            <path d="M100 108 L100 146" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round" />
            <circle cx="100" cy="142" r="8" fill="#00D9FF" />
          </svg>
          <div
            style={{
              fontSize: 100,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #00FF88, #00D9FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            DCintelix
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            color: '#00D9FF',
            letterSpacing: '0.1em',
            marginBottom: '30px',
          }}
        >
          SPEED TEST
        </div>
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '40px',
          }}
        >
          Premium Internet Intelligence Platform
        </div>
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: 20,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <span>Download</span>
          <span>Upload</span>
          <span>Ping</span>
          <span>Jitter</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
