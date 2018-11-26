const fs = require('fs')

dirs = fs.readdirSync(__dirname)

const cssText = fs.readFileSync(__dirname + '/input/main.css', {encoding: 'utf-8'})

const css = require('css')
const loadUtils = require('loader-utils')

const parse = function (source) {
  // 读取配置
  // const options = Object.assign(
  //   {},
  //   defaultOptions,
  //   loaderUtils.getOptions(this))
  
  // 提取所需比例 (v-16-9)
  const regex = /(v-[\d]+-[\d]+)/

  const result = regex.exec(source)
  if (result === null) {
    // 没有即不做任何操作
    return source
  }

  // .v-16-9 
  const ratio = '.' + result[1] + ' '

  const tree = css.parse(source)

  tree
  // 需要在所有的 类前面添加 .v-16-9
  let rules = tree.stylesheet.rules

  const addRules = (rules) => {
    if (rules === undefined) {
      return
    }
    rules.forEach(v => {
      if (v.type === 'rule') {
        v.selectors = v.selectors.map(v => {
          if (v.startsWith('body') || v.startsWith('html')) {
            return v
          }
          return ratio + v
        })
      }
      // 递归
      addRules(v.rules)
    })
  }

  
  addRules(rules)

  return css.stringify(tree)
}

let out = parse(cssText)

fs.writeFileSync(__dirname + '/output/main.css', out)