let savedPosts = [];
let likedPosts = [];
let notifications = [];
let users = [];
let eventLineup = [];

const MAX_IMAGES = 5;
const MAX_VIDEOS = 2;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

function toggleCustomEventInput() {
    let eventTypeInput = document.getElementById('event-type');
    let customEventInput = document.getElementById('custom-event-type');
    if (eventTypeInput.value === 'other') {
        customEventInput.style.display = 'block';
    } else {
        customEventInput.style.display = 'none';
    }
}

function savePost(post) {
    let savedPostsList = document.getElementById('saved-posts-list');
    let savedPost = post.cloneNode(true);
    savedPost.querySelector('.save-button').style.display = 'none'; // Hide the save button in saved posts
    savedPostsList.appendChild(savedPost);
    savedPosts.push(savedPost.innerHTML);
    localStorage.setItem('savedPosts', JSON.stringify(savedPosts)); // Store in localStorage
    alert('Post saved!');
}

function likePost(post) {
    let likedPostsList = document.getElementById('liked-posts-list');
    let likedPost = post.cloneNode(true);
    likedPost.querySelector('.like-button').style.display = 'none'; // Hide the like button in liked posts
    likedPostsList.appendChild(likedPost);
    likedPosts.push(likedPost.innerHTML);
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts)); // Store in localStorage
    alert('Post liked!');
}

function showProfile() {
    let profileSection = document.getElementById('profile-section');
    let taskListSection = document.getElementById('todo-app');
    if (profileSection.style.display === 'none') {
        profileSection.style.display = 'block';
        taskListSection.style.display = 'none';
        loadProfileTabs();
    } else {
        profileSection.style.display = 'none';
        taskListSection.style.display = 'block';
    }
}

function loadProfileTabs() {
    loadSavedPosts();
    loadLikedPosts();
    loadNotifications();
    loadProfileInfo();
}

function loadSavedPosts() {
    let savedPostsList = document.getElementById('saved-posts-list');
    savedPostsList.innerHTML = '';
    savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
    savedPosts.forEach(postHTML => {
        let savedPost = document.createElement('li');
        savedPost.innerHTML = postHTML;
        savedPost.querySelector('.save-button').style.display = 'none'; // Hide the save button in saved posts
        savedPostsList.appendChild(savedPost);
    });
}

function loadLikedPosts() {
    let likedPostsList = document.getElementById('liked-posts-list');
    likedPostsList.innerHTML = '';
    likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
    likedPosts.forEach(postHTML => {
        let likedPost = document.createElement('li');
        likedPost.innerHTML = postHTML;
        likedPost.querySelector('.like-button').style.display = 'none'; // Hide the like button in liked posts
        likedPostsList.appendChild(likedPost);
    });
}

function loadNotifications() {
    let notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';
    notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.forEach(notificationHTML => {
        let notification = document.createElement('li');
        notification.innerHTML = notificationHTML;
        notificationsList.appendChild(notification);
    });
}

function loadProfileInfo() {
    let profileInfo = document.getElementById('profile-info');
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        profileInfo.innerHTML = `
            <p><strong>Username:</strong> ${currentUser.username}</p>
            <p><strong>Full Name:</strong> ${currentUser.fullName}</p>
            <p><strong>Age:</strong> ${currentUser.age}</p>
            <p><strong>Gender:</strong> ${currentUser.gender}</p>
        `;
    } else {
        profileInfo.innerHTML = `<p>Please log in to view your profile information.</p>`;
    }
}

function validateAddress(address) {
    // Basic address validation
    if (!address || address.trim().length < 5) {
        alert('Please enter a complete address');
        return false;
    }
    
    // Check for basic address components (street number, street name)
    const hasStreetNumber = /\d+/.test(address);
    const hasStreetName = /[a-zA-Z]+/.test(address);
    
    if (!hasStreetNumber || !hasStreetName) {
        alert('Please include street number and name in the address');
        return false;
    }
    
    return true;
}

function addTask() {
    if (!userManager.currentUser) {
        alert('Please login to create an event');
        openLoginModal();
        return;
    }

    if (!validateTabs()) return;

    const eventData = {
        title: document.getElementById('new-task').value,
        datetime: document.getElementById('event-datetime').value,
        eventType: document.getElementById('event-type').value,
        venue: document.getElementById('venue').value,
        userId: userManager.currentUser.id,
        media: getMediaUrls(),
        tickets: getTicketInfo(),
        lineup: eventLineup
    };

    const newEvent = eventManager.createEvent(eventData);
    displayEvent(newEvent);
    refreshHappenings();
    clearForm();
    closeModal();
}

