"""Builds the animated picture used in email 4 of the CRM series ("Less time in the classroom").

    python scripts/email-gif.py

Writes public/email/less-classroom-time.gif (600 px wide, well under 1 MB).

Outlook on Windows shows only the FIRST frame of a GIF, so the first frame is the
finished picture with the whole message on it. The animation then replays the
second bar shrinking, for the mail apps that do animate (Gmail, Apple Mail, phones).
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 600, 250
NAVY, WHITE, MUTED, BLUE, AMBER, TRACK = (12, 20, 38), (255, 255, 255), (168, 195, 239), (37, 99, 235), (245, 158, 11), (30, 41, 66)
FONTS = Path('C:/Windows/Fonts')


def font(name: str, size: int):
    for candidate in (FONTS / name, Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if 'b' in name else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size)
    return ImageFont.load_default()


BOLD_L, BOLD, REG, SMALL = font('segoeuib.ttf', 26), font('segoeuib.ttf', 17), font('segoeui.ttf', 15), font('segoeui.ttf', 13)
LEFT, RIGHT, BAR_H = 28, W - 28, 26
FULL = RIGHT - LEFT


def frame(share: float, show_result: bool) -> Image.Image:
    """share = how much of the classroom time is left in the second bar (1.0 down to 0.4)."""
    im = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(im)
    d.text((LEFT, 20), 'Less time in the classroom', font=BOLD_L, fill=WHITE)

    d.text((LEFT, 72), 'A usual course', font=BOLD, fill=WHITE)
    d.text((RIGHT, 74), '3 to 5 days in a classroom', font=REG, fill=MUTED, anchor='ra')
    d.rounded_rectangle((LEFT, 100, RIGHT, 100 + BAR_H), 8, fill=BLUE)

    d.text((LEFT, 146), 'Lessons and labs first, trainer for questions', font=BOLD, fill=WHITE)
    d.rounded_rectangle((LEFT, 174, RIGHT, 174 + BAR_H), 8, fill=TRACK)
    d.rounded_rectangle((LEFT, 174, LEFT + int(FULL * share), 174 + BAR_H), 8, fill=AMBER)
    if show_result:
        d.text((LEFT + int(FULL * share) + 12, 174 + BAR_H / 2), 'about 60% less is our aim', font=BOLD, fill=AMBER, anchor='lm')

    d.text((LEFT, 216), 'Gennoor Tech  ·  how much you save depends on the course and the team', font=SMALL, fill=MUTED)
    return im


def main():
    final = frame(0.4, True)
    frames, times = [final], [1800]               # first frame = the whole message
    frames.append(frame(1.0, False)); times.append(700)
    steps = 18
    for i in range(1, steps + 1):                 # ease out as it shrinks
        t = i / steps
        eased = 1 - (1 - t) ** 3
        frames.append(frame(1.0 - 0.6 * eased, False)); times.append(45)
    frames.append(final); times.append(3200)

    out = Path(__file__).resolve().parent.parent / 'public' / 'email' / 'less-classroom-time.gif'
    palette = final.quantize(colors=48)
    frames = [f.quantize(palette=palette, dither=Image.Dither.NONE) for f in frames]
    frames[0].save(out, save_all=True, append_images=frames[1:], duration=times, loop=0, optimize=True, disposal=1)
    print(f'{out}  {out.stat().st_size / 1024:.0f} KB, {len(frames)} frames')


if __name__ == '__main__':
    main()
