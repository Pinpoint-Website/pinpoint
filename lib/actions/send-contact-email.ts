"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  to: string;
  toName: string;
  fromName: string;
  fromEmail: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: "Email service not configured" };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Pinpoint <delivered@the-pinpoint.com>", // Need to replace with actual domain later
      to: [data.to],
      subject: `New message from ${data.fromName} via Pinpoint`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Message from Pinpoint
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${data.fromName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.fromEmail}</p>
            <p style="margin: 0;"><strong>Sent via:</strong> Pinpoint</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #555; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; font-size: 14px; color: #6c757d;">
            <p style="margin: 0;">This message was sent through Pinpoint. You can reply directly to this email to respond to ${data.fromName}.</p>
          </div>
        </div>
      `,
      replyTo: data.fromEmail, // This allows the recipient to reply directly to the sender
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: "Failed to send email" };
    }

    return { success: true, messageId: emailData?.id };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
