import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Sample data with all required columns
    const sampleData = [
      {
        'Name': 'John Smith',
        'Email': 'john.smith@techcorp.com',
        'Phone': '+1-555-123-4567',
        'Company': 'TechCorp Solutions',
        'Designation': 'Chief Technology Officer',
        'LinkedIn': 'https://linkedin.com/in/johnsmith',
        'Website': 'https://www.techcorp.com',
        'Priority': 'High',
        'Lead Type': 'Corporate',
        'Sector / Segment': 'Technology',
        'Region': 'North America',
        'Country': 'USA',
        'City': 'San Francisco',
        'Notes': 'Interested in AI solutions'
      },
      {
        'Name': 'Sarah Johnson',
        'Email': 'sarah@innovatelabs.com',
        'Phone': '+44-20-1234-5678',
        'Company': 'Innovate Labs',
        'Designation': 'Head of Innovation',
        'LinkedIn': 'https://linkedin.com/in/sarahjohnson',
        'Website': 'https://www.innovatelabs.com',
        'Priority': 'Medium',
        'Lead Type': 'Startup',
        'Sector / Segment': 'Healthcare',
        'Region': 'Europe',
        'Country': 'UK',
        'City': 'London',
        'Notes': 'Looking for digital transformation'
      }
    ]

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(sampleData)

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 20 }, // Phone
      { wch: 25 }, // Company
      { wch: 25 }, // Designation
      { wch: 40 }, // LinkedIn
      { wch: 30 }, // Website
      { wch: 10 }, // Priority
      { wch: 15 }, // Lead Type
      { wch: 20 }, // Sector
      { wch: 15 }, // Region
      { wch: 15 }, // Country
      { wch: 15 }, // City
      { wch: 40 }  // Notes
    ]
    worksheet['!cols'] = colWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')

    // Create Instructions sheet
    const instructions = [
      ['GENNOOR CRM - EXCEL UPLOAD TEMPLATE'],
      [''],
      ['Instructions:'],
      ['1. Use the "Leads" sheet to add your data'],
      ['2. Required columns: Name, Email, Phone, Company, Designation'],
      ['3. Optional columns: LinkedIn, Website, Priority, Lead Type, Sector, Region, Country, City, Notes'],
      [''],
      ['Column Descriptions:'],
      ['• Name: Contact person\'s full name (REQUIRED)'],
      ['• Email: Valid email address (REQUIRED)'],
      ['• Phone: Contact phone number (REQUIRED)'],
      ['• Company: Organization name (REQUIRED)'],
      ['• Designation: Job title/position (REQUIRED)'],
      ['• LinkedIn: LinkedIn profile URL (optional)'],
      ['• Website: Company website URL (optional)'],
      ['• Priority: High/Medium/Low (optional)'],
      ['• Lead Type: Corporate/Startup/Enterprise/SMB (optional)'],
      ['• Sector / Segment: Industry sector (optional)'],
      ['• Region: Geographic region (optional)'],
      ['• Country: Country name (optional)'],
      ['• City: City name (optional)'],
      ['• Notes: Additional information (optional)']
    ]

    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions)
    instructionSheet['!cols'] = [{ wch: 80 }]

    // Add instructions sheet
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions')

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    // Return the file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=GENNOOR_CRM_UPLOAD_TEMPLATE.xlsx'
      }
    })

  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 })
  }
}