import { fileURLToPath } from "node:url"
import { mergeConfig, defineConfig, configDefaults } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      silent: true,
      coverage: {
          reporter: ["text", "json", "html"]  
      },
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "tests/e2e/*"],
      root: fileURLToPath(new URL("./", import.meta.url)),
    }
  })
);