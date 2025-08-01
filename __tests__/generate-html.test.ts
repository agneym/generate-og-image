import generateHtml from "../src/generate-html";

describe("Generate HTML", () => {
	it(`returns a string`, () => {
		const result = generateHtml({});
		expect(result).toBeTruthy();
	});

	it(`contains background variable`, () => {
		const result = generateHtml({
			background: "{{name}}",
		});
		expect(result.includes("--background")).toBe(true);
	});

	it(`contains font color variable`, () => {
		const result = generateHtml({
			fontColor: "{{name}}",
		});
		expect(result.includes("--fontColor")).toBe(true);
	});

	it(`contains font size variable`, () => {
		const result = generateHtml({
			fontSize: "{{name}}",
		});
		expect(result.includes("--fontSize")).toBe(true);
	});

	it(`contains passed in title`, () => {
		const result = generateHtml({
			title: `{{name}}`,
		});
		expect(result.includes("{{name}}")).toBe(true);
		expect(result.includes(`slot="title"`)).toBe(true);
	});

	it(`creates html output for large payload`, () => {
		const result = generateHtml({
			assetPath: "demo/",
			componentUrl: "https://unpkg.com/@agney/og-image-element@0.2.0",
			commitMsg: "just some wholesome content. yo all!",
			background: "red",
			fontColor: "yellow",
			fontSize: "90%",
			title: "Generating open graph images with Github Actions",
			subtitle: "Works with Markdown files",
			imageUrl: "https://avatars3.githubusercontent.com/u/8883368?s=40&v=4",
		});
		expect(result).toBeTruthy();
	});

	it("adds gradient as background", () => {
		const result = generateHtml({
			background: "linear-gradient(to right, #000428, #004e92)",
		});
		expect(result.includes("linear-gradient(to right, #000428, #004e92)")).toBe(
			true,
		);
	});

	it("process emojis", () => {
		const result = generateHtml({
			imageUrl: "😍",
			title: "Generating open graph images with Github Actions",
			subtitle: "Works with Markdown files",
			componentUrl: "https://unpkg.com/@agney/og-image-element@0.2.0",
		});
		console.log(result);
		expect(result.includes(`class="emoji"`)).toBe(true);
	});
});
