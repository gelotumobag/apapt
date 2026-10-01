// Para sa ORDINARYONG 180° servo (SG90, MG90S, MG996R nga 180°).
// Mo-tuyok matag 30° (30, 60, 90, 120, 150, 180), dayun mobalik sa 0°, ug mo-usab.
// Wiring: orange/yellow (signal) -> pin 9, red -> 5V, brown/black -> GND.

#include <Servo.h>

Servo myServo;

const int servoPin = 9;            // signal wire sa pin 9 (PWM)

// === SETTINGS ===
const int STEP_DEG  = 30;          // matag tuyok kay 30 degrees
const int MAX_DEG   = 180;         // hangtod diin mo-tuyok bag-o mobalik
const int PAUSE_MS  = 1000;        // paghulat tali sa matag step
const int HOME_WAIT = 3000;        // paghulat human mobalik, sa wala pa ulitin

int currentPos = 0;

void setup() {
  Serial.begin(9600);
  myServo.attach(servoPin);
  myServo.write(0);                // sugod sa 0°
  Serial.println("Servo naa sa 0 deg");
  delay(1000);
}

void loop() {
  // Tuyok matag 30° (30, 60, 90, 120, 150, 180)
  for (currentPos = STEP_DEG; currentPos <= MAX_DEG; currentPos += STEP_DEG) {
    myServo.write(currentPos);
    Serial.print("Servo naa sa ");
    Serial.print(currentPos);
    Serial.println(" deg");
    delay(PAUSE_MS);
  }

  // Balik sa original position
  myServo.write(0);
  Serial.println("Mobalik sa 0 deg");
  delay(HOME_WAIT);
}
