import { getInput } from "@actions/core";

/**
 * Get repository level property defaults.
 */
async function getRepoProps() {
  const assetPath = getInput(`path`);
  const commitMsg = getInput(`commitMsg`);
  return {
    assetPath,
    commitMsg
  };
}

export default getRepoProps;
