import { USER_REPO, GITHUB_HEAD_REF } from "./constants";

function commentMarkdown(path: string) {
	const [owner, repo] = USER_REPO;

	return `Your open graph image is ready:
![](https://github.com/${owner}/${repo}/raw/${GITHUB_HEAD_REF}/${path}.jpg)
  `;
}

export default commentMarkdown;
