const nodemailer = require('nodemailer');

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'smtp-mail.outlook.com', // Serviço de e-mail (exemplo: 'Gmail', 'Outlook')
    port: 587,
    auth: {
        user: '', // Seu e-mail
        pass: '', // Sua senha ou token de aplicativo
    },
});

// Função para enviar o e-mail de redefinição de senha
async function sendResetEmail(email, resetToken) {
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`; // Substitua pelo domínio da sua aplicação

    const mailOptions = {
        from: 'seu-email@outlook.com', // Seu e-mail
        to: email, // E-mail do destinatário
        subject: 'Redefinição de Senha',
        html: `
            <h1>Redefinição de Senha</h1>
            <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
            <a href="${resetLink}" style="color: blue;">Redefinir Senha</a>
            <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de redefinição enviado para ${email}`);
    } catch (error) {
        console.error('Erro ao enviar o e-mail:', error);
        throw new Error('Não foi possível enviar o e-mail de redefinição.');
    }
}

module.exports = sendResetEmail;
