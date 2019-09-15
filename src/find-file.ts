import fm from "front-matter";
import { readFileSync } from "fs";
import { PullsListFilesResponseItem } from "@octokit/rest";

import {
  GITHUB_CONTEXT,
  USER_REPO,
  FORMATS,
  REPO_DIRECTORY
} from "./constants";
import octokit from "./github-api";
import { IFrontMatter } from "./types";

async function getAttributes(files: PullsListFilesResponseItem[]) {
  return files.map(file => {
    const filename = file.filename;
    const repoDirectory = REPO_DIRECTORY as string;
    const contents = readFileSync(`${repoDirectory}/${filename}`, {
      encoding: "utf8"
    });
    const { attributes } = fm<IFrontMatter>(contents);
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
  const frontmatterAttributes = await getAttributes(markdownFiles);

  return frontmatterAttributes
    .filter(frontmatterAttribute => frontmatterAttribute.ogImage)
    .map(frontmatterAttribute => frontmatterAttribute.ogImage);
}
export default findFile;
