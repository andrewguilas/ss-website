import pytest
from app.utils.parsing import parse_int, parse_phone, parse_location, parse_date
from datetime import date

# --- parse_int ---
def test_parse_int_valid():
    assert parse_int("42") == 42
    assert parse_int(123) == 123

def test_parse_int_invalid():
    assert parse_int("notanumber") == 0
    assert parse_int(None) == 0
    assert parse_int("") == 0

# --- parse_phone ---
def test_parse_phone_valid():
    assert parse_phone("9293399244") == "(929) 339-9244"
    assert parse_phone("19293399244") == "(929) 339-9244"
    assert parse_phone("(929) 339-9244") == "(929) 339-9244"
    assert parse_phone("929-339-9244") == "(929) 339-9244"

def test_parse_phone_invalid():
    assert parse_phone("1234567") == "1234567"         # too short
    assert parse_phone("abcdefg") == "abcdefg"         # non-digit
    assert parse_phone(None) == None               # stringified

# --- parse_location ---
def test_parse_location_all_values():
    assert parse_location("Dorm", "101", "A", "123 Main St") == "Dorm 101 A 123 Main St"

def test_parse_location_with_nones():
    assert parse_location("Dorm", None, "", "123 Main St") == "Dorm 123 Main St"

# --- parse_date ---
def test_parse_date_valid():
    assert parse_date("2025-08-03") == date(2025, 8, 3)

def test_parse_date_invalid():
    assert parse_date("08-03-2025") is None            # wrong format
    assert parse_date("not a date") is None
    assert parse_date(None) is None
    assert parse_date("") is None
