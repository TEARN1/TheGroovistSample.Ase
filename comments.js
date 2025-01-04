class CommentSystem {
    constructor() {
        this.maxVideoLength = 30; // 30 seconds max
        this.maxAudioLength = 60; // 60 seconds max
        this.initializeComments();
    }

    initializeComments() {
        this.bindCommentEvents();
        this.setupMediaRecorders();
    }

    createCommentBox(parentId = null) {
        return `
            <div class="comment-box">
                <div class="comment-input-area">
                    <textarea placeholder="Write a comment..."></textarea>
                    
                    <div class="media-preview" style="display: none;">
                        <div class="image-preview"></div>
                        <div class="video-preview"></div>
                        <div class="audio-preview"></div>
                        <button class="remove-media">×</button>
                    </div>

                    <div class="comment-tools">
                        <div class="media-tools">
                            <button class="tool-btn image-btn">
                                <i class="fas fa-image"></i>
                                <input type="file" accept="image/*" hidden>
                            </button>
                            
                            <button class="tool-btn video-btn">
                                <i class="fas fa-video"></i>
                                <span class="record-time"></span>
                            </button>
                            
                            <button class="tool-btn audio-btn">
                                <i class="fas fa-microphone"></i>
                                <span class="record-time"></span>
                            </button>
                        </div>

                        <button class="submit-comment">Reply</button>
                    </div>
                </div>
            </div>
        `;
    }

    setupMediaRecorders() {
        // Video recorder setup
        this.videoRecorder = {
            stream: null,
            recorder: null,
            chunks: [],
            isRecording: false
        };

        // Audio recorder setup
        this.audioRecorder = {
            stream: null,
            recorder: null,
            chunks: [],
            isRecording: false
        };
    }

    async handleImageUpload(input, previewContainer) {
        const file = input.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                previewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                `;
                previewContainer.parentElement.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }

    async startVideoRecording(button) {
        try {
            this.videoRecorder.stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            this.videoRecorder.recorder = new MediaRecorder(this.videoRecorder.stream);
            this.videoRecorder.chunks = [];
            this.videoRecorder.isRecording = true;

            let startTime = Date.now();
            const timeDisplay = button.querySelector('.record-time');
            
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                timeDisplay.textContent = elapsed + 's';
                
                if (elapsed >= this.maxVideoLength) {
                    this.stopVideoRecording(button);
                    clearInterval(timer);
                }
            }, 1000);

            this.videoRecorder.recorder.ondataavailable = (e) => {
                this.videoRecorder.chunks.push(e.data);
            };

            this.videoRecorder.recorder.onstop = () => {
                const blob = new Blob(this.videoRecorder.chunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                
                const previewContainer = button.closest('.comment-box')
                    .querySelector('.video-preview');
                previewContainer.innerHTML = `
                    <video src="${url}" controls></video>
                `;
                previewContainer.parentElement.style.display = 'block';
            };

            this.videoRecorder.recorder.start();
            button.classList.add('recording');

        } catch (error) {
            console.error('Error starting video recording:', error);
            alert('Could not access camera/microphone');
        }
    }

    stopVideoRecording(button) {
        if (this.videoRecorder.isRecording) {
            this.videoRecorder.recorder.stop();
            this.videoRecorder.stream.getTracks().forEach(track => track.stop());
            this.videoRecorder.isRecording = false;
            button.classList.remove('recording');
            button.querySelector('.record-time').textContent = '';
        }
    }

    async startAudioRecording(button) {
        try {
            this.audioRecorder.stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });

            this.audioRecorder.recorder = new MediaRecorder(this.audioRecorder.stream);
            this.audioRecorder.chunks = [];
            this.audioRecorder.isRecording = true;

            let startTime = Date.now();
            const timeDisplay = button.querySelector('.record-time');
            
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                timeDisplay.textContent = elapsed + 's';
                
                if (elapsed >= this.maxAudioLength) {
                    this.stopAudioRecording(button);
                    clearInterval(timer);
                }
            }, 1000);

            this.audioRecorder.recorder.ondataavailable = (e) => {
                this.audioRecorder.chunks.push(e.data);
            };

            this.audioRecorder.recorder.onstop = () => {
                const blob = new Blob(this.audioRecorder.chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                
                const previewContainer = button.closest('.comment-box')
                    .querySelector('.audio-preview');
                previewContainer.innerHTML = `
                    <audio src="${url}" controls></audio>
                `;
                previewContainer.parentElement.style.display = 'block';
            };

            this.audioRecorder.recorder.start();
            button.classList.add('recording');

        } catch (error) {
            console.error('Error starting audio recording:', error);
            alert('Could not access microphone');
        }
    }

    stopAudioRecording(button) {
        if (this.audioRecorder.isRecording) {
            this.audioRecorder.recorder.stop();
            this.audioRecorder.stream.getTracks().forEach(track => track.stop());
            this.audioRecorder.isRecording = false;
            button.classList.remove('recording');
            button.querySelector('.record-time').textContent = '';
        }
    }

    bindCommentEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.image-btn')) {
                e.target.querySelector('input[type="file"]').click();
            }
            
            if (e.target.matches('.video-btn')) {
                if (!this.videoRecorder.isRecording) {
                    this.startVideoRecording(e.target);
                } else {
                    this.stopVideoRecording(e.target);
                }
            }
            
            if (e.target.matches('.audio-btn')) {
                if (!this.audioRecorder.isRecording) {
                    this.startAudioRecording(e.target);
                } else {
                    this.stopAudioRecording(e.target);
                }
            }
            
            if (e.target.matches('.remove-media')) {
                const mediaPreview = e.target.closest('.media-preview');
                mediaPreview.style.display = 'none';
                mediaPreview.querySelector('.image-preview').innerHTML = '';
                mediaPreview.querySelector('.video-preview').innerHTML = '';
                mediaPreview.querySelector('.audio-preview').innerHTML = '';
            }
        });

        // Handle image file selection
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[type="file"]')) {
                const previewContainer = e.target.closest('.comment-box')
                    .querySelector('.image-preview');
                this.handleImageUpload(e.target, previewContainer);
            }
        });
    }
} 