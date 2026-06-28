import os
import time

try:
    import win32com.client as win32
    HAS_WIN32COM = True
except ImportError:
    win32 = None
    HAS_WIN32COM = False

def RGB(r, g, b):
    return r + (g << 8) + (b << 16)

# ──────────────────────────────────────────────────────────────────────
# POWERPOINT SLIDE GENERATOR
# ──────────────────────────────────────────────────────────────────────

def activate_slide(ppt, slide):
    try:
        ppt.ActiveWindow.View.GotoSlide(slide.SlideIndex)
    except Exception:
        try:
            slide.Select()
        except Exception:
            pass
    time.sleep(0.05)

def type_text(shape, text, delay=0.002):
    chunk_size = 5
    for i in range(0, len(text), chunk_size):
        chunk = text[i:i+chunk_size]
        for _ in range(20):
            try:
                shape.TextFrame.TextRange.InsertAfter(chunk)
                break
            except Exception:
                time.sleep(0.01)
        if delay > 0:
            time.sleep(delay)

def add_bullet_points(slide, shape, points, font_size=11, font_color=None, delay=0.001):
    for pt in points:
        for _ in range(20):
            try:
                tr = shape.TextFrame.TextRange
                p = tr.InsertAfter("\n• " if tr.Length > 0 else "• ")
                p.Font.Size = font_size
                p.Font.Name = "Calibri"
                if font_color:
                    p.Font.Color.RGB = font_color
                break
            except Exception:
                time.sleep(0.01)
        
        chunk_size = 8
        for i in range(0, len(pt), chunk_size):
            chunk = pt[i:i+chunk_size]
            for _ in range(20):
                try:
                    shape.TextFrame.TextRange.InsertAfter(chunk)
                    break
                except Exception:
                    time.sleep(0.01)
            if delay > 0:
                time.sleep(delay)

def build_presentation(config):
    if not HAS_WIN32COM or win32 is None:
        print("[COM Simulation] Generating PowerPoint presentation config:", config)
        return True

    title_override = config.get("title", "Solving Data Center Supply Chain Velocity")
    theme_name = config.get("theme", "blue-amber")
    slide_switches = config.get("slides", {})
    custom_notes = config.get("custom_notes", "")
    
    print("[COM] Dispatching PowerPoint Application...")
    ppt = win32.Dispatch("PowerPoint.Application")
    ppt.Visible = True
    
    pres = ppt.Presentations.Add()
    pres.PageSetup.SlideWidth = 960
    pres.PageSetup.SlideHeight = 540
    
    # Theme colors
    BG_WHITE = RGB(255, 255, 255)
    CARD_BG = RGB(255, 255, 255)
    TEXT_PRIMARY = RGB(15, 23, 42)      # Slate 900
    TEXT_SECONDARY = RGB(71, 85, 105)   # Slate 600
    BORDER_COLOR = RGB(226, 232, 240)   # Slate 200
    
    if theme_name == "forest-green":
        ACCENT_BLUE = RGB(21, 128, 61)    # Green 700
        ACCENT_AMBER = RGB(234, 179, 8)   # Yellow 500
    elif theme_name == "midnight-slate":
        ACCENT_BLUE = RGB(15, 23, 42)    # Slate 900
        ACCENT_AMBER = RGB(100, 116, 139) # Slate 500
    elif theme_name == "deep-indigo":
        ACCENT_BLUE = RGB(79, 70, 229)    # Indigo 600
        ACCENT_AMBER = RGB(219, 39, 119)   # Pink 600
    else: # blue-amber (default)
        ACCENT_BLUE = RGB(0, 120, 212)    # Outlook Blue
        ACCENT_AMBER = RGB(216, 59, 1)    # Outlook Orange-Red
    
    # slide configurations and generation logic...
    # (Creating slides)
    # We will keep the slides clean and functional. Let's do a basic slide set.
    slide_index = 1
    
    # Slide 1: Title
    slide = pres.Slides.Add(slide_index, 12) # 12 = Blank slide
    activate_slide(ppt, slide)
    
    # Add title text box
    title_box = slide.Shapes.AddTextbox(1, 100, 180, 760, 100)
    title_box.TextFrame.WordWrap = True
    tr_title = title_box.TextFrame.TextRange
    tr_title.Font.Name = "Calibri"
    tr_title.Font.Size = 36
    tr_title.Font.Bold = True
    tr_title.Font.Color.RGB = ACCENT_BLUE
    type_text(title_box, title_override)
    
    sub_box = slide.Shapes.AddTextbox(1, 100, 280, 760, 50)
    tr_sub = sub_box.TextFrame.TextRange
    tr_sub.Font.Name = "Calibri"
    tr_sub.Font.Size = 16
    tr_sub.Font.Color.RGB = TEXT_SECONDARY
    type_text(sub_box, "Summit Electrical Sales Operations Portal Briefing")
    
    # Finish deck
    print(f"[COM] PowerPoint presentation '{title_override}' built successfully.")
    return True

# ──────────────────────────────────────────────────────────────────────
# WORD REPORT GENERATOR
# ──────────────────────────────────────────────────────────────────────

def type_text_word(sel, text, delay=0.015):
    for char in text:
        for _ in range(20):
            try:
                sel.TypeText(char)
                break
            except Exception:
                time.sleep(0.05)
        time.sleep(delay)

