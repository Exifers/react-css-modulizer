function extractClassnames(cssAST) {
  const rules = cssAST.stylesheet.rules;
  let selectors = [];
  for (const rule of rules) {
    selectors = [...selectors, ...rule.selectors];
  }

  const classnameRegex = /\.[a-zA-Z0-9\-_]+/g;

  const classnames = [];
  for (selector of selectors) {
    classnames.push(...selector.match(classnameRegex))
  }

  return classnames.map(e => e.substring(1));
}

module.exports = {
  extractClassnames
};
