import shutil
import cv2 
from deepface import DeepFace
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import time

def process_file(file_name):
    img = cv2.imread(f"img/{file_name}")
    results = DeepFace.analyze(img,  actions=("emotion", "age", "gender", "race"))
    return results

app = FastAPI()

# Configure CORS
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",  # Add any other origins you need to allow
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/api/")
async def root():
    return {"message": "Api server is running"}

@app.post("/api/uploadfiles/")
async def file_upload(file: UploadFile = File(...)):
    with open(f'img/{file.filename}', "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)    
        print("starting file processing")
        results = process_file(file.filename)
    
    return {"analysis_results" : results}