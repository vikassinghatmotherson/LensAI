import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button } from '../common/Button'
import type { ImageAsset, AnalysisResult } from '../../types'

interface UploadImageProps {
  onAnalyze: (result: AnalysisResult) => void
}

const mockAnalysis: AnalysisResult = {
  imageType: 'Restaurant Receipt',
  detectedObjects: ['Receipt', 'Food', 'Table'],
  extractedText: ['ABC Restaurant', 'Butter Chicken', '₹450', 'Total ₹590'],
  dominantColors: ['Brown', 'White', 'Black'],
  aiDescription: 'A restaurant receipt photographed on a table.',
  confidence: 96,
}

export function UploadImage({ onAnalyze }: UploadImageProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFileSelection = (file: File | null) => {
    if (!file || !file.type.startsWith('image/')) {
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    handleFileSelection(file)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0] ?? null
    handleFileSelection(file)
  }

  const handleAnalyze = () => {
    if (!selectedFile) {
      return
    }

    setIsProcessing(true)

    const timeout = window.setTimeout(() => {
      const asset: ImageAsset = {
        id: `img-${Date.now()}`,
        name: selectedFile.name,
        type: 'Document',
        size: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        status: 'Processed',
        confidence: mockAnalysis.confidence,
      }

      setIsProcessing(false)
      onAnalyze({
        ...mockAnalysis,
        imageType: selectedFile.name.includes('receipt') ? 'Restaurant Receipt' : 'Document',
      })
      console.info('Mock analysis complete', asset)
    }, 1200)

    return () => window.clearTimeout(timeout)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }
      return null
    })

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className="upload-panel">
      <div
        className={`upload-box ${isDragging ? 'dragging' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        {previewUrl ? (
          <div className="image-preview">
            <img src={previewUrl} alt="Selected preview" />
            <div className="file-meta">
              <div>
                <strong>{selectedFile?.name}</strong>
                <span>{selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}</span>
              </div>
              <button type="button" className="remove-button" onClick={removeFile}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icons">◌</div>
            <p className="upload-title">Upload an image</p>
            <p className="upload-subtitle">Drag &amp; drop or browse your files</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onInputChange}
              aria-label="Upload an image"
            />
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              Browse files
            </Button>
          </>
        )}
      </div>

      {selectedFile && (
        <div className="upload-actions">
          <Button onClick={handleAnalyze} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Analyze Image'}
          </Button>
        </div>
      )}
    </div>
  )
}
