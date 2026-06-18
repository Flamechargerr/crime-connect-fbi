from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from backend.src.database import get_db
from backend.src.models import Case
from backend.src.schemas import CaseCreate, CaseUpdate, CaseOut
from backend.src.routers.auth import get_current_user
from backend.src.models import User

router = APIRouter(prefix="/api/cases", tags=["cases"])

@router.get("", response_model=list[CaseOut])
async def list_cases(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Case).order_by(Case.created_at.desc()))
    return result.scalars().all()

@router.post("", response_model=CaseOut)
async def create_case(data: CaseCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    case = Case(**data.model_dump())
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return case

@router.get("/{case_id}", response_model=CaseOut)
async def get_case(case_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.put("/{case_id}", response_model=CaseOut)
async def update_case(case_id: str, data: CaseUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(case, field, value)
    
    await db.commit()
    await db.refresh(case)
    return case

@router.delete("/{case_id}")
async def delete_case(case_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    await db.execute(delete(Case).where(Case.id == case_id))
    await db.commit()
    return {"message": "Case deleted"}
