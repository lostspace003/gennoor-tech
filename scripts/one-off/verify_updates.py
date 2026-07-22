import os
import sys
import glob
from datetime import datetime

# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def verify_files():
    """Verify that all PDF files were updated."""
    print("\n📊 VERIFICATION REPORT")
    print("=" * 60)

    directories = [
        'Gennoor-Bootcamp-Brochures',
        'Gennoor-Tech-Course-TOCs'
    ]

    total_docx = 0
    total_pdf = 0
    recently_updated = 0
    missing_pdfs = []

    # Get current time for comparison
    now = datetime.now()

    for directory in directories:
        dir_path = os.path.join(os.getcwd(), directory)
        print(f"\n📁 {directory}")
        print("-" * 40)

        if not os.path.exists(dir_path):
            print(f"   ⚠️ Directory not found")
            continue

        # Find all DOCX and PDF files
        docx_files = glob.glob(os.path.join(dir_path, "*.docx"))
        pdf_files = glob.glob(os.path.join(dir_path, "*.pdf"))

        total_docx += len(docx_files)
        total_pdf += len(pdf_files)

        print(f"   📄 DOCX files: {len(docx_files)}")
        print(f"   📑 PDF files: {len(pdf_files)}")

        # Check for missing PDFs
        for docx_file in docx_files:
            pdf_file = docx_file.replace('.docx', '.pdf')
            if not os.path.exists(pdf_file):
                missing_pdfs.append(os.path.basename(pdf_file))
            else:
                # Check if PDF was recently updated (within last hour)
                pdf_mtime = datetime.fromtimestamp(os.path.getmtime(pdf_file))
                time_diff = now - pdf_mtime
                if time_diff.total_seconds() < 3600:  # Updated within last hour
                    recently_updated += 1

    print("\n" + "=" * 60)
    print("📈 SUMMARY:")
    print(f"   Total DOCX files: {total_docx}")
    print(f"   Total PDF files: {total_pdf}")
    print(f"   Recently updated PDFs: {recently_updated}")

    if missing_pdfs:
        print(f"\n⚠️ Missing PDFs ({len(missing_pdfs)}):")
        for pdf in missing_pdfs:
            print(f"   - {pdf}")
    else:
        print("\n✅ All DOCX files have corresponding PDFs!")

    # Check specific certification updates
    print("\n🔍 CERTIFICATION UPDATE VERIFICATION:")
    print("-" * 40)

    files_to_check = [
        'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-8-Microsoft-AI-for-Developers.pdf',
        'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-1-AI-Transformation-Business-Leaders.pdf',
        'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-4-Data-Science-Machine-Learning.pdf'
    ]

    for file_path in files_to_check:
        if os.path.exists(file_path):
            mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
            time_diff = now - mtime
            if time_diff.total_seconds() < 3600:
                print(f"   ✅ {os.path.basename(file_path)}: Updated {int(time_diff.total_seconds() / 60)} minutes ago")
            else:
                print(f"   ℹ️ {os.path.basename(file_path)}: Last updated {mtime.strftime('%Y-%m-%d %H:%M')}")
        else:
            print(f"   ❌ {os.path.basename(file_path)}: Not found")

    print("\n✨ Verification complete!")

if __name__ == "__main__":
    verify_files()