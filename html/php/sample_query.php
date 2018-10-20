<?php
/**
 * Author: Adam Huganir
 * Date: 10/20/2018
 * Time: 12:38 PM
 */

$sample = array(
            array(
                'id' => 100,
                'title' => 'howdy'
            )
);
header('Content-Type: application/json');
echo json_encode($data);
