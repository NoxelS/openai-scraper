import { createTransport } from 'nodemailer';


export async function sendEmail() {
    const transporter = createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: !!process.env.MAIL_SECURE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    const info = await transporter.sendMail({
        from: `"..." <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_TARGET,
        subject: process.env.MAIL_SUBJECT,
        html: `...`
    });

    await transporter.close();
}
