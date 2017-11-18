#include <Adafruit_NeoPixel.h>

#ifdef __AVR__
  #include <avr/power.h>
#endif

#define DEBUG 1

#define PIN 6
#define NUM_LEDS 15

unsigned char brightness = 100;

byte neopix_gamma[] = {
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
    1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
    2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
    5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
   10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
   17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
   25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
   37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
   51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
   69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
   90, 92, 93, 95, 96, 98, 99,101,102,104,105,107,109,110,112,114,
  115,117,119,120,122,124,126,127,129,131,133,135,137,138,140,142,
  144,146,148,150,152,154,156,158,160,162,164,167,169,171,173,175,
  177,180,182,184,186,189,191,193,196,198,200,203,205,208,210,213,
  215,218,220,223,225,228,231,233,236,239,241,244,247,249,252,255 };


Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRBW + NEO_KHZ800);



int prog1Intensity = 255;
int prog1Time = 20;

int prog2Intensity = 255;




//Program 2 varialbles
unsigned long prog2LastTime = 0;
int prog2Time = 75;
int prog2WhiteSpeed = 25;
int whiteLength = 5;
int head = whiteLength - 1;
int tail = 0;


int state;

char string[10];
int i = 0;

uint16_t led_i = 0, led_j = 0;

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
  // This is for Trinket 5V 16MHz, you can remove these three lines if you are not using a Trinket
  #if defined (__AVR_ATtiny85__)
    if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
  #endif
  // End of trinket special code
  
  strip.setBrightness(brightness);
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
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
    else if(string[0] == 'B'){
      //Serial.println("Brightness set");
      setBrightnessString();
    }
    else if(string[0] == '0'){
      state = 0;
      ledClearState = 1;
      //Serial.println("Program stop");
    }
    else if(string[0] == '1'){
      state = 1;
      ledClearState = 1;
      //Serial.println("Program 1 start");
    }
    else if(string[0] == '2'){
      state = 2;
      ledClearState = 1;
      //Serial.println("Program 2 start");
    }
    else
      state = -2; 
    }
    
  switch (state){
    case 0:
      //clearLeds();
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
      //Serial.println("Error incorrect command!");
      state = 0;
      break;
    default:
      //Serial.println("Warning no command!");
      state = 0;
      break;
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
    //clearLeds();
    led_i=0;
    led_j=0;
  }
  else{
    if(led_j >= 256 * 5){ // 5 cycles of all colors on wheel
      led_j = 0;}
    else{
      led_j++;}
  }
  for(led_i=0; led_i< strip.numPixels(); led_i++) {
    strip.setPixelColor(led_i, Wheel(((led_i * 256 / strip.numPixels()) + led_j) & 255));
  }
  strip.show();
  delay(1);
}


void prog2(){
 if(ledClearState == 1){
    ledState = 0;
    ledStep = 0;
    ledClearState = 0;
    //clearLeds();
    led_i=0;
    led_j=0;
    head = whiteLength - 1;
        tail = 0;
  }
  else{
    if(millis() - prog2LastTime > prog2WhiteSpeed) {
      head++;
      tail++;
      if(head == strip.numPixels()){
        head = whiteLength - 1;
        tail = 0;
      }
      prog2LastTime = millis();
      strip.show();
    }

    
  }
  
  for(led_j=0; led_j<256; led_j++) {
    for(led_i=0; led_i<strip.numPixels(); led_i++) {
      if((led_i >= tail && led_i <= head) || (tail > head && led_i >= tail) || (tail > head && led_i <= head) ){
        strip.setPixelColor(led_i, strip.Color(0,0,0, 255 ) );
      }
      else{
        strip.setPixelColor(led_i, Wheel(((led_i * 256 / strip.numPixels()) + led_j) & 255));
      }
    }
  }
  

  
        
}

void setBrightnessString(){
  string[0] = string[1];
  string[1] = string[2];
  string[2] = '\0';
  brightness = (unsigned char)strtoul(string, NULL, 16);
  //Serial.print("Brightness: ");Serial.println(brightness);
  strip.setBrightness(brightness);
  strip.show();
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
  
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.Color(redSliderValue, greenSliderValue, blueSliderValue, whiteSliderValue ) );
  }
  strip.show();
  //Serial.print("Red: ");Serial.print(redSliderValue);Serial.print("\tGreen: ");Serial.print(greenSliderValue);Serial.print("\tBlue: ");Serial.print(blueSliderValue);Serial.print("\tWhite: ");Serial.println(whiteSliderValue);
}










// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}

void pulseWhite(uint8_t wait) {
  for(int j = 0; j < 256 ; j++){
      for(uint16_t i=0; i<strip.numPixels(); i++) {
          strip.setPixelColor(i, strip.Color(0,0,0, neopix_gamma[j] ) );
        }
        delay(wait);
        strip.show();
      }

  for(int j = 255; j >= 0 ; j--){
      for(uint16_t i=0; i<strip.numPixels(); i++) {
          strip.setPixelColor(i, strip.Color(0,0,0, neopix_gamma[j] ) );
        }
        delay(wait);
        strip.show();
      }
}


void rainbowFade2White(uint8_t wait, int rainbowLoops, int whiteLoops) {
  float fadeMax = 100.0;
  int fadeVal = 0;
  uint32_t wheelVal;
  int redVal, greenVal, blueVal;

  for(int k = 0 ; k < rainbowLoops ; k ++){
    
    for(int j=0; j<256; j++) { // 5 cycles of all colors on wheel

      for(int i=0; i< strip.numPixels(); i++) {

        wheelVal = Wheel(((i * 256 / strip.numPixels()) + j) & 255);

        redVal = red(wheelVal) * float(fadeVal/fadeMax);
        greenVal = green(wheelVal) * float(fadeVal/fadeMax);
        blueVal = blue(wheelVal) * float(fadeVal/fadeMax);

        strip.setPixelColor( i, strip.Color( redVal, greenVal, blueVal ) );

      }

      //First loop, fade in!
      if(k == 0 && fadeVal < fadeMax-1) {
          fadeVal++;
      }

      //Last loop, fade out!
      else if(k == rainbowLoops - 1 && j > 255 - fadeMax ){
          fadeVal--;
      }

        strip.show();
        delay(wait);
    }
  
  }



  delay(500);


  for(int k = 0 ; k < whiteLoops ; k ++){

    for(int j = 0; j < 256 ; j++){

        for(uint16_t i=0; i < strip.numPixels(); i++) {
            strip.setPixelColor(i, strip.Color(0,0,0, neopix_gamma[j] ) );
          }
          strip.show();
        }

        delay(2000);
    for(int j = 255; j >= 0 ; j--){

        for(uint16_t i=0; i < strip.numPixels(); i++) {
            strip.setPixelColor(i, strip.Color(0,0,0, neopix_gamma[j] ) );
          }
          strip.show();
        }
  }

  delay(500);


}

void whiteOverRainbow(uint8_t wait, uint8_t whiteSpeed, uint8_t whiteLength ) {
  
  if(whiteLength >= strip.numPixels()) whiteLength = strip.numPixels() - 1;

  int head = whiteLength - 1;
  int tail = 0;

  int loops = 3;
  int loopNum = 0;

  static unsigned long lastTime = 0;


  while(true){
    for(int j=0; j<256; j++) {
      for(uint16_t i=0; i<strip.numPixels(); i++) {
        if((i >= tail && i <= head) || (tail > head && i >= tail) || (tail > head && i <= head) ){
          strip.setPixelColor(i, strip.Color(0,0,0, 255 ) );
        }
        else{
          strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
        }
        
      }

      if(millis() - lastTime > whiteSpeed) {
        head++;
        tail++;
        if(head == strip.numPixels()){
          loopNum++;
        }
        lastTime = millis();
      }

      if(loopNum == loops) return;
    
      head%=strip.numPixels();
      tail%=strip.numPixels();
        strip.show();
        delay(wait);
    }
  }
  
}
void fullWhite() {
  
    for(uint16_t i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, strip.Color(0,0,0, 255 ) );
    }
      strip.show();
}


// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256 * 5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3,0);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3,0);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0,0);
}

uint8_t red(uint32_t c) {
  return (c >> 16);
}
uint8_t green(uint32_t c) {
  return (c >> 8);
}
uint8_t blue(uint32_t c) {
  return (c);
}



