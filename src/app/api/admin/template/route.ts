import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { LEAD_COLUMNS } from '@/lib/crm/import'

// The lead sheet to fill in and upload. Only Name is required; every other
// column may be left blank and completed later inside the CRM.
export async function GET() {
  try {
    const workbook = XLSX.utils.book_new()

    const rows = [
      {
        Name: 'Rajesh Kumar',
        Email: 'rajesh.kumar@example.com',
        Phone: '+91 98765 43210',
        Organization: 'Example Industries',
        Designation: 'Head of Learning',
        Country: 'India',
        LinkedIn: 'https://www.linkedin.com/in/example',
        Notes: 'Met at the AI summit. Wants training for 40 engineers.',
      },
      {
        Name: 'Sara Ahmed',
        Email: '',
        Phone: '',
        Organization: 'Example Bank',
        Designation: '',
        Country: 'UAE',
        LinkedIn: '',
        Notes: 'Blank cells are fine. Fill in what you have.',
      },
    ]
    const sheet = XLSX.utils.json_to_sheet(rows, { header: [...LEAD_COLUMNS] })
    sheet['!cols'] = [{ wch: 24 }, { wch: 32 }, { wch: 18 }, { wch: 28 }, { wch: 26 }, { wch: 14 }, { wch: 38 }, { wch: 50 }]
    XLSX.utils.book_append_sheet(workbook, sheet, 'Leads')

    const help = XLSX.utils.aoa_to_sheet([
      ['Gennoor CRM: lead sheet'],
      [''],
      ['1. Fill your leads in the "Leads" sheet. Delete the two sample rows first.'],
      ['2. Keep the column headings as they are.'],
      ['3. Save, then in the CRM open Leads and press Import.'],
      [''],
      ['Name is the only column you must fill. Rows without a name are skipped.'],
      ['Organization is the company the person works for. Leads are grouped by it.'],
      ['Email is needed before the email series can start. You can add it later.'],
      [''],
      ['Uploading the same sheet twice is safe. A lead that is already in the CRM'],
      ['(same email, or same name and organization) is updated, not added again,'],
      ['and blank cells never erase what is already there.'],
    ])
    help['!cols'] = [{ wch: 80 }]
    XLSX.utils.book_append_sheet(workbook, help, 'How to use')

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=Gennoor-CRM-Lead-Sheet.xlsx',
      },
    })
  } catch (error) {
    console.error('Template generation error:', error)
    return NextResponse.json({ error: 'Failed to generate the lead sheet' }, { status: 500 })
  }
}
