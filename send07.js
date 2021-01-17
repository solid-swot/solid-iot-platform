var https = require('https');
var querystring = require('querystring');
const si = require('systeminformation');

//time
var time = Date.now();
var date = new Date(time);
//PM2.5 simulation
var PM = parseInt(Math.random()*(300+1),10);
 //var token = ‘xxx’;
var options = {
//    hostname: 'webhook.site', 
    hostname: 'solid-iot.solidcommunity.net',
    port: '443',				
//    path: '/87ca43b5-1a57-4758-b7cc-aadcad40311b',			
    path: '/iot/testxu110.ttl',
    method: 'PATCH',			// get,post,patch,put...
    json: true,				
    rejectUnauthorized: true,  
    headers: {
        "Content-Type": 'application/sparql-update',
	//	"Accept": 'application/json',             
    //  'Authorization': token
    }
}
// String splicing
urlObject = "INSERT DATA{\r\n";
obs = "<http://insa-toulouse.fr/solid-iot/pollution/obs-"+timetrans(date)+">";
urlObject += obs+"<http://www.w3.org/ns/sosa/hasSimpleResult> "+"\""+PM+"ug/m"+"\"@en.\r\n";
urlObject += obs+"<http://www.w3.org/ns/sosa/resultTime> "+"\""+timetrans(date)+"\""+"^^"+"<http://www.w3.org/2001/XMLSchema#dateTime>.\r\n"
urlObject += obs+"<http://www.w3.org/ns/sosa/madeBySensor> "+"<http://insa-toulouse.fr/solid-iot/pollution/sensor-PM2.5>.\r\n"

urlObject += "}";

////////////////////////////////////////////////////////////////    
var req = https.request(options, function (res) {  
    res.setEncoding('utf8');  
});  
  
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});  

req.write(urlObject);  
  
req.end();
//////////////////////////////////////////////////////////////// 
function timetrans(date){
    var date = new Date(date);//如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + 'T';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds()) + 'Z';
    return Y+M+D+h+m+s;
}