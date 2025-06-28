export function mergeConfigs<T extends Record<string, any>>(
  baseConfig: T,
  ...overrides: Partial<T>[]
): T {
  return overrides.reduce((acc, override) => {
    return deepMerge(acc, override || {});
  }, baseConfig) as T;
}

function deepMerge(target: any, source: any): any {
  if (!source) return target;

  const output = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key]) && isObject(target[key])) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }

  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}
