
"use client"

import * as React from "react"
import { Search, Send, Paperclip } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { conversations as initialConversations, messages as initialMessages, user } from "@/lib/data"
import type { Conversation, Message } from "@/lib/data"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(conversations[0] || null)
  const [newMessage, setNewMessage] = React.useState("")

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "" || !selectedConversation) return

    const newMessageObj: Message = {
      id: `msg${messages.length + 1}`,
      conversationId: selectedConversation.id,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    
    setMessages([...messages, newMessageObj])
    setNewMessage("")
  }
  
  const currentMessages = selectedConversation 
    ? messages.filter(m => m.conversationId === selectedConversation.id)
    : []

  return (
    <Card className="h-[calc(100vh-8rem)] w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="flex flex-col border-r h-full">
            <div className="p-4">
                <h2 className="text-xl font-semibold tracking-tight">Messages</h2>
                <div className="relative mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." className="pl-8" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                 <div className="flex flex-col">
                    {conversations.map((convo) => (
                        <button
                            key={convo.id}
                            onClick={() => handleSelectConversation(convo)}
                            className={cn(
                                "flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors",
                                selectedConversation?.id === convo.id && "bg-muted"
                            )}
                        >
                            <Avatar>
                                <AvatarImage src={convo.avatar} data-ai-hint="user avatar" />
                                <AvatarFallback>{convo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 truncate">
                                <p className="font-semibold">{convo.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">{convo.lastMessageTimestamp}</div>
                        </button>
                    ))}
                 </div>
            </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
            {selectedConversation ? (
                <>
                <div className="flex items-center gap-4 p-3 border-b">
                    <Avatar>
                         <AvatarImage src={selectedConversation.avatar} data-ai-hint="user avatar" />
                         <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{selectedConversation.name}</p>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-4">
                        {currentMessages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex items-end gap-2",
                                    message.sender === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.sender !== 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selectedConversation.avatar} data-ai-hint="user avatar" />
                                        <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "max-w-xs md:max-w-md lg:max-w-xl rounded-lg px-4 py-2",
                                        message.sender === 'user'
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    )}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
                                </div>
                                {message.sender === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                
                <Separator />
                
                <div className="p-4">
                   <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5" />
                            <span className="sr-only">Joindre un fichier</span>
                        </Button>
                        <Input 
                            placeholder="Écrivez votre message..." 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit">
                            <Send className="h-5 w-5" />
                            <span className="sr-only">Envoyer</span>
                        </Button>
                   </form>
                </div>

                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-xl font-semibold">Bienvenue sur le Chat N+</h2>
                    <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à discuter.</p>
                </div>
            )}
        </div>
    </Card>
  )
}
