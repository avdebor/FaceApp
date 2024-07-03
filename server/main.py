from configs.logging_cfg import get_base_app_logger
import shutil
from contextlib import asynccontextmanager
import cv2
from deepface import DeepFace
from fastapi import FastAPI, UploadFile, File, Request, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from helpers.mash import mash
from uuid import uuid4
import os
import base64

logger = get_base_app_logger()

PREFIX_TO_MASHED_NAMEFILE = "mashed"
PREFIX_TO_UPLOADED_NAMEFILE = "uploaded"
BASE_PROCESS_FILE_DIR = "img"
FILE_UPLOADED_PATH_DIR = os.path.abspath(os.path.join(os.curdir, BASE_PROCESS_FILE_DIR, "uploaded"))
FILE_MASHED_PATH_DIR = os.path.abspath(os.path.join(os.curdir, BASE_PROCESS_FILE_DIR, "mashed"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(BASE_PROCESS_FILE_DIR, exist_ok=True)
    os.makedirs(FILE_UPLOADED_PATH_DIR, exist_ok=True)
    os.makedirs(FILE_MASHED_PATH_DIR, exist_ok=True)
    yield


app = FastAPI(lifespan=lifespan)

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


def join_path_dir_to_file(_id: str, path_to_dir: str, file_extension: str, name_file_prefix: str):
    path_to_file = os.path.join(
        path_to_dir,
        name_file_prefix + _id + file_extension
    )

    return path_to_file


def process_file(file_path):
    img = cv2.imread(file_path)
    results = DeepFace.analyze(img, actions=("emotion", "age", "gender", "race"))
    logger.info(f"file processing completed")
    return results


def id_generator():
    return uuid4().hex


@app.get("/api/")
async def root():
    return {"message": "Api server is running"}


@app.post("/api/uploadfiles/")
async def file_upload(file: UploadFile = File(...)):
    _id = id_generator()
    file_extension = os.path.splitext(file.filename)[1]
    uploaded_file_path = join_path_dir_to_file(
        _id,
        FILE_UPLOADED_PATH_DIR,
        file_extension,
        PREFIX_TO_UPLOADED_NAMEFILE
    )
    mashed_file_path = join_path_dir_to_file(
        _id,
        FILE_MASHED_PATH_DIR,
        file_extension,
        PREFIX_TO_MASHED_NAMEFILE
    )
    with open(uploaded_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    mash(uploaded_file_path, mashed_file_path)
    logger.debug(
        f"uploaded file {uploaded_file_path.split("/")[-1]}; and mash created: {mashed_file_path.split("/")[-1]}"
    )
    results = process_file(uploaded_file_path)
    with open(mashed_file_path, "rb") as file:
        encoded_mashed_file = base64.b64encode(file.read()).decode('utf-8')
    return JSONResponse({
        "mashed_file": encoded_mashed_file,
        "analysis_results": results
    },
        headers={
            "X-PROCESSED-FIlES-ID": _id,
            "X-PROCESSED-FIlES-EXTENSION": file_extension
        }
    )


def remove_processed_files_by_id(_id: str, file_extension: str) -> None:
    uploaded_file_path = join_path_dir_to_file(
        _id,
        FILE_UPLOADED_PATH_DIR,
        file_extension,
        PREFIX_TO_UPLOADED_NAMEFILE
    )
    mashed_file_path = join_path_dir_to_file(
        _id,
        FILE_MASHED_PATH_DIR,
        file_extension,
        PREFIX_TO_MASHED_NAMEFILE
    )
    if os.path.exists(uploaded_file_path) and os.path.exists(mashed_file_path):
        os.remove(uploaded_file_path)
        os.remove(mashed_file_path)
        logger.debug(f"files were deleted: {uploaded_file_path.split("/")[-1]}; {mashed_file_path.split("/")[-1]}")


@app.middleware("http")
async def remove_proccessed_files_middleware(request: Request, call_next) -> Response:
    response: Response = await call_next(request)

    if request.url.path in ["/api/uploadfiles/"]:
        remove_processed_files_by_id(
            response.headers.get("X-PROCESSED-FIlES-ID"),
            response.headers.get("X-PROCESSED-FIlES-EXTENSION")
        )
        del response.headers["X-PROCESSED-FIlES-ID"], response.headers["X-PROCESSED-FIlES-EXTENSION"]
    return response
