import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineMcpResource({
  name: 'project-readme',
  title: 'Project README',
  description: 'Returns the README content and project description for the Esperion frontend project',
  uri: 'project://readme',
  mimeType: 'text/markdown',
  handler: async () => {
    try {
      const readmePath = join(process.cwd(), 'README.md')
      const content = await readFile(readmePath, 'utf-8')

      return {
        contents: [{
          uri: 'project://readme',
          mimeType: 'text/markdown',
          text: content
        }]
      }
    } catch (error) {
      const projectInfo = {
        name: 'Esperion Frontend',
        version: '1.0.0',
        description: 'Nuxt 3 application with TypeScript, Tailwind CSS, and Pinia state management for Esperion Digital Agency',
        techStack: [
          'Nuxt 4.4.2',
          'TypeScript',
          'Tailwind CSS',
          'Pinia',
          '@nuxtjs/i18n',
          'Vitest',
          'Playwright'
        ],
        note: 'README.md file not found, returning basic project info'
      }

      return {
        contents: [{
          uri: 'project://readme',
          mimeType: 'application/json',
          text: JSON.stringify(projectInfo, null, 2)
        }]
      }
    }
  }
})
