class AdvancedBoostSystem {
    constructor() {
        this.basePrice = 10;
        this.targetingMultipliers = {
            precision: 1.5,  // More specific targeting costs more
            overlap: 0.8,    // Discount for multiple selections
            seasonal: 1.2    // Peak season multiplier
        };

        this.demographicPricing = {
            age: {
                ranges: {
                    '13-17': { price: 5, multiplier: 1.2 },  // Higher for teen targeting
                    '18-24': { price: 8, multiplier: 1.5 },  // Premium youth demographic
                    '25-34': { price: 7, multiplier: 1.3 },
                    '35-44': { price: 6, multiplier: 1.2 },
                    '45-54': { price: 5, multiplier: 1.1 },
                    '55+': { price: 4, multiplier: 1.0 }
                }
            },
            income: {
                ranges: {
                    'Low': { price: 3, multiplier: 0.8 },
                    'Medium': { price: 5, multiplier: 1.0 },
                    'High': { price: 8, multiplier: 1.5 },
                    'Luxury': { price: 12, multiplier: 2.0 }
                }
            },
            education: {
                levels: {
                    'High School': { price: 3, multiplier: 0.9 },
                    'College': { price: 5, multiplier: 1.2 },
                    'University': { price: 7, multiplier: 1.4 },
                    'Postgraduate': { price: 9, multiplier: 1.6 }
                }
            }
        };

        this.locationPricing = {
            radius: {
                '5km': { price: 5, density: 'high' },
                '10km': { price: 10, density: 'high' },
                '25km': { price: 20, density: 'medium' },
                '50km': { price: 35, density: 'medium' },
                '100km': { price: 60, density: 'low' },
                'Province': { price: 100, density: 'varied' },
                'National': { price: 200, density: 'varied' },
                'Continental': { price: 500, density: 'varied' },
                'Global': { price: 1000, density: 'varied' }
            },
            specific: {
                types: {
                    'Township': { basePrice: 15, densityMultiplier: 1.2 },
                    'Suburb': { basePrice: 20, densityMultiplier: 1.3 },
                    'CBD': { basePrice: 25, densityMultiplier: 1.5 },
                    'Mall': { basePrice: 30, densityMultiplier: 1.6 },
                    'University': { basePrice: 35, densityMultiplier: 1.4 }
                }
            },
            premium: {
                'Sandton': 1.8,
                'Rosebank': 1.6,
                'Midrand': 1.4,
                'Pretoria East': 1.5,
                'Cape Town CBD': 1.7
            }
        };

        this.interestPricing = {
            categories: {
                'Technology': { price: 10, engagement: 'high' },
                'Law': { price: 12, engagement: 'medium' },
                'Medicine': { price: 11, engagement: 'high' },
                'Arts': { price: 8, engagement: 'medium' },
                'Sports': { price: 9, engagement: 'high' },
                'Education': { price: 7, engagement: 'medium' },
                'Business': { price: 11, engagement: 'high' },
                'Entertainment': { price: 10, engagement: 'high' }
            },
            combinations: {
                'Tech+Business': 1.8,
                'Law+Business': 1.7,
                'Arts+Entertainment': 1.5
            }
        };

        this.timingMultipliers = {
            weekday: 1.0,
            weekend: 1.3,
            holiday: 1.5,
            peakHours: 1.2
        };
    }

    calculateDetailedPrice(selections) {
        let totalPrice = this.basePrice;
        let multiplier = 1.0;

        // Calculate demographic costs
        if (selections.demographics) {
            totalPrice += this.calculateDemographicCost(selections.demographics);
        }

        // Calculate location costs
        if (selections.location) {
            const locationCost = this.calculateLocationCost(selections.location);
            totalPrice += locationCost.cost;
            multiplier *= locationCost.multiplier;
        }

        // Calculate interest targeting costs
        if (selections.interests) {
            const interestCost = this.calculateInterestCost(selections.interests);
            totalPrice += interestCost.cost;
            multiplier *= interestCost.multiplier;
        }

        // Apply timing multipliers
        totalPrice *= this.getTimingMultiplier(selections.timing);

        // Apply precision multiplier for specific targeting
        if (this.isPreciseTargeting(selections)) {
            multiplier *= this.targetingMultipliers.precision;
        }

        // Apply seasonal multiplier if applicable
        if (this.isSeasonalEvent(selections.timing)) {
            multiplier *= this.targetingMultipliers.seasonal;
        }

        return {
            basePrice: totalPrice,
            finalPrice: totalPrice * multiplier,
            multiplier: multiplier,
            breakdown: {
                demographics: this.calculateDemographicCost(selections.demographics),
                location: this.calculateLocationCost(selections.location),
                interests: this.calculateInterestCost(selections.interests),
                timing: this.getTimingMultiplier(selections.timing)
            }
        };
    }

    calculateDemographicCost(demographics) {
        let cost = 0;
        let selectedCount = 0;

        // Age ranges
        if (demographics.age) {
            demographics.age.forEach(age => {
                const ageData = this.demographicPricing.age.ranges[age];
                cost += ageData.price * ageData.multiplier;
                selectedCount++;
            });
        }

        // Income levels
        if (demographics.income) {
            const incomeData = this.demographicPricing.income.ranges[demographics.income];
            cost += incomeData.price * incomeData.multiplier;
            selectedCount++;
        }

        // Education levels
        if (demographics.education) {
            const educationData = this.demographicPricing.education.levels[demographics.education];
            cost += educationData.price * educationData.multiplier;
            selectedCount++;
        }

        // Apply overlap discount if multiple demographics are selected
        if (selectedCount > 1) {
            cost *= Math.pow(this.targetingMultipliers.overlap, selectedCount - 1);
        }

        return cost;
    }

    // ... (more calculation methods)

    estimateReach(selections) {
        // Complex reach estimation algorithm
        let baseReach = this.calculateBaseReach(selections.location);
        let multiplier = 1.0;

        // Apply demographic filters
        if (selections.demographics) {
            multiplier *= this.calculateDemographicReachMultiplier(selections.demographics);
        }

        // Apply interest targeting
        if (selections.interests) {
            multiplier *= this.calculateInterestReachMultiplier(selections.interests);
        }

        // Apply time-based factors
        multiplier *= this.calculateTimingReachMultiplier(selections.timing);

        return Math.round(baseReach * multiplier);
    }
} 