// CSS for media container and flipping functionality:
const style = document.createElement('style');
style.innerHTML = `
    .media-container {
        display: flex;
        overflow: hidden;
        width: 100%;
        height: 200px;
        position: relative;
    }
    .media-item {
        min-width: 100%;
        transition: transform 0.5s ease;
    }
    .media-container:hover .media-item {
        transform: translateX(-100%);
    }
`;
document.head.appendChild(style);
function deletePost(post) {
    let taskList = document.getElementById('task-list');
    taskList.removeChild(post);
}

function addComment(task, commentText) {
    let commentSection = task.querySelector('.comment-section');
    let timestamp = new Date();
    let comment = document.createElement('div');
    comment.classList.add('comment');
    comment.innerHTML = `
        <div class="comment-text">${commentText}</div>
        <div class="comment-likes">
            <button class="comment-like-button">Like</button>
            <span class="comment-like-count">0 Likes</span>
            <button class="reply-button">Reply</button>
        </div>
        <div class="replies"></div>
        <input type="text" class="reply-input" placeholder="Write a reply..." style="display:none;">
        <span class="timestamp" data-time="${timestamp.toISOString()}">${timeSince(timestamp)}</span>
    `;

    comment.querySelector('.comment-like-button').onclick = function() {
        let likeCount = comment.querySelector('.comment-like-count');
        let count = parseInt(likeCount.textContent.split(' ')[0]);
        likeCount.textContent = `${count + 1} Likes`;
        sortComments(commentSection);
    };

    comment.querySelector('.reply-button').onclick = function() {
        let replyInput = comment.querySelector('.reply-input');
        replyInput.style.display = 'block';
        replyInput.focus();
    };

    comment.querySelector('.reply-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            let replyText = this.value;
            if (replyText !== '') {
                addReply(comment, replyText);
                this.value = '';
                this.style.display = 'none';
                addNotification('Someone replied to your comment!');
            }
        }
    });

    commentSection.insertBefore(comment, commentSection.firstChild);
}

function addReply(comment, replyText) {
  let reply = document.createElement('div');
  let timestamp = new Date();
  reply.classList.add('reply');
  reply.innerHTML = `
      <div class="reply-text">${replyText}</div>
      <div class="reply-likes">
          <button class="reply-like-button">Like</button>
          <span class="reply-like-count">0 Likes</span>
      </div>
      <span class="timestamp" data-time="${timestamp.toISOString()}">${timeSince(timestamp)}</span>
  `;

  reply.querySelector('.reply-like-button').onclick = function() {
      let likeCount = reply.querySelector('.reply-like-count');
      let count = parseInt(likeCount.textContent.split(' ')[0]);
      likeCount.textContent = `${count + 1} Likes`;
      sortReplies(comment);
  };

  comment.querySelector('.replies').appendChild(reply);
}

function sortReplies(comment) {
  let replies = Array.from(comment.querySelector('.replies').children);

  replies.sort((a, b) => {
      let aLikes = parseInt(a.querySelector('.reply-like-count').textContent.split(' ')[0]);
      let bLikes = parseInt(b.querySelector('.reply-like-count').textContent.split(' ')[0]);
      return bLikes - aLikes;
  });

  replies.forEach(reply => comment.querySelector('.replies').appendChild(reply));
}

