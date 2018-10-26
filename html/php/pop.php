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

echo "hi, thank you for " . key($_POST);

if (key($_POST) == "add_caller") {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        echo "Error: Failed to make a MySQL connection, here is why: \n";
        echo "Errno: " . $mysqli->connect_errno . "\n";
        echo "Error: " . $mysqli->connect_error . "\n";
        die("Connection failed: " . $conn->connect_error);
    }
    $q = <<<EOT
    INSERT INTO callers(fname, lname, phone) values ({$_POST["fname"]}.{$_POST["lname"]}.{$_POST["phone"]});
EOT;
    $result = $conn->query($q);
    print_r($result->fetch_assoc());

    if ($result->num_rows === 0) {
        // Oh, no rows! Sometimes that's expected and okay, sometimes
        // it is not. You decide. In this case, maybe actor_id was too
        // large?
        echo "We could not find a match for ID $aid, sorry about that. Please try again.";
        exit;
    }

}



if (key($_POST) == "add_event") {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $q = <<<EOT
    SELECT * from event_tickets WHERE title LIKE '%{$_POST["title"]}%'
EOT;
    $res = $conn->query($q);

}
