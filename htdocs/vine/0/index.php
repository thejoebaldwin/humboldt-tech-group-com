<!doctype html>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
   <style>
      body {
        margin: 0px;
        padding: 0px;
      }
      #myCanvas {
        border: 1px solid #9C9898;
      }
    </style>
    <script>

function timedRefresh(timeoutPeriod)
{
	setTimeout("location.reload(true);",timeoutPeriod);
}






window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback){
        window.setTimeout(callback, 1000 / 60);
    };
})();
 

var endY = 300;
var endX = 300;


function curve(aX, aY, bX, bY, context, depth)
{
    context.beginPath();
    context.lineWidth = 2;  


    var midX = aX;
    var midY = bY

    context.strokeStyle = "#22FF22";
    context.bezierCurveTo(aX, aY, midX, midY, bX , bY);
    context.stroke();  

    context.beginPath();
    context.bezierCurveTo(aX, aY, midX +20, midY +20, bX , bY + 1);
    context.stroke();  
}


function animate(){
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
 

    // update
 
    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);
    endY = endY + 1;
    endX += 1;
    // draw
    curve(100, 100, endX, endY, context);

    curve(endX, endY, (endX * endX) / 600,(endY * endY) / 600, context);


    // request new frame
    requestAnimFrame(function(){
        animate();
    });
}
 
window.onload = function(){
    // initialize stage
 
    animate();
};
 

    </script></head>
<body>
  <canvas id="myCanvas" width="1000px" height="1000px"></canvas>
</body>
</html>