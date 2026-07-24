const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function uploadLeadsToAzure() {
  try {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      console.log('❌ Azure Storage connection string not found in environment');
      console.log('📝 File saved locally at: data/Gennoor_Master_Leads_166.xlsx');
      return;
    }

    // Create blob service client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Create container if it doesn't exist
    const containerName = 'crm-data';
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Create container with public access
    await containerClient.createIfNotExists({
      access: 'blob'
    });
    console.log(`✅ Container '${containerName}' ready`);

    // Upload the Excel file
    const fileName = 'Gennoor_Master_Leads_166.xlsx';
    const filePath = path.join(__dirname, '..', 'data', fileName);
    const blobName = `leads/${fileName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload with metadata
    const uploadOptions = {
      blobHTTPHeaders: {
        blobContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      },
      metadata: {
        uploadedBy: 'admin',
        leadCount: '166',
        createdDate: new Date().toISOString()
      }
    };

    const fileBuffer = fs.readFileSync(filePath);
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);

    const fileUrl = blockBlobClient.url;

    console.log('✅ File uploaded to Azure Blob Storage!');
    console.log(`📍 URL: ${fileUrl}`);
    console.log(`📊 File: ${blobName}`);
    console.log(`📦 Container: ${containerName}`);

    // Also create a backup with timestamp
    const backupName = `leads/backup/Gennoor_Master_Leads_166_${new Date().toISOString().split('T')[0]}.xlsx`;
    const backupBlobClient = containerClient.getBlockBlobClient(backupName);
    await backupBlobClient.upload(fileBuffer, fileBuffer.length, uploadOptions);
    console.log(`💾 Backup created: ${backupName}`);

    // Create a public share link info file
    const shareInfo = {
      mainFile: fileUrl,
      backup: backupBlobClient.url,
      uploadedAt: new Date().toISOString(),
      leadCount: 166,
      sheets: [
        'All Leads (166 records)',
        'High Priority (filtered)',
        'Qualified Leads (filtered)',
        'Industry Summary (pivot)',
        'Statistics (metrics)'
      ],
      accessInfo: 'This file contains 166 pre-populated leads for Gennoor CRM. Upload using admin@gennoor.com account.'
    };

    const infoBlob = containerClient.getBlockBlobClient('leads/README.json');
    await infoBlob.upload(
      Buffer.from(JSON.stringify(shareInfo, null, 2)),
      JSON.stringify(shareInfo).length,
      { blobHTTPHeaders: { blobContentType: 'application/json' } }
    );

    console.log(`📄 Info file created: ${infoBlob.url}`);

  } catch (error) {
    console.error('Error uploading to Azure:', error.message);
    console.log('📝 File is saved locally at: data/Gennoor_Master_Leads_166.xlsx');
  }
}

uploadLeadsToAzure();