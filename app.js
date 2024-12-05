let savedPosts = [];
let likedPosts = [];
let notifications = [];
let users = [];

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

function addTask() {
    let taskInput = document.getElementById('new-task');
    let datetimeInput = document.getElementById('event-datetime');
    let eventTypeInput = document.getElementById('event-type');
    let customEventInput = document.getElementById('custom-event-type');
    let ticketPriceInput = document.getElementById('ticket-price');
    let imgInput = document.getElementById('img-upload');
    let taskText = taskInput.value;
    let datetime = datetimeInput.value;
    let eventType = eventTypeInput.value === 'other' ? customEventInput.value : eventTypeInput.value;
    let ticketPrice = ticketPriceInput.value;
    let imgFile = imgInput.files[0];

    if (taskText === '' || datetime === '' || eventType === '') {
        alert('Please fill in all required fields.');
        return;
    }

    let taskList = document.getElementById('task-list');
    let newTask = document.createElement('li');
    let timestamp = new Date();
    newTask.innerHTML = `
        <div class="post-header">
            <span class="author">TEARN</span>
            <span class="timestamp" data-time="${timestamp.toISOString()}">${timeSince(timestamp)}</span>
        </div>
        <div>${taskText}</div>
        ${imgFile ? `<img src="${URL.createObjectURL(imgFile)}" alt="Event Image">` : ''}
        <div class="post-details">
            <strong>Date & Time:</strong> ${new Date(datetime).toLocaleString()}<br>
            <strong>Event Type:</strong> ${eventType}<br>
            <strong>Ticket Price:</strong> ${ticketPrice === '' ? 'Free' : 'R' + ticketPrice}
        </div>
        <div class="post-actions">
            <button class="like-button action-button" onclick="likePost(this.parentElement.parentElement)">Like</button>
            <button class="save-button action-button" onclick="savePost(this.parentElement.parentElement)">Save</button>
            <button class="delete-button action-button" onclick="deletePost(this.parentElement.parentElement)">Delete</button>
            <button class="comment-button action-button" onclick="toggleCommentInput(this)">Comment</button>
        </div>
        <div class="comment-section">
            <input type="text" class="comment-input" placeholder="Add a comment...">
        </div>
    `;

    newTask.querySelector('.comment-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            let commentText = this.value;
            if (commentText !== '') {
                addComment(newTask, commentText);
                this.value = '';
                addNotification('Someone commented on your post!');
            }
        }
    });

    taskList.insertBefore(newTask, taskList.firstChild);

    taskInput.value = '';
    datetimeInput.value = '';
    eventTypeInput.value = '';
    customEventInput.value = '';
    ticketPriceInput.value = '';
    imgInput.value = '';
    closeModal();
}

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

  comments.sort((a, b) => {
      let aLikes = parseInt(a.querySelector('.comment-like-count').textContent.split(' ')[0]);
      let bLikes = parseInt(b.querySelector('.comment-like-count').textContent.split(' ')[0]);
      return bLikes - aLikes;
  });

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
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('fullName').value = '';
  document.getElementById('age').value = '';
  document.getElementById('gender').value = '';
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function registerUser() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let fullName = document.getElementById('fullName').value;
  let age = document.getElementById('age').value;
  let gender = document.getElementById('gender').value;

  if (username === '' || password === '' || fullName === '' || age === '' || gender === '') {
      alert('Please fill in all fields.');
      return;
  }

  let user = { username, password, fullName, age, gender };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
  alert('Registration successful!');
  closeLoginModal();
  showProfile();
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
  } else {
      alert('Invalid username or password. Please try again.');
  }
}

function logoutUser() {
  localStorage.removeItem('currentUser');
  alert('Logout successful!');
  showProfile();
}

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
