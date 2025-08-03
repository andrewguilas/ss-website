from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/upload-orders")
async def upload_orders(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    contents = await file.read()

    return JSONResponse(content={"filename": file.filename, "size": len(contents)})
