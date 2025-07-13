module.exports = {
  forbidden: [
    {
      name: 'fsd-layer-hierarchy',
      comment: 'Enforce FSD layer hierarchy',
      severity: 'error',
      from: { path: '^src/shared' },
      to: { path: '^src/(entities|features|widgets|pages|app)' },
    },
    {
      name: 'fsd-entities-hierarchy',
      severity: 'error',
      from: { path: '^src/entities' },
      to: { path: '^src/(features|widgets|pages|app)' },
    },
    {
      name: 'fsd-features-hierarchy',
      severity: 'error',
      from: { path: '^src/features' },
      to: { path: '^src/(widgets|pages|app)' },
    },
    {
      name: 'fsd-widgets-hierarchy',
      severity: 'error',
      from: { path: '^src/widgets' },
      to: { path: '^src/(pages|app)' },
    },
    {
      name: 'fsd-pages-hierarchy',
      severity: 'error',
      from: { path: '^src/pages' },
      to: { path: '^src/app' },
    },
    {
      name: 'fsd-no-cross-imports-features',
      comment: 'No cross-imports between features',
      severity: 'error',
      from: { path: '^src/features/([^/]+)' },
      to: { path: '^src/features/(?!$1)([^/]+)' },
    },
    {
      name: 'fsd-public-api',
      comment: 'Use public API - import only from index files',
      severity: 'error',
      from: { path: '^src' },
      to: {
        path: '^src/(entities|features|widgets|pages)/[^/]+/.+',
        pathNot: '^src/(entities|features|widgets|pages)/[^/]+/(index|testing)\\.(js|ts|jsx|tsx)$',
      },
    },
  ],

  options: {
    includeOnly: '^src/',
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
  },
}
