// ALE Legion Web App - Complete Implementation
// Features: AI Chat, Image Analysis, Streaming, Particle Effects, Stats, Dark Mode

import { FreeAIClient, AI_CONFIG } from './ai-config.js';

class ALELegionApp {
    constructor() {
        this.aiClient = new FreeAIClient();
        this.currentAI = 'grd17';
        this.messages = [];
        this.stats = {
            totalMessages: 0,
            responseTimes: [],
            accuracy: 100
        };
        this.currentImage = null;
        this.settings = {
            stream: true,
            codeHighlight: true,
            soundEffects: false,
            temperature: 0.7,
            theme: 'dark'
        };
        
        this.init();
    }

    async init() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeAICards();
        this.initializeParticles();
        await this.checkAIStatus();
        this.loadSettings();
        this.showToast('Welcome to ALE Legion!', 'Free AI Studio is ready', 'success');
    }

    initializeElements() {
        // Core elements
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.aiGrid = document.getElementById('aiGrid');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.modelInfo = document.getElementById('modelInfo');
        this.wordCount = document.getElementById('wordCount');
        
        // Side panel
        this.sidePanel = document.getElementById('sidePanel');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closePanelBtn = document.getElementById('closePanelBtn');
        
        // Stats
        this.totalMessagesEl = document.getElementById('totalMessages');
        this.avgResponseEl = document.getElementById('avgResponse');
        this.accuracyEl = document.getElementById('accuracy');
        this.modelsListEl = document.getElementById('modelsList');
        
        // Image handling
        this.attachBtn = document.getElementById('attachBtn');
        this.imageInput = document.getElementById('imageInput');
        this.imageModal = document.getElementById('imageModal');
        this.previewImage = document.getElementById('previewImage');
        
        // Settings
        this.themeToggle = document.getElementById('themeToggle');
        this.streamResponses = document.getElementById('streamResponses');
        this.codeHighlight = document.getElementById('codeHighlight');
        this.soundEffects = document.getElementById('soundEffects');
        this.temperature = document.getElementById('temperature');
        this.tempValue = document.getElementById('tempValue');
        
        // Loading & Toasts
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toastContainer = document.getElementById('toastContainer');
    }

    setupEventListeners() {
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
            this.updateWordCount();
        });

        // Image attachment
        this.attachBtn.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Image modal
        document.getElementById('closeImageModal').addEventListener('click', () => {
            this.imageModal.classList.remove('open');
        });
        document.getElementById('analyzeImageBtn').addEventListener('click', () => {
            this.analyzeImage();
        });
        document.getElementById('removeImageBtn').addEventListener('click', () => {
            this.removeImage();
        });

        // Side panel
        this.settingsBtn.addEventListener('click', () => {
            this.sidePanel.classList.toggle('open');
        });
        this.closePanelBtn.addEventListener('click', () => {
            this.sidePanel.classList.remove('open');
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Settings
        this.streamResponses.addEventListener('change', (e) => {
            this.settings.stream = e.target.checked;
            this.saveSettings();
        });
        this.codeHighlight.addEventListener('change', (e) => {
            this.settings.codeHighlight = e.target.checked;
            this.saveSettings();
        });
        this.soundEffects.addEventListener('change', (e) => {
            this.settings.soundEffects = e.target.checked;
            this.saveSettings();
        });
        this.temperature.addEventListener('input', (e) => {
            this.settings.temperature = parseFloat(e.target.value);
            this.tempValue.textContent = e.target.value;
            this.saveSettings();
        });

        // Quick actions
        document.querySelectorAll('.quick-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.target.dataset.prompt;
                this.messageInput.value = prompt;
                this.sendMessage();
            });
        });
    }

    initializeAICards() {
        const aiLegion = [
            { id: 'grd17', name: 'GRD1.7', icon: '🎯', model: 'Llama 3.3', description: 'Primary Coordinator' },
            { id: 'grd27', name: 'GRD2.7', icon: '🧠', model: 'DeepSeek R1', description: 'Deep Logic' },
            { id: 'aleofthought', name: 'ALEofThought', icon: '🤔', model: 'DeepSeek R1 8B', description: 'Reasoning' },
            { id: 'dangrd', name: 'DANGRD', icon: '⚡', model: 'Qwen 2.5', description: 'Chaos Engine' },
            { id: 'grdviz', name: 'GRDVIZ', icon: '👁️', model: 'LLaVA', description: 'Vision Core' },
            { id: 'norightanswergrd', name: 'NoRightAnswer', icon: '❓', model: 'Mistral', description: 'Paradox Resolver' },
            { id: 'ale', name: 'ALE', icon: '🚀', model: 'Llama 3.3', description: 'Swift Response' },
            { id: 'grdsprint', name: 'GRDSPRINT', icon: '💨', model: 'Mixtral', description: 'Speed Demon' }
        ];

        this.aiGrid.innerHTML = aiLegion.map(ai => `
            <div class="ai-card ${ai.id === this.currentAI ? 'active' : ''}" data-ai="${ai.id}">
                <div class="ai-card-icon">${ai.icon}</div>
                <div class="ai-card-name">${ai.name}</div>
                <div class="ai-card-model">${ai.model}</div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.ai-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectAI(card.dataset.ai);
            });
        });
    }

    selectAI(aiId) {
        this.currentAI = aiId;
        
        // Update UI
        document.querySelectorAll('.ai-card').forEach(card => {
            card.classList.toggle('active', card.dataset.ai === aiId);
        });

        const aiConfig = AI_CONFIG.AI_LEGION[aiId];
        this.modelInfo.textContent = `Using: ${aiConfig.name} (${aiConfig.model})`;
        
        this.showToast('AI Selected', `Switched to ${aiConfig.name}`, 'info');
        this.playSound('select');
    }

    async checkAIStatus() {
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        const statusText = this.statusIndicator.querySelector('span');
        
        statusDot.className = 'status-dot checking';
        statusText.textContent = 'Checking...';

        try {
            const status = await this.aiClient.checkOllamaStatus();
            
            if (status.available) {
                statusDot.className = 'status-dot';
                statusText.textContent = `Ollama Online (${status.models.length} models)`;
                this.updateModelsList(status.models);
            } else {
                statusDot.className = 'status-dot checking';
                statusText.textContent = 'Simulated Mode';
                this.updateModelsList([]);
            }
        } catch (error) {
            statusDot.className = 'status-dot checking';
            statusText.textContent = 'Simulated Mode';
            this.updateModelsList([]);
        }
    }

    updateModelsList(models) {
        if (models.length === 0) {
            this.modelsListEl.innerHTML = `
                <div class="model-item">
                    <span>Simulated AI</span>
                    <span class="model-status"></span>
                </div>
            `;
            return;
        }

        this.modelsListEl.innerHTML = models.map(model => `
            <div class="model-item">
                <span>${model.name || model}</span>
                <span class="model-status"></span>
            </div>
        `).join('');
    }

    async sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text && !this.currentImage) return;

        // Clear welcome screen
        const welcomeScreen = this.chatMessages.querySelector('.welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.remove();
        }

        // Add user message
        this.addMessage('user', text, this.currentImage);
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.updateWordCount();

        // Show typing indicator
        const typingId = this.showTypingIndicator();

        // Get AI response
        const startTime = Date.now();
        try {
            this.loadingOverlay.classList.add('active');

            const messages = [
                { role: 'user', content: text }
            ];

            // Add image context if present
            if (this.currentImage) {
                messages[0].images = [this.currentImage];
            }

            const response = await this.aiClient.chat(messages, this.currentAI);
            
            const responseTime = Date.now() - startTime;
            this.stats.responseTimes.push(responseTime);
            this.stats.totalMessages += 2;

            // Remove typing indicator
            this.removeTypingIndicator(typingId);

            // Add AI response
            if (this.settings.stream) {
                await this.streamMessage('ai', response.content, response);
            } else {
                this.addMessage('ai', response.content, null, response);
            }

            this.updateStats();
            this.playSound('receive');

        } catch (error) {
            this.removeTypingIndicator(typingId);
            this.showToast('Error', error.message, 'error');
            this.addMessage('ai', '❌ Sorry, I encountered an error. Please try again.');
        } finally {
            this.loadingOverlay.classList.remove('active');
            this.currentImage = null;
        }
    }

    addMessage(role, content, image = null, metadata = null) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;

        const aiConfig = AI_CONFIG.AI_LEGION[this.currentAI];
        const icon = role === 'user' ? '👤' : (aiConfig?.icon || '🤖');
        const name = role === 'user' ? 'You' : (aiConfig?.name || 'AI');

        let imageHTML = '';
        if (image) {
            imageHTML = `<img src="${image}" class="message-image" alt="Uploaded image">`;
        }

        const formattedContent = this.formatMessage(content);
        const time = new Date().toLocaleTimeString();

        messageEl.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${icon}</div>
                <span>${name}</span>
                ${metadata ? `<span style="opacity: 0.5; margin-left: 10px;">(${metadata.provider})</span>` : ''}
            </div>
            <div class="message-bubble">
                ${formattedContent}
                ${imageHTML}
                <div class="message-time">${time}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageEl);
        this.scrollToBottom();

        // Add to messages array
        this.messages.push({ role, content, image, time, metadata });
    }

    async streamMessage(role, content, metadata) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role}`;

        const aiConfig = AI_CONFIG.AI_LEGION[this.currentAI];
        const icon = aiConfig?.icon || '🤖';
        const name = aiConfig?.name || 'AI';
        const time = new Date().toLocaleTimeString();

        messageEl.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${icon}</div>
                <span>${name}</span>
                ${metadata ? `<span style="opacity: 0.5; margin-left: 10px;">(${metadata.provider})</span>` : ''}
            </div>
            <div class="message-bubble">
                <div class="message-content"></div>
                <div class="message-time">${time}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageEl);
        const contentEl = messageEl.querySelector('.message-content');

        // Stream characters
        const words = content.split(' ');
        for (let i = 0; i < words.length; i++) {
            contentEl.textContent += (i > 0 ? ' ' : '') + words[i];
            this.scrollToBottom();
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        // Apply formatting after streaming
        contentEl.innerHTML = this.formatMessage(content);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Code blocks
        text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            return `
                <div class="code-block">
                    <div class="code-header">
                        <span class="code-language">${language}</span>
                        <button class="code-copy" onclick="navigator.clipboard.writeText(\`${code.replace(/`/g, '\\`')}\`)">Copy</button>
                    </div>
                    <pre><code>${this.escapeHtml(code.trim())}</code></pre>
                </div>
            `;
        });

        // Inline code
        text = text.replace(/`([^`]+)`/g, '<code style="background: var(--code-bg); padding: 2px 6px; border-radius: 4px;">$1</code>');

        // Bold
        text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

        // Italic
        text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

        // Links
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-primary);">$1</a>');

        // Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingEl = document.createElement('div');
        typingEl.className = 'message ai';
        typingEl.id = id;

        const aiConfig = AI_CONFIG.AI_LEGION[this.currentAI];
        const icon = aiConfig?.icon || '🤖';

        typingEl.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${icon}</div>
                <span>${aiConfig.name}</span>
            </div>
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        this.chatMessages.appendChild(typingEl);
        this.scrollToBottom();
        return id;
    }

    removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showToast('Error', 'Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            this.previewImage.src = this.currentImage;
            this.imageModal.classList.add('open');
        };
        reader.readAsDataURL(file);
    }

    async analyzeImage() {
        this.imageModal.classList.remove('open');
        this.messageInput.value = 'Please analyze this image in detail.';
        this.sendMessage();
    }

    removeImage() {
        this.currentImage = null;
        this.imageModal.classList.remove('open');
        this.imageInput.value = '';
    }

    updateWordCount() {
        const words = this.messageInput.value.trim().split(/\s+/).filter(w => w.length > 0);
        this.wordCount.textContent = `${words.length} word${words.length !== 1 ? 's' : ''}`;
    }

    updateStats() {
        this.totalMessagesEl.textContent = this.stats.totalMessages;
        
        const avgTime = this.stats.responseTimes.length > 0 
            ? Math.round(this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length)
            : 0;
        this.avgResponseEl.textContent = `${avgTime}ms`;
        
        this.accuracyEl.textContent = `${this.stats.accuracy}%`;
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        this.settings.theme = newTheme;
        this.saveSettings();
        
        this.showToast('Theme Changed', `Switched to ${newTheme} mode`, 'info');
    }

    showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    playSound(type) {
        if (!this.settings.soundEffects) return;

        const frequencies = {
            send: 800,
            receive: 600,
            select: 700
        };

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequencies[type] || 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    initializeParticles() {
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 102, 255, 0.5)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    saveSettings() {
        localStorage.setItem('ale-settings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('ale-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
            
            this.streamResponses.checked = this.settings.stream;
            this.codeHighlight.checked = this.settings.codeHighlight;
            this.soundEffects.checked = this.settings.soundEffects;
            this.temperature.value = this.settings.temperature;
            this.tempValue.textContent = this.settings.temperature;
            
            document.documentElement.setAttribute('data-theme', this.settings.theme);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ALELegionApp();
});
