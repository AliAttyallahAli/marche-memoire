
"use client"

import * as React from "react"
import { notFound } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { User, Post } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { MessageSquare, Rss } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

function PublicProfileSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1 flex flex-col gap-8">
        <Card>
          <CardHeader className="items-center">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="h-6 w-32 mt-4" />
            <Skeleton className="h-4 w-40 mt-1" />
            <div className="pt-2 flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  const { allUsers, posts } = useUser()
  const [profileUser, setProfileUser] = React.useState<User | null | undefined>(undefined)
  const [userPosts, setUserPosts] = React.useState<Post[]>([])

  React.useEffect(() => {
    const foundUser = allUsers.find(u => u.id === params.id);
    setProfileUser(foundUser)
    if(foundUser) {
        const foundPosts = posts.filter(p => p.authorId === foundUser.id)
        setUserPosts(foundPosts)
    }
  }, [params.id, allUsers, posts])

  if (profileUser === undefined) {
    return <PublicProfileSkeleton />
  }

  if (profileUser === null) {
    notFound()
    return null;
  }
  
  const kycStatusVariant = {
    Verified: 'default',
    Pending: 'secondary',
    Rejected: 'destructive',
    'Not Submitted': 'outline',
  } as const

  const roleVariant = {
    admin: 'default',
    vendor: 'secondary',
    user: 'outline'
  } as const

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1 flex flex-col gap-8">
        <Card>
          <CardHeader className="items-center">
            <Avatar className="w-24 h-24 mb-2">
              <AvatarImage src={profileUser.avatar} data-ai-hint="user avatar" />
              <AvatarFallback>{profileUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <CardTitle>{profileUser.name}</CardTitle>
            <CardDescription>{profileUser.email}</CardDescription>
            <div className="pt-2 flex items-center gap-2">
              <Badge variant={roleVariant[profileUser.role]} className="capitalize">{profileUser.role}</Badge>
              <Badge variant={kycStatusVariant[profileUser.kycStatus]}>{profileUser.kycStatus}</Badge>
            </div>
          </CardHeader>
           <CardContent>
                <Button className="w-full" asChild>
                    <Link href={`/chat?user=${profileUser.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Envoyer un message
                    </Link>
                </Button>
           </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Rss className="h-5 w-5" /> 
                Dernières publications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {userPosts.length > 0 ? (
                userPosts.map(post => (
                    <Link key={post.id} href={`/feed#${post.id}`} className="block p-4 rounded-lg border hover:bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-2">
                            {new Date(post.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <p className="font-medium leading-snug line-clamp-3">{post.content}</p>
                        {post.imageUrl && (
                            <div className="mt-2 relative aspect-video w-full rounded-md overflow-hidden">
                                <Image src={post.imageUrl} alt="Image de la publication" fill className="object-cover" />
                            </div>
                        )}
                    </Link>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>{profileUser.name} n'a pas encore publié.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
