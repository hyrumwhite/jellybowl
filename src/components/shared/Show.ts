import { reactor } from "@spicyjs/reactor";
type Props<T> = {
	when: () => boolean;
	fallback: HTMLElement;
};
export const Show = <T extends HTMLElement>(
	{ when, fallback }: Props<T>,
	element: T
) => {
	const comment = document.createComment("when-marker");
	const controller = reactor(when);
	const onChange = () => {
		if (!comment.isConnected) {
			return;
		}
		if (controller.value) {
			if (fallback && fallback.isConnected) {
				fallback.remove();
			}
			comment.parentElement?.insertBefore(element, comment);
		} else if (fallback) {
			if (element.isConnected) {
				element.remove();
			}
			comment.parentElement?.insertBefore(fallback, comment);
		} else {
			if (element.isConnected) {
				element.remove();
			}
		}
	};
	controller(onChange);
	setTimeout(onChange);
	return comment;
};
