#!/usr/bin/env python3
"""Build the MBI804 scope management plan activity sheet.

Page 1 is the 30-minute team activity (scenario, timings, who writes what, the
checks). Pages 2 to 5 are a cut-down scope management plan with fillable boxes:
summary, approach, roles, scope statement, WBS and dictionary, verification,
change control, sign-off. Writes to
public/mbi804/scope-plan/MBI804-Scope-Management-Plan-Activity.pdf, where the
/scope-plan page links to it.

    pip install reportlab fonttools brotli   # once
    python3 scripts/scope-plan-pdf/build.py

The section order follows the usual scope management plan outline (as in the
ProjectManagementDocs.com template), cut down to the parts a student team can
fill in during a class. The wording is ours.

Set in DM Sans, the body face of the course pages. The repo carries it only as a
variable woff2 (scripts/er-tutorial-pdf/fonts), so the two static weights the
PDF needs are cut from that at build time.
"""

import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
FONT_SRC = ROOT / "scripts/er-tutorial-pdf/fonts/DMSans-Variable.woff2"
OUT = ROOT / "public/mbi804/scope-plan/MBI804-Scope-Management-Plan-Activity.pdf"

# MBI804's plum from src/styles/blend.css, and the warm greys the pages use.
ACCENT = HexColor("#8b2549")
INK = HexColor("#1a1615")
MUTED = HexColor("#6b615d")
RULE = HexColor("#c8c0bc")
FIELD_BG = Color(1, 1, 1)

W, H = A4
MARGIN = 44
COL_W = W - 2 * MARGIN
TOTAL_PAGES = 5


def register_fonts(tmp: Path) -> None:
    for name, wght in (("DMSans", 400), ("DMSans-Bold", 700)):
        font = TTFont(str(FONT_SRC))
        static = instancer.instantiateVariableFont(font, {"wght": wght})
        static.flavor = None
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


def para(c, text, x, y, width, font="DMSans", size=9, lead=12.5, color=INK) -> float:
    """Draw wrapped text with its first baseline at y. Returns the y below it."""
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap(c, text, font, size, width):
        c.drawString(x, y, line)
        y -= lead
    return y


def field(c, name, tooltip, x, y, w, h, size=9, multiline=False):
    # Helvetica only: reportlab writes a second /Font key into the form's
    # resources as soon as a second field font is used, and one of them is lost.
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
        maxlen=3000 if multiline else 200,
        fieldFlags="multiline" if multiline else "",
    )


def heading(c, y, num, title, hint=None, box_next=True) -> float:
    """Numbered section heading with an optional hint. Returns y below.

    box_next pulls the next element up under the hint, for a box that starts straight away;
    leave it False when text or a label comes next."""
    c.setFillColor(ACCENT)
    c.setFont("DMSans-Bold", 11.5)
    c.drawString(MARGIN, y, num)
    c.setFillColor(INK)
    # Page 1 headings carry no number, so they sit flush with the text below.
    c.drawString(MARGIN + (c.stringWidth(num, "DMSans-Bold", 11.5) + 6 if num else 0), y, title)
    y -= 13
    if hint:
        # para() leaves y one line below the hint; pull back up so the box sits close under it.
        y = para(c, hint, MARGIN, y, COL_W, size=8.5, lead=11, color=MUTED) + (5 if box_next else 0)
    return y - 4


def label(c, y, text) -> float:
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 8.5)
    c.drawString(MARGIN, y, text)
    return y - 4


def box(c, y, name, tooltip, h) -> float:
    """A full-width multiline box whose top edge is at y. Returns y below it."""
    field(c, name, tooltip, MARGIN, y - h, COL_W, h, multiline=True)
    return y - h - 18


def footer(c, page: int, note: str = "") -> None:
    c.setFillColor(MUTED)
    c.setFont("DMSans", 7.5)
    c.drawString(MARGIN, 24, note or "MBI804 IT Project Management  ·  Scope management plan")
    c.drawRightString(W - MARGIN, 24, f"{page} / {TOTAL_PAGES}")


# ─── Page 1: the activity ────────────────────────────────────────────────────

