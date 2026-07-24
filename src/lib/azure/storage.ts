import { BlobServiceClient } from '@azure/storage-blob'

// Azure Blob Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
const containerName = 'crm-documents'

export class AzureStorage {
  private blobServiceClient: BlobServiceClient
  private containerClient: any

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    this.containerClient = this.blobServiceClient.getContainerClient(containerName)
  }

  // Upload file to Azure Blob Storage
  async uploadFile(file: Buffer, fileName: string, mimeType: string) {
    try {
      // Create container if it doesn't exist
      await this.containerClient.createIfNotExists({ access: 'blob' })

      // Generate unique file name
      const timestamp = Date.now()
      const blobName = `${timestamp}-${fileName}`

      // Get blob client
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName)

      // Upload file
      await blockBlobClient.upload(file, file.length, {
        blobHTTPHeaders: { blobContentType: mimeType }
      })

      // Return the URL
      return blockBlobClient.url
    } catch (error) {
      console.error('Storage error:', error)
      throw error
    }
  }

  // Delete file from Azure Blob Storage
  async deleteFile(blobName: string) {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName)
      await blockBlobClient.delete()
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
  }

  // List all files in container
  async listFiles() {
    const files = []
    for await (const blob of this.containerClient.listBlobsFlat()) {
      files.push({
        name: blob.name,
        url: `${this.containerClient.url}/${blob.name}`,
        size: blob.properties.contentLength,
        lastModified: blob.properties.lastModified
      })
    }
    return files
  }

  // Generate SAS URL for temporary access
  async generateSasUrl(blobName: string, expiryMinutes: number = 60) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName)
    const sasUrl = await blockBlobClient.generateSasUrl({
      permissions: 'r',
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + expiryMinutes * 60 * 1000)
    })
    return sasUrl
  }
}

export const storage = new AzureStorage()