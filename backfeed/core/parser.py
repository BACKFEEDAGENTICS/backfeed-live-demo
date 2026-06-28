import re

def parse_rfq_text(text: str) -> list:
    """Parses raw email/RFQ text to extract quantities and item descriptions.
    
    Designed to handle common formats like:
    - 50 pcs 200A Main Breaker Panel (PNL-200A)
    - 1,500 ft WIR-XHHW6
    """
    lines = text.split('\n')
    extracted = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Matches numbers (including commas, e.g., 1,500)
        qty_match = re.search(r'\b([0-9,]+)\b', line)
        if not qty_match:
            continue
            
        qty_str = qty_match.group(1).replace(',', '')
        try:
            qty = int(qty_str)
        except ValueError:
            continue
            
        # Strip the quantity from the description
        desc = line.replace(qty_match.group(0), '').strip()
        
        # Clean up leading list bullets, quantity suffixes, and punctuation
        desc = re.sub(r'^(pcs|ft|sticks|rolls|meters|units|ea|each|•|-|\*)\b', '', desc, flags=re.IGNORECASE).strip()
        desc = re.sub(r'^[•\-\*\s:,]+', '', desc).strip()
        
        if desc and len(desc) > 2:
            extracted.append({
                "qty": qty,
                "description": desc
            })
            
    return extracted
