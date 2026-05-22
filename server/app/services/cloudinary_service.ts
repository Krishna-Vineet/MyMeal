import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'
import type { MultipartFile } from '@adonisjs/core/types/bodyparser'

export default class CloudinaryService {
  private configured = false

  private ensureConfig() {
    if (this.configured) {
      return
    }
    const cloudName = env.get('CLOUDINARY_CLOUD_NAME')
    const apiKey = env.get('CLOUDINARY_API_KEY')
    const apiSecret = env.get('CLOUDINARY_API_SECRET')
    if (!cloudName || !apiKey || !apiSecret) {
      return
    }
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
    this.configured = true
  }

  /**
   * Upload image: remote https URL is returned as-is; otherwise treated as
   * base64 / data URI and uploaded to Cloudinary folder `mymeal`.
   */
  public async uploadImage(fileData: string): Promise<string> {
    const trimmed = fileData.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed
    }

    this.ensureConfig()
    if (!this.configured) {
      console.warn('[Cloudinary] Missing CLOUDINARY_* env; using placeholder URL')
      return 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
    }

    const uploadPayload = trimmed.startsWith('data:') ? trimmed : `data:image/jpeg;base64,${trimmed}`

    const result = await cloudinary.uploader.upload(uploadPayload, {
      folder: 'mymeal',
      resource_type: 'image',
      overwrite: false,
    })

    return result.secure_url
  }

  /**
   * Upload an actual file object (from request.file())
   */
  public async uploadFile(file: MultipartFile): Promise<string> {
    this.ensureConfig()
    if (!this.configured) {
      console.warn('[Cloudinary] Missing CLOUDINARY_* env; using placeholder URL')
      return 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
    }

    if (!file.tmpPath) {
      throw new Error('File has no temporary path')
    }

    const result = await cloudinary.uploader.upload(file.tmpPath, {
      folder: 'mymeal',
      resource_type: 'image',
      overwrite: false,
    })

    return result.secure_url
  }

  public async deleteImage(publicId: string): Promise<boolean> {
    this.ensureConfig()
    if (!this.configured) {
      return false
    }
    try {
      await cloudinary.uploader.destroy(publicId)
      return true
    } catch {
      return false
    }
  }
}
