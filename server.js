import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ✅ Serve static frontend files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// ✅ Gmail transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "meshackchristian0@gmail.com", // your sender email
    pass: "xtdjsaunmtwrkjbd", // Gmail app password
  },
});

// ✅ Contact Form Endpoint
app.post("/api/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: "meshackchristian0@gmail.com",
    subject: `New Message from ${name}: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact message sent successfully!");
    res.status(200).send("Message sent successfully!");
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).send("Error sending contact message.");
  }
});

// ✅ Donation Form Endpoint
app.post("/api/donate", async (req, res) => {
  const { donorName, amount, accountDetails } = req.body;

  const mailOptions = {
    from: "meshackchristian0@gmail.com",
    to: "meshackchristian0@gmail.com",
    subject: `New Donation from ${donorName}`,
    text: `
A new donation has been received.

Donor Name: ${donorName}
Donation Amount: ${amount}
Account Details: ${accountDetails}

Thank you for supporting the mission!
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Donation email sent successfully!");
    res.status(200).send("Donation recorded successfully!");
  } catch (error) {
    console.error("Error sending donation email:", error);
    res.status(500).send("Error sending donation email.");
  }
});

// ✅ Start the server
const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));