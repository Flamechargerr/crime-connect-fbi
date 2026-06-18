from fastapi import APIRouter, Depends, HTTPException
from backend.src.schemas import PredictRequest, PredictResponse
from backend.src.services.ml_engine import MLEngine
from backend.src.routers.auth import get_current_user
from backend.src.models import User

router = APIRouter(prefix="/api/predict", tags=["predictions"])
engine = MLEngine()

@router.post("", response_model=PredictResponse)
async def predict(data: PredictRequest, current_user: User = Depends(get_current_user)):
    """Predict crime priority based on input features."""
    try:
        result = engine.predict(
            hour=data.hour,
            district=data.district,
            crime_type=data.crime_type,
            arrest_history=data.arrest_history,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    """Get model performance statistics."""
    return engine.get_stats()
