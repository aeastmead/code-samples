const path = require("path");

const NODE_MODULES_ALIAS_ENTRY_POINTS = [
  ["react", "react"],
  ["react-dom", "react-dom"],
  ["react-router-dom", "react-router-dom"],
  ["@bbnpm/bb-ui-framework", "@bbnpm/bb-ui-framework/esm"],
  ["styled-components", "styled-components/dist/styled-components.js"],
  ["react-router", "react-router"],
];

/**
 *
 * @param {string} context
 * @param {Object} alias
 */
exports.getResolveAliases = function getResolveAliases(context, alias = {}) {
  for (const [pkg, subDir] of NODE_MODULES_ALIAS_ENTRY_POINTS) {
    alias[pkg] = path.join(context, "node_modules", subDir);
  }

  return alias;
};

exports.makeTsxExclude = () => [
  /node_modules/i,
  /.*\.(?:spec|stories)\.*?$/i,
  /test-utils?\.*/i,
  /story-utils\.*/i,
  /testUtils?\.*/i,
];