function sortComments(commentSection) {
    let comments = Array.from(commentSection.children);
    
    // Remove existing glass effects
    comments.forEach(comment => {
        comment.classList.remove('glass-platinum', 'glass-gold', 'glass-silver');
    });

    // Sort by likes
    comments.sort((a, b) => {
        let aLikes = parseInt(a.querySelector('.comment-like-count').textContent.split(' ')[0]);
        let aReplies = a.querySelectorAll('.reply').length;
        let bLikes = parseInt(b.querySelector('.comment-like-count').textContent.split(' ')[0]);
        let bReplies = b.querySelectorAll('.reply').length;
        
        // Calculate total engagement (likes + replies)
        let aTotal = aLikes + aReplies;
        let bTotal = bLikes + bReplies;
        
        return bTotal - aTotal;
    });

    // Apply glass effects to top 3
    if (comments.length > 0) comments[0].classList.add('glass-platinum');
    if (comments.length > 1) comments[1].classList.add('glass-gold');
    if (comments.length > 2) comments[2].classList.add('glass-silver');

    // Reappend in sorted order
    comments.forEach(comment => commentSection.appendChild(comment));
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
      return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
      return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
      return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
      return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

function updateTimestamps() {
  let timestamps = document.querySelectorAll('.timestamp');
  timestamps.forEach(timestamp => {
      let date = new Date(timestamp.getAttribute('data-time'));
      timestamp.innerHTML = timeSince(date);
  });
}

setInterval(updateTimestamps, 60000); // Update every minute

function openModal() {
  document.getElementById('myModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('myModal').style.display = 'none';
}

function openTab(evt, tabName) {
  let tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  let tablinks = document.getElementsByClassName("tab-link");
  for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

function addNotification(notificationText) {
  let notificationsList = document.getElementById('notifications-list');
  let notification = document.createElement('li');
  notification.textContent = notificationText;
  notificationsList.appendChild(notification);
  notifications.push(notification.innerHTML);
  localStorage.setItem('notifications', JSON.stringify(notifications)); // Store in localStorage
}

function toggleCommentInput(button) {
  let commentInput = button.parentElement.nextElementSibling.querySelector('.comment-input');
  if (commentInput.style.display === 'none' || commentInput.style.display === '') {
      commentInput.style.display = 'block';
  } else {
      commentInput.style.display = 'none';
  }
}

// Login/Register Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Update tab content
    document.querySelectorAll('.auth-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}Tab`).classList.add('active');
}

// Password Toggle
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.previousElementSibling;
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('auth-modal')) {
        closeLoginModal();
    }
}

// Form Submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        await userManager.login(username, password);
        updateUIForAuth();
        closeLoginModal();
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    try {
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        await userManager.register(username, email, password);
        alert('Registration successful! Please login.');
        switchAuthTab('login');
    } catch (error) {
        alert(error.message);
    }
});

function registerUser() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let fullName = document.getElementById('fullName').value;
  let age = document.getElementById('age').value;
  let gender = document.getElementById('gender').value;

  // Validation
  if (username === '' || password === '' || fullName === '' || age === '' || gender === '') {
      alert('Please fill in all fields.');
      return;
  }

  // Check if username already exists
  let existingUsers = JSON.parse(localStorage.getItem('users')) || [];
  if (existingUsers.some(user => user.username === username)) {
      alert('Username already exists. Please choose another.');
      return;
  }

  let user = { username, password, fullName, age, gender };
  existingUsers.push(user);
  localStorage.setItem('users', JSON.stringify(existingUsers));
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  alert('Registration successful!');
  closeLoginModal();
  showProfile();
  updateNavbarForLoggedInUser();
}

function loginUser() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let user = users.find(user => user.username === username && user.password === password);

  if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      alert('Login successful!');
      closeLoginModal();
      showProfile();
      updateNavbarForLoggedInUser();
  } else {
      alert('Invalid username or password. Please try again.');
  }
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  alert('Logout successful!');
  updateNavbarForLoggedOutUser();
  showProfile(); // This will now show "Please log in" message
}

function updateNavbarForLoggedInUser() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let navbar = document.querySelector('.navbar');
    
    // Update navbar buttons
    document.querySelector('button[onclick="openLoginModal()"]').style.display = 'none';
    document.querySelector('button[onclick="openModal()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="showProfile()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="logoutUser()"]').style.display = 'inline-block';
    
    // Add welcome message
    let welcomeMsg = document.createElement('span');
    welcomeMsg.className = 'welcome-message';
    welcomeMsg.textContent = `Welcome, ${currentUser.username}!`;
    navbar.insertBefore(welcomeMsg, navbar.firstChild.nextSibling);
}

function updateNavbarForLoggedOutUser() {
    // Remove welcome message if it exists
    let welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) welcomeMsg.remove();
    
    // Update navbar buttons
    document.querySelector('button[onclick="openLoginModal()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="openModal()"]').style.display = 'none';
    document.querySelector('button[onclick="showProfile()"]').style.display = 'none';
    document.querySelector('button[onclick="logoutUser()"]').style.display = 'none';
}

