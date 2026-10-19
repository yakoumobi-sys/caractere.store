from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"public"/"designer-mockups"
out=ROOT/"public"/"home-cutouts"
items=[
("OVERSIZED ORIGINAL",src/"tshirt_oversized_new.png"),
("OVERSIZED CUTOUT",out/"tshirt-oversized.png"),
("POLO SOURCE",src/"polo.jpg"),
]
tile=490
canvas=Image.new("RGB",(tile*3,560),(239,237,231))
d=ImageDraw.Draw(canvas)
for i,(label,path) in enumerate(items):
 im=Image.open(path).convert("RGBA")
 im.thumbnail((470,480))
 x=i*tile+(tile-im.width)//2
 y=50+(480-im.height)//2
 canvas.paste(im,(x,y),im)
 d.text((i*tile+20,20),label,fill=(30,30,30))
 if label=="OVERSIZED ORIGINAL":
  # Spot the right sleeve as captured in the raw source
  print("SOURCE DIMENSIONS",Image.open(path).size)
 else:
  print("ASSET",label,Image.open(path).size)
canvas.save(out/"_diagnostic.jpg",quality=83,optimize=True)
