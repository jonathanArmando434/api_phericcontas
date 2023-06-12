const nodemailer = require("nodemailer");

const email = async (
  nome,
  email,
  assunto,
  mensagem,
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

    // Corpo do e-mail
    const emailBody = `Remetente: ${nome}\n\nE-mail: ${email}\n\n${mensagem}`;

    // send mail with defined transport object
    const mailOptions = await transporter.sendMail({
      from: `${nome} <${process.env.EMAIL_PLATFORM}>`, // sender address
      to: process.env.EMAIL_OF_COMPANY, // list of receivers
      subject: assunto, // Subject line
      text: emailBody, // plain text body
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
