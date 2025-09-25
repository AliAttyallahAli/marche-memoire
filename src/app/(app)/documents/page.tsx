
"use client"

import * as React from "react"
import QRCode from "qrcode.react"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Download, CreditCard, Wifi } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

export default function DocumentsPage() {
  const { user } = useUser()
  const cardRef = React.useRef<HTMLDivElement>(null)

  const formatWalletKey = (key: string) => {
    return key.substring(2).replace(/(.{4})/g, '$1 ').trim();
  }

  const handleDownload = () => {
    // Note: This is a simplified download functionality. 
    // For a real app, you'd use a library like html2canvas.
    alert("La fonctionnalité de téléchargement sera bientôt disponible !");
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Votre Carte Virtuelle</h1>
        <p className="text-muted-foreground">
          Utilisez cette carte pour vos transactions sur le réseau ZOUDOU.
        </p>
      </div>
      
      <div 
        ref={cardRef} 
        className={cn(
          "w-full max-w-lg aspect-[85.6/53.98] rounded-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden",
          "bg-gradient-to-br from-gray-800 via-gray-900 to-black shadow-2xl"
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
            <div className="flex-1">
                <div className="w-12 h-8 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-md flex items-center justify-center shadow-inner">
                    <div className="w-10 h-6 bg-yellow-200 rounded-sm"></div>
                </div>
                <p className="font-mono tracking-widest text-lg md:text-xl mt-4">
                    {formatWalletKey(user.walletKey)}
                </p>
                <p className="font-medium uppercase mt-2">{user.name}</p>
            </div>
            <div className="p-2 bg-white rounded-lg">
                <QRCode value={user.walletKey} size={80} bgColor="#ffffff" fgColor="#000000" />
            </div>
        </div>

        <div className="flex justify-between items-end z-10">
           <Wifi className="w-8 h-8 -rotate-90" />
           <p className="font-bold text-2xl italic">VISA</p>
        </div>
      </div>

      <Button onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Télécharger la Carte
      </Button>
    </div>
  )
}
