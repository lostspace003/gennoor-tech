import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Sample data with all required columns - showing proper format
    const sampleData = [
      {
        'Name': 'Rajesh Kumar',
        'Email': 'rajesh.kumar@techcorp.in',
        'Phone': '+91-98765-43210',
        'Company': 'TechCorp India',
        'Designation': 'Chief Technology Officer',
        'LinkedIn': 'https://linkedin.com/in/rajeshkumar',
        'Website': 'https://www.techcorpindia.com',
        'Priority': 'High',
        'Lead Type': 'Enterprise',
        'Sector / Segment': 'IT Services',
        'Region': 'Asia',
        'Country': 'India',
        'City': 'Mumbai',
        'Notes': 'Looking for AI transformation solutions for their 5000+ employee organization'
      },
      {
        'Name': 'Ahmed Al-Rashid',
        'Email': 'ahmed@dubaicorp.ae',
        'Phone': '+971-4-123-4567',
        'Company': 'Dubai Corporation',
        'Designation': 'Director of Digital Transformation',
        'LinkedIn': 'https://linkedin.com/in/ahmedalrashid',
        'Website': 'https://www.dubaicorp.ae',
        'Priority': 'High',
        'Lead Type': 'Corporate',
        'Sector / Segment': 'Banking & Finance',
        'Region': 'GCC',
        'Country': 'UAE',
        'City': 'Dubai',
        'Notes': 'Interested in cloud migration and data analytics platform'
      },
      {
        'Name': 'Sarah Johnson',
        'Email': 'sarah@innovatelabs.co.uk',
        'Phone': '+44-20-7946-0958',
        'Company': 'Innovate Labs UK',
        'Designation': 'Head of Learning & Development',
        'LinkedIn': 'https://linkedin.com/in/sarahjohnson',
        'Website': 'https://www.innovatelabs.co.uk',
        'Priority': 'Medium',
        'Lead Type': 'SMB',
        'Sector / Segment': 'Healthcare',
        'Region': 'Europe',
        'Country': 'United Kingdom',
        'City': 'London',
        'Notes': 'Need training programs for AI and ML technologies'
      },
      {
        'Name': 'John Doe',
        'Email': 'john.doe@globalbank.com',
        'Phone': '+1-555-123-4567',
        'Company': 'Global Bank Corp',
        'Designation': 'VP of Technology',
        'LinkedIn': '',
        'Website': 'https://www.globalbank.com',
        'Priority': 'Low',
        'Lead Type': 'Enterprise',
        'Sector / Segment': 'Banking',
        'Region': 'North America',
        'Country': 'USA',
        'City': 'New York',
        'Notes': 'Initial inquiry about cybersecurity solutions'
      },
      {
        'Name': 'Priya Sharma',
        'Email': 'priya@startupindia.in',
        'Phone': '+91-88888-99999',
        'Company': 'StartupIndia Tech',
        'Designation': 'Founder & CEO',
        'LinkedIn': 'https://linkedin.com/in/priyasharma',
        'Website': '',
        'Priority': 'Medium',
        'Lead Type': 'Startup',
        'Sector / Segment': 'EdTech',
        'Region': 'Asia',
        'Country': 'India',
        'City': 'Bangalore',
        'Notes': 'Looking for MVP development and cloud infrastructure setup'
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

    // Create Instructions sheet with validation rules
    const instructions = [
      ['GENNOOR CRM - EXCEL UPLOAD TEMPLATE'],
      ['Version 2.0 | Data Validation Enabled'],
      [''],
      ['📋 INSTRUCTIONS:'],
      ['1. Switch to the "Leads" sheet to see sample data and add your own'],
      ['2. The sample data shows the correct format - you can delete it and add your own'],
      ['3. DO NOT change column headers - keep them exactly as shown'],
      ['4. Save the file as .xlsx format before uploading'],
      [''],
      ['✅ REQUIRED COLUMNS (Must be filled):'],
      ['• Name: Contact person\'s full name (e.g., "Rajesh Kumar", "Sarah Johnson")'],
      ['• Email: Valid email with @ and . (e.g., "contact@company.com")'],
      ['• Phone: Any format accepted (e.g., "+91-98765-43210", "9876543210")'],
      ['• Company: Organization name (e.g., "TechCorp India", "StartupTech")'],
      ['• Designation: Job title (e.g., "CEO", "CTO", "Head of IT")'],
      [''],
      ['📝 OPTIONAL COLUMNS (Can be empty):'],
      ['• LinkedIn: Full LinkedIn profile URL (e.g., "https://linkedin.com/in/username")'],
      ['• Website: Company website with http/https (e.g., "https://www.company.com")'],
      ['• Priority: Must be exactly "High", "Medium", or "Low" (case-sensitive)'],
      ['• Lead Type: Options: "Enterprise", "Corporate", "SMB", "Startup", "Institute"'],
      ['• Sector / Segment: Industry (e.g., "Banking", "Healthcare", "IT Services")'],
      ['• Region: Geographic region (e.g., "Asia", "GCC", "Europe", "North America")'],
      ['• Country: Full country name (e.g., "India", "UAE", "United Kingdom")'],
      ['• City: City name (e.g., "Mumbai", "Dubai", "London")'],
      ['• Notes: Any additional information or context about the lead'],
      [''],
      ['❌ VALIDATION RULES:'],
      ['• Empty rows will be skipped automatically'],
      ['• Rows missing required fields will be rejected with error messages'],
      ['• Invalid email formats will be flagged'],
      ['• The system will show you which rows have errors before importing'],
      [''],
      ['💡 TIPS FOR SUCCESS:'],
      ['• Check the sample data in "Leads" sheet for correct format'],
      ['• Remove sample data before adding your own'],
      ['• Maximum 10,000 rows per upload'],
      ['• Use Priority field to score leads (High=80, Medium=50, Low=30 points)'],
      ['• All imported leads start in "New" status and "Diagnose" stage'],
      [''],
      ['📊 AFTER UPLOAD:'],
      ['• Valid leads will be imported immediately'],
      ['• You\'ll see a summary of processed vs skipped rows'],
      ['• Invalid rows will be listed with specific error messages'],
      ['• You can choose to import only valid rows or fix and re-upload']
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