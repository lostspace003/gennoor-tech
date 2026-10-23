import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

// Excel upload template. Only Name is required — every other column may be
// left blank and can be filled in later inside the CRM.
export async function GET() {
  try {
    const workbook = XLSX.utils.book_new()

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
        'Company Size': 'Enterprise',
        'Function': 'IT & Tech',
        'Interest': 'Training',
        'Decision Role': 'Decision-maker',
        'Sector / Segment': 'IT Services',
        'Region': 'Asia',
        'Country': 'India',
        'City': 'Mumbai',
        'Notes': 'Met at AI summit; interested in team training',
      },
      {
        'Name': 'Ahmed Al-Rashid',
        'Email': '',
        'Phone': '+971-4-123-4567',
        'Company': 'Dubai Corporation',
        'Designation': '',
        'LinkedIn': '',
        'Website': '',
        'Priority': '',
        'Lead Type': '',
        'Company Size': 'Medium',
        'Function': 'Finance',
        'Interest': '',
        'Decision Role': '',
        'Sector / Segment': 'Banking & Finance',
        'Region': 'India',
        'Country': 'UAE',
        'City': 'Dubai',
        'Notes': 'Blank fields are fine — fill what you have',
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(sampleData)
    worksheet['!cols'] = [
      { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 25 }, { wch: 25 },
      { wch: 40 }, { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 14 },
      { wch: 18 }, { wch: 12 }, { wch: 16 }, { wch: 20 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 40 },
    ]
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads')

    const instructions = [
      ['GENNOOR CRM - EXCEL UPLOAD TEMPLATE'],
      [''],
      ['HOW TO USE'],
      ['1. Fill your leads in the "Leads" sheet (delete the two sample rows first)'],
      ['2. Keep the column headers exactly as they are'],
      ['3. Save as .xlsx and upload in the CRM (Leads page -> Upload Excel)'],
      [''],
      ['REQUIRED'],
      ['- Name: the only required field. Rows without a Name are skipped.'],
      [''],
      ['EVERYTHING ELSE IS OPTIONAL - LEAVE BLANK IF UNKNOWN'],
      ['- Email: needed later for outreach, but can be added inside the CRM'],
      ['- Phone, Company, Designation, LinkedIn, Website'],
      ['- Priority: High / Medium / Low'],
      ['- Lead Type: Large organization / Small business / Startup / Institute'],
      ['- Company Size: Small / Medium / Large / Enterprise'],
      ['- Function: IT & Tech / HR & L&D / Finance / Operations / Sales & Marketing / Leadership / Other'],
      ['- Interest: Training / Automation / Claude / Learning Studio'],
      ['- Decision Role: Decision-maker / Influencer / End-user'],
      ['- Sector / Segment, Region, Country, City, Notes'],
      [''],
      ['GOOD TO KNOW'],
      ['- Re-uploading the same sheet is safe: existing leads (matched by email,'],
      ['  or by name+company when email is blank) are refreshed, not duplicated.'],
      ['- Blank cells never overwrite data already in the CRM.'],
      ['- All imported leads start at stage "Prospect", status "New", process "Active".'],
      ['- Maximum 10,000 rows per upload.'],
    ]
    const instructionSheet = XLSX.utils.aoa_to_sheet(instructions)
    instructionSheet['!cols'] = [{ wch: 80 }]
    XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Instructions')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=GENNOOR_CRM_UPLOAD_TEMPLATE.xlsx',
      },
    })
  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 })
  }
}
