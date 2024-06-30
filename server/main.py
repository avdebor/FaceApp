import shutil
import cv2 
from deepface import DeepFace
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from helpers.mash import mash
import os
import string 
import random
from pydantic import BaseModel


def process_file(file_name):
    img = cv2.imread(f"img/{file_name}")
    results = DeepFace.analyze(img,  actions=("emotion", "age", "gender", "race"))
    return results

def id_generator(size=9, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

app = FastAPI()

# Configure CORS
origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class filename(BaseModel):
    name: str

@app.get("/api/")
async def root():
    return {"message": "Api server is running"}


@app.post("/api/cleanfile/")
async def file_cleanup(filename: filename):
    os.remove(f"img/mashed/{filename.name}")
    return{"message": f"file {filename.name} cash was cleaned"}


@app.post("/api/uploadfiles/")
async def file_upload(file: UploadFile = File(...)):
    with open(f'img/{file.filename}', "wb") as buffer:
        shutil.copyfileobj(file.file, buffer) 
        mashed_file_name = id_generator()+os.path.splitext(file.filename)[1]
        mash(f"img/{file.filename}", f"img/mashed/{mashed_file_name}")   
        print(f"mash created: {mashed_file_name}")
        print("starting file processing")
        results = process_file(file.filename)
    
    return {"analysis_results" : results,
            "mashed_file_id": mashed_file_name}