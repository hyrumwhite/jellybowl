import spicy from "@spicyjs/core";
import { reactor } from "@spicyjs/reactor";
import { getStreamURL, Song } from "../api/Songs";
const { div, button, input } = spicy;

const audio = new Audio();
window.audio = audio;
export const currentSong = reactor<Song | null>(null);
const setTimestamp = (time: number) => (audio.currentTime = time);
export const setCurrentSong = (song: Song) => {
	currentSong.value = song;
	const id = song.Id;
	if (audio.src.includes(id)) {
		audio.paused ? audio.play() : audio.pause();
	} else {
		audio.src = getStreamURL(id);
		audio.play();
	}
};
const audioMetadata = reactor({
	duration: 1000 * 60,
	timestamp: 0,
});
audio.addEventListener("timeupdate", ($event) => {
	audioMetadata.value.timestamp = audio.currentTime;
});
audio.addEventListener("canplaythrough", ($event) => {
	audioMetadata.value.duration = audio.duration;
});
const currentTime = reactor(() =>
	Math.ceil(
		(audioMetadata.value.timestamp / audioMetadata.value.duration) * 100
	)
);

const trackControl = audioMetadata(
	input({
		type: "range",
		value: "0",
		input($event) {
			const newTime = ($event.target.value / 100) * audioMetadata.raw.duration;
			setTimestamp(newTime);
		},
	}),
	(input) => (input.value = currentTime.value)
);
export const PlayerControls = () => {
	return div(
		{ className: "flex flex-col sticky bottom-0 bg-[--surface-850]" },
		trackControl,
		div(
			{ className: "flex justify-center gap-3" },
			button("pre"),
			button("play"),
			button("next")
		)
	);
};
