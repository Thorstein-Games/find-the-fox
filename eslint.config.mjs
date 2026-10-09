import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // The original fox-game code relied on run-once effects; keep that behavior explicit per call site.
      'react-hooks/exhaustive-deps': 'off',
      // React Compiler safety rules. This app is React 18 without the compiler,
      // and uses the standard "latest callback in a ref" and "read window after
      // mount" (static export hydration) patterns these rules forbid.
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**'] },
];

export default config;
