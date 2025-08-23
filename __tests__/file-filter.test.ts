import {
	createFileFilter,
	filterFiles,
	shouldIgnoreFile,
} from "../src/file-filter";

describe("File Filter", () => {
	describe("createFileFilter", () => {
		it("should return a function that always returns false for empty patterns", () => {
			const filter = createFileFilter([]);
			expect(filter("README.md")).toBe(false);
			expect(filter("blog/post.md")).toBe(false);
		});

		it("should match exact file patterns", () => {
			const filter = createFileFilter(["/README.md"]);
			expect(filter("/README.md")).toBe(true);
			expect(filter("README.md")).toBe(false);
			expect(filter("/blog/README.md")).toBe(false);
		});

		it("should match wildcard patterns", () => {
			const filter = createFileFilter(["**/README.md"]);
			expect(filter("/README.md")).toBe(true);
			expect(filter("/docs/README.md")).toBe(true);
			expect(filter("/src/components/README.md")).toBe(true);
			expect(filter("/CHANGELOG.md")).toBe(false);
		});

		it("should handle multiple patterns", () => {
			const filter = createFileFilter([
				"/README.md",
				"/CHANGELOG.md",
				"**/*.config.md",
			]);
			expect(filter("/README.md")).toBe(true);
			expect(filter("/CHANGELOG.md")).toBe(true);
			expect(filter("/webpack.config.md")).toBe(true);
			expect(filter("/blog/post.md")).toBe(false);
		});

		it("should handle invalid patterns gracefully", () => {
			// Test with invalid pattern - should not crash
			const filter = createFileFilter(["[invalid"]);
			expect(filter("/README.md")).toBe(false);
		});
	});

	describe("shouldIgnoreFile", () => {
		it("should return false for empty ignore patterns", () => {
			expect(shouldIgnoreFile("/README.md", [])).toBe(false);
		});

		it("should return true for matching patterns", () => {
			expect(shouldIgnoreFile("/README.md", ["/README.md"])).toBe(true);
			expect(shouldIgnoreFile("/docs/README.md", ["**/README.md"])).toBe(true);
		});

		it("should return false for non-matching patterns", () => {
			expect(shouldIgnoreFile("/blog/post.md", ["/README.md"])).toBe(false);
		});
	});

	describe("filterFiles", () => {
		const mockFiles = [
			{ filename: "/README.md" },
			{ filename: "/CHANGELOG.md" },
			{ filename: "/blog/post.md" },
			{ filename: "/docs/api.md" },
		];

		it("should return all files when no ignore patterns", () => {
			const result = filterFiles(mockFiles, [], (file) => file.filename);
			expect(result).toHaveLength(4);
			expect(result).toEqual(mockFiles);
		});

		it("should filter out files matching ignore patterns", () => {
			const result = filterFiles(
				mockFiles,
				["/README.md", "/CHANGELOG.md"],
				(file) => file.filename,
			);
			expect(result).toHaveLength(2);
			expect(result[0].filename).toBe("/blog/post.md");
			expect(result[1].filename).toBe("/docs/api.md");
		});

		it("should work with wildcard patterns", () => {
			const result = filterFiles(
				mockFiles,
				["**/docs/**"],
				(file) => file.filename,
			);
			expect(result).toHaveLength(3);
			expect(result.find((f) => f.filename === "/docs/api.md")).toBeUndefined();
		});

		it("should work with string arrays when no getFilename provided", () => {
			const stringFiles = ["/README.md", "/blog/post.md", "/CHANGELOG.md"];
			const result = filterFiles(stringFiles, ["/README.md"]);
			expect(result).toEqual(["/blog/post.md", "/CHANGELOG.md"]);
		});
	});

	describe("Integration scenarios", () => {
		it("should handle default ignore pattern for README.md", () => {
			const files = [
				{ filename: "/README.md" },
				{ filename: "/blog/my-post.md" },
				{ filename: "/CLAUDE.md" },
			];

			const result = filterFiles(
				files,
				["/README.md"],
				(file) => file.filename,
			);
			expect(result).toHaveLength(2);
			expect(result.find((f) => f.filename === "/README.md")).toBeUndefined();
		});

		it("should handle complex patterns like in real usage", () => {
			const files = [
				{ filename: "/README.md" },
				{ filename: "/CHANGELOG.md" },
				{ filename: "/docs/api.md" },
				{ filename: "/docs/setup.md" },
				{ filename: "/blog/post1.md" },
				{ filename: "/blog/post2.md" },
				{ filename: "/webpack.config.md" },
			];

			const patterns = [
				"/README.md",
				"/CHANGELOG.md",
				"**/docs/**",
				"**/*.config.md",
			];
			const result = filterFiles(files, patterns, (file) => file.filename);

			expect(result).toHaveLength(2);
			expect(result[0].filename).toBe("/blog/post1.md");
			expect(result[1].filename).toBe("/blog/post2.md");
		});
	});
});
