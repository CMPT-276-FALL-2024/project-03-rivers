// vitest.setup.ts
import "@testing-library/jest-dom";
import * as toastModule from "@/hooks/use-toast";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock ResizeObserver to prevent errors in tests
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("@/hooks/use-toast", () => ({
    toast: vi.fn(),
}));

console.log("Vitest setup file loaded!");
