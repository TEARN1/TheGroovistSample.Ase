class SearchSystem {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.filterOptions = document.getElementById('filter-options');
        this.initializeSearch();
    }

    initializeSearch() {
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.filterOptions.addEventListener('change', () => this.handleSearch());
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filterType = this.filterOptions.value;
        const events = LocalStorage.getEvents();

        const filteredEvents = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.venue.toLowerCase().includes(searchTerm);
            
            if (filterType === 'all') return matchesSearch;
            return matchesSearch && event.eventType === filterType;
        });

        this.updateResults(filteredEvents);
    }

    updateResults(filteredEvents) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = filteredEvents.map(event => `
            <div class="search-result-item" onclick="showEventDetails(${event.id})">
                <div class="result-image">
                    <img src="${event.media[0] || 'default-event.jpg'}" alt="${event.title}">
                </div>
                <div class="result-info">
                    <h3>${event.title}</h3>
                    <p>${event.venue}</p>
                    <span class="result-date">${new Date(event.datetime).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }
} 