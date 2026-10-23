#!/usr/bin/env python3
"""Build the MBI806B Assessment 1 peer review feedback form.

Writes a one-page, fillable (AcroForm) A4 PDF to
public/mbi806b/peer-review/MBI806B-Assessment-1-Peer-Review-Form.pdf, where the
/mbi806b course page links to it for download.

    pip install reportlab fonttools brotli   # once
    python3 scripts/peer-review-form/build.py

The form uses DM Sans, the body face of the course pages. The repo only carries
it as a variable woff2 (scripts/er-tutorial-pdf/fonts), so the two static
weights the PDF needs are cut from that at build time rather than committing
more font files.
"""

import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.rl_accel import fp_str
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.acroform import AcroForm
from reportlab.pdfbase.ttfonts import TTFont as RLFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
FONT_SRC = ROOT / "scripts/er-tutorial-pdf/fonts/DMSans-Variable.woff2"
OUT = ROOT / "public/mbi806b/peer-review/MBI806B-Assessment-1-Peer-Review-Form.pdf"

# MBI806B's teal and the warm ink neutrals from src/styles/blend.css.
ACCENT = HexColor("#0f766e")
ACCENT_DARK = HexColor("#084640")
ACCENT_TINT = HexColor("#eaf7f4")
INK = HexColor("#1a1615")
MUTED = HexColor("#6b615d")
RULE = HexColor("#c8c0bc")
FIELD_BG = Color(1, 1, 1)

W, H = A4
MARGIN = 40
COL_W = W - 2 * MARGIN

SCALE = [
    (1, "Needs work"),
    (2, "Developing"),
    (3, "Good"),
    (4, "Very good"),
    (5, "Excellent"),
]

# Four criteria: delivery, time management, and the work itself (two angles).
CRITERIA = [
    (
        "delivery",
        "Delivery",
        "Voice, pace and clarity. Eye contact and body language. Spoke to the "
        "audience rather than reading the slides.",
    ),
    (
        "time",
        "Time management",
        "Kept to the allotted time. Gave each section the time it deserved, "
        "and did not rush the conclusion.",
    ),
    (
        "content",
        "The work presented",
        "Relevant to the brief, accurate and backed by evidence. Showed real "
        "understanding of the data, tools and methods used.",
    ),
    (
        "impact",
        "Structure and impact",
        "Logical flow from problem to findings to recommendation. Clear "
        "slides and visuals. Left you with a clear takeaway.",
    ),
]


def _circle_arc_stream(size, r, arcs=(0, 1, 2, 3), rotated=False):
    """reportlab's own circleArcStream scales the radius by size/20 without a
    matching transform, so any radio that is not 20pt draws as an off-centre
    curl. The stream is already in the button's own size x size box, so no
    scaling is needed."""
    k = fp_str(0.55231 * r)
    r, hs = fp_str(r), fp_str(size * 0.5)
    mx = "0.7071 0.7071 -0.7071 0.7071" if rotated else "1 0 0 1"
    segs = [
        (0, f"{r} 0 m", f"{r} {k} {k} {r} 0 {r} c"),
        (1, f"0 {r} m", f"-{k} {r} -{r} {k} -{r} 0 c"),
        (2, f"-{r} 0 m", f"-{r} -{k} -{k} -{r} 0 -{r} c"),
        (3, f"0 -{r} m", f"{k} -{r} {r} -{k} {r} 0 c"),
    ]
    out = [f"{mx} {hs} {hs} cm"]
    for i, move, curve in segs:
        if i in arcs:
            if len(out) == 1:
                out.append(move)
            out.append(curve)
    return "\n".join(out)


AcroForm.circleArcStream = staticmethod(_circle_arc_stream)


