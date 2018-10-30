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

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    echo "Error: Failed to make a MySQL connection, here is why: \n";
    echo "Errno: " . $conn->connect_errno . "\n";
    echo "Error: " . $conn->connect_error . "\n";
    die("Connection failed: " . $conn->connect_error);
}

function sql_safe(&$item, $key){
    global $conn;
    $item = $conn->real_escape_string($item);
}

if (key($_POST) == "add_caller") {
    echo "\n:: running " . key($_POST);
    // Create connection

    $q = <<<EOT
    INSERT INTO callers(fname, lname, phone) values('{$_POST["fname"]}','{$_POST["lname"]}',{$_POST["phone"]});
EOT;
    echo "\n:: SQL = " . $q;
    if (!$conn->query($q)) {
        echo "\n:: Insert failed: (" . $conn->errno . ") " . $conn->error;
    }
    $conn->commit();

    $res = $conn->query("SELECT * FROM callers");
    $row = $res->fetch_assoc();

    echo json_encode($row);

    $conn->close();
}
print_r($_SERVER);
print_r($_REQUEST);
echo ($_POST);
if (key($_REQUEST) == "add_event") {
    echo ":: running " . key($_REQUEST);
//    echo "<br>";
//    print_r($_REQUEST);
//    echo "<br>";
    array_walk($_REQUEST, sql_safe);
    $q = <<<EOT
    INSERT INTO callers(fname, lname, phone) values(
    '{$_REQUEST["callers_fname"]}',
    '{$_REQUEST["callers_lname"]}',
    {$_REQUEST["callers_phone"]})
EOT;
    echo "\n:: SQL = " . $q;
    echo "<br>";
    if (!$conn->query($q)) {
        echo "\n:: Insert failed: (" . $conn->errno . ") " . $conn->error;
        echo "<br>";
    }
    $caller_id = $conn->insert_id;

    $q = <<<EOT
    INSERT INTO event_tickets(title_old) values('{$_REQUEST["event_info_title"]}')
EOT;
//    echo "\n:: SQL = " . $q;
//    echo "<br>";
    if (!$conn->query($q)) {
        echo "\n:: Insert failed: (" . $conn->errno . ") " . $conn->error;
        echo "<br>";
    }
    $event_id = $conn->insert_id;

    $q = <<<EOT
    INSERT INTO caller_events(caller_events.event_id, caller_events.caller_id) values(
    {$event_id}, {$caller_id})
EOT;
//    echo "\n:: SQL = " . $q;
//    echo "<br>";
    if (!$conn->query($q)) {
        echo "\n:: Insert failed: (" . $conn->errno . ") " . $conn->error;
        echo "<br>";
    }

    $q = <<<EOT
    INSERT INTO event_info(event_info.event_id, event_info.title, 
                           event_info.priority, event_info.body,
                           event_info.category_id, event_info.lat, 
                           event_info.long, event_info.address,
                           event_info.city, event_info.state,
                           event_info.zip, event_info.user_id, event_info.rad, event_info.status_id) values(
    {$event_id}, '{$_REQUEST["event_info_title"]}', {$_REQUEST["event_info_priority"]},
    '{$_REQUEST["event_info_body"]}', {$_REQUEST["event_info_category_id"]}, 
    {$_REQUEST["event_info_lat"]}, {$_REQUEST["event_info_long"]}, '{$_REQUEST["event_info_address"]}',
    '{$_REQUEST["event_info_city"]}', '{$_REQUEST["event_info_state"]}', {$_REQUEST["event_info_zip"]}, 
    {$_REQUEST["event_info_user_id"]}, {$_REQUEST["event_info_rad"]},{$_REQUEST["event_info_status_id"]})
EOT;
//    echo "\n:: SQL = " . $q;
//    echo "<br>";
    if (!$conn->query($q)) {
        echo "\n:: Insert failed: (" . $conn->errno . ") " . $conn->error;
        echo "<br>";
    }


    $conn->commit();
    $conn->close();
}


if (key($_REQUEST) == "other") {
    // Create connection

    $q = <<<EOT
    SELECT * from event_tickets WHERE title_old LIKE '%{$_REQUEST["title"]}%'
EOT;
    $res = $conn->query($q);

}
