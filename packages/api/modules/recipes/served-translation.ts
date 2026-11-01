/**
 * Translation to show when opening a recipe.
 * The requested locale wins. Otherwise the original language (the earliest
 * stored translation), then any other stored translation.
 * Viewing a fallback does not generate a translation and does not cost a credit.
 */
export function pickServedTranslation<
	T extends { locale: string; createdAt?: Date },
>(translations: readonly T[], requestedLocale: string): T | null {
	const exact = translations.find((item) => item.locale === requestedLocale);
	if (exact) {
		return exact;
	}
	if (translations.length === 0) {
		return null;
	}

	return [...translations].sort(byOriginalLanguage)[0] ?? null;
}

function byOriginalLanguage(
	a: { locale: string; createdAt?: Date },
	b: { locale: string; createdAt?: Date },
) {
	const aTime = a.createdAt?.getTime() ?? Number.POSITIVE_INFINITY;
	const bTime = b.createdAt?.getTime() ?? Number.POSITIVE_INFINITY;
	if (aTime !== bTime) {
		return aTime - bTime;
	}
	return a.locale.localeCompare(b.locale);
}
