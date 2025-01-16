import nodemailer from "nodemailer";

export default async function EmailHandler(req, res) {
  if (req.method === "POST") {
    const { name, email, subject, text } = req.body;

    try {
      // Nodemailer setup
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD,
        },
        logger: true, // Enable logs
        debug: true, // Enable debug output
      });

      const mailOptions = {
        from: process.env.SMTP_MAIL, // Sender email
        to: email, // Receiver email
        subject: subject, // Email subject
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${text}`, // Email body
      };

      // Sending email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error.message);
      res
        .status(500)
        .json({ message: "Error sending email", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
