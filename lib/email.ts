import nodemailer from "nodemailer";

// Email sender function using the provided Gmail credentials
export const emailSender = async (
  sendEmail: string,
  subject: string,
  html: any
) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "uzkhuthef@gmail.com",
        pass: "fbvelrxjtwijqrsi", // Note: In production, use environment variables
      },
    });

    const options = {
      from: "uzkhuthef@gmail.com",
      to: sendEmail,
      subject: subject,
      html: html,
    };

    const info = await transport.sendMail(options);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed: " + error.message);
  }
};

// Welcome email template
export const getWelcomeEmailTemplate = (email: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  
      <div style="padding: 20px; border: 1px solid #eee; background-color: #fff;">
        <h2>Welcome to c16</h2>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="https://your-news-website.com" style="background-color: #e53e3e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Our Website</a>
        </div>
   
      </div>

    </div>
  `;
};

// Send welcome email using the provided emailSender function
export const sendWelcomeEmail = async (email: string) => {
  try {
    const htmlTemplate = getWelcomeEmailTemplate(email);
    return await emailSender(email, "Welcome to c16", htmlTemplate);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};
