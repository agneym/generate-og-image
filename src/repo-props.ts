import { getInput } from "@actions/core";

/**
 * Get repository level property defaults.
 */
async function getRepoProps() {
  const assetPath = getInput(`path`);
  const commitMsg = getInput(`commitMsg`);
  const backgroundColor = getInput(`background-color`);
  const fontColor = getInput(`font-color`);
  const componentUrl = getInput("componentUrl");
  return {
    assetPath,
    componentUrl,
    commitMsg,
    backgroundColor,
    fontColor
  };
}

export default getRepoProps;
