"""Builds the README and docs artwork: hero banner, buttons, page headers and nav pills.

Every image comes in a light and a dark version so GitHub can swap them with
`<picture>` and `prefers-color-scheme`. Text is outlined from Bricolage Grotesque
(docs/brand/fonts), so it renders the same everywhere without the font installed.

    uv run --with fonttools docs/brand/readme/build.py
    uv run --with fonttools docs/brand/readme/build.py --shots path/to/raw/screenshots

`--shots` also frames raw 2x app screenshots (dashboard.png, applications.png, inbox.png)
into screens/*.png. Needs ImageMagick for that step.
"""

from __future__ import annotations

import argparse
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = Path(__file__).parent
BRAND = HERE.parent
FONTS = BRAND / "fonts"

# Brand tokens (docs/brand/colors/tokens.css)
BIRCH, BIRCH_50, BIRCH_200, BIRCH_300 = "#F3F4EF", "#FAFAF7", "#E4E5DD", "#D3D4C9"
BARK, BARK_700, BARK_500 = "#2A1F19", "#4A3A30", "#76695F"
HONEY, HONEY_50, HONEY_800 = "#E9A825", "#FDF5E2", "#7A5208"
STATUS = {  # label: (ink, tint)
    "Applied": ("#3F6E8C", "#E8F0F5"),
    "OA": ("#6D5A9E", "#EFECF6"),
    "Interviewing": (HONEY_800, HONEY_50),
    "Offer": ("#2E5E4E", "#E7F0EC"),
}
NIGHT_STATUS = {"Applied": "#86AECB", "OA": "#A897D4", "Interviewing": HONEY, "Offer": "#74AE97"}
# Dark-only surfaces, all derived from bark
NIGHT_RAISED, NIGHT_CARD, NIGHT_LINE, NIGHT_MUTED = "#352820", "#433329", "#5A493E", "#C2B7AD"


@dataclass(frozen=True)
class Theme:
    name: str
    bg: str
    ink: str
    muted: str
    raised: str
    card: str
    line: str
    glow: str


LIGHT = Theme("light", BIRCH, BARK, BARK_500, BIRCH_50, "#FFFFFF", BIRCH_300, HONEY_50)
DARK = Theme("dark", BARK, BIRCH, NIGHT_MUTED, NIGHT_RAISED, NIGHT_CARD, NIGHT_LINE, "#3A2B21")
THEMES = (LIGHT, DARK)


# ── Text to outlines ────────────────────────────────────────────────────────


