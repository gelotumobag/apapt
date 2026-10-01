// Duha ka servo:
//  - Servo 1 (360° continuous, pin 9): mo-tuyok 30° matag step hangtod 180°, dayun mobalik sa 0.
//  - Servo 2 (180° positional, pin 10): human sa matag 30° step sa Servo 1,
//    mo-tuyok 0° -> 60° -> 0°.
// Wiring: signal -> pin 9 / pin 10, VCC -> external 5V, GND -> GND (i-share sa Arduino GND).

#include <Servo.h>

Servo rotServo;    // Servo 1: continuous rotation
Servo armServo;    // Servo 2: positional (0-180)

const int ROT_PIN = 9;             // signal wire sa Servo 1 (PWM)
const int ARM_PIN = 10;            // signal wire sa Servo 2 (PWM)

// === CALIBRATION (Servo 1) ===
const int STOP_US = 1500;          // i-adjust kung dili mo-undang (1450-1550)
const int CW_US   = 1700;          // clockwise speed
const int CCW_US  = 1300;          // counter-clockwise speed
float msPerDegree = 5.0;           // oras kada degree. I-calibrate ni!

// === SETTINGS (Servo 1) ===
const int STEP_DEG  = 30;          // matag tuyok kay 30 degrees
const int MAX_DEG   = 180;         // hangtod diin mo-tuyok bag-o mobalik
const int PAUSE_MS  = 1000;        // paghulat tali sa matag step
const int HOME_WAIT = 3000;        // paghulat human mobalik, sa wala pa ulitin

// === SETTINGS (Servo 2) ===
const int ARM_MIN       = 0;
const int ARM_MAX       = 60;
const int ARM_STEP_MS   = 15;      // gamay = paspas
const int ARM_HOLD_MS   = 500;     // paghulat sa 60° ug sa 0°

int currentPos = 0;                // net degrees gikan sa original (CW = +, CCW = -)

void rotateDegrees(int degrees, bool clockwise) {
  unsigned long duration = (unsigned long)(degrees * msPerDegree);
  rotServo.writeMicroseconds(clockwise ? CW_US : CCW_US);
  delay(duration);
  rotServo.writeMicroseconds(STOP_US);
  currentPos += clockwise ? degrees : -degrees;
}

void returnHome() {
  if (currentPos == 0) return;
  int back = abs(currentPos);
  bool cw = currentPos < 0;        // kung naa sa +, mo-CCW pabalik
  rotateDegrees(back, cw);
  currentPos = 0;
}

// Servo 2: 0° -> 60° -> 0°
void sweepArm() {
  for (int angle = ARM_MIN; angle <= ARM_MAX; angle++) {
    armServo.write(angle);
    delay(ARM_STEP_MS);
  }
  delay(ARM_HOLD_MS);

  for (int angle = ARM_MAX; angle >= ARM_MIN; angle--) {
    armServo.write(angle);
    delay(ARM_STEP_MS);
  }
  delay(ARM_HOLD_MS);
}

void setup() {
  rotServo.attach(ROT_PIN, 500, 2400);
  rotServo.writeMicroseconds(STOP_US);

  armServo.attach(ARM_PIN);
  armServo.write(ARM_MIN);

  delay(1000);                     // hulat sa mga servo nga mo-undang
}

void loop() {
  // Servo 1 mo-tuyok matag 30° (30, 60, 90, 120, 150, 180).
  // Human sa matag 30°, ang Servo 2 mo-0° -> 60° -> 0°.
  while (currentPos < MAX_DEG) {
    rotateDegrees(STEP_DEG, true);
    delay(PAUSE_MS);
    sweepArm();
  }

  // Balik sa original position
  returnHome();
  delay(HOME_WAIT);
}
