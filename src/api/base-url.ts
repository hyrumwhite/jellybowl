import { SERVER_URL } from "../constants/localstorage";

export const getBaseUrl = (pathname = "") => {
	const baseURL = localStorage.getItem(SERVER_URL);
	return new URL(pathname, baseURL);
};
