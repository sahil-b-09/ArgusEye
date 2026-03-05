import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] text-white font-sans py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-[#00FF66] hover:text-[#00CC52] transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Refund Policy</h1>

                <div className="bg-[#111111] border border-red-500/20 rounded-2xl p-6 md:p-8 mb-10 flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 shrink-0 mt-1" />
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Strict No-Refund Policy</h2>
                        <p className="text-gray-300">Due to the digital nature of ArgusEye indicators and the immediate, irrevocable access provided to our proprietary scripts upon purchase, <strong>all sales are final. There are absolutely no refunds after a purchase is made.</strong></p>
                    </div>
                </div>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Subscription Commitment</h2>
                        <p>By purchasing a subscription (Monthly or Yearly) to ArgusEye, you are committing to the full duration of that billing cycle. The subscription must be completed for that specific month or year. We do not offer prorated refunds for early cancellations or unused time.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Cancellation</h2>
                        <p>You may cancel your subscription at any time to prevent future automatic renewals. If you cancel, you will continue to have access to the indicators until the end of your current paid billing period (month or year). Once the period ends, your access will be automatically revoked via TradingView.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Acknowledgment</h2>
                        <p>By proceeding with a purchase via our payment gateway (Razorpay), you explicitly acknowledge and agree to this no-refund policy. You understand that you are purchasing digital access that cannot be "returned."</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Disputed Charges</h2>
                        <p>Any fraudulent chargebacks or disputes filed with your bank or credit card company will result in immediate and permanent termination of your access to ArgusEye indicators, and may be contested using the data provided at checkout along with TradingView access logs.</p>
                    </section>

                    <p className="text-sm text-gray-500 pt-8 border-t border-white/10">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
