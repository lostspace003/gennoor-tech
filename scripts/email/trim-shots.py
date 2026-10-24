"""Crop the empty page background off the bottom of the email screenshots.
python scripts/email/trim-shots.py <shots dir>"""
import glob, sys
from PIL import Image, ImageChops

for f in glob.glob(sys.argv[1].rstrip("/\\") + "/email_*_*.png"):
    if "icons" in f:
        continue
    im = Image.open(f).convert("RGB")
    bg = Image.new("RGB", im.size, im.getpixel((2, im.height - 2)))
    box = ImageChops.difference(im, bg).getbbox()
    if box:
        im.crop((0, 0, im.width, min(im.height, box[3] + 40))).save(f)
print("trimmed")
