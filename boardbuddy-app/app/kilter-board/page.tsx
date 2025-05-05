"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { toast } from "sonner"
import { Heart } from "lucide-react"

interface Climb {
  uuid: string
  name: string
  description: string
  setter_username: string
  hsm: number
  created_at: string
}

interface ClimbsResponse {
  climbs: Climb[]
  total_count: number
  page: number
  page_size: number
  total_pages: number
}

export default function KilterBoardPage() {
  const [climbs, setClimbs] = useState<Climb[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchClimbs() {
      try {
        const response = await fetch("https://lczm.me/boardbuddy/api/climbs")
        const data: ClimbsResponse = await response.json()
        setClimbs(data.climbs)
      } catch (error) {
        console.error("Error fetching climbs:", error)
        toast.error("Failed to load climbing problems. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchClimbs()
  }, [])

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-4 font-bold flex items-center gap-1 hover:bg-transparent hover:underline p-0"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Board Selection
              </Button>
            </Link>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Kilter Board</h1>
            <p className="text-lg text-gray-700">Browse climbing problems and find your next challenge</p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {climbs.map((climb) => (
                  <CarouselItem key={climb.uuid} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link href={`/kilter-board/${climb.uuid}`}>
                      <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="mb-3 aspect-square bg-gray-100 overflow-hidden">
                            <img
                              src="https://api.kilterboardapp.com/img/product_sizes_layouts_sets/45-1.png"
                              alt="Kilter Board"
                              className="object-cover w-full h-full"
                            /> 
                            {/* FUA --> right now this is a placeholder image, need to change this soon */}
                          </div>
                          <h2 className="text-xl font-bold mb-1 truncate">{climb.name}</h2>
                          <p className="text-sm text-gray-600 mb-3">Set by {climb.setter_username}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Difficulty: {climb.hsm}</span>
                            <Button className="bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-2 mt-4">
                <CarouselPrevious className="relative inset-0 translate-y-0 bg-black text-white hover:bg-white hover:text-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
                <CarouselNext className="relative inset-0 translate-y-0 bg-black text-white hover:bg-white hover:text-black border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>
            </Carousel>
          )}
        </div>
      </div>

      <footer className="py-6 border-t-4 border-black bg-white mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="flex items-center justify-center gap-1 text-sm">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by Ze Ming and Gabriel.
            <a
              href="https://github.com/lczm/boardbuddy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-gray-700"
            >
              Source code here
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}