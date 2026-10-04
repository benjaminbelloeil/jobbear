"""Domain enums shared by models, schemas, and services."""

from enum import StrEnum


class ApplicationStatus(StrEnum):
    APPLIED = "APPLIED"
    OA = "OA"
    INTERVIEWING = "INTERVIEWING"
    OFFER = "OFFER"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    GHOSTED = "GHOSTED"
    WITHDRAWN = "WITHDRAWN"


class NextAction(StrEnum):
    FOLLOW_UP = "FOLLOW_UP"
    WAITING = "WAITING"
    PREPARE_OA = "PREPARE_OA"
    PREPARE_INTERVIEW = "PREPARE_INTERVIEW"
    SEND_EMAIL = "SEND_EMAIL"
    DECIDE = "DECIDE"
    NONE = "NONE"


class ApplicationSource(StrEnum):
    ATS = "ATS"
    REFERRAL = "REFERRAL"
    LINKEDIN = "LINKEDIN"
    COMPANY_SITE = "COMPANY_SITE"
    OTHER = "OTHER"


class EmailClassification(StrEnum):
    REJECTION = "REJECTION"
    OA_INVITE = "OA_INVITE"
    INTERVIEW_INVITE = "INTERVIEW_INVITE"
    OFFER = "OFFER"
    CONFIRMATION = "CONFIRMATION"
    OTHER = "OTHER"


class EventSource(StrEnum):
    MANUAL = "MANUAL"
    EMAIL = "EMAIL"
    SYSTEM = "SYSTEM"
