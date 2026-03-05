import React, { useState } from 'react';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
    amount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, planName, amount }) => {
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<{ checkoutUrl: string; qrContent: string; orderId: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        tradingViewUsername: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/crypto/create-binance-pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amount.toString(),
                    planName,
                    customer: formData,
                }),
            });
            const data = await response.json();
            if (data.checkoutUrl) {
                setPaymentData({
                    checkoutUrl: data.checkoutUrl,
                    qrContent: data.qrContent || data.checkoutUrl,
                    orderId: data.orderId
                });
            } else {
                alert('Failed to initiate Binance Pay. Please try again.');
            }
        } catch (err) {
            console.error(err);
            alert('Error initiating payment.');
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

                {!paymentData ? (
                    <>
                        <h3 className="text-2xl font-bold mb-2">Checkout Detail</h3>
                        <p className="text-gray-400 text-sm mb-6">You are purchasing <strong>{planName}</strong> for ${amount} USDT</p>

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
                                    placeholder="+1..."
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
                                {loading ? <Loader2 className="animate-spin" size={24} /> : `Pay $${amount} USDT Now`}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <div className="mb-6 inline-block bg-[#00FF66]/5 p-2 rounded-2xl border border-[#00FF66]/20 shadow-[0_0_25px_rgba(0,255,102,0.1)]">
                            <span className="text-xs font-bold text-[#00FF66] tracking-widest uppercase px-3 py-1">Binance Pay Secure</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Complete Payment</h3>
                        <p className="text-gray-400 text-sm mb-8 px-4">Scan this QR code with your Binance App or click the link below to pay <strong>${amount} USDT</strong></p>

                        <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                            <QRCodeSVG value={paymentData.qrContent} size={200} />
                        </div>

                        <div className="space-y-4">
                            <a
                                href={paymentData.checkoutUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 rounded-xl bg-[#00FF66] text-black font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-[#00CC52] transition-colors"
                            >
                                Open Binance Pay <ExternalLink size={18} />
                            </a>
                            <p className="text-xs text-gray-500 italic">Once paid, your access will be granted within 12 hours.</p>
                            <button
                                onClick={() => setPaymentData(null)}
                                className="text-gray-400 hover:text-white text-sm underline underline-offset-4"
                            >
                                Use a different name/email
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
