type params = Parameters<typeof fetch>;

export const apiFetch = async (url: params[0], options?: params[1]) => {
	const response = await fetch(url, options);
	if (response.ok) {
		return response.json();
	}
	throw response;
};

export const createFetch = (baseUrl: string) => {
	const url = new URL(baseUrl);
	return {
		get: (path = "", query: Record<string, string>) => {
			url.pathname = path;
			url.search = new URLSearchParams(query).toString();
			return apiFetch(url);
		},
	};
};
