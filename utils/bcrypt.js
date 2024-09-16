const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
  const saltRounds = 10; // Nombre de rounds de salage
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  console.log('Hashed password:', hashedPassword);
}
// username: "adminUser",
// email: "admin@example.com",
// password: "ext@dmin2023!"
// $2b$10$/lxuU3kE.bzhmuS2P8pvCundvbnXQFfmJN/iTsTtXlVDnP/fvcdMS

// username: test
// email: test@test.com
// password: test123!
// hashed: $2b$10$pMVl2qz.qjoKstPBnxCPvevfzVfTmmwYetumhCEwuvV/1r6KXYVdm
// hashPassword('test123!'); // Remplacez 'your_secure_password' par votre mot de passe souhaité
