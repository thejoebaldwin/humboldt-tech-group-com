<?php

require_once('lib/Twig/Autoloader.php');
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('views');

$twig = new Twig_Environment($loader, array(
  'cache' => 'cache',
));

echo $twig->render('main/index.html.twig', array('name' => '', 'title' => 'Startpage'));

?>