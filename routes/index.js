var fs = require('fs');
var lazy = require('lazy');
var boxes = [];
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'DenseMatrix' });
};

exports.getimage = function(req, res){
  var x = Math.floor((Math.random() * 169) + 1);
  var name = 'images/test-'+x+'.png';
  findBoxes(name, function(){
    var result = {
      name: '/images/dataset/test-'+x+'.png',
      boxes: boxes
    };
    console.log(result);
    res.send(JSON.stringify(result));
  });
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
      console.log(box);
      boxes.push(box);
    }
  }).on('pipe', function(){
    console.log("done");
    callback();
  });
};