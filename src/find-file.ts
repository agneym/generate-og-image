import { debug } from "@actions/core";
import { GITHUB_CONTEXT, USER_REPO } from "./constants";
import octokit from "./github-api";

async function findFile() {
  debug(GITHUB_CONTEXT as string);
  const [owner, repo] = USER_REPO;
  const githubCtx: any = JSON.parse(GITHUB_CONTEXT as string);
  const pullNumber = githubCtx.event.number;
  debug(`Event number: ${pullNumber}`);
  const filesList = octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber
  });
  debug(`Files List ${filesList}`);
}

export default findFile;
