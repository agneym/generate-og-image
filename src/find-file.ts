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
import { IFrontMatter, IFileProps } from "./types";

/**
 * Get name of the file by stripping the extensions
 * @param filename
 */
function getFileName(filename: string) {
  const { length: len, [len - 1]: last } = filename.split("/");
  const name = last.replace(/.mdx?/, "");
  return name;
}

/**
 * Extract JSON from markdown frontmatter
 * @param files List of files in the PR
 */
function getAttributes(files: PullsListFilesResponseItem[]): IFileProps[] {
  return files.map(file => {
    const filename = file.filename;
    const repoDirectory = REPO_DIRECTORY as string;
    const contents = readFileSync(`${repoDirectory}/${filename}`, {
      encoding: "utf8"
    });
    const { attributes } = fm<IFrontMatter>(contents);
    return {
      filename: getFileName(filename),
      attributes: Object.keys(attributes).length
        ? { ...(attributes.ogImage || {}) }
        : {}
    };
  });
}

/**
 * Find files with md and mdx extensions and extract information
 * @returns Front matter attributes as JSON
 */
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
  const frontmatterAttributes = getAttributes(markdownFiles);

  return frontmatterAttributes.filter(
    frontmatterAttribute => Object.keys(frontmatterAttribute.attributes).length
  );
}
export default findFile;
