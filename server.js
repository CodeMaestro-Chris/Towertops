import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
  origin: "*",
  methods: ["POST", "GET"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

/* =============================
   CONTACT FORM
============================= */
app.post("/api/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await resend.emails.send({
      from: "Towertops <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: `New Contact Message: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    res.status(500).json({ success: false });
  }
});

/* =============================
   DONATION FORM
============================= */
app.post("/api/donate", async (req, res) => {
  const { donorName, amount, accountDetails } = req.body;

  try {
    await resend.emails.send({
      from: "Towertops Donations <onboarding@resend.dev>",
      to: process.env.EMAIL_TO,
      subject: "New Donation Notification",
      html: `
        <h2>New Donation Received</h2>
        <p><strong>Donor Name:</strong> ${donorName}</p>
        <p><strong>Amount:</strong> ₦${amount}</p>
        <p><strong>Account Details:</strong> ${accountDetails}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Donation email error:", error);
    res.status(500).json({ success: false });
  }
});

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
