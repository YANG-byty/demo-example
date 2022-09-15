module.exports = {
  // 此项是用来告诉eslint找当前配置文件不能往父级查找
  root: true,
  // 此项是用来指定eslint解析器的，解析器必须符合规则，babel-eslint解析器是对babel解析器的包装使其与ESLint解析
  // 此项是用来指定javaScript语言类型和风格，sourceType用来指定js导入的方式，默认是script，此处设置为module，指某块导入方式
  parserOptions: {
    parser: 'babel-eslint'
  },
  // 此项指定环境的全局变量，下面的配置指定为浏览器环境
  env: {
    node: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style  (拓展至standard，具体标准详见md文档)
  // 此项是用来配置标准的js风格，就是说写代码的时候要规范的写，如果你使用vs-code我觉得应该可以避免出错
  extends: ['plugin:vue/essential', 'standard'],
  // required to lint *.vue files
  // 此项是用来提供插件的，插件名称省略了eslint-plugin-，下面这个配置是用来规范html的
  //   plugins: ["html"],
  // add your custom rules here
  // 下面这些rules是用来设置从插件来的规范代码的规则，使用必须去掉前缀eslint-plugin-
  // 主要有如下的设置规则，可以设置字符串也可以设置数字，两者效果一致
  // "off" -> 0 关闭规则
  // "warn" -> 1 开启警告规则
  // "error" -> 2 开启错误规则
  rules: {
    semi: [1, 'always'], // 强制结尾有分号
    indent: [1, 2, { SwitchCase: 1 }], // 强制使用2空格缩进
    quotes: [1, 'single'], // 强制使用单引号
    'no-multiple-empty-lines': [2, { max: 2 }], //空行最多不能超过两行
    eqeqeq: [0], //比较的时候不使用严格等于
    camelcase: [
      //不强制文件驼峰命名
      0,
      {
        properties: 'always'
      }
    ],
    //不强制检查文件名
    'vue/multi-word-component-names': [
      0,
      {
        ignores: []
      }
    ],
    'no-invalid-regexp': [0], //不效验正则
    'no-useless-escape': [0], //禁用不必要的转义
    'spaced-comment': [0], //注释首尾留空格 关闭
    'handle-callback-err': [0], //回调里不处理错误
    'space-before-function-paren': [0], //函数定义时括号前的空格
    'no-console': [0], //process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': [0],
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false
      }
    ]
  }
};
