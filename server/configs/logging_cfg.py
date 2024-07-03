from uvicorn.logging import DefaultFormatter
import logging
import sys


def get_base_app_logger():
    formater = DefaultFormatter(
        "%(levelprefix)s %(asctime)s | %(message)s",
        use_colors=True, datefmt="%Y-%m-%d %H:%M:%S"
    )

    logger = logging.getLogger("FaceApp")
    logger.setLevel(logging.DEBUG)
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setFormatter(formater)
    logger.addHandler(stream_handler)
    return logger
