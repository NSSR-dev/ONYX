#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280_mod.h>

#define DEBUG 1

#define SER_BAUD_RATE 9600

#define NUM_TEMP_SENSORS 1

#define MAX_FAN_RPS 185
#define MIN_FAN_RPS 40
#define FAN_SPEED_DEVIATION_TOLERANCE 20

#define UPDATE_RATE_MILLISECONDS 1000

// SN74HC595N serial in parallel out to BME280 CE pin assignments
#define BME_PORT1_ASSIGNMENT 6
#define BME_PORT2_ASSIGNMENT 5
#define BME_PORT3_ASSIGNMENT 4
#define BME_PORT4_ASSIGNMENT 3
#define BME_PORT5_ASSIGNMENT 2
#define BME_PORT6_ASSIGNMENT 1

//#define SEALEVELPRESSURE_HPA (1013.25)  //Probably useless for current application


// BME280 pin assignments
#define BME_SCK 13
#define BME_MISO 11
#define BME_MOSI 12
#define SN74HC595N_SER 8
#define SN74HC595N_RCLOCK 7
#define SN74HC595N_SRCLOCK 2

// PWM Fan pin assignments
#define FAN_0 10
#define FAN_1 9
#define FAN_2 6
#define FAN_3 5

// Fan tachometer pin assignments
#define FAN_0_TACO A1
#define FAN_1_TACO A2
#define FAN_2_TACO A3
#define FAN_3_TACO A4

float highTemp = 40;
float lowTemp = 25;

unsigned long currentTime;
unsigned long totalTime;
unsigned long pulse;
unsigned int freq;

unsigned char fanArray[4] = {FAN_0, FAN_1, FAN_2, FAN_3};
unsigned char fanSpeedArray[4] = {FAN_0_TACO, FAN_1_TACO, FAN_2_TACO, FAN_3_TACO};
unsigned int speedStatArray[4] = {0, 0, 0, 0};

unsigned char fanSetSpeedArray[4] = {255, 255, 255, 255};
unsigned long fanSpeedErrorCount[4] = {0, 0, 0, 0};
float fanSpeedDeviation[4] = {0, 0, 0, 0};

float temperatureStatArray[6];
unsigned char humidityStatArray[6];

unsigned char i = 0;
char inputStringBuffer[20];
char outputStringBuffer[50];

// Instantiate all BME280 temperature sensors
#if NUM_TEMP_SENSORS >= 1 
  Adafruit_BME280_sn74hc595n bme1(BME_PORT1_ASSIGNMENT, SN74HC595N_SER, SN74HC595N_SRCLOCK, SN74HC595N_RCLOCK, BME_MOSI, BME_MISO, BME_SCK);
#endif
#if NUM_TEMP_SENSORS >= 2
  Adafruit_BME280_sn74hc595n bme2(BME_PORT2_ASSIGNMENT, SN74HC595N_SER, SN74HC595N_SRCLOCK, SN74HC595N_RCLOCK, BME_MOSI, BME_MISO, BME_SCK);
#endif
#if NUM_TEMP_SENSORS >= 3
  Adafruit_BME280_sn74hc595n bme3(BME_PORT3_ASSIGNMENT, SN74HC595N_SER, SN74HC595N_SRCLOCK, SN74HC595N_RCLOCK, BME_MOSI, BME_MISO, BME_SCK);
#endif
#if NUM_TEMP_SENSORS >= 4
  Adafruit_BME280_sn74hc595n bme4(BME_PORT4_ASSIGNMENT, SN74HC595N_SER, SN74HC595N_SRCLOCK, SN74HC595N_RCLOCK, BME_MOSI, BME_MISO, BME_SCK);
#endif
#if NUM_TEMP_SENSORS >= 5
  Adafruit_BME280_sn74hc595n bme5(BME_PORT5_ASSIGNMENT, SN74HC595N_SER, SN74HC595N_SRCLOCK, SN74HC595N_RCLOCK, BME_MOSI, BME_MISO, BME_SCK);
#endif
#if NUM_TEMP_SENSORS == 6
  Adafruit_BME280_sn74hc595n bme6(BME_PORT6_ASSIGNMENT, SN74HC595N_SER, SN74HC595N_SRCLOCK, SN74HC595N_RCLOCK, BME_MOSI, BME_MISO, BME_SCK);
#endif

