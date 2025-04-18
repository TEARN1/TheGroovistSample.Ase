// app.js - Comprehensive Frontend Simulation

document.addEventListener('DOMContentLoaded', () => {

    // --- State Simulation ---
    let isLoggedIn = false;
    let isGuest = false; // Track guest browsing state
    let currentUser = null; // Will hold mock user data when logged in

    // --- Mock Data ---
    const mockUsers = {
        "user@example.com": {
            id: "user1",
            fullName: "Demo User",
            email: "user@example.com",
            password: "password", // In real app, only hash is stored
            location: "Midrand",
            profilePicture: "default-profile.png",
            interests: ["Indie Rock", "Live Music", "Comedy", "Tech Meetups"],
            goals: ["Attend 5 concerts this year", "Learn basic sound engineering"],
            favArtists: ["The Strokes", "Bon Iver"],
            favGenres: ["Indie Rock", "Folk"],
            favVenues: ["The Basement Club", "City Park Stage"],
            hostedEvents: ["event1"], // IDs of events they host
            followers: 15, // Example follower count for job posting check
            notifications: ["Welcome to The Gruvist!", "Your profile is looking great!"]
        }
        // Add more mock users if needed
    };

    let mockEvents = [
        { id: 'event1', title: 'Awesome Indie Rock Night', dateTime: '2024-10-27T20:00', location: 'The Basement Club, Midrand', category: 'concert', description: 'Come join us for a night of great music featuring local indie bands. Great vibes guaranteed!', organizer: 'Demo User', contact: 'user@example.com', tickets: 'R50 at door', guests: 'Band A, Band B', wordOfDay: 'Groove', socialLink: '', media: ['event-image1.jpg'], userId: 'user1', goingCount: 15, comments: [{user: 'Alice', text: 'Sounds fun!'}, {user: 'Bob', text: 'Is there parking?'}], promoted: true },
        { id: 'event2', title: 'Open Mic Comedy', dateTime: '2024-10-28T19:30', location: 'Laugh Lounge, Sandton', category: 'comedy', description: 'Test your jokes or just come laugh!', organizer: 'Laugh Lounge', contact: 'info@laughlounge.co.za', tickets: 'Free entry', guests: '', wordOfDay: '', socialLink: '', media: [], userId: 'system', goingCount: 8, comments: [], promoted: false },
        { id: 'event3', title: 'Tech Meetup: Frontend Frameworks', dateTime: '2024-11-05T18:00', location: 'Innovation Hub, Pretoria', category: 'workshop', description: 'Discussing the latest in React, Vue, and Angular.', organizer: 'Tech Group Gauteng', contact: 'events@techgauteng.org', tickets: 'Free (RSVP required)', guests: 'Jane Doe (Expert)', wordOfDay: 'Component', socialLink: 'https://example.com/techgroup', media: [], userId: 'system', goingCount: 25, comments: [], promoted: false },
        { id: 'event4', title: 'Live Acoustic Session', dateTime: '2024-10-26T17:00', location: 'Online Stream', category: 'livestream', description: 'Chill acoustic vibes live from my studio.', organizer: 'Musician Mike', contact: '', tickets: 'Free', guests: '', wordOfDay: '', socialLink: '', media: [], userId: 'user2', goingCount: 50, comments: [], promoted: false, isLive: true } // Example Live event
    ];

    let mockJobs = [
        { id: 'job1', title: 'Frontend Developer Needed', company: 'Tech Solutions Inc.', description: 'Looking for a skilled frontend developer with React experience. Join our dynamic team!', contactEmail: 'hr@techsolutions.inc', userId: 'user1', timestamp: Date.now() - 86400000 },
        { id: 'job2', title: 'Barista at Cool Cafe', company: 'Cool Cafe Midrand', description: 'Part-time barista position available. Must love coffee!', contactEmail: 'manager@coolcafe.za', userId: 'system', timestamp: Date.now() - 172800000 }
    ];

    let mockVideos = [
        { id: 'video1', title: 'Festival Highlights 2023', description: 'Quick recap of the summer festival.', file: 'video1.mp4', preview: 'video1_thumb.jpg', userId: 'user1', uploaderName: 'Demo User', comments: [], timestamp: Date.now() - 259200000 },
        { id: 'video2', title: 'My Cat Being Silly', description: '', file: 'cat_video.mp4', preview: 'cat_thumb.jpg', userId: 'user2', uploaderName: 'Musician Mike', comments: [], timestamp: Date.now() - 345600000 }
    ];

    let mockPosts = [ // Generic posts if needed
        { id: 'post1', type: 'text', content: 'Just discovered this amazing new band playing locally next week!', userId: 'user1', userName: 'Demo User', timestamp: Date.now() - 3600000, comments: [] }
    ];

    // Combine feed items for easier sorting/filtering
    let combinedFeed = [];


    // --- Element Selectors ---
    // Modals
    const modals = {
        loginModal: document.getElementById('loginModal'),
        addEventModal: document.getElementById('addEventModal'),
        addJobModal: document.getElementById('addJobModal'),
        addVideoModal: document.getElementById('addVideoModal'),
        liveStudioModal: document.getElementById('liveStudioModal')
    };

    // Auth
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTabEl = document.getElementById('loginTab');
    const registerTabEl = document.getElementById('registerTab');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');

    // Navbar Buttons
    const navLoginRegisterBtn = document.getElementById('navLoginRegisterBtn');
    const navAddEventBtn = document.getElementById('navAddEventBtn');
    const navAddJobBtn = document.getElementById('navAddJobBtn');
    const navAddVideoBtn = document.getElementById('navAddVideoBtn');
    const navGoLiveBtn = document.getElementById('navGoLiveBtn');
    const navProfileBtn = document.getElementById('navProfileBtn');
    const navLogoutBtn = document.getElementById('navLogoutBtn');

    // Happenings Panel
    const eventsThisWeekList = document.getElementById('eventsThisWeekList');
    const eventsThisWeekEmpty = document.getElementById('eventsThisWeekEmpty');
    const eventsThisMonthList = document.getElementById('eventsThisMonthList');
    const eventsThisMonthEmpty = document.getElementById('eventsThisMonthEmpty');
    const eventsThisYearList = document.getElementById('eventsThisYearList');
    const eventsThisYearEmpty = document.getElementById('eventsThisYearEmpty');
    const liveNowList = document.getElementById('liveNowList');
    const liveNowEmpty = document.getElementById('liveNowEmpty');
    const featuredVideosList = document.getElementById('featuredVideosList');
    const featuredVideosEmpty = document.getElementById('featuredVideosEmpty');
    const happeningsSearch = document.getElementById('happeningsSearch');
    const happeningsFilterCategory = document.getElementById('happeningsFilterCategory');
    const happeningsSortBy = document.getElementById('happeningsSortBy');

    // Feed Area
    const feedArea = document.getElementById('feedArea');
    const feedLoadingIndicator = document.getElementById('feedLoadingIndicator');
    const feedEmptyState = document.getElementById('feedEmptyState');

    // Profile Panel
    const profilePicture = document.getElementById('profilePicture');
    const profileImageUpload = document.getElementById('profileImageUpload');
    const editProfilePictureBtn = document.getElementById('editProfilePictureBtn');
    const userNameDisplay = document.getElementById('userName');
    const userLocationDisplay = document.getElementById('userLocation');
    const contactInfoDisplay = document.getElementById('contactInfo');
    // Edit sections
    const interestsList = document.getElementById('interestsList');
    const editInterestsBtn = document.getElementById('editInterestsBtn');
    const editInterestsArea = document.getElementById('editInterestsArea');
    const interestsInput = document.getElementById('interestsInput');
    const saveInterestsBtn = document.getElementById('saveInterestsBtn');
    const goalsList = document.getElementById('goalsList');
    const editGoalsBtn = document.getElementById('editGoalsBtn');
    const editGoalsArea = document.getElementById('editGoalsArea');
    const goalsInput = document.getElementById('goalsInput');
    const saveGoalsBtn = document.getElementById('saveGoalsBtn');
    // New Edit Sections
    const favArtistsList = document.getElementById('favArtistsList');
    const editFavArtistsBtn = document.getElementById('editFavArtistsBtn');
    const editFavArtistsArea = document.getElementById('editFavArtistsArea');
    const favArtistsInput = document.getElementById('favArtistsInput');
    const saveFavArtistsBtn = document.getElementById('saveFavArtistsBtn');
    const favGenresList = document.getElementById('favGenresList');
    const editFavGenresBtn = document.getElementById('editFavGenresBtn');
    const editFavGenresArea = document.getElementById('editFavGenresArea');
    const favGenresInput = document.getElementById('favGenresInput');
    const saveFavGenresBtn = document.getElementById('saveFavGenresBtn');
    const favVenuesList = document.getElementById('favVenuesList');
    const editFavVenuesBtn = document.getElementById('editFavVenuesBtn');
    const editFavVenuesArea = document.getElementById('editFavVenuesArea');
    const favVenuesInput = document.getElementById('favVenuesInput');
    const saveFavVenuesBtn = document.getElementById('saveFavVenuesBtn');
    // Other Profile Lists
    const hostedEventsList = document.getElementById('hostedEventsList');
    const recommendedItemsList = document.getElementById('recommendedItemsList');
    const recommendedItemsEmpty = document.getElementById('recommendedItemsEmpty');
    const notificationsList = document.getElementById('notificationsList');
    const notificationsEmpty = document.getElementById('notificationsEmpty');
    // Profile Buttons
    const hostNewEventBtn = document.getElementById('hostNewEventBtn'); // Already linked via onclick
    const viewForumsBtn = document.getElementById('viewForumsBtn');
    const viewGroupsBtn = document.getElementById('viewGroupsBtn');

    // Add Event Form
    const addEventForm = document.getElementById('addEventForm');
    const eventMediaInput = document.getElementById('eventMedia');
    const eventMediaPreview = document.getElementById('mediaPreview');
    const publishEventButton = document.getElementById('publishEventButton');
    const promoteEventCheckbox = document.getElementById('promoteEventCheckbox');
    const paypalPlaceholder = document.getElementById('paypalPlaceholder');

    // Add Job Form
    const addJobForm = document.getElementById('addJobForm');
    const publishJobButton = document.getElementById('publishJobButton');

    // Add Video Form
    const addVideoForm = document.getElementById('addVideoForm');
    const videoFileInput = document.getElementById('videoFile');
    const videoPreview = document.getElementById('videoPreview');
    const publishVideoButton = document.getElementById('publishVideoButton');

    // Chat UI
    const chatToggleButton = document.getElementById('chat-toggle-button');
    const chatContainer = document.getElementById('chat-container');
    const chatInputForm = document.getElementById('chatInputForm');
    const chatMessageInput = document.getElementById('chatMessageInput');
    const chatMessagesArea = document.getElementById('chatMessagesArea');
    const chatReminder = document.getElementById('chatReminder');


    // --- Utility Functions ---

    // Simple function to format date/time (replace with a library like date-fns for complex needs)
    const formatDateTime = (isoString) => {
        if (!isoString) return 'Date TBD';
        try {
            const date = new Date(isoString);
            return date.toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });
        } catch (e) {
            return isoString; // Return original if parsing fails
        }
    };

    const timeAgo = (timestamp) => {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) return interval + " years ago";
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return interval + " months ago";
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return interval + " days ago";
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return interval + " hours ago";
        interval = Math.floor(seconds / 60);
        if (interval > 1) return interval + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    // Generic function to populate lists
    const populateList = (listElement, emptyElement, data, renderFunction) => {
        if (!listElement) return;
        listElement.innerHTML = ''; // Clear previous content / loading
        if (data && data.length > 0) {
            data.forEach(item => {
                const element = renderFunction(item);
                if (element) listElement.appendChild(element);
            });
            listElement.style.display = ''; // Show list
            if (emptyElement) emptyElement.style.display = 'none';
        } else {
            listElement.style.display = 'none'; // Hide list
            if (emptyElement) emptyElement.style.display = 'block'; // Show empty state
        }
    };

    // --- UI Update Functions ---

    const updateLoginStateUI = () => {
        const loggedIn = isLoggedIn && !isGuest;
        const canPostJobs = loggedIn && currentUser && currentUser.followers >= 10; // Example requirement

        // Navbar buttons
        navLoginRegisterBtn.style.display = loggedIn || isGuest ? 'none' : 'inline-block';
        navLogoutBtn.style.display = loggedIn ? 'inline-block' : 'none';
        navProfileBtn.style.display = loggedIn ? 'inline-block' : 'none';
        navAddEventBtn.style.display = loggedIn ? 'inline-block' : 'none';
        navAddJobBtn.style.display = canPostJobs ? 'inline-block' : 'none'; // Show only if follower count met
        navAddVideoBtn.style.display = loggedIn ? 'inline-block' : 'none';
        navGoLiveBtn.style.display = loggedIn ? 'inline-block' : 'none';

        // Profile Panel visibility and editability
        const profilePanel = document.querySelector('.profile-panel');
        if (profilePanel) profilePanel.style.display = loggedIn || isGuest ? '' : 'none'; // Show if guest or logged in

        editProfilePictureBtn.style.display = loggedIn ? 'block' : 'none';
        editInterestsBtn.style.display = loggedIn ? 'inline-block' : 'none';
        editGoalsBtn.style.display = loggedIn ? 'inline-block' : 'none';
        editFavArtistsBtn.style.display = loggedIn ? 'inline-block' : 'none';
        editFavGenresBtn.style.display = loggedIn ? 'inline-block' : 'none';
        editFavVenuesBtn.style.display = loggedIn ? 'inline-block' : 'none';
        hostNewEventBtn.style.display = loggedIn ? 'block' : 'none'; // Make it block if full-width

        // Hide edit areas if they were open
        if (!loggedIn) {
            [editInterestsArea, editGoalsArea, editFavArtistsArea, editFavGenresArea, editFavVenuesArea].forEach(area => {
                if (area) area.style.display = 'none';
            });
        }

        // Chat toggle button
        chatToggleButton.style.display = loggedIn ? 'block' : 'none';
        if (!loggedIn && chatContainer.classList.contains('visible')) {
            toggleChat(false); // Close chat if user logs out
        }

        // Load relevant data
        loadProfileData();
        loadHappenings(); // Happenings might differ slightly for guests vs logged in
        loadFeed(); // Feed content depends on login state
    };

    // --- Modal Handling ---
    window.openModal = (modalId) => {
        const modal = modals[modalId];
        if (modal) {
            // Check permissions for certain modals
            if (['addEventModal', 'addJobModal', 'addVideoModal', 'liveStudioModal'].includes(modalId) && !isLoggedIn) {
                alert("Please log in to access this feature.");
                openModal('loginModal'); // Redirect to login
                return;
            }
            if (modalId === 'addJobModal' && isLoggedIn && currentUser && currentUser.followers < 10) {
                 alert(`You need at least 10 followers to post a job (You have ${currentUser.followers}). Simulation.`);
                 return;
            }

            modal.style.display = 'flex';
        } else {
            console.error(`Modal with ID ${modalId} not found.`);
        }
    };

    window.closeModal = (modalId) => {
        const modal = modals[modalId];
        if (modal) {
            modal.style.display = 'none';
            // Optionally reset forms within the closed modal
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
                // Clear previews if any
                const previewArea = form.querySelector('.media-preview-area');
                if (previewArea) previewArea.innerHTML = '';
                if (modalId === 'addEventModal') paypalPlaceholder.style.display = 'none';
            }
        }
    };

    // Close modal if clicking outside the content
    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) { // Check if the click was directly on the overlay
                    closeModal(modal.id);
                }
            });
        }
    });

    // Auth Tab Switching
    window.switchAuthTab = (tabName) => {
        if (tabName === 'login') {
            loginTabEl.classList.add('active');
            registerTabEl.classList.remove('active');
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
        } else if (tabName === 'register') {
            loginTabEl.classList.remove('active');
            registerTabEl.classList.add('active');
            loginTabBtn.classList.remove('active');
            registerTabBtn.classList.add('active');
        }
    };

    // Browse as Guest
    window.browseAsGuest = () => {
        isLoggedIn = false;
        isGuest = true;
        currentUser = null; // No specific user data for guest
        updateLoginStateUI();
        closeModal('loginModal');
        alert("Browsing as Guest. Some features will be limited.");
    };

    // --- Data Loading Functions ---

    const loadHappenings = () => {
        // Simulate filtering/sorting based on controls (basic)
        const category = happeningsFilterCategory.value;
        const sortBy = happeningsSortBy.value;
        const searchTerm = happeningsSearch.value.toLowerCase();

        let filteredEvents = mockEvents.filter(event => {
            const matchesCategory = category === 'all' || event.category === category;
            const matchesSearch = !searchTerm || event.title.toLowerCase().includes(searchTerm) || (event.description && event.description.toLowerCase().includes(searchTerm));
            return matchesCategory && matchesSearch;
        });

        // Simulate sorting
        if (sortBy === 'date') {
            filteredEvents.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        } else if (sortBy === 'popularity') {
            filteredEvents.sort((a, b) => (b.goingCount || 0) - (a.goingCount || 0));
        } else { // recommended (default) - use promoted flag and maybe date
             filteredEvents.sort((a, b) => {
                if (a.promoted !== b.promoted) return a.promoted ? -1 : 1;
                return new Date(a.dateTime) - new Date(b.dateTime);
            });
        }

        const now = new Date();
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + (7 - now.getDay())); // End of current Sunday
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

        const weekEvents = filteredEvents.filter(e => new Date(e.dateTime) <= endOfWeek && new Date(e.dateTime) >= now);
        const monthEvents = filteredEvents.filter(e => new Date(e.dateTime) <= endOfMonth && new Date(e.dateTime) >= now);
        const yearEvents = filteredEvents.filter(e => new Date(e.dateTime).getFullYear() === now.getFullYear() && new Date(e.dateTime) >= now);
        const liveStreams = filteredEvents.filter(e => e.category === 'livestream' && e.isLive); // Simple check

        const renderSimpleEvent = (event) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${event.promoted ? '<i class="fas fa-star" style="color: var(--secondary-color);"></i> ' : ''}
                <strong>${event.title}</strong> (${formatDateTime(event.dateTime)})
                ${event.isLive ? '<span class="live-badge"> LIVE</span>' : ''}
            `;
            return li;
        };

        populateList(eventsThisWeekList, eventsThisWeekEmpty, weekEvents.slice(0, 10), renderSimpleEvent); // Limit to top 10
        populateList(eventsThisMonthList, eventsThisMonthEmpty, monthEvents.slice(0, 10), renderSimpleEvent);
        populateList(eventsThisYearList, eventsThisYearEmpty, yearEvents.slice(0, 10), renderSimpleEvent);

        populateList(liveNowList, liveNowEmpty, liveStreams, (stream) => {
            const div = document.createElement('div');
            div.className = 'live-item';
            div.innerHTML = `<i class="fas fa-broadcast-tower live-indicator"></i> ${stream.title} by ${stream.organizer}`;
            return div;
        });

        // Featured Videos (using mockVideos for now)
        populateList(featuredVideosList, featuredVideosEmpty, mockVideos.slice(0, 5), (video) => {
             const div = document.createElement('div');
             div.className = 'video-item';
             div.innerHTML = `<i class="fas fa-play-circle"></i> ${video.title} by ${video.uploaderName || 'Unknown'}`;
             return div;
        });
    };

    const loadProfileData = () => {
        if (isLoggedIn && currentUser) {
            userNameDisplay.textContent = currentUser.fullName;
            userLocationDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${currentUser.location}`;
            contactInfoDisplay.textContent = currentUser.email;
            profilePicture.src = currentUser.profilePicture || 'default-profile.png';

            const renderListItem = (item) => {
                const li = document.createElement('li');
                li.textContent = item;
                return li;
            };

            populateList(interestsList, null, currentUser.interests, renderListItem);
            populateList(goalsList, null, currentUser.goals, renderListItem);
            populateList(favArtistsList, null, currentUser.favArtists, renderListItem);
            populateList(favGenresList, null, currentUser.favGenres, renderListItem);
            populateList(favVenuesList, null, currentUser.favVenues, renderListItem);

            const hosted = mockEvents.filter(event => currentUser.hostedEvents.includes(event.id));
            populateList(hostedEventsList, null, hosted, (event) => {
                 const li = document.createElement('li');
                 li.innerHTML = `<strong>${event.title}</strong> (${formatDateTime(event.dateTime)})`;
                 return li;
            });
             if (hosted.length === 0) hostedEventsList.innerHTML = '<li>No events hosted yet.</li>';


            // Simple Recommendations (e.g., events matching interests)
            const recommendedEvents = mockEvents.filter(event =>
                !currentUser.hostedEvents.includes(event.id) && // Not hosted by user
                currentUser.interests.some(interest => event.category.includes(interest.toLowerCase().split(' ')[0]) || event.title.toLowerCase().includes(interest.toLowerCase()))
            ).slice(0, 5); // Limit recommendations

            populateList(recommendedItemsList, recommendedItemsEmpty, recommendedEvents, (rec) => {
                const div = document.createElement('div');
                div.className = 'recommendation-item';
                div.innerHTML = `<i class="fas fa-star"></i> <strong>${rec.title}</strong> - ${formatDateTime(rec.dateTime)}`;
                return div;
            });

            populateList(notificationsList, notificationsEmpty, currentUser.notifications, (note) => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-bell"></i> ${note}`;
                return li;
            });

        } else if (isGuest) {
            userNameDisplay.textContent = "Guest User";
            userLocationDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i> Midrand/Gauteng`;
            contactInfoDisplay.textContent = "Browsing as Guest";
            profilePicture.src = 'default-profile.png';
            // Clear or show placeholder text for lists
            [interestsList, goalsList, favArtistsList, favGenresList, favVenuesList, hostedEventsList, recommendedItemsList, notificationsList].forEach(list => {
                if (list) list.innerHTML = '<li>Log in to view</li>';
            });
             if (recommendedItemsEmpty) recommendedItemsEmpty.style.display = 'none';
             if (notificationsEmpty) notificationsEmpty.style.display = 'none';

        } else { // Logged out, not guest
            userNameDisplay.textContent = "Not Logged In";
            userLocationDisplay.innerHTML = `<i class="fas fa-map-marker-alt"></i> Unknown`;
            contactInfoDisplay.textContent = "Please log in";
            profilePicture.src = 'default-profile.png';
            [interestsList, goalsList, favArtistsList, favGenresList, favVenuesList, hostedEventsList, recommendedItemsList, notificationsList].forEach(list => {
                if (list) list.innerHTML = '<li class="loading-indicator">Loading...</li>';
            });
        }
    };

    const loadFeed = () => {
        feedLoadingIndicator.style.display = 'block';
        feedEmptyState.style.display = 'none';
        feedArea.innerHTML = ''; // Clear previous feed content (append loading indicator back)
        feedArea.appendChild(feedLoadingIndicator);

        // Simulate API call delay
        setTimeout(() => {
            // Combine and sort all feed items by timestamp (newest first)
            combinedFeed = [
                ...mockEvents.map(e => ({ ...e, type: 'event', timestamp: new Date(e.dateTime).getTime() })),
                ...mockJobs.map(j => ({ ...j, type: 'job', timestamp: j.timestamp || Date.now() })),
                ...mockVideos.map(v => ({ ...v, type: 'video', timestamp: v.timestamp || Date.now() })),
                ...mockPosts.map(p => ({ ...p, type: 'post', timestamp: p.timestamp || Date.now() }))
            ].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

            feedLoadingIndicator.style.display = 'none';
            feedArea.innerHTML = ''; // Clear loading indicator

            if (combinedFeed.length === 0) {
                feedEmptyState.style.display = 'block';
                feedArea.appendChild(feedEmptyState);
            } else {
                combinedFeed.forEach(item => {
                    let cardElement = null;
                    if (item.type === 'event') cardElement = renderEventCard(item);
                    else if (item.type === 'job') cardElement = renderJobCard(item);
                    else if (item.type === 'video') cardElement = renderVideoCard(item);
                    else if (item.type === 'post') cardElement = renderPostCard(item);

                    if (cardElement) {
                        feedArea.appendChild(cardElement);
                    }
                });
            }
        }, 500); // 0.5 second delay simulation
    };

    // --- Rendering Functions for Feed Cards ---

    const renderEventCard = (event) => {
        const card = document.createElement('article');
        card.className = `post-card event-card ${event.promoted ? 'promoted' : ''}`;
        card.dataset.id = event.id;

        // Basic structure - enhance as needed
        card.innerHTML = `
            <div class="card-header">
                 <img src="${mockUsers[event.userId]?.profilePicture || 'default-profile.png'}" alt="${event.organizer || 'Organizer'}" class="card-avatar">
                 <div>
                     <span class="card-author">${event.organizer || 'Unknown Organizer'}</span>
                     <span class="card-timestamp">${timeAgo(event.timestamp)}</span>
                 </div>
                 <span class="card-category">${event.category} ${event.isLive ? '<span class="live-badge"> LIVE</span>' : ''}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${event.title}</h3>
                <p class="card-details"><i class="fas fa-calendar-day"></i> ${formatDateTime(event.dateTime)}</p>
                <p class="card-details"><i class="fas fa-map-marker-alt"></i> ${event.location} - <a href="#" class="map-link" onclick="alert('Map integration placeholder for ${event.location}'); return false;">Get Directions</a></p>
                ${event.description ? `<p class="card-description">${event.description.substring(0, 150)}${event.description.length > 150 ? '...' : ''}</p>` : ''}
                ${event.media && event.media.length > 0 ? `<div class="card-image-placeholder" style="height: 150px; background-color: #eee; margin: 10px 0; background-image: url('${event.media[0]}'); background-size: cover; background-position: center;"></div>` : ''}
                ${event.guests ? `<p class="card-details"><i class="fas fa-users"></i> Featuring: ${event.guests}</p>` : ''}
                ${event.tickets ? `<p class="card-details"><i class="fas fa-ticket-alt"></i> Tickets: ${event.tickets}</p>` : ''}
            </div>
            <div class="card-footer">
                <div class="card-stats">
                    <span><i class="fas fa-users"></i> <span class="going-count">${event.goingCount || 0}</span> Going</span>
                    <span><i class="fas fa-comments"></i> <span class="comment-count">${event.comments.length}</span> Comments</span>
                </div>
                <div class="post-actions">
                    <button class="action-button rsvp-button" onclick="toggleRSVP('${event.id}', this)"><i class="fas fa-check-circle"></i> RSVP</button>
                    <button class="action-button" onclick="sharePost('${event.id}')"><i class="fas fa-share"></i> Share</button>
                    <button class="action-button" onclick="savePost('${event.id}')"><i class="fas fa-bookmark"></i> Save</button>
                    ${isLoggedIn && currentUser?.id === event.userId ? `<button class="action-button promote-button" onclick="promoteEvent('${event.id}')"><i class="fas fa-bullhorn"></i> Promote</button>` : ''}
                    <button class="action-button danger-button" onclick="reportPost('${event.id}')"><i class="fas fa-flag"></i> Report</button>
                </div>
            </div>
            <div class="comment-section">
                <h4>Comments</h4>
                <div class="comment-list">
                    ${event.comments.map(c => renderComment(c)).join('')}
                </div>
                <form class="add-comment-form" data-item-id="${event.id}" data-item-type="event">
                    <input type="text" placeholder="Add a comment..." required ${isLoggedIn ? '' : 'disabled'}>
                    <button type="submit" ${isLoggedIn ? '' : 'disabled'}><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        `;
        return card;
    };

    const renderJobCard = (job) => {
        const card = document.createElement('article');
        card.className = 'post-card job-card';
        card.dataset.id = job.id;
        card.innerHTML = `
             <div class="card-header">
                 <span class="card-category">Job Posting</span>
                 <span class="card-timestamp">${timeAgo(job.timestamp)}</span>
             </div>
             <div class="card-body">
                 <h3 class="card-title">${job.title}</h3>
                 <p class="card-details"><i class="fas fa-building"></i> ${job.company}</p>
                 <p class="card-description">${job.description.substring(0, 200)}${job.description.length > 200 ? '...' : ''}</p>
             </div>
             <div class="card-footer">
                 <div class="post-actions">
                     <button class="action-button apply-button" onclick="applyForJob('${job.contactEmail}')"><i class="fas fa-envelope"></i> Apply (Contact)</button>
                     <button class="action-button" onclick="sharePost('${job.id}')"><i class="fas fa-share"></i> Share</button>
                     <button class="action-button" onclick="savePost('${job.id}')"><i class="fas fa-bookmark"></i> Save</button>
                     <button class="action-button danger-button" onclick="reportPost('${job.id}')"><i class="fas fa-flag"></i> Report</button>
                 </div>
             </div>
             <!-- No comments for jobs in this version -->
        `;
        return card;
    };

     const renderVideoCard = (video) => {
        const card = document.createElement('article');
        card.className = 'post-card video-card';
        card.dataset.id = video.id;
        card.innerHTML = `
            <div class="card-header">
                 <img src="${mockUsers[video.userId]?.profilePicture || 'default-profile.png'}" alt="${video.uploaderName || 'Uploader'}" class="card-avatar">
                 <div>
                     <span class="card-author">${video.uploaderName || 'Unknown Uploader'}</span>
                     <span class="card-timestamp">${timeAgo(video.timestamp)}</span>
                 </div>
                 <span class="card-category">Video</span>
            </div>
            <div class="card-body">
                 <h3 class="card-title">${video.title}</h3>
                 ${video.description ? `<p class="card-description">${video.description}</p>` : ''}
                 <div class="card-video-placeholder" style="height: 200px; background-color: #000; margin: 10px 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 2em;">
                     <i class="fas fa-play-circle"></i> <!-- Video Player Placeholder -->
                 </div>
            </div>
             <div class="card-footer">
                 <div class="card-stats">
                     <span><i class="fas fa-thumbs-up"></i> 0 Likes</span> <!-- Placeholder -->
                     <span><i class="fas fa-comments"></i> <span class="comment-count">${video.comments.length}</span> Comments</span>
                 </div>
                 <div class="post-actions">
                     <button class="action-button like-button"><i class="far fa-thumbs-up"></i> Like</button>
                     <button class="action-button" onclick="sharePost('${video.id}')"><i class="fas fa-share"></i> Share</button>
                     <button class="action-button" onclick="savePost('${video.id}')"><i class="fas fa-bookmark"></i> Save</button>
                     <button class="action-button danger-button" onclick="reportPost('${video.id}')"><i class="fas fa-flag"></i> Report</button>
                 </div>
             </div>
             <div class="comment-section">
                <h4>Comments</h4>
                <div class="comment-list">
                     ${video.comments.map(c => renderComment(c)).join('')}
                </div>
                <form class="add-comment-form" data-item-id="${video.id}" data-item-type="video">
                    <input type="text" placeholder="Add a comment..." required ${isLoggedIn ? '' : 'disabled'}>
                    <button type="submit" ${isLoggedIn ? '' : 'disabled'}><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        `;
        return card;
    };

     const renderPostCard = (post) => {
        // Generic text post for now
        const card = document.createElement('article');
        card.className = 'post-card text-post';
        card.dataset.id = post.id;
        card.innerHTML = `
            <div class="card-header">
                 <img src="${mockUsers[post.userId]?.profilePicture || 'default-profile.png'}" alt="${post.userName || 'User'}" class="card-avatar">
                 <div>
                     <span class="card-author">${post.userName || 'Unknown User'}</span>
                     <span class="card-timestamp">${timeAgo(post.timestamp)}</span>
                 </div>
            </div>
            <div class="card-body">
                 <p class="card-description">${post.content}</p>
            </div>
            <div class="card-footer">
                 <div class="card-stats">
                     <span><i class="fas fa-thumbs-up"></i> 0 Likes</span>
                     <span><i class="fas fa-comments"></i> <span class="comment-count">${post.comments.length}</span> Comments</span>
                 </div>
                 <div class="post-actions">
                     <button class="action-button like-button"><i class="far fa-thumbs-up"></i> Like</button>
                     <button class="action-button" onclick="sharePost('${post.id}')"><i class="fas fa-share"></i> Share</button>
                     <button class="action-button" onclick="savePost('${post.id}')"><i class="fas fa-bookmark"></i> Save</button>
                     <button class="action-button danger-button" onclick="reportPost('${post.id}')"><i class="fas fa-flag"></i> Report</button>
                 </div>
             </div>
             <div class="comment-section">
                <h4>Comments</h4>
                <div class="comment-list">
                     ${post.comments.map(c => renderComment(c)).join('')}
                </div>
                <form class="add-comment-form" data-item-id="${post.id}" data-item-type="post">
                    <input type="text" placeholder="Add a comment..." required ${isLoggedIn ? '' : 'disabled'}>
                    <button type="submit" ${isLoggedIn ? '' : 'disabled'}><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        `;
        return card;
    };

    const renderComment = (comment) => {
        return `<div class="comment"><span class="comment-author">${comment.user}:</span> ${comment.text}</div>`;
    };


    // --- Event Listeners ---

    // Forms
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            console.log('Login attempt:', email);

            // --- Simulation ---
            const user = Object.values(mockUsers).find(u => u.email === email && u.password === password);
            if (user) {
                isLoggedIn = true;
                isGuest = false;
                currentUser = { ...user }; // Create a copy
                updateLoginStateUI();
                closeModal('loginModal');
                alert(`Welcome back, ${currentUser.fullName}!`);
            } else {
                alert("Invalid email or password (simulation).");
            }
            loginForm.reset();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('regFullName').value;
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;
            const location = document.getElementById('regLocation').value;
            console.log('Register attempt:', { fullName, email, location });

            // --- Simulation ---
            if (mockUsers[email]) {
                alert("Email already registered (simulation).");
                return;
            }
            // Add new user to mock data (in real app, this is backend)
            const newUserId = `user${Date.now()}`;
            mockUsers[email] = {
                id: newUserId,
                fullName: fullName,
                email: email,
                password: password, // Store plain text in mock data only
                location: location,
                profilePicture: 'default-profile.png',
                interests: [], goals: [], favArtists: [], favGenres: [], favVenues: [], hostedEvents: [], followers: 0, notifications: [`Welcome to The Gruvist, ${fullName}!`]
            };
            alert(`Registration successful for ${fullName}! Please log in.`);
            switchAuthTab('login');
            document.getElementById('loginEmail').value = email; // Pre-fill login
            registerForm.reset();
        });
    }

    if (publishEventButton) {
        publishEventButton.addEventListener('click', () => {
            if (!isLoggedIn) return;
            const title = document.getElementById('eventTitle').value;
            const dateTime = document.getElementById('eventDateTime').value;
            const location = document.getElementById('eventLocation').value;
            const category = document.getElementById('eventCategory').value;
            // Get other fields...
            const description = document.getElementById('eventDescription').value;
            const organizer = document.getElementById('eventOrganizer').value || currentUser.fullName;
            const contact = document.getElementById('eventContact').value || currentUser.email;
            const tickets = document.getElementById('eventTickets').value;
            const guests = document.getElementById('eventGuests').value;
            const wordOfDay = document.getElementById('eventWordOfDay').value;
            const socialLink = document.getElementById('eventSocialLink').value;
            const isPromoted = promoteEventCheckbox.checked;

            if (!title || !dateTime || !location || !category) {
                alert("Please fill in all required (*) fields.");
                return;
            }

            // --- Simulation ---
            const newEventId = `event${Date.now()}`;
            const newEvent = {
                id: newEventId, title, dateTime, location, category, description, organizer, contact, tickets, guests, wordOfDay, socialLink,
                media: [], // Add uploaded media simulation later
                userId: currentUser.id,
                goingCount: 0, comments: [], promoted: isPromoted,
                timestamp: new Date(dateTime).getTime() // Use event date as timestamp for sorting
            };
            mockEvents.push(newEvent);
            currentUser.hostedEvents.push(newEventId);

            console.log('Published Event (Simulation):', newEvent);
            alert(`Event "${title}" published successfully! ${isPromoted ? '(Promotion Simulated)' : ''}`);
            loadFeed(); // Refresh feed
            loadProfileData(); // Refresh profile (hosted events)
            closeModal('addEventModal');
        });
    }

     if (publishJobButton) {
        publishJobButton.addEventListener('click', () => {
             if (!isLoggedIn || !currentUser || currentUser.followers < 10) {
                 alert("Job posting requirements not met.");
                 return;
             }
             const title = document.getElementById('jobTitle').value;
             const company = document.getElementById('jobCompany').value;
             const description = document.getElementById('jobDescription').value;
             const contactEmail = document.getElementById('jobContactEmail').value;

             if (!title || !company || !description || !contactEmail) {
                 alert("Please fill in all required (*) fields.");
                 return;
             }

             // --- Simulation ---
             const newJobId = `job${Date.now()}`;
             const newJob = {
                 id: newJobId, title, company, description, contactEmail,
                 userId: currentUser.id,
                 timestamp: Date.now()
             };
             mockJobs.push(newJob);

             console.log('Published Job (Simulation):', newJob);
             alert(`Job "${title}" published successfully!`);
             loadFeed(); // Refresh feed
             closeModal('addJobModal');
        });
    }

     if (publishVideoButton) {
        publishVideoButton.addEventListener('click', () => {
             if (!isLoggedIn) return;
             const title = document.getElementById('videoTitle').value;
             const description = document.getElementById('videoDescription').value;
             const fileInput = document.getElementById('videoFile');

             if (!title || fileInput.files.length === 0) {
                 alert("Please provide a title and select a video file.");
                 return;
             }
             const file = fileInput.files[0];

             // --- Simulation ---
             const newVideoId = `video${Date.now()}`;
             const newVideo = {
                 id: newVideoId, title, description,
                 file: file.name, // Store filename, not actual file
                 preview: 'video_thumb_placeholder.jpg', // Placeholder preview
                 userId: currentUser.id,
                 uploaderName: currentUser.fullName,
                 comments: [],
                 timestamp: Date.now()
             };
             mockVideos.push(newVideo);

             console.log('Uploaded Video (Simulation):', newVideo);
             alert(`Video "${title}" uploaded successfully!`);
             loadFeed(); // Refresh feed
             loadHappenings(); // Refresh featured videos in happenings
             closeModal('addVideoModal');
        });
    }

    // Profile Editing Listeners
    const setupEditListeners = (editBtn, saveBtn, displayList, editArea, inputEl, dataKey) => {
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                if (!isLoggedIn) return;
                inputEl.value = currentUser[dataKey].join(inputEl.tagName === 'TEXTAREA' ? '\n' : ', ');
                displayList.style.display = 'none';
                editArea.style.display = 'block';
                editBtn.style.display = 'none';
            });
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                if (!isLoggedIn) return;
                const newValueRaw = inputEl.value;
                const separator = inputEl.tagName === 'TEXTAREA' ? '\n' : ',';
                currentUser[dataKey] = newValueRaw.split(separator)
                                                .map(item => item.trim())
                                                .filter(item => item); // Remove empty strings
                console.log(`Saving ${dataKey} (simulation):`, currentUser[dataKey]);
                alert(`${dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} saved (simulation).`);
                loadProfileData(); // Update UI
                editArea.style.display = 'none';
                displayList.style.display = ''; // Show list view again
                editBtn.style.display = 'inline-block';
            });
        }
    };

    setupEditListeners(editInterestsBtn, saveInterestsBtn, interestsList, editInterestsArea, interestsInput, 'interests');
    setupEditListeners(editGoalsBtn, saveGoalsBtn, goalsList, editGoalsArea, goalsInput, 'goals');
    setupEditListeners(editFavArtistsBtn, saveFavArtistsBtn, favArtistsList, editFavArtistsArea, favArtistsInput, 'favArtists');
    setupEditListeners(editFavGenresBtn, saveFavGenresBtn, favGenresList, editFavGenresArea, favGenresInput, 'favGenres');
    setupEditListeners(editFavVenuesBtn, saveFavVenuesBtn, favVenuesList, editFavVenuesArea, favVenuesInput, 'favVenues');

    // Profile Picture Upload
    if (editProfilePictureBtn && profileImageUpload) {
        editProfilePictureBtn.addEventListener('click', () => {
            if (isLoggedIn) profileImageUpload.click();
        });
        profileImageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profilePicture.src = e.target.result;
                    currentUser.profilePicture = e.target.result; // Update mock data (base64 in this sim)
                    alert('Profile picture preview updated. Saving is simulated.');
                }
                reader.readAsDataURL(file);
            } else if (file) {
                alert("Please select a valid image file.");
                profileImageUpload.value = '';
            }
        });
    }

    // Media Previews (Add Event & Add Video)
    const setupMediaPreview = (inputElement, previewContainer) => {
        if (inputElement && previewContainer) {
            inputElement.addEventListener('change', (event) => {
                previewContainer.innerHTML = ''; // Clear previous previews
                const files = event.target.files;
                const maxFiles = inputElement.id === 'eventMedia' ? 5 : 1; // Max 5 for events, 1 for video upload

                if (files.length > maxFiles) {
                    alert(`You can upload a maximum of ${maxFiles} file(s).`);
                    event.target.value = ''; // Clear the selection
                    return;
                }

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        let previewElement;
                        if (file.type.startsWith('image/')) {
                            previewElement = document.createElement('img');
                            previewElement.src = e.target.result;
                            previewElement.alt = file.name;
                        } else if (file.type.startsWith('video/')) {
                            previewElement = document.createElement('video');
                            previewElement.src = e.target.result;
                            previewElement.controls = false; // No controls in small preview
                            previewElement.muted = true;
                            previewElement.autoplay = false;
                        } else {
                             previewElement = document.createElement('p');
                             previewElement.textContent = `File: ${file.name}`;
                        }
                        if (previewElement) {
                            previewElement.style.maxWidth = '80px';
                            previewElement.style.maxHeight = '80px';
                            previewElement.style.margin = '5px';
                            previewElement.style.objectFit = 'cover';
                            previewContainer.appendChild(previewElement);
                        }
                    }
                    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                        reader.readAsDataURL(file);
                    } else {
                         let previewElement = document.createElement('p');
                         previewElement.textContent = `File: ${file.name}`;
                         previewElement.style.margin = '5px';
                         previewElement.style.fontSize = '12px';
                         previewContainer.appendChild(previewElement);
                    }
                }
            });
        }
    };
    setupMediaPreview(eventMediaInput, eventMediaPreview);
    setupMediaPreview(videoFileInput, videoPreview);

    // Event Promotion Checkbox
    if (promoteEventCheckbox) {
        promoteEventCheckbox.addEventListener('change', (e) => {
            paypalPlaceholder.style.display = e.target.checked ? 'block' : 'none';
        });
    }

    // Happenings Filter/Sort/Search Listeners
    [happeningsSearch, happeningsFilterCategory, happeningsSortBy].forEach(el => {
        if (el) {
            el.addEventListener('input', loadHappenings); // Use 'input' for search for real-time feel
            el.addEventListener('change', loadHappenings); // Use 'change' for selects
        }
    });

    // Comment Form Submission (using event delegation on feedArea)
    if (feedArea) {
        feedArea.addEventListener('submit', (e) => {
            if (e.target.classList.contains('add-comment-form')) {
                e.preventDefault();
                if (!isLoggedIn) {
                    alert("Please log in to comment.");
                    return;
                }
                const form = e.target;
                const input = form.querySelector('input[type="text"]');
                const commentText = input.value.trim();
                const itemId = form.dataset.itemId;
                const itemType = form.dataset.itemType;

                if (commentText && itemId && itemType) {
                    // --- Simulation ---
                    const newComment = { user: currentUser.fullName, text: commentText };

                    // Find the item in the mock data and add the comment
                    let item;
                    if (itemType === 'event') item = mockEvents.find(i => i.id === itemId);
                    else if (itemType === 'video') item = mockVideos.find(i => i.id === itemId);
                    else if (itemType === 'post') item = mockPosts.find(i => i.id === itemId);
                    // Add other types if needed

                    if (item) {
                        item.comments.push(newComment);

                        // Update UI directly
                        const commentList = form.previousElementSibling; // Assumes .comment-list is right before form
                        if (commentList && commentList.classList.contains('comment-list')) {
                            commentList.appendChild(renderComment(newComment));
                        }
                        // Update comment count display
                        const card = form.closest('.post-card');
                        if (card) {
                            const countSpan = card.querySelector('.comment-count');
                            if (countSpan) countSpan.textContent = item.comments.length;
                        }

                        input.value = ''; // Clear input
                        console.log(`Comment added to ${itemType} ${itemId}:`, newComment);
                    }
                }
            }
        });
    }

    // Chat Toggle
    if (chatToggleButton) {
        chatToggleButton.addEventListener('click', () => toggleChat());
    }
    // Chat Input Simulation
    if (chatInputForm) {
        chatInputForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageText = chatMessageInput.value.trim();
            if (messageText) {
                // --- Simulation ---
                const messageEl = document.createElement('div');
                messageEl.className = 'message sent';
                messageEl.textContent = messageText;
                chatMessagesArea.appendChild(messageEl);
                chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight; // Scroll to bottom
                chatMessageInput.value = '';
                console.log("Sent chat message (simulation):", messageText);
                // Hide reminder if it was shown
                chatReminder.style.display = 'none';
            }
        });
    }


    // --- Global Functions (for onclick attributes) ---

    window.logoutUser = () => {
        isLoggedIn = false;
        isGuest = false;
        currentUser = null;
        updateLoginStateUI();
        alert('You have been logged out (simulation).');
    };

    window.showProfile = () => {
        const profileSidebar = document.querySelector('.profile-panel');
        if (profileSidebar) {
            profileSidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    window.sharePost = (itemId) => {
        console.log('Share clicked for item:', itemId);
        alert(`Sharing item ${itemId} (simulation - e.g., copy link).`);
    };

    window.savePost = (itemId) => {
        console.log('Save clicked for item:', itemId);
        alert(`Item ${itemId} saved to your list (simulation).`);
        // Add visual feedback if desired (e.g., change bookmark icon)
    };

    window.reportPost = (itemId) => {
        console.log('Report clicked for item:', itemId);
        if (confirm(`Are you sure you want to report item ${itemId}? (Simulation)`)) {
            alert(`Item ${itemId} reported. Thank you.`);
            // In real app, send report to backend
        }
    };

    window.toggleRSVP = (eventId, button) => {
         if (!isLoggedIn) { alert("Please log in to RSVP."); return; }
         console.log('RSVP toggled for event:', eventId);
         // --- Simulation ---
         const event = mockEvents.find(e => e.id === eventId);
         if (event) {
             // Simple toggle simulation - doesn't track *who* RSVPd
             if (button.classList.contains('active')) {
                 event.goingCount = Math.max(0, (event.goingCount || 0) - 1);
                 button.innerHTML = '<i class="fas fa-check-circle"></i> RSVP';
                 button.classList.remove('active');
             } else {
                 event.goingCount = (event.goingCount || 0) + 1;
                 button.innerHTML = '<i class="fas fa-check-circle"></i> Going';
                 button.classList.add('active');
             }
             // Update count display on the card
             const card = button.closest('.event-card');
             if (card) {
                 const countSpan = card.querySelector('.going-count');
                 if (countSpan) countSpan.textContent = event.goingCount;
             }
         }
    };

    window.applyForJob = (contactEmail) => {
        console.log('Apply clicked for job, contact:', contactEmail);
        if (isLoggedIn) {
             window.location.href = `mailto:${contactEmail}?subject=Job Application via The Gruvist`;
        } else {
            alert("Please log in to apply for jobs.");
        }
    };

     window.promoteEvent = (eventId) => {
         console.log('Promote clicked for event:', eventId);
         alert(`Event promotion flow placeholder for ${eventId}. This would typically involve payment.`);
         // In real app, redirect to payment/promotion page or show options
     };

    window.toggleChat = (forceState) => {
        const currentlyVisible = chatContainer.classList.contains('visible');
        const show = forceState === undefined ? !currentlyVisible : forceState;

        if (show) {
            chatContainer.classList.add('visible');
            chatToggleButton.classList.add('active');
            // Simulate fetching contacts/messages
            console.log("Chat opened (simulation)");
            // Simulate unread message reminder appearing after a delay
            setTimeout(() => {
                if (chatContainer.classList.contains('visible')) { // Only show if still open
                    chatReminder.style.display = 'block';
                }
            }, 5000);
        } else {
            chatContainer.classList.remove('visible');
            chatToggleButton.classList.remove('active');
            chatReminder.style.display = 'none'; // Hide reminder when closed
            console.log("Chat closed (simulation)");
        }
    };

    // --- Initial Page Load ---
    console.log('The Gruvist App Initialized (Full Frontend Simulation)');
    updateLoginStateUI(); // Set initial UI based on default logged-out state

}); // End DOMContentLoaded
// ========== START: REPLACE/ADD IN app.js ==========

// --- NEW Utility Function ---
const sanitizeForUrl = (str) => {
    return encodeURIComponent(str.replace(/[^a-zA-Z0-9\s,]/g, '')); // Remove special chars except space/comma, then encode
};

// --- NEW Global Function (for map links) ---
window.openMap = (locationString) => {
    if (!locationString) {
        alert("Location not available.");
        return;
    }
    const query = sanitizeForUrl(locationString);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapUrl, '_blank'); // Open in new tab
    console.log(`Opening map for: ${locationString}`);
};


// --- REPLACE renderEventCard function ---
const renderEventCard = (event) => {
    const card = document.createElement('article');
    card.className = `post-card event-card ${event.promoted ? 'promoted' : ''}`;
    card.dataset.id = event.id;
    const authorName = event.organizer || 'Unknown Organizer';
    const userProfilePic = mockUsers[event.userId]?.profilePicture || 'default-profile.png'; // Get user pic if available

    card.innerHTML = `
        <div class="card-header">
             <img src="${userProfilePic}" alt="${authorName}" class="card-avatar">
             <div>
                 <span class="card-author">${authorName}</span> {/* Name is already bold via CSS */}
                 <span class="card-timestamp">${timeAgo(event.timestamp)}</span>
             </div>
             <span class="card-category">${event.category} ${event.isLive ? '<span class="live-badge"> LIVE</span>' : ''}</span>
        </div>
        <div class="card-body">
            <h3 class="card-title">${event.title}</h3>
            <p class="card-details"><i class="fas fa-calendar-day"></i> ${formatDateTime(event.dateTime)}</p>
            <p class="card-details"><i class="fas fa-map-marker-alt"></i> ${event.location} - <a href="#" class="map-link" onclick="openMap('${event.location.replace(/'/g, "\'")}')">Get Directions</a></p> {/* Added onclick */}
            ${event.description ? `<p class="card-description">${event.description.substring(0, 150)}${event.description.length > 150 ? '...' : ''}</p>` : ''}
            ${event.media && event.media.length > 0 ? `<div class="card-image-placeholder" style="height: 150px; background-color: #eee; margin: 10px 0; background-image: url('${event.media[0]}'); background-size: cover; background-position: center;"></div>` : ''}
            ${event.guests ? `<p class="card-details"><i class="fas fa-users"></i> Featuring: ${event.guests}</p>` : ''}
            ${event.tickets ? `<p class="card-details"><i class="fas fa-ticket-alt"></i> Tickets: ${event.tickets}</p>` : ''}
        </div>
        <div class="card-footer">
            <div class="card-stats">
                {/* Reaction Emojis */}
                <span class="reaction-stat"><i class="fas fa-thumbs-up"></i> <span class="like-count">${event.likeCount || 0}</span></span>
                <span class="reaction-stat"><i class="fas fa-users"></i> <span class="going-count">${event.goingCount || 0}</span> Going</span>
                <span class="reaction-stat"><i class="fas fa-comments"></i> <span class="comment-count">${event.comments.length}</span></span>
            </div>
            <div class="post-actions">
                {/* Refined Buttons */}
                <button class="action-button like-button" onclick="toggleLike('${event.id}', this)"><i class="far fa-thumbs-up"></i> Like</button>
                <button class="action-button rsvp-button" onclick="toggleRSVP('${event.id}', this)"><i class="fas fa-check-circle"></i> RSVP</button> {/* Text changes in JS */}
                <button class="action-button" onclick="sharePost('${event.id}')"><i class="fas fa-share"></i> Share</button>
                <button class="action-button" onclick="savePost('${event.id}')"><i class="fas fa-bookmark"></i> Save</button>
                ${isLoggedIn && currentUser?.id === event.userId ? `<button class="action-button promote-button" onclick="promoteEvent('${event.id}')"><i class="fas fa-bullhorn"></i> Promote</button>` : ''}
                <button class="action-button danger-button" onclick="reportPost('${event.id}')"><i class="fas fa-flag"></i> Report</button>
            </div>
        </div>
        <div class="comment-section">
            <h4>Comments</h4>
            <div class="comment-list">
                ${event.comments.map(c => renderComment(c)).join('')}
            </div>
            {/* Enhanced Comment Form */}
            <form class="add-comment-form" data-item-id="${event.id}" data-item-type="event">
                <button type="button" class="comment-input-btn" onclick="alert('Voice comment input not implemented.')" title="Voice Comment"><i class="fas fa-microphone"></i></button>
                <button type="button" class="comment-input-btn" onclick="alert('Video comment input not implemented.')" title="Video Comment"><i class="fas fa-video"></i></button>
                <input type="text" placeholder="Add a comment..." required ${isLoggedIn ? '' : 'disabled'}>
                <button type="submit" ${isLoggedIn ? '' : 'disabled'} title="Send Comment"><i class="fas fa-paper-plane"></i></button>
            </form>
        </div>
    `;
    return card;
};

// --- REPLACE renderVideoCard function ---
const renderVideoCard = (video) => {
    const card = document.createElement('article');
    card.className = 'post-card video-card';
    card.dataset.id = video.id;
    const uploaderName = video.uploaderName || 'Unknown Uploader';
    const userProfilePic = mockUsers[video.userId]?.profilePicture || 'default-profile.png';

    card.innerHTML = `
        <div class="card-header">
             <img src="${userProfilePic}" alt="${uploaderName}" class="card-avatar">
             <div>
                 <span class="card-author">${uploaderName}</span> {/* Name is already bold via CSS */}
                 <span class="card-timestamp">${timeAgo(video.timestamp)}</span>
             </div>
             <span class="card-category">Video</span>
        </div>
        <div class="card-body">
             <h3 class="card-title">${video.title}</h3>
             ${video.description ? `<p class="card-description">${video.description}</p>` : ''}
             {/* Actual Video Element */}
             <div class="video-wrapper">
                 <video class="card-video" src="${video.file || 'placeholder.mp4'}" loop muted playsinline data-video-id="${video.id}"></video>
                 <div class="video-overlay"><i class="fas fa-play"></i></div> {/* Pause/Play indicator */}
             </div>
        </div>
         <div class="card-footer">
             <div class="card-stats">
                 {/* Reaction Emojis */}
                 <span class="reaction-stat"><i class="fas fa-thumbs-up"></i> <span class="like-count">${video.likeCount || 0}</span></span>
                 <span class="reaction-stat"><i class="fas fa-comments"></i> <span class="comment-count">${video.comments.length}</span></span>
                 <span class="reaction-stat"><i class="fas fa-eye"></i> ${video.viewCount || 0} Views</span> {/* Example view count */}
             </div>
             <div class="post-actions">
                 <button class="action-button like-button" onclick="toggleLike('${video.id}', this)"><i class="far fa-thumbs-up"></i> Like</button>
                 <button class="action-button" onclick="sharePost('${video.id}')"><i class="fas fa-share"></i> Share</button>
                 <button class="action-button" onclick="savePost('${video.id}')"><i class="fas fa-bookmark"></i> Save</button>
                 <button class="action-button danger-button" onclick="reportPost('${video.id}')"><i class="fas fa-flag"></i> Report</button>
             </div>
         </div>
         <div class="comment-section">
            <h4>Comments</h4>
            <div class="comment-list">
                 ${video.comments.map(c => renderComment(c)).join('')}
            </div>
            {/* Enhanced Comment Form */}
            <form class="add-comment-form" data-item-id="${video.id}" data-item-type="video">
                <button type="button" class="comment-input-btn" onclick="alert('Voice comment input not implemented.')" title="Voice Comment"><i class="fas fa-microphone"></i></button>
                <button type="button" class="comment-input-btn" onclick="alert('Video comment input not implemented.')" title="Video Comment"><i class="fas fa-video"></i></button>
                <input type="text" placeholder="Add a comment..." required ${isLoggedIn ? '' : 'disabled'}>
                <button type="submit" ${isLoggedIn ? '' : 'disabled'} title="Send Comment"><i class="fas fa-paper-plane"></i></button>
            </form>
        </div>
    `;
    // Add dblclick listener after element is created (or use delegation)
    const videoElement = card.querySelector('.card-video');
    if (videoElement) {
        // Autoplay attempt (might be blocked by browser)
        videoElement.play().catch(e => console.log("Autoplay prevented for video:", video.id));

        videoElement.addEventListener('dblclick', handleVideoDblClick);
        // Also add click listener to overlay for play/pause
        const overlay = card.querySelector('.video-overlay');
        if(overlay) {
            overlay.addEventListener('click', handleVideoDblClick);
        }
    }
    return card;
};

// --- ADD Video Double Click Handler ---
const handleVideoDblClick = (event) => {
    const target = event.currentTarget; // Could be video or overlay
    const wrapper = target.closest('.video-wrapper');
    if (!wrapper) return;

    const video = wrapper.querySelector('.card-video');
    const overlay = wrapper.querySelector('.video-overlay');
    const playIcon = overlay ? overlay.querySelector('i') : null;

    if (video && overlay && playIcon) {
        if (video.paused) {
            video.play();
            overlay.style.opacity = '0'; // Hide overlay
            playIcon.className = 'fas fa-pause'; // Change icon for next potential show
        } else {
            video.pause();
            overlay.style.opacity = '1'; // Show overlay
            playIcon.className = 'fas fa-play'; // Set icon to play
        }
    }
};


// --- REVISE toggleRSVP function ---
window.toggleRSVP = (eventId, button) => {
     if (!isLoggedIn) { alert("Please log in to RSVP."); return; }
     console.log('RSVP toggled for event:', eventId);
     // --- Simulation ---
     const event = mockEvents.find(e => e.id === eventId);
     if (event) {
         // Simple toggle simulation - doesn't track *who* RSVPd
         const going = button.classList.contains('active');
         if (going) {
             event.goingCount = Math.max(0, (event.goingCount || 0) - 1);
             button.innerHTML = '<i class="fas fa-check-circle"></i> RSVP'; // Change text back
             button.classList.remove('active');
         } else {
             event.goingCount = (event.goingCount || 0) + 1;
             button.innerHTML = '<i class="fas fa-check-circle"></i> Going'; // Change text
             button.classList.add('active');
         }
         // Update count display on the card
         const card = button.closest('.event-card');
         if (card) {
             const countSpan = card.querySelector('.going-count');
             if (countSpan) countSpan.textContent = event.goingCount;
         }
     }
};

// --- ADD toggleLike function ---
window.toggleLike = (itemId, button) => {
    if (!isLoggedIn) { alert("Please log in to like items."); return; }
    console.log('Like toggled for item:', itemId);
    // --- Simulation ---
    let item = mockEvents.find(i => i.id === itemId) || mockVideos.find(i => i.id === itemId) || mockPosts.find(i => i.id === itemId);
    if (item) {
        const liked = button.classList.contains('active');
        const icon = button.querySelector('i');

        if (liked) {
            item.likeCount = Math.max(0, (item.likeCount || 0) - 1);
            if (icon) icon.className = 'far fa-thumbs-up'; // Outline icon
            button.classList.remove('active');
        } else {
            item.likeCount = (item.likeCount || 0) + 1;
            if (icon) icon.className = 'fas fa-thumbs-up'; // Solid icon
            button.classList.add('active');
        }
        // Update count display on the card
        const card = button.closest('.post-card');
        if (card) {
            const countSpan = card.querySelector('.like-count');
            if (countSpan) countSpan.textContent = item.likeCount;
        }
    }
};


// --- ADD Event Listener for Video Autoplay on Scroll (Basic Implementation) ---
// This is a simplified version. A more robust solution uses Intersection Observer.
let videoPlayTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(videoPlayTimeout);
    videoPlayTimeout = setTimeout(() => {
        document.querySelectorAll('.card-video').forEach(video => {
            const rect = video.getBoundingClientRect();
            const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isVisible && video.paused) {
                // Only play if overlay isn't explicitly showing 'play' (meaning user paused it)
                const overlay = video.closest('.video-wrapper')?.querySelector('.video-overlay i');
                if (!overlay || !overlay.classList.contains('fa-play')) {
                     video.play().catch(e => {}); // Attempt to play, ignore errors
                }
            } else if (!isVisible && !video.paused) {
                video.pause();
            }
        });
    }, 150); // Debounce scroll events
});


// ========== END: REPLACE/ADD IN app.js ==========

    // --- Add Event Modal - Advanced Options Toggle ---
    const toggleAdvancedBtn = document.getElementById('toggleAdvancedOptionsBtn');
    const advancedOptionsDiv = document.getElementById('advancedEventOptions');

    if (toggleAdvancedBtn && advancedOptionsDiv) {
        toggleAdvancedBtn.addEventListener('click', () => {
            const isOpen = advancedOptionsDiv.style.display === 'block';
            if (isOpen) {
                advancedOptionsDiv.style.display = 'none';
                toggleAdvancedBtn.innerHTML = 'Show Advanced Options <i class="fas fa-chevron-down"></i>';
                toggleAdvancedBtn.classList.remove('open');
            } else {
                advancedOptionsDiv.style.display = 'block'; // Or 'grid'/'flex' if needed by inner content
                toggleAdvancedBtn.innerHTML = 'Hide Advanced Options <i class="fas fa-chevron-up"></i>';
                toggleAdvancedBtn.classList.add('open');
            }
        });
    }
