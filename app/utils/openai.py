from openai import OpenAI
from dotenv import load_dotenv

OPENAI_MODEL="gpt-4.1-nano"

load_dotenv()
client = OpenAI()

def ask_openai(input):
    try:
        return client.responses.create(model=OPENAI_MODEL, input=input).output_text
    except Exception:
        return None
