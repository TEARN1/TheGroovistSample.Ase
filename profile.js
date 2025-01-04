class ProfileManager {
    constructor() {
        this.currentUser = LocalStorage.getCurrentUser();
        this.initializeProfile();
    }

    initializeProfile() {
        this.renderProfile();
        this.bindProfileEvents();
    }

    renderProfile() {
        const profileSection = document.querySelector('.right-sidebar');
        if (!this.currentUser) return;

        profileSection.innerHTML = `
            <div class="profile-section">
                <div class="profile-cover">
                    <img src="${this.currentUser.coverPhoto || 'default-cover.jpg'}" alt="Cover">
                    <button class="edit-cover"><i class="fas fa-camera"></i></button>
                </div>
                
                <div class="profile-header">
                    <div class="profile-avatar-container">
                        <img src="${this.currentUser.avatar || 'default-avatar.jpg'}" alt="Profile" class="profile-avatar">
                        <button class="edit-avatar"><i class="fas fa-camera"></i></button>
                    </div>
                    
                    <div class="profile-info">
                        <h3 class="profile-name">${this.currentUser.username}</h3>
                        <p class="profile-bio">${this.currentUser.bio || 'No bio yet'}</p>
                        <span class="profile-status">${this.currentUser.status || 'Online'}</span>
                    </div>
                </div>

                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-value">${this.getUserPosts().length}</span>
                        <span class="stat-label">Posts</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.currentUser.savedEvents.length}</span>
                        <span class="stat-label">Saved</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.getUserEvents().length}</span>
                        <span class="stat-label">Events</span>
                    </div>
                </div>

                <div class="profile-actions">
                    <button onclick="profileManager.editProfile()" class="edit-profile-btn">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                    <button onclick="profileManager.viewSavedEvents()" class="saved-events-btn">
                        <i class="fas fa-bookmark"></i> Saved Events
                    </button>
                    <button onclick="profileManager.viewMyEvents()" class="my-events-btn">
                        <i class="fas fa-calendar"></i> My Events
                    </button>
                </div>

                <div class="profile-tabs">
                    <button class="tab-btn active" data-tab="posts">Posts</button>
                    <button class="tab-btn" data-tab="about">About</button>
                    <button class="tab-btn" data-tab="photos">Photos</button>
                </div>

                <div class="profile-content">
                    <!-- Content will be dynamically loaded based on selected tab -->
                </div>
            </div>
        `;
    }

    // ... more profile methods
} 