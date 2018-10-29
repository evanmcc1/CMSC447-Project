<?php
/**
 * Created by PhpStorm.
 * User: Adam Huganir
 * Date: 10/22/2018
 * Time: 11:28 AM
 */
// sources:
// https://www.w3schools.com/php/
// http://php.net/manual/en/

// errors:
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$servername = "localhost";
$username = "web";
$password = "platypus";
$dbname = "rrdb";

function q_to_json($mysqli, $q)
{
    $res_set = Array();

    if ($mysqli->multi_query($q)) {
        do {
            /* store first result set */
            if ($result = $mysqli->store_result()) {
                while ($row = $result->fetch_assoc()) {
                    array_push($res_set, $row);
                }
                $result->free();
            }
        } while ($mysqli->next_result());
    }

    return json_encode($res_set);
}

function deg2miles(
    $latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $earthRadius)
{
    // source: https://stackoverflow.com/questions/10053358/measuring-the-distance-between-two-coordinates-in-php
    // convert from degrees to radians
    $latFrom = deg2rad($latitudeFrom);
    $lonFrom = deg2rad($longitudeFrom);
    $latTo = deg2rad($latitudeTo);
    $lonTo = deg2rad($longitudeTo);

    $latDelta = $latTo - $latFrom;
    $lonDelta = $lonTo - $lonFrom;

    $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
    return $angle * $earthRadius;
}

//$lat1 =  (35);
//$lat2 =  (39);
//$long1 = (-80);
//$long2 = (-76);
//$rmiles = 453;
//
//function rmile2rdegree(
//    $lat1,$long1, $d, $earthRadius = 3960)
//{
//
//    $angle = 2 *asin(sqrt($d/($earthRadius * pow(cos($lat1),2))));
//    return rad2deg($angle);
//}
//
//$a2 = pow(rmile2rdegree($lat1, $long1, $rmiles),2);
//echo sqrt(pow($rmiles,2) - $a2);

if (key($_GET) == "search_callers") {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    if ($_GET["fname"]) {
        $q = <<<EOT
    SELECT * from callers WHERE callers.fname LIKE '%{$_GET["fname"]}%'
EOT;
    } else if ($_GET["lname"]) {
        $q = <<<EOT
    SELECT * from callers WHERE callers.lname LIKE '%{$_GET["lname"]}%'
EOT;
    } else if ($_GET["fname"] && $_GET["lname"]) {
        $q = <<<EOT
    SELECT * from callers WHERE callers.fname LIKE '%{$_GET["fname"]}%' and callers.lname LIKE '%{$_GET["lname"]}%'
EOT;
    } else {
        $q = <<<EOT
    SELECT * from callers
EOT;
    };


    echo q_to_json($conn, $q);
    $conn->close();
}


if (key($_GET) == "get_events") {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $q = "SELECT * FROM events";

    echo q_to_json($conn, $q);
    $conn->close();
}

if (key($_POST) == "location_radius") {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $rad = haversineGreatCircleDistance(
        $_POST['lat'],$_POST['lat'] - $_POST['rad'],
        $_POST['long'],$_POST['long'] - $_POST['rad']);

    $lat_range = array($_POST['lat'] - $_POST['rad'], $_POST['lat'] + $_POST['rad']);
    $long_range = array($_POST['long'] - $_POST['rad'], $_POST['long'] + $_POST['rad']);

    $q = <<<EOF
    select * from events where events.lat between {$lat_range[0]} and {$lat_range[1]} and events.long between $long_range[0] and $long_range[1]
EOF;
    echo $q . "<br>";
    echo q_to_json($conn, $q);

    $conn->close();
}