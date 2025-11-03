import next from "eslint-config-next/core-web-vitals";
export default [
  ...next,
  {
    ignores: ["node_modules/**", ".next/**", "public/**", "data/**"]
  }
];
