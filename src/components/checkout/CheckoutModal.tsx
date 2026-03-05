import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    amount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName, amount }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        tradingViewUsername: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Load Razorpay Script
        const res = await loadRazorpayScript();
        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 2. Create Order on Backend
            const orderResponse = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, receipt: `receipt_${Date.now()}` }),
            });

            const orderData = await orderResponse.json();
            if (!orderData.order) throw new Error(orderData.error || 'Failed to create order');

            // 3. Initialize Razorpay Checkout
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'ArgusEye',
                description: `Payment for ${planName}`,
                order_id: orderData.order.id,
                handler: async function (response: any) {
                    // 4. Verify Payment Signature
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const verifyResponse = await fetch('/api/razorpay/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(verifyData),
                    });

                    const verifyResult = await verifyResponse.json();

                    if (verifyResult.isOk) {
                        // 5. Trigger Webhook/Email Fulfillment Logic
                        await fetch('/api/webhooks/razorpay', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                customerName: formData.name,
                                customerEmail: formData.email,
                                tradingViewUsername: formData.tradingViewUsername,
                                plan: planName
                            }),
                        });

                        alert('Payment Successful! You will receive access within 12 hours.');
                        onClose();
                    } else {
                        alert('Payment Verification Failed!');
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#00FF66',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Payment initiation failed.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-md p-6 md:p-8 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="text-2xl font-bold mb-2">Checkout Detail</h3>
                <p className="text-gray-400 text-sm mb-6">You are purchasing the <strong>{planName}</strong> for ₹{amount}</p>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            required type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF66]/50 transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input
                            required type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF66]/50 transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                        <input
                            required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            className="w-full bg-[#090909] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF66]/50 transition-colors"
                            placeholder="+91..."
                        />
                    </div>
                    <div className="pt-2">
                        <label className="block text-xs font-semibold text-[#00FF66] uppercase tracking-wider mb-2 flex items-center gap-2">
                            TradingView Username <span className="text-[10px] bg-[#00FF66]/10 px-2 py-0.5 rounded text-[#00FF66]">Required for access</span>
                        </label>
                        <input
                            required type="text" name="tradingViewUsername" value={formData.tradingViewUsername} onChange={handleChange}
                            className="w-full bg-black border border-[#00FF66]/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00FF66] transition-colors shadow-[inset_0_0_10px_rgba(0,255,102,0.05)]"
                            placeholder="e.g. Satoshi_99"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 py-4 rounded-xl bg-[#00FF66] text-black font-bold tracking-wide shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] transition-all flex justify-center items-center disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : `Pay ₹${amount} Now`}
                    </button>
                </form>
            </div>
        </div>
    );
};
