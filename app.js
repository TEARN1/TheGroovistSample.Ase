let savedPosts = [];

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

function showSavedPosts() {
    let savedPostsSection = document.getElementById('saved-posts-section');
    let taskListSection = document.getElementById('todo-app');
    if (savedPostsSection.style.display === 'none') {
        savedPostsSection.style.display = 'block';
        taskListSection.style.display = 'none';
        loadSavedPosts();
    } else {
        savedPostsSection.style.display = 'none';
        taskListSection.style.display = 'block';
    }
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
        <strong>TEARN</strong><br>
        ${taskText}<br>
        <span class="timestamp" data-time="${timestamp.toISOString()}">${timeSince(timestamp)}</span><br>
        <strong>Date & Time:</strong> ${new Date(datetime).toLocaleString()}<br>
        <strong>Event Type:</strong> ${eventType}<br>
        <strong>Ticket Price:</strong> ${ticketPrice === '' ? 'Free' : 'R' + ticketPrice}
    `;

    if (imgFile) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.marginTop = '10px';
            img.style.borderRadius = '8px';
            newTask.appendChild(img);

            newTask.innerHTML += `
                <div class="comment-section">
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                </div>
            `;

            let likeButton = document.createElement('button');
            likeButton.textContent = 'Like';
            likeButton.classList.add('like-button');
            let likeCount = document.createElement('div');
            likeCount.textContent = '0 Likes';
            likeCount.classList.add('like-count');
            likeButton.onclick = function() {
                let count = parseInt(likeCount.textContent.split(' ')[0]);
                likeCount.textContent = `${count + 1} Likes`;
            };

            let removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = function() {
                taskList.removeChild(newTask);
            };

            let saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.classList.add('save-button');
            saveButton.onclick = function() {
                savePost(newTask);
            };

            newTask.appendChild(likeButton);
            newTask.appendChild(likeCount);
            newTask.appendChild(removeButton);
            newTask.appendChild(saveButton);

            let commentInput = newTask.querySelector('.comment-input');
            commentInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    let commentText = commentInput.value;
                    if (commentText !== '') {
                        addComment(newTask, commentText);
                        commentInput.value = '';
                    }
                }
            });
        };
        reader.readAsDataURL(imgFile);
    } else {
        newTask.innerHTML += `
            <div class="comment-section">
                <input type="text" class="comment-input" placeholder="Add a comment...">
            </div>
        `;

        let likeButton = document.createElement('button');
        likeButton.textContent = 'Like';
        likeButton.classList.add('like-button');
        let likeCount = document.createElement('div');
        likeCount.textContent = '0 Likes';
        likeCount.classList.add('like-count');
        likeButton.onclick = function() {
            let count = parseInt(likeCount.textContent.split(' ')[0]);
            likeCount.textContent = `${count + 1} Likes`;
        };

        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            taskList.removeChild(newTask);
        };

        let saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('save-button');
        saveButton.onclick = function() {
            savePost(newTask);
        };

        newTask.appendChild(likeButton);
        newTask.appendChild(likeCount);
        newTask.appendChild(removeButton);
        newTask.appendChild(saveButton);

        let commentInput = newTask.querySelector('.comment-input');
        commentInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                let commentText = commentInput.value;
                if (commentText !== '') {
                    addComment(newTask, commentText);
                    commentInput.value = '';
                }
            }
        });
    }

    taskList.insertBefore(newTask, taskList.firstChild);

    taskInput.value = '';
    datetimeInput.value = '';
    eventTypeInput.value = '';
    customEventInput.value = '';
    ticketPriceInput.value = '';
    imgInput.value = '';
    closeModal();
}

function addComment(task, commentText) {
    let commentSection = task.querySelector('.comment-section');
    let comment = document.createElement('div');
    comment.classList.add('comment');
    comment.innerHTML = `<div class="comment-text">${commentText}</div>
                         <div class="comment-likes">
                             <button class="comment-like-button">Like</button>
                             <span class="comment-like-count">0 Likes</span>
                             <button class="reply-button">Reply</button>
                         </div>
                         <div class="replies"></div>
                         <input type="text" class="reply-input" placeholder="Write a reply..." style="display:none;">`;

    let likeButton = comment.querySelector('.comment-like-button');
    let likeCount = comment.querySelector('.comment-like-count');
    let replyButton = comment.querySelector('.reply-button');
    let replyInput = comment.querySelector('.reply-input');

    likeButton.onclick = function() {
        let count = parseInt(likeCount.textContent.split(' ')[0]);
        likeCount.textContent = `${count + 1} Likes`;
        sortComments(commentSection);
    };

    replyButton.onclick = function() {
        replyInput.style.display = 'block';
        replyInput.focus();
    };

    replyInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            let replyText = replyInput.value;
            if (replyText !== '') {
                addReply(comment, replyText);
                replyInput.value = '';
                replyInput.style.display = 'none';
            }
        }
    });

    commentSection.insertBefore(comment, commentSection.firstChild);
}

function addReply(comment, replyText) {
  let reply = document.createElement('div');
  reply.classList.add('reply');
  reply.innerHTML = `<div class="reply-text">${replyText}</div>
                     <div class="reply-likes">
                         <button class="reply-like-button">Like</button>
                         <span class="reply-like-count">0 Likes</span>
                     </div>`;

  let likeButton = reply.querySelector('.reply-like-button');
  let likeCount = reply.querySelector('.reply-like-count');

  likeButton.onclick = function() {
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
