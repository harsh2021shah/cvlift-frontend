import React from 'react';
import { Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-white">CVLift</h3>
                        <p className="text-sm leading-relaxed">
                            AI-powered resumes and cover letters designed to help you land your dream job faster.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://twitter.com/cvlift" className="hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="https://linkedin.com/company/cvlift" className="hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Product</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#features" className="hover:text-white">Features</a></li>
                            <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                            <li><a href="/help" className="hover:text-white">Help Center</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Legal</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="/terms" className="hover:text-white">Terms & Conditions</a></li>
                            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="/refunds" className="hover:text-white">Cancellation & Refunds</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail size={16} />
                                <a href="mailto:support@cvlift.me" className="hover:text-white">support@cvlift.me</a>
                            </li>
                            <li><a href="/help" className="hover:text-white">Help Center</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:row justify-between items-center gap-4 text-xs">
                    <p>© 2026 CVLift. All rights reserved.</p>
                    <p>Built with Vite & React</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
