"""
Python script to generate KannadaSaathi Hackathon Presentation PPTX
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen format
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_slide_layout = prs.slide_layouts[6]

    # Brand Colors (Karnataka flag-inspired: Pure Yellow #FFFF00, Pure Red #FF0000, Black #000000, White #FFFFFF)
    COLOR_YELLOW = RGBColor(255, 255, 0)      # #FFFF00 (Pure Yellow)
    COLOR_RED = RGBColor(255, 0, 0)           # #FF0000 (Pure Red)
    COLOR_CREAM = RGBColor(255, 255, 255)     # #FFFFFF (Pure White)
    COLOR_CREAM_CARD = RGBColor(250, 250, 250)# #FAFAFA
    COLOR_MAROON = RGBColor(0, 0, 0)          # #000000 (Pure Black)
    COLOR_WHITE = RGBColor(255, 255, 255)     # #FFFFFF
    COLOR_BORDER = RGBColor(224, 224, 224)    # #E0E0E0
    COLOR_MUTED = RGBColor(80, 80, 80)        # #505050
    COLOR_GOLD_DARK = RGBColor(0, 0, 0)       # #000000
    COLOR_BLACK = RGBColor(0, 0, 0)           # #000000

    logo_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "client", "public", "logo", "kannadasaathi-logo.png"))
    has_logo = os.path.exists(logo_path)

    def set_slide_background(slide, color=COLOR_CREAM):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background() # No border
        return bg

    def add_top_bar(slide, title_text, category_tag="ಕನ್ನಡಸಾಥಿ • KANNADASAATHI"):
        # Top banner with gradient effect simulation (yellow and red strips)
        strip_y = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.12))
        strip_y.fill.solid()
        strip_y.fill.fore_color.rgb = COLOR_YELLOW
        strip_y.line.fill.background()

        strip_r = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(0.12), prs.slide_width, Inches(0.04))
        strip_r.fill.solid()
        strip_r.fill.fore_color.rgb = COLOR_RED
        strip_r.line.fill.background()

        # Category pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(3.2), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = COLOR_RED
        pill.line.fill.background()
        tf = pill.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = category_tag
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        p.alignment = PP_ALIGN.CENTER

        # Slide Title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(10.5), Inches(0.8))
        tf_title = tb.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_MAROON

        # Small corner logo if present
        if has_logo:
            slide.shapes.add_picture(logo_path, Inches(12.0), Inches(0.35), Inches(0.85), Inches(0.85))

    def add_card(slide, left, top, width, height, title, items, badge="", bg_color=COLOR_WHITE, border_color=COLOR_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.3)
        tf.margin_bottom = Inches(0.3)

        # Title
        p_title = tf.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(18)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_RED

        if badge:
            p_badge = tf.add_paragraph()
            p_badge.text = badge
            p_badge.font.size = Pt(11)
            p_badge.font.bold = True
            p_badge.font.color.rgb = COLOR_GOLD_DARK
            p_badge.space_after = Pt(8)

        # Bullet items
        for item in items:
            p_item = tf.add_paragraph()
            p_item.text = f"•  {item}"
            p_item.font.size = Pt(13)
            p_item.font.color.rgb = COLOR_MAROON
            p_item.space_after = Pt(6)

    # -------------------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------------------
    slide1 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide1, COLOR_CREAM)

    # Top yellow/red ribbon
    s1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, Inches(0.18))
    s1.fill.solid()
    s1.fill.fore_color.rgb = COLOR_YELLOW
    s1.line.fill.background()

    s2 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(0.18), prs.slide_width, Inches(0.06))
    s2.fill.solid()
    s2.fill.fore_color.rgb = COLOR_RED
    s2.line.fill.background()

    # Center Logo
    if has_logo:
        slide1.shapes.add_picture(logo_path, Inches(5.85), Inches(0.7), Inches(1.65), Inches(1.65))

    # Project Title Box
    tb_main = slide1.shapes.add_textbox(Inches(1.0), Inches(2.45), Inches(11.333), Inches(2.0))
    tf1 = tb_main.text_frame
    tf1.word_wrap = True

    p1 = tf1.paragraphs[0]
    p1.text = "ಕನ್ನಡಸಾಥಿ — KannadaSaathi"
    p1.font.size = Pt(38)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_BLACK
    p1.alignment = PP_ALIGN.CENTER

    p2 = tf1.add_paragraph()
    p2.text = "Real-Time Kannada Life Assistant"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_MAROON
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf1.add_paragraph()
    p3.text = "ನೋಡು • ಮಾತನಾಡು • ತಿಳಿದುಕೋ • ಪರಿಹರಿಸು (See • Speak • Understand • Solve)"
    p3.font.size = Pt(15)
    p3.font.bold = True
    p3.font.color.rgb = COLOR_GOLD_DARK
    p3.alignment = PP_ALIGN.CENTER

    # Presenter Information Card
    info_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.5), Inches(4.7), Inches(8.333), Inches(2.1))
    info_card.fill.solid()
    info_card.fill.fore_color.rgb = COLOR_WHITE
    info_card.line.color.rgb = COLOR_YELLOW
    info_card.line.width = Pt(2)

    tf_info = info_card.text_frame
    tf_info.word_wrap = True
    tf_info.margin_top = Inches(0.25)

    pi_0 = tf_info.paragraphs[0]
    pi_0.text = "HACKATHON SUBMISSION DETAILS"
    pi_0.font.size = Pt(12)
    pi_0.font.bold = True
    pi_0.font.color.rgb = COLOR_RED
    pi_0.alignment = PP_ALIGN.CENTER

    pi_1 = tf_info.add_paragraph()
    pi_1.text = "Participant / Presenter:  [Your Name / Student ID Placeholder]"
    pi_1.font.size = Pt(13)
    pi_1.font.color.rgb = COLOR_MAROON
    pi_1.alignment = PP_ALIGN.CENTER

    pi_2 = tf_info.add_paragraph()
    pi_2.text = "Institution:  [Your College / University Name Placeholder]"
    pi_2.font.size = Pt(13)
    pi_2.font.color.rgb = COLOR_MAROON
    pi_2.alignment = PP_ALIGN.CENTER

    pi_3 = tf_info.add_paragraph()
    pi_3.text = "Track / Category:  [Official Hackathon Track e.g. Regional AI / Citizen Tech]"
    pi_3.font.size = Pt(13)
    pi_3.font.bold = True
    pi_3.font.color.rgb = COLOR_GOLD_DARK
    pi_3.alignment = PP_ALIGN.CENTER

    # -------------------------------------------------------------------------
    # SLIDE 2: Problem Statement
    # -------------------------------------------------------------------------
    slide2 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide2)
    add_top_bar(slide2, "The Real-World Challenge in Karnataka")

    # Official Problem Statement Box (Callout)
    callout = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.733), Inches(1.15))
    callout.fill.solid()
    callout.fill.fore_color.rgb = RGBColor(255, 235, 238)
    callout.line.color.rgb = COLOR_RED
    callout.line.width = Pt(1.5)
    tf_c = callout.text_frame
    tf_c.word_wrap = True
    p_c1 = tf_c.paragraphs[0]
    p_c1.text = "SELECTED OFFICIAL HACKATHON PROBLEM STATEMENT:"
    p_c1.font.size = Pt(11)
    p_c1.font.bold = True
    p_c1.font.color.rgb = COLOR_RED
    p_c2 = tf_c.add_paragraph()
    p_c2.text = "[Insert Exact Official Problem Statement Title / ID from your Hackathon portal here]"
    p_c2.font.size = Pt(13)
    p_c2.font.italic = True
    p_c2.font.color.rgb = COLOR_MAROON

    # 3 Problem Cards
    add_card(slide2, Inches(0.8), Inches(2.95), Inches(3.65), Inches(4.0),
             "1. Language & Bureaucracy",
             [
                 "65+ million Kannada speakers encounter official notices, circulars, and bills in dense administrative text or English.",
                 "Students miss scholarship deadlines due to complex circular wording.",
                 "Citizens struggle to interpret BESCOM meter charges or Sakala guarantee terms."
             ],
             "Accessibility Gap")

    add_card(slide2, Inches(4.84), Inches(2.95), Inches(3.65), Inches(4.0),
             "2. AI Hallucination Trap",
             [
                 "Generic chatbots (ChatGPT) frequently hallucinate Karnataka scheme rules.",
                 "Fake application deadlines and fabricated criteria misguide rural citizens.",
                 "Lack of verified local source links, timestamps, and authentic portals (Seva Sindhu, KSAMB)."
             ],
             "Misinformation Risk")

    add_card(slide2, Inches(8.88), Inches(2.95), Inches(3.65), Inches(4.0),
             "3. Tool Fragmentation",
             [
                 "Users currently juggle separate scanner apps, weather websites, translation tools, and reminders.",
                 "No unified bridge to turn an analyzed document into an actionable checklist.",
                 "Result: High cognitive load and missed deadlines for rural and student users."
             ],
             "Execution Friction")

    # -------------------------------------------------------------------------
    # SLIDE 3: Our Solution — KannadaSaathi
    # -------------------------------------------------------------------------
    slide3 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide3)
    add_top_bar(slide3, "Our Solution — KannadaSaathi (ಕನ್ನಡಸಾಥಿ)")

    add_card(slide3, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.35),
             "A Kannada-First Life Assistant",
             [
                 "Empathetic & Culturally Grounded: Built specifically for the everyday administrative, agricultural, and educational challenges of Karnataka.",
                 "Beyond Text Chat: Unifies multimodal vision, native speech, verified public data, and task execution in a single responsive web platform.",
                 "Strict Anti-Hallucination Policy: Always separates verified official facts from conversational Kannada explanations.",
                 "Reliable Offline Fallback: Fully functional Demo Mode ensures evaluating judges never face broken screens or missing API keys.",
                 "100% Privacy Focused: Checklists and reminders stored in private client-side storage."
             ],
             "Tagline: See • Speak • Understand • Solve",
             COLOR_CREAM_CARD, COLOR_YELLOW)

    # 4 Pillars Mini-Cards on Right
    p_data = [
        ("ನೋಡು (See)", "Multimodal Camera Vision", "Analyzes circulars, electricity bills, and plant leaves; extracts fees, dates, and instructions."),
        ("ಮಾತನಾಡು (Speak)", "Kannada Voice Assistant", "Continuous speech recognition (kn-IN) with editable transcript and audio voice playback."),
        ("ತಿಳಿದುಕೋ (Explore)", "Current Information Explorer", "Live Open-Meteo weather with GPS + verified official Karnataka schemes & mandi rates."),
        ("ಪರಿಹರಿಸು (Solve)", "Action Plans & Reminders", "Bilingual step-by-step plans, interactive checklists with progress bars, and smart reminders.")
    ]
    top_pos = Inches(1.6)
    for title_p, sub_p, desc_p in p_data:
        p_card = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), top_pos, Inches(5.733), Inches(1.15))
        p_card.fill.solid()
        p_card.fill.fore_color.rgb = COLOR_WHITE
        p_card.line.color.rgb = COLOR_BORDER
        tf_pc = p_card.text_frame
        tf_pc.word_wrap = True
        tf_pc.margin_top = Inches(0.12)
        tf_pc.margin_left = Inches(0.2)
        p_t = tf_pc.paragraphs[0]
        p_t.text = f"{title_p} — {sub_p}"
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_RED
        p_d = tf_pc.add_paragraph()
        p_d.text = desc_p
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_MAROON
        top_pos += Inches(1.35)

    # -------------------------------------------------------------------------
    # SLIDE 4: Key Features Breakdown
    # -------------------------------------------------------------------------
    slide4 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide4)
    add_top_bar(slide4, "Four Interconnected Core Capabilities")

    add_card(slide4, Inches(0.8), Inches(1.6), Inches(2.75), Inches(5.35),
             "ನೋಡು (See)",
             [
                 "Multimodal Vision AI for documents & photos.",
                 "5-Part Structured Kannada Breakdown:",
                 "  1. What it contains",
                 "  2. Extracted text",
                 "  3. Exact dates & fees",
                 "  4. Next actionable steps",
                 "  5. Verification warnings",
                 "Instant test scenarios for circulars, bills, and crops."
             ],
             "Multimodal Vision")

    add_card(slide4, Inches(3.75), Inches(1.6), Inches(2.75), Inches(5.35),
             "ಮಾತನಾಡು (Speak)",
             [
                 "Web Speech API (kn-IN) with mic permission handling.",
                 "Pre-send editable transcript input (inspect & fix speech).",
                 "Culturally natural Kannada conversational replies.",
                 "Voice audio playback with start & stop controls.",
                 "Graceful fallbacks if browser voice is missing."
             ],
             "Voice Assistant")

    add_card(slide4, Inches(6.70), Inches(1.6), Inches(2.75), Inches(5.35),
             "ತಿಳಿದುಕೋ (Explore)",
             [
                 "Live satellite weather from Open-Meteo across Karnataka.",
                 "Voluntary GPS geolocation and district dropdown.",
                 "Verified Citizen Channels: Gruha Jyothi, Shakti bus, APMC mandi rates, SSP scholarships.",
                 "Source links & ISO timestamps displayed.",
                 "Strict anti-hallucination rejection."
             ],
             "Real-Time Information")

    add_card(slide4, Inches(9.65), Inches(1.6), Inches(2.88), Inches(5.35),
             "ಪರಿಹರಿಸು (Solve)",
             [
                 "Bilingual Action Plan Generator (SSP, exams, MSME, hackathons).",
                 "Required documents list & duration estimates.",
                 "Interactive Checklist with progress bar (X/Y completed %).",
                 "Smart reminders with date/time validation.",
                 "Browser notification support & in-app chime fallbacks."
             ],
             "Action & Reminders")

    # -------------------------------------------------------------------------
    # SLIDE 5: How It Works — End-to-End User Journey
    # -------------------------------------------------------------------------
    slide5 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide5)
    add_top_bar(slide5, "How It Works — Seamless User Journey")

    journey_steps = [
        ("Step 1: Input", "User Captures / Speaks", "User snaps a college circular, speaks a voice question in Kannada, or searches a scheme query."),
        ("Step 2: Processing", "Backend Validation", "Multer validates images (5MB max). Open-Meteo fetches weather. Gemini / Curated library reasons."),
        ("Step 3: Synthesis", "Structured Kannada Output", "Presents results in fluent Kannada, strictly separating verified facts from explanations."),
        ("Step 4: Bridge", "One-Click Workflow", "User clicks 'Make Checklist' or 'Create Action Plan' to transfer findings directly into tasks."),
        ("Step 5: Execution", "Tracking & Reminders", "User checks off completed tasks, views visual progress bar, and receives scheduled deadline chimes.")
    ]

    left_j = Inches(0.8)
    for num, title_j, desc_j in journey_steps:
        box_j = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_j, Inches(1.8), Inches(2.18), Inches(4.9))
        box_j.fill.solid()
        box_j.fill.fore_color.rgb = COLOR_WHITE
        box_j.line.color.rgb = COLOR_RED
        box_j.line.width = Pt(1.5)

        tf_j = box_j.text_frame
        tf_j.word_wrap = True
        tf_j.margin_top = Inches(0.2)
        tf_j.margin_left = Inches(0.15)
        tf_j.margin_right = Inches(0.15)

        p_num = tf_j.paragraphs[0]
        p_num.text = num
        p_num.font.size = Pt(12)
        p_num.font.bold = True
        p_num.font.color.rgb = COLOR_GOLD_DARK

        p_tj = tf_j.add_paragraph()
        p_tj.text = title_j
        p_tj.font.size = Pt(15)
        p_tj.font.bold = True
        p_tj.font.color.rgb = COLOR_RED
        p_tj.space_after = Pt(10)

        p_dj = tf_j.add_paragraph()
        p_dj.text = desc_j
        p_dj.font.size = Pt(11)
        p_dj.font.color.rgb = COLOR_MAROON
        p_dj.space_after = Pt(6)

        left_j += Inches(2.4)

    # -------------------------------------------------------------------------
    # SLIDE 6: Technology Stack
    # -------------------------------------------------------------------------
    slide6 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide6)
    add_top_bar(slide6, "Verified Technology Stack (No Phantom APIs)")

    add_card(slide6, Inches(0.8), Inches(1.6), Inches(3.65), Inches(5.35),
             "Frontend Layer",
             [
                 "React 19 & Vite 8: Lightning-fast rendering and sub-400ms production builds.",
                 "Vanilla CSS Design System: 100% custom tokens adhering to Karnataka colors (#FFD600, #D71920, #541515). Zero bloated frameworks.",
                 "Web Speech API: Native Kannada recognition (kn-IN) & SpeechSynthesis.",
                 "Browser Geolocation API: Voluntary GPS district coordinates.",
                 "HTML5 Web Notifications: Local scheduled alerts."
             ],
             "Client-Side Architecture")

    add_card(slide6, Inches(4.84), Inches(1.6), Inches(3.65), Inches(5.35),
             "Backend Layer",
             [
                 "Node.js & Express.js: Stateless REST API on port 5000.",
                 "Multer: Multipart image upload handling with 5MB cap & MIME validation.",
                 "CORS & Input Validation: Robust request sanitization and error handling.",
                 "5 Modular Test Suites: 100% test coverage across all features.",
                 "Zero Secret Leaks: All API keys kept strictly in server-side .env."
             ],
             "Server-Side Engine")

    add_card(slide6, Inches(8.88), Inches(1.6), Inches(3.65), Inches(5.35),
             "APIs & Data Channels",
             [
                 "Open-Meteo Geocoding & Forecast API: Free, documented, zero-key, high-reliability weather.",
                 "Google Gemini 1.5 Flash: Optional server-side multimodal AI for live vision reasoning.",
                 "Curated Citizen Database: Verified Karnataka government portals (Seva Sindhu, KSAMB APMC, SSP).",
                 "Client LocalStorage: 100% private client-side persistence for checklists and reminders."
             ],
             "Verified Integrations")

    # -------------------------------------------------------------------------
    # SLIDE 7: Innovation & Social Impact
    # -------------------------------------------------------------------------
    slide7 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide7)
    add_top_bar(slide7, "Innovation & Social Impact")

    add_card(slide7, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.35),
             "Key Innovations",
             [
                 "Beyond Text-Only Chatbots: Transforms passive AI replies into structured action plans, interactive checklists, and reminders.",
                 "Empathetic Multimodal Breakdown: Specifically highlights penalty deadlines and fees so rural citizens never lose money.",
                 "Strict Anti-Hallucination Guardrails: Separates verified facts from conversational summaries with source URL attribution.",
                 "Bilingual Flexibility: Seamlessly switch between Kannada and English on any action plan.",
                 "Zero-Config Offline Resilience: Labeled Demo Mode allows uninterrupted judging regardless of API availability."
             ],
             "Why KannadaSaathi Stands Out")

    add_card(slide7, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.35),
             "Measurable Social Impact",
             [
                 "Students: Understanding university circulars, fee deadlines, and applying for SSP scholarships with NPCI bank guidance.",
                 "Farmers: Checking APMC mandi market crop rates, diagnosis of plant leaf disease, and helpline access.",
                 "General Citizens: Decoding BESCOM electricity bills, applying for Gruha Jyothi 200 units, and Sakala 1902 grievance services.",
                 "Digital Inclusion: Democratizing AI for non-English speakers across Karnataka's tier-2, tier-3 cities and villages."
             ],
             "Who Benefits in Karnataka")

    # -------------------------------------------------------------------------
    # SLIDE 8: Live Demo Sequence (Judge Walkthrough)
    # -------------------------------------------------------------------------
    slide8 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide8)
    add_top_bar(slide8, "Live Demonstration Sequence (2.5 Minutes)")

    demo_steps = [
        ("01", "See (ನೋಡು)", "College Circular Analysis",
         "Click sample 'ಕಾಲೇಜು ಪರೀಕ್ಷಾ ಸುತ್ತೋಲೆ'. Shows instant 5-part Kannada breakdown with ₹1,850 fee and Nov 28 deadline. Click 'ಕ್ರಿಯಾ ಯೋಜನೆ ರಚಿಸಿ'."),
        ("02", "Speak (ಮಾತನಾಡು)", "Voice Assistant in Kannada",
         "Select prompt 'ರೈತರಿಗೆ ಕೃಷಿ ಇಲಾಖೆಯ ಸಬ್ಸಿಡಿ ವಿವರ ತಿಳಿಸಿ'. Inspect editable transcript and play natural Kannada spoken audio via 'ಆಲಿಸಿ'."),
        ("03", "Explore (ತಿಳಿದುಕೋ)", "Live Weather & Scheme Data",
         "Select 'ಮೈಸೂರು' for live Open-Meteo weather. Click 'ಗೃಹ ಜ್ಯೋತಿ 200 ಯೂನಿಟ್' to showcase verified facts separated from explanation with source link."),
        ("04", "Solve (ಪರಿಹರಿಸು)", "Action Plan & Checklist",
         "Generate bilingual SSP scholarship plan. Toggle 'English' view. Convert to checklist; check off tasks to see live progress bar and chime.")
    ]

    left_d = Inches(0.8)
    for num_d, title_d, sub_d, desc_d in demo_steps:
        box_d = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_d, Inches(1.8), Inches(2.72), Inches(5.0))
        box_d.fill.solid()
        box_d.fill.fore_color.rgb = COLOR_WHITE
        box_d.line.color.rgb = COLOR_YELLOW
        box_d.line.width = Pt(1.5)

        tf_d = box_d.text_frame
        tf_d.word_wrap = True
        tf_d.margin_top = Inches(0.2)
        tf_d.margin_left = Inches(0.18)
        tf_d.margin_right = Inches(0.18)

        p_nd = tf_d.paragraphs[0]
        p_nd.text = f"PHASE {num_d}"
        p_nd.font.size = Pt(12)
        p_nd.font.bold = True
        p_nd.font.color.rgb = COLOR_GOLD_DARK

        p_td = tf_d.add_paragraph()
        p_td.text = title_d
        p_td.font.size = Pt(17)
        p_td.font.bold = True
        p_td.font.color.rgb = COLOR_RED

        p_sd = tf_d.add_paragraph()
        p_sd.text = sub_d
        p_sd.font.size = Pt(11)
        p_sd.font.bold = True
        p_sd.font.color.rgb = COLOR_MUTED
        p_sd.space_after = Pt(10)

        p_dd = tf_d.add_paragraph()
        p_dd.text = desc_d
        p_dd.font.size = Pt(11)
        p_dd.font.color.rgb = COLOR_MAROON

        left_d += Inches(2.95)

    # -------------------------------------------------------------------------
    # SLIDE 9: Transparent Limitations & Future Scope
    # -------------------------------------------------------------------------
    slide9 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide9)
    add_top_bar(slide9, "Transparent Limitations & Future Scope")

    add_card(slide9, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.35),
             "Honest Current Limitations",
             [
                 "Browser Speech Recognition: Chrome and Edge provide native kn-IN engines; other browsers fall back to editable text typing.",
                 "Notifications When App is Closed: Local Web Notifications fire when the browser is active; true background push requires Service Workers.",
                 "Arbitrary Web Search: Unverified queries outside Karnataka citizen portals are safely rejected to prevent hallucinations.",
                 "Hardware GPS: Mobile GPS coordinates require user permission; manual district picker serves as instant fallback."
             ],
             "Current Boundaries")

    add_card(slide9, Inches(6.8), Inches(1.6), Inches(5.733), Inches(5.35),
             "Future Development Roadmap",
             [
                 "Progressive Web App (PWA): Offline asset caching and Push Notification Service Worker when browser is closed.",
                 "Direct e-NAM API: Real-time agricultural mandi commodity prices directly from Karnataka APMC market servers.",
                 "Dialect Expansion: Voice support for North Karnataka, Mangalore, and regional Tulu / Kodava dialects.",
                 "WhatsApp / Telegram Bot Bridge: Accessing KannadaSaathi's action plans directly on mobile messaging apps."
             ],
             "Next Steps")

    # -------------------------------------------------------------------------
    # SLIDE 10: Conclusion & Submission Summary
    # -------------------------------------------------------------------------
    slide10 = prs.slides.add_slide(blank_slide_layout)
    set_slide_background(slide10)
    add_top_bar(slide10, "Conclusion — Empowering Karnataka in Kannada")

    add_card(slide10, Inches(0.8), Inches(1.6), Inches(11.733), Inches(3.2),
             "Why KannadaSaathi Matters",
             [
                 "True Linguistic Empowerment: Gives 65M+ Kannada speakers equal access to AI without language barriers.",
                 "Action-Oriented Utility: Not just another chat interface, but a complete workflow to understand, decide, and act.",
                 "Production-Ready Engineering: 100% verified test suites, responsive design, and robust fallback architecture.",
                 "Culturally Authentic: Built with deep respect for Karnataka's heritage, official portals, and citizen needs."
             ],
             "Summary of Value Proposition")

    # Submission Links & Call to Action Box
    box_sub = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(5.05), Inches(11.733), Inches(1.9))
    box_sub.fill.solid()
    box_sub.fill.fore_color.rgb = COLOR_WHITE
    box_sub.line.color.rgb = COLOR_RED
    box_sub.line.width = Pt(2)

    tf_s = box_sub.text_frame
    tf_s.word_wrap = True
    tf_s.margin_left = Inches(0.4)
    tf_s.margin_top = Inches(0.2)

    ps_0 = tf_s.paragraphs[0]
    ps_0.text = "PROJECT LINKS & SUBMISSION CHECKLIST"
    ps_0.font.size = Pt(12)
    ps_0.font.bold = True
    ps_0.font.color.rgb = COLOR_RED

    ps_1 = tf_s.add_paragraph()
    ps_1.text = "GitHub Repository:  [Insert your GitHub Repo URL here]"
    ps_1.font.size = Pt(13)
    ps_1.font.color.rgb = COLOR_MAROON

    ps_2 = tf_s.add_paragraph()
    ps_2.text = "Live Demo / Video Pitch:  [Insert Live URL or Video Link here]"
    ps_2.font.size = Pt(13)
    ps_2.font.color.rgb = COLOR_MAROON

    ps_3 = tf_s.add_paragraph()
    ps_3.text = "ಧನ್ಯವಾದಗಳು! (Thank you!) — Questions & Discussion"
    ps_3.font.size = Pt(14)
    ps_3.font.bold = True
    ps_3.font.color.rgb = COLOR_GOLD_DARK

    # Save Presentation
    output_filename = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "KannadaSaathi_Presentation.pptx"))
    prs.save(output_filename)
    print(f"[SUCCESS] Presentation saved successfully to: {output_filename}")

if __name__ == "__main__":
    create_deck()
