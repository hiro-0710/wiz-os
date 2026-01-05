import cv2
import mediapipe as mp
import requests

BACKEND_URL = "http://localhost:8000/vision/fingertip"

mp_hands = mp.solutions.hands


def send_fingertip(x: float, y: float) -> None:
  try:
      requests.post(BACKEND_URL, json={"x": x, "y": y}, timeout=0.2)
  except Exception as e:
      print("[Vision] send error:", e)


def run():
    cap = cv2.VideoCapture(0)
    with mp_hands.Hands(max_num_hands=1) as hands:
        while True:
            ok, frame = cap.read()
            if not ok:
                break

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = hands.process(frame_rgb)

            h, w, _ = frame.shape

            if results.multi_hand_landmarks:
                hand = results.multi_hand_landmarks[0]
                fingertip = hand.landmark[8]
                x = fingertip.x
                y = fingertip.y

                send_fingertip(x, y)

                cx, cy = int(x * w), int(y * h)
                cv2.circle(frame, (cx, cy), 8, (0, 255, 0), -1)

            cv2.imshow("Wiz Fingertip", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    run()