function continueAsGuest() {
    // Create a guest user with a random ID
    const guestUser = {
        username: 'Guest_' + Math.random().toString(36).substr(2, 9),
        fullName: 'Guest User',
        age: '',
        gender: '',
        isGuest: true
    };
    
    // Store guest user in localStorage
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    
    // Update UI for guest user
    closeLoginModal();
    updateNavbarForGuestUser();
    
    // Redirect to main feed
    document.getElementById('todo-app').style.display = 'block';
    document.getElementById('profile-section').style.display = 'none';
}

function updateNavbarForGuestUser() {
    let navbar = document.querySelector('.navbar');
    
    // Remove any existing welcome message
    let existingWelcome = document.querySelector('.welcome-message');
    if (existingWelcome) {
        existingWelcome.remove();
    }
    
    // Add guest welcome message
    let welcomeMsg = document.createElement('span');
    welcomeMsg.className = 'welcome-message';
    welcomeMsg.textContent = 'Welcome, Guest!';
    navbar.insertBefore(welcomeMsg, navbar.firstChild.nextSibling);
    
    // Update button visibility
    document.querySelector('button[onclick="openLoginModal()"]').style.display = 'inline-block';
    document.querySelector('button[onclick="openModal()"]').style.display = 'inline-block'; // Allow posting
    document.querySelector('button[onclick="showProfile()"]').style.display = 'none'; // Hide profile
    document.querySelector('button[onclick="logoutUser()"]').style.display = 'inline-block';
}

// Add this to your window.onload or at the end of your script
function initializeApp() {
    updateUIForAuth();
    refreshHappenings();
    
    // Load existing events
    eventManager.events.forEach(event => {
        displayEvent(event);
    });
}

// Call this when the page loads
window.onload = initializeApp;

function updateProfile() {
  let fullName = document.getElementById('profileFullName').value;
  let age = document.getElementById('profileAge').value;
  let gender = document.getElementById('profileGender').value;

  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
      currentUser.fullName = fullName;
      currentUser.age = age;
      currentUser.gender = gender;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      alert('Profile updated!');
      loadProfileInfo();
  } else {
      alert('Please log in to update your profile.');
  }
}

// Additional handler for the login button
document.querySelector('#loginModal button[onclick="registerUser()"]').insertAdjacentHTML('afterend', `
  <button onclick="loginUser()">Login</button>
`);

function getDirections(destinationAddress) {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Create Google Maps URL with current location and destination
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodeURIComponent(destinationAddress)}`;
                
                // Open in new tab
                window.open(mapsUrl, '_blank');
            },
            function(error) {
                // Handle error or fallback to just destination
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationAddress)}`;
                window.open(mapsUrl, '_blank');
                console.error("Error getting location:", error);
            }
        );
    } else {
        // Fallback for browsers that don't support geolocation
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationAddress)}`;
        window.open(mapsUrl, '_blank');
    }
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function validateInput(input, type) {
    const patterns = {
        username: /^[a-zA-Z0-9_]{3,16}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };
    
    return patterns[type].test(input);
}

function addToLineup() {
    const name = document.getElementById('performer-name').value;
    const role = document.getElementById('performer-role').value;
    const time = document.getElementById('performer-time').value;
    
    if (!name || !role || !time) {
        alert('Please fill in all lineup details');
        return;
    }
    
    const performer = {
        id: Date.now(), // unique ID for removal
        name: name,
        role: role,
        time: time
    };
    
    eventLineup.push(performer);
    updateLineupDisplay();
    clearLineupInputs();
}

function removeFromLineup(id) {
    eventLineup = eventLineup.filter(performer => performer.id !== id);
    updateLineupDisplay();
}

function updateLineupDisplay() {
    const lineupList = document.getElementById('lineup-list');
    lineupList.innerHTML = '';
    
    // Sort by performance time
    eventLineup.sort((a, b) => a.time.localeCompare(b.time));
    
    eventLineup.forEach(performer => {
        const performerElement = document.createElement('div');
        performerElement.className = 'lineup-item';
        performerElement.innerHTML = `
            <span class="performer-time">${performer.time}</span>
            <span class="performer-name">${performer.name}</span>
            <span class="performer-role">${performer.role}</span>
            <button onclick="removeFromLineup(${performer.id})" class="remove-performer">
                <i class="fas fa-times"></i>
            </button>
        `;
        lineupList.appendChild(performerElement);
    });
}

function clearLineupInputs() {
    document.getElementById('performer-name').value = '';
    document.getElementById('performer-role').value = '';
    document.getElementById('performer-time').value = '';
}

function clearForm() {
    // ... existing clear code ...
    eventLineup = [];
    updateLineupDisplay();
    clearLineupInputs();
}

function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content and activate button
    document.getElementById(tabId).classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabId}')"]`).classList.add('active');
}

