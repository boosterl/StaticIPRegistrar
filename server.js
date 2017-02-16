var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })
var head = '<head><link rel="stylesheet" href="/css/bootstrap.min.css" /><meta name="viewport" content="width=device-width, initial-scale=1"/></head>'

app.use(express.static('static'));



app.get('/', function (req, res) {
	var html = '<html><body>'
		html += head
		data = readJSON();
		html += '<table class="table">'
		html += '<tr><th>IP Address</th><th>Description</th><th>id</th><th></th><th></th>'
		for(var node in data){
			node = data[node]
			html += '<tr>'
			html += '<td>' + node.address + '</td>'
			html += '<td>' + node.description + '</td>'
			html += '<td>' + node.id + '</td>'
			html += '<td><a href="/remove/' + node.id + '">Delete</a></td>'
			html += '<td><a href="/edit/' + node.id + '">Edit</a></td>'
			html += '</tr>'
		}
		html += '</table>'
		html += '<a href="/addNode" class="btn btn-default">Add Node</a>'
		html += '</body></html>'
		res.send(html);
})

app.get('/addNode',function(req,res){
	var html = '<html><body>'
	html += head
	html += '<form action = "/processPost/new" method = "POST">'
	html += '<div class="form-group"><label for="ipAddress" class="col-sm-2 control-label">IP Address</label>'
	html += '<input type="text" name="ipaddress" class="form-control" id="ipAddress" placeholder="IP Address"></div>'
	html += '<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label>'
	html += '<input type="text" name="description" class="form-control" id="description" placeholder="Description"></div>'
	html += '<div class="form-group"><button type="submit" class="btn btn-primary">Add</button></div>'
	html += '</body></html>'
	res.send(html);
})

app.post('/processPost/:ipid', urlencodedParser,function(req,res){
	if(req.params.ipid === "new"){
		var node = {
                        address:req.body.ipaddress,
                        description:req.body.description
                };
                saveNewNode(node);
                res.redirect('/');
	}
	else{
		var node = {
			address:req.body.ipaddress,
                        description:req.body.description,
			id:req.params.ipid
		};
		saveNode(req.params.ipid,node);
		res.redirect('/');
	}
})

app.get('/remove/:ipid',function(req,res){
	var data = readJSON();
	delete data["ip" + req.params.ipid];
	writeJSON(data);
	res.redirect('/');
})

app.get('/edit/:ipid',function(req,res){
	var data = readJSON();
	var node = data["ip"+req.params.ipid]
	var ipaddress = node.address;
	var description = node.description
	var html = '<html><body>'
	html += head
	html += '<form action = "/processPost/' + req.params.ipid + '" method = "POST">'
        html += '<div class="form-group"><label for="ipAddress" class="col-sm-2 control-label">IP Address</label>'
        html += '<input type="text" name="ipaddress" class="form-control" id="ipAddress" value="' + ipaddress + '"></div>'
        html += '<div class="form-group"><label for="description" class="col-sm-2 control-label">Description</label>'
        html += '<input type="text" name="description" class="form-control" id="description" value="' + description + '"></div>'
        html += '<div class="form-group"><button type="submit" class="btn btn-primary">Change</button></div>'
        html += '</body></html>'
        res.send(html);
})

function readJSON(){
	if (!(fs.existsSync( __dirname + "/" + "staticips.json"))) {
    		fs.writeFileSync('staticips.json',"{}" );
	}
	return JSON.parse(fs.readFileSync( __dirname + "/" + "staticips.json", 'utf8'));
}

function writeJSON(data){
	fs.writeFile('staticips.json', JSON.stringify(data),  function(err) { if (err) {
                        return console.error(err);
                }
        });
}

function saveNode(id,node){
	var data = readJSON();
	data["ip" + id] = node;
	writeJSON(data);
}

function saveNewNode(node){
	var data = readJSON();
	var id = Object.keys(data).length + 1;
	node.id = id;
	saveNode(id,node);
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
