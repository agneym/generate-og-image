import { USER_REPO } from "./constants";
import getPrNumber from "./get-pr-number";
import octokit from "./github-api";

const createComment = async (body: string) => {
	const [owner, repo] = USER_REPO;
	const prNumber = getPrNumber();

	return octokit.issues.createComment({
		owner,
		repo,
		issue_number: prNumber,
		body,
	});
};

export default createComment;