// Validate all tabs before posting
function validateTabs() {
    // Basic Info validation
    const title = document.getElementById('new-task').value;
    const datetime = document.getElementById('event-datetime').value;
    const venue = document.getElementById('venue').value;
    
    if (!title || !datetime || !venue) {
        alert('Please fill in all required fields in Basic Info');
        switchTab('basic-info');
        return false;
    }
    
    // Add other validations as needed
    return true;
}

function toggleTicketOptions() {
    const ticketTiers = document.getElementById('ticketTiers');
    const isPaid = document.getElementById('paidTicket').checked;
    ticketTiers.style.display = isPaid ? 'block' : 'none';
}

function toggleTierInputs(tier) {
    const inputs = document.getElementById(`${tier}-inputs`);
    const isEnabled = document.getElementById(`${tier}-enabled`).checked;
    inputs.style.display = isEnabled ? 'block' : 'none';
}

// Add to your existing addTask function
function getTicketInfo() {
    const ticketInfo = {
        isFree: document.getElementById('freeTicket').checked,
        tiers: {}
    };

    if (!ticketInfo.isFree) {
        // Standard Entry
        ticketInfo.tiers.standard = {
            price: document.getElementById('standard-price').value,
            quantity: document.getElementById('standard-quantity').value
        };

        // VIP
        if (document.getElementById('vip-enabled').checked) {
            ticketInfo.tiers.vip = {
                price: document.getElementById('vip-price').value,
                quantity: document.getElementById('vip-quantity').value,
                perks: document.getElementById('vip-perks').value
            };
        }

        // VVIP
        if (document.getElementById('vvip-enabled').checked) {
            ticketInfo.tiers.vvip = {
                price: document.getElementById('vvip-price').value,
                quantity: document.getElementById('vvip-quantity').value,
                perks: document.getElementById('vvip-perks').value
            };
        }
    }

    return ticketInfo;
}

