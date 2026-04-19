import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

export const server = {
  updateSiteConfig: defineAction({
    accept: 'form',
    input: z.object({
      businessName: z.string().min(1),
      tagline: z.string().optional().default(''),
      phone: z.string().optional().default(''),
      email: z.email(),
      address: z.string().optional().default(''),
      messengerLink: z.url().or(z.literal('')),
      mapsLink: z.url().or(z.literal('')),
    }),
    handler: async (input) => {
      console.log('Updating site config with input:', input);
      const filePath = path.join(DATA_DIR, 'siteConfig.json');
      console.log('Target file path:', filePath);

      if (!fs.existsSync(filePath)) {
        console.error('File does not exist:', filePath);
        throw new Error(`Configuration file not found at ${filePath}`);
      }

      const currentConfig = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const newConfig = {
        ...currentConfig,
        businessName: input.businessName,
        tagline: input.tagline,
        contact: {
          ...currentConfig.contact,
          phone: input.phone,
          email: input.email,
          address: input.address,
          messengerLink: input.messengerLink,
          mapsLink: input.mapsLink,
        },
      };

      console.log('Writing new config to disk...');
      fs.writeFileSync(filePath, JSON.stringify(newConfig, null, 2), 'utf-8');
      console.log('Successfully updated siteConfig.json');
      return { success: true };
    },
  }),

  updateMenu: defineAction({
    accept: 'json',
    input: z.array(
      z.object({
        category: z.string().min(1),
        items: z.array(
          z.object({
            name: z.string().min(1),
            description: z.string(),
            price: z.string().min(1, { message: 'Price is required' }),
          }),
        ),
      }),
    ),
    handler: async (input) => {
      const filePath = path.join(DATA_DIR, 'menu.json');
      fs.writeFileSync(filePath, JSON.stringify(input, null, 2), 'utf-8');
      return { success: true };
    },
  }),

  runBuildCheck: defineAction({
    accept: 'json',
    handler: async () => {
      console.log('Running mock build check...');
      // Mock build check
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const success = Math.random() > 0.1; // 90% success rate for mock
      console.log('Build check result:', success ? 'PASS' : 'FAIL');
      return {
        success,
        message: success
          ? 'Build check passed! Site is ready for deployment.'
          : 'Build check failed. Please check for linting errors.',
        timestamp: new Date().toISOString(),
      };
    },
  }),
};
