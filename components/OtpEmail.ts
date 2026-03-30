import nodemailer from 'nodemailer';

export async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'SendGrid', // Replace with your email provider
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
    },
  });

    // set these env vars (optional fallbacks provided)
    const COMPANY_NAME = process.env.COMPANY_NAME || "Alif Ujala";
    const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@alifujala.ai";



    await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${process.env.SENDGRID_FROM_EMAIL}>`,
    to: email,
    replyTo: SUPPORT_EMAIL,
    subject: `Your ${COMPANY_NAME} verification code`,
    // Plain-text version (important for deliverability)
    text: `Hello,

    Your ${COMPANY_NAME} verification code is: ${otp}

    This code expires in 15 minutes.

    If you did not request this code, you can safely ignore this email or contact us at ${SUPPORT_EMAIL} for help.

    Thanks,
    ${COMPANY_NAME} Team
    ${COMPANY_NAME} • ${SUPPORT_EMAIL}`,
    // HTML version (multipart/alternative)
    html: `
    <!doctype html>
    <html>
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        </head>
        <body style="font-family: Arial, sans-serif; color:#1f2937; line-height:1.5; margin:0; padding:20px;">
        <div style="max-width:600px; margin:0 auto;">
            <h2 style="margin:0 0 12px 0; font-size:20px;">${COMPANY_NAME} — Verification Code</h2>
            <p style="margin:0 0 18px 0;">Hello,</p>

            <p style="font-size:20px; letter-spacing:1px; font-weight:700; margin:0 0 18px 0;">
            ${otp}
            </p>

            <p style="margin:0 0 8px 0;">This code expires in <strong>15 minutes</strong>.</p>

            <p style="margin:18px 0 0 0; font-size:13px; color:#6b7280;">
            If you did not request this code, you can ignore this email or contact us:
            <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.
            </p>

            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;" />
            <p style="margin:0; font-size:12px; color:#9ca3af;">
            ${COMPANY_NAME} • ${SUPPORT_EMAIL}
            </p>
        </div>
        </body>
    </html>
    `,
    // small custom headers useful for identifying transactional mail
    headers: {
        "X-Entity-Ref-ID": "signup-otp",
        "X-Mailer-Type": "transactional"
    }
    });

}