def register_fonts(tmp: Path) -> None:
    for name, wght in (("DMSans", 400), ("DMSans-Bold", 700)):
        font = TTFont(str(FONT_SRC))
        static = instancer.instantiateVariableFont(font, {"wght": wght})
        static.flavor = None
        # Both cuts inherit the variable font's name; give each its own so a
        # viewer never mistakes the bold subset for the regular one.
        for rec in static["name"].names:
            if rec.nameID in (1, 4, 6, 16):
                rec.string = name if rec.nameID != 4 else name.replace("-", " ")
        path = tmp / f"{name}.ttf"
        static.save(str(path))
        pdfmetrics.registerFont(RLFont(name, str(path)))
    pdfmetrics.registerFontFamily("DMSans", normal="DMSans", bold="DMSans-Bold")


def wrap(c: canvas.Canvas, text: str, font: str, size: float, width: float) -> list[str]:
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if c.stringWidth(trial, font, size) <= width:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def label(c: canvas.Canvas, x: float, y: float, text: str) -> None:
    c.setFillColor(MUTED)
    c.setFont("DMSans-Bold", 7.5)
    c.drawString(x, y, text.upper())


def text_field(c, name, tooltip, x, y, w, h, multiline=False, size=9.5):
    c.acroForm.textfield(
        name=name,
        tooltip=tooltip,
        x=x,
        y=y,
        width=w,
        height=h,
        fontName="Helvetica",
        fontSize=size,
        borderColor=RULE,
        fillColor=FIELD_BG,
        textColor=INK,
        borderWidth=0.75,
        borderStyle="solid",
        forceBorder=True,
        fieldFlags="multiline" if multiline else "",
    )


def header(c: canvas.Canvas) -> float:
    top = H - MARGIN
    c.setFillColor(ACCENT)
    c.rect(0, H - 10, W, 10, stroke=0, fill=1)

    c.setFillColor(ACCENT)
    c.setFont("DMSans-Bold", 8)
    c.drawString(MARGIN, top - 14, "MBI806B  ·  BUSINESS DATA ANALYTICS WITH AI AND ML")

    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 24)
    c.drawString(MARGIN, top - 42, "Peer review feedback")
    stop_x = MARGIN + c.stringWidth("Peer review feedback", "DMSans-Bold", 24)
    c.setFillColor(ACCENT)
    c.drawString(stop_x, top - 42, ".")

    c.setFillColor(MUTED)
    c.setFont("DMSans", 10)
    c.drawString(MARGIN, top - 58, "Assessment 1 presentation")

    intro = (
        "Watch the whole presentation, then rate each criterion from 1 (needs work) "
        "to 5 (excellent) and add one specific comment. Say what you saw and heard, "
        "not what you think of the person. Be kind, be specific, be useful."
    )
    c.setFillColor(INK)
    c.setFont("DMSans", 9)
    y = top - 76
    for line in wrap(c, intro, "DMSans", 9, COL_W):
        c.drawString(MARGIN, y, line)
        y -= 12
    return y


def details(c: canvas.Canvas, y: float) -> float:
    gap = 14
    half = (COL_W - gap) / 2
    h = 20
    rows = [
        (("presenter", "Presenter name(s)"), ("topic", "Presentation title or topic")),
        (("reviewer", "Your name (reviewer)"), ("date", "Date")),
    ]
    for left, right in rows:
        for i, (key, text) in enumerate((left, right)):
            x = MARGIN + i * (half + gap)
            label(c, x, y, text)
            text_field(c, key, text, x, y - 6 - h, half, h)
        y -= 6 + h + 14
    return y


