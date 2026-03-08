import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(currentDir, '..');

const publicBrandFiles = [
  'app/components/Navigation/MainNav.vue',
  'app/components/Footer/SiteFooter.vue',
  'app/pages/index.vue',
  'app/pages/about.vue',
  'app/pages/contact-us.vue',
  'app/pages/articles.vue',
  'app/pages/articles/[slug].vue',
  'app/pages/our-services.vue',
  'app/pages/our-services/[slug].vue',
  'app/pages/our-works.vue',
  'app/pages/our-works/[slug].vue',
  'app/pages/privacy-policy.vue',
  'app/pages/terms-of-service.vue',
  'app/pages/[...all].vue',
  'app/data/public-content.ts'
].map((file) => path.join(frontendRoot, file));

const bannedPlaceholderPatterns = [
  /Alex Chen/,
  /Sarah Williams/,
  /Michael Tan/,
  /John Doe/,
  /Jane Smith/,
  /Mike Johnson/,
  /Sarah Lee/,
  /Client [1-8]/
];

const bannedVisibleShellPhrases = [
  'Contact Us',
  'About Us',
  'Our Works',
  'Our Services',
  'Latest Articles',
  'Trusted by Leading Companies',
  'Meet Our Founders',
  'Projects Completed',
  'Happy Clients',
  'Read More'
];

describe('public brand compliance', () => {
  it('removes obvious placeholder trust identities from public brand surfaces', () => {
    const offenders: string[] = [];

    for (const filePath of publicBrandFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pattern of bannedPlaceholderPatterns) {
        if (pattern.test(content)) {
          offenders.push(`${path.relative(frontendRoot, filePath)} -> ${pattern}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('keeps core public shell copy aligned with Indonesian-first visible wording', () => {
    const shellFiles = publicBrandFiles.filter((filePath) => !filePath.endsWith('public-content.ts'));
    const offenders: string[] = [];

    for (const filePath of shellFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const templateOnly = content.match(/<template>[\s\S]*<\/template>/)?.[0] ?? content;
      for (const phrase of bannedVisibleShellPhrases) {
        if (templateOnly.includes(phrase)) {
          offenders.push(`${path.relative(frontendRoot, filePath)} -> ${phrase}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
