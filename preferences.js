class UserPreferences {
    constructor() {
        this.preferences = LocalStorage.getUserPreferences() || this.getDefaultPreferences();
        this.initializePreferences();
    }

    initializePreferences() {
        this.applyTheme();
        this.applyNotificationSettings();
        this.bindPreferenceControls();
    }

    getDefaultPreferences() {
        return {
            theme: 'light',
            notifications: {
                email: true,
                push: true,
                eventReminders: true,
                chatMessages: true
            },
            privacy: {
                profileVisibility: 'public',
                showActivity: true
            },
            display: {
                language: 'en',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dateFormat: 'MM/DD/YYYY'
            }
        };
    }

    updatePreference(category, setting, value) {
        this.preferences[category][setting] = value;
        LocalStorage.saveUserPreferences(this.preferences);
        this.applyPreference(category, setting);
    }
} 