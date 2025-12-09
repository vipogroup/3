import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [
      'tests/ui/**',
      'tests/visual.*',
      'tests/visual/**',
      'tests/auth-middleware.spec.*',
      'node_modules/**',
      'dist/**',
    ],
  },
});
