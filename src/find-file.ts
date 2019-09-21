import fm from "front-matter";
import { readFileSync } from "fs";
import { kebabCase } from "lodash";
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
 * Get name of the file if provided by the user or title in kebab case
 * @param filename
 * @param title
 */
function getFileName(filename: string | undefined, title: string) {
  if (filename) {
    return filename;
  } else {
    return kebabCase(title);
  }
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
    const reqdAttributes = Object.keys(attributes).length
      ? { ...(attributes.ogImage || {}) }
      : {};
    return {
      filename: getFileName(
        reqdAttributes["filename"],
        reqdAttributes["title"]
      ),
      attributes: reqdAttributes
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
