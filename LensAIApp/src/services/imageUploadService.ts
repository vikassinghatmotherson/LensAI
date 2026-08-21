import { httpClient } from './httpClient'

const API_ENDPOINT = 'https://aptpjst739.execute-api.ap-south-1.amazonaws.com/images/upload-url'

export interface PresignedUrlResponse {
  imageId: string
  fileName: string
  contentType: string
  objectKey: string
  uploadUrl: string
  expiresIn: number
}

export interface UploadResult {
  success: boolean
  imageId?: string
  objectKey?: string
  error?: string
}

export const imageUploadService = {
  /**
   * Get a presigned URL for uploading an image to S3
   */
  async getPresignedUrl(fileName: string, contentType: string): Promise<PresignedUrlResponse> {
    try {
      const data = await httpClient.post<PresignedUrlResponse>(API_ENDPOINT, {
        fileName,
        contentType,
      })
      return data
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : 'Failed to get presigned URL'
      )
    }
  },

  /**
   * Upload a file to S3 using a presigned URL
   */
  async uploadToS3(
    file: File,
    presignedUrl: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100
            onProgress(percentComplete)
          }
        })
      }

      // Return promise that resolves when upload completes
      return new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              success: true,
            })
          } else {
            reject(
              new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`)
            )
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed: Network error'))
        })

        xhr.addEventListener('abort', () => {
          reject(new Error('Upload was cancelled'))
        })

        xhr.open('PUT', presignedUrl, true)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  },

  /**
   * Complete upload flow: get presigned URL and upload file
   */
  async uploadImage(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult & PresignedUrlResponse> {
    try {
      // Step 1: Get presigned URL
      const presignedData = await this.getPresignedUrl(file.name, file.type)

      // Step 2: Upload file to S3
      const uploadResult = await this.uploadToS3(file, presignedData.uploadUrl, onProgress)

      if (!uploadResult.success) {
        return {
          ...presignedData,
          success: false,
          error: uploadResult.error,
        }
      }

      return {
        ...presignedData,
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        imageId: '',
        fileName: file.name,
        contentType: file.type,
        objectKey: '',
        uploadUrl: '',
        expiresIn: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
      }
    }
  },
}
