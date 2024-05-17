import spicy from "@spicyjs/core";
import { getSongs, getStream, getStreamURL } from "../api/Songs";
const { div, ul, li, button } = spicy;
import { reactor } from "@spicyjs/reactor";
import type { Song } from "../api/Songs";
import { PlayerControls, setCurrentSong } from "./PlayerControls";

export const musicView = () => {
	const audio = new Audio();
	const songs = reactor<{ Name: string; Id: string }[]>([]);
	getSongs().then((response) => {
		songs.value = response.Items;
	});

	return div(
		"music view",
		{ className: "p-0" },
		songs(
			ul({
				click($event) {
					const target = $event.target as HTMLButtonElement;
					const songContainer = target.closest(`[data-id]`);
					if (!songContainer) {
						return;
					}
					const id = songContainer.getAttribute("data-id");
					const song = songs.raw.find((item) => item.Id === id);
					setCurrentSong(song);
					// if (audio.src.includes(id)) {
					// 	audio.paused ? audio.play() : audio.pause();
					// } else {
					// 	audio.src = getStreamURL(id);
					// 	audio.play();
					// }
				},
			}),
			(list) => {
				const items = songs.raw.map((item) =>
					li(button(item.Name), { "data-id": item.Id })
				);
				list.replaceChildren(...items);
			}
		),
		PlayerControls()
	);
};
