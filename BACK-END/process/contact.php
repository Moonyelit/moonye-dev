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
    $captcha = $_POST['g-recaptcha-response'] ?? '';

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

    // Validation reCAPTCHA v3
    $secretKey = '6LfI8LsqAAAAAD6Wx-jchHmmWoQk5SqcF33FscRG';
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captcha");
    $responseKeys = json_decode($response, true);

    if (!$responseKeys['success'] || $responseKeys['score'] < 0.5) {
        echo json_encode(['success' => false, 'errors' => ['La validation reCAPTCHA a échoué.']]);
        exit;
    }

    // Envoi de l'email
    $to = 'hello.devfougerouse@gmail.com';
    $subject = 'Nouveau message du formulaire de contact';
    $headers = [
        'From' => $email,
        'Reply-To' => $email,
        'Content-Type' => 'text/plain; charset=UTF-8',
    ];
    $mailBody = "Nom: $name\nEmail: $email\nMessage:\n$message";

    if (mail($to, $subject, $mailBody, implode("\r\n", $headers))) {
        echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
    } else {
        echo json_encode(['success' => false, 'errors' => ['Erreur lors de l\'envoi de l\'email.']]);
    }
} else {
    http_response_code(405); // Méthode non autorisée
    echo json_encode(['success' => false, 'errors' => ['Requête invalide.']]);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer le jeton reCAPTCHA
    $captchaToken = $_POST['g-recaptcha-response'] ?? '';

    if (empty($captchaToken)) {
        die('Erreur : le jeton reCAPTCHA est manquant.');
    }

    // Clé secrète reCAPTCHA
    $secretKey = '6LfI8LsqAAAAAD6Wx-jchHmmWoQk5SqcF33FscRG';

    // Vérification du jeton via l'API reCAPTCHA
    $response = file_get_contents(
        "https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$captchaToken"
    );

    $responseKeys = json_decode($response, true);

    if (!$responseKeys['success'] || $responseKeys['score'] < 0.5) {
        die('Échec de la validation reCAPTCHA. Vous pourriez être un bot.');
    }

    // Traitement des données utilisateur
    $name = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
    $email = htmlspecialchars(strip_tags(trim($_POST['email'] ?? '')));
    $message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

    if (empty($name) || empty($email) || empty($message)) {
        die('Erreur : Tous les champs doivent être remplis.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die('Erreur : Adresse email invalide.');
    }

    // Exemple d'envoi de l'email
    $to = 'hello.devfougerouse@gmail.com';
    $subject = 'Nouveau message de contact';
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
    $emailBody = "Nom: $name\nEmail: $email\nMessage:\n$message";

    if (mail($to, $subject, $emailBody, $headers)) {
        echo 'Message envoyé avec succès.';
    } else {
        echo 'Erreur lors de l\'envoi du message.';
    }
} else {
    die('Requête invalide.');
}

?>