void setup() {
  Serial.begin(SER_BAUD_RATE);
  byte i;
  
  // TODO: Call a function that will give a unique ID and will get aacknowledgment before proceeding (Make external library)
  
  for(i=0; i<4; i++){
    pinMode(fanArray[i], OUTPUT);
    digitalWrite(fanArray[i], 1);
    //pinMode(fanSpeedArray[i], INPUT);
  }

  for(i=0; i<NUM_TEMP_SENSORS; i++){
    temperatureStatArray[i] = 0;
    humidityStatArray[i] = 0;
  }
  
  bool status;

  #if NUM_TEMP_SENSORS >= 1 
    status = bme1.begin();
    if (!status ) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!\nSensor #1");
        while (1);
    }
  #endif
  #if NUM_TEMP_SENSORS >= 2
    status = bme2.begin();
    if (!status ) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!\nSensor #2");
        while (1);
    }
  #endif
  #if NUM_TEMP_SENSORS >= 3
    status = bme3.begin();
    if (!status ) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!\nSensor #3");
        while (1);
    }
  #endif
  #if NUM_TEMP_SENSORS >= 4
    status = bme4.begin();
    if (!status ) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!\nSensor #4");
        while (1);
    }
  #endif
  #if NUM_TEMP_SENSORS >= 5
    status = bme5.begin();
    if (!status ) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!\nSensor #5");
        while (1);
    }
  #endif
  #if NUM_TEMP_SENSORS >= 6
    if (!status ) {
        Serial.println("Could not find a valid BME280 sensor, check wiring!\nSensor #6");
        while (1);
    }
    status = bme6.begin();
  #endif

  //calibrateFanRPM();
  
  totalTime = millis();
  currentTime = totalTime;
}


// Main program loop 
// Will constantly adjust fan speed based on current temperature based on UPDATE_RATE_MILLISECONDS and stores all bme280 data
// Also waits for serial commands and will send requested data
void loop() {
  if(Serial.available()>0){
    i=0;
    delay(10);
    while(Serial.available()>0){
      inputStringBuffer[i++] = Serial.read();
    }
    inputStringBuffer[i] = '\0';
    Serial.println(inputStringBuffer);
    switch(inputStringBuffer[0]){
      case 'T':
        sprintf(outputStringBuffer, "T,%d,%d,%d,%d,%d,%d",(unsigned int)(temperatureStatArray[0]*100), (unsigned int)(temperatureStatArray[1]*100), (unsigned int)(temperatureStatArray[2]*100), (unsigned int)(temperatureStatArray[3]*100), (unsigned int)(temperatureStatArray[4]*100), (unsigned int)(temperatureStatArray[5]*100));
        Serial.println(outputStringBuffer); 
        break;

      case 'S':
        sprintf(outputStringBuffer, "S,%d,%d,%d,%d",speedStatArray[0], speedStatArray[1], speedStatArray[2], speedStatArray[3]);
        Serial.println(outputStringBuffer);
        break;

      case 'H':
        sprintf(outputStringBuffer, "H,%d,%d,%d,%d,%d,%d",humidityStatArray[0], humidityStatArray[1], humidityStatArray[2], humidityStatArray[3], humidityStatArray[4], humidityStatArray[5]);
        Serial.println(outputStringBuffer);
        break;

      case 'E':
        sprintf(outputStringBuffer, "E,%d,%d,%d,%d",fanSpeedErrorCount[0], fanSpeedErrorCount[1], fanSpeedErrorCount[2], fanSpeedErrorCount[3]);        
        Serial.println(outputStringBuffer);
        break;

      case 'D':
        sprintf(outputStringBuffer, "D,%d,%d,%d,%d",(int)(fanSpeedDeviation[0]), (int)(fanSpeedDeviation[1]), (int)(fanSpeedDeviation[2]), (int)(fanSpeedDeviation[3]));        
        Serial.println(outputStringBuffer);
        break;

      default:
        Serial.println("Incorrect command!");
        break;
    }
  }

  totalTime = millis();
  if(totalTime - currentTime > UPDATE_RATE_MILLISECONDS){
    readTemperatureToArray();
    readHumidityToArray();
    setFanSpeed();
    //calculateFanSpeedDeviation();
    currentTime = millis();
  }
}

// Set the fan speed based off the current temperature
inline void setFanSpeed(){
  float x = averageTemperature();
  float m = (-255) / (highTemp - lowTemp);
  float c = 255 - (m * lowTemp);
  for(byte i=0; i<4; i++){
      if(x < lowTemp){
        digitalWrite(fanArray[i],1);
        fanSetSpeedArray[i] = 255;
      }
      else if (x > highTemp){
        digitalWrite(fanArray[i],0);
        fanSetSpeedArray[i] = 0;
      }
      else{
        fanSetSpeedArray[i] = (m * x) + c;
        analogWrite(fanArray[i], fanSetSpeedArray[i]);  
      }
      #if DEBUG
        Serial.print("y: ");
        Serial.print(fanSetSpeedArray[i]);
        Serial.print("  m: ");
        Serial.print(m);
        Serial.print("  x: ");
        Serial.print(x);
        Serial.print("  c: ");
        Serial.print(c);
        Serial.println(fanSetSpeedArray[i]);
      #endif  
    }
}

//checkFanSpeedDeviation()


