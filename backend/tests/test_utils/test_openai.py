import pytest
from unittest.mock import patch, MagicMock

from backend.utils.openai import ask_openai

@patch("backend.utils.openai.client")
def test_ask_openai_success(mock_client):
    mock_response = MagicMock()
    mock_response.output_text = "test-pronunciation"
    mock_client.responses.create.return_value = mock_response

    result = ask_openai("How do you pronounce Andrew?")
    assert result == "test-pronunciation"
    mock_client.responses.create.assert_called_once_with(model="gpt-4.1-nano", input="How do you pronounce Andrew?")

@patch("backend.utils.openai.client")
def test_ask_openai_exception(mock_client):
    mock_client.responses.create.side_effect = Exception("API failed")
    result = ask_openai("This will fail")
    assert result is None
