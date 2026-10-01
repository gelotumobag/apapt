// Duha ka servo nga kontrolado pinaagi sa pag-TYPE sa Serial Monitor.
//  - Servo 1 (360° continuous, pin 9): mo-adto sa degree nga imong gi-type.
//  - Servo 2 (180° positional, pin 10): mo-tuyok 0° -> 60° -> 0° human mohunong ang Servo 1.
// Wiring: signal -> pin 9 / pin 10, VCC -> external 5V, GND -> GND (i-share sa Arduino GND).
//
// Serial Monitor: 9600 baud, "Newline".
// Mga command:
//   0, 30, 60, 90, 120, 150, 180  -> Servo 1 mo-adto ana nga degree, dayun Servo 2 mo-tuyok
//   A  -> AUTO: 30, 60 ... 180, balik sa 0, ug mo-usab (Servo 2 human sa matag 30°)
//   X  -> STOP sa AUTO
//   B  -> Servo 2 ra ang mo-tuyok (0 -> 60 -> 0)
//   H  -> Servo 1 mobalik sa 0
//   ?  -> ipakita ang mga command

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
const int STEP_DEG  = 30;          // matag tuyok kay 30 degrees (AUTO)
const int MAX_DEG   = 180;         // pinakataas nga degree
const int SETTLE_MS = 300;         // hulat aron hingpit nga mo-undang ang Servo 1
const int PAUSE_MS  = 1000;        // paghulat tali sa matag step (AUTO)
const int HOME_WAIT = 3000;        // paghulat human mobalik, sa wala pa ulitin (AUTO)

// === SETTINGS (Servo 2) ===
const int ARM_MIN       = 0;
const int ARM_MAX       = 60;
const int ARM_STEP_MS   = 15;      // gamay = paspas
const int ARM_HOLD_MS   = 500;     // paghulat sa 60° ug sa 0°

int currentPos = 0;                // net degrees gikan sa original (CW = +, CCW = -)
bool autoMode = false;

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

// Servo 1 mo-adto sa target nga degree (0 - 180)
void goToAngle(int target) {
  int diff = target - currentPos;
  if (diff == 0) {
    Serial.print("[Servo 1] Naa na sa ");
    Serial.print(currentPos);
    Serial.println(" deg");
    return;
  }
  rotateDegrees(abs(diff), diff > 0);
}

void returnHome() {
  if (currentPos == 0) return;
  Serial.println("[Servo 1] Mobalik sa original position (0 deg)...");
  goToAngle(0);
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

void printHelp() {
  Serial.println();
  Serial.println("===== MGA COMMAND =====");
  Serial.println(" 0-180 : Servo 1 mo-adto ana nga degree, dayun Servo 2 mo-tuyok");
  Serial.println("         (pananglitan: 30, 60, 90, 120, 150, 180)");
  Serial.println(" A     : AUTO (30, 60 ... 180, balik 0, mo-usab)");
  Serial.println(" X     : STOP sa AUTO");
  Serial.println(" B     : Servo 2 ra (0 -> 60 -> 0)");
  Serial.println(" H     : Servo 1 mobalik sa 0");
  Serial.println(" ?     : ipakita kini");
  Serial.println("=======================");
}

void handleCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();
  if (cmd.length() == 0) return;

  Serial.print("> ");
  Serial.println(cmd);

  if (isDigit(cmd.charAt(0))) {
    int target = cmd.toInt();
    if (target < 0 || target > MAX_DEG) {
      Serial.println("Sayop: 0 hangtod 180 ra ang pwede.");
      return;
    }
    autoMode = false;
    goToAngle(target);
    Serial.print(">> Servo 1 HUNONG sa ");
    Serial.print(currentPos);
    Serial.println(" deg - Servo 2 na ang mo-tuyok");
    sweepArm();
    Serial.println("Andam na. I-type ang sunod nga command.");
  } else if (cmd == "A") {
    autoMode = true;
    Serial.println("AUTO mode: ON (i-type ang X para mohunong)");
  } else if (cmd == "X") {
    autoMode = false;
    Serial.println("AUTO mode: OFF");
  } else if (cmd == "B") {
    sweepArm();
  } else if (cmd == "H") {
    autoMode = false;
    returnHome();
  } else if (cmd == "?") {
    printHelp();
  } else {
    Serial.println("Wala mailhi nga command. I-type ang ? para sa lista.");
  }
}

// Usa ka step sa AUTO mode
void autoStep() {
  if (currentPos < MAX_DEG) {
    goToAngle(currentPos + STEP_DEG);
    Serial.print(">> Servo 1 HUNONG sa ");
    Serial.print(currentPos);
    Serial.println(" deg - Servo 2 na ang mo-tuyok");
    sweepArm();
    delay(PAUSE_MS);
  } else {
    returnHome();
    Serial.print("Hulat ");
    Serial.print(HOME_WAIT / 1000);
    Serial.println(" seconds sa wala pa mo-usab...");
    delay(HOME_WAIT);
  }
}

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(50);

  rotServo.attach(ROT_PIN, 500, 2400);
  rotServo.writeMicroseconds(STOP_US);

  armServo.attach(ARM_PIN);
  armServo.write(ARM_MIN);

  delay(1000);                     // hulat sa mga servo nga mo-undang
  Serial.println("=== Duha ka Servo: Serial Control ===");
  Serial.println("Servo 1: 0 deg (STOP) | Servo 2: 0 deg");
  printHelp();
}

void loop() {
  if (Serial.available()) {
    handleCommand(Serial.readStringUntil('\n'));
  }

  if (autoMode) {
    autoStep();
  }
}
