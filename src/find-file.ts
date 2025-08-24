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
 * Filter out deleted files from GitHub PR file list
 * @param files Array of files from GitHub API
 * @returns Array of non-deleted files
 */
export function filterNonDeletedFiles(
	files: PullsListFilesResponseItem[],
): PullsListFilesResponseItem[] {
	return files.filter((file) => file.status !== "removed");
}

/**
 * Safe version with error handling and logging
 * @param files Array of files from GitHub API
 * @returns Array of non-deleted files with logging
 */
export function safeFilterNonDeletedFiles(
	files: PullsListFilesResponseItem[],
): PullsListFilesResponseItem[] {
	const validFiles = files.filter((file) => {
		if (!file.status) {
			console.warn(`File ${file.filename} missing status information`);
			return true; // Conservative approach - include if uncertain
		}
		return file.status !== "removed";
	});

	const deletedCount = files.length - validFiles.length;
	if (deletedCount > 0) {
		console.log(`Filtered out ${deletedCount} deleted files`);
	}

	return validFiles;
}

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
			: ({} as Record<string, any>);

		// Extract properties for output image filename generation
		// Support both fileName (camelCase) and filename (lowercase) for compatibility
		const customOutputFilename = (ogImageConfig.fileName ||
			ogImageConfig.filename) as string | undefined;
		const imageTitle = ogImageConfig.title as string | undefined;

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

	const nonDeletedFiles = safeFilterNonDeletedFiles(filesList);

	const markdownFiles = nonDeletedFiles.filter((file) => {
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
