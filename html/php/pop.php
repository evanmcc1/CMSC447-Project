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
    echo "\n:: running " . key($_POST);
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        echo "Error: Failed to make a MySQL connection, here is why: \n";
        echo "Errno: " . $conn->connect_errno . "\n";
        echo "Error: " . $conn->connect_error . "\n";
        die("Connection failed: " . $conn->connect_error);
    }
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



if (key($_POST) == "add_event") {
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $q = <<<EOT
    SELECT * from event_tickets WHERE title_old LIKE '%{$_POST["title"]}%'
EOT;
    $res = $conn->query($q);

}
