// Type declarations for modules without proper TypeScript support

declare module "twemoji" {
	interface TwemojiOptions {
		callback?: (icon: string, options: TwemojiOptions) => string;
		base?: string;
		ext?: string;
		size?: string | number;
		className?: string;
		folder?: string;
		attributes?: () => Record<string, string>;
	}

	interface Twemoji {
		parse(str: string, options?: TwemojiOptions): string;
		test(str: string): boolean;
	}

	const twemoji: Twemoji;
	export default twemoji;
}
