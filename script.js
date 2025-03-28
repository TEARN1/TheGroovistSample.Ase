// Firebase Initialization (assuming firebaseConfig.js is set up correctly)
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// UI Elements
const signOutButton = document.getElementById('signOutButton');
const browseAsGuestButton = document.getElementById('browseAsGuestButton');
const eventForm = document.getElementById('eventForm');
const jobForm = document.getElementById('jobForm');
const postCommentButton = document.getElementById('postCommentButton');
const sendMessageButton = document.getElementById('sendMessageButton');

const recommendedDiv = document.getElementById('recommended');
const chatRemindersDiv = document.getElementById('chatReminders');
const groupChatsDiv = document.getElementById('groupChats');
const groupChatMessages = document.getElementById('groupChatMessages');
const groupChatMessageInput = document.getElementById('groupChatMessageInput');
const sendGroupChatMessageButton = document.getElementById('sendGroupChatMessage');
let currentGroupId = null;

// Authentication State Change Listener
auth.onAuthStateChanged(user => {
  updateUIOnAuthChange(user);
});

// Function to Update UI based on Authentication State
function updateUIOnAuthChange(user) {
  // ... (UI update logic remains the same) ...
}

// Sign Up Function
document.getElementById('signUpForm').addEventListener('submit', e => {
  // ... (Sign up logic remains the same) ...
});

// Sign In Function
document.getElementById('signInForm').addEventListener('submit', e => {
  // ... (Sign in logic remains the same) ...
});

// Sign Out Function
signOutButton.addEventListener('click', () => {
  // ... (Sign out logic remains the same) ...
});

// Error Handling Function
function handleError(error) {
  // ... (handleError function remains the same) ...
}

// Load Events Function (Implemented)
function loadEvents() {
  loadEventsPage();
}

function openDirections(location) {
  // ... (openDirections function remains the same) ...
}

// Load Jobs Function (Implemented)
function loadJobs() {
  loadJobsPage();
}

// Load Videos Function (Implemented)
function loadVideos() {
  // ... (loadVideos function remains the same) ...
}

// Load Comments Function (Implemented)
function loadComments() {
  // ... (loadComments function remains the same) ...
}

// Post Comment Function
postCommentButton.addEventListener('click', () => {
  // ... (postComment function remains the same) ...
});

// Load Contacts Function (Implemented)
function loadContacts() {
  // ... (loadContacts function remains the same) ...
}

// Setup Chat Function (Implemented)
function setupChat() {
  // ... (setupChat function remains the same) ...
}

// Load Messages Function (Implemented)
function loadMessages(contactUid) {
  // ... (loadMessages function remains the same) ...
}

// Send Message Function (Implemented)
sendMessageButton.addEventListener('click', () => {
  // ... (sendMessage function remains the same) ...
});

// Browse as Guest Button Functionality
browseAsGuestButton.addEventListener('click', () => {
  // ... (browseAsGuestButton logic remains the same) ...
});

// Event Submission Function (Implemented)
eventForm.addEventListener('submit', (e) => {
  // ... (eventForm submit event remains the same) ...
});

// Job Submission Function (Implemented)
jobForm.addEventListener('submit', (e) => {
  // ... (jobForm submit event remains the same) ...
});

// Playful Language Implementation (Example)
document.getElementById('events').querySelector('h2').textContent = "What's the Vibe? Upcoming Events";
document.getElementById('jobPostings').querySelector('h2').textContent = "Land Your Dream Gig! Job Postings";

// Implement Event Reminders (Implemented)
function setupEventReminders() {
  // ... (setupEventReminders function remains the same) ...
}

// Implement Lazy Loading (Implemented)
const lazyImages = document.querySelectorAll('img.lazy');
const lazyVideos = document.querySelectorAll('video.lazy');

const observer = new IntersectionObserver((entries, observer) => {
  // ... (lazy loading logic remains the same) ...
});

lazyImages.forEach(img => {
  observer.observe(img);
});

lazyVideos.forEach(video => {
  observer.observe(video);
});

// Implement Form Validation (Implemented)
eventForm.addEventListener('submit', (e) => {
  // ... (event form validation remains the same) ...
});

jobForm.addEventListener('submit', (e) => {
  // ... (job form validation remains the same) ...
});

// Implement Robust Error Handling (Implemented)
function handleError(error) {
  // ... (handleError function remains the same) ...
}

// Implement Glass Effects for Comments (Implemented - CSS needed)
function applyGlassEffect(commentElement, popularity) {
  // ... (applyGlassEffect function remains the same) ...
}

