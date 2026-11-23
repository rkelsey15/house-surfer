// Photo helpers for Snap a house. Everything happens in the browser.

export const MAX_SIDE = 1200
export const MAX_FILE_BYTES = 30 * 1024 * 1024

// The size a photo shrinks to: longest side at most `max`, never enlarged.
export function fitWithin(width, height, max = MAX_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('unreadable'))
    img.src = url
  })
}

// Redraws the photo on a canvas at up to 1200 px and saves it as a new JPEG.
// A canvas copy carries only pixels, so GPS and other hidden camera data
// (EXIF) in the original file do not come along.
export async function shrinkImage(file, max = MAX_SIDE) {
  if (!file || !(file.type || '').startsWith('image/')) throw new Error('not-image')
  if (file.size > MAX_FILE_BYTES) throw new Error('too-big')
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, max)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    return await canvasToJpeg(canvas)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function canvasToJpeg(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('encode'))), 'image/jpeg', 0.85)
  })
}

// A drawn stand-in for a photo, for visitors on a laptop with no house photo
// handy. It is 1600 x 1200 on purpose, so it goes through the same shrinking
// as a real photo. It is a drawing, and says so in the corner.
export async function makeSamplePhoto() {
  const W = 1600
  const H = 1200
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const c = canvas.getContext('2d')

  const sky = c.createLinearGradient(0, 0, 0, 760)
  sky.addColorStop(0, '#9ccbe6')
  sky.addColorStop(1, '#e4f1f7')
  c.fillStyle = sky
  c.fillRect(0, 0, W, H)

  // Lawn, sidewalk, street
  c.fillStyle = '#8fbf7f'
  c.fillRect(0, 760, W, 200)
  c.fillStyle = '#cfcabd'
  c.fillRect(0, 930, W, 90)
  c.fillStyle = '#6d7370'
  c.fillRect(0, 1020, W, 180)
  c.fillStyle = '#e9e3b5'
  for (let x = 40; x < W; x += 260) c.fillRect(x, 1100, 130, 10)

  // Tree
  c.fillStyle = '#6b4a35'
  c.fillRect(1290, 540, 34, 260)
  c.fillStyle = '#5f9a57'
  for (const [x, y, r] of [[1307, 470, 120], [1240, 540, 90], [1375, 545, 95]]) {
    c.beginPath()
    c.arc(x, y, r, 0, Math.PI * 2)
    c.fill()
  }

  // Craftsman-style house: body, roof, porch, windows, door
  c.fillStyle = '#d9c39a'
  c.fillRect(330, 430, 640, 340)
  c.fillStyle = '#5a3a2c'
  c.beginPath()
  c.moveTo(290, 440)
  c.lineTo(650, 250)
  c.lineTo(1010, 440)
  c.closePath()
  c.fill()
  c.fillStyle = '#7b5a43'
  c.fillRect(330, 600, 640, 30)
  c.fillStyle = '#f6f3ea'
  c.fillRect(400, 480, 130, 110)
  c.fillRect(770, 480, 130, 110)
  c.fillStyle = '#7fa6bd'
  c.fillRect(410, 490, 110, 90)
  c.fillRect(780, 490, 110, 90)
  c.fillStyle = '#4b2f24'
  c.fillRect(600, 560, 100, 210)
  c.fillStyle = '#f2ede0'
  c.fillRect(560, 630, 18, 140)
  c.fillRect(722, 630, 18, 140)
  c.fillStyle = '#6b4a35'
  c.fillRect(530, 600, 240, 22)
  // Steps and path
  c.fillStyle = '#bdb7a8'
  c.fillRect(590, 770, 120, 28)
  c.fillRect(560, 798, 180, 28)
  c.fillRect(600, 826, 100, 110)

  // Label
  c.fillStyle = 'rgba(0, 0, 0, .55)'
  c.fillRect(0, H - 60, 360, 60)
  c.fillStyle = '#ffffff'
  c.font = '600 28px system-ui, sans-serif'
  c.fillText('Sample drawing, not a real home', 20, H - 22)

  return canvasToJpeg(canvas)
}
