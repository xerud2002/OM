import nextConfig from "eslint-config-next";

const eslintConfig = nextConfig.map((config) => {
  if (config.plugins?.["@next/next"]) {
    return {
      ...config,
      rules: {
        ...config.rules,
        "@next/next/no-img-element": "warn",
        "react-hooks/set-state-in-effect": "off",
        "react-hooks/immutability": "off",
      },
    };
  }
  return config;
});

eslintConfig.push({
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-function-type": "off",
  },
});

export default eslintConfig;
