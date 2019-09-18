import { getInput } from "@actions/core";

/**
 * Get repository level property defaults.
 */
async function getRepoProps() {
  const assetPath = getInput(`path`);
  const commitMsg = getInput(`commitMsg`);
  const backgroundColor = getInput(`background`);
  const fontColor = getInput(`fontColor`);
  const componentUrl = getInput("componentUrl");
  const fontSize = getInput("fontSize");
  return {
    assetPath,
    componentUrl,
    commitMsg,
    backgroundColor,
    fontColor,
    fontSize
  };
}

export default getRepoProps;
