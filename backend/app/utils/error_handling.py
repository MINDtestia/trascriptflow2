from enum import Enum
from functools import wraps
from typing import Any, Callable, Dict, Optional

class ErrorType(Enum):
    NETWORK = "network"
    VALIDATION = "validation"
    PROCESSING = "processing"
    INPUT_ERROR = "input_error"
    PROCESSING_ERROR = "processing_error"

class AppError(Exception):
    def __init__(
        self,
        message: str,
        error_type: ErrorType,
        error_code: str,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.error_type = error_type
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)

def handle_error(
    error: Exception,
    error_type: ErrorType,
    error_code: str,
    details: Optional[Dict[str, Any]] = None
) -> str:
    raise AppError(
        message=str(error),
        error_type=error_type,
        error_code=error_code,
        details=details
    )

def handle_error_decorator(error_type: ErrorType, error_code: str):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                return handle_error(e, error_type, error_code)
        return wrapper
    return decorator 