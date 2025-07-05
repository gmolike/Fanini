// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { createConfig } from './eslint/createConfig.mjs';
import { baseConfig } from './eslint/configs/base.mjs';
import { typescriptConfig } from './eslint/configs/typescript.mjs';
import { reactConfig } from './eslint/configs/react.mjs';
import { fsdConfig } from './eslint/configs/fsd-architecture.mjs';
import { importsConfig } from './eslint/configs/imports-exports.mjs';
import { codeQualityConfig } from './eslint/configs/code-quality.mjs';
import { overridesConfig } from './eslint/configs/overrides.mjs';

export default createConfig(
  baseConfig,
  typescriptConfig,
  reactConfig,
  fsdConfig,
  importsConfig,
  codeQualityConfig,
  overridesConfig
);
