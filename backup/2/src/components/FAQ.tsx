import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const FAQ: React.FC = () => {
    const revealRef = useScrollReveal();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            q: 'How does CVLift work?',
            a: 'CVLift parses job descriptions using AI to identify key skills and requirements. It then intelligently tailors your existing resume content to match those requirements, ensuring your application stands out to both recruiters and ATS systems.'
        },
        {
            q: 'What is the 3-level customization?',
            a: 'We offer High (extensive rewriting for maximum impact), Medium (balanced tailoring), and Low (light adjustments) levels. High is great for freshers or career changers, while Low is perfect for senior pros with established experience.'
        },
        {
            q: 'Which job platforms does CVLift support?',
            a: 'We support all major job boards including LinkedIn, Indeed, Glassdoor, and any public job posting URL. Simply paste the link, and we take care of the rest.'
        },
        {
            q: 'What is ATS optimization?',
            a: 'ATS (Applicant Tracking System) optimization ensures your resume is formatted and keyword-structured in a way that allows automated systems to correctly read and rank your profile, significantly increasing your chances of reaching a human recruiter.'
        },
        {
            q: 'Can I edit the generated resume?',
            a: 'Yes! Before downloading, you can review and edit every section of the generated resume and cover letter directly in our editor to add your personal touch.'
        },
        {
            q: 'What formats can I download?',
            a: 'All plans allow you to export your documents in professional PDF, DOCX (Microsoft Word), and TXT formats.'
        },
        {
            q: 'How many templates are available?',
            a: 'We currently offer 10 professional, ATS-optimized templates ranging from classic and minimal to modern and creative designs.'
        },
        {
            q: 'Can I cancel my subscription anytime?',
            a: 'Absolutely. You can manage and cancel your subscription at any time through your dashboard with a single click. No hidden fees or long-term commitments.'
        },
        {
            q: 'What happens after I use my free credits?',
            a: 'Once your free 10 credits are used, you can either subscribe to a monthly plan or purchase a one-time pay-as-you-go credit pack starting at just $3.'
        },
        {
            q: 'Is my data secure?',
            a: 'Security is our priority. Your data is encrypted in transit and at rest. We never share your personal information with third parties, and your data is used only to generate your resumes.'
        }
    ];

    return (
        <section id="faq" ref={revealRef} className="py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="glass rounded-2xl overflow-hidden transition-all duration-300">
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <span className="font-bold text-lg">{faq.q}</span>
                                {openIndex === i ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            {openIndex === i && (
                                <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
