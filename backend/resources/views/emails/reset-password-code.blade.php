<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation de votre mot de passe</title>
  <style>
    body { margin: 0; padding: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .header { background: #0f172a; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 16px; color: #334155; margin-bottom: 16px; }
    .info { font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 28px; }
    .code-box { background: #fefce8; border: 2px dashed #fbbf24; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 28px; }
    .code { font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #b45309; font-family: 'Courier New', monospace; }
    .expiry { font-size: 12px; color: #94a3b8; margin-top: 8px; }
    .warning { font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⚡ Tech Store</h1>
    </div>
    <div class="body">
      <p class="greeting">Bonjour,</p>
      <p class="info">
        Vous avez demandé à réinitialiser votre mot de passe sur <strong>Tech Store</strong>.<br>
        Entrez le code ci-dessous sur la page de réinitialisation.
      </p>
      <div class="code-box">
        <div class="code">{{ $code }}</div>
        <div class="expiry">Ce code expire dans <strong>15 minutes</strong>.</div>
      </div>
      <p class="warning">
        Si vous n'avez pas demandé cette réinitialisation, ignorez cet e-mail. Votre mot de passe restera inchangé.
      </p>
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Tech Store &mdash; Tous droits réservés
    </div>
  </div>
</body>
</html>
