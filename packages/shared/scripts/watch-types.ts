// packages/shared/scripts/watch-types.ts
import { watch } from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';
import { debounce } from 'lodash';

const execAsync = promisify(exec);

/**
 * Watches backend files and regenerates types on change
 */
const watchAndGenerate = async () => {
  console.log('👀 Starting type watch mode...');

  const generate = async () => {
    try {
      console.log('🔄 Regenerating types...');
      await execAsync('pnpm generate');
      console.log('✅ Types regenerated successfully!');
    } catch (error) {
      console.error('❌ Type generation failed:', error);
    }
  };

  const debouncedGenerate = debounce(generate, 2000);

  // Watch backend files
  const watcher = watch([
    '../../apps/api/src/domain/entities/**/*.ts',
    '../../apps/api/src/config/swagger*.ts',
    '../../apps/api/src/presentation/controllers/**/*.ts',
  ], {
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on('change', (path) => {
      console.log(`📝 File changed: ${path}`);
      debouncedGenerate();
    })
    .on('add', (path) => {
      console.log(`➕ File added: ${path}`);
      debouncedGenerate();
    })
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });

  // Initial generation
  await generate();
};

// Run if called directly
if (require.main === module) {
  watchAndGenerate();
}
