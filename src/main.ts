#!/usr/bin/env node

import { GITHUB_TOKEN, GITHUB_EVENT_NAME } from "./constants";
import generateImage from "./generate-image";
import commitFile from "./commit-file";
import generateHtml from "./generate-html";
import findFile from "./find-file";
import { warning } from "@actions/core";
import getRepoProps from "./repo-props";

if (!GITHUB_TOKEN) {
  console.log("You must enable the GITHUB_TOKEN secret");
  process.exit(1);
}

async function run() {
  // Bail out if the event that executed the action wasn’t a pull_request
  if (GITHUB_EVENT_NAME !== "pull_request") {
    console.log("This action only runs for pushes to PRs");
    process.exit(78);
  }

  const repoProps = await getRepoProps();
  const fileProperties = await findFile();

  if (!fileProperties.length) {
    warning("No compatible files found");
  }

  fileProperties.forEach(async property => {
    const html = generateHtml(property.attributes);

    const image = await generateImage(html);

    commitFile(image, repoProps, property.filename);
  });
}

run();
