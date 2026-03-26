import { BlobServiceClient } from '@azure/storage-blob'

function getConnectionString(): string {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING not set')
  return conn
}

export interface ContainerStats {
  name: string
  blobCount: number
  totalSizeBytes: number
  lastModified: string
}

export interface BlobInfo {
  name: string
  containerName: string
  size: number
  contentType: string
  lastModified: string
}

export async function getStorageOverview(): Promise<ContainerStats[]> {
  const blobService = BlobServiceClient.fromConnectionString(getConnectionString())
  const stats: ContainerStats[] = []

  for await (const container of blobService.listContainers()) {
    const containerClient = blobService.getContainerClient(container.name)
    let blobCount = 0
    let totalSize = 0
    let lastModified = ''

    for await (const blob of containerClient.listBlobsFlat()) {
      blobCount++
      totalSize += blob.properties.contentLength || 0
      const blobModified = blob.properties.lastModified?.toISOString() || ''
      if (blobModified > lastModified) lastModified = blobModified
    }

    stats.push({ name: container.name, blobCount, totalSizeBytes: totalSize, lastModified })
  }

  return stats
}

export async function getRecentBlobs(limit: number = 20): Promise<BlobInfo[]> {
  const blobService = BlobServiceClient.fromConnectionString(getConnectionString())
  const allBlobs: BlobInfo[] = []

  for await (const container of blobService.listContainers()) {
    const containerClient = blobService.getContainerClient(container.name)
    for await (const blob of containerClient.listBlobsFlat()) {
      allBlobs.push({
        name: blob.name,
        containerName: container.name,
        size: blob.properties.contentLength || 0,
        contentType: blob.properties.contentType || 'unknown',
        lastModified: blob.properties.lastModified?.toISOString() || '',
      })
    }
  }

  return allBlobs.sort((a, b) => b.lastModified.localeCompare(a.lastModified)).slice(0, limit)
}
