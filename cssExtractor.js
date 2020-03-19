function extractClassnames(cssAST) {
  const rules = cssAST.stylesheet.rules;
  let selectors = [];
  for (const rule of rules) {
    switch (rule.type) {
      case 'media':
        for (const subRule of rule.rules) {
          selectors = [...selectors, ...subRule.selectors]
        }
        break;
      case 'keyframes':
        break;
      default:
        selectors = [...selectors, ...rule.selectors];
    }
  }

  const classnameRegex = /\.[a-zA-Z0-9\-_]+/g;

  const classnames = [];
  for (selector of selectors) {
    const matches = selector.match(classnameRegex)
    if (matches !== null) {
      classnames.push(...matches)
    }
  }

  return classnames.map(e => e.substring(1));
}

module.exports = {
  extractClassnames
};
