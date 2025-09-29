
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { useUser } from "@/context/user-context"
import type { Product } from "@/lib/data"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const addProductFormSchema = z.object({
  name: z.string().min(3, "Le nom du produit doit contenir au moins 3 caractères."),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
  price: z.coerce.number().positive("Le prix doit être un nombre positif."),
  image: z.any().optional(),
})

export default function MarketplacePage() {
  const { toast } = useToast()
  const { user, products, addProduct, addTransaction } = useUser()
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  })

  function handleBuy(product: Product) {
    if (!user) return;
    const transactionCost = product.price + 1; // price + fee
    if (user.tokenBalance < transactionCost) {
        toast({
            variant: "destructive",
            title: "Solde insuffisant",
            description: "Vous n'avez pas assez de BZD pour acheter ce produit et couvrir les frais.",
        })
        return;
    }
    
    addTransaction({
        description: `Achat: ${product.name}`,
        type: 'Purchase',
        status: 'Completed',
        amount: -product.price,
    })

    toast({
      title: "Achat Réussi !",
      description: `${product.name} a été ajouté à votre compte.`,
    })
  }

  function onAddProductSubmit(values: z.infer<typeof addProductFormSchema>) {
    if (!user) return;
    const newProduct: Product = {
        id: `prod${products.length + 1}`,
        name: values.name,
        description: values.description,
        price: values.price,
        image: 'https://placehold.co/600x400.png',
        seller: user.name,
        aiHint: 'new product',
    }
    
    addProduct(newProduct);
    
    toast({
      title: "Produit Ajouté !",
      description: "Votre produit est maintenant listé sur la marketplace.",
    })
    setOpen(false)
    form.reset()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Parcourez les produits et services de la communauté.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un Produit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddProductSubmit)} className="space-y-8">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                  <DialogDescription>
                    Remplissez les détails ci-dessous pour lister votre produit sur la marketplace.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom du produit</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Cours de formation avancé" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Décrivez votre produit en détail..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix (en BZD)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image du produit</FormLabel>
                            <FormControl>
                                <Input type="file" {...form.register("image")} />
                            </FormControl>
                            <FormDescription>Téléchargez une image claire de votre produit.</FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}
                    />
                </div>
                <DialogFooter>
                  <Button type="submit">Lister le Produit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
               <div className="relative aspect-video">
                 <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                    data-ai-hint={product.aiHint}
                  />
               </div>
            </CardHeader>
            <CardContent className="flex-1 p-4 grid gap-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="text-sm flex-1">{product.description}</CardDescription>
               <p className="text-xs text-muted-foreground">Vendu par : {product.seller}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <p className="text-lg font-semibold">BZD {product.price.toFixed(2)}</p>
              <Button onClick={() => handleBuy(product)}>Acheter</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
