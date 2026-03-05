import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_SECRET = process.env.BINANCE_PAY_API_SECRET!;

// Verify Binance signature
function verifySignature(payload: string, timestamp: string, nonce: string, signature: string) {
    const data = timestamp + "\n" + nonce + "\n" + payload + "\n";
    const expected = crypto.createHmac('sha256', API_SECRET).update(data).digest('hex').toUpperCase();
    return expected === signature;
}

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const timestamp = req.headers.get('binancepay-timestamp') || '';
        const nonce = req.headers.get('binancepay-nonce') || '';
        const signature = req.headers.get('binancepay-signature') || '';

        if (!verifySignature(rawBody, timestamp, nonce, signature)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const notification = JSON.parse(rawBody);

        // Binance Pay notification status: "PAID", "CANCELED", "EXPIRED"
        if (notification.bizStatus === 'PAY_SUCCESS') {
            const data = notification.data;
            const orderId = data.merchantTradeNo;
            const amount = data.totalFee;
            const planName = data.productName;

            // Trigger welcome email
            // Reuse the existing email logic by calling your internal email API or function
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-welcome-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    plan: planName.replace('ArgusEye ', ''),
                }),
            });

            console.log(`Payment successful for order ${orderId}`);
        }

        return NextResponse.json({ returnCode: "SUCCESS", returnMsg: null });
    } catch (error: any) {
        console.error('Binance Pay Webhook Error:', error);
        return NextResponse.json({ returnCode: "FAIL", returnMsg: error.message }, { status: 500 });
    }
}
