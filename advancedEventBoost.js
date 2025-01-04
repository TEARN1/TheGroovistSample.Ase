class PrecisionBoostSystem {
    constructor() {
        this.basePrice = 10;
        this.precisionMetrics = {
            // Demographic Precision Metrics
            demographics: {
                age: {
                    ranges: {
                        '13-17': { basePrice: 5, engagementRate: 0.8, peakHours: ['14:00-20:00'] },
                        '18-24': { basePrice: 8, engagementRate: 0.9, peakHours: ['12:00-23:00'] },
                        '25-34': { basePrice: 7, engagementRate: 0.85, peakHours: ['07:00-22:00'] },
                        '35-44': { basePrice: 6, engagementRate: 0.75, peakHours: ['06:00-21:00'] },
                        '45-54': { basePrice: 5, engagementRate: 0.7, peakHours: ['06:00-20:00'] },
                        '55+': { basePrice: 4, engagementRate: 0.6, peakHours: ['07:00-19:00'] }
                    },
                    multipliers: {
                        student: 1.2,
                        professional: 1.5,
                        retired: 0.8
                    }
                },
                interests: {
                    categories: {
                        technology: {
                            subInterests: ['Programming', 'Gaming', 'AI', 'Cybersecurity'],
                            priceMultiplier: 1.3,
                            engagementRate: 0.9
                        },
                        business: {
                            subInterests: ['Entrepreneurship', 'Marketing', 'Finance', 'Management'],
                            priceMultiplier: 1.4,
                            engagementRate: 0.85
                        },
                        // ... more categories
                    }
                }
            },

            // Location Intelligence
            location: {
                provinces: {
                    'Gauteng': {
                        density: 'high',
                        baseMultiplier: 1.5,
                        cities: {
                            'Johannesburg': {
                                areas: {
                                    'Sandton': { multiplier: 2.0, affluence: 'high' },
                                    'Rosebank': { multiplier: 1.8, affluence: 'high' },
                                    'Soweto': { multiplier: 1.2, affluence: 'medium' }
                                }
                            },
                            'Pretoria': {
                                areas: {
                                    'Menlyn': { multiplier: 1.7, affluence: 'high' },
                                    'Centurion': { multiplier: 1.5, affluence: 'medium-high' }
                                }
                            }
                        }
                    },
                    // ... other provinces
                }
            },

            // Time-based Factors
            timing: {
                dayParts: {
                    'Morning': { multiplier: 0.8, hours: '06:00-11:59' },
                    'Afternoon': { multiplier: 1.0, hours: '12:00-16:59' },
                    'Evening': { multiplier: 1.3, hours: '17:00-22:59' },
                    'Night': { multiplier: 0.7, hours: '23:00-05:59' }
                },
                weekdays: {
                    'Monday': 0.9,
                    'Tuesday': 0.9,
                    'Wednesday': 1.0,
                    'Thursday': 1.1,
                    'Friday': 1.3,
                    'Saturday': 1.5,
                    'Sunday': 1.2
                },
                seasons: {
                    'Summer': 1.2,
                    'Winter': 0.9,
                    'Spring': 1.1,
                    'Autumn': 1.0
                }
            }
        };
    }

    calculatePreciseReach(selections) {
        let baseReach = 0;
        let multipliers = {
            demographic: 1,
            location: 1,
            timing: 1,
            interest: 1
        };

        // Calculate demographic reach
        if (selections.demographics) {
            const demoReach = this.calculateDemographicReach(selections.demographics);
            baseReach = demoReach.reach;
            multipliers.demographic = demoReach.multiplier;
        }

        // Calculate location-based reach
        if (selections.location) {
            const locReach = this.calculateLocationReach(selections.location);
            multipliers.location = locReach.multiplier;
            baseReach *= locReach.density;
        }

        // Apply timing factors
        if (selections.timing) {
            multipliers.timing = this.calculateTimingMultiplier(selections.timing);
        }

        // Apply interest targeting
        if (selections.interests) {
            multipliers.interest = this.calculateInterestMultiplier(selections.interests);
        }

        const totalMultiplier = Object.values(multipliers).reduce((a, b) => a * b, 1);
        return Math.round(baseReach * totalMultiplier);
    }

    calculateCost(selections, reach) {
        let baseCost = this.basePrice;
        let costMultipliers = {
            precision: this.calculatePrecisionMultiplier(selections),
            reach: this.calculateReachCostMultiplier(reach),
            targeting: this.calculateTargetingMultiplier(selections)
        };

        const totalMultiplier = Object.values(costMultipliers).reduce((a, b) => a * b, 1);
        return {
            baseCost: baseCost,
            finalCost: Math.round(baseCost * totalMultiplier),
            multipliers: costMultipliers,
            breakdown: this.generateCostBreakdown(selections, reach, baseCost, costMultipliers)
        };
    }

    generateCostBreakdown(selections, reach, baseCost, multipliers) {
        return {
            base: {
                amount: baseCost,
                description: 'Base boost cost'
            },
            precision: {
                multiplier: multipliers.precision,
                amount: baseCost * (multipliers.precision - 1),
                description: 'Precision targeting adjustment'
            },
            reach: {
                multiplier: multipliers.reach,
                amount: baseCost * (multipliers.reach - 1),
                description: 'Reach-based adjustment'
            },
            targeting: {
                multiplier: multipliers.targeting,
                amount: baseCost * (multipliers.targeting - 1),
                description: 'Targeting complexity adjustment'
            }
        };
    }

    // ... additional calculation methods
} 