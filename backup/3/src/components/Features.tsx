import React from 'react';
import { Cpu, Target, FileText, Share2 } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Features: React.FC = () => {
    const revealRef = useScrollReveal();

    const features = [
        {
            icon: <Cpu className="text-white" />,
            title: 'Smart Customization',
            description: 'AI tailors your resume to your experience level—whether you’re a fresh graduate or a senior professional.',
            gradient: 'from-blue-500 to-primary'
        },
        {
            icon: <Target className="text-white" />,
            title: 'Job-Perfect Matching',
            description: 'Every resume is aligned with the specific role, including keywords, skills, and tone that match the job description.',
            gradient: 'from-accent to-pink-500'
        },
        {
            icon: <FileText className="text-white" />,
            title: 'ATS-Optimized Templates',
            description: '10 professional templates designed to pass Applicant Tracking Systems and stand out to recruiters.',
            gradient: 'from-violet-500 to-primary'
        },
        {
            icon: <Share2 className="text-white" />,
            title: 'Flexible Export Formats',
            description: 'Export your resume and cover letter as PDF, DOCX, or TXT for any job portal or application system.',
            gradient: 'from-success to-emerald-500'
        }
    ];

    return (
        <section id="features" ref={revealRef} className="py-20">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-4">Why job seekers choose CVLift</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400">AI does the heavy lifting so you can focus on landing the interview.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
