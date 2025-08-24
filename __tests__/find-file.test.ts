import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test";
import type { PullsListFilesResponseItem } from "@octokit/rest";

// Import only the functions we need for testing without triggering other imports
let filterNonDeletedFiles: any;
let safeFilterNonDeletedFiles: any;

// Set up environment and import functions before tests
beforeEach(async () => {
	// Set environment variables before any imports
	process.env.GITHUB_WORKSPACE = "/test/workspace";
	process.env.GITHUB_REPOSITORY = "test/repo";
	process.env.GITHUB_TOKEN = "test-token";
	process.env.GITHUB_CONTEXT = '{"event":{"number":123}}';

	// Dynamically import the functions to avoid module loading issues
	const module = await import("../src/find-file");
	filterNonDeletedFiles = module.filterNonDeletedFiles;
	safeFilterNonDeletedFiles = module.safeFilterNonDeletedFiles;
});

describe("File Status Filtering", () => {
	describe("filterNonDeletedFiles", () => {
		it("should filter out removed files", () => {
			const files = [
				{ filename: "added.md", status: "added" },
				{ filename: "modified.md", status: "modified" },
				{ filename: "deleted.md", status: "removed" },
				{ filename: "renamed.md", status: "renamed" },
			] as PullsListFilesResponseItem[];

			const result = filterNonDeletedFiles(files);

			expect(result).toHaveLength(3);
			expect(result.map((f) => f.filename)).toEqual([
				"added.md",
				"modified.md",
				"renamed.md",
			]);
			expect(result.map((f) => f.filename)).not.toContain("deleted.md");
		});

		it("should handle empty file list", () => {
			const files: PullsListFilesResponseItem[] = [];
			const result = filterNonDeletedFiles(files);
			expect(result).toHaveLength(0);
		});

		it("should keep all files when none are deleted", () => {
			const files = [
				{ filename: "added.md", status: "added" },
				{ filename: "modified.md", status: "modified" },
			] as PullsListFilesResponseItem[];

			const result = filterNonDeletedFiles(files);

			expect(result).toHaveLength(2);
			expect(result).toEqual(files);
		});

		it("should filter out only removed files when mixed statuses present", () => {
			const files = [
				{ filename: "keep1.md", status: "added" },
				{ filename: "remove1.md", status: "removed" },
				{ filename: "keep2.md", status: "modified" },
				{ filename: "remove2.md", status: "removed" },
			] as PullsListFilesResponseItem[];

			const result = filterNonDeletedFiles(files);

			expect(result).toHaveLength(2);
			expect(result.map((f) => f.filename)).toEqual(["keep1.md", "keep2.md"]);
		});
	});

	describe("safeFilterNonDeletedFiles", () => {
		let warnSpy: any;
		let logSpy: any;

		beforeEach(() => {
			warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
			logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
		});

		afterEach(() => {
			warnSpy.mockRestore();
			logSpy.mockRestore();
		});

		it("should handle missing status gracefully", () => {
			const files = [
				{ filename: "no-status.md" }, // Missing status field
				{ filename: "with-status.md", status: "added" },
			] as any[];

			const result = safeFilterNonDeletedFiles(files);

			expect(result).toHaveLength(2); // Both files preserved
			expect(warnSpy).toHaveBeenCalledWith(
				"File no-status.md missing status information",
			);
		});

		it("should log filtered deleted files count", () => {
			const files = [
				{ filename: "keep.md", status: "added" },
				{ filename: "delete1.md", status: "removed" },
				{ filename: "delete2.md", status: "removed" },
			] as PullsListFilesResponseItem[];

			const result = safeFilterNonDeletedFiles(files);

			expect(result).toHaveLength(1);
			expect(logSpy).toHaveBeenCalledWith("Filtered out 2 deleted files");
		});

		it("should not log when no files are filtered", () => {
			const files = [
				{ filename: "keep1.md", status: "added" },
				{ filename: "keep2.md", status: "modified" },
			] as PullsListFilesResponseItem[];

			const result = safeFilterNonDeletedFiles(files);

			expect(result).toHaveLength(2);
			expect(logSpy).not.toHaveBeenCalled();
		});

		it("should handle mixed missing status and deleted files", () => {
			const files = [
				{ filename: "no-status.md" }, // Missing status
				{ filename: "deleted.md", status: "removed" },
				{ filename: "kept.md", status: "added" },
			] as any[];

			const result = safeFilterNonDeletedFiles(files);

			expect(result).toHaveLength(2); // no-status.md and kept.md
			expect(result.map((f) => f.filename)).toEqual([
				"no-status.md",
				"kept.md",
			]);
			expect(warnSpy).toHaveBeenCalledWith(
				"File no-status.md missing status information",
			);
			expect(logSpy).toHaveBeenCalledWith("Filtered out 1 deleted files");
		});
	});
});
