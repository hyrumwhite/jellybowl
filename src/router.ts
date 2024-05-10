import {
	afterEach,
	beforeEach,
	createRouter,
	getCurrentRoute,
	go,
} from "@spicyjs/router";
// import { defaultView } from "./components/default";
import { musicView } from "./components/music";
import { moviesView } from "./components/movies";
import { setupView } from "./components/setup";
import { SERVER_URL } from "./constants/localstorage";
import { routeNames } from "./constants/routes";
beforeEach(() => {
	if (
		localStorage.getItem(SERVER_URL) === null &&
		!location.pathname.includes("setup")
	) {
		go({ name: "setup" });
		return false;
	}
});
afterEach(() => {
	const route = getCurrentRoute();
	window.dispatchEvent(new CustomEvent("route-change", { detail: route }));
});
createRouter([
	{
		name: routeNames.movies,
		path: "/movies",
		handler() {
			return moviesView();
		},
	},
	{
		name: routeNames.setup,
		path: "/setup",
		handler() {
			return setupView();
		},
	},
	{
		name: routeNames.music,
		path: "/music",
		handler() {
			return musicView();
		},
	},
	{
		name: routeNames.catchall,
		path: "*",
		handler() {
			return musicView();
		},
	},
]);
