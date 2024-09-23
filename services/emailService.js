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
exports.sendPasswordSetupEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: '"BugSender" <no-reply@bugsender.com>',
      to: email,
      subject: 'Configurer votre mot de passe',
      text: `Cliquez sur le lien suivant pour configurer votre mot de passe : http://localhost:3000/setup-password/${token}`,
      html: `<p>Cliquez sur le lien suivant pour configurer votre mot de passe :</p>
             <a href="http://localhost:3000/setup-password/${token}">Configurer le mot de passe</a>`,
    });

    console.log('Email envoyé : %s', info.messageId);
    console.log('URL d\'aperçu : %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
  }
};
