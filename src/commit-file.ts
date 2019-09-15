import { error } from "@actions/core";

import octokit from "./github-api";
import { USER_REPO, COMMITTER, GITHUB_HEAD_REF } from "./constants";

async function commitFile(content: string, path: string, filename: string) {
  const [owner, repo] = USER_REPO;

  try {
    await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: `${path}${filename}`,
      branch: GITHUB_HEAD_REF,
      message: "Just some wholesome content, yo all",
      content,
      ...COMMITTER
    });
  } catch (err) {
    error(`Adding a commit to branch ${GITHUB_HEAD_REF} failed with ${err}`);
  }
}

export default commitFile;
