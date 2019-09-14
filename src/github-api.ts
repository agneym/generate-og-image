import { GitHub } from "@actions/github";
import { GITHUB_TOKEN } from "./constants";

const octokit = new GitHub(GITHUB_TOKEN as string);

export default octokit;