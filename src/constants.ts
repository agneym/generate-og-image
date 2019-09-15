const GITHUB_TOKEN = process.env["GITHUB_TOKEN"];
const GITHUB_EVENT_NAME = process.env["GITHUB_EVENT_NAME"];
const REPO_DIRECTORY = process.env["GITHUB_WORKSPACE"];
const GITHUB_REPOSITORY = process.env["GITHUB_REPOSITORY"];
const GITHUB_EVENT_PATH = process.env["GITHUB_EVENT_PATH"];
const GITHUB_HEAD_REF = process.env["GITHUB_HEAD_REF"];
const GITHUB_CONTEXT = process.env["GITHUB_CONTEXT"];

if (!REPO_DIRECTORY) {
  console.log("There is no GITHUB_WORKSPACE environment variable");
  process.exit(1);
}

if (!GITHUB_REPOSITORY) {
  console.log("Can't find github repository");
  process.exit(1);
}

const USER_REPO = (GITHUB_REPOSITORY as string).split("/");

const COMMITTER = {
  name: "OG Bot",
  email: "hello@agney.dev"
};

export {
  COMMITTER,
  GITHUB_TOKEN,
  GITHUB_EVENT_NAME,
  GITHUB_EVENT_PATH,
  REPO_DIRECTORY,
  USER_REPO,
  GITHUB_HEAD_REF,
  GITHUB_CONTEXT
};
