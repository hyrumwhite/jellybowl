import { reactor } from "@spicyjs/reactor";

export const routeCleanup = (
	route: string,
	reactors: ReturnType<typeof reactor>[],
	cleanup?: () => void
) => {
	const handleRouteChange = ($event: CustomEvent) => {
		if ($event.detail.name !== route) {
			window.removeEventListener("route-change", handleRouteChange);
			cleanup?.();
			for (const reactor of reactors) {
				reactor.destroy();
			}
		}
	};
	window.addEventListener("route-change", handleRouteChange);
};
