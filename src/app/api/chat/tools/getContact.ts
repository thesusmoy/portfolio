import { tool } from 'ai';
import { z } from 'zod';
import { getConfig } from '@/lib/config-loader';

export const getContact = tool({
    description: 'This tool provides professional contact information and social media profiles.',
    parameters: z.object({}),
    execute: async () => {
        const config = getConfig();

        return {
            contact: {
                email: config.personal.email,
                location: config.personal.location,
                availability: config.internship.availability,
            },
            socialProfiles: {
                github: config.social.github,
                linkedin: config.social.linkedin,
                twitter: config.social.twitter,
                facebook: config.social.facebook,
                leetcode: config.social.leetcode,
            },
            message:
                "I'd be happy to provide you with my professional contact information and social media profiles. You can reach me via email at ",
        };
    },
});
