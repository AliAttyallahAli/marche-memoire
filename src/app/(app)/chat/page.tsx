
"use client"

import * as React from "react"
import { Search, Send, Paperclip, ArrowLeft, Phone, Video, Mic, VideoOff, MicOff, X, Pause, Play } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/context/user-context"
import { conversations as initialConversations, messages as initialMessages } from "@/lib/data"
import type { Conversation, Message } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function ChatPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const [conversations, setConversations] = React.useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = React.useState("")
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Video Call State
  const [isVideoCallOpen, setIsVideoCallOpen] = React.useState(false)
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Voice Message State
  const [isRecording, setIsRecording] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordingTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);


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
      type: 'text',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    
    setMessages([...messages, newMessageObj])
    setNewMessage("")
  }

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `La fonctionnalité "${featureName}" sera bientôt disponible.`,
    })
  }

  // --- Voice Message Handlers ---
  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      setAudioChunks([]);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        setAudioChunks(prev => [...prev, event.data]);
      };

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        
        setIsRecording(false);
        setIsPaused(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        
        if (audioChunks.length > 0 && selectedConversation) {
             const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
             const audioUrl = URL.createObjectURL(audioBlob);

             const newAudioMessage: Message = {
                id: `msg${messages.length + 1}`,
                conversationId: selectedConversation.id,
                sender: 'user',
                type: 'audio',
                content: `Message vocal (${Math.round(recordingTime)}s)`,
                audioUrl: audioUrl,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setMessages(prev => [...prev, newAudioMessage]);
              setAudioChunks([]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Accès au micro refusé",
        description: "Veuillez autoriser l'accès au microphone.",
      });
    }
  };

  const stopRecording = (cancel = false) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        if (cancel) {
            setAudioChunks([]);
        }
        setRecordingTime(0);
    }
  };

  const togglePauseResume = () => {
    if (!mediaRecorderRef.current) return;
    
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  }

  React.useEffect(() => {
    if (isVideoCallOpen) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Accès à la caméra refusé',
            description: 'Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.',
          });
        }
      };

      getCameraPermission();
    } else {
        // Stop camera stream when dialog is closed
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [isVideoCallOpen, toast]);

  React.useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
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
                    <div className="flex-1 flex items-center gap-2">
                        <p className="font-semibold">{selectedConversation.name}</p>
                        <Badge variant={roleVariant[selectedConversation.role]} className="capitalize text-xs">{selectedConversation.role}</Badge>
                    </div>
                     <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleFeatureClick('Appel vocal')}>
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <span className="sr-only">Appel vocal</span>
                        </Button>
                        <Dialog open={isVideoCallOpen} onOpenChange={setIsVideoCallOpen}>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Video className="h-5 w-5 text-muted-foreground" />
                                    <span className="sr-only">Appel vidéo</span>
                                </Button>
                            </DialogTrigger>
                             <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Appel vidéo avec {selectedConversation.name}</DialogTitle>
                                </DialogHeader>
                                <div className="aspect-video w-full relative bg-black rounded-md flex items-center justify-center">
                                    <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
                                    {hasCameraPermission === false && (
                                        <Alert variant="destructive" className="w-auto">
                                            <AlertTitle>Accès à la caméra refusé</AlertTitle>
                                            <AlertDescription>
                                                Veuillez autoriser l'accès dans votre navigateur.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                     {hasCameraPermission === null && (
                                        <p className="text-white">Connexion à la caméra...</p>
                                     )}
                                </div>
                                <DialogFooter className="sm:justify-center gap-2">
                                     <Button variant="outline" size="icon" onClick={() => handleFeatureClick('Désactiver la caméra')}>
                                        <VideoOff className="h-5 w-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => handleFeatureClick('Couper le micro')}>
                                        <MicOff className="h-5 w-5" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => setIsVideoCallOpen(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
                                    {message.type === 'audio' && message.audioUrl ? (
                                        <audio controls src={message.audioUrl} className="w-full"></audio>
                                    ) : (
                                        <p className="text-sm">{message.content}</p>
                                    )}
                                    <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                
                <div className={cn(
                    "p-4 border-t bg-muted/20 transition-colors"
                )}>
                   {isRecording ? (
                     <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                           <p className="font-mono text-lg">{new Date(recordingTime * 1000).toISOString().substr(14, 5)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => stopRecording(true)}>
                                <X className="h-5 w-5 text-destructive" />
                                <span className="sr-only">Annuler</span>
                            </Button>
                             <Button variant="ghost" size="icon" onClick={togglePauseResume}>
                                {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                                <span className="sr-only">{isPaused ? 'Reprendre' : 'Pause'}</span>
                            </Button>
                            <Button size="icon" onClick={() => stopRecording(false)}>
                                <Send className="h-5 w-5" />
                                <span className="sr-only">Envoyer</span>
                            </Button>
                        </div>
                     </div>
                   ) : (
                       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => handleFeatureClick('Pièce jointe')}>
                                <Paperclip className="h-5 w-5" />
                                <span className="sr-only">Joindre un fichier</span>
                            </Button>
                            <Input 
                                placeholder="Écrivez votre message..." 
                                className="bg-background"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground" 
                                onClick={startRecording}
                            >
                                <Mic className="h-5 w-5" />
                                <span className="sr-only">Message vocal</span>
                            </Button>
                            <Button type="submit" size="icon">
                                <Send className="h-5 w-5" />
                                <span className="sr-only">Envoyer</span>
                            </Button>
                       </form>
                   )}
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

    