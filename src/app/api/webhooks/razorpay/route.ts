import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // In a real app, verify the Razorpay signature here
        // const signature = headers().get('x-razorpay-signature');

        // For now, we simulate receiving the successful payment payload
        const { orderId, customerName, customerEmail, tradingViewUsername, plan } = body;

        if (!tradingViewUsername) {
            return NextResponse.json({ error: 'Missing TradingView Username' }, { status: 400 });
        }

        // Set up Nodemailer transport using Gmail (or any other SMTP service)
        // Note: You will need to set EMAIL_USER and EMAIL_PASSWORD in your .env.local
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com', // Replace with real env vars
                pass: process.env.EMAIL_PASSWORD || 'your-app-password',
            },
        });

        // Create the email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'your-email@gmail.com', // Admin email
            subject: `🚨 URGENT: New ArgusEye Subscription - Action Required`,
            html: `
        <h2>New Subscription Received!</h2>
        <p>A customer has successfully completed checkout. <strong>You need to grant them access to the indicator on TradingView within 12 hours.</strong></p>
        
        <h3>Customer Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${customerName}</li>
          <li><strong>Email:</strong> ${customerEmail}</li>
          <li><strong>Plan:</strong> ${plan}</li>
          <li><strong>Order ID:</strong> ${orderId}</li>
        </ul>

        <hr/>
        
        <h3 style="color: #00CC52;">🎯 ACTION REQUIRED: TRADINGVIEW USERNAME</h3>
        <p style="font-size: 18px; font-weight: bold; background-color: #f4f4f4; padding: 10px; border-left: 4px solid #00CC52;">
          ${tradingViewUsername}
        </p>

        <p>Please log in to TradingView, navigate to your script settings, and add this username to the invite-only access list.</p>
      `,
        };

        // Send the email
        // Uncomment this when you have actual EMAIL_USER and EMAIL_PASSWORD setup. For now we will mock it.
        // await transporter.sendMail(mailOptions);

        console.log("==========================================");
        console.log("📧 MOCK EMAIL SENT TO ADMIN:");
        console.log("To:", mailOptions.to);
        console.log("Subject:", mailOptions.subject);
        console.log("TradingView Username to add:", tradingViewUsername);
        console.log("==========================================");

        return NextResponse.json({ success: true, message: 'Admin notified successfully' }, { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
