#!/usr/bin/env bash
# Re-renders every PNG and the favicon from the SVGs in this folder.
# Needs rsvg-convert (librsvg) and ImageMagick: `brew install librsvg imagemagick`.
set -euo pipefail
cd "$(dirname "$0")"

png() { rsvg-convert "$@"; }
rm -rf png && mkdir -p png/bear png/icon png/lockup

for s in 16 32 48 64 128 256 512 1024; do
  png -w "$s" -h "$s" logo/bear.svg -o "png/bear/bear-$s.png"
done
for s in 128 512 1024; do
  png -w "$s" -h "$s" logo/bear-asleep.svg -o "png/bear/bear-asleep-$s.png"
  png -w "$s" -h "$s" logo/bear-badge.svg -o "png/bear/bear-badge-$s.png"
  png -w "$s" -h "$s" logo/bear-mono-bark.svg -o "png/bear/bear-mono-bark-$s.png"
  png -w "$s" -h "$s" logo/bear-mono-birch.svg -o "png/bear/bear-mono-birch-$s.png"
done

for s in 180 192 512 1024; do
  png -w "$s" -h "$s" logo/icon.svg -o "png/icon/icon-$s.png"
  png -w "$s" -h "$s" logo/icon-honey.svg -o "png/icon/icon-honey-$s.png"
done

for h in 128 256; do
  for f in lockup lockup-on-dark lockup-mono-bark lockup-mono-birch; do
    png -h "$h" "logo/$f.svg" -o "png/lockup/$f-$h.png"
  done
  png -h "$h" logo/wordmark.svg -o "png/lockup/wordmark-$h.png"
  png -h "$h" logo/wordmark-birch.svg -o "png/lockup/wordmark-birch-$h.png"
done

png -w 1280 -h 640 social/social-preview.svg -o social/social-preview.png
png -w 1200 colors/palette.svg -o colors/palette.png

# favicon.ico holds 16, 32 and 48 px, the sizes browsers and Windows ask for.
magick png/bear/bear-16.png png/bear/bear-32.png png/bear/bear-48.png favicon.ico

echo "Done. $(find png social colors -name '*.png' | wc -l | tr -d ' ') PNGs + favicon.ico"