class Face:
    def __init__(self, path: Path) -> None:
        self.font = TTFont(path)
        self.glyphs = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.upm = self.font["head"].unitsPerEm

    def width(self, text: str, size: float, tracking: float = 0.0) -> float:
        units = sum(self.glyphs[self.cmap[ord(c)]].width for c in text)
        return units * size / self.upm + tracking * size * (len(text) - 1)

    def path(self, text: str, size: float, x: float, y: float, fill: str, tracking: float = 0.0) -> str:
        k = size / self.upm
        pen = SVGPathPen(self.glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
        cursor = x
        for c in text:
            glyph = self.glyphs[self.cmap[ord(c)]]
            glyph.draw(TransformPen(pen, (k, 0, 0, -k, cursor, y)))
            cursor += glyph.width * k + tracking * size
        return f'<path fill="{fill}" d="{pen.getCommands()}"/>'


BOLD = Face(FONTS / "BricolageGrotesque-Bold.ttf")
REGULAR = Face(FONTS / "BricolageGrotesque-Regular.ttf")
TIGHT = -0.025  # the wordmark's tracking

# The outlined wordmark, lifted from the lockup so it never drifts from the logo.
WORDMARK = re.search(r'<path fill="#2A1F19" transform="[^"]+" d="([^"]+)"', (BRAND / "logo/lockup.svg").read_text())[1]
BEAR = (
    '<circle cx="15" cy="16" r="11" fill="#2A1F19"/><circle cx="49" cy="16" r="11" fill="#2A1F19"/>'
    '<circle cx="15" cy="16" r="5" fill="#E9A825"/><circle cx="49" cy="16" r="5" fill="#E9A825"/>'
    '<circle cx="32" cy="36" r="24" fill="#2A1F19"/><ellipse cx="32" cy="45" rx="11" ry="8.5" fill="#E9A825"/>'
    '<ellipse cx="32" cy="40.5" rx="4.2" ry="3" fill="#2A1F19"/><circle cx="23" cy="31" r="2.6" fill="#F3F4EF"/>'
    '<circle cx="41" cy="31" r="2.6" fill="#F3F4EF"/>'
)


def bear(t: Theme, x: float, y: float, size: float) -> str:
    """The bear on light themes, the birch-disc badge on dark ones (brand rule)."""
    k = size / 64
    if t is LIGHT:
        return f'<g transform="translate({x} {y}) scale({k:.4f})">{BEAR}</g>'
    return (
        f'<g transform="translate({x} {y}) scale({k:.4f})"><circle cx="32" cy="32" r="32" fill="{BIRCH}"/>'
        f'<g transform="translate(8 7.6) scale(.75)">{BEAR}</g></g>'
    )


def lockup(t: Theme, x: float, y: float, height: float) -> str:
    k = height / 64
    word = BIRCH_50 if t is DARK else BARK
    shift = 4 if t is DARK else 0  # the badge is a little wider than the bare bear
    return (
        f'<g transform="translate({x} {y}) scale({k:.4f})">{bear(t, 0, 0, 64)}'
        f'<path fill="{word}" transform="translate({73.45 + shift} 46.36) scale(0.42)" d="{WORDMARK}"/></g>'
    )


# ── Icons: authored on a 24 grid, 2px round stroke ──────────────────────────

ICONS = {
    "server": '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/>'
    '<path d="M7 7.5h.01M7 16.5h.01"/>',
    "terminal": '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    "book": '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6.5A2.5 2.5 0 0 0 4 20.5 2.5 2.5 0 0 0 6.5 23H20"/>',
    "flag": '<path d="M5 21V4M5 4h12l-2.5 4.5L17 13H5"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-left": '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    "palette": '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/>'
    '<circle cx="16" cy="10" r="1.2"/><path d="M12 21a3 3 0 0 1 0-6h3"/>',
    "code": '<path d="m8 7-5 5 5 5M16 7l5 5-5 5"/>',
    "cloud": '<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5a4 4 0 0 1-.5 8.5z"/>',
}


def icon(name: str, x: float, y: float, size: float, color: str) -> str:
    k = size / 24
    return (
        f'<g transform="translate({x} {y}) scale({k:.4f})" fill="none" stroke="{color}" '
        f'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONS[name]}</g>'
    )


def shadow(fid: str, dy: float, blur: float, opacity: float) -> str:
    return (
        f'<filter id="{fid}" x="-30%" y="-60%" width="160%" height="260%">'
        f'<feDropShadow dx="0" dy="{dy}" stdDeviation="{blur}" flood-color="#2A1F19" flood-opacity="{opacity}"/></filter>'
    )


def svg(w: float, h: float, title: str, body: str, defs: str = "") -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:g} {h:g}" width="{w:g}" height="{h:g}" '
        f'role="img"><title>{title}</title><defs>{defs}</defs>{body}</svg>\n'
    )


# ── Hero ────────────────────────────────────────────────────────────────────


def badge(label: str, x: float, y: float, h: float = 36, size: float = 17) -> tuple[str, float]:
    ink, tint = STATUS[label]
    w = REGULAR.width(label, size) + 44
    out = (
        f'<rect x="{x}" y="{y}" width="{w:.1f}" height="{h}" rx="{h / 2}" fill="{tint}"/>'
        f'<circle cx="{x + 18}" cy="{y + h / 2}" r="4.5" fill="{ink}"/>'
        + REGULAR.path(label, size, x + 30, y + h / 2 + size * 0.35, ink)
    )
    return out, w


