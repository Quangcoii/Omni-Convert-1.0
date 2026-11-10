"""Decode PNGs emitted by qr_emit.mjs / qr_stress.mjs with OpenCV and compare with the source text.
OpenCV's detectors are occasionally flaky at one pixel scale, so each image is tried with the classic and (if available) Aruco detectors at a few scales; the count of retries is reported.
Usage: python3 tests/verify/qr_decode.py /tmp/qr"""
import json, sys, cv2
d = sys.argv[1] if len(sys.argv) > 1 else '/tmp/qr'
meta = json.load(open(f'{d}/meta.json')); bad = []; retried = 0
dets = [cv2.QRCodeDetector()] + ([cv2.QRCodeDetectorAruco()] if hasattr(cv2, 'QRCodeDetectorAruco') else [])
for m in meta:
    img = cv2.imread(f"{d}/{m['i']}.png"); ok = False
    for k, s in enumerate((1.0, 0.5, 0.75, 1.5)):
        im = cv2.resize(img, None, fx=s, fy=s, interpolation=cv2.INTER_NEAREST) if s != 1.0 else img
        im = cv2.copyMakeBorder(im, 40, 40, 40, 40, cv2.BORDER_CONSTANT, value=(255, 255, 255))
        if any(det.detectAndDecode(im)[0] == m['text'] for det in dets):
            ok = True; retried += k > 0; break
    if not ok: bad.append((m['i'], m['ecc'], m['version'], len(m['text'])))
print(f'decoded {len(meta) - len(bad)}/{len(meta)} (needed a rescale retry: {retried})')
if bad: print('FAIL', bad)
sys.exit(1 if bad else 0)
