import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


// Create a transporter using Ethereal test credentials.
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});


// Send an email using async/await
const sendMail = async (to, otp) => {
    try {
        await transporter.sendMail({
            from: `"YouTube Support" <no-reply${process.env.EMAIL}>`,
            to: to,
            subject: "Reset Your Password",
            html: // HTML version of the message
            `<div style="background-color: #f5f5f5; padding: 20px; font-family: 'Roboto',Arial,sans-serif;">
                <div style="max-width: 500px; background-color: #ffffff; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    
                    <div style="padding: 20px 20px 10px 20px;">
                        <div style="display: flex; align-items: center; margin-bottom: 20px;">
                            <span style="font-size: 24px; font-weight: bold; color: #FF2600; letter-spacing: -1px;">
                            YouTube
                            </span>
                        </div>
                        
                        <h1 style="font-size: 22px; font-weight: 400; color: #202124; margin-top: 0;">Verification code</h1>
                        
                        <p style="font-size: 14px; color: #3c4043; line-height: 1.5;">
                            Use this code to finish resetting the password for your YouTube account.
                        </p>

                        <div style="margin: 30px 0; text-align: left;">
                            <div style="display: inline-block; background-color: #f8f9fa; border: 1px solid #dadce0; padding: 10px 24px; border-radius: 4px;">
                            <span style="font-size: 32px; font-weight: 500; color: #202124; letter-spacing: 2px;">
                                ${otp}
                            </span>
                            </div>
                        </div>

                        <p style="font-size: 14px; color: #3c4043; line-height: 1.5;">
                            If you didn't make this request, you can safely ignore this email.
                        </p>
                        
                        <p style="font-size: 14px; color: #3c4043; margin-top: 25px;">
                            Thanks,<br>
                            The YouTube Team
                        </p>
                        </div>

                        <div style="background-color: #f8f9fa; padding: 20px; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #70757a; margin: 0; text-align: center;">
                            You received this email to let you know about important changes to your YouTube Account and services.
                        </p>
                        <p style="font-size: 12px; color: #70757a; margin: 10px 0 0 0; text-align: center;">
                            &copy; 2026 Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA
                        </p>
                    </div>
                </div>
            </div>`, 
        });

    } catch (error) {
        console.log(`SendMail Error: ${error}`);
    }
};

export default sendMail;