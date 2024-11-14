import { defineConfig } from "vitest/config";
// vitest.setup.ts
import "@testing-library/jest-dom";


export default defineConfig({
  test: {
    environment: "jsdom", // Provides a DOM environment
    globals: true,
    setupFiles: "./vitest.setup.ts", // Setup file for global mocks or configurations
  },
});
