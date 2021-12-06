module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  // 적용규칙: 뒤에오는 설정이 앞의 설정을 덮어쓰기 때문에 prettier가 뒤에 와야한다.
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'eslint:recommended', 'plugin:prettier/recommended'],

  // 적용규칙: 밑에 있을 수록 우선순위를 가진다.
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', //
    'plugin:prettier/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // ESLint 설정파일에, .prettierrc에 설정된 값으로 충돌 방지 설정 추가
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error'],
    // await 상용하지 않는 함수에 async 사용가능하게 설정
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    // 프로미스를 사용하지 말아야 하는곳에서 사용하면 에러
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        //
        checksVoidReturn: true,
        // 조건문에 비동기 함수 사용시 awiat 안붙이면 에러 발생
        checksConditionals: true,
      },
    ],
  },
};
