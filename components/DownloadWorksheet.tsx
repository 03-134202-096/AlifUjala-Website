import React, { useMemo, useState } from "react"
import { jsPDF } from "jspdf"
import { buildWorksheetCanvas, type WorksheetBgType } from "@/lib/worksheetRenderer"

type Item = { id: string; label?: string; src?: string }

interface DownloadWorksheetProps {
  left: Item[]
  right: Item[]
  title?: string
  filename?: string
  bgType?: WorksheetBgType
  onBgTypeChange?: (next: WorksheetBgType) => void
  colorBackgroundIndex?: number
  showBgSelector?: boolean
}

export default function DownloadWorksheet({
  left,
  right,
  title = "ہر حرف کو اس کے جوڑے کے ساتھ ملاؤ!",
  filename = "worksheet.pdf",
  bgType,
  onBgTypeChange,
  colorBackgroundIndex,
  showBgSelector = true,
}: DownloadWorksheetProps) {
  const [internalBgType, setInternalBgType] = useState<WorksheetBgType>("bw")
  const [showTooltip, setShowTooltip] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const effectiveBgType = useMemo(() => bgType ?? internalBgType, [bgType, internalBgType])

  const handleBgTypeChange = (next: WorksheetBgType) => {
    if (typeof bgType === "undefined") {
      setInternalBgType(next)
    }
    onBgTypeChange?.(next)
  }

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
    const format = data.format || "png"
    const resolution = data.resolution || "low"

    // 🔹 Step 3: Continue with download
    if (!left.length || !right.length) return

    // High resolution for logged-in users (PDF), low resolution for non-logged-in (PNG)
    const scaleFactor = resolution === "high" ? 2 : 0.3
    const { canvas, pageWidth: worksheetPageWidth, pageHeight: worksheetPageHeight } = await buildWorksheetCanvas({
      left,
      right,
      title,
      bgType: effectiveBgType,
      scaleFactor,
      colorBackgroundIndex,
    })

    // ✅ Download based on format
    if (format === "png") {
      // PNG download for non-logged-in users (low resolution)
      const link = document.createElement("a")
      link.download = filename.replace(".pdf", ".png")
      link.href = canvas.toDataURL("image/png")
      link.click()
    } else {
      // PDF download for logged-in users (high resolution)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "pt", "a4")
      const pdfPageWidth = pdf.internal.pageSize.getWidth()
      const pdfPageHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pdfPageWidth / worksheetPageWidth, pdfPageHeight / worksheetPageHeight)
      const imgWidth = worksheetPageWidth * ratio
      const imgHeight = worksheetPageHeight * ratio
      const x = (pdfPageWidth - imgWidth) / 2
      const y = 20

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight)
      pdf.save(filename)
    }
  }

  return (
    <div className="responsive-download-control">
      {showBgSelector && (
        <div className="download-bg-selector">
          <select
            value={effectiveBgType}
            onChange={(e) => handleBgTypeChange(e.target.value as WorksheetBgType)}
            className="responsive-select download-select"
          >
            <option value="color">Color</option>
            <option value="bw">Black & White</option>
          </select>
        </div>
      )}
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
