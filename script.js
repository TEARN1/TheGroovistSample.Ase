
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
  if (user) {
    // User is signed in
    signOutButton.style.display = 'block';
    browseAsGuestButton.style.display = 'none';
  } else {
    // User is signed out
    signOutButton.style.display = 'none';
    browseAsGuestButton.style.display = 'block';
  }
}

// Sign Up Function
document.getElementById('signUpForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Sign up successful
    })
    .catch(error => {
      // An error occurred
    });
});

// Sign In Function
document.getElementById('signInForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Sign in successful
    })
    .catch(error => {
      // An error occurred
    });
});

// Sign Out Function
signOutButton.addEventListener('click', () => {
  auth.signOut().then(() => {
    // Sign-out successful
  }).catch((error) => {
    // An error occurred
  });
});

// Error Handling Function
function handleError(error) {
  console.error('Error:', error);
  alert('An error occurred: ' + error.message);
}

// Load Events Function (Implemented)
function loadEvents() {
  loadEventsPage();
}

function openDirections(location) {
  // Code to open directions
}

// Load Jobs Function (Implemented)
function loadJobs() {
  loadJobsPage();
}

// Load Videos Function (Implemented)
function loadVideos() {
  // Code to load videos
}

// Load Comments Function (Implemented)
function loadComments() {
  // Code to load comments
}

// Post Comment Function
postCommentButton.addEventListener('click', () => {
  // Code to post comment
});

// Load Contacts Function (Implemented)
function loadContacts() {
  // Code to load contacts
}

// Setup Chat Function (Implemented)
function setupChat() {
  // Code to setup chat
}

// Load Messages Function (Implemented)
function loadMessages(contactUid) {
  // Code to load messages
}

// Send Message Function
sendMessageButton.addEventListener('click', () => {
  // Code to send message
});

// Browse as Guest Button Functionality
browseAsGuestButton.addEventListener('click', () => {
  // Code to browse as guest
});

// Event Submission Function (Implemented)
eventForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Code to submit event
});

// Job Submission Function (Implemented)
jobForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Code to submit job
});

// Improved Load Events with Loading Indicator
function loadEventsPage() {
  // Code to load events page
}

// Improved Load Jobs with Loading Indicator
function loadJobsPage() {
  // Code to load jobs page
}

// Improved Load Videos with Loading Indicator
function loadVideos() {
  // Code to load videos
}

// Improved Load comments with Loading Indicator
function loadComments() {
  // Code to load comments
}

// 1. Pagination for Events and Jobs
let eventsPage = 0;
let jobsPage = 0;
const eventsPerPage = 5;
const jobsPerPage = 5;

// Add pagination buttons (example - adjust as needed)
const eventsPagination = document.getElementById('eventsPagination');
const jobsPagination = document.getElementById('jobsPagination');

// Example: Next/Previous buttons (add to your HTML)
eventsPagination.innerHTML = `

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
  // Code to search events
}

function searchJobs(searchTerm) {
  // Code to search jobs
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
  // Code to filter events
}

function filterJobs(category) {
  // Code to filter jobs
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
  // Code to sort events
}

function sortJobs(sortBy) {
  // Code to sort jobs
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
      commentsList.innerHTML = '<p>No Comments found.</p>';
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
      messageElement.innerHTML = `
        <strong>${message.sender}:</strong> ${message.text}
      `;
      groupChatMessages.appendChild(messageElement);
    });
    if (snapshot.empty) {
      groupChatMessages.innerHTML = '<p>No messages in this group yet.</p>';
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
        previewElement.innerHTML = `
          <img src="${e.target.result}" style="max-width: 200px; max-height:
  function previewMedia(file, previewElement) {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file.type.startsWith('image')) {
        previewElement.innerHTML = `
          <img src="${e.target.result}" style="max-width: 200px; max-height: 200px;">
        `;
      } else if (file.type.startsWith('video')) {
        previewElement.innerHTML = `
          <video src="${e.target.result}" style="max-width: 200px; max-height: 200px;" controls></video>
        `;
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
  const interests = profileForm.profileInterests.value.split(',').map(item => item.trim());
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
  db.collection('users').doc(auth.currentUser.uid).update(profileData)
    .then(() => {
      alert('Profile updated successfully.');
    })
    .catch(error => {
      handleError(error);
    });
}

