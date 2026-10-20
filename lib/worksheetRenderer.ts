import { buildPracticeWorksheetCanvas } from './practiceWorksheetRenderer'
export { getWorksheetPageCount } from './practiceWorksheetRenderer'

export type WorksheetItem = { id: string; label?: string; src?: string; word?: string; name?: string }

export type WorksheetBgType = "color" | "bw"
export type WorksheetLayout = "matching" | "tracing" | "writing-rows" | "picture-rows" | "letter-focus" | "letter-find"

export interface WorksheetRenderOptions {
  left: WorksheetItem[]
  right: WorksheetItem[]
  title?: string
  bgType?: WorksheetBgType
  scaleFactor?: number
  colorBackgroundIndex?: number
  layout?: WorksheetLayout
  pageIndex?: number
  seed?: number
}

export interface WorksheetRenderResult {
  canvas: HTMLCanvasElement
  pageWidth: number
  pageHeight: number
}

const COLOR_BACKGROUNDS = [
  "/images/Worksheet bg/Colorful/worksheet_bg_1.png",
  "/images/Worksheet bg/Colorful/worksheet_bg_2.png",
  "/images/Worksheet bg/Colorful/worksheet_bg_3.png",
  "/images/Worksheet bg/Colorful/worksheet_bg_4.png",
]

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function isSmallAlphabet(src?: string) {
  return !!src && src.indexOf("/images/small-alphabets/") !== -1
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
}

async function drawWorksheetBackground(
  ctx: CanvasRenderingContext2D,
  pageWidth: number,
  pageHeight: number,
  bgType: WorksheetBgType,
  colorBackgroundIndex?: number
) {
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, pageWidth, pageHeight)
  if (bgType !== "color") return

  const idx = typeof colorBackgroundIndex === "number"
    ? Math.abs(colorBackgroundIndex) % COLOR_BACKGROUNDS.length
    : Math.floor(Math.random() * COLOR_BACKGROUNDS.length)
  try {
    const bg = await loadImage(COLOR_BACKGROUNDS[idx])
    ctx.drawImage(bg, 0, 0, pageWidth, pageHeight)
  } catch {
    // Keep the white page if a decorative background cannot load.
  }
}

