"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Pickaxe } from "lucide-react"
import { useUser } from "@/context/user-context"

export default function MiningPage() {
  const { toast } = useToast()
  const { addTokens } = useUser()
  const [canMine, setCanMine] = React.useState(true)
  const [timeLeft, setTimeLeft] = React.useState(0)

  const handleMine = () => {
    if (canMine) {
      addTokens(10)
      setCanMine(false)
      const twentyFourHours = 24 * 60 * 60
      setTimeLeft(twentyFourHours)

      const nextMineTime = new Date().getTime() + twentyFourHours * 1000
      localStorage.setItem("nextMineTime", nextMineTime.toString())

      toast({
        title: "Succès !",
        description: "Vous avez miné 10 BZD avec succès.",
      })
    }
  }

  React.useEffect(() => {
    const nextMineTime = localStorage.getItem("nextMineTime")
    if (nextMineTime) {
      const now = new Date().getTime()
      const remainingTime = Math.round((parseInt(nextMineTime) - now) / 1000)
      if (remainingTime > 0) {
        setCanMine(false)
        setTimeLeft(remainingTime)
      }
    }
  }, [])

  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanMine(true)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0")
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Minage de Tokens Quotidien</CardTitle>
          <CardDescription>
            Cliquez sur le bouton pour miner vos tokens quotidiens. Une nouvelle session commence toutes les 24 heures.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Button
            size="lg"
            className="w-full h-16 text-lg font-semibold"
            onClick={handleMine}
            disabled={!canMine}
          >
            <Pickaxe className="mr-2 h-6 w-6" />
            {canMine ? "Démarrer la session de minage" : "Minage en cours"}
          </Button>
          {!canMine && (
            <div className="text-center">
              <p className="text-muted-foreground">Prochaine session disponible dans :</p>
              <p className="text-4xl font-mono font-bold tracking-wider">
                {formatTime(timeLeft)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
