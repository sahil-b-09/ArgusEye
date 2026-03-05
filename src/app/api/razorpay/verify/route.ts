import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;

        if (!secret) {
            return NextResponse.json(
                { error: 'Razorpay secret key not found' },
                { status: 500 }
            );
        }

        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Payment is successful and verified
            return NextResponse.json(
                { message: 'Payment verified successfully', isOk: true },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: 'Invalid signature', isOk: false },
                { status: 400 }
            );
        }
    } catch (error: any) {
        console.error('Signature verification failed:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
