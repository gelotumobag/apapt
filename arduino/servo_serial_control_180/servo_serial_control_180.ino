// Duha ka ORDINARYONG 180° servo (SG90 / MG90S / MG996R) nga kontrolado sa Serial Monitor.
//  - Servo 1 (pin 9): mo-adto sa eksaktong degree nga imong gi-type (0 - 180).
//  - Servo 2 (pin 10): mo-tuyok 0° -> 60° -> 0° human moabot ang Servo 1.
// Wiring: signal -> pin 9 / pin 10, VCC -> external 5V, GND -> GND (i-share sa Arduino GND).
//
// Serial Monitor: 9600 baud, "Newline".
// Mga command:
//   0, 30, 60, 90, 120, 150, 180  -> Servo 1 mo-adto ana nga degree, dayun Servo 2 mo-tuyok
//   A  -> AUTO: 30, 60 ... 180, balik sa 0, ug mo-usab (Servo 2 human sa matag 30°)
//   X  -> STOP sa AUTO
//   B  -> Servo 2 ra ang mo-tuyok (0 -> 60 -> 0)
//   H  -> Servo 1 mobalik sa 0
//   T  -> TEST: Servo 1 mo 0 -> 180 -> 0 (para masuta kung mo-lihok)
//   ?  -> ipakita ang mga command

#include <Servo.h>

Servo servo1;      // Servo 1: 180° positional
Servo servo2;      // Servo 2: 180° positional

const int SERVO1_PIN = 9;
const int SERVO2_PIN = 10;

// === SETTINGS (Servo 1) ===
const int STEP_DEG    = 30;        // matag tuyok kay 30 degrees (AUTO)
const int MAX_DEG     = 180;       // pinakataas nga degree
const int S1_STEP_MS  = 10;        // gamay = paspas (kada 1 degree)
const int SETTLE_MS   = 300;       // hulat aron hunong na gyud ang Servo 1
const int PAUSE_MS    = 1000;      // paghulat tali sa matag step (AUTO)
const int HOME_WAIT   = 3000;      // paghulat human mobalik, sa wala pa ulitin (AUTO)

// === SETTINGS (Servo 2) ===
const int ARM_MIN     = 0;
const int ARM_MAX     = 60;
const int ARM_STEP_MS = 15;        // gamay = paspas
const int ARM_HOLD_MS = 500;       // paghulat sa 60° ug sa 0°

int currentPos = 0;                // position sa Servo 1
bool autoMode = false;

// Servo 1 mo-adto sa target nga degree (hinay-hinay)
void goToAngle(int target) {
  target = constrain(target, 0, MAX_DEG);
  int dir = (target > currentPos) ? 1 : -1;
  while (currentPos != target) {
    currentPos += dir;
    servo1.write(currentPos);
    delay(S1_STEP_MS);
  }
  delay(SETTLE_MS);

  Serial.print("[Servo 1] Naa na sa ");
  Serial.print(currentPos);
  Serial.println(" deg");
}

void returnHome() {
  Serial.println("[Servo 1] Mobalik sa 0 deg...");
  goToAngle(0);
}

// Servo 2: 0° -> 60° -> 0°
void sweepArm() {
  Serial.println("[Servo 2] Mo-tuyok 0 -> 60 deg");
  for (int angle = ARM_MIN; angle <= ARM_MAX; angle++) {
    servo2.write(angle);
    delay(ARM_STEP_MS);
  }
  Serial.println("[Servo 2] Naa na sa 60 deg");
  delay(ARM_HOLD_MS);

  Serial.println("[Servo 2] Mobalik 60 -> 0 deg");
  for (int angle = ARM_MAX; angle >= ARM_MIN; angle--) {
    servo2.write(angle);
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
  Serial.println(" T     : TEST sa Servo 1 (0 -> 180 -> 0)");
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
  } else if (cmd == "T") {
    autoMode = false;
    Serial.println("[TEST] Servo 1: 0 -> 180 -> 0");
    goToAngle(0);
    goToAngle(180);
    goToAngle(0);
    Serial.println("[TEST] Human na");
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

  servo1.attach(SERVO1_PIN);
  servo1.write(0);
  servo2.attach(SERVO2_PIN);
  servo2.write(ARM_MIN);

  delay(1000);
  Serial.println("=== Duha ka Servo (180 deg): Serial Control ===");
  Serial.println("Servo 1: 0 deg | Servo 2: 0 deg");
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
