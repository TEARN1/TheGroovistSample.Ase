class InternationalBoostInterface {
    constructor(boostSystem) {
        this.boostSystem = boostSystem;
        this.translations = {
            en: {
                boost: 'Boost Event',
                reach: 'Estimated Reach',
                price: 'Price',
                currency: 'Currency',
                region: 'Region',
                country: 'Country',
                city: 'City',
                language: 'Language',
                confirm: 'Confirm Boost'
            },
            fr: {
                boost: 'Booster l\'événement',
                reach: 'Portée estimée',
                price: 'Prix',
                currency: 'Devise',
                region: 'Région',
                country: 'Pays',
                city: 'Ville',
                language: 'Langue',
                confirm: 'Confirmer le boost'
            },
            // Add more languages
        };
    }

    renderInternationalInterface(language = 'en') {
        const t = this.translations[language];
        return `
            <div class="international-boost-container">
                <h2>${t.boost}</h2>
                
                <div class="region-selector">
                    <label>${t.region}</label>
                    <select name="region" onchange="updateCountries(this.value)">
                        ${this.renderRegionOptions()}
                    </select>
                </div>

                <div class="country-selector">
                    <label>${t.country}</label>
                    <select name="country" onchange="updateCities(this.value)">
                        <!-- Dynamically populated -->
                    </select>
                </div>

                <div class="city-selector">
                    <label>${t.city}</label>
                    <select name="city">
                        <!-- Dynamically populated -->
                    </select>
                </div>

                <div class="language-selector">
                    <label>${t.language}</label>
                    <div class="language-options">
                        <!-- Dynamically populated -->
                    </div>
                </div>

                <div class="currency-selector">
                    <label>${t.currency}</label>
                    <select name="currency" onchange="updatePrice()">
                        ${this.renderCurrencyOptions()}
                    </select>
                </div>

                <div class="boost-summary">
                    <div class="reach-estimate">
                        <h3>${t.reach}</h3>
                        <div class="reach-number">0</div>
                    </div>
                    
                    <div class="price-display">
                        <h3>${t.price}</h3>
                        <div class="price-amount">0</div>
                    </div>
                </div>

                <button class="boost-confirm-btn">${t.confirm}</button>
            </div>
        `;
    }

    // Helper methods for rendering options and updating UI
    renderRegionOptions() {
        // Implementation
    }

    renderCurrencyOptions() {
        // Implementation
    }

    updateCountries(region) {
        // Implementation
    }

    updateCities(country) {
        // Implementation
    }

    updatePrice() {
        // Implementation
    }
} 