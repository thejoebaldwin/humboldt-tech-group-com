<?php

/* main/contact.html.twig */
class __TwigTemplate_70d06dad4650080b10fe7df0165cf3fb extends Twig_Template
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

     <div id=\"content\" class='contact'>
                    <div>
<span class='contactspan'>contact@</span><span class='contactspan'>humboldttechgroup.com</span>

<table width=\"100%\">
      <tr>
         <td colspan=\"2\">
            <a target=\"_blank\" href=\"http://twitter.com/thejoebaldwin\"><img src=\"/images/Twitter-icon.png\"></a>
            <a target=\"_blank\" href=\"http://www.facebook.com/pages/Humboldt-Technology-Group-LLC/89789096791?ref=ts\"><img src=\"/images/FaceBook-icon.png\"></a>
            <a href=\"http://www.linkedin.com/in/thejoebaldwin\" target=\"_blank\"><img src=\"/images/linkedin_32.png\"></a>
            <a href=\"http://www.youtube.com/user/HTGMedia\" target=\"_blank\"><img src=\"/images/youtube_white.png\"></a>
            <a href=\"http://www.joesharepoint.com\" target=\"_blank\"><img src=\"/images/wordpress.png\"></a>
            <a href=\"http://itunes.apple.com/us/artist/humboldt-technology-group/id427924873\" target=\"_blank\"><img src=\"/images/apps_32.png\"></a>
            <a href=\"http://github.com/thejoebaldwin\" alt=\"Github\"><img src=\"/images/git_32.png\"></a>
         </td>
      </tr>
</table>                    </div>
              </div> 
";
    }

    public function getTemplateName()
    {
        return "main/contact.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
