from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict
import uvicorn
import os
from pathlib import Path

app = FastAPI(title="Dashboard API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Node.js server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Item(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    value: float
    category: str
    created_at: Optional[datetime] = None

class StatsResponse(BaseModel):
    total_sales: float
    active_users: int
    new_orders: int
    revenue_growth: float

class DocFile(BaseModel):
    name: str
    path: str
    size: int

class DocContent(BaseModel):
    name: str
    content: str

# In-memory storage for demo
items_db: List[Item] = []
item_counter = 1

# Sample data
stats_data = StatsResponse(
    total_sales=48596.00,
    active_users=1529,
    new_orders=324,
    revenue_growth=12.5
)

@app.get("/")
async def root():
    return {"message": "FastAPI Backend Running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    """Get dashboard statistics"""
    return stats_data

@app.get("/api/items", response_model=List[Item])
async def get_items():
    """Get all items"""
    return items_db

@app.get("/api/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """Get a specific item by ID"""
    for item in items_db:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/api/items", response_model=Item)
async def create_item(item: Item):
    """Create a new item"""
    global item_counter
    item.id = item_counter
    item.created_at = datetime.now()
    item_counter += 1
    items_db.append(item)
    return item

@app.put("/api/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: Item):
    """Update an existing item"""
    for idx, db_item in enumerate(items_db):
        if db_item.id == item_id:
            item.id = item_id
            item.created_at = db_item.created_at
            items_db[idx] = item
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/items/{item_id}")
async def delete_item(item_id: int):
    """Delete an item"""
    for idx, item in enumerate(items_db):
        if item.id == item_id:
            del items_db[idx]
            return {"message": "Item deleted successfully"}
    raise HTTPException(status_code=404, detail="Item not found")

@app.get("/api/docs", response_model=List[DocFile])
async def get_docs():
    """Get list of documentation files"""
    docs_path = Path(__file__).parent.parent / "docs"
    doc_files = []
    
    if docs_path.exists():
        for file_path in docs_path.glob("*.md"):
            doc_files.append(DocFile(
                name=file_path.stem.replace("-", " ").title(),
                path=file_path.name,
                size=file_path.stat().st_size
            ))
    
    return doc_files

@app.get("/api/docs/{doc_name}", response_model=DocContent)
async def get_doc_content(doc_name: str):
    """Get content of a specific documentation file"""
    docs_path = Path(__file__).parent.parent / "docs"
    file_path = docs_path / doc_name
    
    if not file_path.exists() or not file_path.suffix == ".md":
        raise HTTPException(status_code=404, detail="Documentation file not found")
    
    try:
        content = file_path.read_text(encoding="utf-8")
        return DocContent(
            name=file_path.stem.replace("-", " ").title(),
            content=content
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

# Add some sample data on startup
@app.on_event("startup")
async def startup_event():
    sample_items = [
        Item(title="Product A", description="High quality product", value=99.99, category="Electronics"),
        Item(title="Service B", description="Premium service package", value=199.99, category="Services"),
        Item(title="Product C", description="Budget friendly option", value=49.99, category="Electronics"),
    ]
    for item in sample_items:
        await create_item(item)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
