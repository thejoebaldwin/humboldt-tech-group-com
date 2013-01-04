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
        window.setTimeout(callback, 100000 / 60);
    };
})();
 

var root_x = 100;
var root_y = 300;
var height = 20;
var width = 10;
var horizontal_growth_offset = 0;
var vertical_growth_offset = 0;

var width_root_offset = width / 2;
var width_top_offset = width / 7;
var growth_counter = 0;
var circle_growth = 9;

function animate(){
    var canvas = document.getElementById("myCanvas");
    var ctx= canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.fillStyle = 'brown';
	ctx.moveTo(root_x - (width_top_offset + horizontal_growth_offset),root_y - (height +  vertical_growth_offset));
	ctx.lineTo(root_x + width_top_offset + horizontal_growth_offset,root_y - (height +   vertical_growth_offset));
	ctx.lineTo(root_x + width_root_offset + horizontal_growth_offset, root_y);
	ctx.lineTo(root_x - (width_root_offset + horizontal_growth_offset) ,root_y);
	ctx.fill();
	if (growth_counter < 300)
	{

	  horizontal_growth_offset=  horizontal_growth_offset +  0.02;
	  growth_counter = growth_counter + 1;
	  vertical_growth_offset = vertical_growth_offset + 0.4;
	
	 circle_growth =  circle_growth + 0.01;
	}
	else
	{
		if ( circle_growth < 35)
		{
		 circle_growth =  circle_growth + 0.4;
		}
	}
	ctx.beginPath();
	ctx.fillStyle = 'green';
	ctx.arc(root_x, root_y - (height +  vertical_growth_offset),  circle_growth, 10, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
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
   <div style='width:400px;'><h1>Good Morning</h1>
<p>
"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"

</p>
</div>
  <canvas id="myCanvas" width="1000px" height="1000px" style='position:absolute;top:0;left:0;'></canvas>
</body>
</html>