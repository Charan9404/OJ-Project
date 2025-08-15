import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER, // usually 'apikey'
        pass: process.env.SMTP_PASS  // your Brevo SMTP key
    }
});

// ✅ Verify transporter
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Failed:", error);
    } else {
        console.log("SMTP Server is ready to take messages");
    }
});

export default transporter;
