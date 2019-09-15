import { debug } from "@actions/core";
import fm from "front-matter";
import { promises as fs } from "fs";
import { PullsListFilesResponseItem } from "@octokit/rest";

import {
  GITHUB_CONTEXT,
  USER_REPO,
  FORMATS,
  REPO_DIRECTORY
} from "./constants";
import octokit from "./github-api";

function getAttributes(files: PullsListFilesResponseItem[]) {
  return files.map(async file => {
    const filename = file.filename;
    const repoDirectory = REPO_DIRECTORY as string;
    const contents = await fs.readFile(`${repoDirectory}/${filename}`, {
      encoding: "utf8"
    });
    debug(`${repoDirectory}/${filename}`);
    debug(contents);
    const { attributes } = fm(contents);
    return attributes;
  });
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
  const markdownFiles = filesList.filter(file => {
    return FORMATS.some(format => file.filename.endsWith(format));
  });
  const frontmatter = getAttributes(markdownFiles);
  debug(JSON.stringify(frontmatter));
}
export default findFile;
