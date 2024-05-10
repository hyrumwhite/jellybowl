type params = Parameters<typeof fetch>;

export const apiFetch = async <T>(url: params[0], options?: params[1]) => {
	const response = await fetch(url, options);
	if (response.ok) {
		const json = (await response.json()) as T;
		return json;
	}
	throw response;
};

export const createFetch = (baseUrl: string, options?: params[1]) => {
	const url = new URL(baseUrl);
	return {
		get: <T>(path = "", query?: Record<string, string>) => {
			url.pathname = path;
			url.search = new URLSearchParams(query).toString();
			return apiFetch<T>(url, options);
		},
	};
};
