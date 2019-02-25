<?php

$size = $_FILES['audio_data']['size'];
$input = $_FILES['audio_data']['tmp_name'];
$output = $_FILES['audio_data']['name'].".wav";

move_uploaded_file($input, $output)
?>