// Request an ID code by sending "GETID" than send the ID code back to confirm
// Give an ID by calling constructor
// All strings MUST be in HEX
// Only 16 bit IDs work at the moment

class SerialComms{
  public:
  
    SerialComms(uint16_t IDCODE){
      _setIdCode(IDCODE); 
    }
    
    bool sendIdCode(){
      byte i;
      while(!Serial.available());
      if(Serial.available()){
        i=0;
        delayMicroseconds(10000);
        while(Serial.available()>0){
          _serialBuffer[i++] = Serial.read();
        }
        _serialBuffer[i] = '\0';
        if(_serialBuffer[0] == 'G' && _serialBuffer[1] == 'E' && _serialBuffer[2] == 'T' && _serialBuffer[3] == 'I' && _serialBuffer[4] == 'D'){
          snprintf(_serialBuffer, 5, "%04X", _IDCODE);
          Serial.write(_serialBuffer);
          //Serial.flush();
          while(!Serial.available());
          if(Serial.available()){
            i=0;
            delayMicroseconds(10000);
            while(Serial.available()>0){
              _serialBuffer[i++] = Serial.read();
            }
            _serialBuffer[i] = '\0';
            if(_checkSerialId(_serialBuffer)){
              return 1;     
            }
            else{
              return 0;              
            }
          }                 
        }
        else{
          return 0;
        }
      }      
    }
      
    uint16_t getIdCode(){
      return _IDCODE;
    }
  
  private:
    uint16_t _IDCODE;
    char _serialBuffer[10];  
    void _setIdCode(uint16_t IDCODE){
      _IDCODE = IDCODE;
    }

    bool _checkSerialId(char IDSTR[]){
      uint8_t i;
      uint16_t IDCODE = 0;
      for(i=0; i<4; i++){
      if ((IDSTR[i] >= '0') && (IDSTR[i] <= '9')) {
          IDCODE |= ((IDSTR[i] - '0')<<(12-(4*i)));
        } 
        else if ((IDSTR[i] >= 'A') && (IDSTR[i] <= 'F')) {
          IDCODE |= ((IDSTR[i] - 55)<<(12-(4*i)));
        }
        else if ((IDSTR[i] >= 'a') && (IDSTR[i] <= 'f')) {
          IDCODE |= ((IDSTR[i] - 87)<<(12-(4*i)));
        }
        else{
          return 0;
        }
      }

      if(IDCODE == _IDCODE){
        return 1;
      }
      else{
        return 0;
      }
    } 
};

void setup() {
  Serial.begin(9600);
}

void loop() {
  SerialComms ser(0xF331);
  bool i;
  while(1){  
    Serial.println(ser.sendIdCode());
  }
}


