import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MessageSquare, X, Send, AlertTriangle, Phone, Video, FileText, Paperclip, Smile, Search, User, Users } from "lucide-react";
import { toast } from "../../hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../services/api";
import { useLocation } from "wouter";

// Type definitions
interface ChatUser {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'offline' | 'busy';
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  messageType?: string;
  attachments?: string[]; // For file attachments
  readStatus?: 'sent' | 'delivered' | 'read';
}

interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  status: 'online' | 'offline' | 'busy';
}

// Function to send urgent message to a specific doctor
const sendUrgentMessageToDoctor = (user: any, isConnected: boolean, sendMessage: Function, doctorId: string, messageContent: string) => {
  if (!isConnected) {
    toast({
      title: "Error",
      description: "Not connected to chat service",
      variant: "destructive"
    });
    return;
  }

  sendMessage({
    type: 'chat_message',
    senderId: user?.id,
    receiverId: doctorId,
    content: `[URGENT] ${messageContent}`,
    messageType: 'emergency'
  });

  toast({
    title: "Message Sent",
    description: "Urgent message sent to doctor"
  });
};

export default function ChatInterface() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isConnected, sendMessage, messages: wsMessages } = useWebSocket();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [location] = useLocation(); // Get current location

  // Determine if we're on the full chat page
  const isFullPage = location === "/chat";

  // Fetch users when chat is opened
  useEffect(() => {
    if (isOpen && user) {
      // In a real implementation, this would fetch users from an API
      // For now, we'll simulate with mock data based on user role
      const mockUsers: ChatUser[] = user.role === "patient"
        ? [
          { id: "doctor1", name: "Dr. Smith", role: "doctor", status: "online" },
          { id: "doctor2", name: "Dr. Johnson", role: "doctor", status: "busy" },
          { id: "reception1", name: "Reception Desk", role: "reception", status: "online" }
        ]
        : user.role === "reception"
          ? [
            { id: "patient1", name: "John Doe", role: "patient", status: "online" },
            { id: "patient2", name: "Jane Smith", role: "patient", status: "offline", lastSeen: "2 hours ago" },
            { id: "doctor1", name: "Dr. Smith", role: "doctor", status: "busy" }
          ]
          : user.role === "doctor"
            ? [
              { id: "patient1", name: "John Doe", role: "patient", status: "online" },
              { id: "patient2", name: "Jane Smith", role: "patient", status: "offline", lastSeen: "2 hours ago" },
              { id: "reception1", name: "Reception Desk", role: "reception", status: "online" }
            ]
            : [];

      setUsers(mockUsers);

      // Initialize conversations
      const mockConversations: ChatConversation[] = mockUsers.map(u => ({
        id: u.id,
        userId: u.id,
        userName: u.name,
        userRole: u.role,
        unreadCount: Math.floor(Math.random() * 3),
        lastMessage: "Hello, how can I help you?",
        lastMessageTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        status: u.status
      }));

      setConversations(mockConversations);
    }
  }, [isOpen, user]);

  // Fetch messages when a user is selected
  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", user?.id, selectedUser],
    queryFn: async () => {
      if (!user?.id || !selectedUser) return [];
      const { data } = await messageService.getByUserId(selectedUser);
      return data || [];
    },
    enabled: !!user?.id && !!selectedUser,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, wsMessages]);

  // Listen for custom event to open chat
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => {
      window.removeEventListener('openChat', handleOpenChat);
    };
  }, []);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    // If urgent message from reception or doctor, prepend urgent notice
    const content = (isUrgent && (user?.role === "reception" || user?.role === "doctor"))
      ? `[URGENT] ${message}`
      : message;

    // Send message through WebSocket
    sendMessage({
      type: 'chat_message',
      senderId: user?.id,
      receiverId: selectedUser,
      content: content,
      messageType: isUrgent ? 'emergency' : 'direct',
      attachments: attachments.length > 0 ? attachments.map(f => f.name) : undefined
    });

    // Update local conversation list with the new message
    setConversations(prev => prev.map(conv => {
      if (conv.userId === selectedUser) {
        return {
          ...conv,
          lastMessage: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
          lastMessageTime: new Date().toISOString(),
          unreadCount: conv.unreadCount + 1 // Increment unread count for recipient
        };
      }
      return conv;
    }));

    // Show notification that message was sent
    toast({
      title: "Message Sent",
      description: `Your message to ${users.find(u => u.id === selectedUser)?.name || "the recipient"} has been sent.`,
    });

    // Clear input fields
    setMessage("");
    setIsUrgent(false);
    setAttachments([]);

    // Refetch messages to ensure UI is updated
    setTimeout(() => {
      refetch();
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only show chat for patient, reception, and doctor users
  if (!user || (user.role !== "patient" && user.role !== "reception" && user.role !== "doctor")) {
    return null;
  }

  // If this is the full page version, we want it always open
  if (isFullPage) {
    return (
      <div className="w-full h-screen flex flex-col">
        {/* Full Page Chat Header */}
        <div className="bg-blue-600 text-white p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-xl flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              {t("internal_chat")}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {isConnected ? t("online") : t("offline")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 overflow-hidden">
          {renderChatContent()}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsOpen(true)}
          data-testid="chat-toggle"
        >
          <MessageSquare className="h-6 w-6 text-white" />
          {conversations.some(c => c.unreadCount > 0) && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-white">
              {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] shadow-xl z-50 border-2 border-blue-300 bg-white rounded-lg" data-testid="chat-interface">
          <div className="bg-blue-600 text-white rounded-t-lg p-3">
            <div className="flex items-center justify-between">
              <div className="text-lg flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                {t("internal_chat")}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {isConnected ? t("online") : t("offline")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 hover:bg-blue-500"
                  data-testid="chat-close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-0 flex h-[452px]">
            {renderChatContent()}
          </div>
        </div>
      )}
    </>
  );

  // Extract chat content to a separate function for reuse
  function renderChatContent() {
    return (
      <>
        {/* Conversation List */}
        {!selectedUser && (
          <div className={isFullPage ? "w-full md:w-1/3 border-r flex flex-col" : "w-full flex flex-col"}>
            {/* Search Bar */}
            <div className="p-3 border-b border-blue-200 bg-blue-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto text-blue-400 mb-3" />
                  <p className="text-blue-700">No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center p-3 border-b border-blue-100 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleConversationClick(conv.userId)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${conv.status === 'online' ? 'bg-green-500' :
                        conv.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                        }`}></div>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="font-medium text-blue-900 truncate">{conv.userName}</p>
                        {conv.lastMessageTime && (
                          <span className="text-xs text-blue-500">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-blue-700 truncate">{conv.lastMessage || "No messages yet"}</p>
                        {conv.unreadCount > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 bg-blue-500 text-white text-xs">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        {selectedUser && (
          <div className={isFullPage ? "w-full md:w-2/3 flex flex-col" : "w-full flex flex-col"}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b border-blue-200 bg-blue-50">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(null);
                    resetUnreadCount(); // Reset unread count when closing chat
                  }}
                  className="mr-2 text-blue-700 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white"></div>
                </div>
                <div className="ml-2">
                  <p className="font-medium text-blue-900">
                    {users.find(u => u.id === selectedUser)?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-blue-600">Online</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-100">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-blue-25 space-y-3">
              {/* Historical messages */}
              {messages.map((msg: ChatMessage) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-900'
                      } ${msg.messageType === 'emergency' ? 'border-2 border-red-500' : ''}`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs opacity-80">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === user.id && (
                        <span className="text-xs">
                          {msg.readStatus === 'read' ? '✓✓' : msg.readStatus === 'delivered' ? '✓' : 'Sending...'}
                        </span>
                      )}
                    </div>
                    {msg.messageType === 'emergency' && (
                      <div className="flex items-center mt-1 text-red-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        <span className="text-xs font-bold">URGENT</span>
                      </div>
                    )}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center bg-blue-200 rounded px-2 py-1">
                            <FileText className="h-3 w-3 mr-1" />
                            <span className="text-xs truncate max-w-[80px]">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Real-time WebSocket messages */}
              {wsMessages
                .filter((msg: any) =>
                  (msg.senderId === user.id && msg.receiverId === selectedUser) ||
                  (msg.senderId === selectedUser && msg.receiverId === user.id)
                )
                .map((msg: any, index: number) => (
                  <div
                    key={`ws-${index}`}
                    className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-900'
                        } ${msg.messageType === 'emergency' ? 'border-2 border-red-500' : ''}`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs opacity-80">Just now</span>
                        {msg.senderId === user.id && (
                          <span className="text-xs">Sending...</span>
                        )}
                      </div>
                      {msg.messageType === 'emergency' && (
                        <div className="flex items-center mt-1 text-red-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span className="text-xs font-bold">URGENT</span>
                        </div>
                      )}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {msg.attachments.map((attachment: string, index: number) => (
                            <div key={index} className="flex items-center bg-blue-200 rounded px-2 py-1">
                              <FileText className="h-3 w-3 mr-1" />
                              <span className="text-xs truncate max-w-[80px]">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="px-4 py-2 border-t border-blue-200 bg-blue-50">
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center bg-blue-100 rounded px-2 py-1">
                      <FileText className="h-4 w-4 mr-1 text-blue-600" />
                      <span className="text-xs text-blue-800 truncate max-w-[100px]">{file.name}</span>
                      <button
                        onClick={() => removeAttachment(index)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-3 border-t border-blue-200 bg-white">
              {(user.role === "reception" || user.role === "doctor") && (
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="urgent-message"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="mr-2 h-4 w-4 text-red-600 rounded focus:ring-red-500"
                  />
                  <label htmlFor="urgent-message" className="flex items-center text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Mark as urgent
                  </label>
                </div>
              )}
              <div className="flex space-x-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-700 hover:bg-blue-100"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                </div>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-blue-700 hover:bg-blue-100"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-10 left-0 bg-white border border-blue-200 rounded-lg shadow-lg p-2 w-48">
                      <div className="grid grid-cols-6 gap-1">
                        {['😀', '😂', '😍', '👍', '❤️', '👏', '😊', '😎', '🤩', '🥳', '😢', '😡'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => addEmoji(emoji)}
                            className="text-lg p-1 hover:bg-blue-100 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Input
                  placeholder={t("type_message")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                  data-testid="message-input"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!message.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700"
                  data-testid="send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Add a prop to reset unread count when chat is opened
  const resetUnreadCount = () => {
    // This would typically be passed from the parent component
    // For now, we'll just log it
    console.log("Resetting unread count");
  };

  // Update the conversation list click handler to reset unread count
  const handleConversationClick = (userId: string) => {
    setSelectedUser(userId);
    // Reset unread count for this conversation
    setConversations(prev => prev.map(conv =>
      conv.userId === userId ? { ...conv, unreadCount: 0 } : conv
    ));
  };
}

// Export the urgent messaging function for use in other components
export { sendUrgentMessageToDoctor };