function handleImageUpload(event) {
    const files = event.target.files;
    const previewContainer = document.querySelector('.image-preview-container');
    const currentImages = previewContainer.children.length;

    if (currentImages + files.length > MAX_IMAGES) {
        alert(`You can only upload a maximum of ${MAX_IMAGES} images`);
        return;
    }

    Array.from(files).forEach(file => {
        if (file.size > MAX_IMAGE_SIZE) {
            alert(`Image ${file.name} exceeds 5MB limit`);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'media-preview';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <div class="media-overlay">
                    <button onclick="removeMedia(this.parentElement.parentElement)" class="remove-media">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

function handleVideoUpload(event) {
    const files = event.target.files;
    const previewContainer = document.querySelector('.video-preview-container');
    const currentVideos = previewContainer.children.length;

    if (currentVideos + files.length > MAX_VIDEOS) {
        alert(`You can only upload a maximum of ${MAX_VIDEOS} videos`);
        return;
    }

    Array.from(files).forEach(file => {
        if (file.size > MAX_VIDEO_SIZE) {
            alert(`Video ${file.name} exceeds 50MB limit`);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement('div');
            preview.className = 'media-preview';
            preview.innerHTML = `
                <video controls>
                    <source src="${e.target.result}" type="${file.type}">
                    Your browser does not support the video tag.
                </video>
                <div class="media-overlay">
                    <button onclick="removeMedia(this.parentElement.parentElement)" class="remove-media">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            previewContainer.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

function removeMedia(element) {
    element.remove();
}

function createPostHTML(data) {
    return `
        <div class="post-container">
            <!-- Header Section -->
            <div class="post-header">
                <div class="post-author">
                    <img src="path/to/default-avatar.png" alt="TEARN" class="author-avatar">
                    <div class="author-info">
                        <span class="author-name">TEARN</span>
                        <span class="post-timestamp" data-time="${data.timestamp.toISOString()}">${timeSince(data.timestamp)}</span>
                    </div>
                </div>
                <div class="post-options">
                    <button class="options-btn"><i class="fas fa-ellipsis-v"></i></button>
                </div>
            </div>

            <!-- Title Section -->
            <div class="post-title">
                <h2>${data.taskText}</h2>
            </div>

            <!-- Media Gallery -->
            ${createMediaGalleryHTML(data.mediaElements)}

            <!-- Event Details Section -->
            <div class="event-details">
                <div class="detail-item">
                    <i class="far fa-calendar-alt"></i>
                    <div class="detail-content">
                        <span class="detail-label">Date & Time</span>
                        <span class="detail-value">${new Date(data.datetime).toLocaleString()}</span>
                    </div>
                </div>

                <div class="detail-item">
                    <i class="fas fa-tag"></i>
                    <div class="detail-content">
                        <span class="detail-label">Event Type</span>
                        <span class="detail-value">${data.eventType}</span>
                    </div>
                </div>

                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div class="detail-content">
                        <span class="detail-label">Venue</span>
                        <span class="detail-value">${data.venue}</span>
                        <button class="direction-button" onclick="getDirections('${data.venue}')">
                            <i class="fas fa-directions"></i> Get Directions
                        </button>
                    </div>
                </div>
            </div>

            <!-- Ticket Information -->
            <div class="ticket-section">
                ${createTicketInfoHTML(data.ticketInfo)}
            </div>

            <!-- Lineup Section -->
            ${createLineupHTML(data.eventLineup)}

            <!-- Engagement Section -->
            <div class="post-engagement">
                <div class="engagement-stats">
                    <span class="like-count">0 likes</span>
                    <span class="comment-count">0 comments</span>
                </div>
                <div class="engagement-actions">
                    <button onclick="toggleLike(this)" class="action-button like-button">
                        <i class="far fa-heart"></i> Like
                    </button>
                    <button onclick="toggleComment(this)" class="action-button comment-button">
                        <i class="far fa-comment"></i> Comment
                    </button>
                    <button onclick="toggleSave(this)" class="action-button save-button">
                        <i class="far fa-bookmark"></i> Save
                    </button>
                    <button onclick="sharePost(this)" class="action-button share-button">
                        <i class="far fa-share-square"></i> Share
                    </button>
                </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
                <div class="comment-input-container">
                    <img src="path/to/user-avatar.png" alt="User" class="comment-avatar">
                    <input type="text" class="comment-input" placeholder="Write a comment...">
                    <button class="comment-submit">
                        <i class="far fa-paper-plane"></i>
                    </button>
                </div>
                <div class="comments-container"></div>
            </div>
        </div>
    `;
}

// Helper functions for creating different sections
function createMediaGalleryHTML(mediaElements) {
    if (mediaElements.length === 0) return '';
    
    return `
        <div class="media-gallery ${mediaElements.length === 1 ? 'single' : 'grid'}">
            ${mediaElements.join('')}
        </div>
    `;
}

function createTicketInfoHTML(ticketInfo) {
    if (ticketInfo.isFree) {
        return `
            <div class="ticket-banner free">
                <i class="fas fa-ticket-alt"></i>
                <span>Free Entry</span>
            </div>
        `;
    }

    return `
        <div class="ticket-tiers">
            <h3>Ticket Information</h3>
            <div class="tier standard">
                <div class="tier-header">
                    <span class="tier-name">Standard Entry</span>
                    <span class="tier-price">R${ticketInfo.tiers.standard.price}</span>
                </div>
                <div class="tier-availability">
                    ${ticketInfo.tiers.standard.quantity} tickets available
                </div>
            </div>
            ${ticketInfo.tiers.vip ? createVIPTierHTML(ticketInfo.tiers.vip, 'VIP') : ''}
            ${ticketInfo.tiers.vvip ? createVIPTierHTML(ticketInfo.tiers.vvip, 'VVIP') : ''}
        </div>
    `;
}

function createVIPTierHTML(tier, type) {
    return `
        <div class="tier ${type.toLowerCase()}">
            <div class="tier-header">
                <span class="tier-name">${type}</span>
                <div class="tier-pricing">
                    <div class="price-breakdown">
                        <span>Ticket: R${tier.price}</span>
                        <span>Entry Fee: R${tier.entryFee}</span>
                    </div>
                    <span class="total-price">Total: R${tier.totalPrice}</span>
                </div>
            </div>
            <div class="tier-availability">
                ${tier.quantity} tickets available
            </div>
            <div class="tier-perks">
                <i class="fas fa-star"></i> ${tier.perks}
            </div>
        </div>
    `;
}

function createLineupHTML(lineup) {
    if (!lineup || lineup.length === 0) return '';

    return `
        <div class="lineup-section">
            <h3>Event Line-up</h3>
            <div class="lineup-timeline">
                ${lineup.map(performer => `
                    <div class="lineup-item">
                        <span class="time">${performer.time}</span>
                        <div class="performer-info">
                            <span class="name">${performer.name}</span>
                            <span class="role">${performer.role}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function categorizeHappenings() {
    const now = new Date();
    const allPosts = document.querySelectorAll('#task-list li');
    const weekly = [];
    const monthly = [];
    const yearly = [];

    allPosts.forEach(post => {
        const dateStr = post.querySelector('[data-time]').dataset.time;
        const eventDate = new Date(dateStr);
        const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

        const eventSummary = createEventSummary(post);

        if (diffDays <= 7) {
            weekly.push(eventSummary);
        } else if (diffDays <= 30) {
            monthly.push(eventSummary);
        } else {
            yearly.push(eventSummary);
        }
    });

    updateHappeningsList('weekly-happenings', weekly);
    updateHappeningsList('monthly-happenings', monthly);
    updateHappeningsList('yearly-happenings', yearly);
}

function createEventSummary(post) {
    const title = post.querySelector('.post-title').textContent;
    const date = post.querySelector('[data-time]').dataset.time;
    const venue = post.querySelector('.detail-value').textContent;

    return `
        <div class="happening-item">
            <div class="happening-date">${formatDate(new Date(date))}</div>
            <div class="happening-title">${title}</div>
            <div class="happening-venue">${venue}</div>
        </div>
    `;
}

function updateHappeningsList(id, events) {
    const container = document.getElementById(id);
    if (events.length === 0) {
        container.innerHTML = '<div class="no-events">No upcoming events</div>';
    } else {
        container.innerHTML = events.join('');
    }
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Call this after adding new posts
function refreshHappenings() {
    categorizeHappenings();
}

// Update UI based on auth state
function updateUIForAuth() {
    const user = userManager.currentUser;
    const authButtons = document.querySelectorAll('.auth-dependent');
    const profileSection = document.querySelector('.profile-section');

    if (user) {
        // Update profile section
        document.querySelector('.profile-name').textContent = user.username;
        document.querySelector('.profile-avatar').src = user.avatar;
        document.querySelector('.stat-value.posts').textContent = user.posts.length;
        document.querySelector('.stat-value.saved').textContent = user.savedEvents.length;

        // Show auth-dependent elements
        authButtons.forEach(btn => btn.style.display = 'block');
        profileSection.style.display = 'block';
    } else {
        // Hide auth-dependent elements
        authButtons.forEach(btn => btn.style.display = 'none');
        profileSection.style.display = 'none';
    }
}

function validateLoginForm() {
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    let isValid = true;

    // Reset previous errors
    clearErrors();

    // Email validation
    if (!email.value) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    }

    // Password validation
    if (!password.value) {
        showError(password, 'Password is required');
        isValid = false;
    }

    return isValid;
}

function validateRegisterForm() {
    const fullName = document.getElementById('regFullName');
    const email = document.getElementById('regEmail');
    const phone = document.getElementById('regPhone');
    const password = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('regConfirmPassword');
    let isValid = true;

    // Reset previous errors
    clearErrors();

    // Full Name validation
    if (!fullName.value.trim()) {
        showError(fullName, 'Full name is required');
        isValid = false;
    }

    // Email validation
    if (!email.value) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    }

    // Phone validation
    if (!phone.value) {
        showError(phone, 'Phone number is required');
        isValid = false;
    } else if (!isValidPhone(phone.value)) {
        showError(phone, 'Please enter a valid phone number');
        isValid = false;
    }

    // Password validation
    if (!password.value) {
        showError(password, 'Password is required');
        isValid = false;
    } else if (password.value.length < 8) {
        showError(password, 'Password must be at least 8 characters');
        isValid = false;
    }

    // Confirm Password validation
    if (password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match');
        isValid = false;
    }

    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    formGroup.appendChild(error);
}

function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        const error = group.querySelector('.error-message');
        if (error) error.remove();
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

// Update event listeners
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateLoginForm()) {
        // Proceed with login
        const submitButton = this.querySelector('.auth-submit');
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            // Add your login logic here
        }, 1500);
    }
});

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateRegisterForm()) {
        // Proceed with registration
        const submitButton = this.querySelector('.auth-submit');
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            // Add your registration logic here
        }, 1500);
    }
});