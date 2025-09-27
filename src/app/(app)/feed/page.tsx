
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
import { MessageSquare, ThumbsUp, Share2, PlusCircle, Image as ImageIcon, Video, Smile, MapPin, ListChecks } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { stories } from "@/lib/data"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

const postFormSchema = z.object({
  content: z.string().min(1, "La publication ne peut pas être vide.").max(280, "La publication ne peut pas dépasser 280 caractères."),
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

export default function FeedPage() {
  const { toast } = useToast()
  const { user, posts, addPost } = useUser()

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
    },
  })

  function onSubmit(values: z.infer<typeof postFormSchema>) {
    if (!user) return;
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
    }
    addPost(newPost);
    form.reset()
    toast({
      title: "Publié !",
      description: "Votre mise à jour a été ajoutée au fil d'actualités.",
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      control={form.control}
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
                  </div>
                </div>
                 <Separator />
                <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon"><ImageIcon className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon"><Video className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon"><ListChecks className="h-5 w-5 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon"><MapPin className="h-5 w-5 text-muted-foreground" /></Button>
                    </div>
                  <Button type="submit">Publier</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
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

                <div className="flex justify-between text-muted-foreground text-sm">
                    <div>{post.likes} J'aime</div>
                    <div>{post.comments} Commentaires</div>
                </div>

                <Separator />
                
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="ghost" className="flex items-center justify-center gap-2">
                        <ThumbsUp className="h-5 w-5" />
                        <span>J'aime</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center justify-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <span>Commenter</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center justify-center gap-2">
                        <Share2 className="h-5 w-5" />
                        <span>Partager</span>
                    </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

    