from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CompanyBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    domain: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=500)
    location: str | None = Field(default=None, max_length=200)


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    domain: str | None = Field(default=None, max_length=255)
    website: str | None = Field(default=None, max_length=500)
    location: str | None = Field(default=None, max_length=200)


class CompanyRead(CompanyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
