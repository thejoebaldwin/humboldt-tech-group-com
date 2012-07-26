<?php

/* main/content.html.twig */
class __TwigTemplate_dc7b1d0e8fc997963d37d447295eeede extends Twig_Template
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
        ";
        // line 6
        if (isset($context["html"])) { $_html_ = $context["html"]; } else { $_html_ = null; }
        echo $_html_;
        echo "
     </div>
 </div> 

";
    }

    public function getTemplateName()
    {
        return "main/content.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
