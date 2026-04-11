from __future__ import annotations

from pathlib import Path
import textwrap

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "student-platform-guide.md"
OUTPUT = ROOT / "docs" / "student-platform-guide.pdf"

PAGE_WIDTH = 612
PAGE_HEIGHT = 792
LEFT_MARGIN = 54
TOP_MARGIN = 60
BOTTOM_MARGIN = 54
FONT_SIZE = 11
LINE_HEIGHT = 16


def escape_pdf_text(value: str) -> str:
    return value.replace('\\', r'\\').replace('(', r'\(').replace(')', r'\)')


def markdown_to_lines(md_text: str) -> list[str]:
    lines: list[str] = []

    for raw in md_text.splitlines():
        text = raw.rstrip()
        if not text:
            lines.append("")
            continue

        if text.startswith("# "):
            lines.append(text[2:].strip().upper())
            lines.append("")
            continue

        if text.startswith("## "):
            lines.append(text[3:].strip())
            lines.append("")
            continue

        if text.startswith("---"):
            lines.append("")
            lines.append("-" * 70)
            lines.append("")
            continue

        if text.startswith("- [ ]"):
            text = "• " + text[5:].strip()
        elif text.startswith("- "):
            text = "• " + text[2:].strip()

        wrapped = textwrap.wrap(text, width=86, break_long_words=False, break_on_hyphens=False)
        if wrapped:
            lines.extend(wrapped)
        else:
            lines.append("")

    return lines


def paginate(lines: list[str]) -> list[list[str]]:
    usable_height = PAGE_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN
    max_lines = max(1, usable_height // LINE_HEIGHT)

    pages: list[list[str]] = []
    for idx in range(0, len(lines), max_lines):
        pages.append(lines[idx: idx + max_lines])
    return pages


def build_content_stream(page_lines: list[str]) -> bytes:
    y = PAGE_HEIGHT - TOP_MARGIN
    commands = ["BT", f"/F1 {FONT_SIZE} Tf", f"{LEFT_MARGIN} {y} Td"]

    for i, line in enumerate(page_lines):
        safe_line = escape_pdf_text(line)
        if i == 0:
            commands.append(f"({safe_line}) Tj")
        else:
            commands.append(f"0 -{LINE_HEIGHT} Td")
            commands.append(f"({safe_line}) Tj")

    commands.append("ET")
    return "\n".join(commands).encode("latin-1", errors="replace")


def build_pdf(page_streams: list[bytes]) -> bytes:
    objects: list[bytes] = []

    # 1: Catalog
    # 2: Pages
    # 3: Font
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")

    page_count = len(page_streams)
    first_page_obj = 4
    page_obj_numbers = [first_page_obj + i * 2 for i in range(page_count)]
    content_obj_numbers = [num + 1 for num in page_obj_numbers]

    kids = " ".join(f"{n} 0 R" for n in page_obj_numbers)
    objects.append(f"<< /Type /Pages /Count {page_count} /Kids [{kids}] >>".encode("latin-1"))
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    for page_obj, content_obj, stream in zip(page_obj_numbers, content_obj_numbers, page_streams):
        page_dict = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {PAGE_WIDTH} {PAGE_HEIGHT}] "
            f"/Resources << /Font << /F1 3 0 R >> >> /Contents {content_obj} 0 R >>"
        )
        objects.append(page_dict.encode("latin-1"))
        stream_obj = b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream"
        objects.append(stream_obj)

    pdf = bytearray(b"%PDF-1.4\n")
    offsets = [0]

    for idx, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{idx} 0 obj\n".encode("ascii"))
        pdf.extend(obj)
        pdf.extend(b"\nendobj\n")

    xref_pos = len(pdf)
    pdf.extend(f"xref\n0 {len(objects)+1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))

    pdf.extend(
        (
            f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\n"
            f"startxref\n{xref_pos}\n%%EOF\n"
        ).encode("ascii")
    )

    return bytes(pdf)


def main() -> None:
    md_text = SOURCE.read_text(encoding="utf-8")
    lines = markdown_to_lines(md_text)
    pages = paginate(lines)
    streams = [build_content_stream(page) for page in pages]
    OUTPUT.write_bytes(build_pdf(streams))
    print(f"Wrote {OUTPUT.relative_to(ROOT)} with {len(pages)} page(s).")


if __name__ == "__main__":
    main()
