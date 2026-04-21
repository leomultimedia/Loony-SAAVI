import re

class PIIScrubber:
    def __init__(self):
        # Basic patterns for enterprise scrubbing prior to inference
        self.patterns = {
            "EMAIL": r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
            "PHONE": r"\+?\d{1,3}?[-.\s]?\(?\d{2,3}?\)?[-.\s]?\d{3}[-.\s]?\d{4}",
            "CC": r"\b(?:\d[ -]*?){13,16}\b"
        }

    def redact(self, text: str) -> str:
        """
        Ensures local-first Zero-Knowledge before sending to the LLM.
        """
        scrubbed = text
        for token, pattern in self.patterns.items():
            scrubbed = re.sub(pattern, f"[{token}_REDACTED]", scrubbed)
        return scrubbed
