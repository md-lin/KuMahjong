export class StringUtil {
    // should only be called with valid keys
	public static extractID(input: string): string {
		const index = input.indexOf("_");
		return input.substring(0, index);
	}

    // should only be called with valid keys
	public static extractField(input: string): string {
		const index = input.indexOf("_");
		return input.substring(index + 1, input.length);
	}

	public static extractFieldUnderscore(input: string): string {
		const index = input.indexOf("_");
		return input.substring(index, input.length);
	}
}
