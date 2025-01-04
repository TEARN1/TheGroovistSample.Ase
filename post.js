class PostManager {
    constructor() {
        this.posts = LocalStorage.getEvents();
        this.initializePosts();
    }

    initializePosts() {
        this.renderPosts();
        this.bindPostEvents();
    }

    renderPosts() {
        const postsContainer = document.getElementById('task-list');
        postsContainer.innerHTML = this.posts.map(post => this.createPostHTML(post)).join('');
    }

    createPostHTML(post) {
        return `
            <div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-author">
                        <img src="${post.authorAvatar || 'default-avatar.jpg'}" alt="Author">
                        <div class="author-info">
                            <span class="author-name">${post.authorName}</span>
                            <span class="post-time">${this.formatTime(post.createdAt)}</span>
                        </div>
                    </div>
                    <div class="post-options">
                        <button onclick="postManager.togglePostMenu(${post.id})">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                        <div class="post-menu" id="menu-${post.id}">
                            ${this.createPostMenuOptions(post)}
                        </div>
                    </div>
                </div>

                <div class="post-content">
                    <h2 class="post-title">${post.title}</h2>
                    
                    ${this.createMediaGallery(post.media)}
                    
                    <div class="event-details">
                        <div class="detail-item">
                            <i class="far fa-calendar-alt"></i>
                            <span>${new Date(post.datetime).toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${post.venue}</span>
                            <button onclick="getDirections('${post.venue}')" class="direction-btn">
                                <i class="fas fa-directions"></i> Get Directions
                            </button>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tag"></i>
                            <span>${post.eventType}</span>
                        </div>
                    </div>

                    ${this.createTicketSection(post.tickets)}
                    
                    ${this.createLineupSection(post.lineup)}
                </div>

                <div class="post-engagement">
                    <div class="engagement-stats">
                        <span>${post.likes.length} likes</span>
                        <span>${post.comments.length} comments</span>
                        <span>${post.shares} shares</span>
                    </div>
                    
                    <div class="engagement-actions">
                        <button onclick="postManager.toggleLike(${post.id})" 
                                class="action-btn ${post.likes.includes(currentUser?.id) ? 'liked' : ''}">
                            <i class="fas fa-heart"></i> Like
                        </button>
                        <button onclick="postManager.toggleComments(${post.id})" class="action-btn">
                            <i class="fas fa-comment"></i> Comment
                        </button>
                        <button onclick="postManager.sharePost(${post.id})" class="action-btn">
                            <i class="fas fa-share"></i> Share
                        </button>
                        <button onclick="postManager.savePost(${post.id})" 
                                class="action-btn ${post.saved ? 'saved' : ''}">
                            <i class="fas fa-bookmark"></i> Save
                        </button>
                    </div>
                </div>

                <div class="comments-section" id="comments-${post.id}">
                    ${this.createCommentsSection(post.comments)}
                </div>
            </div>
        `;
    }

    // ... more post methods
} 