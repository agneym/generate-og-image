import { error } from "@actions/core";
import { COMMITTER, GITHUB_HEAD_REF, USER_REPO } from "./constants";
import octokit from "./github-api";
import type { IRepoProps } from "./types";

/**
 * Commit the image with reported filename and commit messsage
 * @param content Image to be commited
 * @param repoProps properties
 * @param filename file to be commited as
 */
async function commitFile(
	content: string,
	repoProps: Partial<IRepoProps>,
	filename: string,
) {
	const [owner, repo] = USER_REPO;
	const filePath = `${repoProps.assetPath || ""}${filename}.jpg`;

	try {
		// First, try to get the existing file to get its SHA
		let sha: string | undefined;
		try {
			const { data: existingFile } = await octokit.repos.getContents({
				owner,
				repo,
				path: filePath,
				ref: GITHUB_HEAD_REF,
			});

			// Handle the case where getContents returns a file object
			if ("sha" in existingFile && typeof existingFile.sha === "string") {
				sha = existingFile.sha;
			}
		} catch (getError: any) {
			// File doesn't exist, which is fine for creating new files
			if (getError.status !== 404) {
				console.warn(
					`Warning: Could not get existing file SHA: ${getError.message}`,
				);
			}
		}

		// Create or update the file
		const commitParams: any = {
			owner,
			repo,
			path: filePath,
			branch: GITHUB_HEAD_REF,
			message: repoProps.commitMsg || "",
			content,
			...COMMITTER,
		};

		// Include SHA if the file exists
		if (sha) {
			commitParams.sha = sha;
		}

		await octokit.repos.createOrUpdateFile(commitParams);
	} catch (err) {
		error(`Adding a commit to branch ${GITHUB_HEAD_REF} failed with ${err}`);
	}
}

export default commitFile;
