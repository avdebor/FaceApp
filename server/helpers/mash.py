import cv2
import numpy as np


def draw_mesh(image, points, color=(0, 255, 0), thickness=3):
    hull = cv2.convexHull(points)
    for i in range(len(hull)):
        for j in range(i + 1, len(hull)):
            cv2.line(image, tuple(hull[i][0]), tuple(hull[j][0]), color, thickness)


def mash(image_path, output_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        points = np.array([
            [x, y], [x + w // 2, y], [x + w, y],
            [x, y + h // 2], [x + w, y + h // 2],
            [x, y + h], [x + w // 2, y + h], [x + w, y + h]
        ])
        draw_mesh(image, points)

    cv2.imwrite(output_path, image)
