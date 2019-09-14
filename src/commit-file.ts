import octokit from "./github-api";

import { USER_REPO } from "./constants";

async function commitFile(content: string) {
  const [owner, repo] = USER_REPO;
  await octokit.repos.createFile({
    owner,
    repo,
    path: "dist/image.jpg",
    message: "Just some wholesome content, yo all",
    content, 
  }) 
}

export default commitFile;