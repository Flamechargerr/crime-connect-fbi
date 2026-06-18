from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from backend.src.routers.auth import get_current_user
from backend.src.models import User
from backend.src.services.chicago_data import ChicagoDataService
from backend.src.services.ml_engine import MLEngine

router = APIRouter(prefix="/api/reports", tags=["reports"])
chicago_service = ChicagoDataService()
ml_engine = MLEngine()

@router.get("/summary")
async def get_summary(current_user: User = Depends(get_current_user)):
    """Generate a summary report."""
    try:
        crimes = await chicago_service.fetch_crimes(limit=1000)
        stats = ml_engine.get_stats()
        
        by_type = {}
        for r in crimes:
            pt = r.get("primary_type", "Unknown")
            by_type[pt] = by_type.get(pt, 0) + 1
        
        top_types = sorted(by_type.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "total_crimes_analyzed": len(crimes),
            "model_accuracy": stats.get("accuracy"),
            "top_crime_types": [{"type": t, "count": c} for t, c in top_types],
            "generated_at": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        return {
            "total_crimes_analyzed": 0,
            "model_accuracy": None,
            "top_crime_types": [],
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "error": str(e),
        }
