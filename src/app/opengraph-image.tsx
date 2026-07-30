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
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #00FF88, #00D9FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              color: '#000',
            }}
          >
            ⚡
          </div>
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