def type_paragraph(sel):
    for _ in range(20):
        try:
            sel.TypeParagraph()
            break
        except Exception:
            time.sleep(0.05)

def set_font(sel, name="Calibri", size=11, bold=False, italic=False):
    for _ in range(20):
        try:
            sel.Font.Name = name
            sel.Font.Size = size
            sel.Font.Bold = bold
            sel.Font.Italic = italic
            break
        except Exception:
            time.sleep(0.05)

def build_brief():
    if not HAS_WIN32COM or win32 is None:
        print("[COM Simulation] Generating Word Operations Brief Document...")
        return True

    print("[COM] Dispatching Word Application...")
    word = win32.Dispatch("Word.Application")
    word.Visible = True
    
    try:
        word.Activate()
    except Exception:
        pass
        
    print("[COM] Creating new Word document...")
    doc = word.Documents.Add()
    sel = word.Selection
    
    # Title
    set_font(sel, name="Calibri", size=18, bold=True)
    type_text_word(sel, "EXECUTIVE OPERATIONS BRIEF: SOLVING DATA CENTER SUPPLY CHAIN VELOCITY", delay=0.005)
    type_paragraph(sel)
    
    set_font(sel, name="Calibri", size=11, bold=False)
    type_text_word(sel, "This document outlines the Backfeed agentic integration resolving supply chain constraints.", delay=0.002)
    type_paragraph(sel)
    
    print("[COM] Word briefing document completed.")
    return True

# ──────────────────────────────────────────────────────────────────────
# EXCEL SHEET GENERATOR
# ──────────────────────────────────────────────────────────────────────

def build_excel(data=None):
    if not HAS_WIN32COM or win32 is None:
        print("[COM Simulation] Generating Excel Quote spreadsheet config:", data)
        return True

    if not data:
        data = {
            "items": [
                {"qty": 1500, "origText": "Liberty Copper Cable 4/0 AWG THHN Copper Wire", "brandName": "Liberty Copper Cable", "insideRep": "Specialist B", "price": 5624.50, "weight": 1200},
                {"qty": 250, "origText": "Titan B-Line 10FT Bolted Strut Channel", "brandName": "Titan B-Line", "insideRep": "Specialist B", "price": 3120.00, "weight": 800}
            ],
            "total": 8744.50
        }

    print("[Excel COM] Dispatching Excel Application...")
    excel = win32.Dispatch("Excel.Application")
    excel.Visible = True
    
    wb = excel.Workbooks.Add()
    ws = wb.ActiveSheet
    ws.Name = "Speed-Quote Bid"
    excel.ActiveWindow.DisplayGridlines = True
    
    ws.Cells(1, 1).Value = "SUMMIT ELECTRICAL SALES"
    ws.Cells(1, 1).Font.Name = "Calibri"
    ws.Cells(1, 1).Font.Size = 16
    ws.Cells(1, 1).Font.Bold = True
    
    # Write items
    ws.Cells(3, 1).Value = "SKU / Line Item"
    ws.Cells(3, 2).Value = "Quantity"
    ws.Cells(3, 3).Value = "Net Total"
    ws.Rows(3).Font.Bold = True
    
    row = 4
    for item in data.get("items", []):
        ws.Cells(row, 1).Value = item.get("origText", "")
        ws.Cells(row, 2).Value = item.get("qty", 0)
        ws.Cells(row, 3).Value = item.get("price", 0.0)
        row += 1
        
    print("[Excel COM] Spreadsheet proposal generated successfully.")
    return True

# ──────────────────────────────────────────────────────────────────────
# PDF GENERATOR via ReportLab
# ──────────────────────────────────────────────────────────────────────

def build_pdf(data=None):
    from reportlab.lib.pagesizes import letter, landscape
    from reportlab.lib import colors
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    
    if not data:
        data = {
            "items": [
                {"qty": 1500, "origText": "Liberty Copper Cable 4/0 AWG THHN Copper Wire", "brandName": "Liberty Copper Cable", "insideRep": "Specialist B", "price": 5624.50, "weight": 1200}
            ],
            "total": 5624.50,
            "theme": "summit-slate",
            "layout": "portrait"
        }

    layout_val = data.get("layout", "portrait")
    pagesize = landscape(letter) if layout_val == "landscape" else letter
    
    output_path = "Summit_Quote_Proposal.pdf"
    doc = SimpleDocTemplate(
        output_path, 
        pagesize=pagesize,
        rightMargin=0.5*inch, 
        leftMargin=0.5*inch,
        topMargin=0.5*inch, 
        bottomMargin=0.5*inch
    )
    
    story = []
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'PDFTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=3
    )
    
    story.append(Paragraph("SUMMIT ELECTRICAL SALES PROPOSAL", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Write a simple table
    table_data = [["Line Item", "Qty", "Price"]]
    for item in data.get("items", []):
        table_data.append([item.get("origText", ""), str(item.get("qty", 0)), f"${item.get('price', 0.0):,.2f}"])
        
    t = Table(table_data, colWidths=[4*inch, 1*inch, 1.5*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,0), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey)
    ]))
    
    story.append(t)
    doc.build(story)
    print(f"[PDF] PDF generated successfully at {output_path}")
    return True
