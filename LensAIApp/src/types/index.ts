export interface User {
  id: string
  name: string
  email: string
}

export type AnalysisStatus = 'Processed' | 'Processing' | 'Failed'

export interface DetectedObject {
  name: string
}

export interface ExtractedText {
  value: string
}

export interface ImageAsset {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: AnalysisStatus
  thumbnailUrl?: string
  confidence?: number
}

export interface AnalysisResult {
  imageType: string
  detectedObjects: string[]
  extractedText: string[]
  dominantColors: string[]
  aiDescription: string
  confidence: number
}

export interface ImageAnalysis extends ImageAsset {
  result?: AnalysisResult
}
