"""Classify job emails with the Claude API.

Contract:
    Input: email subject + snippet.
    Output: strict JSON {"classification": <EmailClassification>, "confidence": 0..1,
            "company_guess": str | null}, validated into ClassificationResult.

Mapping to application status:
    OA_INVITE        -> OA
    INTERVIEW_INVITE -> INTERVIEWING
    REJECTION        -> REJECTED
    OFFER            -> OFFER
    CONFIRMATION / OTHER -> no status change

Only auto-update when confidence >= settings.classifier_confidence_threshold (0.8).
Below that, store the email unmatched for manual review.

Docs: https://docs.claude.com/en/api/messages  (and "structured outputs" / JSON mode)
"""

from anthropic import Anthropic
from pydantic import BaseModel, Field

from app.models import ApplicationStatus, EmailClassification


class ClassificationResult(BaseModel):
    classification: EmailClassification
    confidence: float = Field(ge=0, le=1)
    company_guess: str | None = None


def build_client(api_key: str) -> Anthropic:
    """Create the Anthropic client."""
    # TODO(me): construct the client (fail clearly if the key is empty).
    raise NotImplementedError


def classify_email(
    client: Anthropic, model: str, subject: str, snippet: str
) -> ClassificationResult:
    """Ask Claude to classify one email and parse its JSON answer.

    Handle: invalid JSON or schema mismatch (fall back to OTHER with confidence 0),
    and API errors (let them propagate so the sync can retry next run).
    """
    # TODO(me): write the prompt, call client.messages.create, validate the JSON.
    raise NotImplementedError


def status_for_classification(classification: EmailClassification) -> ApplicationStatus | None:
    """Map a classification to the status it implies, or None (see module docstring)."""
    # TODO(me): implement the mapping.
    raise NotImplementedError


def should_auto_update(result: ClassificationResult, threshold: float) -> bool:
    """True if the result is confident enough to change an application's status."""
    # TODO(me): implement.
    raise NotImplementedError
