const nodemailer = require("nodemailer");

const email = async (
  email,
  linkReset
) => {
  try {
    // Configuração do transporte de e-mail usando o serviço SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_PLATFORM,
        pass: process.env.EMAIL_PLATFORM_PASSWORD,
      },
    });

    // send mail with defined transport object
    const mailOptions = await transporter.sendMail({
      from: `Phericcontas <${process.env.EMAIL_PLATFORM}>`, // sender address
      to: email, // list of receivers
      subject: 'Recuperação de Senha',
      text: `Olá! Você solicitou a recuperação de senha. Clique no link a seguir para criar uma nova senha: ${linkReset}`,
    });

    // Envia o e-mail
    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail enviado:", info.response);
    return true;
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    return false;
  }
};

module.exports = email;
