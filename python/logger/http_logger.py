from typing import Any, Dict
from .logger import Logger

class HttpLogger(Logger):
    def request(self, method: str, url: str, payload: Dict[str, Any] | None = None):
        self.info("HTTP Request", {
            "method": method,
            "url": url,
            "request": payload,
        })

    def response(self, method: str, url: str, status: int, payload: Dict[str, Any] | None = None):
        self.info("HTTP Response", {
            "method": method,
            "url": url,
            "status": status,
            "response": payload,
        })
