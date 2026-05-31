'use client'

const MAX_IMAGE_DIMENSION = 2000
const TARGET_MAX_BYTES = 3.5 * 1024 * 1024
const MIN_QUALITY = 0.62

export function describeFileForUpload(file: File) {
  const sizeMb = file.size / (1024 * 1024)
  return `${file.name || 'imagem'} (${file.type || 'tipo desconhecido'}, ${sizeMb.toFixed(1)}MB)`
}

export function getUploadErrorMessage(error: unknown, file: File) {
  const reason = error instanceof Error ? error.message : String(error || 'erro desconhecido')
  return `Nao foi possivel enviar ${describeFileForUpload(file)}. Motivo: ${reason}`
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Nao foi possivel processar a imagem.'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

function targetSize(width: number, height: number, maxDimension: number) {
  const scale = Math.min(1, maxDimension / Math.max(width, height))
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file
  if (file.size <= TARGET_MAX_BYTES && Math.max(0, file.size) > 0) return file

  const img = await loadImage(file)
  let maxDimension = MAX_IMAGE_DIMENSION
  let quality = 0.82
  let bestBlob: Blob | null = null

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { width, height } = targetSize(img.naturalWidth || img.width, img.naturalHeight || img.height, maxDimension)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(img, 0, 0, width, height)

    const blob = await canvasToBlob(canvas, 'image/webp', quality)
    if (!blob) return file
    bestBlob = blob
    if (blob.size <= TARGET_MAX_BYTES || quality <= MIN_QUALITY) break

    quality = Math.max(MIN_QUALITY, quality - 0.08)
    maxDimension = Math.round(maxDimension * 0.9)
  }

  if (!bestBlob || bestBlob.size >= file.size) return file

  const safeName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([bestBlob], `${safeName}.webp`, {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}
