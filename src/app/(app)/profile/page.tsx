"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { user } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
})

const kycFormSchema = z.object({
  documentType: z.string(),
  documentNumber: z.string().min(5, "Document number seems too short."),
  documentFile: z.any().refine(file => file?.length == 1, 'File is required.'),
})

export default function ProfilePage() {
  const { toast } = useToast()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user.name,
      email: user.email,
    },
  })

  const kycForm = useForm<z.infer<typeof kycFormSchema>>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      documentType: "passport",
      documentNumber: "",
      documentFile: undefined,
    },
  })

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    })
  }

  function onKycSubmit(values: z.infer<typeof kycFormSchema>) {
     toast({
      title: "KYC Submitted",
      description: "Your documents are under review. This may take up to 24 hours.",
    })
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="items-center">
            <Avatar className="w-24 h-24 mb-2">
                <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <Badge className="mt-2" variant={user.kycStatus === "Verified" ? "default" : "outline"}>{user.kycStatus}</Badge>
          </CardHeader>
        </Card>
      </div>
      <div className="md:col-span-2 grid gap-8">
        <Card>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {user.kycStatus !== 'Verified' && (
        <Card>
           <Form {...kycForm}>
            <form onSubmit={kycForm.handleSubmit(onKycSubmit)}>
                <CardHeader>
                    <CardTitle>KYC Verification</CardTitle>
                    <CardDescription>Submit your documents for verification to unlock all features.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {user.kycStatus === 'Rejected' && (
                        <div className="p-3 rounded-md bg-destructive/10 text-destructive-foreground border border-destructive/20 text-sm">
                            Your previous submission was rejected. Please review the requirements and submit again.
                        </div>
                    )}
                    <div className="grid gap-2">
                        <Label>Document Type</Label>
                        {/* Simplified as a text input for this example. Would be a Select component. */}
                        <Input defaultValue="Passport" readOnly/>
                    </div>
                     <FormField
                      control={kycForm.control}
                      name="documentNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Document Number</FormLabel>
                          <FormControl>
                            <Input placeholder="A12345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={kycForm.control}
                      name="documentFile"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Document</FormLabel>
                            <FormControl>
                                <Input type="file" {...kycForm.register("documentFile")} />
                            </FormControl>
                            <FormDescription>Please upload a clear image of your document.</FormDescription>
                            <FormMessage />
                        </FormItem>
                       )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit">Submit for Verification</Button>
                </CardFooter>
            </form>
           </Form>
        </Card>
        )}
      </div>
    </div>
  )
}
