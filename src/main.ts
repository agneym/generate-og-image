#!/usr/bin/env node
import { warning } from "@actions/core";
import commentMarkdown from "./comment-markdown";
import commitFile from "./commit-file";
import { GITHUB_EVENT_NAME, GITHUB_TOKEN } from "./constants";
import createComment from "./create-comment";
import findFile from "./find-file";
import generateHtml from "./generate-html";
import generateImage from "./generate-image";
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
	const fileProperties = await findFile(repoProps.ignorePatterns);

	if (!fileProperties.length) {
		warning("No compatible files found");
	}

	fileProperties.forEach(async (property) => {
		const html = generateHtml({
			...repoProps,
			...property.attributes,
		});

		const image = await generateImage(
			{
				width: repoProps.width,
				height: repoProps.height,
			},
			html,
		);

		commitFile(image, repoProps, property.filename);

		if (repoProps.botComments !== "no") {
			const markdown = commentMarkdown(
				`${repoProps.assetPath}${property.filename}`,
			);
			await createComment(markdown);
		}
	});
}

run();
