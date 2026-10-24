"""Contact sheet of the email icons, for a quick look."""
import glob
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
fs = sorted(glob.glob(str(root / "public" / "email" / "icon-*.png")))
c = Image.new("RGB", (len(fs) * 110, 110), "white")
for i, f in enumerate(fs):
    im = Image.open(f)
    c.paste(im, (i * 110 + 7, 7), im)
c.resize((len(fs) * 220, 220)).save(r"C:\Users\losts\Desktop\studio-demo\shots\email_icons.png")