SCENARIO = [
    "Harbour Physio is a clinic with five physiotherapists and one receptionist. Every appointment "
    "is made by phone and written in a paper diary, and double bookings happen most weeks. The owner "
    "wants an online booking system. Patients book, change and cancel their own appointments and get "
    "a text reminder the day before. The receptionist sees one calendar for everyone, and each "
    "physio sees their own day.",
    "The owner has 12 weeks and NZ$25,000, and wants it running before winter. Online payments and "
    "patient notes have both come up as \"maybe later\". Your team is the project team. Deciding what "
    "those two mean for your plan is part of the job.",
    "If you'd rather plan a real project one of you has worked on, that's fine, as long as everyone "
    "knows it well enough to answer questions about it.",
]

TIMINGS = [
    ("0 to 4", "Read the project. Agree a two-sentence summary for section 1. Pick a project manager, "
               "who also keeps time."),
    ("4 to 5", "Split the sections between you (below)."),
    ("5 to 17", "Write your own section, quietly. Rough is fine, and short lists beat paragraphs."),
    ("17 to 25", "Swap with a teammate and read theirs. Run the four checks below."),
    ("25 to 28", "Fix what the checks turned up. The project manager fills in the top of page 2 and the sign-off."),
    ("28 to 30", "Get ready to tell the class one thing you left out on purpose, and why."),
]

SPLIT = [
    ("Person 1", "Sections 2 and 3: how scope is managed, and who does what"),
    ("Person 2", "Section 4, first half: description, deliverables, acceptance criteria"),
    ("Person 3", "Section 4, second half: exclusions, constraints, assumptions"),
    ("Person 4", "Section 5: the work breakdown structure and dictionary"),
    ("Person 5", "Sections 6 and 7: checking the work, and handling changes"),
]

CHECKS = [
    "Does every deliverable show up in the WBS, and does every WBS item lead to a deliverable?",
    "Could a stranger answer yes or no to each acceptance criterion? \"Easy to use\" can't be "
    "answered. \"A patient can book without phoning the clinic\" can.",
    "Is each exclusion something a reasonable person might have expected to be included? \"Anything "
    "not listed\" doesn't count. Look at what you did with online payments and patient notes.",
    "Does the change process name one person who decides, and say how long they have?",
]


def page_activity(c: canvas.Canvas) -> None:
    y = H - MARGIN - 14
    c.setFillColor(MUTED)
    c.setFont("DMSans-Bold", 8)
    c.drawString(MARGIN, y, "MBI804  ·  IT PROJECT MANAGEMENT  ·  TEAM ACTIVITY")
    y -= 28
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 23)
    c.drawString(MARGIN, y, "Write a scope management plan")
    y -= 17
    c.setFillColor(MUTED)
    c.setFont("DMSans", 10)
    c.drawString(MARGIN, y, "30 minutes  ·  teams of 4 to 6  ·  template on pages 2 to 5")
    y -= 24

    y = para(
        c,
        "A scope management plan says what a project will deliver, what it won't, and how changes "
        "get dealt with. Thirty minutes won't give you a finished one. You'll get a rough draft and "
        "you'll find out which parts are weak, which is the point.",
        MARGIN, y, COL_W, size=9.5, lead=13,
    )
    y -= 10

    y = heading(c, y, "", "The project", box_next=False)
    for i, p in enumerate(SCENARIO):
        y = para(c, p, MARGIN, y, COL_W, size=9, lead=12.2, color=INK if i < 2 else MUTED)
        y -= 3
    y -= 6

    y = heading(c, y, "", "The 30 minutes", box_next=False)
    time_w = 58
    for when, what in TIMINGS:
        c.setFillColor(ACCENT)
        c.setFont("DMSans-Bold", 9)
        c.drawString(MARGIN, y, when)
        y2 = para(c, what, MARGIN + time_w, y, COL_W - time_w, size=9, lead=12.2)
        y = y2 - 2.5
    y -= 6

    y = heading(c, y, "", "Who writes what", "Five people shown. With four, one person takes sections 2, 3, 6 and 7. "
                "With six, two people share the WBS.", box_next=False)
    for who, what in SPLIT:
        c.setFillColor(ACCENT)
        c.setFont("DMSans-Bold", 9)
        c.drawString(MARGIN, y, who)
        c.setFillColor(INK)
        c.setFont("DMSans", 9)
        c.drawString(MARGIN + time_w + 8, y, what)
        y -= 13
    y -= 8

    y = heading(c, y, "", "The four checks", "For minutes 17 to 25. Ask these about your teammate's section, not your own.", box_next=False)
    for i, text in enumerate(CHECKS, 1):
        c.setFillColor(ACCENT)
        c.setFont("DMSans-Bold", 9)
        c.drawString(MARGIN, y, f"{i}.")
        y = para(c, text, MARGIN + 16, y, COL_W - 16, size=9, lead=12.2) - 3

    footer(c, 1, "Section order follows the usual scope management plan outline (see ProjectManagementDocs.com), cut down. Wording is ours.")
    c.showPage()


