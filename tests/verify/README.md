# Dev verification scripts (not part of `npm test`)
These need tools that are NOT project dependencies: `sharp` (Node) and OpenCV for Python (`pip install opencv-python`).
1. `node --experimental-strip-types tests/verify/qr_emit.mjs /tmp/qr` then `python3 tests/verify/qr_decode.py /tmp/qr`
2. `node --experimental-strip-types tests/verify/qr_stress.mjs` then `python3 tests/verify/qr_decode.py /tmp/qr4`
Result when last run (2026-11-10): 88 of 88 codes decoded (4 error-correction levels, versions 1-10, UTF-8). OpenCV's classic detector occasionally fails at a given pixel scale; the script also uses the Aruco detector and rescales. All 8 mask patterns were probed on a case that once failed.
