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
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #00FF88, #00D9FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
            color: '#000',
          }}
        >
          ⚡
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
