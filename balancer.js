var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var request = require('request')
var lastserver= '8082'
///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next)
{
        console.log(req.method, req.url);

        // ... INSERT HERE.
        
        next(); // Passing the request to the next handler in the stack.
})


// HTTP SERVER
   var server = app.listen(8084, function () {
   client.set('lastserv','8082')
   var host = server.address().address
   var port = server.address().port
    
   console.log('Example app listening at http://%s:%s', host, port)
 })


app.get('/',function(req,res){
 
  client.get('lastserv',function(err,value){
   if(value =='8082')
   {
     lastserver= '8083'
     client.set('lastserv','8083')
   }
   else
   {
     lastserver='8082'
     client.set('lastserv','8082')
   }
   request('http://localhost:'+lastserver+'/', function(error,response,body){

   if(!error && response.statusCode==200)
	{
	res.send(body)
        }


    })
   })
})


app.get('/set',function(req,res){

ient.get('lastserv',function(err,value){
   if(value =='8082')
   {
     lastserver= '8083'
     client.set('lastserv','8083')
   }
   else
   {
     lastserver='8082'
     client.set('lastserv','8082')
   }
   request('http://localhost:'+lastserver+'/set', function(error,response,body){

   if(!error && response.statusCode==200)
        {
        res.send(body)
        }


    })
   })
})

app.get('/visited',function(req,res){

 client.get('lastserv',function(err,value){
   if(value =='8082')
   {
     lastserver= '8083'
     client.set('lastserv','8083')
   }
   else
   {
     lastserver='8082'
     client.set('lastserv','8082')
   }
   request('http://localhost:'+lastserver+'/visited', function(error,response,body){

   if(!error && response.statusCode==200)
        {
        res.send(body)
        }


    })
   })

})


