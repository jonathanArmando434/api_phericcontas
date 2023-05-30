const nodemailer = require("nodemailer");

const emailOfCompany = process.env.EMAIL_OF_COMPANY;

const enviarEmail = async (
  nome,
  email,
  assunto,
  mensagem,
  password,
  provider
) => {
  try {
    // Configuração do transporte de e-mail usando o serviço SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: email,
        pass: password,
      },
    });

    // Corpo do e-mail
    const emailBody = `${mensagem}\n\nRemetente: ${nome}`;

    // send mail with defined transport object
    const mailOptions = await transporter.sendMail({
      from: email, // sender address
      to: emailOfCompany, // list of receivers
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

module.exports = enviarEmail;
