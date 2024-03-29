import spicy from "@spicyjs/core";
import { reactor } from "@spicyjs/reactor";
import { Input } from "./shared/Input";

const { form, "flex-row": FlexRow, button, span, a } = spicy;

export const setupView = () => {
	const serverUrl = reactor(localStorage.getItem("server-url"));
	console.log(serverUrl.value);
	serverUrl(() => localStorage.setItem("server-url", serverUrl.value));
	return FlexRow(
		{ inline: "center" },
		form(
			{ class: "w-96 flex flex-col gap-3 bg-[--surface-850] p-6 rounded-md" },
			Input({
				id: "url-field",
				label: "Server URL",
				placeholder: "192.168.1.11:8096",
				value: serverUrl.value,
				onInput: ($event) => {
					serverUrl.value = ($event.target as HTMLInputElement).value;
				},
			}),
			Input({
				id: "api-key",
				label: "API Key",
				placeholder: "8d561c9b1c8547d791675d4cf1309a4b",
			}),
			serverUrl(span(), (span) => {
				if (serverUrl.value) {
					let link = span.querySelector("a");
					if (!link) {
						link = a("Get an api key here");
						span.replaceChildren(link);
					}
					link.href = `https://${serverUrl.value?.replace(
						"https://",
						""
					)}/web/index.html#!/apikeys.html`;
				} else {
					span.innerHTML = "";
				}
			}),
			button("Next", {
				click() {},
			})
		)
	);
};
