let dynamicSheet;

export function insertDynamicRule(rule) {
  if (typeof document === 'undefined' || typeof CSSStyleSheet === 'undefined') {
    return;
  }

  if (!dynamicSheet) {
    dynamicSheet = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, dynamicSheet];
  }

  dynamicSheet.insertRule(rule, dynamicSheet.cssRules.length);
}
