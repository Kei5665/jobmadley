import nextPlugin from "eslint-config-next"

const config = [
  ...nextPlugin,
  {
    ignores: [".next/**", "node_modules/**", "tests/**", "public/**"],
  },
]

export default config
