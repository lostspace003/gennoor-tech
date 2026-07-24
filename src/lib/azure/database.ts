const sql = require('mssql')

// Azure SQL Database configuration
const config = {
  server: process.env.AZURE_SQL_SERVER || 'gennoor-crm.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'gennoor-crm-db',
  user: process.env.AZURE_SQL_USER || 'gennoor-admin',
  password: process.env.AZURE_SQL_PASSWORD || '',
  port: 1433,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
}

// Database schema
export const createTables = async () => {
  const queries = [
    // Leads table
    `CREATE TABLE IF NOT EXISTS leads (
      id NVARCHAR(100) PRIMARY KEY,
      name NVARCHAR(255) NOT NULL,
      email NVARCHAR(255) NOT NULL,
      phone NVARCHAR(50),
      company NVARCHAR(255),
      designation NVARCHAR(255),
      linkedin NVARCHAR(500),
      website NVARCHAR(500),
      status NVARCHAR(50) DEFAULT 'new',
      process_status NVARCHAR(50) DEFAULT 'active',
      stage NVARCHAR(50) DEFAULT 'diagnose',
      value DECIMAL(10,2),
      score INT,
      owner NVARCHAR(255),
      source NVARCHAR(255),
      tags NVARCHAR(MAX),
      notes NVARCHAR(MAX),
      ai_research NVARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE(),
      last_activity DATETIME DEFAULT GETDATE()
    )`,

    // Documents table
    `CREATE TABLE IF NOT EXISTS lead_documents (
      id INT IDENTITY(1,1) PRIMARY KEY,
      lead_id NVARCHAR(100) FOREIGN KEY REFERENCES leads(id),
      document_type NVARCHAR(50),
      file_name NVARCHAR(255),
      file_url NVARCHAR(500),
      file_size INT,
      uploaded_by NVARCHAR(255),
      uploaded_at DATETIME DEFAULT GETDATE()
    )`,

    // Email history table
    `CREATE TABLE IF NOT EXISTS email_history (
      id INT IDENTITY(1,1) PRIMARY KEY,
      lead_id NVARCHAR(100) FOREIGN KEY REFERENCES leads(id),
      subject NVARCHAR(500),
      content NVARCHAR(MAX),
      sent_to NVARCHAR(255),
      sent_by NVARCHAR(255),
      status NVARCHAR(50),
      opened BOOLEAN DEFAULT 0,
      clicked BOOLEAN DEFAULT 0,
      sent_at DATETIME DEFAULT GETDATE()
    )`,

    // Activities table
    `CREATE TABLE IF NOT EXISTS lead_activities (
      id INT IDENTITY(1,1) PRIMARY KEY,
      lead_id NVARCHAR(100) FOREIGN KEY REFERENCES leads(id),
      activity_type NVARCHAR(50),
      description NVARCHAR(MAX),
      performed_by NVARCHAR(255),
      created_at DATETIME DEFAULT GETDATE()
    )`,

    // Follow-ups table
    `CREATE TABLE IF NOT EXISTS lead_followups (
      id INT IDENTITY(1,1) PRIMARY KEY,
      lead_id NVARCHAR(100) FOREIGN KEY REFERENCES leads(id),
      followup_type NVARCHAR(50),
      scheduled_date DATETIME,
      completed BOOLEAN DEFAULT 0,
      notes NVARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE()
    )`
  ]

  // Execute all table creation queries
  for (const query of queries) {
    await executeQuery(query)
  }
}

export async function executeQuery(query: string, params?: any[]) {
  try {
    const pool = await sql.connect(config)
    const result = await pool.request().query(query)
    return result
  } catch (error) {
    console.error('Database error:', error)
    throw error
  }
}

// CRUD Operations
export const dbOperations = {
  // Create lead
  async createLead(lead: any) {
    const query = `
      INSERT INTO leads (id, name, email, phone, company, designation, linkedin, website,
                        status, process_status, stage, value, score, owner, source, tags, notes)
      VALUES (@id, @name, @email, @phone, @company, @designation, @linkedin, @website,
              @status, @process_status, @stage, @value, @score, @owner, @source, @tags, @notes)
    `
    return await executeQuery(query, [lead])
  },

  // Get all leads
  async getLeads() {
    const query = 'SELECT * FROM leads ORDER BY created_at DESC'
    return await executeQuery(query)
  },

  // Update lead
  async updateLead(id: string, updates: any) {
    const query = `
      UPDATE leads
      SET ${Object.keys(updates).map(key => `${key} = @${key}`).join(', ')},
          updated_at = GETDATE()
      WHERE id = @id
    `
    return await executeQuery(query, { id, ...updates })
  },

  // Delete lead
  async deleteLead(id: string) {
    const query = 'DELETE FROM leads WHERE id = @id'
    return await executeQuery(query, [id])
  },

  // Bulk upload
  async bulkUpload(leads: any[]) {
    for (const lead of leads) {
      await this.createLead(lead)
    }
  }
}