import shutil
import cv2
from deepface import DeepFace
from fastapi import FastAPI, UploadFile, File, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from helpers.mash import mash
from uuid import uuid4
import os
import base64

PREFIX_TO_MASHED_NAMEFILE = "mashed"
PREFIX_TO_UPLOADED_NAMEFILE = "uploaded"
FILE_UPLOADED_PATH_DIR = os.path.abspath(os.path.join(os.curdir, "uploaded"))
FILE_MASHED_PATH_DIR = os.path.abspath(os.path.join(os.curdir, FILE_UPLOADED_PATH_DIR, "mashed"))

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


def process_file(file_path):
    img = cv2.imread(file_path)
    results = DeepFace.analyze(img, actions=("emotion", "age", "gender", "race"))
    return results


def id_generator():
    return uuid4().hex


@app.get("/api/")
async def root():
    return {"message": "Api server is running"}


@app.post("/api/uploadfiles/")
async def file_upload(file: UploadFile = File(...)):
    unique_id = id_generator()
    uploaded_file_path = f"{FILE_UPLOADED_PATH_DIR}{PREFIX_TO_UPLOADED_NAMEFILE + unique_id}"
    mashed_file_path = f"{FILE_MASHED_PATH_DIR}{PREFIX_TO_MASHED_NAMEFILE + unique_id}"

    with open(uploaded_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    mash(uploaded_file_path, mashed_file_path)
    print(f"mash created: {mashed_file_path}", "starting file processing", sep="\n")
    results = process_file(uploaded_file_path)

    with open(mashed_file_path, "rb") as file:
        encoded_mashed_file = base64.b64encode(file.read()).decode('utf-8')

    return JSONResponse({
        "analysis_results": results,
        "mashed_file": encoded_mashed_file
    },
        headers={
            "X-PROCESSED-FIlES-ID": unique_id
        }
    )


def remove_processed_files_by_id(_id: str) -> None:
    uploaded_file_path = os.path.abspath(FILE_UPLOADED_PATH_DIR + PREFIX_TO_UPLOADED_NAMEFILE + _id)
    mashed_file_path = os.path.abspath(FILE_MASHED_PATH_DIR + PREFIX_TO_MASHED_NAMEFILE + _id)

    if os.path.exists(uploaded_file_path) and os.path.exists(mashed_file_path):
        os.remove(uploaded_file_path)
        os.remove(mashed_file_path)


@app.middleware("http")
async def remove_proccessed_files_middleware(request: Request, call_next) -> Response:
    response: Response = await call_next(request)

    if request.url.path in ["/api/uploadfiles/"]:
        processed_files_id = response.headers.get("X-PROCESSED-FIlES-ID")
        remove_processed_files_by_id(processed_files_id)

    return response


@app.on_event("startup")
async def startup():
    if not os.path.exists(FILE_MASHED_PATH_DIR):
        os.mkdir(FILE_MASHED_PATH_DIR)

    if not os.path.exists(FILE_UPLOADED_PATH_DIR):
        os.mkdir(FILE_UPLOADED_PATH_DIR)