// Implement Recommended for You Feature (Implemented)
function loadRecommended() {
  // ... (loadRecommended function remains the same) ...
}

// Implement Pinned Chats (Implemented)
function pinChat(contactUid) {
  // ... (pinChat function remains the same) ...
}

// Implement Chat Reminder System (Implemented)
function setupChatReminders() {
  // ... (setupChatReminders function remains the same) ...
}

// Implement Media Sharing for Chats (Implemented)
function shareMedia(mediaFile) {
  // ... (shareMedia function remains the same) ...
}

// Implement Group Chats (Implemented)
function createGroupChat(users, groupName) {
  // ... (createGroupChat function remains the same) ...
}

// Implement Live Studio (Implemented)
async function startLiveStudio() {
  // ... (startLiveStudio function remains the same) ...
}

document.getElementById('startLiveButton').addEventListener('click', startLiveStudio);

// Implement Media Sharing for Comments (Implemented)
function shareMediaComment(mediaFile) {
  // ... (shareMediaComment function remains the same) ...
}

// Display Chat Reminders (Implemented)
function displayChatReminders(messages) {
  // ... (displayChatReminders function remains the same) ...
}

// Display Recommended Events and Jobs (Implemented)
function displayRecommended(events, jobs) {
  // ... (displayRecommended function remains the same) ...
}

// Display Group Chats (Implemented)
function displayGroupChats() {
  // ... (displayGroupChats function remains the same) ...
}

// Load Group Chat function.
function loadGroupChat(groupId) {
  currentGroupId = groupId;
  groupChatMessages.innerHTML = '<p>Loading messages...</p>';
  db.collection('groups').doc(groupId).get().then(doc => {
    if (doc.exists) {
      setupGroupChatRealtimeUpdates(groupId); // Use the real-time update function
    } else {
      alert("Group chat not found");
    }
  }).catch(error => {
    groupChatMessages.innerHTML = "<p>Error loading group chat messages.</p>";
    console.error("Error loading group chat messages", error);
  });
}

// Send Group Chat Message
sendGroupChatMessageButton.addEventListener('click', () => {
  if (!auth.currentUser || !currentGroupId) return;

  const messageText = groupChatMessageInput.value;
  if (!messageText.trim()) return;

  db.collection('groups').doc(currentGroupId).collection('messages').add({
    text: messageText,
    sender: auth.currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    groupChatMessageInput.value = '';
  }).catch(error => {
    handleError(error);
  });
});

// Improved Error Handling with User Feedback
function handleError(error) {
  // ... (handleError function remains the same) ...
}

// Improved Load Events with Loading Indicator
function loadEventsPage() {
  // ... (loadEventsPage function remains the same) ...
}
// Improved Load Jobs with Loading Indicator
function loadJobsPage() {
  // ... (loadJobsPage function remains the same) ...
}

// Improved Load Videos with Loading Indicator
function loadVideos() {
  // ... (loadVideos function remains the same) ...
}

// Improved Load comments with Loading Indicator
function loadComments() {
  // ... (loadComments function remains the same) ...
}

// Initial calls
setupEventReminders();
loadRecommended();
setupChatReminders();
displayGroupChats();

// 1. Pagination for Events and Jobs
let eventsPage = 0;
let jobsPage = 0;
const eventsPerPage = 5;
const jobsPerPage = 5;

// Add pagination buttons (example - adjust as needed)
const eventsPagination = document.getElementById('eventsPagination');
const jobsPagination = document.getElementById('jobsPagination');

// Example: Next/Previous buttons (add toyour HTML)
eventsPagination.innerHTML = `
    <button id="prevEvents">Previous</button>
    <button id="nextEvents">Next</button>
`;

jobsPagination.innerHTML = `
    <button id="prevJobs">Previous</button>
    <button id="nextJobs">Next</button>
`;

document.getElementById('nextEvents').addEventListener('click', () => {
  eventsPage++;
  loadEventsPage();
});

document.getElementById('prevEvents').addEventListener('click', () => {
  if (eventsPage > 0) {
    eventsPage--;
    loadEventsPage();
  }
});

document.getElementById('nextJobs').addEventListener('click', () => {
  jobsPage++;
  loadJobsPage();
});

document.getElementById('prevJobs').addEventListener('click', () => {
  if (jobsPage > 0) {
    jobsPage--;
    loadJobsPage();
  }
});

// 2. Search Functionality for Events and Jobs
const eventSearchInput = document.getElementById('eventSearch');
const jobSearchInput = document.getElementById('jobSearch');

eventSearchInput.addEventListener('input', () => {
  searchEvents(eventSearchInput.value);
});

