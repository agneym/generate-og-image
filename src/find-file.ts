import { readFileSync } from "node:fs";
import type { PullsListFilesResponseItem } from "@octokit/rest";
import { kebabCase } from "es-toolkit/string";
import fm from "front-matter";

import { FORMATS, REPO_DIRECTORY, USER_REPO } from "./constants";
import getPrNumber from "./get-pr-number";
import octokit from "./github-api";
import type { IFileProps, IFrontMatter } from "./types";

/**
 * Get name of the file if provided by the user or title in kebab case
 * @param filename
 * @param title
 */
function getFileName(filename: string | undefined, title: string) {
	if (filename) {
		return filename;
	} else {
		return kebabCase(title);
	}
}

/**
 * Extract JSON from markdown frontmatter
 * @param files List of files in the PR
 */
function getAttributes(files: PullsListFilesResponseItem[]): IFileProps[] {
	return files.map((file) => {
		const filename = file.filename;
		const repoDirectory = REPO_DIRECTORY as string;
		const contents = readFileSync(`${repoDirectory}/${filename}`, {
			encoding: "utf8",
		});
		const { attributes } = fm<IFrontMatter>(contents);
		const reqdAttributes = Object.keys(attributes).length
			? { ...(attributes.ogImage || {}) }
			: {};
		return {
			filename: getFileName(
				reqdAttributes["fileName"],
				reqdAttributes["title"],
			),
			attributes: reqdAttributes,
		};
	});
}

/**
 * Find files with md and mdx extensions and extract information
 * @returns Front matter attributes as JSON
 */
async function findFile() {
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

	const frontmatterAttributes = getAttributes(markdownFiles);

	return frontmatterAttributes.filter(
		(frontmatterAttribute) =>
			Object.keys(frontmatterAttribute.attributes).length,
	);
}
export default findFile;
