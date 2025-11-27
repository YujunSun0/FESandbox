import { useState } from 'react'

export default function ToggleCard() {
  const [isOn, setIsOn] = useState(false)
  const [count, setCount] = useState(0)

  return (
    <div style={styles.shell}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={styles.badge}>useState</span>
          <div style={{ color: '#cbd5e1', fontSize: 13 }}>토글 + 카운트 상태 관리</div>
        </div>

        <div style={styles.indicator}>
          <div style={{ ...styles.dot, background: isOn ? '#22d3ee' : '#334155' }} />
          <div style={{ color: '#e2e8f0', fontWeight: 700 }}>{isOn ? 'ON' : 'OFF'}</div>
        </div>

        <div style={styles.actions}>
          <button style={styles.button} onClick={() => setIsOn((v) => !v)}>
            상태 토글
          </button>
          <button style={styles.button} onClick={() => setCount((n) => n + 1)}>
            카운트 +1
          </button>
        </div>

        <div style={styles.footer}>
          <span>클릭 횟수</span>
          <strong>{count}</strong>
        </div>
      </div>
    </div>
  )
}

const styles = {
  shell: {
    minHeight: '100vh',
    background: '#0f172a',
    display: 'grid',
    placeItems: 'center',
    padding: 24,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  card: {
    width: 360,
    background: '#0b1220',
    borderRadius: 14,
    border: '1px solid #1f2937',
    padding: 18,
    boxShadow: '0 20px 80px rgba(59, 130, 246, 0.24)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid #334155',
    color: '#cbd5e1',
    background: '#111827',
    fontSize: 12,
    letterSpacing: '0.2px',
  },
  indicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    background: 'linear-gradient(135deg, rgba(34,211,238,0.12), rgba(99,102,241,0.1))',
    border: '1px solid #1f2937',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    boxShadow: '0 0 0 6px rgba(34,211,238,0.12)',
  },
  actions: {
    display: 'flex',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #1d4ed8',
    background: '#1d4ed8',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: 10,
    background: '#0f172a',
    border: '1px dashed #334155',
    color: '#cbd5e1',
  },
}