# ─── Pages 2 to 5: the template ──────────────────────────────────────────────

def page_title(c, text, y=None) -> float:
    y = y if y is not None else H - MARGIN - 6
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 17)
    c.drawString(MARGIN, y, text)
    return y - 22


def page_two(c: canvas.Canvas) -> None:
    y = page_title(c, "Scope management plan")

    # Project name, team, date.
    gap = 12
    widths = [COL_W * 0.46, COL_W * 0.32]
    widths.append(COL_W - sum(widths) - 2 * gap)
    x = MARGIN
    for (key, text), w in zip((("project", "Project name"), ("team", "Team"), ("date", "Date")), widths):
        c.setFillColor(MUTED)
        c.setFont("DMSans-Bold", 7.5)
        c.drawString(x, y, text.upper())
        field(c, key, text, x, y - 6 - 20, w, 20)
        x += w + gap
    y -= 6 + 20 + 20

    y = heading(c, y, "1", "Project summary", "Two or three sentences: what is being built, for whom, and why.")
    y = box(c, y, "summary", "Project summary", 56)

    y = heading(c, y, "2", "How scope will be managed", "Short answers. One name per question is better than \"the team\".", box_next=False)
    for key, q in (
        ("approach_who", "Who is responsible for managing scope?"),
        ("approach_where", "Where is the scope written down? (scope statement, WBS, dictionary)"),
        ("approach_check", "How will we check the work against the scope?"),
        ("approach_accept", "Who accepts the finished project?"),
    ):
        y = label(c, y - 4, q) - 3
        y = box(c, y, key, q, 26) + 8

    y -= 4
    y = heading(c, y, "3", "Roles and responsibilities",
                "Everyone on the project, sponsor included. Say what each person does about scope, not their whole job.", box_next=False)
    name_w, role_w = 120, 95
    do_w = COL_W - name_w - role_w
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 7.5)
    for text, x in (("NAME", MARGIN), ("ROLE", MARGIN + name_w), ("WHAT THEY DO ABOUT SCOPE", MARGIN + name_w + role_w)):
        c.drawString(x + 2, y - 8, text)
    y -= 12
    row_h = 32
    for i in range(1, 7):
        top = y
        for key, x, w in (("name", MARGIN, name_w), ("role", MARGIN + name_w, role_w), ("does", MARGIN + name_w + role_w, do_w)):
            field(c, f"role{i}_{key}", f"Person {i}: {key}", x, top - row_h, w, row_h, multiline=(key == "does"))
        y = top - row_h
    footer(c, 2)
    c.showPage()


def page_three(c: canvas.Canvas) -> None:
    y = page_title(c, "4  Scope statement")
    y -= 2
    parts = [
        ("a", "Description", "What the project will produce, in a short paragraph.", 56),
        ("b", "Deliverables", "A list. Each one is something you could hand over or point to.", 88),
        ("c", "Acceptance criteria",
         "For each deliverable, what has to be true before it counts as done. Write each one so someone else can answer yes or no.", 104),
        ("d", "Exclusions",
         "Things someone might reasonably expect that are not part of this project. Be specific.", 84),
        ("e", "Constraints", "Limits on time, money, people and equipment.", 58),
        ("f", "Assumptions",
         "Things you're treating as true but haven't confirmed. If one turns out wrong, the plan changes.", 58),
    ]
    for key, title, hint, h in parts:
        y = heading(c, y, f"4{key}", title, hint)
        y = box(c, y, f"scope_{title.lower().replace(' ', '_')}", title, h)
    footer(c, 3)
    c.showPage()


