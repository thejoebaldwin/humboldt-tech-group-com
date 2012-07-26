<?php

/* main/gears.html.twig */
class __TwigTemplate_1ff8c03f937abf3bf34971ba17ad0c0e extends Twig_Template
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

    // line 2
    public function block_content($context, array $blocks = array())
    {
        // line 3
        echo "
<div id=\"content\" class=\"content\">



<svg
width=\"500px\" height=\"300px\" 

   xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" 
 xmlns:xlink=\"http://www.w3.org/1999/xlink\"
onload=\"startup(evt)\"

>
<!-- \tonload=\"startup(evt)\" > -->
<script>
<![CDATA[
var svgDocument;
var xmlns=\"http://www.w3.org/2000/svg\"
function startup(evt) {
\tO=evt.target
\tsvgDocument=O.ownerDocument
\tO.setAttribute(\"onmousedown\",\"running=!running;offset()\")
\tgrada = svgDocument.getElementById(\"layer2\");
grada2 = svgDocument.getElementById(\"layer1\");

\toffset()
}
running=true
\tlimit=360
\tblu=2
\tblu2=21

\tincr=2
\trate=1
function offset(){
\tif (!running) return
\t
\tonestep(rate)
      onestep2(rate)


\twindow.setTimeout(\"offset()\",10)
}

function onestep2(i){
\tT=\"rotate(\"+blu2+\" 331 467)\"
  \tgrada2.setAttribute (\"transform\", T);
\tblu2=blu2-i
\tif ((blu2 < 0)) blu2=limit
}

function onestep(i){
\tT=\"rotate(\"+blu+\" 331 467)\"
\tgrada.setAttribute (\"transform\", T);
\tblu=blu+i
\tif ((blu>limit)) blu=0
}
//]]>
</script>


<g transform=\"scale(0.4, 0.4)\">
<g
transform=\"translate(600,-50) \"
>  
  <g
     inkscape:groupmode=\"layer\"
     id=\"layer1\"
     inkscape:label=\"reing\"
   >

    <g
       id=\"g3360\">
      <path
         transform=\"matrix(1.282432,0,0,1.282432,-60.220048,-128.89152)\"
         sodipodi:end=\"6.2828778\"
         sodipodi:start=\"0\"
         d=\"m 515.36349,464.50504 c 0,116.37779 -94.34284,210.72064 -210.72064,210.72064 -116.37779,0 -210.720639,-94.34285 -210.720639,-210.72064 0,-116.3778 94.342849,-210.72065 210.720639,-210.72065 116.3525,0 210.68486,94.30336 210.72063,210.65585 l -210.72063,0.0648 z\"
       
         id=\"path2993\"
         style=\"fill:#999999;stroke:none\"
         sodipodi:type=\"arc\" />
      <g
         id=\"g3189\">
        <g
           id=\"g3169\"
           transform=\"translate(0.50341,0)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999\"
             d=\"m 285.14493,149.2683 89.63071,0 17.92616,59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2\"
             d=\"m 285.14493,784.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
        <g
           id=\"g3165\"
           transform=\"matrix(0,-1,1,0,123.65909,776.76489)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-4\"
             d=\"m 265.14493,-110.7317 89.63071,0 17.92616,59.072613 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2-1\"
             d=\"m 265.14493,524.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
      </g>
      <g
         id=\"g3189-3\"
         transform=\"matrix(0.70710678,-0.70710678,0.70710678,0.70710678,-233.29013,370.39702)\">
        <g
           id=\"g3169-5\"
           transform=\"translate(0.50341,0)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-47\"
             d=\"m 285.14493,149.2683 89.63071,0 17.92616,59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2-7\"
             d=\"m 285.14493,784.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
        <g
           id=\"g3165-3\"
           transform=\"matrix(0,-1,1,0,123.65909,776.76489)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-4-6\"
             d=\"m 265.14493,-110.7317 89.63071,0 17.92616,59.072613 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2-1-4\"
             d=\"m 265.14493,524.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
      </g>
      <path
         inkscape:connector-curvature=\"0\"
         id=\"path2993-4\"
         d=\"m 330.44807,196.57023 c -149.24661,0 -270.21875,121.00339 -270.21875,270.25 0,149.24661 120.97214,270.21875 270.21875,270.21875 149.24661,0 270.25,-120.97214 270.25,-270.21875 l -60.0625,0 c 0,116.08718 -94.10032,210.1875 -210.1875,210.1875 -116.08718,0 -210.1875,-94.10032 -210.1875,-210.1875 0,-116.08718 94.10032,-210.21875 210.1875,-210.21875 116.06194,0 210.15181,94.09432 210.1875,210.15625 l 60.0625,-0.0312 c -0.0459,-149.2142 -121.03584,-270.1563 -270.25,-270.1563 z\"
         style=\"fill:#808080;fill-opacity:1;stroke:none\" />
      <path
         transform=\"matrix(0.66730121,0,0,0.66730121,127.17509,156.83975)\"
         sodipodi:end=\"6.2828778\"
         sodipodi:start=\"0\"
         d=\"m 515.36349,464.50504 c 0,116.37779 -94.34284,210.72064 -210.72064,210.72064 -116.37779,0 -210.720639,-94.34285 -210.720639,-210.72064 0,-116.3778 94.342849,-210.72065 210.720639,-210.72065 116.3525,0 210.68486,94.30336 210.72063,210.65585 l -210.72063,0.0648 z\"
         sodipodi:ry=\"210.72064\"
         sodipodi:rx=\"210.72064\"
         sodipodi:cy=\"464.50504\"
         sodipodi:cx=\"304.64285\"
         id=\"path2993-0\"
         style=\"fill:#ff0000;stroke:none\"
         sodipodi:type=\"arc\" />
    </g>
  </g>
</g>
 



<!-- ------------>



<g
transform=\"translate(0,-50)\"
>  
  <g
     inkscape:groupmode=\"layer\"
     id=\"layer2\"
     inkscape:label=\"reing\"
   >

    <g
       id=\"g3360\">
      <path
         transform=\"matrix(1.282432,0,0,1.282432,-60.220048,-128.89152)\"
         sodipodi:end=\"6.2828778\"
         sodipodi:start=\"0\"
         d=\"m 515.36349,464.50504 c 0,116.37779 -94.34284,210.72064 -210.72064,210.72064 -116.37779,0 -210.720639,-94.34285 -210.720639,-210.72064 0,-116.3778 94.342849,-210.72065 210.720639,-210.72065 116.3525,0 210.68486,94.30336 210.72063,210.65585 l -210.72063,0.0648 z\"
       
         id=\"path2993\"
         style=\"fill:#999999;stroke:none\"
         sodipodi:type=\"arc\" />
      <g
         id=\"g3189\">
        <g
           id=\"g3169\"
           transform=\"translate(0.50341,0)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999\"
             d=\"m 285.14493,149.2683 89.63071,0 17.92616,59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2\"
             d=\"m 285.14493,784.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
        <g
           id=\"g3165\"
           transform=\"matrix(0,-1,1,0,123.65909,776.76489)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-4\"
             d=\"m 265.14493,-110.7317 89.63071,0 17.92616,59.072613 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2-1\"
             d=\"m 265.14493,524.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
      </g>
      <g
         id=\"g3189-3\"
         transform=\"matrix(0.70710678,-0.70710678,0.70710678,0.70710678,-233.29013,370.39702)\">
        <g
           id=\"g3169-5\"
           transform=\"translate(0.50341,0)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-47\"
             d=\"m 285.14493,149.2683 89.63071,0 17.92616,59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2-7\"
             d=\"m 285.14493,784.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
        <g
           id=\"g3165-3\"
           transform=\"matrix(0,-1,1,0,123.65909,776.76489)\">
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-4-6\"
             d=\"m 265.14493,-110.7317 89.63071,0 17.92616,59.072613 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
          <path
             sodipodi:nodetypes=\"ccccc\"
             inkscape:connector-curvature=\"0\"
             id=\"path2999-2-1-4\"
             d=\"m 265.14493,524.34091 89.63071,0 17.92616,-59.07261 -125.48303,0 z\"
             style=\"fill:#808080;stroke:none\" />
        </g>
      </g>
      <path
         inkscape:connector-curvature=\"0\"
         id=\"path2993-4\"
         d=\"m 330.44807,196.57023 c -149.24661,0 -270.21875,121.00339 -270.21875,270.25 0,149.24661 120.97214,270.21875 270.21875,270.21875 149.24661,0 270.25,-120.97214 270.25,-270.21875 l -60.0625,0 c 0,116.08718 -94.10032,210.1875 -210.1875,210.1875 -116.08718,0 -210.1875,-94.10032 -210.1875,-210.1875 0,-116.08718 94.10032,-210.21875 210.1875,-210.21875 116.06194,0 210.15181,94.09432 210.1875,210.15625 l 60.0625,-0.0312 c -0.0459,-149.2142 -121.03584,-270.1563 -270.25,-270.1563 z\"
         style=\"fill:#808080;fill-opacity:1;stroke:none\" />
      <path
         transform=\"matrix(0.66730121,0,0,0.66730121,127.17509,156.83975)\"
         sodipodi:end=\"6.2828778\"
         sodipodi:start=\"0\"
         d=\"m 515.36349,464.50504 c 0,116.37779 -94.34284,210.72064 -210.72064,210.72064 -116.37779,0 -210.720639,-94.34285 -210.720639,-210.72064 0,-116.3778 94.342849,-210.72065 210.720639,-210.72065 116.3525,0 210.68486,94.30336 210.72063,210.65585 l -210.72063,0.0648 z\"
         sodipodi:ry=\"210.72064\"
         sodipodi:rx=\"210.72064\"
         sodipodi:cy=\"464.50504\"
         sodipodi:cx=\"304.64285\"
         id=\"path2993-0\"
         style=\"fill:#ff0000;stroke:none\"
         sodipodi:type=\"arc\" />
    </g>
  </g>
</g>
  </g>

</svg>





</div>


";
    }

    public function getTemplateName()
    {
        return "main/gears.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
