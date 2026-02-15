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

// Find the existing typescript-eslint plugin from next config
const tsPlugin = eslintConfig.find(
  (c) => c.plugins?.["@typescript-eslint"]
)?.plugins?.["@typescript-eslint"];

if (tsPlugin) {
  eslintConfig.push({
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  });
}

export default eslintConfig;
