const GITHUB_TOKEN = process.env["GITHUB_TOKEN"];
const GITHUB_EVENT_NAME = process.env["GITHUB_EVENT_NAME"];
const REPO_DIRECTORY = process.env["GITHUB_WORKSPACE"];

if (!REPO_DIRECTORY) {
  console.log("There is no GITHUB_WORKSPACE environment variable");
  process.exit(1);
}

export {
  GITHUB_TOKEN,
  GITHUB_EVENT_NAME,
  REPO_DIRECTORY,
}