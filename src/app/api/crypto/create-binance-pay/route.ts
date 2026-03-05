import { NextResponse } from 'next/server';
import crypto from 'crypto';

const API_KEY = process.env.BINANCE_PAY_API_KEY!;
const API_SECRET = process.env.BINANCE_PAY_API_SECRET!;

// Helper to sign the request (Binance uses HMAC-SHA256)
function sign(payload: string) {
    return crypto.createHmac('sha256', API_SECRET).update(payload).digest('hex');
}

export async function POST(req: Request) {
    try {
        const { amount, planName, customer } = await req.json();

        const orderId = `argus_${Date.now()}`;
        const body = {
            env: {
                terminalType: "WEB"
            },
            merchantTradeNo: orderId,
            orderAmount: amount,
            currency: "USDT",
            goods: [
                {
                    goodsType: "02",
                    goodsCategory: "IT_SERVICE",
                    referenceGoodsId: planName.replace(/\s+/g, '_').toLowerCase(),
                    goodsName: `ArgusEye ${planName}`,
                    goodsDetail: `Purchase of ${planName} plan`
                }
            ],
            buyer: {
                buyerEmail: customer.email
            },
            returnUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?orderId=${orderId}`,
            cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`
        };

        const timestamp = Date.now().toString();
        const nonce = crypto.randomBytes(32).toString('hex');
        const payload = timestamp + "\n" + nonce + "\n" + JSON.stringify(body) + "\n";
        const signature = sign(payload).toUpperCase();

        // Note: Using Binance Pay v3 API endpoint for create order
        const response = await fetch('https://bpay.binanceapi.com/binancepay/openapi/v2/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'BinancePay-Timestamp': timestamp,
                'BinancePay-Nonce': nonce,
                'BinancePay-Certificate-SN': API_KEY, // Use API_KEY as Certificate SN for now if not provided
                'BinancePay-Signature': signature,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (data.status !== 'SUCCESS') {
            console.error('Binance Pay Error:', data);
            return NextResponse.json({ error: data.errorMessage || 'Failed to create Binance Pay order' }, { status: 500 });
        }

        return NextResponse.json({
            orderId,
            checkoutUrl: data.data.checkoutUrl,
            qrContent: data.data.qrContent
        });
    } catch (error: any) {
        console.error('Error creating Binance Pay order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
