import spicy from "@spicyjs/core";
import { reactor } from "@spicyjs/reactor";
import { getStreamURL, Song } from "../api/Songs";
const { div, button, input, audio: Audio } = spicy;

export const currentSong = reactor<Song | null>(null);
const setTimestamp = (time: number) => {
	audioEl.currentTime = time;
};
window.setTimestamp = setTimestamp;
let audioEl: HTMLAudioElement;
export const setCurrentSong = (song: Song) => {
	currentSong.value = song;
	const id = song.Id;
	if (audioEl.src.includes(id)) {
		audioEl.paused ? audioEl.play() : audioEl.pause();
	} else {
		audioEl.src = getStreamURL(id);
		audioEl.play();
	}
};
const audioMetadata = reactor({
	duration: 1000 * 60,
	timestamp: 0,
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
	(input) => {
		input.value = currentTime.value;
	}
);
export const PlayerControls = () => {
	const isPlaying = reactor(false);
	return div(
		{ className: "flex flex-col bg-[--surface-850]" },
		trackControl,
		div(
			{ className: "flex justify-center gap-3" },
			button("pre"),
			isPlaying(
				button("Play", {
					click($event) {
						setCurrentSong(currentSong.value);
					},
				}),
				(button) => (button.textContent = isPlaying.value ? "Pause" : "Play")
			),
			button("next")
		),
		(audioEl = Audio({
			play: () => (isPlaying.value = true),
			pause: () => (isPlaying.value = false),
			timeupdate($event) {
				audioMetadata.value.timestamp = audioEl.currentTime;
			},
			canplaythrough($event) {
				audioMetadata.value.duration = audioEl.duration;
			},
		}))
	);
};
