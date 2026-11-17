import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["build/", "node_modules/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      // 與原 CRA (eslint-config-react-app) 的設定對齊
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "BinaryExpression[operator=/^[<>]=?$/] > BinaryExpression.left[operator=/^[<>]=?$/]",
          message: "不可串接比較 (a <= b <= c 永遠會先算出 true/false); 請改寫為 b >= a && b <= c",
        },
      ],
    },
  },
];
