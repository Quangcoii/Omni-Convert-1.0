"""Creates the sample files used by tools/ui-harness/run2.cjs in /tmp/fx. Needs Pillow and reportlab: pip install pillow reportlab"""
import os, random, hashlib
from PIL import Image, ImageDraw
from reportlab.pdfgen import canvas
os.makedirs('/tmp/fx', exist_ok=True); os.chdir('/tmp/fx'); random.seed(3)
im = Image.new('RGBA', (300, 200), (0, 0, 0, 0)); ImageDraw.Draw(im).ellipse((50, 30, 250, 170), fill=(228, 119, 145, 255)); im.save('test.png')
ph = Image.new('RGB', (1200, 800)); px = ph.load()
for y in range(800):
    for x in range(1200): px[x, y] = ((x * 255 // 1200 + random.randint(0, 60)) % 256, (y * 255 // 800 + random.randint(0, 60)) % 256, random.randint(0, 255))
ph.save('photo.jpg', quality=95); ph.crop((0, 0, 400, 300)).save('pic.webp', quality=90)
open('fake.png', 'wb').write(b'this is not an image'); open('heic.jpg', 'wb').write(b'\x00\x00\x00\x18ftypheic' + b'\x00' * 40)
open('big.png', 'wb').write(b'\x89PNG\r\n\x1a\n' + b'\x00' * (31 * 1024 * 1024)); open('fake.pdf', 'wb').write(b'%PDF-garbage not a pdf')
for name, sizes in (('a.pdf', [(200, 300), (210, 300), (220, 300)]), ('b.pdf', [(400, 300), (410, 300)])):
    c = canvas.Canvas(name)
    for i, (w, h) in enumerate(sizes): c.setPageSize((w, h)); c.drawString(20, 20, f'{name} page {i + 1}'); c.showPage()
    c.save()
open('data.csv', 'w').write('name,age,city\nAnn,31,Hue\nBob,25,"Da Nang, VN"\nann,31,Hue\n'); open('hashme.bin', 'wb').write(bytes(range(256)) * 10)
print('fixtures ready; sha256(hashme.bin) =', hashlib.sha256(open('hashme.bin', 'rb').read()).hexdigest())
