import json
from datetime import datetime
from typing import Any, Dict

class Logger:
    def __init__(self, service: str = "app"):
        self.service = service

    def _log(self, level: str, message: str, payload: Dict[str, Any] | None = None):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "service": self.service,
            "level": level,
            "message": message,
        }
        if payload:
            log_entry["payload"] = payload

        print(json.dumps(log_entry, ensure_ascii=False))

    def info(self, message: str, payload: Dict[str, Any] | None = None):
        self._log("INFO", message, payload)

    def warn(self, message: str, payload: Dict[str, Any] | None = None):
        self._log("WARN", message, payload)

    def error(self, message: str, payload: Dict[str, Any] | None = None):
        self._log("ERROR", message, payload)