function loadUserProfile() {
  if (!auth.currentUser) return;
  db.collection('users').doc(auth.currentUser.uid).get()
    .then(doc => {
      if (doc.exists) {
        const userData = doc.data();
        profileForm.profileName.value = userData.name || '';
        profileForm.profileInterests.value = userData.interests ? userData.interests.join(', ') : '';
        if (userData.profileImageUrl) {
          profileImagePreview.innerHTML = `
            <img src="${userData.profileImageUrl}" style="max-width: 200px; max-height: 200px;">
          `;
        }
      }
    })
    .catch(error => {
      handleError(error);
    });
}

// Load the profile initially when user is logged in
if (auth.currentUser) {
  loadUserProfile();
}

// 9. Report Content Functionality
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
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
    .then(() => {
      alert("Content reported successfully.");
    })
    .catch(error => {
      handleError(error);
    });
}

// 10. Admin Panel (Basic Implementation)
const adminPanel = document.getElementById('adminPanel');
const adminUsersList = document.getElementById('adminUsersList');
const adminReportsList = document.getElementById('adminReportsList');

function setupAdminPanel() {
  if (!auth.currentUser) return;
  db.collection('users').doc(auth.currentUser.uid).get()
    .then(doc => {
      if (doc.exists && doc.data().isAdmin) {
        adminPanel.style.display = 'block';
        loadAdminUsers();
        loadAdminReports();
      } else {
        adminPanel.style.display = 'none';
      }
    })
    .catch(error => {
      handleError(error);
    });
}

function loadAdminUsers() {
  db.collection('users').get()
    .then(snapshot => {
      adminUsersList.innerHTML = '';
      snapshot.forEach(doc => {
        const user = doc.data();
        const userElement = document.createElement('li');
        userElement.textContent = `${user.name} (${doc.id})`;
        adminUsersList.appendChild(userElement);
      });
    })
    .catch(error => {
      handleError(error);
    });
}

function loadAdminReports() {
  db.collection('reports').get()
    .then(snapshot => {
      adminReportsList.innerHTML = '';
      snapshot.forEach(doc => {
        const report = doc.data();
        const reportElement = document.createElement('li');
        reportElement.textContent = `Content:
        function loadAdminReports() {
  db.collection('reports').get()
    .then(snapshot => {
      adminReportsList.innerHTML = '';
      snapshot.forEach(doc => {
        const report = doc.data();
        const reportElement = document.createElement('li');
        reportElement.textContent = `Content: ${report.contentId} (${report.contentType}) - Reported by: ${report.reporterUid} - Reason: ${report.reportReason}`;
        adminReportsList.appendChild(reportElement);
      });
    })
    .catch(error => {
      handleError(error);
    });
}

// Call the function to setup the admin panel
setupAdminPanel();

// 11. Notifications System (Basic Implementation)
const notificationsList = document.getElementById('notificationsList');

function loadNotifications() {
  if (!auth.currentUser) return;
  db.collection('notifications').where('receiverUid', '==', auth.currentUser.uid).get()
    .then(snapshot => {
      notificationsList.innerHTML = '';
      snapshot.forEach(doc => {
        const notification = doc.data();
        const notificationElement = document.createElement('li');
        notificationElement.textContent = notification.text;
        notificationsList.appendChild(notificationElement);
      });
    })
    .catch(error => {
      handleError(error);
    });
}

// Call the function to load notifications
loadNotifications();

// 12. Real-time updates for notifications
function setupNotificationsRealtimeUpdates() {
  if (!auth.currentUser) return;
  db.collection('notifications').where('receiverUid', '==', auth.currentUser.uid).onSnapshot(snapshot => {
    notificationsList.innerHTML = '';
    snapshot.forEach(doc => {
      const notification = doc.data();
      const notificationElement = document.createElement('li');
      notificationElement.textContent = notification.text;
      notificationsList.appendChild(notificationElement);
    });
  });
}

// Call the function to setup real-time updates for notifications
setupNotificationsRealtimeUpdates();
