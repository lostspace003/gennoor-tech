import os
import sys
import json

# Set UTF-8 encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def verify_bootcamp_integration():
    """Verify that new bootcamps are fully integrated."""
    print("🔍 BOOTCAMP INTEGRATION VERIFICATION")
    print("=" * 60)

    # Check files exist
    print("\n📁 File Verification:")
    files_to_check = [
        # Azure AI Foundry Bootcamp
        ('HTML', 'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.html'),
        ('DOCX', 'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.docx'),
        ('PDF', 'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.pdf'),
        # Applied Skills Bootcamp
        ('HTML', 'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.html'),
        ('DOCX', 'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.docx'),
        ('PDF', 'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.pdf'),
        # Public copies
        ('Public HTML', 'public/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.html'),
        ('Public PDF', 'public/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-13-Azure-AI-Foundry-Semantic-Kernel.pdf'),
        ('Public HTML', 'public/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.html'),
        ('Public PDF', 'public/Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-14-Microsoft-Applied-Skills.pdf'),
    ]

    all_exist = True
    for file_type, file_path in files_to_check:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path) / 1024  # KB
            print(f"   ✅ {file_type}: {os.path.basename(file_path)} ({size:.1f} KB)")
        else:
            print(f"   ❌ {file_type}: {os.path.basename(file_path)} NOT FOUND")
            all_exist = False

    # Check training-programs.ts integration
    print("\n📋 Database Integration:")
    ts_file = 'src/data/training-programs.ts'
    if os.path.exists(ts_file):
        with open(ts_file, 'r', encoding='utf-8') as f:
            content = f.read()
            if 'bootcamp-13' in content and 'Azure AI Foundry' in content:
                print("   ✅ Azure AI Foundry bootcamp added to training programs")
            else:
                print("   ❌ Azure AI Foundry bootcamp NOT in training programs")
                all_exist = False

            if 'bootcamp-14' in content and 'Applied Skills' in content:
                print("   ✅ Applied Skills bootcamp added to training programs")
            else:
                print("   ❌ Applied Skills bootcamp NOT in training programs")
                all_exist = False

    # Check Azure OpenAI to AI Foundry updates
    print("\n🔄 Platform Updates:")
    update_files = [
        'Gennoor-Bootcamp-Brochures/Gennoor-Bootcamp-8-Microsoft-AI-for-Developers.html',
        'src/data/training-programs.ts'
    ]

    for file_path in update_files:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                if 'Azure AI Foundry' in content:
                    print(f"   ✅ {os.path.basename(file_path)}: Updated with AI Foundry")
                else:
                    print(f"   ⚠️ {os.path.basename(file_path)}: May need AI Foundry updates")

    # Summary
    print("\n" + "=" * 60)
    if all_exist:
        print("✅ ALL VERIFICATIONS PASSED!")
        print("\n🎯 Your website now features:")
        print("   1. Azure AI Foundry & Semantic Kernel Bootcamp")
        print("   2. Microsoft Applied Skills Bootcamp")
        print("   3. Updated Azure AI platform references")
        print("\n🚀 Ready for launch!")
    else:
        print("⚠️ Some items need attention - see above")

    # Website access info
    print("\n📱 To view on website:")
    print("   1. Ensure server is running: npm run dev")
    print("   2. Visit: http://localhost:3000/training")
    print("   3. New bootcamps will appear in the list")
    print("\n💡 Marketing tip: Feature these as 'NEW' or 'EXCLUSIVE' offerings!")

if __name__ == "__main__":
    verify_bootcamp_integration()