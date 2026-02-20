import { useEffect, useRef } from 'react';

export const useScrollReveal = (threshold = 0.1) => {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('opacity-0', 'translate-y-4');
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            ref.current.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-4');
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return ref;
};
