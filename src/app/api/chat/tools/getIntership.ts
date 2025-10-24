import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getInternship = tool({
    description:
        'Provides comprehensive information about internship opportunities, career preferences, and professional availability for recruiters and HR professionals.',
    parameters: z.object({}),
    execute: async () => {
        const config = getConfig();

        return {
            availability: config.internship.availability,
            preferences: {
                roleTypes: config.internship.focusAreas,
                workMode: config.internship.preferredLocation,
                location: config.personal.location,
                startDate: config.internship.startDate,
                duration: config.internship.duration,
            },
            experience: {
                internshipCompleted: config.experience.find((exp) => exp.type === 'Internship')?.company
                    ? `${config.experience.find((exp) => exp.type === 'Internship')?.position} at ${config.experience.find((exp) => exp.type === 'Internship')?.company} (${config.experience.find((exp) => exp.type === 'Internship')?.duration})`
                    : 'No formal internship completed yet',
                freelanceWork:
                    config.experience.find((exp) => exp.type === 'Freelance')?.description || 'Active freelancer',
                projectExperience: 'Led multiple end-to-end projects including IoT systems and ML models',
            },
            skills: {
                technical: [
                    ...config.skills.programming,
                    ...config.skills.ml_ai,
                    ...config.skills.web_development,
                    ...config.skills.databases,
                    ...config.skills.devops_cloud,
                ],
                soft: [
                    'Team Leadership',
                    'Project Management',
                    'Problem Solving',
                    'Communication',
                    'Adaptability',
                    'Innovation',
                ],
            },
            achievements: config.education.achievements || [],
            lookingFor: {
                goals: config.internship.goals,
                workStyle: config.internship.workStyle,
                motivation: config.personality.motivation,
                interests: config.personality.interests,
            },
            contact: {
                email: config.personal.email,
                linkedin: config.social.linkedin,
                github: config.social.github,
                portfolio: '',
            },
            personality: {
                traits: config.personality.traits,
                funFacts: config.personality.funFacts,
                workingStyle: config.personality.workingStyle,
            },
            professionalMessage:
                "I'm excited about the opportunity to contribute my skills and enthusiasm to a dynamic team through an internship position. I am particularly interested in roles that allow me to apply my technical expertise in programming, machine learning, and web development, while also honing my soft skills such as teamwork and communication. My goal is to gain hands-on experience in a professional setting, where I can learn from industry experts and take on meaningful projects that challenge me to grow. I am adaptable and eager to take on new challenges, and I believe that an internship will provide the perfect environment for me to develop both personally and professionally. Please let me know if there are specific areas you'd like me to elaborate on or any questions you have about my background and aspirations.",
        };
    },
});
