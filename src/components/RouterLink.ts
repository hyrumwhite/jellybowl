import spicy from "@spicyjs/core";
import { go } from "@spicyjs/router";
export const RouterLink = (
	el: HTMLAnchorElement | "a" = "a",
	{ href }: { href?: string } = {}
) => {
	return spicy(el, {
		href: el === "a" ? href : el.href,
		click($event) {
			$event.preventDefault();
			const target = $event.target as HTMLAnchorElement;
			go({ path: target.href });
		},
	});
};
