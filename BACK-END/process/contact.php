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
?>
