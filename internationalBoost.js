class InternationalBoostSystem {
    constructor() {
        this.currencies = {
            ZAR: { symbol: 'R', rate: 1 },
            USD: { symbol: '$', rate: 0.053 },
            EUR: { symbol: '€', rate: 0.049 },
            GBP: { symbol: '£', rate: 0.042 },
            AUD: { symbol: 'A$', rate: 0.081 },
            NGN: { symbol: '₦', rate: 43.82 },
            KES: { symbol: 'KSh', rate: 7.12 },
            GHS: { symbol: 'GH₵', rate: 0.67 }
            // Add more currencies as needed
        };

        this.regions = {
            africa: {
                countries: {
                    'South Africa': {
                        currency: 'ZAR',
                        languages: ['English', 'Zulu', 'Xhosa', 'Afrikaans'],
                        baseMultiplier: 1.0,
                        cities: {
                            'Johannesburg': { multiplier: 1.5 },
                            'Cape Town': { multiplier: 1.4 },
                            'Durban': { multiplier: 1.3 }
                        }
                    },
                    'Nigeria': {
                        currency: 'NGN',
                        languages: ['English', 'Yoruba', 'Hausa', 'Igbo'],
                        baseMultiplier: 1.2,
                        cities: {
                            'Lagos': { multiplier: 1.6 },
                            'Abuja': { multiplier: 1.4 }
                        }
                    },
                    'Kenya': {
                        currency: 'KES',
                        languages: ['English', 'Swahili'],
                        baseMultiplier: 1.1,
                        cities: {
                            'Nairobi': { multiplier: 1.5 },
                            'Mombasa': { multiplier: 1.3 }
                        }
                    }
                }
            },
            europe: {
                countries: {
                    'United Kingdom': {
                        currency: 'GBP',
                        languages: ['English'],
                        baseMultiplier: 2.5,
                        cities: {
                            'London': { multiplier: 3.0 },
                            'Manchester': { multiplier: 2.0 }
                        }
                    },
                    'France': {
                        currency: 'EUR',
                        languages: ['French'],
                        baseMultiplier: 2.3,
                        cities: {
                            'Paris': { multiplier: 2.8 },
                            'Lyon': { multiplier: 1.9 }
                        }
                    }
                }
            },
            // Add more regions
        };

        this.languageMultipliers = {
            primary: 1.0,    // Main language of the country
            secondary: 1.2,   // Additional official languages
            international: 1.5 // International language targeting
        };

        this.eventTypes = {
            local: { multiplier: 1.0 },
            regional: { multiplier: 1.5 },
            international: { multiplier: 2.0 }
        };
    }

    calculateInternationalPrice(selections) {
        const basePriceZAR = this.calculateBasePrice(selections);
        const targetCurrency = selections.currency || 'ZAR';
        const convertedPrice = this.convertCurrency(basePriceZAR, targetCurrency);

        return {
            basePrice: basePriceZAR,
            convertedPrice: convertedPrice,
            currency: targetCurrency,
            breakdown: this.getPriceBreakdown(selections, targetCurrency)
        };
    }

    convertCurrency(amount, targetCurrency) {
        const rate = this.currencies[targetCurrency].rate;
        return (amount * rate).toFixed(2);
    }

    formatPrice(amount, currency) {
        const currencyInfo = this.currencies[currency];
        return `${currencyInfo.symbol}${amount}`;
    }

    calculateRegionalReach(selections) {
        let reach = 0;
        const region = this.regions[selections.region];
        const country = region.countries[selections.country];

        // Calculate base reach for the region
        reach = this.getBaseReachForRegion(selections.region);

        // Apply country-specific multipliers
        reach *= country.baseMultiplier;

        // Apply city multipliers if specified
        if (selections.city) {
            reach *= country.cities[selections.city].multiplier;
        }

        // Apply language targeting
        if (selections.languages) {
            reach *= this.calculateLanguageReachMultiplier(selections.languages, country.languages);
        }

        return Math.round(reach);
    }

    getPriceBreakdown(selections, targetCurrency) {
        const breakdown = {
            base: this.calculateBasePrice(selections),
            regional: this.calculateRegionalMultiplier(selections),
            language: this.calculateLanguageMultiplier(selections),
            reach: this.calculateReachMultiplier(selections),
            currency: targetCurrency
        };

        return {
            ...breakdown,
            total: this.convertCurrency(
                Object.values(breakdown).reduce((a, b) => a * b, 1),
                targetCurrency
            )
        };
    }
} 