import { copyFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = 'dist';
const appShell = join(outputDirectory, 'index.html');
const staticRoutes = ['privacy-policy', 'support'];

await copyFile(appShell, join(outputDirectory, '404.html'));

await Promise.all(
  staticRoutes.map(async (route) => {
    const routeDirectory = join(outputDirectory, route);
    await mkdir(routeDirectory, { recursive: true });
    await copyFile(appShell, join(routeDirectory, 'index.html'));
  }),
);
