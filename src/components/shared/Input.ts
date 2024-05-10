import spicy from "@spicyjs/core";
import { reactor } from "@spicyjs/reactor";

const { "flex-column": FlexColumn, input } = spicy;

type Props = {
	id: string;
	placeholder?: string;
	label: string;
	model?: ReturnType<typeof reactor>;
	value?: string;
	onInput?: ($event: InputEvent) => void;
	required?: boolean;
};
export const Input = ({
	id,
	placeholder = "",
	label,
	model,
	value = "",
	onInput,
	required,
}: Props) => {
	let inputEl: HTMLInputElement | null = null;
	const component = FlexColumn(
		{ gap: "1" },
		spicy.label({ for: id }, label),
		(inputEl = input({
			class: "border border-[--surface-700] border-solid",
			id,
			placeholder,
			value: model?.value || value || "",
			required,
			input: ($event) => {
				const value = ($event.target as HTMLInputElement).value;
				if (model) {
					model.value = value;
				}
				onInput?.(value);
			},
		}))
	);
	model?.(() => {
		if (inputEl.value !== model.value) {
			inputEl.value = model.value;
		}
	});
	return component;
};
