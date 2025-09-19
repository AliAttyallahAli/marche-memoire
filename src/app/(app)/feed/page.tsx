
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
import { posts as initialPosts, user } from "@/lib/data"
import type { Post } from "@/lib/data"
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react"

const postFormSchema = z.object({
  content: z.string().min(1, "La publication ne peut pas être vide.").max(280, "La publication ne peut pas dépasser 280 caractères."),
})

export default function FeedPage() {
  const { toast } = useToast()
  const [posts, setPosts] = React.useState<Post[]>(initialPosts)

  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      content: "",
    },
  })

  function onSubmit(values: z.infer<typeof postFormSchema>) {
    const newPost: Post = {
      id: `post${posts.length + 1}`,
      authorName: user.name,
      authorHandle: user.email.split('@')[0],
      authorAvatar: user.avatar,
      content: values.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
    }
    setPosts([newPost, ...posts])
    form.reset()
    toast({
      title: "Publié !",
      description: "Votre mise à jour a été ajoutée au fil d'actualités.",
    })
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col gap-6">
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
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
                <div className="flex justify-end">
                  <Button type="submit" className="w-full">Publier</Button>
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
                    <Avatar>
                        <AvatarImage src={post.authorAvatar} data-ai-hint="user avatar" />
                        <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{post.authorName}</p>
                        <p className="text-muted-foreground text-xs">{new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>

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
}
