const config = [
  ...next,
  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      tailwindcss,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
    settings: {
      react: { version: "detect" },
    },
  },
  prettier,
];

export default config;
