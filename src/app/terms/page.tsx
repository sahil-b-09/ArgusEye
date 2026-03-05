import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] text-white font-sans py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-[#00FF66] hover:text-[#00CC52] transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms & Conditions</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing or using ArgusEye ("the Service"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p>ArgusEye provides proprietary TradingView indicator scripts designed to assist with technical analysis. These indicators are strictly for educational and informational purposes and do not constitute financial advice.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Subscriptions and Payments</h2>
                        <p>Access to ArgusEye indicators is provided on a subscription basis (monthly or yearly). By subscribing, you authorize us to charge the applicable subscription fees to your chosen payment method via our payment provider (Razorpay). <strong>Subscriptions must be completed for the duration of the purchased term (month or year).</strong> We do not offer prorated refunds for early cancellations.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Refund Policy</h2>
                        <p><strong>Strict No-Refund Policy After Purchase:</strong> Due to the digital nature of our indicators and immediate access to proprietary code logic, all sales are final. There are no refunds after a purchase is made. You must complete the billing cycle for the month or year you have paid for. Please review our full Refund Policy for more details.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property</h2>
                        <p>The indicator scripts, source code, and all related materials are the exclusive property of ArgusEye. You are granted a limited, non-transferable license to use the indicators for personal trading. You may not copy, share, modify, or resell the indicators in any form.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
                        <p>The Service is provided "as is" and "as available" without any warranties of any kind. ArgusEye does not guarantee profit or prevent losses. Trading involves significant risk, and you are solely responsible for your trading decisions.</p>
                    </section>

                    <p className="text-sm text-gray-500 pt-8 border-t border-white/10">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
