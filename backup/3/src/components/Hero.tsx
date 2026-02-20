import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const Hero: React.FC = () => {
    const revealRef = useScrollReveal();

    return (
        <section ref={revealRef} className="pt-32 pb-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            AI-Powered Resumes & Cover Letters
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                            Stop rewriting your resume for every job. <br />
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Let AI do it in seconds.
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg">
                            Paste any job link and get a personalized, ATS-optimized resume and cover letter tailored to that exact role.
                        </p>

                        <ul className="space-y-3">
                            {[
                                'Works with LinkedIn, Indeed, and any job board URL',
                                'Smart customization levels for freshers to senior pros',
                                'Download in PDF, DOCX, or TXT and apply confidently'
                            ].map((text) => (
                                <li key={text} className="flex items-center gap-3">
                                    <CheckCircle className="text-success" size={20} />
                                    <span className="font-medium">{text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="space-y-2">
                                <a href="https://app.cvlift.me/auth" className="btn-primary text-lg px-8 py-4">
                                    Get Started Free
                                </a>
                                <p className="text-xs text-center text-slate-500">
                                    10 free resume generations • No credit card required
                                </p>
                            </div>
                            <a href="#how-it-works" className="px-8 py-4 rounded-full border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center">
                                See how it works
                            </a>
                        </div>
                    </div>

                    {/* Right Preview Card */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                        <div className="glass rounded-3xl p-8 relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-white/20">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full ml-2"></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3 p-4 bg-white/30 dark:bg-slate-800/30 rounded-xl">
                                        <div className="h-4 bg-primary/30 rounded w-3/4"></div>
                                        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
                                        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-primary/20">
                                        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4"></div>
                                        <div className="h-3 bg-primary/40 rounded w-2/3"></div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-white/20">
                                    <div className="flex justify-between mb-4">
                                        <div className="h-4 bg-slate-400 rounded w-1/3"></div>
                                        <div className="h-4 bg-primary rounded w-1/4"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
                                        <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
