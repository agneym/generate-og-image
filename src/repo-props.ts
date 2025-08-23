import { getInput } from "@actions/core";

/**
 * Get repository level property defaults.
 */
async function getRepoProps() {
	const assetPath = getInput(`path`);
	const commitMsg = getInput(`commitMsg`);
	const background = getInput(`background`);
	const fontColor = getInput(`fontColor`);
	const componentUrl = getInput("componentUrl");
	const fontSize = getInput("fontSize");
	const width = getInput("width");
	const height = getInput("height");
	const botComments = getInput("botComments");
	const ignorePatterns = getInput("ignorePatterns")
		.split(",")
		.map((pattern) => pattern.trim())
		.filter((pattern) => pattern.length > 0);
	return {
		assetPath,
		componentUrl,
		commitMsg,
		background,
		fontColor,
		fontSize,
		width,
		height,
		botComments,
		ignorePatterns,
	};
}

export default getRepoProps;
