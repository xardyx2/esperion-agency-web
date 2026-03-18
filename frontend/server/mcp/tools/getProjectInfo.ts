import { z } from 'zod'

export default defineMcpTool({
  name: 'getProjectInfo',
  description: 'Returns project metadata including name, version, and tech stack information for the Esperion project',
  inputSchema: {
    includeTechStack: z.boolean().optional().default(true).describe('Whether to include detailed tech stack information')
  },
  handler: async ({ includeTechStack }) => {
    const projectInfo = {
      name: 'esperion-frontend',
      version: '1.0.0',
      description: 'Esperion Digital Agency - Data-Driven Digital Strategies',
      techStack: includeTechStack
        ? {
            frontend: {
              framework: 'Nuxt 4.4.2',
              language: 'TypeScript',
              styling: 'Tailwind CSS',
              stateManagement: 'Pinia',
              i18n: '@nuxtjs/i18n',
              testing: ['Vitest', 'Playwright']
            },
            backend: {
              language: 'Rust',
              framework: 'Axum',
              database: 'SurrealDB 3.0.4',
              auth: 'JWT + Argon2'
            },
            infrastructure: {
              containerization: 'Docker',
              orchestration: 'Docker Compose, Kubernetes'
            }
          }
        : undefined,
      languages: ['Indonesian (id)', 'English (en)'],
      defaultLocale: 'id'
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(projectInfo, null, 2)
      }]
    }
  }
})
