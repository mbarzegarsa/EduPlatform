<?php
// proxy.php - پروکسی ساده برای دریافت تصاویر از سیدا
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$code = isset($_GET['code']) ? $_GET['code'] : '';
$province = isset($_GET['province']) ? $_GET['province'] : '16';
$area = isset($_GET['area']) ? $_GET['area'] : '1670';
$school = isset($_GET['school']) ? $_GET['school'] : '54130808';

if (empty($code)) {
    http_response_code(400);
    die('کد ملی وارد نشده است');
}

// حذف صفرهای ابتدایی
$fileCode = ltrim($code, '0');
if ($fileCode === '') $fileCode = '0';

$url = "https://sida.medu.ir/ImageStudent/{$province}/{$area}/{$school}/{$fileCode}.jpg";

// دریافت تصویر با cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    CURLOPT_REFERER => 'https://sida.medu.ir/',
    CURLOPT_SSL_VERIFYPEER => false
]);

$imageData = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || strlen($imageData) < 1000) {
    http_response_code(404);
    die('تصویر یافت نشد');
}

header('Content-Type: image/jpeg');
header('Content-Length: ' . strlen($imageData));
echo $imageData;
?>