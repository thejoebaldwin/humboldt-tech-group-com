<?php

/* pages/vine2.html.twig */
class __TwigTemplate_b56b7c35632b1fbea21ce66cf1e655b1 extends Twig_Template
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
 

var endY = 190;
var endX = 100;
var orgY = endY;
var orgX = endX;


X = 1;
Y = 1;

var start = true;

changeover = true;
mode = \"wave\";
var step = 4;

var transition = false;

function animate(){
    var canvas = document.getElementById(\"myCanvas\");
    var context = canvas.getContext(\"2d\");
    
    context.beginPath();
    context.lineWidth = context.lineWidth - 0.025;
    
    
    if (endX > orgX + 200 && mode == \"wave\")
    {
        mode = \"spiral\";
        transition = true;
    }
    if (mode == \"spiral\")
    {
        endX -= 0.5;
        
        
        if (endX > orgX + 100)
        {
            if (transition)
            {
                context.moveTo(endX, endY);
                transition = false;
            }
            else
            {
                context.moveTo(x, y);    
            }
            angle = 0.075 * endX;
            x =(1+angle)* Math.sin(angle) * 2 + oldX + 60;
            y =(1+angle)* Math.cos(angle) * 2 + endY;
            context.lineTo(x, y);
        }
    }
    else 
    {
        step -= 0.01;
        endX += 1;
        context.moveTo(endX, endY);
        oldX = endX;
        endY = 20 * Math.sin(0.10 * endX) + 150;
        if (start)
        {
            context.moveTo(endX, endY);
            start = false;
        }
        context.lineTo(endX, endY);
    }
    
    context.stroke();
    
    // request new frame
    requestAnimFrame(function(){
        animate();
    });
}
 
window.onload = function(){
    // initialize stage
    var canvas = document.getElementById(\"myCanvas\");
    var context = canvas.getContext(\"2d\");
    context.fillStyle   = '#0f0'; // blue
    context.strokeStyle = '#090'; // red
    var angle = Math.PI / 10;
    context.lineWidth = 10;
    context.translate(100, 500);
    context.rotate(-5 * angle);
    animate();
};
 

    </script></head>
<body>
    <div id=\"x\"></div>
    <div id=\"y\"></div>
  <canvas id=\"myCanvas\" width=\"5000px\" height=\"5000px\"></canvas>



     </div>
 </div> 

";
    }

    public function getTemplateName()
    {
        return "pages/vine2.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
