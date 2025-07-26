// packages/shared/scripts/watch-types.ts
import { exec } from "child_process";
import { watch } from "chokidar";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Simple debounce implementation
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Watches backend files and regenerates types on change
 */
const watchAndGenerate = async () => {
  console.log("👀 Starting type watch mode...");

  const generate = async () => {
    try {
      console.log("🔄 Regenerating types...");
      await execAsync("pnpm generate");
      console.log("✅ Types regenerated successfully!");
    } catch (error) {
      console.error("❌ Type generation failed:", error);
    }
  };

  const debouncedGenerate = debounce(generate, 2000);

  // Watch backend files
  const watcher = watch(
    [
      "../../apps/api/src/domain/entities/**/*.ts",
      "../../apps/api/src/config/swagger*.ts",
      "../../apps/api/src/presentation/controllers/**/*.ts",
    ],
    {
      persistent: true,
      ignoreInitial: true,
    },
  );

  watcher
    .on("change", (path) => {
      console.log(`📝 File changed: ${path}`);
      debouncedGenerate();
    })
    .on("add", (path) => {
      console.log(`➕ File added: ${path}`);
      debouncedGenerate();
    })
    .on("error", (error) => {
      console.error("❌ Watcher error:", error);
    });

  // Initial generation
  await generate();
};

// Run if called directly
watchAndGenerate().catch(console.error);
