###Homework 3 Submission CSC791 DevOps

Unity ID : apatwar

Task1: 
1) Complete Set/Get

Code Snippet:

```
app.get('/',function(req,res){
res.send("Server Port : 8082" )
})

app.get('/get',function(req,res){
client.get("msg_key",function(err,value){
res.send(value);
})

app.get('/set',function(req,res){
client.set("msg_key"," This message will self destruct in 10 seconds")
client.expire("msg_key ",10)
res.send("Key added successfully")
})
```

Task 2) Complete Recent

Code Snippet: Completed Recent(Visited) method
```
app.get('/visited',function(req,res){
client.lrange("visited",0,5,function(err,value){
res.send(value);
})
})
```

Task 3) Complete Upload/meow

Code Snippet: 

```
 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
	console.log(req.body) // form fields
	console.log(req.files) // form files
	if( req.files.image )
	{
		fs.readFile( req.files.image.path, function (err, data) {
		if (err) res.send('');
		var img = new Buffer(data).toString('base64');
		console.log(img);
		client.lpush('images',img);
	});
	}
	res.status(204).end()
}]);

app.get('/meow', function(req, res) {
	client.lpop('images',function(err,imagedata){
	if (err) throw err
	res.writeHead(200, {'content-type':'text/html'});
	// items.forEach(function (imagedata)
	// {
	res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imagedata+"'/>");
	// });
	res.end();
})
})
```
Task 4) Additional service instance running: 

Functionality present in main.js is replicated in another file main2.js. main.js uses 8082 port while main2.js uses 8083 port. Thus, I have two services running on different ports.

Task 5) Demonstrate proxy:

Code for demonstrating proxy is written in a third file balancer.js. All the requests are initially directed towards proxy server which is running on port 8084. To implement the proxy, I have made use of a variable which stores the id of the server which last serviced the request.  So, If server running on port 8082 was the last server responsible for servicing a request, I would make the variable 8083 so the next request would be serviced by 8083. Thus, instead of servicing the requests itself, the proxy server forwards them to other servers. If we have multiple servers, we could make use of a queue, so the new requests would be serviced by servers in the queue in circular fashion.

Code Snippet:

```
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
```
Cache, Proxies, Queues
=========================

### Setup

* Clone this repo, run `npm install`.
* Install redis and run on localhost:6379

### A simple web server

Use [express](http://expressjs.com/) to install a simple web server.

	var server = app.listen(3000, function () {
	
	  var host = server.address().address
	  var port = server.address().port
	
	  console.log('Example app listening at http://%s:%s', host, port)
	})

Express uses the concept of routes to use pattern matching against requests and sending them to specific functions.  You can simply write back a response body.

	app.get('/', function(req, res) {
	  res.send('hello world')
	})

### Redis

You will be using [redis](http://redis.io/) to build some simple infrastructure components, using the [node-redis client](https://github.com/mranney/node_redis).

	var redis = require('redis')
	var client = redis.createClient(6379, '127.0.0.1', {})

In general, you can run all the redis commands in the following manner: client.CMD(args). For example:

	client.set("key", "value");
	client.get("key", function(err,value){ console.log(value)});

### An expiring cache

Create two routes, `/get` and `/set`.

When `/set` is visited, set a new key, with the value:
> "this message will self-destruct in 10 seconds".

Use the expire command to make sure this key will expire in 10 seconds.

When `/get` is visited, fetch that key, and send value back to the client: `res.send(value)` 


### Recent visited sites

Create a new route, `/recent`, which will display the most recently visited sites.

There is already a global hook setup, which will allow you to see each site that is requested:

	app.use(function(req, res, next) 
	{
	...

Use the lpush, ltrim, and lrange redis commands to store the most recent 5 sites visited, and return that to the client.

### Cat picture uploads: queue

Implement two routes, `/upload`, and `/meow`.
 
A stub for upload and meow has already been provided.

Use curl to help you upload easily.

	curl -F "image=@./img/morning.jpg" localhost:3000/upload

Have `upload` store the images in a queue.  Have `meow` display the most recent image to the client and *remove* the image from the queue.

### Proxy server

Bonus: How might you use redis and express to introduce a proxy server?

See [rpoplpush](http://redis.io/commands/rpoplpush)
