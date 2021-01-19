
function intervalFunc() {
    
var https = require('https');
var querystring = require('querystring');
const si = require('systeminformation');

//time
var time = Date.now();
var date = new Date(time);
//PM2.5 simulation
var PM = parseInt(Math.random()*(30+1),10);
 //var token = ‘xxx’;这个地方是连接的权限信息，可以和连接的人讨论即可

var options = {

    hostname: 'solid-iot.solidcommunity.net',
    port: '443',				// 端口固定

    path: '/iot/sensor-003.ttl',
    method: 'PATCH',			// get和post请求
    json: true,				// 此地方表示json
    rejectUnauthorized: true,  //请校验服务器证书，否则ssl没有意义。
    headers: {
        "Content-Type": 'application/sparql-update',
    }
}

urlObject = "INSERT DATA{\r\n";
obs = "<http://insa-toulouse.fr/solid-iot/pollution/obs-"+timetrans(date)+">";
urlObject += obs + " a " + "<http://www.w3.org/ns/sosa/Observation>" + ".\r\n";
urlObject += obs+"<http://www.w3.org/ns/sosa/hasSimpleResult> "+"\""+PM+"\u2103"+"\"@en.\r\n";
urlObject += obs+"<http://www.w3.org/ns/sosa/resultTime> "+"\""+timetrans(date)+"\""+"^^"+"<http://www.w3.org/2001/XMLSchema#dateTime>.\r\n"
//urlObject += obs+"<http://www.w3.org/ns/sosa/madeBySensor> "+"<http://insa-toulouse.fr/solid-iot/pollution/sensor-Temperature>.\r\n"

urlObject += "}";

let parsedQuery = querystring.stringify(urlObject, ", ", ":"); 
         
var req = https.request(options, function (res) {  
    res.setEncoding('utf8');  
});  
  
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});  
  
req.write(urlObject);  
  
req.end();

    console.log('Cant stop me now!');

}

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


  
setInterval(intervalFunc, 5000);