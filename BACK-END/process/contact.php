<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Nettoyage des données utilisateur
    function cleanInput($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }

    // Validation des données
    $name = cleanInput($_POST['name'] ?? '');
    $email = cleanInput($_POST['email'] ?? '');
    $message = cleanInput($_POST['message'] ?? '');
    $phone = cleanInput($_POST['phone'] ?? '');
    $emailConfirm = cleanInput($_POST['emailConfirm'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        die('Tous les champs obligatoires doivent être remplis.');
    }

    if ($email !== $emailConfirm) {
        die('Les adresses email ne correspondent pas.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die('Adresse email invalide.');
    }

    // Validation reCAPTCHA
    $captcha = $_POST['g-recaptcha-response'] ?? '';
    if (empty($captcha)) {
        die('Veuillez valider le reCAPTCHA.');
    }

    $secretKey = '6LeQ0rsqAAAAAGIvKU2SlHK8fFJaRi-i-QDshAPI';
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($response, true);

    if (!$responseKeys['success']) {
        die('Échec de la validation du reCAPTCHA.');
    }

    // Envoi de l'email
    $to = 'hello.devfougerouse@gmail.com';
    $subject = 'Nouveau message du formulaire de contact';
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
    $mailBody = "Nom: $name\nEmail: $email\nTéléphone: $phone\nMessage:\n$message";

    if (mail($to, $subject, $mailBody, $headers)) {
        echo 'Message envoyé avec succès.';
    } else {
        echo 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
    }
} else {
    die('Requête invalide.');
}
?>