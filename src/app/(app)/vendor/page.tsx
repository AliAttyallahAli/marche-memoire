
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { MoreHorizontal, PlusCircle } from "lucide-react"

import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const vendorProfileSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters."),
  bio: z.string().max(160, "Bio must not be longer than 160 characters.").optional(),
})

export default function VendorDashboardPage() {
  const { toast } = useToast()
  const { user, products } = useUser()
  const vendorProducts = products.filter(p => p.seller === user.name || p.seller === '@alex.j' || p.seller === 'Official')

  const form = useForm<z.infer<typeof vendorProfileSchema>>({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      storeName: "Alex's Digital Store",
      bio: "Your go-to expert for community building and tokenomics.",
    },
  })

  function onSubmit(values: z.infer<typeof vendorProfileSchema>) {
    toast({
      title: "Profile Updated",
      description: "Your vendor profile has been successfully updated.",
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Vendeur</h1>
        <p className="text-muted-foreground">
          Gérez vos produits et vos informations publiques ici.
        </p>
      </div>
      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Gestion des Produits</TabsTrigger>
          <TabsTrigger value="profile">Profil Vendeur</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Vos Produits</CardTitle>
              <CardDescription>
                Gérez les produits que vous avez listés sur la marketplace.
              </CardDescription>
              <Button size="sm" className="ml-auto gap-1 absolute top-6 right-6">
                <PlusCircle className="h-4 w-4" />
                Ajouter un produit
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden md:table-cell">Prix</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorProducts.map((product) => (
                    <TableRow key={product.id}>
                       <TableCell className="hidden sm:table-cell">
                        <div className="relative aspect-square h-12 w-12">
                            <Image
                                alt={product.name}
                                className="aspect-square rounded-md object-cover"
                                fill
                                src={product.image}
                                data-ai-hint={product.aiHint}
                            />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">Actif</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">BZD {product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem>Supprimer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Profil Vendeur</CardTitle>
                  <CardDescription>
                    Ces informations seront visibles par les acheteurs sur la marketplace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la boutique</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom de boutique" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biographie du vendeur</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Parlez un peu de vous et de ce que vous vendez."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit">Enregistrer les modifications</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
