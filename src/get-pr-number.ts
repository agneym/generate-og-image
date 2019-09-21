import { GITHUB_CONTEXT } from "./constants";

function getPrNumber(): number {
  const githubCtx: any = JSON.parse(GITHUB_CONTEXT as string);
  const pullNumber = githubCtx.event.number;
  return pullNumber;
}

export default getPrNumber;
