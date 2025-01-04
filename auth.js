// User Management
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    // Register new user
    register(username, email, password) {
        // Check if user already exists
        if (this.users.find(user => user.username === username || user.email === email)) {
            throw new Error('Username or email already exists');
        }

        const newUser = {
            id: Date.now(),
            username,
            email,
            password, // In a real app, this should be hashed
            avatar: 'path/to/default-avatar.png',
            posts: [],
            savedEvents: [],
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));
        return newUser;
    }

    // Login user
    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (!user) {
            throw new Error('Invalid username or password');
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Update user profile
    updateProfile(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) return false;

        this.users[userIndex] = { ...this.users[userIndex], ...updates };
        localStorage.setItem('users', JSON.stringify(this.users));

        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }

        return true;
    }

    // Save event
    saveEvent(userId, eventId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return false;

        if (!user.savedEvents.includes(eventId)) {
            user.savedEvents.push(eventId);
            localStorage.setItem('users', JSON.stringify(this.users));
        }
        return true;
    }
}

// Initialize user manager
const userManager = new UserManager(); 