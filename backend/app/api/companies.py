from fastapi import APIRouter, status

from app.api.deps import DbSession
from app.schemas.company import CompanyCreate, CompanyRead, CompanyUpdate

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("", response_model=list[CompanyRead])
def list_companies(db: DbSession) -> list[CompanyRead]:
    """Return all companies ordered by name."""
    # TODO(me): query companies.
    raise NotImplementedError


@router.post("", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate, db: DbSession) -> CompanyRead:
    """Create a company. Return 409 if the name already exists."""
    # TODO(me): insert the company; handle the unique-name conflict.
    raise NotImplementedError


@router.get("/{company_id}", response_model=CompanyRead)
def get_company(company_id: int, db: DbSession) -> CompanyRead:
    """Return one company or 404."""
    # TODO(me): fetch by id, 404 if missing.
    raise NotImplementedError


@router.patch("/{company_id}", response_model=CompanyRead)
def update_company(company_id: int, payload: CompanyUpdate, db: DbSession) -> CompanyRead:
    """Apply only the fields that were sent (`payload.model_dump(exclude_unset=True)`)."""
    # TODO(me): partial update; 404 if missing, 409 on duplicate name.
    raise NotImplementedError


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: DbSession) -> None:
    """Delete a company. Decide: block (409) if it still has applications, or cascade?"""
    # TODO(me): delete; pick and document the behaviour when applications reference it.
    raise NotImplementedError
