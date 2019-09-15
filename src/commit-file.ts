import { error } from "@actions/core";

import octokit from "./github-api";
import { USER_REPO, COMMITTER, GITHUB_HEAD_REF } from "./constants";
import { IRepoProps } from "./types";

async function commitFile(
  content: string,
  repoProps: IRepoProps,
  filename: string
) {
  const [owner, repo] = USER_REPO;

  try {
    await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: `${repoProps.assetPath}${filename}.jpg`,
      branch: GITHUB_HEAD_REF,
      message: repoProps.commitMsg,
      content,
      ...COMMITTER
    });
  } catch (err) {
    error(`Adding a commit to branch ${GITHUB_HEAD_REF} failed with ${err}`);
  }
}

export default commitFile;
