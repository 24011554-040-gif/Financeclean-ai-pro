/**
 * Clean AI Custom Chatbot Widget
 * Self-contained smart chatbot — no external API needed.
 * Uses intelligent keyword matching to answer questions about Clean AI.
 */

(function () {
    // Inject CSS
    const style = document.createElement('style');
    style.innerHTML = '\
        :root {\
            --chat-primary: #2563eb;\
            --chat-primary-hover: #1d4ed8;\
            --chat-bg: #ffffff;\
            --chat-text: #334155;\
            --chat-border: #e2e8f0;\
            --chat-msg-user: #eff6ff;\
            --chat-msg-ai: #f8fafc;\
        }\
        #clean-ai-chat-btn {\
            position: fixed;\
            bottom: 24px;\
            right: 24px;\
            width: 60px;\
            height: 60px;\
            border-radius: 50%;\
            background-color: var(--chat-primary);\
            color: white;\
            border: none;\
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);\
            cursor: pointer;\
            z-index: 9999;\
            display: flex;\
            align-items: center;\
            justify-content: center;\
            transition: transform 0.3s ease, background-color 0.3s ease;\
        }\
        #clean-ai-chat-btn:hover {\
            transform: scale(1.05);\
            background-color: var(--chat-primary-hover);\
        }\
        #clean-ai-chat-btn svg {\
            width: 28px;\
            height: 28px;\
            fill: none;\
            stroke: currentColor;\
            stroke-width: 2;\
            stroke-linecap: round;\
            stroke-linejoin: round;\
        }\
        #clean-ai-chat-window {\
            position: fixed;\
            bottom: 100px;\
            right: 24px;\
            width: 380px;\
            height: 550px;\
            max-height: calc(100vh - 120px);\
            background-color: var(--chat-bg);\
            border-radius: 16px;\
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\
            border: 1px solid var(--chat-border);\
            z-index: 9998;\
            display: flex;\
            flex-direction: column;\
            overflow: hidden;\
            opacity: 0;\
            pointer-events: none;\
            transform: translateY(20px);\
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\
            font-family: Inter, sans-serif;\
        }\
        #clean-ai-chat-window.open {\
            opacity: 1;\
            pointer-events: auto;\
            transform: translateY(0);\
        }\
        .chat-header {\
            background-color: var(--chat-primary);\
            color: white;\
            padding: 16px 20px;\
            display: flex;\
            justify-content: space-between;\
            align-items: center;\
        }\
        .chat-header-info {\
            display: flex;\
            align-items: center;\
            gap: 12px;\
        }\
        .chat-avatar {\
            width: 32px;\
            height: 32px;\
            border-radius: 50%;\
            background-color: rgba(255, 255, 255, 0.2);\
            display: flex;\
            align-items: center;\
            justify-content: center;\
            font-weight: bold;\
            font-size: 14px;\
        }\
        .chat-title {\
            font-size: 16px;\
            font-weight: 600;\
            margin: 0;\
        }\
        .chat-subtitle {\
            font-size: 12px;\
            opacity: 0.8;\
            margin: 0;\
        }\
        .chat-close-btn {\
            background: none;\
            border: none;\
            color: white;\
            cursor: pointer;\
            padding: 4px;\
            opacity: 0.8;\
            transition: opacity 0.2s;\
        }\
        .chat-close-btn:hover {\
            opacity: 1;\
        }\
        .chat-messages {\
            flex: 1;\
            padding: 20px;\
            overflow-y: auto;\
            display: flex;\
            flex-direction: column;\
            gap: 16px;\
            background-color: #fcfcfc;\
        }\
        .message {\
            max-width: 85%;\
            padding: 12px 16px;\
            border-radius: 12px;\
            font-size: 14px;\
            line-height: 1.5;\
            word-wrap: break-word;\
        }\
        .message.ai {\
            align-self: flex-start;\
            background-color: var(--chat-msg-ai);\
            color: var(--chat-text);\
            border: 1px solid var(--chat-border);\
            border-bottom-left-radius: 4px;\
        }\
        .message.user {\
            align-self: flex-end;\
            background-color: var(--chat-primary);\
            color: white;\
            border-bottom-right-radius: 4px;\
            box-shadow: 0 2px 5px rgba(37, 99, 235, 0.15);\
        }\
        .typing-indicator {\
            display: flex;\
            gap: 4px;\
            padding: 12px 16px;\
            background-color: var(--chat-msg-ai);\
            border: 1px solid var(--chat-border);\
            border-radius: 12px;\
            border-bottom-left-radius: 4px;\
            align-self: flex-start;\
            width: fit-content;\
        }\
        .typing-dot {\
            width: 6px;\
            height: 6px;\
            background-color: #94a3b8;\
            border-radius: 50%;\
            animation: typingbounce 1.4s infinite ease-in-out both;\
        }\
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }\
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }\
        @keyframes typingbounce {\
            0%, 80%, 100% { transform: scale(0); }\
            40% { transform: scale(1); }\
        }\
        .chat-input-area {\
            padding: 16px;\
            border-top: 1px solid var(--chat-border);\
            background-color: white;\
        }\
        .chat-input-wrapper {\
            display: flex;\
            align-items: flex-end;\
            gap: 8px;\
            background-color: var(--chat-msg-ai);\
            border: 1px solid var(--chat-border);\
            border-radius: 24px;\
            padding: 8px 16px;\
        }\
        .chat-input-wrapper:focus-within {\
            border-color: var(--chat-primary);\
            background-color: white;\
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);\
        }\
        #clean-ai-chat-input {\
            flex: 1;\
            border: none;\
            background: none;\
            resize: none;\
            max-height: 120px;\
            min-height: 24px;\
            padding: 8px 0;\
            font-size: 14px;\
            font-family: inherit;\
            color: var(--chat-text);\
        }\
        #clean-ai-chat-input:focus {\
            outline: none;\
        }\
        #clean-ai-chat-send {\
            background: none;\
            border: none;\
            color: var(--chat-primary);\
            cursor: pointer;\
            padding: 8px;\
            display: flex;\
            align-items: center;\
            justify-content: center;\
            border-radius: 50%;\
            transition: background-color 0.2s;\
        }\
        #clean-ai-chat-send:hover {\
            background-color: rgba(37, 99, 235, 0.1);\
        }\
        #clean-ai-chat-send:disabled {\
            color: #94a3b8;\
            cursor: not-allowed;\
            background: none;\
        }\
        @media (max-width: 480px) {\
            #clean-ai-chat-window {\
                width: calc(100vw - 32px);\
                right: 16px;\
                bottom: 90px;\
            }\
        }\
    ';
    document.head.appendChild(style);

    // Inject HTML
    var chatHTML = '<button id="clean-ai-chat-btn" aria-label="Open Chat">' +
        '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>' +
        '</button>' +
        '<div id="clean-ai-chat-window">' +
            '<div class="chat-header">' +
                '<div class="chat-header-info">' +
                    '<div class="chat-avatar">AI</div>' +
                    '<div>' +
                        '<p class="chat-title">Clean AI Assistant</p>' +
                        '<p class="chat-subtitle">Replies instantly</p>' +
                    '</div>' +
                '</div>' +
                '<button class="chat-close-btn" id="clean-ai-chat-close">' +
                    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                        '<line x1="18" y1="6" x2="6" y2="18"></line>' +
                        '<line x1="6" y1="6" x2="18" y2="18"></line>' +
                    '</svg>' +
                '</button>' +
            '</div>' +
            '<div class="chat-messages" id="clean-ai-chat-messages">' +
                '<div class="message ai">Hi there! \uD83D\uDC4B I\'m the Clean AI Assistant. Ask me anything about our financial data automation tool!</div>' +
            '</div>' +
            '<div class="chat-input-area">' +
                '<div class="chat-input-wrapper">' +
                    '<textarea id="clean-ai-chat-input" placeholder="Type your message..." rows="1"></textarea>' +
                    '<button id="clean-ai-chat-send" disabled>' +
                        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                            '<line x1="22" y1="2" x2="11" y2="13"></line>' +
                            '<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>' +
                        '</svg>' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';

    var wrapper = document.createElement('div');
    wrapper.innerHTML = chatHTML;
    document.body.appendChild(wrapper);

    // DOM references
    var chatBtn = document.getElementById('clean-ai-chat-btn');
    var chatWindow = document.getElementById('clean-ai-chat-window');
    var closeBtn = document.getElementById('clean-ai-chat-close');
    var messagesContainer = document.getElementById('clean-ai-chat-messages');
    var inputField = document.getElementById('clean-ai-chat-input');
    var sendBtn = document.getElementById('clean-ai-chat-send');

    // Toggle window
    chatBtn.addEventListener('click', function () {
        chatWindow.classList.add('open');
        inputField.focus();
    });
    closeBtn.addEventListener('click', function () {
        chatWindow.classList.remove('open');
    });

    // Auto-resize textarea
    inputField.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
        sendBtn.disabled = this.value.trim() === '';
    });

    // ============================================================
    // GEMINI AI RESPONSE ENGINE — Calls Google Gemini API directly
    // ============================================================

    var GEMINI_API_KEY = 'AIzaSyD9d9tuSAsfIDsgdk4x7pEKL90qT9GQ728';
    var GEMINI_MODEL = 'gemini-3-flash-preview';
    var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY;

    var SYSTEM_PROMPT = 'You are the friendly AI assistant for Clean AI Finance, a software product created by Ali Haider (a CFO). ' +
        'Clean AI automatically extracts, categorizes, and analyzes complex bank statements from PDFs and CSVs in seconds. ' +
        'Your job is to answer questions politely, concisely (keep responses under 3-4 sentences when possible), and direct users to try the tool on the website if they need to parse documents. ' +
        'If asked about pricing, say the tool is currently free to try. ' +
        'If asked about contact, provide alihaiderfinance.cfo@gmail.com. ' +
        'Use a friendly, professional tone with relevant emojis.';

    var conversationHistory = [];

    var responses = [
        {
            keywords: ['hi', 'hello', 'hey', 'howdy', 'greetings', 'sup', 'yo', 'good morning', 'good afternoon', 'good evening', 'assalam', 'salam'],
            reply: "Hey there! \uD83D\uDC4B Great to have you here! I'm the Clean AI Assistant. I can help you learn about our financial data tool, how it works, pricing, and more. What would you like to know?"
        },
        {
            keywords: ['how are you', 'how r u', 'how do you do', 'whats up', "what's up"],
            reply: "I'm doing great, thanks for asking! \uD83D\uDE0A I'm here to help you learn about Clean AI and how it can save you hours of manual financial data work. How can I help you today?"
        },
        {
            keywords: ['what is clean ai', 'what does this tool do', 'what is this', 'tell me about', 'what does clean ai do', 'explain', 'about clean ai', 'what do you do', 'what can you do', 'what are your functions', 'about this tool'],
            reply: "Clean AI is a powerful financial data automation tool that instantly extracts, cleans, and categorizes data from messy bank statement PDFs and CSVs. \uD83D\uDCCA\n\nJust upload your messy file and our AI engine will:\n\u2022 Parse complex tables (even borderless or misaligned ones)\n\u2022 Categorize every transaction automatically\n\u2022 Generate visual dashboards and charts\n\u2022 Export clean, formatted spreadsheets\n\nClick 'Try Tool' in the navigation to try it free!"
        },
        {
            keywords: ['how does it work', 'how to use', 'how it works', 'steps', 'process', 'workflow', 'how do i use'],
            reply: "It's super simple — just 3 steps! \uD83D\uDE80\n\n1\uFE0F\u20E3 Upload — Drop your messy PDF or CSV bank statement\n2\uFE0F\u20E3 AI Processing — Our engine cleans, aligns columns, and categorizes every transaction\n3\uFE0F\u20E3 Analyze & Export — Review visual charts and download your clean, organized data\n\nThe whole process takes just seconds!"
        },
        {
            keywords: ['price', 'pricing', 'cost', 'free', 'pay', 'subscription', 'plan', 'charge', 'fee', 'money'],
            reply: "Great news! \uD83C\uDF89 Clean AI is currently free to try! You can head over to the 'Try Tool' page and start analyzing your bank statements right away — no credit card or sign-up needed.\n\nFor enterprise or custom integrations, feel free to reach out via the Contact page."
        },
        {
            keywords: ['pdf', 'csv', 'excel', 'file', 'format', 'upload', 'document', 'statement', 'bank statement'],
            reply: "Clean AI supports both PDF and CSV bank statements! \uD83D\uDCC4\n\nOur AI can handle:\n\u2022 PDF statements with borderless tables\n\u2022 Misaligned or poorly formatted columns\n\u2022 CSV/Excel exports with inconsistent data\n\u2022 Statements from ANY bank\n\nJust upload your file and the AI does the rest!"
        },
        {
            keywords: ['categoriz', 'category', 'categories', 'classify', 'sort', 'label', 'tag'],
            reply: "Our AI automatically categorizes every transaction into clear categories like: \uD83C\uDFF7\uFE0F\n\n\u2022 Groceries & Food\n\u2022 Rent & Housing\n\u2022 Salary & Income\n\u2022 Transfers\n\u2022 Utilities & Bills\n\u2022 Entertainment\n\u2022 Transportation\n\u2022 And many more!\n\nThe categorization uses intelligent pattern matching to achieve high accuracy."
        },
        {
            keywords: ['dashboard', 'chart', 'graph', 'visual', 'analytics', 'insight', 'report'],
            reply: "Yes! Clean AI generates beautiful visual dashboards! \uD83D\uDCCA\n\nYou'll get:\n\u2022 Income vs Expense breakdown charts\n\u2022 Cash flow summaries\n\u2022 Category-wise spending analysis\n\u2022 Transaction timeline views\n\nAll generated instantly from your uploaded data."
        },
        {
            keywords: ['who made', 'who built', 'who created', 'creator', 'founder', 'ali', 'haider', 'developer', 'team'],
            reply: "Clean AI was built by Ali Haider \uD83D\uDC68\u200D\uD83D\uDCBB — a CFO and finance professional with years of experience in corporate accounting, risk auditing, and financial reporting.\n\nHe built this tool out of frustration with existing software that couldn't handle messy, real-world bank statements. His mission is to empower finance professionals by eliminating manual data entry entirely!"
        },
        {
            keywords: ['contact', 'email', 'reach', 'support', 'help desk', 'talk to', 'speak'],
            reply: "You can reach Ali Haider directly! \uD83D\uDCE7\n\n\u2022 Email: alihaiderfinance.cfo@gmail.com\n\u2022 Visit the Contact page for a quick form\n\u2022 Connect on LinkedIn\n\nFeel free to reach out for support, enterprise inquiries, or custom integration requests!"
        },
        {
            keywords: ['secure', 'security', 'safe', 'privacy', 'data protection', 'encrypt'],
            reply: "Your data security is important! \uD83D\uDD12 Clean AI processes your files locally in the browser session. We don't store your bank statements permanently. For specific security or compliance questions, please reach out to Ali via the Contact page."
        },
        {
            keywords: ['enterprise', 'business', 'company', 'organization', 'bulk', 'api', 'integrate', 'integration', 'custom'],
            reply: "Interested in enterprise or custom integration? \uD83C\uDFE2\n\nClean AI can be customized for your organization's specific needs. Please visit the Contact page and send Ali a message about your requirements — he'd love to discuss how Clean AI can fit into your workflow!"
        },
        {
            keywords: ['bank', 'which bank', 'supported bank', 'any bank', 'specific bank'],
            reply: "Clean AI works with statements from ANY bank! \uD83C\uDF0D\n\nWhether it's a local bank, international institution, or a digital fintech — as long as your statement is in PDF or CSV format, our AI can parse and categorize it. No bank-specific templates needed!"
        },
        {
            keywords: ['export', 'download', 'save', 'output', 'spreadsheet'],
            reply: "After processing, you can export your clean, categorized data as a perfectly formatted spreadsheet! \uD83D\uDCBE\n\nThe exported file is ready to be imported directly into your accounting software, Excel, or Google Sheets."
        },
        {
            keywords: ['accurate', 'accuracy', 'reliable', 'correct', 'mistake', 'error', 'wrong'],
            reply: "Clean AI uses advanced AI parsing to achieve high accuracy in data extraction and categorization. \uD83C\uDFAF\n\nAfter processing, you can review the parsed data table to verify everything looks correct before exporting. If you spot anything off, you can verify and make corrections before downloading your final clean spreadsheet."
        },
        {
            keywords: ['thank', 'thanks', 'thx', 'appreciate', 'helpful', 'awesome', 'great', 'cool', 'nice'],
            reply: "You're welcome! \uD83D\uDE0A Happy to help! If you have any more questions about Clean AI, feel free to ask anytime. And don't forget to try the tool — click 'Try Tool' in the nav bar!"
        },
        {
            keywords: ['bye', 'goodbye', 'see you', 'later', 'take care', 'gotta go'],
            reply: "Goodbye! \uD83D\uDC4B It was great chatting with you. Come back anytime you need help with your financial data. Have a wonderful day!"
        },
        {
            keywords: ['try', 'demo', 'test', 'start', 'begin', 'use it', 'get started'],
            reply: "Ready to try it out? \uD83D\uDE80\n\nClick the 'Try Tool' button in the navigation bar at the top of the page. You can upload your bank statement right there and see the magic happen in seconds — completely free!"
        }
    ];

    // Fallback for unrecognized questions
    var fallbackResponses = [
        "That's a great question! While I may not have the specific answer, I'd recommend reaching out to Ali via the Contact page for personalized help. \uD83D\uDE0A",
        "I appreciate your question! For anything beyond my knowledge, Ali Haider would be happy to help — just visit the Contact page or email alihaiderfinance.cfo@gmail.com \uD83D\uDCE7",
        "Hmm, I want to make sure you get the best answer for that! Please visit our Contact page and Ali will get back to you personally. In the meantime, would you like to know how Clean AI works or what it can do? \uD83E\uDD14"
    ];

    var fallbackIndex = 0;

    function getSmartReply(userMessage) {
        var lower = userMessage.toLowerCase().replace(/[^a-z0-9\s]/g, '');

        // Check each response pattern
        for (var i = 0; i < responses.length; i++) {
            var entry = responses[i];
            for (var j = 0; j < entry.keywords.length; j++) {
                if (lower.indexOf(entry.keywords[j]) !== -1) {
                    return entry.reply;
                }
            }
        }

        // Cycle through fallback responses
        var reply = fallbackResponses[fallbackIndex % fallbackResponses.length];
        fallbackIndex++;
        return reply;
    }

    // Call Google Gemini API for a real AI response
    async function getGeminiReply(userMessage) {
        conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        var contents = [
            { role: 'user', parts: [{ text: 'System Instructions: ' + SYSTEM_PROMPT }] },
            { role: 'model', parts: [{ text: 'Understood! I will act as the Clean AI Finance assistant.' }] }
        ].concat(conversationHistory);

        var payload = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: 1024,
                temperature: 0.7
            }
        };

        try {
            var response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('API returned status ' + response.status);
            }

            var data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                var aiReply = data.candidates[0].content.parts[0].text;
                conversationHistory.push({ role: 'model', parts: [{ text: aiReply }] });
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
                return aiReply;
            } else {
                throw new Error('No valid response from API');
            }
        } catch (error) {
            console.error('Gemini API error:', error);
            // Fall back to keyword matching
            return getSmartReply(userMessage);
        }
    }

    // Handle send
    async function sendMessage() {
        var text = inputField.value.trim();
        if (!text) return;

        // Add user message
        appendMessage(text, 'user');

        // Reset input
        inputField.value = '';
        inputField.style.height = 'auto';
        sendBtn.disabled = true;

        // Show typing indicator
        var typingId = showTypingIndicator();

        // Call Gemini API for real AI response
        var reply = await getGeminiReply(text);
        removeTypingIndicator(typingId);
        appendMessage(reply, 'ai');
    }

    sendBtn.addEventListener('click', sendMessage);

    inputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Helpers
    function appendMessage(text, sender) {
        var msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + sender;
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        var id = 'typing-' + Date.now();
        var typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = id;
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        var el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
})();
