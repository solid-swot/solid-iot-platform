/*********************************************************
Project:              Solid enabled IoT sensor platform
Team:                 INSA 5ISS Solid-IoT team
Author:               Xiaotong XIE
Function:             POST sensor data to Solid POD https://solid-iot.solidcommunity.net/iot/
Fingerprints(SHA1):   99:F4:66:89:DE:98:3A:B4:7F:AC:79:62:84:D1:48:CA:FC:CB:22:B5
State:                Pass-test
*********************************************************/

#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <time.h>

#define BAUD_SPEED 115200
#define PIN_SENSOR A0

const char* ssid = "HUAWEI"; // WiFi name
const char* password ="xiexiaotong"; // WiFi password

String host = "solid-iot.solidcommunity.net"; // host
String urlParams = "iot/"; // path
const char fingerPrint[] PROGMEM = "99:F4:66:89:DE:98:3A:B4:7F:AC:79:62:84:D1:48:CA:FC:CB:22:B5"; // SHA1 SSL finger print of the host
const int httpsPort = 443; // conventional port

String sensor = "http://insa-toulouse.fr/solid-iot/pollution/sensor-xie"; // URIs W3C:sosa
String hasSimpleResult = "http://www.w3.org/ns/sosa/hasSimpleResult";
String madeBySensor = "http://www.w3.org/ns/sosa/madeBySensor";
String resultTime = "http://www.w3.org/ns/sosa/resultTime";
String dateTime = "http://www.w3.org/2001/XMLSchema#dateTime";

int timezone = 1 * 3600; // Unit second for NTP
int i=0;


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
  Serial.print("Connection is established, ");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("==============================================================================");

  // Configuration of pin mode
  pinMode(PIN_SENSOR,INPUT);

  // NTP server
  Serial.print("Connecting to NTP");
  configTime(timezone, 0, "pool.ntp.org","time.nist.gov"); // Fetch time from NTP server
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
  postContent();
}


void loop() {
  
}


void postContent(){
  // Get timestamp
  String ts = getTimestamp();
  String obs = "http://insa-toulouse.fr/solid-iot/pollution/obs-"+ts;
  // String for JSON format
  String payloadJson = "{\"@id\":\"" + obs + "\",";
  payloadJson += "\"" + hasSimpleResult + "\":[{\"@value\":\"" + String(analogRead(PIN_SENSOR)) + "\",\"@language\":\"en\"}],";
  payloadJson += "\"" + madeBySensor + "\":[{\"@id\":\"" + sensor + "\"}],";
  payloadJson += "\"" + resultTime + "\":[{\"@value\":\"" + ts +  "\",\"@type\":\"" + dateTime + "\"}]";
  payloadJson += "}";
  // String for https request
  String httpsRequest = String("POST /iot")+" HTTP/1.1\r\n" +
                       "Host: " + host + "\r\n" +
                       "Connection: close\r\n" +
                       "Content-Length: " + String(payloadJson.length()) +"\r\n" +
                       "Content-Type: application/ld+json\r\n\r\n" +
                       payloadJson; 
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
    Serial.println("Connection failed!");
  }
  else {
    Serial.println("Connection successful!");
  }

  // Connection etablished
  httpsClient.print(httpsRequest);
  Serial.println("Request sent!");
  
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
