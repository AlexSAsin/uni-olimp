//
// @README:
// Turn on "Automatic ESLint configuration" under Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint.
//

module.exports = {
  extends: ['airbnb-typescript/base', 'prettier'],
  root: true,
  files: ['src/**/*'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // сложно искать работу с частями ДТОшек
    'prefer-destructuring': ['off'],

    // варны и эрроры - ок
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],

    // проще ставить бряки если есть скобочки, пусть они и не нужны
    'arrow-body-style': ['off'],

    // можно полагаться на hoisting, а читать код проще "от общего к частному"
    'no-use-before-define': ['error', { functions: false, classes: false }],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],

    // просто переменные - error, аргументы в методе - норм.
    'no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],

    // не важно для приложений (но важно для библиотек - чтобы явно НЕ РАБОТАЛИ require)
    'prefer-default-export': ['off'],

    // модельки реквайрят сами себя
    'import/no-cycle': ['warn'],
  },

  overrides: [
    {
      files: ['src/db/**/*.ts'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        // модельки реквайрят сами себя
        'import/no-cycle': ['off'],

        // позволяем изменять параметры метода
        'no-param-reassign': ['off'],
      },
    },
  ],
};
