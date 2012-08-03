<?php

/* pages/redelephantpizzaparty.html.twig */
class __TwigTemplate_034b381408fdf0bd8467aa0aa4cd2045 extends Twig_Template
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
<script type=\"text/javascript\" src=\"swfobject.js\"></script>
\t\t<script type=\"text/javascript\">
\t\tswfobject.registerObject(\"myId\", \"9.0.0\", \"expressInstall.swf\");
\t\t</script>


  \t\t\t<object id=\"myId\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"900\" height=\"600\">
\t\t\t\t<param name=\"movie\" value=\"HelloWorld.swf\" />
        \t\t<!--[if !IE]>-->
\t\t\t\t<object type=\"application/x-shockwave-flash\" data=\"HelloWorld.swf\" width=\"900\" height=\"600\">
\t\t\t\t<!--<![endif]-->
\t\t\t\t<div>
\t\t\t\t\t<h1>Alternative content</h1>
\t\t\t\t\t<p><a href=\"http://www.adobe.com/go/getflashplayer\"><img src=\"http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\" /></a></p>
\t\t\t\t</div>
\t\t\t\t<!--[if !IE]>-->
\t\t\t\t</object>
\t\t\t\t<!--<![endif]-->
\t\t\t</object>
\t\t




     </div>
 </div> 

";
    }

    public function getTemplateName()
    {
        return "pages/redelephantpizzaparty.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
