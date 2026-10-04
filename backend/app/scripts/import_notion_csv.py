"""Import the Notion "DB Applications" CSV export.

Usage:
    cd backend && uv run python -m app.scripts.import_notion_csv path/to/export.csv [--dry-run]

Notion columns: Company, Position, Status, Next Action, Application Date

Status mapping (Notion -> JobBear):
    Applied -> APPLIED, Interviewed -> INTERVIEWING, Offer -> OFFER,
    Accepted -> ACCEPTED, Rejected -> REJECTED, Ghosted -> GHOSTED

Next Action mapping:
    Follow up -> FOLLOW_UP, Waiting -> WAITING, Prepare Interview -> PREPARE_INTERVIEW,
    Send email -> SEND_EMAIL, Decide -> DECIDE, Rejected / Ghosted -> NONE

Rules:
    - Create companies as needed (match existing ones case-insensitively).
    - Write one status_events row per imported application (source=SYSTEM,
      note="Imported from Notion").
    - Re-running must not create duplicates (decide what makes a row "the same").
    - Notion dates look like "September 3, 2026"; unknown values should be reported, not
      silently dropped.
"""

import argparse
from pathlib import Path

from sqlalchemy.orm import Session


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0] if __doc__ else None)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--dry-run", action="store_true", help="Parse and report; write nothing.")
    return parser.parse_args()


def import_csv(db: Session, csv_path: Path, dry_run: bool = False) -> int:
    """Import rows from `csv_path` and return how many applications were created."""
    # TODO(me): read with csv.DictReader, map statuses/actions, upsert companies,
    #           create applications + events, commit (or roll back on --dry-run).
    raise NotImplementedError


def main() -> None:
    # TODO(me): parse_args(), open a SessionLocal, call import_csv, print a summary.
    raise NotImplementedError


if __name__ == "__main__":
    main()
