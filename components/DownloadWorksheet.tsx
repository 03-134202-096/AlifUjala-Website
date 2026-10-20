import React, { useMemo, useState } from "react"
import { jsPDF } from "jspdf"
import LearningIcon from "@/components/ui/LearningIcon"
import { buildWorksheetCanvas, getWorksheetPageCount, type WorksheetBgType, type WorksheetLayout, type WorksheetItem } from "@/lib/worksheetRenderer"

type Item = WorksheetItem

interface DownloadWorksheetProps {
  left: Item[]
  right: Item[]
  title?: string
  filename?: string
  bgType?: WorksheetBgType
  onBgTypeChange?: (next: WorksheetBgType) => void
  colorBackgroundIndex?: number
  showBgSelector?: boolean
  layout?: WorksheetLayout
  disabled?: boolean
  pageIndex?: number
  seed?: number
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
  layout = "matching",
  disabled = false,
  pageIndex = 0,
  seed = 1,
}: DownloadWorksheetProps) {
  const [internalBgType, setInternalBgType] = useState<WorksheetBgType>("bw")
  const [showTooltip, setShowTooltip] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState("")
  const [downloadProgress, setDownloadProgress] = useState(0)
  const totalPages = getWorksheetPageCount(layout, left.length)
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
    if (isDownloading || disabled || !left.length || (layout === "matching" && !right.length)) return
    setIsDownloading(true)
    setDownloadProgress(0)
    setDownloadError("")
    try {
      const res = await fetch("/api/download", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || "An error occurred while preparing the download.")
      }

      const format = data.format || "png"
      const resolution = data.resolution || "low"
      // Tracing dots need enough pixels to remain distinct on a printed PNG, too.
      const scaleFactor = resolution === "high" ? 2 : layout !== "matching" ? 1.5 : 0.3
      const renderPage = (nextPage: number) => buildWorksheetCanvas({
        left,
        right,
        title,
        bgType: effectiveBgType,
        scaleFactor,
        colorBackgroundIndex,
        layout,
        pageIndex: nextPage,
        seed,
      })

      if (format === "png") {
        const { canvas } = await renderPage(pageIndex)
        const link = document.createElement("a")
        link.download = filename.replace(/\.pdf$/i, totalPages > 1 ? `_page_${pageIndex + 1}.png` : ".png")
        link.href = canvas.toDataURL("image/png")
        link.click()
      } else {
        const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4", compress: true })
        const pdfPageWidth = pdf.internal.pageSize.getWidth()
        const pdfPageHeight = pdf.internal.pageSize.getHeight()
        for (let index = 0; index < totalPages; index++) {
          setDownloadProgress(index + 1)
          const { canvas, pageWidth, pageHeight } = await renderPage(index)
          if (index) pdf.addPage()
          const ratio = Math.min((pdfPageWidth - 40) / pageWidth, (pdfPageHeight - 40) / pageHeight)
          const imgWidth = pageWidth * ratio
          const imgHeight = pageHeight * ratio
          pdf.addImage(canvas.toDataURL("image/png"), "PNG", (pdfPageWidth - imgWidth) / 2, 20, imgWidth, imgHeight, undefined, "FAST")
          canvas.width = 0
        }
        pdf.save(filename)
      }
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "Could not prepare the worksheet. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="responsive-download-control">
      {showBgSelector && (
        <div className="download-bg-selector">
          <select
            aria-label="Worksheet appearance"
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
        <button
          onClick={handleDownload}
          disabled={disabled || isDownloading || !left.length || (layout === "matching" && !right.length)}
          className="responsive-btn download-btn disabled:opacity-60 disabled:cursor-wait"
        >
          <LearningIcon name="download" className="mr-2" />
          <span className="btn-text">{isDownloading
            ? totalPages > 1 ? `Preparing ${downloadProgress || 1} of ${totalPages}…` : "Preparing worksheet…"
            : totalPages > 1 ? isLoggedIn ? `Download ${totalPages}-Page PDF` : `Download Page ${pageIndex + 1}` : "Download Worksheet"}</span>
        </button>
        {totalPages > 1 && <p className="mt-1 text-xs text-slate-700 dark:text-slate-200 text-center">PNG: this page · PDF: all {totalPages} pages</p>}
        {downloadError && <p role="alert" className="mt-2 text-sm text-red-700 dark:text-red-300">{downloadError}</p>}
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
