#!/usr/bin/env python3
"""Build the MBI806B Assessment 1 peer review form.

One form per student, covering the whole class: a two-page (one double-sided
A4 sheet) fillable grid with a row per presenter and a 1-5 rating in each of
four criteria columns. Writes to
public/mbi806b/peer-review/MBI806B-Assessment-1-Peer-Review-Form.pdf, where the
/mbi806b course page links to it for download.

    pip install reportlab fonttools brotli pypdf   # once
    python3 scripts/peer-review-form/build.py
    python3 scripts/peer-review-form/build.py --names roster.txt

--names takes a text file with one presenter per line, in presenting order, and
pre-fills the Name column. Without it the names are left blank, so students
write or type them in (the class list is not kept in this repository).

The form uses DM Sans, the body face of the course pages. The repo only carries
it as a variable woff2 (scripts/er-tutorial-pdf/fonts), so the two static
weights the PDF needs are cut from that at build time rather than committing
more font files.
"""

import argparse
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject, NumberObject, TextStringObject
from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
FONT_SRC = ROOT / "scripts/er-tutorial-pdf/fonts/DMSans-Variable.woff2"
OUT = ROOT / "public/mbi806b/peer-review/MBI806B-Assessment-1-Peer-Review-Form.pdf"

# MBI806B's teal and the warm ink neutrals from src/styles/blend.css.
ACCENT = HexColor("#0f766e")
ACCENT_TINT = HexColor("#eaf7f4")
INK = HexColor("#1a1615")
MUTED = HexColor("#6b615d")
RULE = HexColor("#c8c0bc")
STRIPE = HexColor("#fdf4ee")
FIELD_BG = Color(1, 1, 1)

W, H = A4
MARGIN = 40
COL_W = W - 2 * MARGIN

ROWS = 30
ROWS_PER_PAGE = 15
ROW_H = 30

SCALE = "1 Needs work   ·   2 Developing   ·   3 Good   ·   4 Very good   ·   5 Excellent"

# (field key, column heading lines, what to look for)
CRITERIA = [
    ("delivery", ("Delivery",), "Voice, pace and eye contact. Spoke to the audience rather than reading the slides."),
    ("time", ("Time", "management"), "Kept to the allotted time, balanced the sections and did not rush the end."),
    ("content", ("The work", "presented"), "Relevant, accurate and backed by evidence. Real understanding of the data and methods."),
    ("impact", ("Structure", "and impact"), "Clear flow from problem to recommendation, clear visuals, a clear takeaway."),
]

# Table geometry: row number, name, then one narrow rating column per criterion.
NUM_W = 26
RATE_W = 62
NAME_W = COL_W - NUM_W - RATE_W * len(CRITERIA)


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


def text_field(c, name, tooltip, x, y, w, h, value="", size=10, maxlen=100):
    # Helvetica only: reportlab writes a second /Font key into the form's
    # resources as soon as a second field font is used, and one of them is lost.
    c.acroForm.textfield(
        name=name,
        tooltip=tooltip,
        value=value,
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
        maxlen=maxlen,
    )


def top_bar(c: canvas.Canvas) -> None:
    c.setFillColor(ACCENT)
    c.rect(0, H - 10, W, 10, stroke=0, fill=1)


def title_block(c: canvas.Canvas, page: int) -> float:
    top = H - MARGIN
    c.setFillColor(ACCENT)
    c.setFont("DMSans-Bold", 8)
    c.drawString(MARGIN, top - 14, "MBI806B  ·  BUSINESS DATA ANALYTICS WITH AI AND ML")

    size = 24 if page == 1 else 16
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", size)
    c.drawString(MARGIN, top - 14 - size - 4, "Peer review feedback")
    stop_x = MARGIN + c.stringWidth("Peer review feedback", "DMSans-Bold", size)
    c.setFillColor(ACCENT)
    c.drawString(stop_x, top - 14 - size - 4, ".")

    sub = "Assessment 1 presentations  ·  one form for the whole class" if page == 1 else "Assessment 1 presentations  ·  page 2 of 2"
    c.setFillColor(MUTED)
    c.setFont("DMSans", 10)
    c.drawString(MARGIN, top - 14 - size - 20, sub)
    return top - 14 - size - 20


