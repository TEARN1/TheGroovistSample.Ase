class UserTypeManager {
    constructor() {
        this.userTypes = {
            personal: {
                features: ['Create Profile', 'Attend Events', 'Comment & Like', 'Save Events'],
                price: 'Free',
                limitations: {
                    eventsPerMonth: 2,
                    mediaStorage: '100MB'
                }
            },
            business: {
                basic: {
                    features: [
                        'Create Business Profile',
                        'Post 5 Events/month',
                        'Basic Analytics',
                        'Email Support'
                    ],
                    price: 29.99,
                    limitations: {
                        eventsPerMonth: 5,
                        mediaStorage: '1GB',
                        featuredEvents: 1
                    }
                },
                pro: {
                    features: [
                        'Unlimited Events',
                        'Advanced Analytics',
                        'Priority Support',
                        'Featured Events',
                        'Custom Branding'
                    ],
                    price: 99.99,
                    limitations: {
                        eventsPerMonth: 'Unlimited',
                        mediaStorage: '10GB',
                        featuredEvents: 5
                    }
                }
            }
        };
    }

    renderRegistrationForms() {
        return `
            <div class="registration-container">
                <div class="registration-tabs">
                    <button class="tab-btn active" data-tab="personal">Personal Account</button>
                    <button class="tab-btn" data-tab="business">Business Account</button>
                </div>

                <!-- Personal Registration -->
                <div class="registration-form personal active">
                    <h2>Create Personal Account</h2>
                    <form id="personalRegForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" name="password" required>
                        </div>
                        <button type="submit">Create Free Account</button>
                    </form>
                </div>

                <!-- Business Registration -->
                <div class="registration-form business">
                    <h2>Create Business Account</h2>
                    <div class="business-plans">
                        <div class="plan-card">
                            <h3>Basic</h3>
                            <p class="price">$29.99/month</p>
                            <ul class="features">
                                ${this.userTypes.business.basic.features.map(
                                    feature => `<li>${feature}</li>`
                                ).join('')}
                            </ul>
                            <button onclick="selectBusinessPlan('basic')">Choose Basic</button>
                        </div>
                        <div class="plan-card featured">
                            <h3>Pro</h3>
                            <p class="price">$99.99/month</p>
                            <ul class="features">
                                ${this.userTypes.business.pro.features.map(
                                    feature => `<li>${feature}</li>`
                                ).join('')}
                            </ul>
                            <button onclick="selectBusinessPlan('pro')">Choose Pro</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
} 