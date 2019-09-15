import { debug } from "@actions/core";
import fm from "front-matter";
import { PullsListFilesResponseItem } from "@octokit/rest";

import { GITHUB_CONTEXT, USER_REPO, FORMATS } from "./constants";
import octokit from "./github-api";

function getAttributes(files: PullsListFilesResponseItem[]) {
  return files.map(file => {});
}

async function findFile() {
  const [owner, repo] = USER_REPO;
  const githubCtx: any = JSON.parse(GITHUB_CONTEXT as string);
  const pullNumber = githubCtx.event.number;
  const { data: filesList } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber
  });
  debug(`Files List ${filesList}`);
  const markdownFiles = filesList.filter(file => {
    return FORMATS.some(format => file.filename.endsWith(format));
  });
  debug(`Markdown List ${JSON.stringify(markdownFiles)}`);
}
export default findFile;
