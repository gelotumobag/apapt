// Servo back-and-forth: 0° -> 60° -> 0° -> 60° ... forever.
// Wiring: servo signal -> pin 9, servo VCC -> 5V, servo GND -> GND.

#include <Servo.h>

const int SERVO_PIN = 9;
const int MIN_ANGLE = 0;
const int MAX_ANGLE = 60;
const int STEP_DELAY_MS = 15;   // lower = faster movement
const int HOLD_DELAY_MS = 500;  // pause at each end

Servo myServo;

void setup() {
  myServo.attach(SERVO_PIN);
  myServo.write(MIN_ANGLE);
  delay(HOLD_DELAY_MS);
}

void loop() {
  // Rotate 0° -> 60°
  for (int angle = MIN_ANGLE; angle <= MAX_ANGLE; angle++) {
    myServo.write(angle);
    delay(STEP_DELAY_MS);
  }
  delay(HOLD_DELAY_MS);

  // Rotate back 60° -> 0°
  for (int angle = MAX_ANGLE; angle >= MIN_ANGLE; angle--) {
    myServo.write(angle);
    delay(STEP_DELAY_MS);
  }
  delay(HOLD_DELAY_MS);
}
