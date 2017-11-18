#define RED_LED 11
#define GREEN_LED 10
#define BLUE_LED 9
#define WHITE_LED 6

int prog1Intensity = 255;
int prog1Time = 20;

int prog2Intensity = 255;
int prog2Time = 15;



int ledProgram[2][2] = { {prog1Intensity, prog1Time},
                          {prog2Intensity, prog2Time}
                        };

char rgbw[4] = {RED_LED, GREEN_LED, BLUE_LED, WHITE_LED};

int state;

char string[10];
int i = 0;

int ledStep = 0;
int ledState = 0;
bool ledStateReverse = 0;
bool ledClearState = 1;


unsigned long int sliderValueRGBW = 0;
unsigned char redSliderValue = 0;
unsigned char greenSliderValue = 0;
unsigned char blueSliderValue = 0;
unsigned char whiteSliderValue = 0;

void setup() {
  for (char i=0; i<=3; i++)
  {
    pinMode(rgbw[i], OUTPUT);
    digitalWrite(rgbw[i], LOW);
  }
  Serial.begin(9600);
}

void loop() {
  if(Serial.available()){
    i = 0;
    delayMicroseconds(10000);
    while(Serial.available()){
      string[i++] = Serial.read();
      }
    string[i] = '\0';
    if(string[0] == '#'){
      sliderRGBW();
      state = -1;
    }
    else if(!strcmp(string, "0")){
      state = 0;
      ledClearState = 1;
      Serial.println("Program stop");}
    else if(!strcmp(string, "1")){
      state = 1;
      ledClearState = 1;
      Serial.println("Program 1 start");}
    else if(string[0] == '2'){
      state = 2;
      ledClearState = 1;
      Serial.println("Program 2 start");}
    else
      state = -2; 
    }
    
  switch (state){
    case 0:
      clearLeds();
      state = -1;
      break;
    case 1:
      prog1();
      break;
    case 2:
      prog2();
      break;
    case -1:
      //do nothing
      break;
    case -2:
      Serial.println("Error incorrect command!");
      state = 0;
      break;
    default:
      Serial.println("Warning no command!");
      state = 0;
      break;
  }
  
}


inline void clearLeds(){
  for (char i=0; i<=3; i++)
  {
    pinMode(rgbw[i], OUTPUT);
    digitalWrite(rgbw[i], LOW);
  }
}

void clearString()
{
  string[0] = '\0';
  string[1] = '\0';
  string[2] = '\0';
  string[3] = '\0';
  string[4] = '\0';
  string[5] = '\0';
  string[6] = '\0';
  string[7] = '\0';
  string[8] = '\0';
  string[9] = '\0';
}


//fade to colour r->g->b->w
void prog1(){
  if(ledClearState == 1){
    ledState = 0;
    ledStep = 0;
    ledClearState = 0;
    clearLeds();
  }
  else if(ledState >= ledProgram[0][0])
  {
    ledState = 0;
    digitalWrite(rgbw[ledStep], LOW);
    if(ledStep == 3){
      ledStep = 0;}
    else{
      ledStep++;
      }
  }
      analogWrite(rgbw[ledStep], ledState++);
      delay(ledProgram[0][1]);
}


void prog2(){
  if(ledClearState == 1){
    ledState = 0;
    ledStateReverse = 0;
    ledStep = 0;
    ledClearState = 0;
    clearLeds();
  }
  else if((ledState <= 0) && (ledStateReverse == 1)){
    ledState = 0;
    ledStateReverse = 0;
    digitalWrite(rgbw[ledStep], LOW);
    if(ledStep == 3){
      ledStep = 0;}
    else{
      ledStep++;
      }
  }
  switch (ledStateReverse)
  {
    case 0:
      analogWrite(rgbw[ledStep], ledState++);
      delay(ledProgram[1][1]);
      if(ledState >= ledProgram[1][0])
        ledStateReverse = 1;
      break;
    case 1:
      analogWrite(rgbw[ledStep], ledState--);
      delay(ledProgram[1][1]);
      break;
  }
}


void sliderRGBW(){
  string[0] = string[1];
  string[1] = string[2];
  string[2] = string[3];
  string[3] = string[4];
  string[4] = string[5];
  string[5] = string[6];
  string[6] = string[7];
  string[7] = string[8];
  string[8] = '\0';
  
  unsigned long sliderValueRGBW = (unsigned long)strtoul(string, NULL, 16);
  redSliderValue =  (sliderValueRGBW >> 24) & 0xFF;
  greenSliderValue =  (sliderValueRGBW >> 16) & 0xFF;
  blueSliderValue =  (sliderValueRGBW >> 8) & 0xFF;
  whiteSliderValue =  sliderValueRGBW & 0xFF;
  
  if(redSliderValue == 0)
    digitalWrite(RED_LED, LOW);
  else
    analogWrite(RED_LED, redSliderValue);

  if(greenSliderValue == 0)
    digitalWrite(GREEN_LED, LOW);
  else
    analogWrite(GREEN_LED, greenSliderValue);

  if(blueSliderValue == 0)
    digitalWrite(BLUE_LED, LOW);
  else
    analogWrite(BLUE_LED, blueSliderValue);

  if(whiteSliderValue == 0)
    digitalWrite(WHITE_LED, LOW);
  else
    analogWrite(WHITE_LED, whiteSliderValue);
}




