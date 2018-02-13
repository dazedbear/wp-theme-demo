<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen" />
    <title>Document</title>
    <?php wp_head(); ?>
</head>
<body>    
    <div class="wrapper full-height full-width">
    <main class="shadow vertical-center round">
        <h1>Event Site Demo Theme</h1>
        <!-- <p class="description round text-ellipsis">text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text </p> -->
        <p class="description round text-ellipsis">
        <?php 
            get_movie_title();
        ?></p>
        <button class="btn round">Login</button>
    </main>
    </div>
</body>
</html>