<?php

require_once './config.php';


//Eviter l'envoie de spam
session_start();
if (!isset($_SESSION['last_submit_time'])) {
    $_SESSION['last_submit_time'] = time();
} else {
    $delay = 30; // Délai de 30 secondes entre les envois
    if (time() - $_SESSION['last_submit_time'] < $delay) {
        echo json_encode(['success' => false, 'errors' => ['Veuillez attendre avant de soumettre à nouveau.']]);
        exit;
    }
    $_SESSION['last_submit_time'] = time();
}



if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    // Fonction pour nettoyer les données
    function cleanInput($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }

    // Récupération des données
    $name = cleanInput($_POST['name'] ?? '');
    $email = cleanInput($_POST['email'] ?? '');
    $emailConfirm = cleanInput($_POST['emailConfirm'] ?? '');
    $message = cleanInput($_POST['message'] ?? '');
    $phone = cleanInput($_POST['phone'] ?? '');
    $captcha = $_POST['g-recaptcha-response'] ?? ''; // reCAPTCHA

    $errors = [];

    // Validation des champs
    if (empty($name) || !preg_match("/^[A-Za-zÀ-ÿ\s\-]{2,50}$/", $name)) {
        $errors[] = 'Le nom est invalide ou vide.';
    }
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Adresse email invalide.';
    }
    if ($email !== $emailConfirm) {
        $errors[] = 'Les adresses email ne correspondent pas.';
    }
    if (empty($message) || strlen($message) < 10 || strlen($message) > 500) {
        $errors[] = 'Le message doit contenir entre 10 et 500 caractères.';
    }
    if (!empty($phone) && !preg_match("/^\+?\d{0,15}$/", $phone)) {
        $errors[] = 'Numéro de téléphone invalide.';
    }
    if (empty($captcha)) {
        $errors[] = 'Le reCAPTCHA est invalide.';
    }

    // Si des erreurs existent
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }

    // Validation reCAPTCHA
    $secretKey = RECAPTCHA_SECRET_KEY;
    $recaptchaResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($recaptchaResponse, true);

    if (!$responseKeys['success']) {
        echo json_encode(['success' => false, 'errors' => ['La validation reCAPTCHA a échoué.']]);
        exit;
    }

    // Vérification de la présence de liens interdits
    if (preg_match('/https?:\/\/[^\s]+/', $message)) {
        echo json_encode(['success' => false, 'errors' => ['Les liens ne sont pas autorisés dans le message.']]);
        exit;
    }

    // Envoi de l'email
    $to = 'hello.devfougerouse@gmail.com';
    $subject = 'Nouveau message du formulaire de contact';
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
    $mailBody = "Nom: $name\nEmail: $email\nTéléphone: $phone\nMessage:\n$message";

    if (mail($to, $subject, $mailBody, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
    } else {
        echo json_encode(['success' => false, 'errors' => ['Erreur lors de l\'envoi de l\'email.']]);
    }
} else {
    http_response_code(405); // Méthode non autorisée
    echo json_encode(['success' => false, 'errors' => ['Méthode non autorisée.']]);
}
?>
