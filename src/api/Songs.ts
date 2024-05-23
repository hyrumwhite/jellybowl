import { API_KEY, SERVER_URL } from "../constants/localstorage";
import { apiFetch } from "./ApiFetch";

export type Song = {
	Id: string;
	Name: string;
};

export const APIInfo = {
	baseURL: localStorage.getItem(SERVER_URL) ?? "",
	token: localStorage.getItem(API_KEY) ?? "",
	get headers() {
		return { Authorization: `MediaBrowser Token=${this.token}` };
	},
};
export const getStreamURL = (id: string) => {
	const { baseURL, token } = APIInfo;
	const urlOptions = new URLSearchParams({
		api_key: token,
		MaxStreamingBitrate: 117482518,
		Container:
			"opus,webm|opus,mp3,aac,m4a|aac,m4b|aac,flac,webma,webm|webma,wav,ogg",
		TranscodingContainer: "ts",
		TranscodingProtocol: "hls",
		AudioCodec: "aac",
		StartTimeTicks: "0",
		EnableRedirection: "true",
		EnableRemoteMedia: "false",
	});
	let url = new URL(`Audio/${id}/universal?${urlOptions}`, baseURL);
	return url.toString();
};
window.addEventListener("storage", ($event) => {
	if ($event.key in APIInfo) {
		APIInfo[key] = $event.newValue;
	}
});

export const getSongs = async ({ offset = 0, limit = 100 } = {}) => {
	const { baseURL } = APIInfo;
	const url = new URL("Items", baseURL);
	url.search = `${new URLSearchParams({
		IncludeItemTypes: "Audio",
		Recursive: true,
		StartIndex: offset,
		Limit: limit,
	})}`;
	return apiFetch<Song[]>(url, {
		headers: APIInfo.headers,
	});
};
