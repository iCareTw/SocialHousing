import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";

export default tseslint.config(
  { ignores: ["build/", "node_modules/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // React 元件的常見錯誤 (例如清單缺 key)；取代原 CRA 內建的 react 規則
    files: ["src/**/*.{ts,tsx}"],
    ...eslintReact.configs["recommended-typescript"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "BinaryExpression[operator=/^[<>]=?$/] > BinaryExpression.left[operator=/^[<>]=?$/]",
          message: "不可串接比較 (a <= b <= c 永遠會先算出 true/false); 請改寫為 b >= a && b <= c",
        },
      ],
    },
  },
);
