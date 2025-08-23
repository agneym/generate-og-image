import picomatch from "picomatch";

/**
 * Creates a file filter function based on ignore patterns
 * @param patterns Array of glob patterns to ignore
 * @returns Function that returns true if file should be ignored
 */
export function createFileFilter(
	patterns: string[],
): (filename: string) => boolean {
	if (!patterns.length) {
		return () => false;
	}

	// Create matchers for each pattern
	const matchers = patterns
		.map((pattern) => {
			try {
				return picomatch(pattern);
			} catch (error) {
				console.warn(`Invalid ignore pattern "${pattern}":`, error);
				return null;
			}
		})
		.filter(Boolean);

	return (filename: string): boolean => {
		return matchers.some((matcher) => matcher?.(filename));
	};
}

/**
 * Checks if a file should be ignored based on ignore patterns
 * @param filename The file path to check
 * @param ignorePatterns Array of glob patterns to ignore
 * @returns true if file should be ignored, false otherwise
 */
export function shouldIgnoreFile(
	filename: string,
	ignorePatterns: string[],
): boolean {
	const filter = createFileFilter(ignorePatterns);
	return filter(filename);
}

/**
 * Filters an array of files, removing those that match ignore patterns
 * @param files Array of file objects or paths
 * @param ignorePatterns Array of glob patterns to ignore
 * @param getFilename Function to extract filename from file object (optional)
 * @returns Filtered array with ignored files removed
 */
export function filterFiles<T>(
	files: T[],
	ignorePatterns: string[],
	getFilename?: (file: T) => string,
): T[] {
	if (!ignorePatterns.length) {
		return files;
	}

	const filter = createFileFilter(ignorePatterns);

	return files.filter((file) => {
		const filename = getFilename ? getFilename(file) : String(file);
		return !filter(filename);
	});
}
