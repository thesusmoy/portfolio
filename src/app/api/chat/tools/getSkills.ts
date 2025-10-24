import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getSkills = tool({
    description:
        'This tool provides a comprehensive overview of technical skills, expertise, and professional qualifications.',
    parameters: z.object({}),
    execute: async () => {
        const config = getConfig();

        return {
            technicalSkills: {
                programming: config.skills.programming,
                machineLearning: config.skills.ml_ai,
                webDevelopment: config.skills.web_development,
                databases: config.skills.databases,
                devOpsCloud: config.skills.devops_cloud,
            },
            education: {
                degree: config.education.current.degree,
                institution: config.education.current.institution,
                cgpa: config.education.current.cgpa,
                duration: config.education.current.duration,
            },
            achievements: config.education.achievements || [],
            experience: config.experience.map((exp) => ({
                position: exp.position,
                company: exp.company,
                duration: exp.duration,
                type: exp.type,
                technologies: exp.technologies,
                description: exp.description,
            })),
            message:
                " I'd be happy to provide you with a detailed overview of my technical skills and professional qualifications. My expertise spans various programming languages, web development frameworks, machine learning techniques, database management systems, and cloud computing platforms. Additionally, my educational background and hands-on experience in the industry have equipped me with a solid foundation to tackle complex challenges. Please let me know if there are specific skills or areas you'd like me to elaborate on!",
        };
    },
});
