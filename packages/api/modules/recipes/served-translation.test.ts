import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pickServedTranslation } from "./served-translation";

const german = {
	locale: "de",
	createdAt: new Date("2024-03-01T00:00:00Z"),
	title: "Nudeln",
};
const english = {
	locale: "en",
	createdAt: new Date("2024-06-01T00:00:00Z"),
	title: "Pasta",
};

describe("pickServedTranslation", () => {
	it("serves a German-only recipe on the English route", () => {
		const served = pickServedTranslation([german], "en");
		assert.ok(served);
		assert.equal(served.locale, "de");
		assert.equal(served.title, "Nudeln");
	});

	it("keeps the requested language when that translation exists", () => {
		const served = pickServedTranslation([german, english], "en");
		assert.equal(served?.locale, "en");
		assert.equal(served?.title, "Pasta");
	});

	it("prefers the original language over a later translation", () => {
		const served = pickServedTranslation([english, german], "fr");
		assert.equal(served?.locale, "de");
	});

	it("still serves a translation when the original time is unknown", () => {
		const served = pickServedTranslation(
			[
				{ locale: "en", title: "Pasta" },
				{ locale: "de", title: "Nudeln" },
			],
			"fr",
		);
		assert.equal(served?.locale, "de");
	});

	it("returns null only when the recipe has no translation", () => {
		assert.equal(pickServedTranslation([], "en"), null);
	});
});
