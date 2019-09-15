import { getInput } from "@actions/core";

/**
 * Get repository level property defaults.
 */
async function getRepoProps() {
  const assetPath = getInput(`path`);
  const commitMsg = getInput(`commitMsg`);
  const backgroundColor = getInput(`background-color`);
  const fontColor = getInput(`font-color`);
  return {
    assetPath,
    commitMsg,
    backgroundColor,
    fontColor
  };
}

export default getRepoProps;
