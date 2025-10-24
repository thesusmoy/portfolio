# Personal Portfolio Website

⚠️ **IMPORTANT COPYRIGHT NOTICE**

This project is protected by international copyright law. Unauthorized copying, deployment, or redistribution will result in legal action and penalties. See [LICENSE.md](LICENSE.md) for details.

---

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS, featuring an AI-powered chat interface.

## Features

- 🎨 Modern and Clean Design
- 🤖 AI-Powered Chat Interface
- 📱 Fully Responsive
- 🌙 Dark/Light Mode
- ⚡ Fast Performance
- 🎯 SEO Optimized
- 📊 Project Showcase
- 📝 Skills & Experience Section
- 📫 Contact Form

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Animations:** Framer Motion
- **Icons:** Tabler Icons
- **Code Quality:** ESLint, Prettier
- **Package Manager:** pnpm

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/thesusmoy/portfolio.git
    ```

2. Install dependencies:

    ```bash
    cd portfolio
    pnpm install
    ```

3. Create a `.env.local` file in the root directory and add your environment variables:

    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
    NEXT_PUBLIC_SITE_URL=your-site-url
    ```

4. Run the development server:

    ```bash
    pnpm dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
portfolio/
├── public/          # Static assets
├── src/
│   ├── app/        # App router pages
│   ├── components/ # React components
│   ├── hooks/      # Custom hooks
│   ├── lib/        # Utility functions
│   └── types/      # TypeScript types
└── ...
```

## Configuration

The portfolio can be customized through the `portfolio-config.json` file. Update the following sections:

- Personal Information
- Skills
- Projects
- Experience
- Contact Information

## Deployment

This portfolio can be deployed to any platform that supports Next.js applications. Recommended platforms:

- Vercel
- Netlify
- Railway

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

© 2025 Susmoy. All rights reserved.
Forking for personal study is permitted. Redistribution or public deployment is prohibited without prior written permission. See LICENSE for details.
