import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getProjects = tool({
    description:
        'This tool showcases a comprehensive project portfolio, highlighting technical achievements and real-world impact.',
    parameters: z.object({}),
    execute: async () => {
        const config = getConfig();

        return {
            projects: config.projects.map((project) => ({
                title: project.title,
                type: project.category,
                date: project.date,
                description: project.description,
                techStack: project.techStack,
                status: project.status,
                featured: project.featured,
                links: project.links,
                highlights: project.achievements || project.metrics || [],
            })),
            summary:
                "I'd be delighted to share details about my project portfolio. Over the years, I've had the opportunity to work on a diverse range of projects that showcase my technical skills and problem-solving abilities. Each project reflects my commitment to delivering high-quality solutions that address real-world challenges. Whether it's developing full-stack web applications, implementing machine learning models, or optimizing cloud infrastructure, my projects demonstrate a blend of innovation and practicality. Please let me know if there are specific projects or technologies you'd like to learn more about!",
        };
    },
});
