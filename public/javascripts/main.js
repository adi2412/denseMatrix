$(function(){
    var paper = Raphael("canvas", 500, 500);
    $('#canvas').mousedown(OnMouseDown);
    $('#canvas').mousemove(OnMouseMove);
    $('#canvas').mouseup(OnMouseUp);
    var rects = [];
    var drawrec;
    var held = false;
    var resizing = false;
    var box;

    $.ajax({
      url: "/getimage",
      dataType: "json"
    }).done(function( data ) {
        console.log(data);
        var imgName = data.name;
        var boxes = data.boxes;
        $('#wrapper').prepend('<img id="testImage" src="'+imgName+'">');
        var img = $('#testImage');
        img.load(function(){
            img.attr('height', img.height() * 4);
            paper.setSize(img.width(), img.height());
            // regular rectangle
            for(var i = 0; i <boxes.length; i++){
                var box = boxes[i];
                var c = paper.rect(box.x*4, box.y*4, box.width*4, box.height*4);
                rects.push(c);
                c.mousemove(changeCursor);
                c.mouseout(removeBut);
                c.drag(dragMove, dragStart, dragEnd);
                c.attr("fill", "#f00");
                c.attr("fill-opacity", 0.2);
                c.attr("stroke", "#f00");
            }
            
        });
    });

    $('#getImage').click(function(){
        $('#loading').show();
        $.ajax({
          url: "/getimage",
          dataType: "json"
        }).done(function( data ) {
            removeRectangles();
            var imgName = data.name;
            var boxes = data.boxes;
            $('#testImage').remove();
            $('#wrapper').prepend('<img id="testImage" src="'+imgName+'">');
            var img = $('#testImage');
            img.load(function(){
                img.attr('height', img.height() * 4);
                paper.setSize(img.width(), img.height());
                // regular rectangle
                for(var i = 0; i <boxes.length; i++){
                    var box = boxes[i];
                    var c = paper.rect(box.x*4, box.y*4, box.width*4, box.height*4);
                    c.attr("fill", "#f00");
                    c.mousemove(changeCursor);
                    c.mouseout(removeBut);
                    c.drag(dragMove, dragStart, dragEnd);
                    rects.push(c);
                    c.attr("fill-opacity", 0.2);
                    c.attr("stroke", "#f00");
                }
            });
            $('#loading').hide();
        });
    });

    function removeRectangles(){
        console.log(rects.length);
        for(var i = 0; i<rects.length; i++){
            rects[i].remove();
        }
        rects = [];
    }

    function removeBox(){
        this.remove();
        removeBut();
    }

    function OnMouseDown(e){
       var offset = $("#canvas").offset();//This is JQuery function
       mouseDownX = e.pageX - offset.left;
       mouseDownY = e.pageY - offset.top;
       held = true;
    }

    function OnMouseMove(e){
        if(held && !resizing){
            var offset = $("#canvas").offset();
            var upX = e.pageX - offset.left;
            var upY = e.pageY - offset.top;
            var width = upX - mouseDownX;
            var height = upY - mouseDownY;
            updateRectangle(mouseDownX, mouseDownY, width, height);
        }
    }

    function OnMouseUp(e){
        held = false;
       var offset = $("#canvas").offset();//This is JQuery function
       var upX = e.pageX - offset.left;
       var upY = e.pageY - offset.top;

       var width = upX - mouseDownX;
       var height = upY - mouseDownY;
       if(!resizing){
            drawrec.remove();
            drawrec = undefined;
            DrawRectangle(mouseDownX, mouseDownY, width, height);
       }
    }

    function DrawRectangle(x, y, w, h){
       var element = paper.rect(x, y, w, h);
       element.attr({
                fill: "#F00",
                stroke: "#F00",
                "fill-opacity": 0.2
        });
       rects.push(element);
       element.mousemove(changeCursor);
       element.mouseout(removeBut);
       element.drag(dragMove, dragStart, dragEnd);
       element.attr("fill", "#f00");
       element.attr("fill-opacity", 0.2);
       element.attr("stroke", "#f00");
    }

    function updateRectangle(x, y, w, h){
        if(drawrec === undefined){
            console.log(drawrec);
            drawrec = paper.rect(x, y, w, h);
            drawrec.attr({
                     fill: "#F00",
                     stroke: "#F00",
                     "fill-opacity": 0.2
             });
        }
        else{
            drawrec.attr({
                width: w,
                height: h
            });
        }
    }

    var removeBut = function(){
        $('#removeButton').hide();
    }

    var changeCursor = function(e, mouseX, mouseY) {
     
        // Don't change cursor during a drag operation
        if (this.dragging === true) {
            return;
        }
        this.unclick(removeBox);
        $('#removeButton').hide();
        // X,Y Coordinates relative to shape's orgin
        var relativeX = mouseX - $('#canvas').offset().left - this.attr('x');
        var relativeY = mouseY - $('#canvas').offset().top - this.attr('y');

        var shapeWidth = this.attr('width');
        var shapeHeight = this.attr('height');

        var resizeBorder = 10;
        var closeBox = 20;

        // Change cursor
        if (relativeX < resizeBorder && relativeY < resizeBorder) { 
            this.attr('cursor', 'nw-resize');
        } else if (relativeX > shapeWidth-closeBox && relativeY < closeBox) {
            this.attr('cursor', 'pointer');
            $('#removeButton').show();
            $('#removeButton').css('position', 'absolute');
            $('#removeButton').css('left', this.attr('x') + this.attr('width') - resizeBorder + 'px');
            $('#removeButton').css('top', this.attr('y') - resizeBorder +'px');
            box = this;
            this.click(removeBox);
        } else if (relativeX > shapeWidth-resizeBorder && relativeY > shapeHeight-resizeBorder) { 
            this.attr('cursor', 'se-resize');
        } else if (relativeX < resizeBorder && relativeY > shapeHeight-resizeBorder) { 
            this.attr('cursor', 'sw-resize');
        } else { 
            this.attr('cursor', 'move');
        }
    };

    var dragStart = function() {
     
        // Save some starting values
        this.ox = this.attr('x');
        this.oy = this.attr('y');
        this.ow = this.attr('width');
        this.oh = this.attr('height');
        
        this.dragging = true;
        resizing = true;
    };


    var dragMove = function(dx, dy) {

        // Inspect cursor to determine which resize/move process to use
        switch (this.attr('cursor')) {

            case 'nw-resize' :
                this.attr({
                    x: this.ox + dx, 
                    y: this.oy + dy, 
                    width: this.ow - dx, 
                    height: this.oh - dy
                });
                break;

            case 'ne-resize' :
                this.attr({ 
                    y: this.oy + dy , 
                    width: this.ow + dx, 
                    height: this.oh - dy
                });
                break;

            case 'se-resize' :
                this.attr({
                    width: this.ow + dx, 
                    height: this.oh + dy
                });
                break;

            case 'sw-resize' :
                this.attr({ 
                    x: this.ox + dx, 
                    width: this.ow - dx, 
                    height: this.oh + dy
                });
                break;

            default :
                this.attr({
                    x: this.ox + dx, 
                    y: this.oy + dy
                });
                break;

        }
    };

    var dragEnd = function() {
        this.dragging = false;
        resizing = false;
    };
});
