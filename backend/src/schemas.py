from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Dict, List, Any

# Auth schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str = Field(..., min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Case schemas
class CaseCreate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = None
    status: str = "open"
    priority: str = "medium"
    assigned_to: Optional[str] = None

class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_to: Optional[str] = None

class CaseOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    priority: str
    assigned_to: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Prediction schemas
class PredictRequest(BaseModel):
    hour: int = Field(..., ge=0, le=23)
    district: int = Field(..., ge=1, le=25)
    crime_type: str
    arrest_history: bool = False

class PredictResponse(BaseModel):
    priority: str
    confidence: float
    probabilities: Dict[str, float]
    feature_importances: Optional[Dict[str, float]] = None

# Crime data schemas
class CrimeRecord(BaseModel):
    id: Optional[str] = None
    case_number: Optional[str] = None
    date: Optional[str] = None
    primary_type: Optional[str] = None
    description: Optional[str] = None
    location_description: Optional[str] = None
    arrest: Optional[bool] = None
    domestic: Optional[bool] = None
    district: Optional[str] = None
    ward: Optional[str] = None
    community_area: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    
class CrimeSummary(BaseModel):
    total_records: int
    by_type: Dict[str, int]
    by_district: Dict[str, int]
    by_arrest: Dict[str, int]
    by_year: Dict[str, int]

class CrimeTrend(BaseModel):
    period: str
    count: int

class CrimeHotspot(BaseModel):
    latitude: float
    longitude: float
    count: int
    type: Optional[str] = None

# Health schema
class HealthOut(BaseModel):
    status: str
    database: bool
    model: bool
    data_source: bool
    version: str

# Report schema
class ReportSummary(BaseModel):
    total_cases: int
    total_crimes_fetched: int
    model_accuracy: Optional[float] = None
    generated_at: datetime
