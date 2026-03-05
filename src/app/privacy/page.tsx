import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0C0A09] text-white font-sans py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-[#00FF66] hover:text-[#00CC52] transition-colors mb-12">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <p className="text-lg">At ArgusEye, your privacy is our priority. This Privacy Policy outlines how we handle your information.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Data Collection and Storage</h2>
                        <p><strong>We do not store your personal trading data.</strong> The core functionality of ArgusEye involves granting access to our proprietary indicators via your TradingView username. We collect the absolute minimum information required to process your payment and deliver access:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                            <li>Name and Email Address (for account management and communication)</li>
                            <li>TradingView Username (exclusively to grant indicator access)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Payment Information</h2>
                        <p>All payment transactions are securely processed through our payment gateway, <strong>Razorpay</strong>. We do not collect, capture, or store your credit card information, bank details, or UPI IDs on our servers. All sensitive financial data is handled directly by Razorpay in compliance with industry security standards.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Use of Information</h2>
                        <p>The minimal information we do collect is used solely for the following purposes:</p>
                        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-400">
                            <li>To provide and maintain the Service (e.g., automating TradingView access)</li>
                            <li>To notify you about changes to our Service or scripts</li>
                            <li>To provide customer support</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Data Sharing</h2>
                        <p>We do not sell, trade, or rent your personal identification information to others. We share information with Razorpay strictly for the purpose of processing your subscription payments.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Security</h2>
                        <p>We adopt appropriate data collection, storage, and processing practices to protect against unauthorized access or disclosure of your personal information. However, no method of transmission over the internet is 100% secure.</p>
                    </section>

                    <p className="text-sm text-gray-500 pt-8 border-t border-white/10">Last updated: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}
