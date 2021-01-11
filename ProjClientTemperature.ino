/*********************************************************
Project:              Solid enabled IoT sensor platform
Team:                 INSA 5ISS Solid-IoT team
Author:               Xiaotong XIE
Function:             POST sensor data to Solid POD https://solid-iot.solidcommunity.net/iot/sensor-001.ttl
Fingerprints(SHA1):   6C:78:63:9F:07:D2:36:80:B5:94:D7:BD:53:63:2D:71:4D:E2:04:26
Version:              Demo
*********************************************************/

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <time.h>
#include <math.h>

#define BAUD_SPEED 115200
#define PIN_SENSOR A0

const char* ssid = "HUAWEI"; // WiFi name
const char* password ="xiexiaotong"; // WiFi password

String host = "solid-iot.solidcommunity.net"; // host
String urlParams = "iot/testxie.ttl"; // path
const char fingerPrint[] PROGMEM = "6C:78:63:9F:07:D2:36:80:B5:94:D7:BD:53:63:2D:71:4D:E2:04:26"; // SHA1 SSL finger print of the host
const int httpsPort = 443; // conventional port

String sensor = "<http://insa-toulouse.fr/solid-iot/pollution/sensor-001>";
String observation = "<http://www.w3.org/ns/sosa/Observation>"; // URIs W3C:sosa
String hasSimpleResult = "<http://www.w3.org/ns/sosa/hasSimpleResult>"; 
String madeBySensor = "<http://www.w3.org/ns/sosa/madeBySensor>";
String resultTime = "<http://www.w3.org/ns/sosa/resultTime>";
String dateTime = "<http://www.w3.org/2001/XMLSchema#dateTime>";

const char* timezone = "CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00"; // Time Zone Abbreviations of France
int i=0;

const int B=4275; // Parameter of Temperture Sensor B value of the thermistor


void setup() {
  delay(1000);

  // Configuration of pin mode
  pinMode(PIN_SENSOR,INPUT);
  
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
  Serial.print("Connection is established, ");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("==============================================================================");

  // NTP server
  Serial.print("Connecting to NTP");
  configTime(0, 0, "pool.ntp.org","time.nist.gov"); // Fetch time from NTP server
  setenv("TZ", timezone, 1);
  while(!time(nullptr)){
    Serial.print(" .");
    delay(1000);   
  }
  Serial.println();
  Serial.println("Connection with NTP is established!");
  Serial.print("Syncing with NTP");
  while(i<20){
    delay(1000);
    Serial.print(" .");
    i++;
  }
  Serial.println();
  Serial.println("Synchronization is successful!");
  Serial.println("==============================================================================");

  // For test!
  //postContent();
}


void loop() {
  postContent();
  delay(60000);
}


void postContent(){
  // Get timestamp
  String ts = getTimestamp();
  String obs = "<http://insa-toulouse.fr/solid-iot/pollution/obs-"+ts+">";
  // String for Turtle format
  String payloadTurtle = "INSERT DATA{\r\n";
  payloadTurtle += obs + " a " + observation + ".\r\n";
  payloadTurtle += obs + hasSimpleResult + "\"" + String(getTemperature()) + " °C" + "\".\r\n";
  payloadTurtle += obs + resultTime + "\"" + ts +  "\"^^" + dateTime + ".\r\n";
  payloadTurtle += "}";
  // String for https request
  String httpsRequest = String("PATCH /iot/sensor-001.ttl")+" HTTP/1.1\r\n" +
                       "Host: " + host + "\r\n" +
                       "Connection: close\r\n" +
                       "Content-Length: " + String(payloadTurtle.length()) +"\r\n" +
                       "Content-Type: application/sparql-update\r\n\r\n" +
                       payloadTurtle; 
  // Use WiFiClientSecure class to create TLS connection
  WiFiClientSecure httpsClient;
  Serial.print("Connecting to "); 
  Serial.println(host);
  Serial.printf("Using fingerprint '%s'\n", fingerPrint);
  httpsClient.setFingerprint(fingerPrint); 
  httpsClient.setTimeout(15000); // 15 Seconds
  delay(1000);
  Serial.print("HTTPS Connecting");
  int r=0; //Retry counter
  while((!httpsClient.connect(host, httpsPort)) && (r < 15)){
      delay(100);
      Serial.print(".");
      r++;
  }
  Serial.println();
  if(r==15) {
    Serial.println("HTTPS connection failed!");
  }
  else {
    Serial.println("HTTPS connection successful!");
  }

  // Connection etablished
  httpsClient.print(httpsRequest);
  Serial.println("Request sent!");
  Serial.println(httpsRequest);
  // Response from the web server
  while (httpsClient.connected()) {
    String line = httpsClient.readStringUntil('\n');
    if (line == "\r") {
      Serial.println("Headers received!");
      break;
    }
  }
  // Response content
  Serial.print("Web Server response:");
  String line;
  while(httpsClient.available()){        
    line = httpsClient.readStringUntil('\n');  // Read Line by Line
    Serial.println(line); // Print response
  }
  Serial.println("------------------------------------------------------------------------------");          
}


String getTimestamp(){
  time_t now = time(nullptr);
  struct tm* p_tm = localtime(&now);// Convert a epoch number to string
  String dayStr = p_tm->tm_mday < 10 ? "0" + String(p_tm->tm_mday) : String(p_tm->tm_mday); // DD
  String monthStr = p_tm->tm_mon + 1 < 10 ? "0" + String(p_tm->tm_mon + 1) : String(p_tm->tm_mon + 1); // MM
  String yearStr = String(p_tm->tm_year + 1900); // YYYY
  String hourStr = p_tm->tm_hour < 10 ? "0" + String(p_tm->tm_hour) : String(p_tm->tm_hour); // hh
  String minuteStr = p_tm->tm_min < 10 ? "0" + String(p_tm->tm_min) : String(p_tm->tm_min); // mm
  String secondStr = p_tm->tm_sec < 10 ? "0" + String(p_tm->tm_sec) : String(p_tm->tm_sec); // ss
  String timestamp = yearStr+"-"+monthStr+"-"+dayStr+"T"+hourStr+":"+minuteStr+":"+secondStr+"Z"; //YYYY-MM-DDThh:mm:ssZ
  return timestamp;
}


float getTemperature(){
  int a = analogRead(A0);
  float R = 1023.0/((float)a)-1.0;
  R=100000.0*R;
  float temperature = 1.0/(log(R/100000.0)/B+1/298.15)-273.15; //convert to tempe rature via datasheet
  return temperature;
}
