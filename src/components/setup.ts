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
	let formEl: HTMLFormElement;
	const serverUrl = reactor(localStorage.getItem(SERVER_URL) || "");
	serverUrl(() => localStorage.setItem(SERVER_URL, serverUrl.value));
	const username = reactor("");
	const password = reactor("");

	const formAction = reactor(
		() => `${serverUrl.value}/Users/authenticatebyname`
	);
	formAction(() => {
		formEl?.setAttribute("action", formAction.value);
	});
	//need dependency reevaluation
	const isFormValid = reactor(() =>
		[username.value, password.value, serverUrl.value].every((value) => value)
	);
	routeCleanup(routeNames.setup, [serverUrl, username, password, isFormValid]);

	return FlexRow(
		{ inline: "center" },
		(formEl = form(
			{
				action: formAction.value,
				class: "w-96 flex flex-col gap-3 bg-[--surface-850] p-6 rounded-md",
				async submit($event) {
					$event.preventDefault();
					const response = await fetch(formAction.value, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"X-Emby-Authorization": `MediaBrowser Client="Jellyfin Web", Device="Chrome", DeviceId="TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTI0LjAuMC4wIFNhZmFyaS81MzcuMzZ8MTcxNjE0Mjg3MDQ4NQ11", Version="10.8.13"`,
						},
						body: JSON.stringify({
							Username: username.value,
							Pw: password.value,
						}),
					});
					const json = await response.json();
					const { AccessToken: token } = json;
					localStorage.setItem("api-key", token);
					if (serverUrl.value && token) {
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
				model: username,
			}),
			Input({
				id: "password",
				name: "Pw",
				type: "password",
				label: "Password",
				placeholder: "******",
				required: true,
				model: password,
			}),
			isFormValid(button("Next"), (button) => {
				button.disabled = !isFormValid.value;
			})
		))
	);
};
