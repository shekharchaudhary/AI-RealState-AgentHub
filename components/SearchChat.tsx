'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SearchChatProps {
  onSearchUpdate: (filters: any) => void;
}

export default function SearchChat({ onSearchUpdate }: SearchChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm Emma! 👋 I'm your AI real estate agent, and I'm so excited to help you find your dream home! Tell me what you're looking for, or ask me anything about properties across 23 major US cities. What brings you here today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const shouldContinueListening = useRef<boolean>(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const watchdogIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup watchdog on unmount
  useEffect(() => {
    return () => {
      stopWatchdog();
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Initialize Speech Recognition API
    if (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);

        // Auto-submit in voice mode
        if (voiceMode && transcript.trim()) {
          handleVoiceInput(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        // Handle different error types
        if (event.error === 'no-speech') {
          // User didn't speak - this is normal, just restart
          console.log('No speech detected, will restart listening...');
          setIsListening(false);
        } else if (event.error === 'audio-capture') {
          console.error('Microphone error: Please check your microphone permissions');
          setIsListening(false);
          shouldContinueListening.current = false;
          alert('Cannot access microphone. Please check your browser permissions.');
        } else if (event.error === 'not-allowed') {
          console.error('Microphone permission denied');
          setIsListening(false);
          shouldContinueListening.current = false;
          alert('Microphone access denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'aborted') {
          // Recognition was aborted (usually manually stopped)
          console.log('Speech recognition aborted');
          setIsListening(false);
        } else {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🎤 Recognition ended');
        setIsListening(false);

        // Auto-restart if we should continue
        if (shouldContinueListening.current && !isSpeaking) {
          // Clear any existing restart timeout
          if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
          }

          // Schedule aggressive restart
          restartTimeoutRef.current = setTimeout(() => {
            if (shouldContinueListening.current && !isSpeaking && !isListening) {
              console.log('🔄 Auto-restart after timeout...');
              startListening();
            }
          }, 500);
        }
      };
    }

    // Initialize Speech Synthesis API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const voices = synthesisRef.current?.getVoices() || [];
        setAvailableVoices(voices);

        // Auto-select a good default voice (prefer English female voices)
        if (!selectedVoice && voices.length > 0) {
          const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
          const preferredVoice =
            englishVoices.find(
              (v) => v.name.includes('Female') || v.name.includes('Samantha')
            ) ||
            englishVoices.find(
              (v) => v.name.includes('Google') || v.name.includes('Microsoft')
            ) ||
            englishVoices[0] ||
            voices[0];
          setSelectedVoice(preferredVoice);
        }
      };

      // Load voices immediately
      loadVoices();

      // Some browsers load voices asynchronously
      if (synthesisRef.current) {
        synthesisRef.current.onvoiceschanged = loadVoices;
      }
    }
  }, [voiceMode, isSpeaking, selectedVoice]);

  const speak = (text: string) => {
    if (!synthesisRef.current) return;

    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Use selected voice if available
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('✅ AI finished speaking');

      // Resume listening if we should continue
      if (shouldContinueListening.current) {
        // Clear any existing restart timeout
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }

        // Schedule restart with shorter delay
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldContinueListening.current && !isListening) {
            console.log('🔄 Auto-restart after speaking...');
            startListening();
          }
        }, 400);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synthesisRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      console.log('Already listening, skipping start');
      return;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      console.log('✅ Started listening...');
    } catch (error: any) {
      // Ignore "already started" errors
      if (error.message && error.message.includes('already started')) {
        console.log('Speech recognition already active');
        setIsListening(true); // Sync state
      } else {
        console.error('Error starting voice recognition:', error);
      }
    }
  };

  // Watchdog to ensure continuous listening in voice mode
  const startWatchdog = () => {
    // Clear any existing watchdog
    if (watchdogIntervalRef.current) {
      clearInterval(watchdogIntervalRef.current);
    }

    // Check every 2 seconds if we should be listening but aren't
    watchdogIntervalRef.current = setInterval(() => {
      if (shouldContinueListening.current && !isListening && !isSpeaking && !isLoading) {
        console.log('🔧 Watchdog: Restarting listening...');
        startListening();
      }
    }, 2000);
  };

  const stopWatchdog = () => {
    if (watchdogIntervalRef.current) {
      clearInterval(watchdogIntervalRef.current);
      watchdogIntervalRef.current = null;
    }
  };

  const toggleVoiceMode = () => {
    const newVoiceMode = !voiceMode;
    setVoiceMode(newVoiceMode);

    if (newVoiceMode) {
      // Enter voice mode - enable continuous listening and watchdog
      shouldContinueListening.current = true;
      startWatchdog();
      console.log('🎤 Voice mode activated - continuous listening enabled');

      const greeting =
        "Hey there! I'm Emma, your AI real estate agent. I'm here to help you find your perfect home! What can I help you with today?";
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: greeting },
      ]);
      speak(greeting);
    } else {
      // Exit voice mode - disable everything
      console.log('🛑 Voice mode deactivated');
      shouldContinueListening.current = false;
      stopWatchdog();
      stopSpeaking();

      // Clear any pending restart timeouts
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore errors when stopping
        }
      }
      setIsListening(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim() || isLoading) return;

    const updatedMessages = [...messages, { role: 'user', content: transcript }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          conversationHistory: updatedMessages
        }),
      });

      if (!response.ok) throw new Error('Failed to process message');

      const data = await response.json();

      // Update search filters
      if (data.filters) {
        onSearchUpdate(data.filters);
      }

      // Add assistant response
      const assistantMessage = data.message || 'Search updated!';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantMessage },
      ]);

      // Speak the response in voice mode
      if (voiceMode) {
        speak(assistantMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage =
        'Sorry, I encountered an error processing your request. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
      if (voiceMode) {
        speak(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: updatedMessages
        }),
      });

      if (!response.ok) throw new Error('Failed to process message');

      const data = await response.json();

      // Update search filters
      if (data.filters) {
        onSearchUpdate(data.filters);
      }

      // Add assistant response
      const assistantMessage = data.message || 'Search updated!';
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantMessage },
      ]);

      // Speak the response if in voice mode
      if (voiceMode) {
        speak(assistantMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage =
        'Sorry, I encountered an error processing your request. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: errorMessage,
        },
      ]);
      if (voiceMode) {
        speak(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "What's the market like in Miami?",
    'Show me houses in New York under $3M',
    'I need a 3 bedroom condo in LA',
    "Tell me about neighborhoods in Seattle",
    'Find me townhouses in Austin',
    "What's available in Chicago?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const toggleOneTimeVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert(
        'Voice search is not supported in your browser. Please try Chrome or Edge.'
      );
      return;
    }

    if (voiceMode) {
      // Already in voice mode, just toggle listening
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        startListening();
      }
      return;
    }

    // One-time voice search (not in voice mode)
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
        setIsListening(false);
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl shadow-lg border transition-all duration-300 ${
        voiceMode
          ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-300 dark:border-purple-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      {/* Header */}
      <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center'>
            <svg
              className='w-5 h-5 mr-2 text-blue-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
              />
            </svg>
            AI Search Assistant
            {voiceMode && (
              <span className='ml-3 px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded-full flex items-center animate-pulse'>
                <span className='w-2 h-2 bg-white rounded-full mr-1'></span>
                Voice Mode
              </span>
            )}
          </h3>
          <button
            onClick={toggleVoiceMode}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all duration-200 ${
              voiceMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={
              voiceMode
                ? 'Exit voice conversation mode'
                : 'Start voice conversation mode'
            }
          >
            {voiceMode ? '🔊 Exit Voice Mode' : '🎤 Voice Mode'}
          </button>
        </div>
        {voiceMode && (
          <div className='mt-3 space-y-2'>
            <div className='flex items-center justify-between gap-4'>
              <div className='text-xs text-gray-600 dark:text-gray-400'>
                {isSpeaking
                  ? '🔊 Speaking...'
                  : isListening
                  ? '👂 Listening...'
                  : '⏸ Ready to listen'}
              </div>
              <div className='flex items-center gap-2'>
                <label className='text-xs text-gray-600 dark:text-gray-400'>
                  Voice:
                </label>
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const voice = availableVoices.find(
                      (v) => v.name === e.target.value
                    );
                    setSelectedVoice(voice || null);
                  }}
                  className='text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:outline-none'
                  disabled={isSpeaking || isListening}
                >
                  {availableVoices
                    .filter((v) => v.lang.startsWith('en')) // Only show English voices
                    .map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name
                          .replace(/Microsoft|Google|Apple/, '')
                          .trim()}{' '}
                        ({voice.lang})
                      </option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    // Temporarily disable continuous listening for test
                    const wasListening = shouldContinueListening.current;
                    shouldContinueListening.current = false;
                    speak(
                      'Hello! This is how I sound. I can help you find your dream home!'
                    );
                    // Re-enable after speaking
                    setTimeout(() => {
                      shouldContinueListening.current = wasListening;
                    }, 3000);
                  }}
                  disabled={isSpeaking || isListening}
                  className='text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  title='Test this voice'
                >
                  🔊 Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-6 space-y-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : voiceMode
                  ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 text-gray-900 dark:text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className='flex items-start gap-2'>
                {message.role === 'assistant' &&
                  voiceMode &&
                  index === messages.length - 1 &&
                  isSpeaking && <span className='text-lg'>🔊</span>}
                <p className='text-sm'>{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className='flex justify-start'>
            <div
              className={`rounded-2xl px-4 py-3 ${
                voiceMode
                  ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <div className='flex space-x-2'>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className='px-6 pb-4'>
          <p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
            Try asking:
          </p>
          <div className='flex flex-wrap gap-2'>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className='px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
        {voiceMode ? (
          <div className='text-center py-4'>
            <div
              className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 animate-pulse shadow-lg shadow-red-500/50'
                  : isSpeaking
                  ? 'bg-purple-500 animate-pulse shadow-lg shadow-purple-500/50'
                  : 'bg-blue-500'
              }`}
            >
              {isListening ? (
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z' />
                  <path d='M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z' />
                </svg>
              ) : isSpeaking ? (
                <svg
                  className='w-10 h-10 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
                  />
                </svg>
              ) : (
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z' />
                  <path d='M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z' />
                </svg>
              )}
            </div>
            <p className='mt-4 text-sm font-medium text-gray-700 dark:text-gray-300'>
              {isListening
                ? 'Listening to your request...'
                : isSpeaking
                ? 'Speaking response...'
                : isLoading
                ? 'Processing...'
                : 'Ready - continuous mode active'}
            </p>
            <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
              {isListening
                ? 'Speak now'
                : isSpeaking
                ? 'Please wait...'
                : isLoading
                ? 'Thinking about your request...'
                : 'Will auto-listen in a moment'}
            </p>
            {!isListening && !isSpeaking && !isLoading && (
              <button
                onClick={() => {
                  console.log('👆 Manual restart triggered');
                  startListening();
                }}
                className='mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-300 animate-pulse'
              >
                🎤 Tap to Talk Now
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex gap-3'>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={
                isListening
                  ? 'Listening...'
                  : 'Type or speak your search request...'
              }
              disabled={isLoading || isListening}
              rows={3}
              className='flex-1 px-4 py-4 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:opacity-50 resize-none'
            />
            <div className='flex flex-col gap-2 justify-end'>
              <button
                type='button'
                onClick={toggleOneTimeVoiceSearch}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={isListening ? 'Stop listening' : 'Quick voice input'}
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z' />
                  <path d='M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z' />
                </svg>
              </button>
              <button
                type='submit'
                disabled={isLoading || !input.trim()}
                className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                  />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
