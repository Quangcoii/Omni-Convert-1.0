"""Independent checks of files downloaded by run2.cjs into /tmp/dl (Pillow, pypdf, OpenCV). Run after run2.cjs."""
import json, os, cv2
from PIL import Image
from pypdf import PdfReader
os.chdir('/tmp/dl'); ok, bad = [], []
def chk(n, c, d=''): (ok if c else bad).append(n if c else f'{n} -> {d}')
im = Image.open('png2jpg.jpg'); chk('png->jpg real JPEG 300x200', im.format == 'JPEG' and im.size == (300, 200)); chk('transparent corner became white', min(im.convert('RGB').getpixel((2, 2))) > 240)
chk('jpg->png real PNG 1200x800', Image.open('jpg2png.png').format == 'PNG' and Image.open('jpg2png.png').size == (1200, 800)); chk('webp->jpg real JPEG', Image.open('webp2jpg.jpg').format == 'JPEG' and Image.open('webp2jpg.jpg').size == (400, 300))
chk('jpg->webp real WebP', Image.open('jpg2webp.webp').format == 'WEBP'); chk('compressor output < 60% of original', os.path.getsize('compressed.jpg') < 880852 * 0.6); chk('compressed.webp is WebP', Image.open('compressed.webp').format == 'WEBP')
chk('resize 50% = 150x100', Image.open('resized50.png').size == (150, 100)); chk('resize width 90 = 90x60', Image.open('resized90.png').size == (90, 60))
w = [round(float(p.mediabox.width)) for p in PdfReader('merged.pdf').pages]; chk('merge 5 pages, b.pdf first', w == [400, 410, 200, 210, 220], w)
chk('split 2+1 pages', (len(PdfReader('split1.pdf').pages), len(PdfReader('split2.pdf').pages)) == (2, 1)); w = [round(float(p.mediabox.width)) for p in PdfReader('split_combined.pdf').pages]; chk('split combined order 3,1', w == [220, 200], w)
chk('rotate all 90', [p.get('/Rotate', 0) for p in PdfReader('rot_all.pdf').pages] == [90, 90, 90]); chk('rotate page 2 by 180', [p.get('/Rotate', 0) for p in PdfReader('rot_p2.pdf').pages] == [0, 180, 0])
ip = PdfReader('images.pdf'); chk('images->pdf 3 pages, 1 image each', len(ip.pages) == 3 and [len(p.images) for p in ip.pages] == [1, 1, 1])
chk('fit mode page sizes', [(round(float(p.mediabox.width)), round(float(p.mediabox.height))) for p in PdfReader('images_fit.pdf').pages] == [(1200, 800), (300, 200), (400, 300)])
j = json.load(open('data.json')); chk('csv->json 3 records', len(j) == 3 and j[1]['city'] == 'Da Nang, VN')
img = cv2.copyMakeBorder(cv2.imread('qr.png'), 40, 40, 40, 40, cv2.BORDER_CONSTANT, value=(255, 255, 255)); exp = 'https://example.com/Omni?x=1&y=Xin chào'
chk('QR PNG decodes to the input', exp in (cv2.QRCodeDetector().detectAndDecode(img)[0], cv2.QRCodeDetectorAruco().detectAndDecode(img)[0]))
print(f'INDEPENDENT VERIFICATION: {len(ok)} passed, {len(bad)} failed'); [print('FAIL', b) for b in bad]