jobSearchInput.addEventListener('input', () => {
  searchJobs(jobSearchInput.value);
});

function searchEvents(searchTerm) {
  // ... (searchEvents function remains the same) ...
}

function searchJobs(searchTerm) {
  // ... (searchJobs function remains the same) ...
}

// 3. Filtering for Events and Jobs
const eventFilterCategory = document.getElementById('eventFilterCategory');
const jobFilterCategory = document.getElementById('jobFilterCategory');

eventFilterCategory.addEventListener('change', () => {
  filterEvents(eventFilterCategory.value);
});

jobFilterCategory.addEventListener('change', () => {
  filterJobs(jobFilterCategory.value);
});

function filterEvents(category) {
  // ... (filterEvents function remains the same) ...
}

function filterJobs(category) {
  // ... (filterJobs function remains the same) ...
}

// 4. Sorting for Events and Jobs
const eventSortBy = document.getElementById('eventSortBy');
const jobSortBy = document.getElementById('jobSortBy');

eventSortBy.addEventListener('change', () => {
  sortEvents(eventSortBy.value);
});

jobSortBy.addEventListener('change', () => {
  sortJobs(jobSortBy.value);
});

function sortEvents(sortBy) {
  // ... (sortEvents function remains the same) ...
}

function sortJobs(sortBy) {
  // ... (sortJobs function remains the same) ...
}

// 5. Real-time updates for comments
function setupCommentRealtimeUpdates() {
  db.collection('comments').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    snapshot.forEach(doc => {
      const comment = doc.data();
      const commentElement = document.createElement('div');
      commentElement.innerHTML = `
                <p><strong>${comment.user}:</strong> ${comment.text}</p>
            `;
      commentsList.appendChild(commentElement);
    });
    if (snapshot.empty) {
      commentsList.innerHTML = "<p>No Comments found.</p>"
    }
  });
}

// Call the function to setup real-time updates
setupCommentRealtimeUpdates();

// 6. Real-time updates for group chat messages
function setupGroupChatRealtimeUpdates(groupId) {
  if (!groupId) return;
  db.collection('groups').doc(groupId).collection('messages').orderBy('timestamp').onSnapshot(snapshot => {
    groupChatMessages.innerHTML = '';
    snapshot.forEach(doc => {
      const message = doc.data();
      const messageElement = document.createElement('p');
      messageElement.innerHTML = `<strong>${message.sender}:</strong> ${message.text}`;
      groupChatMessages.appendChild(messageElement);
    });
    if (snapshot.empty) {
      groupChatMessages.innerHTML = "<p>No messages in this group yet.</p>"
    }
  });
}

// 7. Image and Video Previews before Uploading
const eventImagePreview = document.getElementById('eventImagePreview');
const eventVideoPreview = document.getElementById('eventVideoPreview');
const jobImagePreview = document.getElementById('jobImagePreview');
const jobVideoPreview = document.getElementById('jobVideoPreview');

eventForm.eventImage.addEventListener('change', (e) => {
  previewMedia(e.target.files[0], eventImagePreview);
});

eventForm.eventVideo.addEventListener('change', (e) => {
  previewMedia(e.target.files[0], eventVideoPreview);
});

jobForm.jobImage.addEventListener('change', (e) => {
  previewMedia(e.target.files[0], jobImagePreview);
});

jobForm.jobVideo.addEventListener('change', (e) => {
  previewMedia(e.target.files[0], jobVideoPreview);
});

function previewMedia(file, previewElement) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type.startsWith('image')) {
        previewElement.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px;">`;
      } else if (file.type.startsWith('video')) {
        previewElement.innerHTML = `<video src="${e.target.result}" style="max-width: 200px; max-height: 200px;" controls></video>`;
      }
    };
    reader.readAsDataURL(file);
  } else {
    previewElement.innerHTML = '';
  }
}

// 8. User Profile Management
const profileForm = document.getElementById('profileForm');
const profileImagePreview = document.getElementById('profileImagePreview');

profileForm.profileImage.addEventListener('change', (e) => {
  previewMedia(e.target.files[0], profileImagePreview);
});

profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!auth.currentUser) return;

  const name = profileForm.profileName.value;
  const interests = profileForm.profileInterests.value.split(',').map(item => item.trim()); // Assuming interests are comma-separated

  let profileData = {
    name: name,
    interests: interests
  };

  if (profileForm.profileImage.files[0]) {
    const file = profileForm.profileImage.files[0];
    const storageRef = storage.ref(`users/${auth.currentUser.uid}/profileImage`);
    const uploadTask = storageRef.put(file);

    uploadTask.then(snapshot => {
      return snapshot.ref.getDownloadURL();
    }).then(downloadURL => {
      profileData.profileImageUrl = downloadURL;
      updateUserProfile(profileData);
    }).catch(error => {
      handleError(error);
    });
  } else {
    updateUserProfile(profileData);
  }
});

