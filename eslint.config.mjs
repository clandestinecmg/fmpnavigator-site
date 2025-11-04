// eslint.config.mjs
import next from "eslint-config-next/core-web-vitals";

const config = [
  ...next,
  {
    ignores: ["node_modules/**", ".next/**", "public/**", "data/**"],
  },
];

export default config;