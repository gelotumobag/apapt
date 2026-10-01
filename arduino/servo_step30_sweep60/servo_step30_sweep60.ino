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
const int SETTLE_MS = 300;         // hulat aron hingpit nga mo-undang ang Servo 1
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
  delay(SETTLE_MS);                // siguroha nga hunong na gyud
  currentPos += clockwise ? degrees : -degrees;

  Serial.print("[Servo 1] Tuyok ");
  Serial.print(clockwise ? "CW " : "CCW ");
  Serial.print(degrees);
  Serial.print(" deg -> position: ");
  Serial.print(currentPos);
  Serial.println(" deg");
}

void returnHome() {
  if (currentPos == 0) return;
  Serial.println("[Servo 1] Mobalik sa original position (0 deg)...");
  int back = abs(currentPos);
  bool cw = currentPos < 0;        // kung naa sa +, mo-CCW pabalik
  rotateDegrees(back, cw);
  currentPos = 0;
  Serial.println("[Servo 1] Naa na sa 0 deg");
}

// Servo 2: 0° -> 60° -> 0°
void sweepArm() {
  Serial.println("[Servo 2] Mo-tuyok 0 -> 60 deg");
  for (int angle = ARM_MIN; angle <= ARM_MAX; angle++) {
    armServo.write(angle);
    delay(ARM_STEP_MS);
  }
  Serial.println("[Servo 2] Naa na sa 60 deg");
  delay(ARM_HOLD_MS);

  Serial.println("[Servo 2] Mobalik 60 -> 0 deg");
  for (int angle = ARM_MAX; angle >= ARM_MIN; angle--) {
    armServo.write(angle);
    delay(ARM_STEP_MS);
  }
  Serial.println("[Servo 2] Naa na sa 0 deg");
  delay(ARM_HOLD_MS);
}

void setup() {
  Serial.begin(9600);
  Serial.println("=== Duha ka Servo: Sugod ===");

  rotServo.attach(ROT_PIN, 500, 2400);
  rotServo.writeMicroseconds(STOP_US);

  armServo.attach(ARM_PIN);
  armServo.write(ARM_MIN);

  delay(1000);                     // hulat sa mga servo nga mo-undang
  Serial.println("Servo 1: STOP | Servo 2: 0 deg");
}

int cycleCount = 0;

void loop() {
  cycleCount++;
  Serial.println();
  Serial.print("===== CYCLE ");
  Serial.print(cycleCount);
  Serial.println(" =====");

  // Servo 1 mo-tuyok matag 30° (30, 60, 90, 120, 150, 180).
  // Ang Servo 2 mo-tuyok LANG kung naa na ug hunong na ang Servo 1 sa insakto nga degree.
  while (currentPos < MAX_DEG) {
    int target = currentPos + STEP_DEG;

    rotateDegrees(STEP_DEG, true);           // 1) Servo 1 mo-tuyok og 30°

    if (currentPos == target) {              // 2) naa na sa insakto nga degree?
      Serial.print(">> Servo 1 HUNONG sa ");
      Serial.print(currentPos);
      Serial.println(" deg - Servo 2 na ang mo-tuyok");
      sweepArm();                            // 3) dayun ang Servo 2: 0 -> 60 -> 0
    }

    delay(PAUSE_MS);                         // 4) hulat sa wala pa ang sunod nga 30°
  }

  // Balik sa original position
  returnHome();
  Serial.print("Hulat ");
  Serial.print(HOME_WAIT / 1000);
  Serial.println(" seconds sa wala pa mo-usab...");
  delay(HOME_WAIT);
}
