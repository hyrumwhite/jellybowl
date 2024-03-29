import spicy from "@spicyjs/core";

const { "flex-column": FlexColumn, input } = spicy;

type Props = {
	id: string;
	placeholder?: string;
	label: string;
	value?: string;
	onInput: ($event: InputEvent) => void;
};
export const Input = ({
	id,
	placeholder = "",
	label,
	value = "",
	onInput,
}: Props) =>
	FlexColumn(
		{ gap: "1" },
		spicy.label({ for: id }, label),
		input({
			class: "border border-[--surface-700] border-solid",
			id,
			placeholder,
			value,
			input: onInput,
		})
	);
