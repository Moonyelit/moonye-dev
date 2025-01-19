<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    // Fonction pour nettoyer les données
    function cleanInput($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }
    $name = cleanInput($_POST['name'] ?? '');
    $email = cleanInput($_POST['email'] ?? '');
    $message = cleanInput($_POST['message'] ?? '');
    $captcha = $_POST['g-recaptcha-response'] ?? ''; // Champ reCAPTCHA
    $errors = [];
    // Vérifications de base
    if (empty($name)) {
        $errors[] = 'Le champ "Nom" est obligatoire.';
    }
    if (empty($email)) {
        $errors[] = 'Le champ "Email" est obligatoire.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Adresse email invalide.';
    }
    if (empty($message)) {
        $errors[] = 'Le champ "Message" est obligatoire.';
    }
    if (empty($captcha)) {
        $errors[] = 'Le reCAPTCHA est invalide.';
    }
    // Si des erreurs sont détectées
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    // Validation reCAPTCHA v2
    $secretKey = '6Lfp-LsqAAAAAG9W06fB41-M7ZrixP4R68YgJjgm';
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($response, true);
    if (!$responseKeys['success']) {
        echo json_encode(['success' => false, 'errors' => ['La validation reCAPTCHA a échoué.']]);
        exit;
    }

}