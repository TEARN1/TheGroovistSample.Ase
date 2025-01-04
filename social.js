class SocialIntegration {
    constructor() {
        this.initializeSocial();
    }

    initializeSocial() {
        this.loadSocialScripts();
        this.bindSocialEvents();
    }

    shareEvent(event) {
        const shareData = {
            title: event.title,
            text: `Check out this event: ${event.title} at ${event.venue}`,
            url: window.location.origin + '/event/' + event.id
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch(console.error);
        } else {
            this.showShareDialog(shareData);
        }
    }

    showShareDialog(shareData) {
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';
        dialog.innerHTML = `
            <div class="share-options">
                <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}')">
                    <i class="fab fa-facebook"></i> Facebook
                </button>
                <button onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}')">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button onclick="window.open('https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}')">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button onclick="navigator.clipboard.writeText('${shareData.url}')">
                    <i class="fas fa-link"></i> Copy Link
                </button>
            </div>
        `;
        document.body.appendChild(dialog);
    }
} 