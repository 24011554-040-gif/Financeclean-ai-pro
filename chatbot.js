/**
 * Clean AI Custom Chatbot Widget
 * Injects a floating chat bubble and window into any page it's included on.
 */

(function () {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --chat-primary: #2563eb;
            --chat-primary-hover: #1d4ed8;
            --chat-bg: #ffffff;
            --chat-text: #334155;
            --chat-border: #e2e8f0;
            --chat-msg-user: #eff6ff;
            --chat-msg-ai: #f8fafc;
        }

        /* Chat Button */
        #clean-ai-chat-btn {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--chat-primary);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
            cursor: pointer;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        #clean-ai-chat-btn:hover {
            transform: scale(1.05);
            background-color: var(--chat-primary-hover);
        }

        #clean-ai-chat-btn svg {
            width: 28px;
            height: 28px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        /* Chat Window */
        #clean-ai-chat-window {
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 380px;
            height: 550px;
            max-height: calc(100vh - 120px);
            background-color: var(--chat-bg);
            border-radius: 16px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            border: 1px solid var(--chat-border);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: 'Inter', sans-serif;
        }

        #clean-ai-chat-window.open {
            opacity: 1;
            pointer-events: auto;
            transform: translateY(0);
        }

        /* Header */
        .chat-header {
            background-color: var(--chat-primary);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-header-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .chat-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }

        .chat-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
        }

        .chat-subtitle {
            font-size: 12px;
            opacity: 0.8;
            margin: 0;
        }

        .chat-close-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .chat-close-btn:hover {
            opacity: 1;
        }

        /* Messages Area */
        .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
            background-color: #fcfcfc;
        }

        .message {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .message.ai {
            align-self: flex-start;
            background-color: var(--chat-msg-ai);
            color: var(--chat-text);
            border: 1px solid var(--chat-border);
            border-bottom-left-radius: 4px;
        }

        .message.user {
            align-self: flex-end;
            background-color: var(--chat-primary);
            color: white;
            border-bottom-right-radius: 4px;
            box-shadow: 0 2px 5px rgba(37, 99, 235, 0.15);
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            background-color: var(--chat-msg-ai);
            border: 1px solid var(--chat-border);
            border-radius: 12px;
            border-bottom-left-radius: 4px;
            align-self: flex-start;
            width: fit-content;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            background-color: #94a3b8;
            border-radius: 50%;
            animation: typingbounce 1.4s infinite ease-in-out both;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingbounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* Input Area */
        .chat-input-area {
            padding: 16px;
            border-top: 1px solid var(--chat-border);
            background-color: white;
        }

        .chat-input-wrapper {
            display: flex;
            align-items: flex-end;
            gap: 8px;
            background-color: var(--chat-msg-ai);
            border: 1px solid var(--chat-border);
            border-radius: 24px;
            padding: 8px 16px;
        }

        .chat-input-wrapper:focus-within {
            border-color: var(--chat-primary);
            background-color: white;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }

        #clean-ai-chat-input {
            flex: 1;
            border: none;
            background: none;
            resize: none;
            max-height: 120px;
            min-height: 24px;
            padding: 8px 0;
            font-size: 14px;
            font-family: inherit;
            color: var(--chat-text);
        }

        #clean-ai-chat-input:focus {
            outline: none;
        }

        #clean-ai-chat-send {
            background: none;
            border: none;
            color: var(--chat-primary);
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }

        #clean-ai-chat-send:hover {
            background-color: rgba(37, 99, 235, 0.1);
        }

        #clean-ai-chat-send:disabled {
            color: #94a3b8;
            cursor: not-allowed;
            background: none;
        }

        @media (max-width: 480px) {
            #clean-ai-chat-window {
                width: calc(100vw - 32px);
                right: 16px;
                bottom: 90px;
            }
        }
    `;
    document.head.appendChild(style);

    // Inject HTML
    const chatHTML = `
        <button id="clean-ai-chat-btn" aria-label="Open Chat">
            <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </button>

        <div id="clean-ai-chat-window">
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">AI</div>
                    <div>
                        <p class="chat-title">Clean AI Assistant</p>
                        <p class="chat-subtitle">Typically replies instantly</p>
                    </div>
                </div>
                <button class="chat-close-btn" id="clean-ai-chat-close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="chat-messages" id="clean-ai-chat-messages">
                <div class="message ai">
                    Hi there! 👋 I'm the Clean AI Assistant. How can I help you automate your financial workflows today?
                </div>
            </div>

            <div class="chat-input-area">
                <div class="chat-input-wrapper">
                    <textarea id="clean-ai-chat-input" placeholder="Type your message..." rows="1"></textarea>
                    <button id="clean-ai-chat-send" disabled>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = chatHTML;
    document.body.appendChild(wrapper);

    // Logic
    const chatBtn = document.getElementById('clean-ai-chat-btn');
    const chatWindow = document.getElementById('clean-ai-chat-window');
    const closeBtn = document.getElementById('clean-ai-chat-close');
    const messagesContainer = document.getElementById('clean-ai-chat-messages');
    const inputField = document.getElementById('clean-ai-chat-input');
    const sendBtn = document.getElementById('clean-ai-chat-send');

    // Toggle window
    chatBtn.addEventListener('click', () => {
        chatWindow.classList.add('open');
        inputField.focus();
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Auto-resize textarea
    inputField.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        sendBtn.disabled = this.value.trim() === '';
    });

    // Handle send
    const sendMessage = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Add user message
        appendMessage(text, 'user');

        // Reset input
        inputField.value = '';
        inputField.style.height = 'auto';
        sendBtn.disabled = true;

        // 2. Show typing indicator
        const typingId = showTypingIndicator();

        // 3. API Call to OpenRouter
        try {
            const systemPrompt = "You are the helpful front-line AI assistant for Clean AI Finance, built by Ali Haider. Clean AI is a tool that automates financial workflows by instantly extracting, cleaning, and categorizing data from messy bank statement PDFs and CSVs. It provides instant visual dashboards and smart categorization. Keep your responses concise, friendly, and focused on helping users understand the product. If they need highly specific technical support, tell them to use the Contact page to email Ali directly.";

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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',
                    'HTTP-Referer': 'https://github.com/24011554-040-gif/Financeclean-ai-pro', // Required by OpenRouter
                    'X-Title': 'Clean AI Marketing Website'
                },
                body: JSON.stringify({ 
                    model: "google/gemini-2.5-flash",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: text }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const aiReply = data.choices[0].message.content;

            removeTypingIndicator(typingId);
            appendMessage(aiReply, 'ai');

        } catch (error) {
            removeTypingIndicator(typingId);
            console.error("Chat API Error:", error);
            appendMessage("Sorry, I'm having trouble connecting to my brain right now. Please message Ali Haider directly via the Contact page.", 'ai');
        }
    };

    sendBtn.addEventListener('click', sendMessage);

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Helpers
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = \`message \${sender}\`;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = id;
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
})();
