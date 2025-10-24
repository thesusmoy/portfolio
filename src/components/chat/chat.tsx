'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// Component imports
import ChatBottombar from '@/components/chat/chat-bottombar';
import ChatLanding from '@/components/chat/chat-landing';
import ChatMessageContent from '@/components/chat/chat-message-content';
import { SimplifiedChatView } from '@/components/chat/simple-chat-view';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { Info } from 'lucide-react';
import HelperBoost from './HelperBoost';

// ClientOnly component for client-side rendering
//@ts-ignore
const ClientOnly = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return null;
    }

    return <>{children}</>;
};

// Define Avatar component props interface
interface AvatarProps {
    hasActiveTool: boolean;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    isTalking: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
    () =>
        Promise.resolve(({ hasActiveTool, videoRef, isTalking }: AvatarProps) => {
            return (
                <div
                    className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
                >
                    <div className="relative cursor-pointer" onClick={() => (window.location.href = '/')}>
                        <img
                            src="/avatar.png"
                            alt="Avatar"
                            className="h-full w-full object-cover object-[center_top_-5%] scale-95 rounded-full"
                        />
                    </div>
                </div>
            );
        }),
    { ssr: false }
);

const MOTION_CONFIG = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: {
        duration: 0.3,
        // ease: 'easeOut',
        ease: [0.42, 0, 0.58, 1] as const,
    },
};

