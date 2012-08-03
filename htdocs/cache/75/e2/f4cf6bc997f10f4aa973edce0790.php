<?php

/* main/vine1.html.twig */
class __TwigTemplate_75e2f4cf6bc997f10f4aa973edce0790 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->blocks = array(
            'content' => array($this, 'block_content'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_content($context, array $blocks = array())
    {
        // line 4
        echo " <div id=\"content\" class=\"content\">
     <div>
 <script>

function timedRefresh(timeoutPeriod)
{
\tsetTimeout(\"location.reload(true);\",timeoutPeriod);
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

    context.strokeStyle = \"#22FF22\";
    context.bezierCurveTo(aX, aY, midX, midY, bX , bY);
    context.stroke();  

    context.beginPath();
    context.bezierCurveTo(aX, aY, midX +20, midY +20, bX , bY + 1);
    context.stroke();  
}


function animate(){
    var canvas = document.getElementById(\"myCanvas\");
    var context = canvas.getContext(\"2d\");
 

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
 

    </script>


 <canvas id=\"myCanvas\" width=\"1000px\" height=\"1000px\"></canvas>




     </div>
 </div> 

";
    }

    public function getTemplateName()
    {
        return "main/vine1.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
