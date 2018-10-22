<?php
/**
 * Author: Adam Huganir
 * Date: 10/20/2018
 * Time: 12:38 PM
 */

$sample = array(
            array(
                'event_id' => 100,
                'title' => 'This is a ticket title',
                'comment' => 'This is the original comment',
                'category' => 'This is the category name',
                'keywords' => array('keyword 0 title','keyword 3','keyword 7','keyword 2',),
                'keyword_ids' => array(0,3,7,2),
                'lat' => 39.253428,
                'long' => -76.704070
            ),
            array(
                'event_id' => 101,
                'title' => 'This is a ticket title again',
                'comment' => 'This is the original comment again',
                'category' => 'This is the category name again',
                'keywords' => array('keyword 1 title','keyword 2','keyword 4','keyword 5',),
                'keyword_ids' => array(1,2,4,5),
                'lat' => 39.255252,
                'long' =>  -76.717229,
            )
);
header('Content-Type: application/json');
echo json_encode($sample);
