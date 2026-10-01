// Servo 1 = 360° CONTINUOUS servo (pin 9), Servo 2 = 180° servo (pin 10).
// Kontrolado pinaagi sa pag-TYPE sa Serial Monitor, ug naay CALIBRATION commands.
// Wiring: signal -> pin 9 / pin 10, VCC -> external 5V, GND -> GND (i-share sa Arduino GND).
//
// Serial Monitor: 9600 baud, "Newline".
//
// CALIBRATION (buhata ni una!):
//   S1500  -> i-set ang STOP value sa Servo 1 (usba ang number hangtod mohunong gyud)
//   M5.0   -> i-set ang ms kada degree (para sakto ang 30°)
//   R      -> TEST: Servo 1 mo-tuyok og 360° (usa ka lingin) para ma-check ang M
//   P      -> ipakita ang current settings
//
// MGA COMMAND:
//   0, 30, 60, 90, 120, 150, 180 -> Servo 1 mo-adto ana nga degree, dayun Servo 2 mo-tuyok
//   A  -> AUTO: 30, 60 ... 180, balik sa 0, ug mo-usab
//   X  -> STOP sa AUTO
//   B  -> Servo 2 ra (0 -> 60 -> 0)
//   H  -> Servo 1 mobalik sa 0
//   Z  -> i-set ang karon nga position sa Servo 1 isip 0
//   ?  -> ipakita ang mga command

#include <Servo.h>

Servo rotServo;    // Servo 1: 360° continuous
Servo armServo;    // Servo 2: 180° positional

const int ROT_PIN = 9;
const int ARM_PIN = 10;

// === CALIBRATION (Servo 1) - mausab gamit ang S ug M nga command ===
int   STOP_US     = 1500;          // value nga mohunong ang servo
int   SPEED_US    = 200;           // kusog: CW = STOP + SPEED, CCW = STOP - SPEED
float msPerDegree = 5.0;           // oras kada degree

// === SETTINGS (Servo 1) ===
const int STEP_DEG  = 30;
const int MAX_DEG   = 180;
const int SETTLE_MS = 300;
const int PAUSE_MS  = 1000;
const int HOME_WAIT = 3000;

// === SETTINGS (Servo 2) ===
const int ARM_MIN     = 0;
const int ARM_MAX     = 60;
const int ARM_STEP_MS = 15;
const int ARM_HOLD_MS = 500;

int currentPos = 0;
bool autoMode = false;

void stopServo1() {
  rotServo.writeMicroseconds(STOP_US);
}

void rotateDegrees(int degrees, bool clockwise) {
  unsigned long duration = (unsigned long)(degrees * msPerDegree);
  rotServo.writeMicroseconds(clockwise ? STOP_US + SPEED_US : STOP_US - SPEED_US);
  delay(duration);
  stopServo1();
  delay(SETTLE_MS);
  currentPos += clockwise ? degrees : -degrees;

  Serial.print("[Servo 1] Tuyok ");
  Serial.print(clockwise ? "CW " : "CCW ");
  Serial.print(degrees);
  Serial.print(" deg -> position: ");
  Serial.print(currentPos);
  Serial.println(" deg");
}

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
  Serial.println("[Servo 1] Mobalik sa 0 deg...");
  goToAngle(0);
}

void sweepArm() {
  Serial.println("[Servo 2] Mo-tuyok 0 -> 60 deg");
  for (int angle = ARM_MIN; angle <= ARM_MAX; angle++) {
    armServo.write(angle);
    delay(ARM_STEP_MS);
  }
  delay(ARM_HOLD_MS);
  Serial.println("[Servo 2] Mobalik 60 -> 0 deg");
  for (int angle = ARM_MAX; angle >= ARM_MIN; angle--) {
    armServo.write(angle);
    delay(ARM_STEP_MS);
  }
  Serial.println("[Servo 2] Naa na sa 0 deg");
  delay(ARM_HOLD_MS);
}

void printSettings() {
  Serial.print("STOP_US = ");
  Serial.print(STOP_US);
  Serial.print(" | msPerDegree = ");
  Serial.print(msPerDegree);
  Serial.print(" | position = ");
  Serial.print(currentPos);
  Serial.println(" deg");
}

void printHelp() {
  Serial.println();
  Serial.println("===== CALIBRATION =====");
  Serial.println(" S1500 : i-set ang STOP (usba hangtod mohunong ang Servo 1)");
  Serial.println(" M5.0  : i-set ang ms kada degree");
  Serial.println(" R     : TEST 360 deg (usa ka lingin)");
  Serial.println(" P     : ipakita ang settings");
  Serial.println("===== MGA COMMAND =====");
  Serial.println(" 0-180 : Servo 1 mo-adto ana nga degree, dayun Servo 2");
  Serial.println(" A / X : AUTO on / off");
  Serial.println(" B     : Servo 2 ra");
  Serial.println(" H     : Servo 1 mobalik sa 0");
  Serial.println(" Z     : karon nga position = 0");
  Serial.println(" ?     : ipakita kini");
  Serial.println("=======================");
}

void handleCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();
  if (cmd.length() == 0) return;

  Serial.print("> ");
  Serial.println(cmd);

  char c = cmd.charAt(0);

  if (isDigit(c)) {
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
    Serial.println("Andam na.");
  } else if (c == 'S' && cmd.length() > 1) {
    STOP_US = cmd.substring(1).toInt();
    stopServo1();
    Serial.print("STOP_US = ");
    Serial.print(STOP_US);
    Serial.println("  (nihunong ba? kung wala, sulayi ang lain nga number)");
  } else if (c == 'M' && cmd.length() > 1) {
    msPerDegree = cmd.substring(1).toFloat();
    Serial.print("msPerDegree = ");
    Serial.println(msPerDegree);
  } else if (cmd == "R") {
    autoMode = false;
    Serial.println("[TEST] 360 deg CW...");
    rotateDegrees(360, true);
    currentPos -= 360;             // balik sa parehas nga position
    Serial.println("[TEST] Usa ka lingin ba gyud? Kung kulang, padakoa ang M. Kung sobra, pagamya.");
  } else if (cmd == "P") {
    printSettings();
  } else if (cmd == "A") {
    autoMode = true;
    Serial.println("AUTO mode: ON (i-type ang X para mohunong)");
  } else if (cmd == "X") {
    autoMode = false;
    stopServo1();
    Serial.println("AUTO mode: OFF");
  } else if (cmd == "B") {
    sweepArm();
  } else if (cmd == "H") {
    autoMode = false;
    returnHome();
  } else if (cmd == "Z") {
    currentPos = 0;
    Serial.println("Position karon = 0 deg");
  } else if (cmd == "?") {
    printHelp();
  } else {
    Serial.println("Wala mailhi nga command. I-type ang ? para sa lista.");
  }
}

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
  stopServo1();
  armServo.attach(ARM_PIN);
  armServo.write(ARM_MIN);

  delay(1000);
  Serial.println("=== Servo 1 (360) + Servo 2 (180): Serial Control ===");
  printSettings();
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
