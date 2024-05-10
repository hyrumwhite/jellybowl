import { reactor } from "@spicyjs/reactor";
import { createFetch } from "./ApiFetch";

type ResourceModel = ReturnType<
	typeof reactor<{ isLoading: boolean; data: unknown; error: unknown }>
>;

export class ApiResource {
	#fetch: ReturnType<typeof createFetch>;
	#data: unknown;
	#isLoading: boolean = false;
	#model: ResourceModel | undefined;
	constructor(private baseURL: string, private model?: ResourceModel) {
		this.#fetch = createFetch(baseURL);
	}
	async get<T>(query?: Record<string, string>) {
		this.#isLoading = true;
		this.#model && (this.#model.value.isLoading = true);
		try {
			this.#data = await this.#fetch.get<T>("", query);
			this.#model && (this.#model.value.data = true);
			return this.#data;
		} catch (e) {
			this.#model && (this.#model.value.error = e);
			throw e;
		} finally {
			this.#isLoading = false;
		}
	}
	post() {}
	get isLoading() {
		return this.#isLoading;
	}
}
