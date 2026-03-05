// test-webhook.js
// Run this script using Node to simulate a successful Razorpay payment hitting your local webhook

const simulateWebhook = async () => {
    const url = 'http://localhost:3000/api/webhooks/razorpay';

    const payload = {
        orderId: 'order_Mxyz123abc456',
        customerName: 'Satoshi Nakamoto',
        customerEmail: 'satoshi@bitcoin.org',
        tradingViewUsername: 'satoshi_trades_99',
        plan: 'Argus Eye 24/7 Subscription'
    };

    console.log('🚀 Sending mock Razorpay webhook to:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'x-razorpay-signature': 'mock_signature_to_be_verified_later'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Webhook Response:', data);
        } else {
            console.error('❌ Webhook Error:', data);
        }
    } catch (err) {
        console.error('🚨 Fetch failed (Is the Next.js standard dev server running on port 3000?):', err.message);
    }
};

simulateWebhook();
