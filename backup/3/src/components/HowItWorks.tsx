import React from 'react';
import { MousePointer2, Settings2, Download } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const HowItWorks: React.FC = () => {
    const revealRef = useScrollReveal();

    const steps = [
        {
            icon: <MousePointer2 size={32} className="text-primary" />,
            title: 'Paste the job link',
            description: 'Drop any job posting URL from LinkedIn, Indeed, or any job board. CVLift extracts the requirements automatically.'
        },
        {
            icon: <Settings2 size={32} className="text-accent" />,
            title: 'Choose your customization level',
            description: 'Pick High, Medium, or Low customization depending on your experience and how much you want to rewrite.'
        },
        {
            icon: <Download size={32} className="text-success" />,
            title: 'Download & apply',
            description: 'Get an ATS-optimized resume and matching cover letter, then download in PDF, DOCX, or TXT and apply in minutes.'
        }
    ];

    return (
        <section id="how-it-works" ref={revealRef} className="py-20 bg-slate-100 dark:bg-slate-900/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-4">From job link to interview in 3 steps</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">Our AI simplifies the application process so you can apply to more jobs with better results.</p>
                </div>

                <div className="relative grid md:grid-cols-3 gap-8">
                    {/* Connector Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-success/30 -translate-y-1/2 z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="glass rounded-3xl p-8 relative z-10 text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                {step.description}
                            </p>
                            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
