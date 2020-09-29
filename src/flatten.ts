export function flatten<T extends Record<string, any>>(object: T, path: string | null = null, separator = '.'): T {
	return Object.keys(object).reduce((acc: T, key: string): T => {
		const value = object[key];
		const newPath = Array.isArray(object)
			? `${path ? path : ""}[${key}]`
			: [path, key].filter(Boolean).join(separator);
		const isObject = [
			typeof value === "object",
			value !== null,
			!(value instanceof Date),
			!(value instanceof RegExp),
			!(Array.isArray(value) && value.length === 0),
		].every(Boolean);

		return isObject
			? Array.isArray(value)
				? { ...acc, [newPath]: new Array(value.length), ...flatten(value, newPath, separator) }
				: { ...acc, [newPath]: {}, ...flatten(value, newPath, separator) }
			: { ...acc, [newPath]: value };
	}, {} as T);
}

export function flattenCsharpBody<T extends Record<string, any>>(object: T, path: string | null = null, separator = '.'): T {
	let i = -1;
	return Object.keys(object).reduce((acc: T, key: string): T => {
		const value = object[key];
		const newPath = Array.isArray(object)
			? `${path ? path : ""}[${key}]`
			: [path, key].filter(Boolean).join(separator);
		const isObject = [
			typeof value === "object",
			value !== null,
			!(value instanceof Date),
			!(value instanceof RegExp),
			!(Array.isArray(value) && value.length === 0),
		].every(Boolean);

		return isObject
			? Array.isArray(value)
				? { ...acc, [newPath]: new Array(value.length), ...flattenCsharpBody(value, newPath, separator) }
				: newPath.endsWith("]")
					? { ...acc, ...flattenCsharpBody(value, newPath, separator) }
					: { ...acc, [newPath]: {}, ...flattenCsharpBody(value, newPath, separator) }
			: { ...acc, [newPath]: value };
	}, {} as T);
}