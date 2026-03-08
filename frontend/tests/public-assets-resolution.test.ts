import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { publicServices } from '../app/data/public-content';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(currentDir, '..');
const publicRoot = path.join(frontendRoot, 'public');

const sourceFiles = [
  'app/pages/index.vue',
  'app/pages/about.vue',
  'app/pages/contact-us.vue',
  'app/pages/articles.vue',
  'app/pages/articles/[slug].vue',
  'app/pages/our-services.vue',
  'app/pages/our-services/[slug].vue',
  'app/pages/our-works.vue',
  'app/pages/our-works/[slug].vue',
  'app/content/banner-templates.ts',
  'app/composables/useLocalBusinessSchema.ts',
  'app/data/public-content.ts'
].map((file) => path.join(frontendRoot, file));

const localAssetRefRegex = /\/(?:images|articles|works|placeholders)\/[A-Za-z0-9/_\-.]+\.(?:png|jpe?g|webp|avif|svg)/g;
const disallowedRemoteAssetRegex = /https?:\/\/[^'"`)\s]+\/(?:images|articles|works|logos|founders)\/[^'"`)\s]+\.(?:png|jpe?g|webp|avif|svg)/g;

describe('public asset resolution', () => {
  it('ensures all referenced local public assets exist', () => {
    const missing: string[] = [];

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const refs = content.match(localAssetRefRegex) ?? [];

      for (const ref of refs) {
        const absoluteAssetPath = path.join(publicRoot, ref.replace(/^\//, ''));
        if (!fs.existsSync(absoluteAssetPath)) {
          missing.push(`${path.relative(frontendRoot, filePath)} -> ${ref}`);
        }
      }
    }

    for (const service of publicServices) {
      const servicePath = `/images/service-${service.slug.replace(/-/g, '')}.jpg`;
      const absoluteServicePath = path.join(publicRoot, servicePath.replace(/^\//, ''));
      if (!fs.existsSync(absoluteServicePath)) {
        missing.push(`derived-service-image -> ${servicePath}`);
      }
    }

    expect(missing).toEqual([]);
  });

  it('rejects remote public-asset URLs in tracked public source files', () => {
    const offenders: string[] = [];

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const found = content.match(disallowedRemoteAssetRegex) ?? [];
      if (found.length > 0) {
        offenders.push(`${path.relative(frontendRoot, filePath)} -> ${found.join(', ')}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('ensures governance inventory statuses map to real files when required', () => {
    const inventoryPath = path.join(publicRoot, 'asset-governance', 'asset-inventory.json');
    const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8')) as {
      assets: Array<{ path: string; status: string }>;
    };

    const mustExistStatuses = new Set(['stock-final', 'first-party-placeholder', 'first-party-final']);
    const missing: string[] = [];

    for (const asset of inventory.assets) {
      if (!mustExistStatuses.has(asset.status)) {
        continue;
      }

      const absoluteAssetPath = path.join(publicRoot, asset.path.replace(/^\//, ''));
      if (!fs.existsSync(absoluteAssetPath)) {
        missing.push(`${asset.status} -> ${asset.path}`);
      }
    }

    expect(missing).toEqual([]);
  });
});
