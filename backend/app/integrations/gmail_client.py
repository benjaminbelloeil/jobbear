"""Read-only Gmail access and email-to-application matching.

Scope: https://www.googleapis.com/auth/gmail.readonly (never request more).

Fetching:
    Fetch messages received since the last successful sync (use the newest
    emails.received_at as the cursor, or a stored checkpoint). Skip messages whose
    message_id is already in the emails table.

Matching, in order:
    1. Sender domain -> companies.domain (handle subdomains, e.g. `mail.stripe.com`,
       and ATS senders like greenhouse.io / lever.co / ashbyhq.com / myworkday.com,
       whose domain is NOT the company's).
    2. Company name appearing in the subject.
    If a company has several open applications, decide which one wins (most recent?).

Docs: https://developers.google.com/gmail/api/quickstart/python
"""

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy.orm import Session

from app.models import Application

GMAIL_SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


@dataclass(frozen=True)
class GmailMessage:
    message_id: str
    sender: str
    subject: str
    snippet: str
    received_at: datetime


def load_credentials(client_secrets_path: Path, token_path: Path) -> Any:
    """Load cached OAuth credentials, refreshing or running the local OAuth flow if needed."""
    # TODO(me): google_auth_oauthlib.flow.InstalledAppFlow + google.oauth2.credentials.
    raise NotImplementedError


def build_gmail_service(credentials: Any) -> Any:
    """Build the Gmail API client (googleapiclient.discovery.build)."""
    # TODO(me): implement.
    raise NotImplementedError


def fetch_messages_since(service: Any, since: datetime | None) -> list[GmailMessage]:
    """Fetch messages received after `since` (all recent ones if None), handling pagination."""
    # TODO(me): users().messages().list(q="after:...") then .get() each (metadata format).
    raise NotImplementedError


def sender_domain(sender: str) -> str | None:
    """Extract the lowercase domain from a From header like 'Stripe <jobs@stripe.com>'."""
    # TODO(me): implement (email.utils.parseaddr is your friend).
    raise NotImplementedError


def match_application(db: Session, message: GmailMessage) -> Application | None:
    """Find the application this email belongs to (see "Matching" above), or None."""
    # TODO(me): implement.
    raise NotImplementedError
