import spicy from "@spicyjs/core";
const { ul, li, button } = spicy;
import { reactor } from "@spicyjs/reactor";
import { Song } from "../../api/Songs";
import { setCurrentSong } from "../PlayerControls";

type SongListProps = { songs: typeof reactor<Song[]> };
export const SongList = (props: SongListProps) => {
	const handleClick = ($event) => {
		const target = $event.target as HTMLButtonElement;
		const songContainer = target.closest(`[data-id]`);
		if (!songContainer) {
			return;
		}
		const id = songContainer.getAttribute("data-id");
		const song = props.songs.raw.find((item) => item.Id === id);
		setCurrentSong(song);
	};
	return props.songs(
		ul({
			className: "flex-1 overflow-auto min-h-0",
			click: handleClick,
		}),
		(list) => {
			const items = props.songs.raw.map((item) =>
				li(button(item.Name), { "data-id": item.Id })
			);
			list.replaceChildren(...items);
		}
	);
};
