

"use client"

import * as React from "react"
import { Search, Send, Paperclip, ArrowLeft } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { conversations as initialConversations, messages as initialMessages, user } from "@/lib/data"
import type { Conversation, Message } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function ChatPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = React.useState("")
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

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

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, selectedConversation]);
  
  const currentMessages = selectedConversation 
    ? messages.filter(m => m.conversationId === selectedConversation.id)
    : []

  const roleVariant = {
    admin: 'default',
    vendor: 'secondary',
    user: 'outline'
  } as const

  return (
    <Card className="h-[calc(100vh-8rem)] w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
            "flex flex-col border-r h-full bg-muted/20",
            selectedConversation && "hidden md:flex"
        )}>
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold tracking-tight">Messages</h2>
                    <div className="relative">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                    </div>
                </div>
                <div className="relative mt-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." className="pl-8 bg-background" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                 <div className="flex flex-col">
                    {conversations.map((convo) => (
                        <button
                            key={convo.id}
                            onClick={() => handleSelectConversation(convo)}
                            className={cn(
                                "flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b",
                                selectedConversation?.id === convo.id && "bg-muted"
                            )}
                        >
                            <div className="relative">
                                <Avatar className={cn(
                                    "h-12 w-12",
                                    convo.hasStory && "ring-2 ring-offset-2 ring-primary ring-offset-background"
                                )}>
                                    <AvatarImage src={convo.avatar} data-ai-hint="user avatar" />
                                    <AvatarFallback>{convo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                {convo.status === 'online' && (
                                     <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                                )}
                            </div>
                            <div className="flex-1 truncate">
                                <p className="font-semibold">{convo.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                            </div>
                            <div className="text-xs text-muted-foreground self-start">{convo.lastMessageTimestamp}</div>
                        </button>
                    ))}
                 </div>
            </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={cn(
            "md:col-span-2 lg:col-span-3 flex-col h-full bg-background",
            selectedConversation ? "flex" : "hidden md:flex"
        )}>
            {selectedConversation ? (
                <>
                <div className="flex items-center gap-4 p-3 border-b bg-muted/20">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                        <ArrowLeft className="h-5 w-5" />
                        <span className="sr-only">Retour</span>
                    </Button>
                    <div className="relative">
                        <Avatar className={cn(
                          selectedConversation.hasStory && "ring-2 ring-offset-2 ring-primary ring-offset-card"
                        )}>
                            <AvatarImage src={selectedConversation.avatar} data-ai-hint="user avatar" />
                            <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                         {selectedConversation.status === 'online' && (
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{selectedConversation.name}</p>
                        <Badge variant={roleVariant[selectedConversation.role]} className="capitalize text-xs">{selectedConversation.role}</Badge>
                    </div>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
                    <div className="flex flex-col gap-4">
                        {currentMessages.map((message) => (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex w-full",
                                    message.sender === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                     "max-w-xs md:max-w-md lg:max-w-xl rounded-lg px-4 py-2 relative",
                                     message.sender === 'user'
                                     ? "bg-primary text-primary-foreground rounded-br-none"
                                     : "bg-muted rounded-bl-none"
                                )}>
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="p-4 border-t bg-muted/20">
                   <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Paperclip className="h-5 w-5" />
                            <span className="sr-only">Joindre un fichier</span>
                        </Button>
                        <Input 
                            placeholder="Écrivez votre message..." 
                            className="bg-background"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon">
                            <Send className="h-5 w-5" />
                            <span className="sr-only">Envoyer</span>
                        </Button>
                   </form>
                </div>

                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <h2 className="text-xl font-semibold">Bienvenue sur le Chat ZOUDOU</h2>
                    <p className="text-muted-foreground">Sélectionnez une conversation pour commencer à discuter.</p>
                </div>
            )}
        </div>
    </Card>
  )
}

    
