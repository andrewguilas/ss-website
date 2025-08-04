from datetime import datetime

def parse_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return 0
        
def parse_phone(raw_phone):
    # Format a US phone number as (xxx) xxx-xxxx

    digits = ''.join(filter(str.isdigit, str(raw_phone)))

    if digits.startswith('1') and len(digits) == 11:
        digits = digits[1:]

    if len(digits) != 10:
        return raw_phone

    area_code = digits[:3]
    prefix = digits[3:6]
    line_number = digits[6:]

    return f"({area_code}) {prefix}-{line_number}"
        
def parse_location(*args):
    return " ".join(filter(None, args))

def parse_date(date_str):
    # Converts date to YYYY-MM-DD format
    
    try:
        return datetime.strptime(date_str.strip(), "%Y-%m-%d").date()
    except (ValueError, AttributeError):
        return None
