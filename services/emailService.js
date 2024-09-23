const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',  // Utiliser Ethereal pour tester en local
  port: 587,
  auth: {
    user: 'estelle.durgan51@ethereal.email',  // Remplacer par tes identifiants Ethereal
    pass: 'FpsbtNp21rnbcZWaKn',
  },
});

// Fonction pour envoyer un email de configuration de mot de passe
// Envoi d'un email pour la configuration du mot de passe
exports.sendPasswordSetupEmail = async (email, token) => {
  const link = `http://localhost:5173/setup-password/${token}`;  // Lien sécurisé
  try {
    const info = await transporter.sendMail({
      from: '"BugSender" <no-reply@bugsender.com>',
      to: email,
      subject: 'BUGSENDER - Configurer votre mot de passe',
      text: `Cliquez sur le lien suivant pour configurer votre mot de passe : ${link}`,
      html: `<p>Cliquez sur le lien suivant pour configurer votre mot de passe :</p>
             <a href="${link}">Configurer le mot de passe</a>`,
    });

    console.log('Email envoyé: %s', info.messageId);
    console.log('URL de prévisualisation: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
};