def criterion(c: canvas.Canvas, y: float, n: int, key: str, title: str, hint: str) -> float:
    # Heading row: number chip, title, descriptor.
    chip = 17
    c.setFillColor(ACCENT)
    c.roundRect(MARGIN, y - chip + 4, chip, chip, 5, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("DMSans-Bold", 10)
    c.drawCentredString(MARGIN + chip / 2, y - chip + 4 + 5, str(n))

    tx = MARGIN + chip + 9
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 11.5)
    c.drawString(tx, y - 8, title)

    c.setFillColor(MUTED)
    c.setFont("DMSans", 8.5)
    yy = y - 20
    for line in wrap(c, hint, "DMSans", 8.5, COL_W - (tx - MARGIN)):
        c.drawString(tx, yy, line)
        yy -= 10.5

    # Rating row: five circles with their number beside them.
    ry = yy - 12
    rx = tx
    c.setFillColor(MUTED)
    c.setFont("DMSans-Bold", 7.5)
    c.drawString(rx, ry + 2, "RATING")
    rx += 46
    size = 12
    for value, name in SCALE:
        c.acroForm.radio(
            name=f"{key}_rating",
            tooltip=f"{title}: {value} - {name}",
            value=str(value),
            selected=False,
            x=rx,
            y=ry - 1,
            size=size,
            buttonStyle="circle",
            borderColor=ACCENT,
            fillColor=FIELD_BG,
            textColor=ACCENT_DARK,
            borderWidth=1,
            forceBorder=True,
            # reportlab's default adds "required", which Acrobat outlines in red.
            fieldFlags="noToggleToOff radio",
        )
        c.setFillColor(INK)
        c.setFont("DMSans-Bold", 9.5)
        c.drawString(rx + size + 4, ry + 1.5, str(value))
        c.setFillColor(MUTED)
        c.setFont("DMSans", 7.5)
        c.drawString(rx + size + 14, ry + 1.8, name)
        rx += size + 14 + c.stringWidth(name, "DMSans", 7.5) + 24

    # Time used belongs to the time-management criterion only, so it sits on
    # that criterion's heading row, clear of the rating labels.
    if key == "time":
        c.setFillColor(MUTED)
        c.setFont("DMSans-Bold", 7.5)
        c.drawRightString(W - MARGIN - 58, y - 7, "TIME USED (MM:SS)")
        text_field(c, "time_used", "Time used (mm:ss)", W - MARGIN - 52, y - 13, 52, 17, size=9)

    # Comment box.
    box_h = 38
    by = ry - 10 - box_h
    text_field(c, f"{key}_comment", f"{title}: your comment", tx, by, W - MARGIN - tx, box_h, multiline=True, size=9)
    c.setFillColor(MUTED)
    c.setFont("DMSans", 7.5)
    c.drawString(tx, by - 9, "Comment: what worked, and what would make it better?")

    # Hairline under the block.
    sep = by - 17
    c.setStrokeColor(RULE)
    c.setLineWidth(0.5)
    c.line(MARGIN, sep, W - MARGIN, sep)
    return sep - 12


def overall(c: canvas.Canvas, y: float) -> float:
    gap = 14
    half = (COL_W - gap) / 2
    h = 52
    items = [
        ("best", "The best thing about this presentation"),
        ("improve", "One thing to improve next time"),
    ]
    for i, (key, text) in enumerate(items):
        x = MARGIN + i * (half + gap)
        label(c, x, y, text)
        text_field(c, key, text, x, y - 6 - h, half, h, multiline=True, size=9)
    return y - 6 - h


def footer(c: canvas.Canvas) -> None:
    c.setFillColor(MUTED)
    c.setFont("DMSans", 7.5)
    c.drawString(
        MARGIN,
        24,
        "Fill this in on screen, or print it and write by hand. Hand your completed form to your "
        "lecturer or the presenter as instructed.",
    )


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        register_fonts(Path(tmp))
        c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
        c.setTitle("MBI806B Assessment 1 - Peer review feedback form")
        c.setAuthor("Yasas Sri Wickramasinghe")
        c.setSubject("Peer review feedback form for the MBI806B Assessment 1 presentation")

        y = header(c)
        y = details(c, y - 8)
        c.setStrokeColor(ACCENT)
        c.setLineWidth(1.2)
        c.line(MARGIN, y + 4, W - MARGIN, y + 4)
        y -= 14
        for n, (key, title, hint) in enumerate(CRITERIA, start=1):
            y = criterion(c, y, n, key, title, hint)
        overall(c, y)
        footer(c)
        c.showPage()
        c.save()
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
