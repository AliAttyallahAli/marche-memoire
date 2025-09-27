
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PublicHeader } from "@/components/public-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const popularProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Rejoignez l'Économie ZOUDOU
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Une plateforme décentralisée pour le commerce, la communauté et l'innovation.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">Commencer</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/marketplace">Explorer la Marketplace</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/seed/hero/600/600"
                width="600"
                height="600"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="abstract community"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Produits Populaires</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Découvrez les articles les plus prisés de notre marketplace communautaire.
                </p>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {popularProducts.map((product) => (
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
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <p className="text-lg font-semibold">BZD {product.price.toFixed(2)}</p>
                    <Button asChild variant="outline">
                        <Link href="/marketplace">
                            Acheter
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
             <div className="flex justify-center">
                <Button asChild>
                    <Link href="/marketplace">
                        Voir toute la Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center h-16 border-t bg-background">
          <p className="text-sm text-muted-foreground">&copy; 2024 ZOUDOU. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
