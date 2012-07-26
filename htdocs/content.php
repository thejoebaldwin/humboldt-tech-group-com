<?php

require_once('lib/Twig/Autoloader.php');
include_once "markdown.php";
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('views');

$twig = new Twig_Environment($loader, array(
  'cache' => 'cache',
));


$text = '*normal emphasis with asterisks*

_normal emphasis with underscore_

**strong emphasis with asterisks**

__strong emphasis with underscore__

This is some text *emphased* with asterisks.';

$words = explode('/', $_SERVER['REQUEST_URI']);


$text = file_get_contents('./' . $words[count($words) - 1] . '.markdown', true);

$html =  Markdown($text);

echo $twig->render('main/content.html.twig', array('name' => '', 'title' => 'Startpage', 'html' => $html));

?>