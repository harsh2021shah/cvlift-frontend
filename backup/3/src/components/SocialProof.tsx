import React from 'react';
import { Quote } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SocialProof: React.FC = () => {
    const revealRef = useScrollReveal();

    const testimonials = [
        {
            name: 'Sarah J.',
            role: 'Software Engineer',
            content: 'CVLift helped me tailor my resume for 5 different roles in 20 minutes. I landed 3 interviews the following week!'
        },
        {
            name: 'Michael R.',
            role: 'Marketing Manager',
            content: 'The 3-level customization is a game changer. I could keep my tone while the AI handled the heavy tailoring.'
        }
    ];

    return (
        <section ref={revealRef} className="py-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/3">
                        <h2 className="text-4xl font-bold mb-6">Trusted by job seekers everywhere</h2>
                        <div className="space-y-2">
                            <p className="text-5xl font-bold text-primary">1,000+</p>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Resumes generated this week</p>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="glass p-8 rounded-3xl relative">
                                <Quote className="absolute top-6 right-8 text-primary/20" size={48} />
                                <p className="text-lg italic mb-6 relative z-10">{t.content}</p>
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
