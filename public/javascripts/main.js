$(function(){
    var paper = Raphael("canvas", 500, 500);
    document.oncontextmenu = function() {return false;};
    // $('#canvas').mousedown(OnMouseDown);
    // $('#canvas').mousemove(OnMouseMove);
    // $('#canvas').mouseup(OnMouseUp);
    $('#canvas').dblclick(DrawRectangle);
    var rects = [];
    var drawrec;
    var held = false;
    var resizing = false;
    var box;
    var currImage;
    var startTime;
    var drawCol;
    var boxOffsetX = 50*4;
    var boxOffsetY = 20*4;
    var width = 100*4;
    var height = 40*4;
    $.ajax({
      url: "/getimage",
      dataType: "json"
    }).done(function( data ) {
        console.log(data);
        var imgName = data.name;
        var boxes = data.boxes;
        currImage = 0;
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
                // c.mousemove(changeCursor);
                // c.mouseout(removeBut);
                // c.mousedown(removeBox);
                // c.drag(dragMove, dragStart, dragEnd);
                var col = '#' + Math.floor(Math.random()*16777215).toString(16);
                c.attr("fill", col);
                c.attr("fill-opacity", 0.4);
                c.attr("stroke", col);
                c.attr("stroke-width", 4);
            }
            startTime = new Date();
            $('#loading').toggle();
        });
    });

    $('#skipImage').click(function(){
        mixpanel.track("Skip Image clicked");
        $('#loading').toggle();
        $.ajax({
          url: "/getnextimage/"+currImage,
          dataType: "json"
        }).done(function( data ) {
            removeRectangles();
            currImage++;
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
                    var col = '#' + Math.floor(Math.random()*16777215).toString(16);
                    c.attr("fill", col);
                    // c.mousemove(changeCursor);
                    // c.mouseout(removeBut);
                    // c.mousedown(removeBox);
                    // c.drag(dragMove, dragStart, dragEnd);
                    rects.push(c);
                    c.attr("fill-opacity", 0.4);
                    c.attr("stroke", col);
                    c.attr("stroke-width", 4);
                }
                startTime = new Date();
                $('#loading').toggle();
            });
        });
    });

    $('#saveImage').click(function(){
        var elapsed = new Date() - startTime;
        mixpanel.track("Save Image clicked");
        $('#loading').toggle();
        var result = {};
        var imgName = $('#testImage').attr('src');
        imgName = imgName.split('/')[1] + '/' + imgName.split('/')[3];
        result.name = imgName;
        var boxes = [];
        for(var i = 0 ; i<rects.length; i++){
            var box = {};
            box.x = rects[i].attr("x");
            box.y = rects[i].attr("y");
            box.width = rects[i].attr("width");
            box.height = rects[i].attr("height");
            boxes.push(box);
        }
        result.boxes = boxes;
        result.time = elapsed;
        $.ajax({
            url: "/postresult",
            method: "POST",
            data: result
        }).done(function(data){
            console.log("Sent");
        });
        $.ajax({
          url: "/getnextimage/"+currImage,
          dataType: "json"
        }).done(function( data ) {
            removeRectangles();
            currImage++;
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
                    var col = '#' + Math.floor(Math.random()*16777215).toString(16);
                    c.attr("fill", col);
                    // c.mousemove(changeCursor);
                    // c.mouseout(removeBut);
                    // c.mousedown(removeBox);
                    // c.drag(dragMove, dragStart, dragEnd);
                    rects.push(c);
                    c.attr("fill-opacity", 0.4);
                    c.attr("stroke", col);
                    c.attr("stroke-width", 4);
                }
                startTime = new Date();
                $('#loading').toggle();
            });
        });
    });

    function removeRectangles(){
        console.log(rects.length);
        for(var i = 0; i<rects.length; i++){
            rects[i].remove();
        }
        rects = [];
    }

    function removeBox(e){
        mixpanel.track("Box removed");
        console.log("here");
        if (e.which == 3){
            console.log("right click");
            var index = rects.indexOf(this);
            rects.splice(index, 1);
            this.remove();
        }
        // this.remove();
        // removeBut();
    }

    // function OnMouseDown(e){
    //    var offset = $("#canvas").offset();//This is JQuery function
    //    mouseDownX = e.pageX - offset.left;
    //    mouseDownY = e.pageY - offset.top;
    //    held = true;
    // }

    // function OnMouseMove(e){
    //     if(held && !resizing){
    //         var offset = $("#canvas").offset();
    //         var upX = e.pageX - offset.left;
    //         var upY = e.pageY - offset.top;
    //         var width = upX - mouseDownX;
    //         var height = upY - mouseDownY;
    //         updateRectangle(mouseDownX, mouseDownY, width, height);
    //     }
    // }

    // function OnMouseUp(e){
    //     held = false;
    //    var offset = $("#canvas").offset();//This is JQuery function
    //    var upX = e.pageX - offset.left;
    //    var upY = e.pageY - offset.top;

    //    var width = upX - mouseDownX;
    //    var height = upY - mouseDownY;
    //    if(!resizing){
    //         mixpanel.track("New box drawn");
    //         drawrec.remove();
    //         drawrec = undefined;
    //         DrawRectangle(mouseDownX, mouseDownY, width, height);
    //    }
    // }

    function DrawRectangle(e){
        var offset = $("#canvas").offset();//This is JQuery function
       mouseDownX = e.pageX - offset.left;
       mouseDownY = e.pageY - offset.top;
       console.log(mouseDownX, mouseDownY);
       var x = mouseDownX - boxOffsetX;
       var y = mouseDownY - boxOffsetY;
       var element = paper.rect(x, y, width, height);
       drawCol = '#' + Math.floor(Math.random()*16777215).toString(16);
       rects.push(element);
       element.mousemove(changeCursor);
       element.mouseout(removeBut);
       element.drag(dragMove, dragStart, dragEnd);
       element.mousedown(removeBox);
       element.attr("fill", drawCol);
       element.attr("fill-opacity", 0.5);
       element.attr("stroke", drawCol);
       element.attr("stroke-width", 4);
    }

    function updateRectangle(x, y, w, h){
        if(drawrec === undefined){
            drawrec = paper.rect(x, y, w, h);
            drawCol = '#' + Math.floor(Math.random()*16777215).toString(16);
            drawrec.attr({
                     fill: drawCol,
                     stroke: drawCol,
                     "fill-opacity": 0.5,
                     "stroke-width": 4
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
    };

    var changeCursor = function(e, mouseX, mouseY) {
     
        // Don't change cursor during a drag operation
        if (this.dragging === true) {
            return;
        }
        // this.unclick(removeBox);
        $('#removeButton').hide();
        // X,Y Coordinates relative to shape's orgin
        var relativeX = mouseX - $('#canvas').offset().left - this.attr('x');
        var relativeY = mouseY - $('#canvas').offset().top - this.attr('y');

        var shapeWidth = this.attr('width');
        var shapeHeight = this.attr('height');

        var resizeBorder = 10;
        var closeBox = 20;

        // Change cursor
        // if (relativeX < resizeBorder && relativeY < resizeBorder) { 
        //     this.attr('cursor', 'nw-resize');
        // } else if (relativeX > shapeWidth-closeBox && relativeY < closeBox) {
        //     this.attr('cursor', 'pointer');
        //     $('#removeButton').show();
        //     $('#removeButton').css('position', 'absolute');
        //     $('#removeButton').css('left', this.attr('x') + this.attr('width') - resizeBorder + 'px');
        //     $('#removeButton').css('top', this.attr('y') - resizeBorder +'px');
        //     box = this;
        //     this.click(removeBox);
        // } else if (relativeX > shapeWidth-resizeBorder && relativeY > shapeHeight-resizeBorder) { 
        //     this.attr('cursor', 'se-resize');
        // } else if (relativeX < resizeBorder && relativeY > shapeHeight-resizeBorder) { 
        //     this.attr('cursor', 'sw-resize');
        // } else if (relativeX > shapeWidth-resizeBorder && relativeY > resizeBorder && relativeY < shapeHeight-resizeBorder) {
        //     this.attr('cursor', 'e-resize');
        // } else if(relativeX < resizeBorder && relativeY > resizeBorder && relativeY < shapeHeight-resizeBorder){
        //     this.attr('cursor', 'w-resize');
        // } else if(relativeY < resizeBorder && relativeX > resizeBorder && relativeX < shapeWidth-resizeBorder){
        //     this.attr('cursor', 'n-resize');
        // } else if(relativeY > shapeHeight-resizeBorder && relativeX > resizeBorder && relativeX < shapeWidth-resizeBorder){
        //     this.attr('cursor', 's-resize');
        // } else { 
        //     this.attr('cursor', 'move');
        // }

        // if (relativeX > shapeWidth-closeBox && relativeY < closeBox) {
        //     this.attr('cursor', 'pointer');
        //     $('#removeButton').show();
        //     $('#removeButton').css('position', 'absolute');
        //     $('#removeButton').css('left', this.attr('x') + this.attr('width') - resizeBorder + 'px');
        //     $('#removeButton').css('top', this.attr('y') - resizeBorder +'px');
        //     box = this;
        //     this.click(removeBox);
        // } else { 
            this.attr('cursor', 'move');
        // }
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

            case 'n-resize' :
                this.attr({
                    y: this.oy + dy,
                    height: this.oh - dy
                });
                break;

            case 'e-resize' :
                this.attr({
                    width: this.ow + dx,
                });
                break;

            case 's-resize':
                this.attr({
                    height: this.oh + dy
                });
                break;

            case 'w-resize':
                this.attr({
                    x: this.ox + dx,
                    width: this.ow - dx,
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
        mixpanel.track("Box edited");
    };
});
