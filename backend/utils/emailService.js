import nodemailer from 'nodemailer';

let transporter = null;

// Initialize email transporter
const initializeTransporter = () => {
    if (!transporter && process.env.EMAIL_HOST) {
        transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
};

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        initializeTransporter();

        if (!transporter) {
            console.log('Email service not configured');
            return { success: false, message: 'Email service not configured' };
        }

        const mailOptions = {
            from: `"CollabSpace" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
};

export const sendNotificationEmail = async (user, notification) => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #3b82f6;">CollabSpace Notification</h2>
      <h3>${notification.title}</h3>
      <p>${notification.message}</p>
      <p style="margin-top: 20px;">
        <a href="${process.env.FRONTEND_URL}${notification.actionUrl}" 
           style="background-color: #3b82f6; color: white; padding: 10px 20px; 
                  text-decoration: none; border-radius: 5px; display: inline-block;">
          View Details
        </a>
      </p>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        This is an automated notification from CollabSpace.
      </p>
    </div>
  `;

    return await sendEmail({
        to: user.email,
        subject: notification.title,
        html,
        text: notification.message
    });
};