def page_one_intro(c: canvas.Canvas, y: float) -> float:
    intro = (
        "As each presentation finishes, find that presenter's row and write a rating from 1 to 5 "
        "in each of the four columns. Rate what you saw and heard, not the person. "
        "Leave your own row blank."
    )
    c.setFillColor(INK)
    c.setFont("DMSans", 9)
    y -= 18
    for line in wrap(c, intro, "DMSans", 9, COL_W):
        c.drawString(MARGIN, y, line)
        y -= 12

    # Reviewer + date.
    y -= 8
    gap = 14
    half = (COL_W - gap) / 2
    for i, (key, text) in enumerate((("reviewer", "Your name (reviewer)"), ("date", "Date"))):
        x = MARGIN + i * (half + gap)
        c.setFillColor(MUTED)
        c.setFont("DMSans-Bold", 7.5)
        c.drawString(x, y, text.upper())
        text_field(c, key, text, x, y - 6 - 20, half, 20)
    y -= 6 + 20 + 16

    # Key: what each column asks.
    gap = 8
    box_w = (COL_W - gap * (len(CRITERIA) - 1)) / len(CRITERIA)
    box_h = 62
    for i, (_, heading, hint) in enumerate(CRITERIA):
        x = MARGIN + i * (box_w + gap)
        c.setFillColor(ACCENT_TINT)
        c.roundRect(x, y - box_h, box_w, box_h, 6, stroke=0, fill=1)
        c.setFillColor(ACCENT)
        c.setFont("DMSans-Bold", 8.5)
        c.drawString(x + 8, y - 14, " ".join(heading))
        c.setFillColor(INK)
        c.setFont("DMSans", 7.3)
        ty = y - 26
        for line in wrap(c, hint, "DMSans", 7.3, box_w - 16):
            c.drawString(x + 8, ty, line)
            ty -= 8.8
    return y - box_h - 12


def scale_line(c: canvas.Canvas, y: float) -> float:
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 8.5)
    c.drawString(MARGIN, y, "RATING SCALE")
    off = c.stringWidth("RATING SCALE", "DMSans-Bold", 8.5) + 12
    c.setFont("DMSans", 8.5)
    c.drawString(MARGIN + off, y, SCALE)
    return y - 14


