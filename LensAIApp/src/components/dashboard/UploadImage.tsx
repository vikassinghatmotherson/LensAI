import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button } from '../common/Button'
import type { ImageAsset, AnalysisResult } from '../../types'
import { imageUploadService } from '../../services/imageUploadService'

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
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
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

  const handleAnalyze = async () => {
    if (!selectedFile) {
      return
    }

    setIsProcessing(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Upload image to S3
      const uploadResult = await imageUploadService.uploadImage(selectedFile, (progress) => {
        setUploadProgress(Math.round(progress))
      })

      if (!uploadResult.success) {
        setError(uploadResult.error || 'Upload failed')
        setIsProcessing(false)
        return
      }

      // After successful upload, call the analysis with mock data
      // In a real app, you would send the imageId to your backend for analysis
      const asset: ImageAsset = {
        id: uploadResult.imageId,
        name: selectedFile.name,
        type: 'Document',
        size: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        status: 'Processing',
        confidence: 0,
      }

      console.info('Image uploaded successfully', {
        imageId: uploadResult.imageId,
        objectKey: uploadResult.objectKey,
        asset,
      })

      // Simulate backend analysis processing
      const analysisTimeout = window.setTimeout(() => {
        setIsProcessing(false)
        setUploadProgress(0)
        onAnalyze({
          ...mockAnalysis,
          imageType: selectedFile.name.includes('receipt') ? 'Restaurant Receipt' : 'Document',
        })
      }, 2000)

      return () => window.clearTimeout(analysisTimeout)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during upload'
      setError(errorMessage)
      setIsProcessing(false)
      setUploadProgress(0)
    }
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
          {error && (
            <div className="error-message" style={{ color: '#ef4444', marginBottom: '12px' }}>
              {error}
            </div>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress" style={{ marginBottom: '12px' }}>
              <div
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <small style={{ color: '#6b7280' }}>{uploadProgress}% uploaded</small>
            </div>
          )}
          <Button onClick={handleAnalyze} disabled={isProcessing}>
            {isProcessing
              ? uploadProgress > 0 && uploadProgress < 100
                ? 'Uploading...'
                : 'Processing...'
              : 'Analyze Image'}
          </Button>
        </div>
      )}
    </div>
  )
}
