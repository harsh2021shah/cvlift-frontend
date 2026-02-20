import React from 'react';
import { Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Pricing: React.FC = () => {
    const revealRef = useScrollReveal();

    const plans = [
        {
            name: 'Free Trial',
            price: '$0',
            description: '10 credits to get started',
            bullets: ['10 credits to get started', 'All templates included', 'ATS optimization', 'PDF, DOCX, TXT export', 'Email support'],
            cta: 'Start Free',
            url: 'https://app.cvlift.me/auth'
        },
        {
            name: 'Basic',
            price: '$9',
            unit: '/ mo',
            description: 'For moderate job seekers',
            bullets: ['150 credits per month', 'All templates included', 'ATS optimization', 'PDF, DOCX, TXT export', 'Email support', 'Save 20% on yearly plans'],
            cta: 'Get Started',
            url: 'https://app.cvlift.me/auth'
        },
        {
            name: 'Premium',
            price: '$24',
            unit: '/ mo',
            popular: true,
            description: 'For power users',
            bullets: ['500 credits per month', 'All templates included', 'ATS optimization', 'All export formats', 'Priority support', 'Save 58% vs pay-as-you-go', 'Save 20% on yearly plans'],
            cta: 'Get Started',
            url: 'https://app.cvlift.me/auth'
        },
        {
            name: 'Pay As You Go',
            price: '$1',
            unit: '/ pack',
            description: 'Flexible option',
            bullets: ['20 credits per $1 spent', 'Minimum $3 purchase', 'No commitment required', 'All templates included', 'ATS optimization', 'All export formats', 'Credits never expire'],
            cta: 'Buy Credits',
            url: 'https://app.cvlift.me/dashboard/plan'
        }
    ];

    return (
        <section id="pricing" ref={revealRef} className="py-20 bg-slate-100 dark:bg-slate-900/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Start free with 10 credits. Upgrade only when you’re ready.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className={`glass p-8 rounded-3xl flex flex-col relative transition-all duration-300 hover:-translate-y-2 ${plan.popular ? 'border-2 border-primary ring-4 ring-primary/10' : ''}`}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.unit && <span className="text-slate-500">{plan.unit}</span>}
                                </div>
                                <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.bullets.map((bullet, j) => (
                                    <li key={j} className="flex gap-3 text-sm">
                                        <Check className="text-success shrink-0" size={18} />
                                        <span className="text-slate-600 dark:text-slate-400">{bullet}</span>
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={plan.url}
                                className={`w-full py-3 rounded-full text-center font-bold transition-all ${plan.popular
                                        ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {plan.cta}
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8 text-center pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div>
                        <h4 className="font-bold mb-2">Need more?</h4>
                        <p className="text-sm text-slate-500">Custom enterprise plans available</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Secure Payment</h4>
                        <p className="text-sm text-slate-500">SSL encrypted checkout via Stripe</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">24/7 Support</h4>
                        <p className="text-sm text-slate-500">Email and priority chat support</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
