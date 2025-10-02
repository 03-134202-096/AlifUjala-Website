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
  const [bgType, setBgType] = useState<"color" | "bw">("color")

  const handleDownload = async () => {
    // 🔹 Step 1: Check with backend if user can download
    const res = await fetch("/api/download", { method: "POST" })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      if (res.status === 401) {
        alert(data.error || "Please sign in to download.")
        return
      }
      if (res.status === 403) {
        alert(data.error || "You have used your free downloads. Please upgrade to Premium.")
        return
      }
      alert(data.error || "An error occurred while preparing the download.")
      return
    }

    // 🔹 Step 2: Continue if backend allowed
    if (!left.length || !right.length) return

    const rows = left.length
    const W = 1000
    const H = 340 + rows * 180

    const cvs = document.createElement("canvas")
    cvs.width = W
    cvs.height = H
    const ctx = cvs.getContext("2d")
    if (!ctx) return

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
        ctx.drawImage(bg, 0, 0, W, H)
      } catch {
        ctx.fillStyle = "#fff"
        ctx.fillRect(0, 0, W, H)
      }
    } else {
      ctx.fillStyle = "#fff"
      ctx.fillRect(0, 0, W, H)
    }

    // ✅ Header
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillRect(40, 30, W - 80, 60)
    ctx.fillStyle = "#000"
    ctx.font = "28px serif"

    // Name
    ctx.textAlign = "right"
    ctx.fillText("نام:", W - 60, 70)
    ctx.beginPath()
    ctx.moveTo(W - 120, 70)
    ctx.lineTo(W - 300, 70)
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
    ctx.fillRect(W / 2 - 300, 100, 600, 50)
    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.font = "36px serif"
    ctx.fillText(title, W / 2, 135)

    // ✅ Rows
    ctx.font = "72px serif"
    ctx.textAlign = "center"
    for (let i = 0; i < rows; i++) {
      const y = 200 + i * 180
      ctx.fillStyle = "rgba(255,255,255,0.95)"
      ctx.fillRect(55, y - 5, 170, 170)
      ctx.fillRect(775, y - 5, 170, 170)

      ctx.strokeStyle = "#000"
      ctx.strokeRect(60, y, 160, 160)
      ctx.strokeRect(780, y, 160, 160)

      if (left[i].label && right[i].label) {
        ctx.fillStyle = "#000"
        ctx.fillText(left[i].label, 140, y + 100)
        ctx.fillText(right[i].label, 860, y + 100)
      } else if (left[i].src && right[i].src) {
        try {
          const imgL = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = left[i].src!
          })
          ctx.drawImage(imgL, 60, y, 160, 160)

          const imgR = await new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = right[i].src!
          })
          ctx.drawImage(imgR, 780, y, 160, 160)
        } catch (err) {
          console.error("Error loading game images:", err)
        }
      }
    }

    // ✅ Footer
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillRect(W / 2 - 250, H - 80, 500, 60)
    const today = new Date().toLocaleDateString("ur-PK")
    ctx.fillStyle = "#000"
    ctx.font = "14px serif"
    ctx.textAlign = "center"
    ctx.fillText(`تیاری کی تاریخ: ${today}`, W / 2, H - 50)
    ctx.font = "10px Arial"
    ctx.fillStyle = "#444"
    ctx.fillText("AlifUjala.ai", W / 2, H - 30)

    // ✅ Watermark
    if (bgType === "color") {
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.rotate((-45 * Math.PI) / 180)
      ctx.font = "bold 100px serif"
      ctx.fillStyle = "rgba(150,150,150,0.3)"
      ctx.textAlign = "center"
      ctx.fillText("الف اجالا", 0, 0)
      ctx.restore()
    }

    // ✅ Canvas → PDF
    const imgData = cvs.toDataURL("image/png")
    const pdf = new jsPDF("p", "pt", "a4")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const ratio = Math.min(pageWidth / W, pageHeight / H)
    const imgWidth = W * ratio
    const imgHeight = H * ratio
    const x = (pageWidth - imgWidth) / 2
    const y = 20

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
    pdf.save(filename)
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
      <button onClick={handleDownload} className="responsive-btn download-btn">
        <span className="btn-text">Download Worksheet</span>
      </button>
    </div>
  )
}
