class AdSystem {
    constructor() {
        this.adSpots = {
            sidebar: {
                price: 49.99,
                duration: '7 days',
                position: 'right-sidebar',
                size: '300x600'
            },
            featured: {
                price: 99.99,
                duration: '7 days',
                position: 'top-banner',
                size: '728x90'
            },
            eventList: {
                price: 29.99,
                duration: '3 days',
                position: 'in-feed',
                size: '468x60'
            }
        };
        this.initializeAds();
    }

    initializeAds() {
        this.renderAdSpots();
        this.loadActiveAds();
    }

    renderAdSpots() {
        // Sidebar Ad Spot
        const sidebarAd = document.createElement('div');
        sidebarAd.className = 'ad-container sidebar-ad';
        sidebarAd.innerHTML = `
            <div class="ad-placeholder">
                <span>Advertisement</span>
                <a href="#" class="place-ad-btn">Place Ad Here</a>
            </div>
        `;
        document.querySelector('.right-sidebar').appendChild(sidebarAd);

        // Featured Ad Spot
        const featuredAd = document.createElement('div');
        featuredAd.className = 'ad-container featured-ad';
        featuredAd.innerHTML = `
            <div class="ad-placeholder">
                <span>Featured Advertisement</span>
                <a href="#" class="place-ad-btn">Place Ad Here</a>
            </div>
        `;
        document.querySelector('.main-content').prepend(featuredAd);
    }

    showAdPurchaseModal(adType) {
        const adDetails = this.adSpots[adType];
        const modal = document.createElement('div');
        modal.className = 'ad-purchase-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Purchase Advertisement Spot</h2>
                <div class="ad-details">
                    <p><strong>Position:</strong> ${adDetails.position}</p>
                    <p><strong>Size:</strong> ${adDetails.size}</p>
                    <p><strong>Duration:</strong> ${adDetails.duration}</p>
                    <p><strong>Price:</strong> $${adDetails.price}</p>
                </div>
                <form id="adPurchaseForm">
                    <div class="form-group">
                        <label>Ad Image/Banner</label>
                        <input type="file" accept="image/*" required>
                    </div>
                    <div class="form-group">
                        <label>Target URL</label>
                        <input type="url" required placeholder="https://...">
                    </div>
                    <div class="form-group">
                        <label>Business Name</label>
                        <input type="text" required>
                    </div>
                    <button type="submit">Purchase Ad Space</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async purchaseAd(adType, adData) {
        const ad = {
            id: Date.now(),
            type: adType,
            ...adData,
            startDate: new Date(),
            endDate: this.calculateEndDate(adType),
            status: 'active'
        };

        // Save ad to storage
        await this.saveAd(ad);
        this.displayAd(ad);
    }

    calculateEndDate(adType) {
        const duration = this.adSpots[adType].duration;
        const days = parseInt(duration);
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    displayAd(ad) {
        const adContainer = document.querySelector(`.${ad.type}-ad`);
        adContainer.innerHTML = `
            <div class="active-ad">
                <a href="${ad.targetUrl}" target="_blank">
                    <img src="${ad.imageUrl}" alt="${ad.businessName} Advertisement">
                </a>
            </div>
        `;
    }
} 