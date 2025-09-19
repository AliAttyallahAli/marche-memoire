
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
import { MessageSquare, Repeat, Heart } from "lucide-react"

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
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Fil d'actualités</h1>
            <p className="text-muted-foreground">
            Découvrez les dernières mises à jour de la communauté.
            </p>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex gap-4">
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
                              placeholder="Quoi de neuf ?"
                              className="resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none text-base p-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Publier</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Card className="shadow-none border-0 bg-transparent">
                <CardContent className="p-4 flex gap-4">
                  <Avatar>
                    <AvatarImage src={post.authorAvatar} data-ai-hint="user avatar" />
                    <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.authorName}</p>
                      <p className="text-muted-foreground text-sm">@{post.authorHandle}</p>
                      <p className="text-muted-foreground text-sm">· {new Date(post.timestamp).toLocaleDateString()}</p>
                    </div>
                    <p className="text-base leading-snug">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between mt-4 text-muted-foreground">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                        </Button>
                         <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Repeat className="h-4 w-4" />
                            <span>{post.shares}</span>
                        </Button>
                         <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {index < posts.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
