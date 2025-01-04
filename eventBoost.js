class EventBoostSystem {
    constructor() {
        this.basePrice = 10; // Base price R10
        this.boostOptions = {
            demographics: {
                age: {
                    price: 5, // Price per age range
                    ranges: ['13-17', '18-24', '25-34', '35-44', '45-54', '55+']
                },
                gender: {
                    price: 3,
                    options: ['Male', 'Female', 'Other']
                },
                language: {
                    price: 2,
                    options: ['English', 'Zulu', 'Xhosa', 'Afrikaans', 'Sotho', 'Tswana']
                }
            },
            location: {
                radius: {
                    '10km': 10,
                    '25km': 20,
                    '50km': 35,
                    '100km': 60,
                    'Province': 100,
                    'National': 200,
                    'Continental': 500,
                    'Global': 1000
                },
                specific: {
                    price: 15, // Price per specific location
                    types: ['City', 'Township', 'Suburb', 'District']
                }
            },
            interests: {
                price: 8, // Price per interest category
                categories: [
                    'Technology', 'Law', 'Medicine', 'Arts', 'Sports',
                    'Music', 'Education', 'Business', 'Fashion', 'Food'
                ]
            },
            reach: {
                pricePerThousand: 5 // R5 per 1000 people
            }
        };
    }

    renderBoostInterface(eventId) {
        const modal = document.createElement('div');
        modal.className = 'boost-modal';
        modal.innerHTML = `
            <div class="boost-container">
                <h2>Boost Your Event</h2>
                <div class="boost-options">
                    <div class="boost-section">
                        <h3>Target Demographics</h3>
                        <div class="option-group">
                            <label>Age Groups</label>
                            ${this.boostOptions.demographics.age.ranges.map(range => `
                                <div class="checkbox-item">
                                    <input type="checkbox" name="age" value="${range}">
                                    <span>${range}</span>
                                    <span class="price">+R${this.boostOptions.demographics.age.price}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="option-group">
                            <label>Gender</label>
                            ${this.boostOptions.demographics.gender.options.map(gender => `
                                <div class="checkbox-item">
                                    <input type="checkbox" name="gender" value="${gender}">
                                    <span>${gender}</span>
                                    <span class="price">+R${this.boostOptions.demographics.gender.price}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="option-group">
                            <label>Languages</label>
                            ${this.boostOptions.demographics.language.options.map(lang => `
                                <div class="checkbox-item">
                                    <input type="checkbox" name="language" value="${lang}">
                                    <span>${lang}</span>
                                    <span class="price">+R${this.boostOptions.demographics.language.price}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="boost-section">
                        <h3>Location Targeting</h3>
                        <div class="option-group">
                            <label>Radius</label>
                            <select name="radius" onchange="boostSystem.updatePrice()">
                                <option value="">Select radius</option>
                                ${Object.entries(this.boostOptions.location.radius).map(([range, price]) => `
                                    <option value="${range}">
                                        ${range} (R${price})
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="option-group">
                            <label>Specific Locations</label>
                            <div class="location-input">
                                <input type="text" placeholder="Enter location">
                                <button onclick="boostSystem.addLocation(this)">Add</button>
                            </div>
                            <div class="selected-locations"></div>
                        </div>
                    </div>

                    <div class="boost-section">
                        <h3>Interest Targeting</h3>
                        <div class="option-group">
                            ${this.boostOptions.interests.categories.map(interest => `
                                <div class="checkbox-item">
                                    <input type="checkbox" name="interest" value="${interest}">
                                    <span>${interest}</span>
                                    <span class="price">+R${this.boostOptions.interests.price}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="boost-section">
                        <h3>Reach Estimate</h3>
                        <div class="reach-slider">
                            <input type="range" min="1000" max="100000" step="1000" 
                                   onchange="boostSystem.updateReachEstimate(this.value)">
                            <div class="reach-info">
                                <span class="reach-number">1,000 people</span>
                                <span class="reach-price">R${this.boostOptions.reach.pricePerThousand}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="boost-summary">
                    <div class="total-price">
                        <span>Total: R</span>
                        <span id="boostTotal">${this.basePrice}</span>
                    </div>
                    <button onclick="boostSystem.processBoost(${eventId})" class="boost-button">
                        Boost Event
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.bindBoostEvents();
    }

    calculateBoostPrice() {
        let total = this.basePrice;
        
        // Add demographics costs
        const selectedAges = document.querySelectorAll('input[name="age"]:checked').length;
        total += selectedAges * this.boostOptions.demographics.age.price;

        const selectedGenders = document.querySelectorAll('input[name="gender"]:checked').length;
        total += selectedGenders * this.boostOptions.demographics.gender.price;

        const selectedLanguages = document.querySelectorAll('input[name="language"]:checked').length;
        total += selectedLanguages * this.boostOptions.demographics.language.price;

        // Add location costs
        const radius = document.querySelector('select[name="radius"]').value;
        if (radius) {
            total += this.boostOptions.location.radius[radius];
        }

        const selectedLocations = document.querySelectorAll('.selected-locations .location-tag').length;
        total += selectedLocations * this.boostOptions.location.specific.price;

        // Add interests costs
        const selectedInterests = document.querySelectorAll('input[name="interest"]:checked').length;
        total += selectedInterests * this.boostOptions.interests.price;

        // Add reach costs
        const reachValue = parseInt(document.querySelector('.reach-slider input').value);
        total += Math.floor(reachValue / 1000) * this.boostOptions.reach.pricePerThousand;

        return total;
    }

    updatePrice() {
        const total = this.calculateBoostPrice();
        document.getElementById('boostTotal').textContent = total;
    }

    processBoost(eventId) {
        const boostData = {
            eventId,
            demographics: {
                age: Array.from(document.querySelectorAll('input[name="age"]:checked')).map(cb => cb.value),
                gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(cb => cb.value),
                language: Array.from(document.querySelectorAll('input[name="language"]:checked')).map(cb => cb.value)
            },
            location: {
                radius: document.querySelector('select[name="radius"]').value,
                specific: Array.from(document.querySelectorAll('.location-tag')).map(tag => tag.textContent)
            },
            interests: Array.from(document.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value),
            reach: parseInt(document.querySelector('.reach-slider input').value),
            totalPrice: this.calculateBoostPrice()
        };

        // Process payment and save boost data
        this.saveBoostData(boostData);
    }
} 