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

        // Set up Nodemailer transport using Hostinger SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER, // e.g. support@arguseye247.com
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // 1. Send Welcome Email to the Customer
        const customerMailOptions = {
            from: `"ArgusEye Support" <${process.env.EMAIL_USER}>`,
            to: customerEmail,
            subject: `Welcome to ArgusEye! Your Access is Being Processed`,
            html: `
        <h2>Welcome to ArgusEye, ${customerName}!</h2>
        <p>Thank you for subscribing to the <strong>${plan}</strong> plan.</p>
        <p>We are currently processing your order and will grant access to your TradingView username (<strong>${tradingViewUsername}</strong>) within the next <strong>12 hours</strong>.</p>
        <p>Once authorized, you will receive a notification directly on TradingView, and the indicators will appear under your "Invite-only scripts" tab.</p>
        <br/>
        <p>If you have any questions, feel free to reply directly to this email.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The ArgusEye Team</strong></p>
      `,
        };

        // 2. Send Urgent Notification to the Admin
        const adminMailOptions = {
            from: `"ArgusEye System" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email
            subject: `🚨 Action Required: New Subscription (${tradingViewUsername})`,
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

        // Send both emails (uncommented for production)
        await transporter.sendMail(customerMailOptions);
        await transporter.sendMail(adminMailOptions);

        console.log("==========================================");
        console.log("📧 EMAILS DELIVERED SUCCESSFULLY");
        console.log("Customer welcome email sent to:", customerEmail);
        console.log("Admin notification sent to:", adminMailOptions.to);
        console.log("==========================================");
        console.log("==========================================");

        return NextResponse.json({ success: true, message: 'Admin notified successfully' }, { status: 200 });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
