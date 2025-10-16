import React, { useState } from "react"
import { jsPDF } from "jspdf"

type Item = { id: string; label?: string; src?: string }

interface DownloadWorksheetProps {
  left: Item[]
  right: Item[]
  title?: string
  filename?: string
}

export default function DownloadWorksheet({
  left,
  right,
  title = "ہر حرف کو اس کے جوڑے کے ساتھ ملاؤ!",
  filename = "worksheet.pdf",
}: DownloadWorksheetProps) {
  const [bgType, setBgType] = useState<"color" | "bw">("bw")
  const [showTooltip, setShowTooltip] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  // Check login status on component mount
  React.useEffect(() => {
    fetch("/api/download", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.isLoggedIn || false)
      })
      .catch(() => {
        setIsLoggedIn(false)
      })
  }, [])

  const handleDownload = async () => {
    // 🔹 Step 1: Check with backend about download permissions
    const res = await fetch("/api/download", { method: "POST" })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      alert(data.error || "An error occurred while preparing the download.")
      return
    }

    // 🔹 Step 2: Get download format and resolution based on login status
    const isLoggedIn = data.isLoggedIn || false
    const format = data.format || "png"
    const resolution = data.resolution || "low"

    // 🔹 Step 3: Continue with download
    if (!left.length || !right.length) return

    const rows = left.length
    // High resolution for logged-in users (PDF), low resolution for non-logged-in (PNG)
    const scaleFactor = resolution === "high" ? 2 : 0.5
    const baseW = 1000
    const baseH = 340 + rows * 180
    const W = baseW * scaleFactor
    const H = baseH * scaleFactor

    const cvs = document.createElement("canvas")
    cvs.width = W
    cvs.height = H
    const ctx = cvs.getContext("2d")
    if (!ctx) return

    // Scale context to fit the canvas size
    ctx.scale(scaleFactor, scaleFactor)

    // ✅ Background
    if (bgType === "color") {
      const colorBgs = [
        "/images/Worksheet bg/Colorful/worksheet_bg_1.png",
        "/images/Worksheet bg/Colorful/worksheet_bg_2.png",
        "/images/Worksheet bg/Colorful/worksheet_bg_3.png",
        "/images/Worksheet bg/Colorful/worksheet_bg_4.png",
      ]
      const chosenBg = colorBgs[Math.floor(Math.random() * colorBgs.length)]
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = src
        })
      try {
        const bg = await loadImage(chosenBg)
        ctx.drawImage(bg, 0, 0, baseW, baseH)
      } catch {
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, baseW, baseH)
      }
    } else {
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, baseW, baseH)
    }

    // ✅ Header
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillRect(40, 30, baseW - 80, 60)
    ctx.fillStyle = "#000"
    ctx.font = "28px serif"

    // Name
    ctx.textAlign = "right"
    ctx.fillText("نام:", baseW - 60, 70)
    ctx.beginPath()
    ctx.moveTo(baseW - 120, 70)
    ctx.lineTo(baseW - 300, 70)
    ctx.stroke()

    // Date
    ctx.textAlign = "left"
    ctx.fillText("تاریخ:", 200, 70)
    ctx.beginPath()
    ctx.moveTo(180, 70)
    ctx.lineTo(60, 70)
    ctx.stroke()

    // Title
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillRect(baseW / 2 - 300, 100, 600, 50)
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.font = "36px serif"
    ctx.fillText(title, baseW / 2, 135)

    // ✅ Rows
    ctx.font = "72px serif"
    ctx.textAlign = "center"
    // helper: detect small-alphabets images and draw rounded rects
    const isSmallAlphabet = (src?: string) => !!src && src.indexOf('/images/small-alphabets/') !== -1
    const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
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
    for (let i = 0; i < rows; i++) {
      const y = 200 + i * 180
      ctx.fillStyle = "rgba(255,255,255,0.95)"
      ctx.fillRect(55, y - 5, 170, 170)
      ctx.fillRect(775, y - 5, 170, 170)

      ctx.strokeStyle = "#000"
      ctx.strokeRect(60, y, 160, 160)
      ctx.strokeRect(780, y, 160, 160)

      // Prefer images when src exists on either side. Handle image/image, label/image, image/label first.
      if (left[i].src && right[i].src) {
        try {
          const imgL = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = left[i].src!
          })
          // If small-alphabet image, draw a black rounded background and inset the image
          if (isSmallAlphabet(left[i].src)) {
            ctx.fillStyle = '#000'
            drawRoundedRect(ctx, 60 + 6, y + 6, 160 - 12, 160 - 12, 12)
            ctx.drawImage(imgL, 60 + 6, y + 6, 160 - 12, 160 - 12)
          } else {
            ctx.drawImage(imgL, 60, y, 160, 160)
          }

          const imgR = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = right[i].src!
          })
          if (isSmallAlphabet(right[i].src)) {
            ctx.fillStyle = '#000'
            drawRoundedRect(ctx, 780 + 6, y + 6, 160 - 12, 160 - 12, 12)
            ctx.drawImage(imgR, 780 + 6, y + 6, 160 - 12, 160 - 12)
          } else {
            ctx.drawImage(imgR, 780, y, 160, 160)
          }
        } catch (err) {
          console.error("Error loading game images:", err)
        }
      } else if (left[i].label && right[i].src) {
        // Left is text label, right is image
        ctx.fillStyle = "#000"
        ctx.fillText(left[i].label!, 140, y + 100)
        try {
          const imgR = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = right[i].src!
          })
          if (isSmallAlphabet(right[i].src)) {
            ctx.fillStyle = '#000'
            drawRoundedRect(ctx, 780 + 6, y + 6, 160 - 12, 160 - 12, 12)
            ctx.drawImage(imgR, 780 + 6, y + 6, 160 - 12, 160 - 12)
          } else {
            ctx.drawImage(imgR, 780, y, 160, 160)
          }
        } catch (err) {
          console.error("Error loading right image for worksheet:", err)
        }
      } else if (left[i].src && right[i].label) {
        // Left is image, right is text label
        try {
          const imgL = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = left[i].src!
          })
          if (isSmallAlphabet(left[i].src)) {
            ctx.fillStyle = '#000'
            drawRoundedRect(ctx, 60 + 6, y + 6, 160 - 12, 160 - 12, 12)
            ctx.drawImage(imgL, 60 + 6, y + 6, 160 - 12, 160 - 12)
          } else {
            ctx.drawImage(imgL, 60, y, 160, 160)
          }
        } catch (err) {
          console.error("Error loading left image for worksheet:", err)
        }
        ctx.fillStyle = "#000"
        ctx.fillText(right[i].label!, 860, y + 100)
      } else if (left[i].label && right[i].label) {
        // Both are labels (no images)
        ctx.fillStyle = "#000"
        ctx.fillText(left[i].label, 140, y + 100)
        ctx.fillText(right[i].label, 860, y + 100)
      }
    }

    // ✅ Footer
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillRect(baseW / 2 - 250, baseH - 80, 500, 60)
    const today = new Date().toLocaleDateString("ur-PK")
    ctx.fillStyle = "#000"
    ctx.font = "14px serif"
    ctx.textAlign = "center"
    ctx.fillText(`تیاری کی تاریخ: ${today}`, baseW / 2, baseH - 50)
    ctx.font = "10px Arial"
    ctx.fillStyle = "#444"
    ctx.fillText("AlifUjala.ai", baseW / 2, baseH - 30)

    // ✅ Watermark (always show on both color and B&W)
    ctx.save()
    ctx.translate(baseW / 2, baseH / 2)
    ctx.rotate((-45 * Math.PI) / 180)
    ctx.font = "bold 100px serif"
    // Use slightly darker watermark for B&W to ensure visibility
    ctx.fillStyle = bgType === "bw" ? "rgba(100,100,100,0.2)" : "rgba(150,150,150,0.3)"
    ctx.textAlign = "center"
    ctx.fillText("الف اجالا", 0, 0)
    ctx.restore()

    // ✅ Download based on format
    if (format === "png") {
      // PNG download for non-logged-in users (low resolution)
      const link = document.createElement("a")
      link.download = filename.replace(".pdf", ".png")
      link.href = cvs.toDataURL("image/png")
      link.click()
    } else {
      // PDF download for logged-in users (high resolution)
      const imgData = cvs.toDataURL("image/png")
      const pdf = new jsPDF("p", "pt", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pageWidth / baseW, pageHeight / baseH)
      const imgWidth = baseW * ratio
      const imgHeight = baseH * ratio
      const x = (pageWidth - imgWidth) / 2
      const y = 20

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
      pdf.save(filename)
    }
  }

  return (
    <div className="responsive-download-control">
      <div className="download-bg-selector">
        <select
          value={bgType}
          onChange={(e) => setBgType(e.target.value as "color" | "bw")}
          className="responsive-select download-select"
        >
          <option value="color">Color</option>
          <option value="bw">Black & White</option>
        </select>
      </div>
      <div 
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => !isLoggedIn && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button onClick={handleDownload} className="responsive-btn download-btn">
          <span className="btn-text">Download Worksheet</span>
        </button>
        {showTooltip && !isLoggedIn && (
          <div 
            style={{
              position: "absolute",
              bottom: "100%",
              right: "0",
              marginBottom: "8px",
              padding: "8px 12px",
              backgroundColor: "#000000ff",
              color: "#ffffffff",
              borderRadius: "6px",
              fontSize: "11px",
              whiteSpace: "normal",
              maxWidth: "280px",
              zIndex: 1000,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              textAlign: "center",
              fontWeight: "500"
            }}
          >
            <div style={{ direction: "rtl" }}>
              اگر آپ اعلیٰ معیار (HD) میں ورک شیٹ ڈاؤن لوڈ کرنا چاہتے ہیں
              <br />
              تو براہ کرم لاگ ان کریں
            </div>
            <div style={{ fontSize: "9px", marginTop: "4px", opacity: 0.8 }}>
              (For HD quality worksheets in PDF, please login)
            </div>
            <div 
              style={{
                position: "absolute",
                bottom: "-4px",
                right: "20px",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #000000ff"
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
