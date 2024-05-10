import spicy from "@spicyjs/core";
import { getSongs, getStream, getStreamURL } from "../api/Songs";
const { div, ul, li, button } = spicy;
import { reactor } from "@spicyjs/reactor";
import type { Song } from "../api/Songs";

export const musicView = () => {
	const audio = new Audio();
	const songs = reactor<{ Name: string; Id: string }[]>([]);
	getSongs().then((response) => {
		songs.value = response.Items;
	});

	return div(
		"music view",
		songs(
			ul({
				click($event) {
					const target = $event.target as HTMLButtonElement;
					const button = target.closest(`button[data-id]`);
					if (!button) {
						return;
					}
					const id = button.getAttribute("data-id");
					if (audio.src.includes(id)) {
						audio.paused ? audio.play() : audio.pause();
					} else {
						audio.src = getStreamURL(id);
						audio.play();
					}
				},
			}),
			(list) => {
				const items = songs.raw.map((item) =>
					li(button(item.Name, { "data-id": item.Id }))
				);
				list.replaceChildren(...items);
			}
		)
	);
};