def page_four(c: canvas.Canvas) -> None:
    y = page_title(c, "5  Work breakdown structure")
    y = heading(
        c, y, "5a", "WBS outline",
        "Break each deliverable into smaller pieces until you reach work packages: pieces of work one person "
        "could finish in about a week. As a guide, no more than 40 hours each. Number the levels 1, 1.1, 1.1.1.",
    )
    y = box(c, y, "wbs_outline", "WBS outline", 218)

    y = heading(c, y, "5b", "WBS dictionary", "One row per work package. Anyone picking up the row should know what to do and what to hand back.")
    cols = [("CODE", 34), ("WORK PACKAGE", 86), ("WHAT THE WORK INVOLVES", 170), ("DELIVERABLE", 105), ("OWNER", 52)]
    cols.append(("ESTIMATE", COL_W - sum(w for _, w in cols)))
    x = MARGIN
    c.setFillColor(INK)
    c.setFont("DMSans-Bold", 7.5)
    for text, w in cols:
        c.drawString(x + 2, y - 8, text)
        x += w
    y -= 12
    row_h = 38
    for i in range(1, 8):
        x = MARGIN
        for (text, w) in cols:
            field(c, f"dict{i}_{text.lower().replace(' ', '_')}", f"Row {i}: {text.title()}", x, y - row_h, w, row_h,
                  multiline=text in ("WHAT THE WORK INVOLVES", "DELIVERABLE", "WORK PACKAGE"))
            x += w
        y -= row_h
    footer(c, 4)
    c.showPage()


def page_five(c: canvas.Canvas) -> None:
    y = page_title(c, "Checking and changing the scope")

    y = heading(
        c, y, "6", "Scope verification",
        "How each deliverable gets checked against the scope and formally accepted. Do it as each one is "
        "finished, not once at the end.",
    )
    y = box(c, y, "verification", "Scope verification", 92)

    y = heading(c, y, "7", "Scope control and changes",
                "What happens when someone wants something added, removed or different.", box_next=False)
    for key, q in (
        ("change_ask", "Who can ask for a change, and how do they ask?"),
        ("change_effect", "Who works out the effect on time, cost and quality?"),
        ("change_decide", "Who decides, and how long do they have?"),
        ("change_tell", "How is everyone told, and which documents get updated?"),
    ):
        y = label(c, y - 4, q) - 3
        y = box(c, y, key, q, 34) + 8

    y -= 12
    y = heading(c, y, "8", "Sign-off", "Approved by the project sponsor.", box_next=False)
    gap = 12
    widths = [COL_W * 0.4, COL_W * 0.34]
    widths.append(COL_W - sum(widths) - 2 * gap)
    x = MARGIN
    for (key, text), w in zip((("sponsor_name", "Name"), ("sponsor_title", "Title"), ("sponsor_date", "Date")), widths):
        c.setFillColor(MUTED)
        c.setFont("DMSans-Bold", 7.5)
        c.drawString(x, y - 4, text.upper())
        field(c, key, text, x, y - 10 - 22, w, 22)
        x += w + gap
    y -= 10 + 22 + 34
    c.setStrokeColor(INK)
    c.setLineWidth(0.6)
    c.line(MARGIN, y, MARGIN + 230, y)
    c.setFillColor(MUTED)
    c.setFont("DMSans", 8)
    c.drawString(MARGIN, y - 11, "Signature")
    footer(c, 5)
    c.showPage()


def build_pdf(path: Path) -> None:
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle("MBI804 Scope management plan: team activity and template")
    c.setAuthor("Yasas Sri Wickramasinghe")
    c.setSubject("30-minute team activity and a cut-down scope management plan template")
    page_activity(c)
    page_two(c)
    page_three(c)
    page_four(c)
    page_five(c)
    c.save()


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        register_fonts(Path(tmp))
        build_pdf(OUT)
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
