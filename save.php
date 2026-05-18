<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "ramen_site");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB error"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["name"], $data["phone"], $data["date"])) {
    echo json_encode(["success" => false, "error" => "Нет данных"]);
    exit;
}

$name = $data["name"];
$phone = $data["phone"];
$date = $data["date"];

if (!$name || !$phone || !$date) {
    echo json_encode(["success" => false, "error" => "Пустые поля"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO users (name, phone, birthdate) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $phone, $date);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "SQL error"]);
}

$conn->close();
?>