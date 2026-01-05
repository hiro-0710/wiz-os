import cv2
import mediapipe as mp
import requests

BACKEND_URL = "http://localhost:8000/vision/gaze"

mp_face = mp.solutions.face_mesh


def send_gaze(x: float, y: float):
    try:
        requests.post(BACKEND_URL, json={"x": x, "y": y}, timeout=0.2)
    except Exception as e:
        print("[Vision] gaze send error:", e)


def run():
    cap = cv2.VideoCapture(0)
    with mp_face.FaceMesh(max_num_faces=1) as face:
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            h, w, _ = frame.shape
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face.process(rgb)

            if results.multi_face_landmarks:
                lm = results.multi_face_landmarks[0].landmark
                left_eye = lm[468]  # iris center (approx)
                gx = left_eye.x
                gy = left_eye.y

                send_gaze(gx, gy)

                cx, cy = int(gx * w), int(gy * h)
                cv2.circle(frame, (cx, cy), 6, (255, 0, 0), -1)

            cv2.imshow("Wiz Gaze", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()
