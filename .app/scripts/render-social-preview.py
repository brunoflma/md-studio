"""Render the MD Studio share card using supplied Georgia and Consolas font files."""
import argparse
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--serif", type=Path, required=True)
parser.add_argument("--italic", type=Path, required=True)
parser.add_argument("--mono", type=Path, required=True)
args = parser.parse_args()
scale = 2
image = Image.new("RGB", (1280 * scale, 640 * scale), "#0A1224")
draw = ImageDraw.Draw(image)


def rect(bounds, fill=None, outline=None):
    draw.rectangle(tuple(int(v * scale) for v in bounds), fill=fill, outline=outline, width=scale)


def text(x, y, value, size, color, font):
    draw.text((x * scale, y * scale), value, font=ImageFont.truetype(str(font), size * scale), fill=color)


def diamond(x, y, r=5):
    draw.polygon([(x*scale, (y-r)*scale), ((x+r)*scale, y*scale), (x*scale, (y+r)*scale), ((x-r)*scale, y*scale)], fill="#C8A862")


rect((22, 22, 1258, 618), outline="#665F4C")
rect((32, 32, 1248, 608), outline="#263148")
diamond(78, 85, 7)
text(100, 69, "M D  S T U D I O", 22, "#C8A862", args.mono)
text(70, 188, "Seu Markdown.", 67, "#F4F1E9", args.serif)
text(70, 282, "Pronto para", 64, "#F4F1E9", args.serif)
text(70, 370, "ser lido.", 78, "#D9C08A", args.italic)
text(74, 509, "LEIA  /  EDITE  /  SALVE", 17, "#C8A862", args.mono)
text(74, 551, "Um arquivo HTML. Três modos de trabalho.", 18, "#B7C0D8", args.serif)
rect((784, 114, 1198, 520), "#0E1A33", "#665F4C")
rect((794, 124, 1188, 510), outline="#263148")
diamond(819, 151, 4)
text(836, 142, "NOTAS-DE-PESQUISA.MD", 13, "#8E9ABA", args.mono)
draw.line((784*scale, 177*scale, 1198*scale, 177*scale), fill="#344058", width=scale)
text(818, 211, "Clareza para", 34, "#F4F1E9", args.serif)
text(818, 258, "o que importa.", 37, "#D9C08A", args.italic)
text(820, 329, "Organize as ideias.", 20, "#B7C0D8", args.serif)
text(820, 367, "Revise com contexto.", 20, "#B7C0D8", args.serif)
text(820, 405, "Salve em Markdown.", 20, "#B7C0D8", args.serif)
rect((817, 459, 1165, 484), "#14213D")
text(832, 463, "PREVIEW  ·  VISUAL  ·  FONTE", 12, "#C8A862", args.mono)
text(833, 553, "CONHEÇA O PROJETO NO GITHUB", 13, "#8E9ABA", args.mono)
destination = Path(__file__).resolve().parents[2] / "docs/assets/social-preview.png"
image.resize((1280, 640), Image.Resampling.LANCZOS).save(destination, optimize=True)
print("Rendered MD Studio social preview: 1280 x 640.")
