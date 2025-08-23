import { readFileSync } from "node:fs";
import type { PullsListFilesResponseItem } from "@octokit/rest";
import { kebabCase } from "es-toolkit/string";
import fm from "front-matter";

import { FORMATS, REPO_DIRECTORY, USER_REPO } from "./constants";
import { filterFiles } from "./file-filter";
import getPrNumber from "./get-pr-number";
import octokit from "./github-api";
import type { IFileProps, IFrontMatter } from "./types";

/**
 * Get the output filename for the generated OG image
 * Uses custom filename from frontmatter if provided, otherwise generates from title
 * @param customOutputFilename - Optional custom filename from ogImage.fileName in frontmatter
 * @param title - Title from ogImage.title in frontmatter
 */
function getOutputImageFilename(
	customOutputFilename: string | undefined,
	title: string | undefined,
) {
	if (customOutputFilename) {
		return customOutputFilename;
	} else if (title) {
		return kebabCase(title);
	} else {
		return "untitled";
	}
}

/**
 * Extract JSON from markdown frontmatter
 * @param files List of files in the PR
 */
function getAttributes(files: PullsListFilesResponseItem[]): IFileProps[] {
	return files.map((file) => {
		const sourceFilePath = file.filename; // Path to the source markdown file
		const repoDirectory = REPO_DIRECTORY as string;
		const contents = readFileSync(`${repoDirectory}/${sourceFilePath}`, {
			encoding: "utf8",
		});
		const { attributes } = fm<IFrontMatter>(contents);
		const ogImageConfig = Object.keys(attributes).length
			? { ...(attributes.ogImage || {}) }
			: {};

		// Extract properties for output image filename generation
		const customOutputFilename = ogImageConfig["fileName"];
		const imageTitle = ogImageConfig["title"];

		return {
			filename: getOutputImageFilename(customOutputFilename, imageTitle),
			attributes: ogImageConfig,
		};
	});
}

/**
 * Find files with md and mdx extensions and extract information
 * @param ignorePatterns Array of glob patterns for files to ignore
 * @returns Front matter attributes as JSON
 */
async function findFile(ignorePatterns: string[] = []) {
	const [owner, repo] = USER_REPO;
	const pullNumber = getPrNumber();

	const { data: filesList } = await octokit.pulls.listFiles({
		owner,
		repo,
		pull_number: pullNumber,
	});

	const markdownFiles = filesList.filter((file) => {
		return FORMATS.some((format) => file.filename.endsWith(format));
	});

	const filteredFiles = filterFiles(
		markdownFiles,
		ignorePatterns,
		(file) => file.filename,
	);

	const frontmatterAttributes = getAttributes(filteredFiles);

	return frontmatterAttributes.filter(
		(frontmatterAttribute) =>
			Object.keys(frontmatterAttribute.attributes).length,
	);
}
export default findFile;
