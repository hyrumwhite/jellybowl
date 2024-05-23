import spicy from "@spicyjs/core";
import { getSongs, getStream, getStreamURL } from "../api/Songs";
const { "flex-column": FlexColumn, ul, li, button } = spicy;
import { reactor } from "@spicyjs/reactor";
import type { Song } from "../api/Songs";
import { PlayerControls } from "./PlayerControls";
import { SongList } from "./MusicView/SongList";

export const musicView = () => {
	const audio = new Audio();
	const songs = reactor<{ Name: string; Id: string }[]>([]);
	getSongs().then((response) => {
		songs.value = response.Items;
	});

	return FlexColumn(
		{ className: "p-0 flex-1 overflow-auto" },
		SongList({ songs }),
		PlayerControls()
	);
};