const Chat = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('query');
    const [autoSubmitted, setAutoSubmitted] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [hasReachedLimit, setHasReachedLimit] = useState(false);
    const [, forceUpdate] = useState({});

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
        stop,
        setMessages,
        setInput,
        reload,
        addToolResult,
        append,
    } = useChat({
        onResponse: (response) => {
            if (response) {
                setLoadingSubmit(false);
                setIsTalking(true);
                if (videoRef.current) {
                    videoRef.current.play().catch((error) => {
                        console.error('Failed to play video:', error);
                    });
                }
            }
        },
        onFinish: () => {
            setLoadingSubmit(false);
            setIsTalking(false);
            if (videoRef.current) {
                videoRef.current.pause();
            }
        },
        onError: (error) => {
            setLoadingSubmit(false);
            setIsTalking(false);
            if (videoRef.current) {
                videoRef.current.pause();
            }

            // Normalize different error shapes so we don't log `undefined`.
            const errMessage =
                error && typeof error === 'object' && 'message' in error
                    ? // @ts-ignore
                      error.message
                    : typeof error === 'string'
                      ? error
                      : String(error);

            console.error('Chat error:', errMessage, error);
            toast.error(`Error: ${errMessage}`);
        },

        onToolCall: (tool) => {
            const toolName = tool.toolCall.toolName;
            console.log('Tool call:', toolName);
        },
    });

    const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
        const latestAIMessageIndex = messages.findLastIndex((m) => m.role === 'assistant');
        const latestUserMessageIndex = messages.findLastIndex((m) => m.role === 'user');

        const result = {
            currentAIMessage: latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
            latestUserMessage: latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
            hasActiveTool: false,
        };

        if (result.currentAIMessage) {
            result.hasActiveTool =
                result.currentAIMessage.parts?.some(
                    (part) => part.type === 'tool-invocation' && part.toolInvocation?.state === 'result'
                ) || false;
        }

        if (latestAIMessageIndex < latestUserMessageIndex) {
            result.currentAIMessage = null;
        }

        return result;
    }, [messages]);

    const isToolInProgress = messages.some(
        (m) =>
            m.role === 'assistant' &&
            m.parts?.some((part) => part.type === 'tool-invocation' && part.toolInvocation?.state !== 'result')
    );

    //@ts-ignore
    const submitQuery = (query) => {
        if (!query.trim() || isToolInProgress) return;

        // Force re-render to update remaining messages counter
        forceUpdate({});

        setLoadingSubmit(true);
        append({
            role: 'user',
            content: query,
        });
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.loop = true;
            videoRef.current.muted = true;
            videoRef.current.playsInline = true;
            videoRef.current.pause();
        }

        if (initialQuery && !autoSubmitted) {
            setAutoSubmitted(true);
            setInput('');
            submitQuery(initialQuery);
        }
    }, [initialQuery, autoSubmitted]);

    useEffect(() => {
        if (videoRef.current) {
            if (isTalking) {
                videoRef.current.play().catch((error) => {
                    console.error('Failed to play video:', error);
                });
            } else {
                videoRef.current.pause();
            }
        }
    }, [isTalking]);

    //@ts-ignore
    const onSubmit = (e) => {
        e.preventDefault();

        if (!input.trim() || isToolInProgress) return;
        submitQuery(input);
        setInput('');
    };

    const handleStop = () => {
        stop();
        setLoadingSubmit(false);
        setIsTalking(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    // Check if this is the initial empty state (no messages)
    const isEmptyState = !currentAIMessage && !latestUserMessage && !loadingSubmit;

    // Calculate header height based on hasActiveTool
    const headerHeight = hasActiveTool ? 100 : 180;

    return (
        <div className="relative h-screen overflow-hidden">
            <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-1 md:flex-row"></div>

            {/* Fixed Avatar Header with Gradient */}
            <div
                className="fixed top-0 right-0 left-0 z-50"
                style={{
                    background:
                        'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
                }}
            >
                <div className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}>
                    <div className="flex justify-center">
                        <ClientOnly>
                            <Avatar hasActiveTool={hasActiveTool} videoRef={videoRef} isTalking={isTalking} />
                        </ClientOnly>
                    </div>

                    <AnimatePresence>
                        {latestUserMessage && !currentAIMessage && (
                            <motion.div {...MOTION_CONFIG} className="mx-auto mt-12 flex max-w-3xl px-4">
                                <ChatBubble variant="sent">
                                    <ChatBubbleMessage>
                                        <ChatMessageContent
                                            message={latestUserMessage}
                                            isLast={true}
                                            isLoading={false}
                                            reload={() => Promise.resolve(null)}
                                        />
                                    </ChatBubbleMessage>
                                </ChatBubble>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto flex h-full max-w-3xl flex-col">
                {/* Scrollable Chat Content */}
                <div className="flex-1 overflow-y-auto px-2" style={{ paddingTop: `${headerHeight}px` }}>
                    <AnimatePresence mode="wait">
                        {isEmptyState ? (
                            <motion.div
                                key="landing"
                                className="flex min-h-full items-center justify-center"
                                {...MOTION_CONFIG}
                            >
                                <ChatLanding submitQuery={submitQuery} />
                            </motion.div>
                        ) : currentAIMessage ? (
                            <div className="pb-4">
                                <SimplifiedChatView
                                    message={currentAIMessage}
                                    isLoading={isLoading}
                                    reload={reload}
                                    addToolResult={addToolResult}
                                />
                            </div>
                        ) : (
                            loadingSubmit && (
                                <motion.div key="loading" {...MOTION_CONFIG} className="px-4 pt-18">
                                    <ChatBubble variant="received">
                                        <ChatBubbleMessage isLoading />
                                    </ChatBubble>
                                </motion.div>
                            )
                        )}
                    </AnimatePresence>
                </div>

                {/* Fixed Bottom Bar */}
                <div className="sticky bottom-0 bg-white px-2 pt-3 md:px-0 md:pb-4">
                    <div className="relative flex flex-col items-center gap-3">
                        <HelperBoost submitQuery={submitQuery} setInput={setInput} />
                        <ChatBottombar
                            input={hasReachedLimit ? "You've reached your message limit." : input}
                            handleInputChange={hasReachedLimit ? () => {} : handleInputChange}
                            handleSubmit={onSubmit}
                            isLoading={isLoading}
                            stop={handleStop}
                            isToolInProgress={isToolInProgress || hasReachedLimit}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
