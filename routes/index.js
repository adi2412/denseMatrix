var fs = require('fs');
var lazy = require('lazy');
var result = require('../results.json');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DenseMatrix' });
};

exports.getimage = function(req, res){
  // var x = Math.floor((Math.random() * 169) + 1);
  var x = 0;
  var name = 'images/test-'+x+'.png';
  findBoxes(name, function(){
    var result = {
      name: '/images/dataset/test-'+x+'.png',
      boxes: boxes
    };
    res.send(JSON.stringify(result));
  });
};

exports.getnextimage = function(req,res){
  var img = parseInt(req.params.val) + 1;
  var name = 'images/test-'+img+'.png';
  findBoxes(name, function(){
    var result = {
      name: '/images/dataset/test-'+img+'.png',
      boxes: boxes
    };
    res.send(JSON.stringify(result));
  });
};

exports.postresult = function(req, res){
  var boxes = req.body.boxes;
  if(boxes){
    // console.log(JSON.stringify(boxes));
    var object = {};
    object.image = req.body.name;
    object.hpu = {};
    var resultBoxes = [];
    for(var i = 0; i<boxes.length; i++){
      var box = boxes[i];
      box.x = parseInt(box.x/4);
      box.y = parseInt(box.y/4);
      box.width = parseInt(box.width/4);
      box.height = parseInt(box.height/4);
      resultBoxes.push(box);
    }
    object.hpu.boxes = resultBoxes;
    object.hpu.time = req.body.time/1000;
    // console.log(object);
    result.push(object);
    // console.log(boxes.length);
    // var text = '';
    // for(var i = 0; i<boxes.length; i++){
    //   var box = boxes[i];
    //   var text = text + req.body.name + ' ' + parseInt(box.x)/4 + ' ' + parseInt(box.y)/4 + ' ' + parseInt(box.width)/4 + ' ' + parseInt(box.height)/4 + '\n'; 
    // }
    // fs.appendFile('output_new.txt', text, function (err) {
    //   if (err) throw err;
    // });
    // var timeText = req.body.name + ' ' + req.body.time/1000 + '\n';
    // fs.appendFile('time_new.txt', timeText, function (err) {
    //   if (err) throw err;
    // });
    fs.writeFile('results.json', JSON.stringify(result), function (err) {
      if (err) throw err;
    });
  }
  res.send("done");
};

var findBoxes = function(name, callback){
  boxes = [];
  var lines = new lazy(fs.createReadStream('./results.txt')).lines;
  lines.forEach(function(line){
    var image = line.toString().split(' ');
    if(image[0] === name){
      var box = {
        x: image[1],
        y: image[2],
        width: image[3],
        height: image[4]
      };
      boxes.push(box);
    }
  }).on('pipe', function(){
    callback();
  });
};