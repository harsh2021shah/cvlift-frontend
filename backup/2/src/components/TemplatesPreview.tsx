import React from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const TemplatesPreview: React.FC = () => {
    const revealRef = useScrollReveal();

    const templates = [
        { name: 'Modern', color: 'bg-blue-400' },
        { name: 'Professional', color: 'bg-slate-400' },
        { name: 'Creative', color: 'bg-purple-400' },
        { name: 'Minimal', color: 'bg-emerald-400' },
    ];

    return (
        <section ref={revealRef} className="py-20 bg-slate-50 dark:bg-slate-900/30 overflow-hidden">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-16">Professional templates recruiters actually read</h2>

                <div className="flex gap-8 animate-infinite-scroll overflow-x-auto pb-8 scrollbar-hide">
                    {templates.map((template, index) => (
                        <div key={index} className="flex-shrink-0 w-72 h-96 glass rounded-2xl overflow-hidden group">
                            <div className={`h-2/3 ${template.color} opacity-20 group-hover:opacity-30 transition-opacity flex items-center justify-center`}>
                                <span className="text-2xl font-bold opacity-30">{template.name}</span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                <div className="space-y-2">
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TemplatesPreview;
