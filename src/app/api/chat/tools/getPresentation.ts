import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getPresentation = tool({
    description:
        'This tool provides a comprehensive professional introduction and personal background, suitable for interviews and formal presentations.',
    parameters: z.object({}),
    execute: async () => {
        const config = getConfig();

        return {
            presentation: config.personal.bio,
            name: config.personal.name,
            title: config.personal.title,
            age: config.personal.age,
            location: config.personal.location,
            education: config.education.current,
            traits: config.personality.traits,
            interests: config.personality.interests,
            motivation: config.personality.motivation,
            professionalSummary:
                "Thank you for asking! I'm a dedicated software engineer with a passion for developing innovative solutions that make a difference. With a strong foundation in computer science and hands-on experience in various technologies, I've honed my skills in full-stack development, machine learning, and cloud computing. I'm driven by challenges and thrive in collaborative environments where I can contribute to impactful projects. My goal is to continuously learn and grow while delivering high-quality results that exceed expectations.",
        };
    },
});
