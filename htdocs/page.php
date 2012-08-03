
<?php

require_once('lib/Twig/Autoloader.php');
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('views');

$twig = new Twig_Environment($loader, array(
  'cache' => 'cache',
));

$words = explode('/', $_SERVER['REQUEST_URI']);
$page = $words[count($words) - 1];


echo $twig->render('pages/' . $page . '.html.twig', array('name' => '', 'title' => 'Startpage'));

?>