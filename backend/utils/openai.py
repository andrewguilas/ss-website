from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv("backend/.env")

OPENAI_MODEL="gpt-4.1-nano"

load_dotenv()
client = OpenAI(api_key=os.getenv("OPEN_AI_KEY"))

def ask_openai(input):
    try:
        return client.responses.create(model=OPENAI_MODEL, input=input).output_text
    except Exception:
        return None
