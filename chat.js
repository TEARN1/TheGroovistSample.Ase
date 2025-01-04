class ChatSystem {
    constructor() {
        this.messages = LocalStorage.getMessages() || [];
        this.activeChat = null;
        this.initializeChat();
    }

    initializeChat() {
        this.renderChatUI();
        this.bindChatEvents();
        this.checkNewMessages();
    }

    renderChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-toggle">
                <i class="fas fa-comments"></i>
                <span class="message-badge">0</span>
            </div>
            
            <div class="chat-panel">
                <div class="chat-header">
                    <h3>Messages</h3>
                    <button class="minimize-chat">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
                
                <div class="chat-contacts">
                    <!-- Contacts will be loaded here -->
                </div>
                
                <div class="chat-messages">
                    <div class="messages-container"></div>
                    <div class="message-input">
                        <input type="text" placeholder="Type a message...">
                        <button class="send-message">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);
    }

    sendMessage(text, recipientId) {
        const message = {
            id: Date.now(),
            senderId: LocalStorage.getCurrentUser().id,
            recipientId,
            text,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.messages.push(message);
        LocalStorage.saveMessages(this.messages);
        this.renderMessage(message);
        this.updateUnreadCount();
    }
} 