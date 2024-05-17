import spicy from "@spicyjs/core";
import { reactor } from "@spicyjs/reactor";
import { Input } from "./shared/Input";
import { Show } from "./shared/Show";
import { go } from "@spicyjs/router";
import { API_KEY, SERVER_URL } from "../constants/localstorage";
import { routeCleanup } from "../utilities/route-cleanup";
import { routeNames } from "../constants/routes";

const { form, "flex-row": FlexRow, button, span, a } = spicy;

export const setupView = () => {
	const serverUrl = reactor(localStorage.getItem(SERVER_URL) || "");
	serverUrl(() => localStorage.setItem(SERVER_URL, serverUrl.value));

	const apiKey = reactor(localStorage.getItem(API_KEY) || "");
	apiKey(() => localStorage.setItem(API_KEY, apiKey.value));

	routeCleanup(routeNames.setup, [serverUrl, apiKey]);

	return FlexRow(
		{ inline: "center" },
		form(
			{
				class: "w-96 flex flex-col gap-3 bg-[--surface-850] p-6 rounded-md",
				submit($event) {
					$event.preventDefault();
					if (serverUrl.value && apiKey.value) {
						go({ path: "/music" });
					}
				},
			},
			Input({
				id: "url-field",
				label: "Server URL",
				placeholder: "192.168.1.11:8096",
				model: serverUrl,
				required: true,
			}),
			Input({
				id: "username",
				name: "Username",
				label: "Username",
				placeholder: "John",
				required: true,
			}),
			Input({
				id: "password",
				name: "Pw",
				type: "password",
				label: "Username",
				placeholder: "******",
				required: true,
			}),
			Show(
				{
					when: () => !!serverUrl.value,
				},
				serverUrl(
					a("Get an api key here"),
					(anchor) =>
						(anchor.href = `https://${serverUrl.value}/web/index.html#!/apikeys.html`)
				)
			),
			button("Next")
		)
	);
};
