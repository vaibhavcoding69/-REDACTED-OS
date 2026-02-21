// Color palette for user avatars
const PALETTE = [
  '#0078d4',
  '#107c10',
  '#5c2d91',
  '#d83b01',
  '#00b4d8',
  '#e74856',
]

/**
 * Pick a color from the palette based on the user's name
 */
function pickColor(name) {
  const code = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PALETTE[code % PALETTE.length]
}

/**
 * Get user initials from name (e.g., "John Doe" -> "JD")
 */
function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * UserAvatar component - displays user avatar with initials
 */
export default function UserAvatar({ name = 'User', size = 80 }) {
  const bg = pickColor(name)
  const ini = initials(name)

  return (
    <div
      className="user-avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: '600',
        color: 'white',
        letterSpacing: '0.02em',
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
        border: '3px solid rgba(255,255,255,0.25)',
        marginBottom: '0.6rem',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {ini}
    </div>
  )
}

