import getPrNumber from "./get-pr-number";
import { USER_REPO } from "./constants";
import octokit from "./github-api";

const createComment = async body => {
  const [owner, repo] = USER_REPO;
  const prNumber = getPrNumber();

  return octokit.issues.createComment({
    owner,
    repo,
    number: prNumber,
    body
  });
};

module.exports = createComment;
