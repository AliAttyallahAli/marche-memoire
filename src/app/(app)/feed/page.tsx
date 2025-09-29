
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@/context/user-context"
import type { Post } from "@/lib/data"
import { MessageSquare, ThumbsUp, Share2, PlusCircle, Image as ImageIcon, Video, Smile, MapPin, ListChecks, Copy, Heart, Send } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { stories } from "@/lib/data"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FaWhatsapp, FaTwitter, FaFacebook } from "react-icons/fa"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { getSentiment } from "@/ai/flows/sentiment-flow"

const postFormSchema = z.object({
  content: z.string().min(1, "La publication ne peut pas être vide.").max(280, "La publication ne peut pas dépasser 280 caractères."),
  image: z.any().optional(),
  videoUrl: z.string().url("Veuillez entrer une URL de vidéo valide.").optional().or(z.literal('')),
})

const commentFormSchema = z.object({
  comment: z.string().min(1, "Le commentaire ne peut être vide."),
})

function PostTimestamp({ timestamp }: { timestamp: string }) {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null; 
    }

    const postDate = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "à l'instant";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours} h`;
    
    return postDate.toLocaleDateString();
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  let videoId: string | null = null;
  if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get("v");
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default function FeedPage() {
  const { toast } = useToast()
  const { user, posts, addPost, updatePost, addComment } = useUser()
  const [likedPosts, setLikedPosts] = React.useState<Set<string>>(new Set())
  const [activeCommentPostId, setActiveCommentPostId] = React.useState<string | null>(null)
  const [showImageInput, setShowImageInput] = React.useState(false)
  const [showVideoInput, setShowVideoInput] = React.useState(false)

  const postForm = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
      image: undefined,
      videoUrl: "",
    },
  })

  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: "",
    },
  })

  async function onPostSubmit(values: z.infer<typeof postFormSchema>) {
    if (!user) return;
  
    const sentiment = await getSentiment(values.content);

    const handlePostCreation = (imageUrl?: string) => {
        const newPost: Post = {
          id: `post${posts.length + 1}`,
          authorName: user.name,
          authorHandle: user.email.split('@')[0],
          authorAvatar: user.avatar,
          authorStatus: user.status,
          authorRole: user.role,
          content: values.content,
          timestamp: new Date().toISOString(),
          likes: 0,
          comments: 0,
          shares: 0,
          imageUrl: imageUrl,
          videoUrl: values.videoUrl,
          commentsData: [],
          sentiment: sentiment,
        }
        addPost(newPost);
        postForm.reset()
        setShowImageInput(false)
        setShowVideoInput(false)
        toast({
          title: "Publié !",
          description: "Votre mise à jour a été ajoutée au fil d'actualités.",
        })
    }

    if (values.image && values.image[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handlePostCreation(imageUrl);
      };
      reader.readAsDataURL(values.image[0]);
    } else {
        handlePostCreation();
    }
  }
  
  function onCommentSubmit(postId: string) {
    return (values: z.infer<typeof commentFormSchema>) => {
        if (!user) return;
        addComment({
            postId: postId,
            authorName: user.name,
            authorAvatar: user.avatar,
            content: values.comment,
        });
        commentForm.reset();
        setActiveCommentPostId(null);
        toast({
            title: "Commentaire ajouté",
            description: "Votre commentaire a été publié.",
        });
    };
  }

  const handleLike = (postId: string) => {
    const post = posts.find(p => p.id === postId)
    if (!post) return

    const newLikedPosts = new Set(likedPosts)
    let newLikesCount

    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId)
      newLikesCount = post.likes - 1
    } else {
      newLikedPosts.add(postId)
      newLikesCount = post.likes + 1
    }

    setLikedPosts(newLikedPosts)
    updatePost(postId, { likes: newLikesCount })
  }
  
  const handleCopyLink = (postId: string) => {
    const url = `${window.location.origin}/feed#${postId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copié !",
      description: "Le lien de la publication a été copié.",
    });
  }

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `La possibilité d'ajouter ${featureName} sera bientôt disponible.`,
    })
  }


  const roleVariant = {
    admin: 'default',
    vendor: 'secondary',
    user: 'outline'
  } as const

  if (!user) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-8 w-24 mb-4" />
              <div className="flex space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col gap-6">
        <Card>
            <CardContent className="p-4">
                <h2 className="text-lg font.semibold mb-4">Stories</h2>
                 <ScrollArea className="w-full whitespace-nowrap rounded-md">
                    <div className="flex w-max space-x-4 pb-4">
                        <div className="flex flex-col items-center space-y-2 w-20 text-center">
                            <button className="relative">
                                <Avatar className="h-16 w-16 border-2 border-dashed border-muted-foreground">
                                    <div className="flex items-center justify-center h-full w-full">
                                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                </Avatar>
                            </button>
                            <p className="text-xs font.medium truncate">Ajouter</p>
                        </div>
                        {stories.map((story) => (
                            <div key={story.id} className="flex flex-col items-center space-y-2 w-20 text-center">
                                <button className="relative">
                                     <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-primary ring-offset-background">
                                        <AvatarImage src={story.authorAvatar} data-ai-hint="user avatar story" />
                                        <AvatarFallback>{story.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                </button>
                                <p className="text-xs font.medium truncate">{story.authorName.split(' ')[0]}</p>
                            </div>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <Form {...postForm}>
              <form onSubmit={postForm.handleSubmit(onPostSubmit)} className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                     <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={postForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder={`Quoi de neuf, ${user.name.split(' ')[0]} ?`}
                              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-lg p-0"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {showImageInput && (
                      <FormField
                        control={postForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormControl>
                              <Input type="file" accept="image/*" {...postForm.register("image")} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {showVideoInput && (
                        <FormField
                            control={postForm.control}
                            name="videoUrl"
                            render={({ field }) => (
                                <FormItem className="mt-4">
                                    <FormControl>
                                        <Input placeholder="Collez l'URL de la vidéo (ex: YouTube)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                  </div>
                </div>
                 <Separator />
                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => {setShowImageInput(!showImageInput); setShowVideoInput(false)}} type="button">
                            <ImageIcon className={cn("h-5 w-5 text-muted-foreground", showImageInput && "text-primary")} />
                        </Button>
                        <Button variant="ghost" size="icon" type="button" onClick={() => {setShowVideoInput(!showVideoInput); setShowImageInput(false)}}>
                            <Video className={cn("h-5 w-5 text-muted-foreground", showVideoInput && "text-primary")} />
                        </Button>
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleFeatureClick("un sentiment")}><Smile className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleFeatureClick("un sondage")}><ListChecks className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" type="button" onClick={() => handleFeatureClick("votre localisation")}><MapPin className="h-5 w-5 text-muted-foreground" /></Button>
                    </div>
                  <Button type="submit">Publier</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {posts.map((post) => {
            const isLiked = likedPosts.has(post.id)
            const postUrl = typeof window !== 'undefined' ? `${window.location.origin}/feed#${post.id}` : '';
            const shareText = encodeURIComponent(post.content);
            const embedUrl = post.videoUrl ? getYouTubeEmbedUrl(post.videoUrl) : null;

            return (
            <Card key={post.id} id={post.id}>
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar>
                            <AvatarImage src={post.authorAvatar} data-ai-hint="user avatar" />
                            <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {post.authorStatus === 'online' && (
                             <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <p className="font.semibold">{post.authorName}</p>
                           {post.sentiment && <span className="text-sm">{post.sentiment}</span>}
                           <Badge variant={roleVariant[post.authorRole]} className="capitalize text-xs">{post.authorRole}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            <PostTimestamp timestamp={post.timestamp} />
                        </p>
                    </div>
                </div>
                
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

                {post.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <Image src={post.imageUrl} alt="Contenu de la publication" fill className="object-cover" data-ai-hint="post image" />
                    </div>
                )}
                
                {embedUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    ></iframe>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground text-sm">
                    <div>{post.likes} J'aime</div>
                    <div>{post.comments} Commentaires</div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="ghost" className="flex items-center justify-center gap-2" onClick={() => handleLike(post.id)}>
                        <Heart className={cn("h-5 w-5", isLiked && "fill-red-500 text-red-500")} />
                        <span>J'aime</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center justify-center gap-2" onClick={() => setActiveCommentPostId(post.id)}>
                        <MessageSquare className="h-5 w-5" />
                        <span>Commenter</span>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="flex items-center justify-center gap-2">
                                <Share2 className="h-5 w-5" />
                                <span>Partager</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Partager la publication</DialogTitle>
                                <DialogDescription>Partagez cette publication sur vos plateformes préférées.</DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center gap-4 py-4">
                               <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full"><FaFacebook className="h-6 w-6" /></Button>
                               </a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${shareText}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full"><FaTwitter className="h-6 w-6" /></Button>
                                </a>
                                <a href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(postUrl)}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full"><FaWhatsapp className="h-6 w-6" /></Button>
                                </a>
                            </div>
                            <Separator />
                            <div className="flex items-center space-x-2 pt-4">
                                <Input value={postUrl} readOnly className="flex-1 font-mono text-xs" />
                                <Button size="icon" onClick={() => handleCopyLink(post.id)}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {post.commentsData && post.commentsData.length > 0 && <Separator />}

                {post.commentsData?.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.authorAvatar} />
                            <AvatarFallback>{comment.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-sm">{comment.authorName}</p>
                                <p className="text-xs text-muted-foreground"><PostTimestamp timestamp={comment.timestamp} /></p>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                        </div>
                    </div>
                ))}

                {activeCommentPostId === post.id && (
                    <Form {...commentForm}>
                        <form onSubmit={commentForm.handleSubmit(onCommentSubmit(post.id))} className="flex items-start gap-3 pt-4">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="w-full relative">
                                <FormField
                                    control={commentForm.control}
                                    name="comment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Écrivez un commentaire..."
                                                    className="pr-12"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" size="icon" className="absolute top-2 right-2 h-7 w-7">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}


              </CardContent>
            </Card>
          )})}
        </div>
      </div>
    </div>
  )
}

    