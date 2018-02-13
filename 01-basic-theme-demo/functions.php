<?php

/* Custom Template Tag */
// 按回吐資料狀況，執行 UI render logic
function get_movie_title(){
    /* Action 版本 */
    // do_action('get_movie_title');

    /* Filtet 版本 */
    $des = apply_filters('get_movie_title', []);
    echo is_null($des) ? 'No description loaded' : "電影名稱：$des";
}