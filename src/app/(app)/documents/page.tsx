
"use client"

import * as React from "react"
import QRCode from "qrcode.react"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function DocumentsPage() {
  const { user } = useUser()
  const { toast } = useToast()
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [cvv, setCvv] = React.useState("")
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    setCvv(Math.floor(100 + Math.random() * 900).toString())
  }, [])
  
  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return "";
    return cardNumber.replace(/(.{4})/g, '$1 ').trim();
  }


  const handleDownload = () => {
    if (cardRef.current) {
        const cardToCapture = isFlipped ? cardRef.current.children[1] as HTMLElement : cardRef.current.children[0] as HTMLElement;
        html2canvas(cardToCapture, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: null, 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `zoudou-card-${isFlipped ? 'back' : 'front'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({
                title: "Téléchargement Démarré",
                description: "Votre carte virtuelle est en cours de téléchargement.",
            });
        }).catch(err => {
            console.error("Oops, something went wrong!", err);
            toast({
                variant: "destructive",
                title: "Erreur de Téléchargement",
                description: "Impossible de télécharger la carte. Veuillez réessayer.",
            });
        });
    }
  }

  if (!isMounted || !user) {
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Votre Carte Virtuelle</h1>
                <p className="text-muted-foreground">
                    Utilisez cette carte pour vos transactions sur le réseau ZOUDOU.
                </p>
            </div>
            <Skeleton className="w-full max-w-lg aspect-[85.6/53.98] rounded-2xl" />
             <div className="flex gap-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-44" />
            </div>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Votre Carte Virtuelle</h1>
        <p className="text-muted-foreground">
          Utilisez cette carte pour vos transactions sur le réseau ZOUDOU.
        </p>
      </div>
      
      <div className="w-full max-w-lg [perspective:1000px]">
        <div 
          ref={cardRef}
          className={cn(
            "w-full aspect-[85.6/53.98] rounded-2xl relative transition-transform duration-700 [transform-style:preserve-3d]",
            isFlipped && "[transform:rotateY(180deg)]"
          )}
        >
            {/* Card Front */}
            <div className={cn(
                "w-full h-full p-6 flex flex-col justify-between text-white absolute [backface-visibility:hidden]",
                "bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl rounded-2xl overflow-hidden"
                )}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                
                <div className="flex justify-between items-start z-10">
                <Logo />
                <div className="flex flex-col items-end">
                    <p className="font-semibold text-xl">ZOUDOU</p>
                    <p className="text-xs text-gray-300">DEBIT CARD</p>
                </div>
                </div>

                <div className="z-10 flex items-center justify-between">
                    <div>
                        <div className="w-12 h-8 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-md flex items-center justify-center shadow-inner">
                            <div className="w-10 h-6 bg-yellow-200 rounded-sm"></div>
                        </div>
                        <p className="font-mono tracking-widest text-lg md:text-xl mt-4">
                           {user ? formatCardNumber(user.cardNumber) : '...'}
                        </p>
                        <p className="font-medium uppercase mt-2">{user?.name}</p>
                        <p className="font-mono text-xs mt-1 opacity-70">{user?.walletKey}</p>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                        <QRCode value={user.walletKey} size={80} bgColor="#ffffff" fgColor="#000000" />
                    </div>
                </div>

                <div className="flex justify-between items-end z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi -rotate-90"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/></svg>
                    <p className="font-bold text-2xl italic">VISA</p>
                </div>
            </div>

            {/* Card Back */}
            <div className={cn(
                "w-full h-full p-6 flex flex-col justify-between text-white absolute [backface-visibility:hidden] [transform:rotateY(180deg)]",
                "bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl rounded-2xl"
                )}
            >
                 <div className="w-full h-12 mt-6 bg-black"></div>
                 <div className="flex items-center gap-4">
                    <div className="flex-1 h-8 bg-gray-300 rounded-sm"></div>
                    <div className="bg-white p-1 rounded-sm">
                        <p className="font-mono text-sm font-semibold tracking-widest text-black">{cvv}</p>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => setIsFlipped(!isFlipped)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retourner la Carte
        </Button>
        <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger la Carte
        </Button>
      </div>
    </div>
  )
}
