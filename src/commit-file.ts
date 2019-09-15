import { debug, error } from "@actions/core";

import octokit from "./github-api";
import eventDetails from "./github-event";
import { USER_REPO, GITHUB_REF, COMMITTER, GITHUB_HEAD_REF } from "./constants";

async function commitFile(content: string) {
  const [owner, repo] = USER_REPO;
  const event = await eventDetails;
  console.log(event);
  debug(`Head ref, ${GITHUB_HEAD_REF}`);
  debug(`Event trigger ${event}`);
  const branch = (event as any).pull_request.head.ref;
  
  try {
    await octokit.repos.createOrUpdateFile({
      owner,
      repo,
      path: "dist/image.jpg",
      branch: GITHUB_REF,
      message: "Just some wholesome content, yo all",
      content,
      ...COMMITTER,
    });
  } catch(err) {
    error(`Adding a commit to branch ${GITHUB_REF} failed with ${err}`);
  }
}

export default commitFile;