function updateUserProfile(profileData) {
  if (!auth.currentUser) return;
  db.collection('users').doc(auth.currentUser.uid).update(profileData).then(() => {
    alert('Profile updated successfully.');
  }).catch(error => {
    handleError(error);
  });
}

function loadUserProfile() {
  if (!auth.currentUser) return;
  db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
    if (doc.exists) {
      const userData = doc.data();
      profileForm.profileName.value = userData.name || '';
      profileForm.profileInterests.value = userData.interests ? userData.interests.join(', ') : '';
      if (userData.profileImageUrl) {
        profileImagePreview.innerHTML = `<img src="${userData.profileImageUrl}" style="max-width: 200px; max-height: 200px;">`;
      }
    }
  }).catch(error => {
    handleError(error);
  });
}

//Load the profile initially when user is logged in
if (auth.currentUser) {
  loadUserProfile();
}

//9. Report Content Functionality
function reportContent(contentId, contentType, reportReason) {
  if (!auth.currentUser) {
    alert("You must be logged in to report content.");
    return;
  }

  db.collection('reports').add({
    contentId: contentId,
    contentType: contentType,
    reportReason: reportReason,
    reporterUid: auth.currentUser.uid,
    timestamp: firebase.
firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Content reported successfully.");
  }).catch(error => {
    handleError(error);
  });
}

// 10. Admin Panel (Basic Implementation)
const adminPanel = document.getElementById('adminPanel'); // Add this to HTML
const adminUsersList = document.getElementById('adminUsersList'); // Add this to HTML
const adminReportsList = document.getElementById('adminReportsList'); // Add this to HTML

function setupAdminPanel() {
  if (!auth.currentUser) return;

  db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
    if (doc.exists && doc.data().isAdmin) {
      adminPanel.style.display = 'block';
      loadAdminUsers();
      loadAdminReports();
    } else {
      adminPanel.style.display = 'none';
    }
  }).catch(error => {
    handleError(error);
  });
}

function loadAdminUsers() {
  db.collection('users').get().then(snapshot => {
    adminUsersList.innerHTML = '';
    snapshot.forEach(doc => {
      const user = doc.data();
      const userElement = document.createElement('li');
      userElement.textContent = `${user.name} (${doc.id})`;
      adminUsersList.appendChild(userElement);
    });
  }).catch(error => {
    handleError(error);
  });
}

function loadAdminReports() {
  db.collection('reports').get().then(snapshot => {
    adminReportsList.innerHTML = '';
    snapshot.forEach(doc => {
      const report = doc.data();
      const reportElement = document.createElement('li');
      reportElement.textContent = `Content: ${report.contentType} (${report.contentId}), Reason: ${report.reportReason}, Reporter: ${report.reporterUid}`;
      adminReportsList.appendChild(reportElement);
    });
  }).catch(error => {
    handleError(error);
  });
}

// Call setupAdminPanel when the user is authenticated
if (auth.currentUser) {
  setupAdminPanel();
}

// 11. Notifications System (Basic Implementation)
function sendNotification(userId, message) {
  db.collection('notifications').add({
    userId: userId,
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    read: false
  }).then(() => {
    console.log('Notification sent.');
  }).catch(error => {
    handleError(error);
  });
}

function loadNotifications() {
  if (!auth.currentUser) return;

  db.collection('notifications').where('userId', '==', auth.currentUser.uid).orderBy('timestamp', 'desc').get().then(snapshot => {
    const notificationsList = document.getElementById('notificationsList'); // Add this to HTML
    notificationsList.innerHTML = '';
    snapshot.forEach(doc => {
      const notification = doc.data();
      const notificationElement = document.createElement('li');
      notificationElement.textContent = notification.message;
      if (!notification.read) {
        notificationElement.style.fontWeight = 'bold'; // Mark unread notifications
      }
      notificationsList.appendChild(notificationElement);

      // Mark notification as read
      db.collection('notifications').doc(doc.id).update({ read: true });
    });
  }).catch(error => {
    handleError(error);
  });
}

// Call loadNotifications when the user is authenticated
if (auth.currentUser) {
  loadNotifications();
}

// Initial calls
setupEventReminders();
loadRecommended();
setupChatReminders();
displayGroupChats();