def table_header(c: canvas.Canvas, y: float) -> float:
    h = 28
    c.setFillColor(ACCENT)
    c.rect(MARGIN, y - h, COL_W, h, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("DMSans-Bold", 8)
    c.drawCentredString(MARGIN + NUM_W / 2, y - 17, "#")
    c.drawString(MARGIN + NUM_W + 8, y - 17, "PRESENTER NAME")
    x = MARGIN + NUM_W + NAME_W
    for _, heading, _ in CRITERIA:
        cx = x + RATE_W / 2
        if len(heading) == 1:
            c.drawCentredString(cx, y - 17, heading[0])
        else:
            c.drawCentredString(cx, y - 12, heading[0])
            c.drawCentredString(cx, y - 22, heading[1])
        x += RATE_W
    return y - h


def table_rows(c: canvas.Canvas, y: float, first: int, last: int, names: list[str]) -> float:
    for n in range(first, last + 1):
        top = y
        bottom = y - ROW_H
        if n % 2 == 0:
            c.setFillColor(STRIPE)
            c.rect(MARGIN, bottom, COL_W, ROW_H, stroke=0, fill=1)
        c.setStrokeColor(RULE)
        c.setLineWidth(0.5)
        c.line(MARGIN, bottom, MARGIN + COL_W, bottom)

        c.setFillColor(MUTED)
        c.setFont("DMSans-Bold", 9)
        c.drawCentredString(MARGIN + NUM_W / 2, bottom + ROW_H / 2 - 3, str(n))

        name = names[n - 1] if n <= len(names) else ""
        text_field(
            c, f"n{n}_name", f"Presenter {n}: name",
            MARGIN + NUM_W + 4, bottom + 5, NAME_W - 8, ROW_H - 10, value=name, size=10,
        )
        x = MARGIN + NUM_W + NAME_W
        for key, heading, _ in CRITERIA:
            box = 22
            text_field(
                c, f"n{n}_{key}", f"Presenter {n}: {' '.join(heading)} (1 to 5)",
                x + (RATE_W - box) / 2, bottom + (ROW_H - box) / 2, box, box,
                size=14, maxlen=1,
            )
            x += RATE_W
        y = bottom
    return y


def footer(c: canvas.Canvas, page: int) -> None:
    c.setFillColor(MUTED)
    c.setFont("DMSans", 7.5)
    note = (
        "Fill in on screen or print double-sided and write by hand. Ratings only: 1 to 5, one number per box."
        if page == 1
        else "Leave your own row blank."
    )
    c.drawString(MARGIN, 24, note)
    c.drawRightString(W - MARGIN, 24, f"{page} / 2")


def build_pdf(path: Path, names: list[str]) -> None:
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle("MBI806B Assessment 1 - Peer review form")
    c.setAuthor("Yasas Sri Wickramasinghe")
    c.setSubject("Class-wide peer review form for the MBI806B Assessment 1 presentations")

    # Page 1: instructions, reviewer, key, presenters 1-15.
    top_bar(c)
    y = title_block(c, 1)
    y = page_one_intro(c, y)
    y = scale_line(c, y)
    y = table_header(c, y - 4)
    table_rows(c, y, 1, ROWS_PER_PAGE, names)
    footer(c, 1)
    c.showPage()

    # Page 2: presenters 16-30, with the scale repeated so it never needs a flip back.
    top_bar(c)
    y = title_block(c, 2)
    y = scale_line(c, y - 18)
    y = table_header(c, y - 4)
    table_rows(c, y, ROWS_PER_PAGE + 1, ROWS, names)
    footer(c, 2)
    c.showPage()
    c.save()


# Only ever a single digit from 1 to 5. Runs per keystroke, and again on commit
# so a pasted value is checked too.
RATING_JS = (
    'if (event.willCommit) {'
    ' if (event.value !== "" && !/^[1-5]$/.test(event.value)) {'
    ' app.alert("Please enter a whole number from 1 to 5."); event.rc = false; }'
    '} else if (event.change !== "" && !/^[1-5]$/.test(event.change)) { event.rc = false; }'
)


def finish_fields(src: Path, dst: Path) -> None:
    """reportlab cannot centre a text field or attach a script to one, so the
    rating boxes get both here: centred digit, and 1-5 only."""
    writer = PdfWriter(clone_from=PdfReader(str(src)))
    rating_keys = {key for key, _, _ in CRITERIA}
    for page in writer.pages:
        for ref in page.get("/Annots", []):
            annot = ref.get_object()
            name = str(annot.get("/T", ""))
            if name.split("_", 1)[-1] in rating_keys:
                annot[NameObject("/Q")] = NumberObject(1)
                annot[NameObject("/AA")] = DictionaryObject(
                    {
                        NameObject("/K"): DictionaryObject(
                            {
                                NameObject("/S"): NameObject("/JavaScript"),
                                NameObject("/JS"): TextStringObject(RATING_JS),
                            }
                        )
                    }
                )
    writer.write(str(dst))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--names", type=Path, help="text file, one presenter per line, pre-fills the Name column")
    args = parser.parse_args()

    names = []
    if args.names:
        names = [ln.strip() for ln in args.names.read_text().splitlines() if ln.strip()]
        if len(names) > ROWS:
            raise SystemExit(f"{len(names)} names, but the form has {ROWS} rows")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        register_fonts(Path(tmp))
        raw = Path(tmp) / "raw.pdf"
        build_pdf(raw, names)
        finish_fields(raw, OUT)
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