def board_card(t: Theme, x: float, y: float, w: float, name: str, highlight: bool = False) -> str:
    stroke = f'stroke="{HONEY}" stroke-width="2.5"' if highlight else f'stroke="{t.line}" stroke-width="1"'
    lines = BIRCH_200 if t is LIGHT else NIGHT_LINE
    out = (
        f'<rect x="{x}" y="{y}" width="{w}" height="76" rx="12" fill="{t.card}" {stroke} filter="url(#lift)"/>'
        + BOLD.path(name, 17, x + 14, y + 30, t.ink, TIGHT)
        + f'<rect x="{x + 14}" y="{y + 44}" width="{w - 40}" height="7" rx="3.5" fill="{lines}"/>'
        f'<rect x="{x + 14}" y="{y + 57}" width="{w - 62}" height="7" rx="3.5" fill="{lines}"/>'
    )
    if highlight:
        out += f'<circle cx="{x + w - 16}" cy="{y + 24}" r="5" fill="{HONEY}"/>'
    return out


def hero(t: Theme) -> str:
    W, H = 1280, 560
    body = [f'<g clip-path="url(#frame)"><rect width="{W}" height="{H}" fill="{t.bg}"/>']
    body.append(f'<circle cx="1010" cy="250" r="380" fill="{t.glow}"/>')
    body.append(f'<rect y="{H - 12}" width="{W}" height="12" fill="{HONEY}"/>')

    # Left: lockup, headline, subline, the status path
    body.append(lockup(t, 72, 64, 56))
    body.append(BOLD.path("Your pipeline", 66, 70, 236, t.ink, TIGHT))
    body.append(BOLD.path("updates itself.", 66, 70, 306, t.ink, TIGHT))
    body.append(REGULAR.path("A job tracker that reads your inbox", 25, 72, 366, t.muted))
    body.append(REGULAR.path("and moves each application along.", 25, 72, 400, t.muted))
    x = 72.0
    for i, label in enumerate(STATUS):
        out, w = badge(label, x, 448)
        body.append(out)
        x += w
        if i < len(STATUS) - 1:
            body.append(icon("arrow-right", x + 7, 457, 18, t.muted))
            x += 32

    # Right: a board with one card that just moved
    bx, by, bw, bh = 664, 64, 552, 436
    body.append(
        f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="20" fill="{t.raised}" '
        f'stroke="{t.line}" filter="url(#float)"/>'
    )
    body.append(BOLD.path("Applications", 21, bx + 22, by + 42, t.ink, TIGHT))
    body.append(REGULAR.path("48 tracked", 16, bx + bw - 22 - REGULAR.width("48 tracked", 16), by + 41, t.muted))
    body.append(f'<path d="M{bx} {by + 64}h{bw}" stroke="{t.line}"/>')
    cols = {
        "Applied": ["Tidepool", "Cobalt"],
        "OA": ["Halcyon"],
        "Interviewing": ["Northwind", "Meridian"],
        "Offer": ["Fernhill"],
    }
    cw, gap = 120, 12
    for i, (label, names) in enumerate(cols.items()):
        cx = bx + 20 + i * (cw + gap)
        ink = STATUS[label][0] if t is LIGHT else NIGHT_STATUS[label]
        body.append(f'<circle cx="{cx + 6}" cy="{by + 95}" r="5" fill="{ink}"/>')
        body.append(REGULAR.path(label, 15, cx + 18, by + 100, t.muted))
        for j, name in enumerate(names):
            body.append(board_card(t, cx, by + 116 + j * 88, cw, name, highlight=(name == "Halcyon")))

    # The email that moved it, with a dashed honey trail up to the card
    oa_x = bx + 20 + (cw + gap) + cw / 2
    body.append(
        f'<path d="M{oa_x} 404V{by + 116 + 76 + 14}" stroke="{HONEY}" stroke-width="3" '
        f'stroke-dasharray="2 9" stroke-linecap="round" fill="none"/>'
        f'<path d="m{oa_x - 8} {by + 116 + 76 + 22} 8-9 8 9" stroke="{HONEY}" stroke-width="3" '
        f'stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    )
    tx, ty, tw, th = 604, 404, 372, 88
    toast_bg, toast_ink, toast_muted = (BARK, BIRCH, "#D9D0C7") if t is LIGHT else (BIRCH_50, BARK, BARK_500)
    body.append(f'<rect x="{tx}" y="{ty}" width="{tw}" height="{th}" rx="18" fill="{toast_bg}" filter="url(#float)"/>')
    body.append(f'<circle cx="{tx + 44}" cy="{ty + th / 2}" r="24" fill="{HONEY}"/>')
    body.append(icon("mail", tx + 32, ty + th / 2 - 12, 24, BARK))
    body.append(BOLD.path("OA invite from Halcyon", 19, tx + 84, ty + 38, toast_ink, TIGHT))
    body.append(REGULAR.path("Moved from Applied to OA", 16, tx + 84, ty + 64, toast_muted))
    body.append("</g>")

    defs = (
        f'<clipPath id="frame"><rect width="{W}" height="{H}" rx="32"/></clipPath>'
        + shadow("float", 18, 22, 0.16 if t is LIGHT else 0.35)
        + shadow("lift", 3, 4, 0.06 if t is LIGHT else 0.3)
    )
    return svg(W, H, "JobBear: your pipeline updates itself", "".join(body), defs)


# ── Buttons and nav pills ───────────────────────────────────────────────────


def button(t: Theme, label: str, icon_name: str | None, primary: bool, icon_after: bool = False, h: float = 64) -> str:
    # Flat solid shapes: no border, no shadow, so nothing faint frames the button.
    size, pad, isz, igap, m = 22, 30, 24, 12, 4
    text_w = BOLD.width(label, size, TIGHT)
    inner = text_w + (isz + igap if icon_name else 0)
    w, H = inner + pad * 2, h
    if primary:
        fill, ink = HONEY, BARK
    elif t is LIGHT:
        fill, ink = BIRCH_200, BARK
    else:
        fill, ink = NIGHT_CARD, BIRCH
    x0, y0 = m, m
    cy = y0 + H / 2
    tx = x0 + pad + (0 if icon_after or not icon_name else isz + igap)
    parts = [f'<rect x="{x0}" y="{y0}" width="{w:.1f}" height="{H}" rx="16" fill="{fill}"/>']
    if icon_name:
        ix = tx + text_w + igap if icon_after else x0 + pad
        parts.append(icon(icon_name, ix, cy - isz / 2, isz, ink))
    parts.append(BOLD.path(label, size, tx, cy + size * 0.36, ink, TIGHT))
    return svg(w + m * 2, H + m * 2, label, "".join(parts))


def pill(t: Theme, label: str, current: bool) -> str:
    size, pad, h, m = 17, 18, 40, 3
    w = REGULAR.width(label, size) + pad * 2
    if current:
        fill, ink = (BARK, BIRCH) if t is LIGHT else (HONEY, BARK)
        face = BOLD
        w = BOLD.width(label, size, TIGHT) + pad * 2
    elif t is LIGHT:
        fill, ink, face = BIRCH_200, BARK, REGULAR
    else:
        fill, ink, face = NIGHT_CARD, BIRCH, REGULAR
    track = TIGHT if current else 0.0
    body = f'<rect x="{m}" y="{m}" width="{w:.1f}" height="{h}" rx="{h / 2}" fill="{fill}"/>' + face.path(
        label, size, m + pad, m + h / 2 + size * 0.36, ink, track
    )
    return svg(w + m * 2, h + m * 2, label, body)


# ── Page headers ────────────────────────────────────────────────────────────


def page_header(t: Theme, title: str, subtitle: str) -> str:
    W, H = 1280, 240
    body = (
        f'<g clip-path="url(#frame)"><rect width="{W}" height="{H}" fill="{t.bg}"/>'
        f'<circle cx="1180" cy="40" r="230" fill="{t.glow}"/>'
        f'<rect y="{H - 10}" width="{W}" height="10" fill="{HONEY}"/>'
        + bear(t, 64, 60, 112)
        + BOLD.path(title, 64, 212, 132, t.ink, TIGHT)
        + REGULAR.path(subtitle, 25, 214, 176, t.muted)
        + "</g>"
    )
    defs = f'<clipPath id="frame"><rect width="{W}" height="{H}" rx="28"/></clipPath>'
    return svg(W, H, title, body, defs)


PAGES = {  # slug: (nav label, header title, subtitle)
    "home": ("Home", None, None),
    "docs": ("Docs", "Docs", "Guides for running, deploying and building JobBear."),
    "self-hosting": ("Self-hosting", "Self-hosting", "All of JobBear on your own machine. Free, forever."),
    "deploying": ("Deploying", "Deploying", "Railway for the API and database, Cloudflare Pages for the app."),
    "development": ("Development", "Development", "Architecture, project layout, and how to run the tests."),
    "backend-map": ("Backend map", "Backend map", "How one request travels from URL to database and back."),
    "brand": ("Brand kit", "Brand kit", "The bear, the wordmark, the colors and the type."),
    "contributing": ("Contributing", "Contributing", "What's welcome, how to get set up, and the house rules."),
}

BUTTONS = {  # file stem: (label, icon, primary, icon after the label)
    "self-host": ("Self-host it free", "server", True, False),
    "quick-start": ("Quick start", "terminal", False, False),
    "docs": ("Read the docs", "book", False, False),
    "roadmap": ("Roadmap", "flag", False, False),
    "guide-self-hosting": ("Self-hosting", "server", False, False),
    "guide-deploying": ("Deploying", "cloud", False, False),
    "guide-development": ("Development", "code", False, False),
    "guide-brand": ("Brand kit", "palette", False, False),
    "next-deploying": ("Next: Deploying", "arrow-right", True, True),
    "next-development": ("Next: Development", "arrow-right", True, True),
    "next-backend-map": ("Next: Backend map", "arrow-right", True, True),
    "next-self-hosting": ("Start with self-hosting", "arrow-right", True, True),
    "back-home": ("Back to the README", "arrow-left", False, False),
}


def frame_screens(raw: Path) -> None:
    """Rounded corners, a hairline and a soft shadow on a transparent canvas."""
    out = HERE / "screens"
    out.mkdir(exist_ok=True)
    for shot in sorted(raw.glob("*.png")):
        r, w = 36, 2400
        src_w, src_h = (int(v) for v in subprocess.check_output(["magick", "identify", "-format", "%w %h", str(shot)]).split())
        h = round(src_h * w / src_w)
        subprocess.run(
            [
                "magick", str(shot), "-resize", f"{w}x{h}!", "-alpha", "set",
                "(", "-size", f"{w}x{h}", "xc:black", "-fill", "white",
                "-draw", f"roundrectangle 0,0 {w - 1},{h - 1} {r},{r}", ")",
                "-compose", "CopyOpacity", "-composite", "-compose", "Over",
                "-stroke", BIRCH_300, "-strokewidth", "3", "-fill", "none",
                "-draw", f"roundrectangle 1,1 {w - 2},{h - 2} {r},{r}",
                "(", "+clone", "-background", "#2A1F19", "-shadow", "18x28+0+24", ")",
                "+swap", "-background", "none", "-layers", "merge", "+repage",
                "-strip", "-define", "png:compression-level=9", str(out / shot.name),
            ],
            check=True,
        )
        print("framed", shot.name)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--shots", type=Path, help="folder of raw 2x app screenshots to frame")
    args = parser.parse_args()

    for d in ("hero", "buttons", "headers", "nav"):
        (HERE / d).mkdir(exist_ok=True)
    for t in THEMES:
        (HERE / f"hero/hero-{t.name}.svg").write_text(hero(t))
        for stem, (label, ic, primary, after) in BUTTONS.items():
            (HERE / f"buttons/{stem}-{t.name}.svg").write_text(button(t, label, ic, primary, after))
        for slug, (nav, title, sub) in PAGES.items():
            (HERE / f"nav/{slug}-{t.name}.svg").write_text(pill(t, nav, False))
            (HERE / f"nav/{slug}-current-{t.name}.svg").write_text(pill(t, nav, True))
            if title:
                (HERE / f"headers/{slug}-{t.name}.svg").write_text(page_header(t, title, sub))
    if args.shots:
        frame_screens(args.shots)
    print("Done.")


if __name__ == "__main__":
    main()