// Check if fans are spinning at expected speed
inline void calculateFanSpeedDeviation(){
  for(i=0; i<4; i++){
      speedStatArray[i] = pulseIn(fanSpeedArray[i], HIGH, 2000);
      speedStatArray[i] = (unsigned int)(1000000/speedStatArray[i]);
      fanSpeedDeviation[i] = speedStatArray[i] - ((-0.7033*fanSetSpeedArray[i])+191.61); // Calculated from fan profile will be different for other models
      #if DEBUG
      Serial.print("Fan "); Serial.print(i); Serial.print(" Deviation: "); Serial.println(fanSpeedDeviation[i]);
      #endif
      if(abs(fanSpeedDeviation[i]) > FAN_SPEED_DEVIATION_TOLERANCE){
        fanSpeedErrorCount[i] += 1;       
      }
      else if((fanSpeedErrorCount[i] > 0) && (abs(fanSpeedDeviation[i]) < FAN_SPEED_DEVIATION_TOLERANCE)){
        fanSpeedErrorCount[i] -= 1; 
      }
      #if DEBUG
        Serial.print("Fan "); Serial.print(i); Serial.print(" Error: "); Serial.println(fanSpeedErrorCount[i]);
      #endif
    }
}

inline void readTemperatureToArray (){
  #if NUM_TEMP_SENSORS >= 1 
    temperatureStatArray[0] = bme1.readTemperature();
  #endif
  #if NUM_TEMP_SENSORS >= 2
    temperatureStatArray[1] = bme2.readTemperature();
  #endif
  #if NUM_TEMP_SENSORS >= 3
    temperatureStatArray[2] = bme3.readTemperature();
  #endif
  #if NUM_TEMP_SENSORS >= 4
    temperatureStatArray[3] = bme4.readTemperature();
  #endif
  #if NUM_TEMP_SENSORS >= 5
    temperatureStatArray[4] = bme5.readTemperature();
  #endif
  #if NUM_TEMP_SENSORS >= 6
    temperatureStatArray[5] = bme6.readTemperature();
  #endif
}

inline float averageTemperature(){
  #if NUM_TEMP_SENSORS >= 1 
    return temperatureStatArray[0];
  #endif
  #if NUM_TEMP_SENSORS >= 2
    (temperatureStatArray[0] + temperatureStatArray[1]) / 2;
  #endif
  #if NUM_TEMP_SENSORS >= 3
    (temperatureStatArray[0] + temperatureStatArray[1] + temperatureStatArray[2]) / 3;
  #endif
  #if NUM_TEMP_SENSORS >= 4
    (temperatureStatArray[0] + temperatureStatArray[1] + temperatureStatArray[2] + temperatureStatArray[3]) / 4;
  #endif
  #if NUM_TEMP_SENSORS >= 5
    (temperatureStatArray[0] + temperatureStatArray[1] + temperatureStatArray[2] + temperatureStatArray[3] + temperatureStatArray[4]) / 5;
  #endif
  #if NUM_TEMP_SENSORS >= 6
    (temperatureStatArray[0] + temperatureStatArray[1] + temperatureStatArray[2] + temperatureStatArray[3] + temperatureStatArray[4] + temperatureStatArray[5]) / 6;
  #endif
}

inline void readHumidityToArray (){
  #if NUM_TEMP_SENSORS >= 1 
    humidityStatArray[0] = bme1.readHumidity();
  #endif
  #if NUM_TEMP_SENSORS >= 2
    humidityStatArray[1] = bme2.readHumidity();
  #endif
  #if NUM_TEMP_SENSORS >= 3
    humidityStatArray[2] = bme3.readHumidity();
  #endif
  #if NUM_TEMP_SENSORS >= 4
    humidityStatArray[3] = bme4.readHumidity();
  #endif
  #if NUM_TEMP_SENSORS >= 5
    humidityStatArray[4] = bme5.readHumidity();
  #endif
  #if NUM_TEMP_SENSORS >= 6
    humidityStatArray[5] = bme6.readHumidity();
  #endif
}

// TODO: FIX THIS FUNCTION!
// Create a custom fan performance curve for each fan to deliver the correct power
// It's expected to take a few minutes (PER FAN!)
// Will eventually store data in EEPROM so user can manually choose when to recalibrate

inline void calibrateFanRPM(){
  byte i, j, k;
  int temp, high_pwm, low_pwm, high_speed, low_speed;

  for(i=0; i<4; i++){
    high_pwm = 0; low_pwm = 0; high_speed = 0; low_speed = 0;
    digitalWrite(fanArray[i],1);      //Set fan to lowest speed   
    delay(10000);                     //Wait for fan speed to remain constant
    for(j = 255; j > 0; j--){
      analogWrite(fanArray[i],j);
      delay(100);
      temp = 0;
      for(k=0; k<4; k++){
        temp = temp + pulseIn(fanSpeedArray[i], HIGH, 20000);
      }
      temp /= 4;
      #if DEBUG
        Serial.print("Fan: ");
        Serial.print(i);
        Serial.print("\t\tPin: ");
        Serial.print(fanArray[i]);
        Serial.print("\t\tPin_T: ");
        Serial.print(fanSpeedArray[i]);
        Serial.print("\tTacho: ");
        Serial.print(temp);
        Serial.print("\tPWM: ");
        Serial.println(j);
      #endif
    }
    digitalWrite(fanArray[i],1);
  }
}
