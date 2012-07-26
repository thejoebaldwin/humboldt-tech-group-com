<?php

/* main/work.html.twig */
class __TwigTemplate_47bfb372d55f20c36720dd22788a2794 extends Twig_Template
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

  <div id=\"content\" class='work'>
                    <div>
                          <h2>apps</h2>
                          <ul>
                            <li>
                              <a title='8-Bit Tea' href='http://itunes.apple.com/us/app/8-bit-tea/id427924870?mt=8'><img src='images/8bittea.png' width='50px' /></a>
                             &nbsp;
                              <a title='Play Stoplight' href='http://itunes.apple.com/us/app/play-stoplight/id475205154?mt=8'><img src='images/playstoplight.png' width='50px' /></a>
                            </li>
                         </ul>
                          <h2>web</h2>
                          <ul>
                             <li><a title='Balance Chiropractic of Green Bay' href='http://balancegb.com'>balancegb.com</a></li>
                             <li><a title='Kamikawa Art' href='http://kakart.com'>kakart.com</a></li>
                             <li><a title='Return 2 - Sender' href='http://returntosender.co'>returntosender.co</a></li>

                          </ul>
                    </div>
              </div> 
";
    }

    public function getTemplateName()
    {
        return "main/work.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }
}
