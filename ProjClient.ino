/*********************************************************
Project:   Solid enabled IoT sensor platform
Team:      INSA 5ISS Solid-IoT team
Author:    Xiaotong XIE
Function:  POST sensor data to test website https://webhook.site/8e7ccd18-8e00-4118-8409-47358281f4fa
State:     Pass-test
*********************************************************/
#include <ESP8266WiFi.h>

#define BAUD_SPEED 115200
#define PIN_SENSOR A0

const char* ssid = "HUAWEI"; // WiFi name
const char* password ="xiexiaotong"; // WiFi password
const char* host = "webhook.site"; // host
const int httpPort = 80; // conventional port

void setup() {
  delay(1000);
  
  // WiFi connection
  Serial.begin(BAUD_SPEED);
  while (!Serial);
  Serial.print("Connecting to ");
  Serial.print(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid,password);
  while(WiFi.status() != WL_CONNECTED){
    Serial.print(" .");
    delay(1000);
  }
  Serial.println();
  Serial.println("Connection established!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Configuration of pin mode
  pinMode(PIN_SENSOR,INPUT);
}

void loop() {
  httpRequest(); // Send a http request
  delay(3000);
}

void httpRequest(){
  WiFiClient client;
  
  // String for JSON format
  String payloadJson = "{\"value\":\"";
  payloadJson += String(analogRead(PIN_SENSOR));
  payloadJson += "\"}";
  
  // String for http request
  String httpRequest = String("POST /8e7ccd18-8e00-4118-8409-47358281f4fa")+" HTTP/1.1\r\n" +
                       "Host: " + host + "\r\n" +
                       "Connection: close\r\n" +
                       "Content-Length: " + String(payloadJson.length()) +"\r\n" +
                       "Content-Type: application/json\r\n\r\n" +
                       payloadJson;  
  Serial.print("Connecting to "); 
  Serial.print(host); 

  // Send a http request to the host
  if (client.connect(host, httpPort)){ 
    Serial.println(" Success!");
    
    client.print(httpRequest);          // Send a http request to the server
    Serial.println("Sending request: ");// Print the details of http request
    Serial.println(httpRequest);     
    
    Serial.println("Web Server Response:"); // Print response from the web server        
    while (client.connected() || client.available()){ 
      if (client.available()){
        String line = client.readStringUntil('\n');
        Serial.println(line);
      }
    }
  } else{
    Serial.println(" connection failed!");
  }
  client.stop();                      // Disconnect the connection from the host
  Serial.print("Disconnected from ");
  Serial.print(host);                      
}
