var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
        
	// ... INSERT HERE.
        client.lpush("visited",req.url)
	next(); // Passing the request to the next handler in the stack.
});


 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files

    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		console.log(img);
 		});
 	}

    res.status(204).end()
 }]);

 app.get('/meow', function(req, res) {
 	{
 		if (err) throw err
		res.writeHead(200, {'content-type':'text/html'});
 //		items.forEach(function (imagedata) 
//		{
    		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
// 		});
    	res.end();
 	}
 })

// HTTP SERVER
   var server = app.listen(8082, function () {

   var host = server.address().address
   var port = server.address().port

   console.log('Example app listening at http://%s:%s', host, port)
 })


app.get('/',function(req,res){
 res.send("Server Port : 8082" )
})

app.get('/set',function(req,res){
client.set("msg_key"," This message will self destruct in 10 seconds")
client.expire("msg_key ",10)
res.send("Key added successfully")
})

app.get('/visited',function(req,res){

client.lrange("visited",0,5,function(err,value){

res.send(value);
})


})

