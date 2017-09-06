var express = require('express');
var router = express();
var storage = require("../persistence/storage.js");
var validator = require('validator');

router.get('/', function(req, res, next) {
  res.render('index', { data: storage.getAll() });
});

router.get('/create',function(req, res){
    res.render('edit',{action:'Create'});
});

router.post('/create',function(req,res){
  var host = {
      address: req.body.ipaddress,
      description: req.body.description
  }
  if(validator.isIP(host.address)){
    storage.add(host);
    res.redirect('/');
  }
  else{
    res.redirect('/create');
  }
});

router.get('/edit/:id',function(req,res){
    var host = storage.getById(req.params.id);
    res.render('edit',{action:'Edit',ipAddress:host.address,description:host.description,id:req.params.id});
});

router.post('/edit',function(req,res){
    var host = {
        address: req.body.ipaddress,
        description: req.body.description
    }
    if(validator.isIP(host.address)){
        storage.edit(req.body.id,host);
        res.redirect('/');
    }
    else{
        res.redirect('/edit/' + req.body.id);
    }
});

router.get('/up/:id',function(req,res){
    storage.moveUp(req.params.id);
    res.redirect('/');
});

router.get('/down/:id',function(req,res){
    storage.moveDown(req.params.id);
    res.redirect('/');
});

router.get('/remove/:id',function(req,res){
    storage.remove(req.params.id);
    res.redirect('/');
});

module.exports = router;
