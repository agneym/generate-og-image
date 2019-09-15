import octokit from "./github-api";

import { USER_REPO, GITHUB_REF } from "./constants";

async function commitFile(content: string) {
  const [owner, repo] = USER_REPO;
  await octokit.repos.createOrUpdateFile({
    owner,
    repo,
    path: "dist/image.jpg",
    branch: GITHUB_REF,
    message: "Just some wholesome content, yo all",
    content, 
  });
}

export default commitFile;