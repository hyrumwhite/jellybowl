import { beforeEach, createRouter, getCurrentRoute, go } from "@spicyjs/router";
// import { defaultView } from "./components/default";
import { musicView } from "./components/music";
import { moviesView } from "./components/movies";
import { setupView } from "./components/setup";

beforeEach(() => {
	console.log(getCurrentRoute());
	if (
		localStorage.getItem("base-url") === null &&
		!location.pathname.includes("setup")
	) {
		go({ name: "setup" });
		return false;
	}
});
createRouter([
	{
		name: "movies",
		path: "/movies",
		handler() {
			return moviesView();
		},
	},
	{
		name: "setup",
		path: "/setup",
		handler() {
			return setupView();
		},
	},
	{
		name: "music",
		path: "*",
		handler() {
			return musicView();
		},
	},
]);