export async function buildWorksheetCanvas({
  left,
  right,
  title,
  bgType = "bw",
  scaleFactor = 1,
  colorBackgroundIndex,
  layout = "matching",
  pageIndex = 0,
  seed = 1,
}: WorksheetRenderOptions): Promise<WorksheetRenderResult> {
  if (layout !== "matching") {
    return buildPracticeWorksheetCanvas({ left, right, title, bgType, scaleFactor, colorBackgroundIndex, layout, pageIndex, seed })
  }

  const rows = Math.max(left.length, right.length)
  const pageWidth = 1000
  const pageHeight = 340 + rows * 180

  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.floor(pageWidth * scaleFactor))
  canvas.height = Math.max(1, Math.floor(pageHeight * scaleFactor))

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Canvas context unavailable")
  }

  ctx.scale(scaleFactor, scaleFactor)

  await drawWorksheetBackground(ctx, pageWidth, pageHeight, bgType, colorBackgroundIndex)

  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.fillRect(40, 30, pageWidth - 80, 60)
  ctx.fillStyle = "#000"
  ctx.font = "28px serif"

  ctx.textAlign = "right"
  ctx.fillText("نام:", pageWidth - 60, 70)
  ctx.beginPath()
  ctx.moveTo(pageWidth - 120, 70)
  ctx.lineTo(pageWidth - 300, 70)
  ctx.stroke()

  ctx.textAlign = "left"
  ctx.fillText("تاریخ:", 200, 70)
  ctx.beginPath()
  ctx.moveTo(180, 70)
  ctx.lineTo(60, 70)
  ctx.stroke()

  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.fillRect(pageWidth / 2 - 300, 100, 600, 50)
  ctx.fillStyle = "#000"
  ctx.textAlign = "center"
  ctx.font = "36px serif"
  ctx.fillText(title || "ہر حرف کو اس کے جوڑے کے ساتھ ملاؤ!", pageWidth / 2, 135)

  ctx.font = "72px serif"
  ctx.textAlign = "center"

  for (let i = 0; i < rows; i++) {
    const leftItem = left[i]
    const rightItem = right[i]
    const y = 200 + i * 180

    ctx.fillStyle = "rgba(255,255,255,0.95)"
    ctx.fillRect(55, y - 5, 170, 170)
    ctx.fillRect(775, y - 5, 170, 170)

    ctx.strokeStyle = "#000"
    ctx.strokeRect(60, y, 160, 160)
    ctx.strokeRect(780, y, 160, 160)

    if (leftItem?.src && rightItem?.src) {
      try {
        const imgL = await loadImage(leftItem.src)
        if (isSmallAlphabet(leftItem.src)) {
          ctx.fillStyle = "#000"
          drawRoundedRect(ctx, 66, y + 6, 148, 148, 12)
          ctx.drawImage(imgL, 66, y + 6, 148, 148)
        } else {
          ctx.drawImage(imgL, 60, y, 160, 160)
        }

        const imgR = await loadImage(rightItem.src)
        if (isSmallAlphabet(rightItem.src)) {
          ctx.fillStyle = "#000"
          drawRoundedRect(ctx, 786, y + 6, 148, 148, 12)
          ctx.drawImage(imgR, 786, y + 6, 148, 148)
        } else {
          ctx.drawImage(imgR, 780, y, 160, 160)
        }
      } catch {
        // Ignore image draw errors and keep fallback boxes.
      }
    } else if (leftItem?.label && rightItem?.src) {
      ctx.fillStyle = "#000"
      ctx.fillText(leftItem.label, 140, y + 100)
      try {
        const imgR = await loadImage(rightItem.src)
        if (isSmallAlphabet(rightItem.src)) {
          ctx.fillStyle = "#000"
          drawRoundedRect(ctx, 786, y + 6, 148, 148, 12)
          ctx.drawImage(imgR, 786, y + 6, 148, 148)
        } else {
          ctx.drawImage(imgR, 780, y, 160, 160)
        }
      } catch {
        // Ignore image draw errors and keep fallback boxes.
      }
    } else if (leftItem?.src && rightItem?.label) {
      try {
        const imgL = await loadImage(leftItem.src)
        if (isSmallAlphabet(leftItem.src)) {
          ctx.fillStyle = "#000"
          drawRoundedRect(ctx, 66, y + 6, 148, 148, 12)
          ctx.drawImage(imgL, 66, y + 6, 148, 148)
        } else {
          ctx.drawImage(imgL, 60, y, 160, 160)
        }
      } catch {
        // Ignore image draw errors and keep fallback boxes.
      }
      ctx.fillStyle = "#000"
      ctx.fillText(rightItem.label, 860, y + 100)
    } else {
      if (leftItem?.label) {
        ctx.fillStyle = "#000"
        ctx.fillText(leftItem.label, 140, y + 100)
      }
      if (rightItem?.label) {
        ctx.fillStyle = "#000"
        ctx.fillText(rightItem.label, 860, y + 100)
      }
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.9)"
  ctx.fillRect(pageWidth / 2 - 250, pageHeight - 80, 500, 60)

  const today = new Date().toLocaleDateString("ur-PK")
  ctx.fillStyle = "#000"
  ctx.font = "14px serif"
  ctx.textAlign = "center"
  ctx.fillText(`تیاری کی تاریخ: ${today}`, pageWidth / 2, pageHeight - 50)

  ctx.font = "10px Arial"
  ctx.fillStyle = "#444"
  ctx.fillText("AlifUjala.ai", pageWidth / 2, pageHeight - 30)

  ctx.save()
  ctx.translate(pageWidth / 2, pageHeight / 2)
  ctx.rotate((-45 * Math.PI) / 180)
  ctx.font = "bold 100px serif"
  ctx.fillStyle = bgType === "bw" ? "rgba(100,100,100,0.2)" : "rgba(150,150,150,0.3)"
  ctx.textAlign = "center"
  ctx.fillText("الف اجالا", 0, 0)
  ctx.restore()

  return { canvas, pageWidth, pageHeight }
}
