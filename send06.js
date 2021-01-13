var https = require('https');
var querystring = require('querystring');
//const si = require('systeminformation');

//time
var time = Date.now();
var date = new Date(time);
//PM2.5 simulation
var PM = parseInt(Math.random()*(300+1),10);
 //var token = ‘xxx’;这个地方是连接的权限信息，可以和连接的人讨论即可

var options = {
//    hostname: 'webhook.site', // 呼叫的域名
//https://solid-iot.solidcommunity.net/iot/testxu110.ttl

    hostname: 'solid-iot.solidcommunity.net',
    port: '443',				// 端口固定
//    path: '/87ca43b5-1a57-4758-b7cc-aadcad40311b',				// 请求的api名称
    path: '/iot/testxu110.ttl',
    method: 'PATCH',			// get和post请求
    json: true,				// 此地方表示json
    rejectUnauthorized: true,  //请校验服务器证书，否则ssl没有意义。
    headers: {
        "Content-Type": 'application/sparql-update',
	//	"Accept": 'application/json',             //此地方和json很有关联，需要注意
       // 'Authorization': token
    }
}

var post_data = {
    name : 'test',
    phone : '13800001111',
    address : 'FRANCE000003',
    products : [                                          // 此地方用js数组即可
        {
            "id" : 3,
            "count" : 2
        }
    ]
}

var json = JSON.stringify(post_data);

//var seconds = ROB_8_StopSeconds - ROB_8_StartSeconds;
		
/* abc = 'INSERT DATA{'
 + '<http://insa-toulouse.fr/solid-iot/pollution/obs-2021-01-11T23:40:49Z> <http://www.w3.org/ns/sosa/hasSimpleResult> "220 °C"@en.'
 +   '<http://insa-toulouse.fr/solid-iot/pollution/obs-2021-01-11T23:40:49Z> <http://www.w3.org/ns/sosa/resultTime> "2021-01-09T23:40:49Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.'
 +   '<http://insa-toulouse.fr/solid-iot/pollution/obs-2021-01-11T23:40:49Z> <http://www.w3.org/ns/sosa/madeBySensor> <http://insa-toulouse.fr/solid-iot/pollution/sensor-003>.'
 + '}'; */
/* var myquery2 = querystring.stringify({
	update: abc
    }); */
////////////////////////////////////////////////////////////////
// Import the querystring module 
//const querystring = require("querystring"); 
  
// Specify the URL object 
// to be serialized 
/* let urlObject = { 
    '<http://insa-toulouse.fr/solid-iot/pollution/obs-2021-01-11T23:40:49Z>':  '<http://www.w3.org/ns/sosa/hasSimpleResult> "220 °C"@en.', 
    '<http://insa-toulouse.fr/solid-iot/pollution/obs-2021-01-11T23:40:49Z>':' <http://www.w3.org/ns/sosa/resultTime> "2021-01-09T23:40:49Z"^^<http://www.w3.org/2001/XMLSchema#dateTime>.',
    role: ["editor", "manager"], 
};  */

urlObject = "INSERT DATA{\r\n";
obs = "<http://insa-toulouse.fr/solid-iot/pollution/obs-"+timetrans(date)+">";
urlObject += obs+"<http://www.w3.org/ns/sosa/hasSimpleResult> "+"\""+PM+"ug/m"+"\"@en.\r\n";
urlObject += obs+"<http://www.w3.org/ns/sosa/resultTime> "+"\""+timetrans(date)+"\""+"^^"+"<http://www.w3.org/2001/XMLSchema#dateTime>.\r\n"
urlObject += obs+"<http://www.w3.org/ns/sosa/madeBySensor> "+"<http://insa-toulouse.fr/solid-iot/pollution/sensor-PM2.5>.\r\n"

urlObject += "}";
// Use the stringify() method on the object 
// with sep as `, ` and eq as `:` 
let parsedQuery = querystring.stringify(urlObject, ", ", ":"); 
  
console.log("Parsed Query 1:", urlObject); 
console.log("Parsed Query 1:", parsedQuery); 
  
// Use the stringify() method on the object 
// with sep as `&&&` and eq as `==` 
//parsedQuery = querystring.stringify(urlObject, "&&&", "=="); 
  
//console.log("\nParsed Query 2:", parsedQuery);
////////////////////////////////////////////////////////////////
    
    
var req = https.request(options, function (res) {  
    res.setEncoding('utf8');  
});  
  
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});  
  
  

req.write(urlObject);  
  
req.end();

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