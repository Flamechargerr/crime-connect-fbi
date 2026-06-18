from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from backend.src.schemas import CrimeRecord, CrimeSummary, CrimeTrend, CrimeHotspot
from backend.src.services.chicago_data import ChicagoDataService

router = APIRouter(prefix="/api/crimes", tags=["crimes"])
service = ChicagoDataService()

@router.get("")
async def get_crimes(
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    crime_type: Optional[str] = Query(None),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
):
    """Get paginated crime records from Chicago open data."""
    try:
        data = await service.fetch_crimes(limit=limit, offset=offset)
        if crime_type:
            data = [r for r in data if r.get("primary_type") == crime_type]
        if date_from:
            data = [r for r in data if (r.get("date") or "") >= date_from]
        if date_to:
            data = [r for r in data if (r.get("date") or "") <= date_to]
        if district:
            data = [r for r in data if str(r.get("district", "")) == district]
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Data source error: {str(e)}")

@router.get("/summary")
async def get_summary():
    """Aggregated crime statistics."""
    try:
        data = await service.fetch_crimes(limit=5000)
        by_type = {}
        by_district = {}
        by_arrest = {"arrested": 0, "not_arrested": 0}
        by_year = {}
        
        for r in data:
            pt = r.get("primary_type", "Unknown")
            by_type[pt] = by_type.get(pt, 0) + 1
            
            d = str(r.get("district", "Unknown"))
            by_district[d] = by_district.get(d, 0) + 1
            
            if r.get("arrest"):
                by_arrest["arrested"] += 1
            else:
                by_arrest["not_arrested"] += 1
            
            year = (r.get("date") or "")[:4]
            if year and year.isdigit():
                by_year[year] = by_year.get(year, 0) + 1
        
        return {
            "total_records": len(data),
            "by_type": by_type,
            "by_district": by_district,
            "by_arrest": by_arrest,
            "by_year": by_year,
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Data source error: {str(e)}")

@router.get("/trends")
async def get_trends(group_by: str = Query("month", regex="^(month|year|day)$")):
    """Time-series crime trends."""
    try:
        data = await service.fetch_crimes(limit=5000)
        trends = {}
        for r in data:
            date = r.get("date", "")
            if not date:
                continue
            if group_by == "month":
                key = date[:7]  # YYYY-MM
            elif group_by == "year":
                key = date[:4]
            else:
                key = date[:10]  # YYYY-MM-DD
            trends[key] = trends.get(key, 0) + 1
        
        sorted_trends = sorted(trends.items(), key=lambda x: x[0])
        return [{"period": k, "count": v} for k, v in sorted_trends]
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Data source error: {str(e)}")

@router.get("/hotspots")
async def get_hotspots(
    limit: int = Query(500, ge=1, le=2000),
    crime_type: Optional[str] = Query(None),
):
    """Crime hotspots for map visualization."""
    try:
        data = await service.fetch_crimes(limit=limit)
        hotspots = []
        for r in data:
            lat = r.get("latitude")
            lng = r.get("longitude")
            if lat is not None and lng is not None:
                if crime_type and r.get("primary_type") != crime_type:
                    continue
                hotspots.append({
                    "latitude": float(lat),
                    "longitude": float(lng),
                    "type": r.get("primary_type", "Unknown"),
                    "date": r.get("date", ""),
                })
        return hotspots
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Data source error: {str(e)}")

@router.get("/types")
async def get_crime_types():
    """List all unique crime types."""
    try:
        data = await service.fetch_crimes(limit=5000)
        types = sorted(set(r.get("primary_type", "Unknown") for r in data if r.get("primary_type")))
        return types
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Data source error: {str(e)}")
