"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { PlusCircle } from "lucide-react"

import { products } from "@/lib/data"
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
  name: z.string().min(3, "Product name must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  image: z.any().optional(),
})

export default function MarketplacePage() {
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)

  const form = useForm<z.infer<typeof addProductFormSchema>>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  })

  function handleBuy() {
    toast({
      title: "Purchase Successful!",
      description: "The item has been added to your account.",
    })
  }

  function onAddProductSubmit(values: z.infer<typeof addProductFormSchema>) {
    console.log(values)
    toast({
      title: "Product Added!",
      description: "Your product is now listed on the marketplace.",
    })
    setOpen(false)
    form.reset()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Browse products and services from the community.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddProductSubmit)} className="space-y-8">
                <DialogHeader>
                  <DialogTitle>Add a New Product</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to list your product on the marketplace.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                   <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Advanced Training Course" {...field} />
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
                            <Textarea placeholder="Describe your product in detail..." {...field} />
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
                          <FormLabel>Price (in Tokens)</FormLabel>
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
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                                <Input type="file" {...form.register("image")} />
                            </FormControl>
                            <FormDescription>Upload a clear image of your product.</FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}
                    />
                </div>
                <DialogFooter>
                  <Button type="submit">List Product</Button>
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
               <p className="text-xs text-muted-foreground">Sold by: {product.seller}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <p className="text-lg font-semibold">T {product.price.toFixed(2)}</p>
              <Button onClick={handleBuy}>Buy Now</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
