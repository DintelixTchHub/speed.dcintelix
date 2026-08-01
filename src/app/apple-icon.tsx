import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="180"
          height="180"
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
      </div>
    ),
    {
      ...size,
    }
  )
}
