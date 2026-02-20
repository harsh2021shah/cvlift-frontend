import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const FinalCTA: React.FC = () => {
    const revealRef = useScrollReveal();

    return (
        <section ref={revealRef} className="py-20">
            <div className="container mx-auto px-6">
                <div className="bg-gradient-to-br from-primary via-accent to-primary p-12 lg:p-20 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                    <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                        <h2 className="text-4xl lg:text-6xl font-bold leading-tight">Ready to land your next interview?</h2>
                        <p className="text-xl text-white/90">
                            Use AI to customize your resume and cover letter for every job in minutes.
                        </p>

                        <div className="space-y-4">
                            <a href="https://app.cvlift.me/auth" className="inline-block px-10 py-5 bg-white text-primary rounded-full text-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-xl">
                                Get Started Free
                            </a>
                            <p className="text-white/80 text-sm">
                                10 free resume generations • No credit card required
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
