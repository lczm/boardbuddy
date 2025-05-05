"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Calendar, User, Save, CheckCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

interface Climb {
  uuid: string
  name: string
  description: string
  setter_username: string
  hsm: number
  created_at: string
  frames: string
  edge_left: number
  edge_right: number
  edge_bottom: number
  edge_top: number
}

export default function ClimbDetailPage({ params }: { params: { id: string } }) {
  const [climb, setClimb] = useState<Climb | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSent, setIsSent] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    async function fetchClimb() {
      try {
        const response = await fetch("https://lczm.me/boardbuddy/api/climbs")
        const data = await response.json()
        const foundClimb = data.climbs.find((c: Climb) => c.uuid === params.id)

        if (foundClimb) {
          setClimb(foundClimb)
        } else {
          toast.error("Climb not found")
        }
      } catch (error) {
        console.error("Error fetching climb:", error)
        toast.error("Failed to load climb details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchClimb()
  }, [params.id])

  const handleSend = () => {
    setIsSent(!isSent)
    if (isSent) {
      toast.info("Send removed", {
        description: "Removed from your sends",
      })
    } else {
      toast.success("Send logged!", {
        description: "This climb has been added to your sends",
      })
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    if (isSaved) {
      toast.info("Removed from playlist", {
        description: "This climb has been removed from your playlist",
      })
    } else {
      toast.success("Saved to playlist", {
        description: "This climb has been added to your playlist",
      })
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied", {
      description: "Climb link copied to clipboard",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate a placeholder board image based on climb data
  const generateBoardImage = () => {
    // Use the Kilter Board image URL provided
    return "https://api.kilterboardapp.com/img/product_sizes_layouts_sets/45-1.png"
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/kilter-board">
            <Button
              variant="ghost"
              className="mb-4 font-bold flex items-center gap-1 hover:bg-transparent hover:underline p-0"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Problems
            </Button>
          </Link>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-[400px] w-full" />
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          ) : climb ? (
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="aspect-[3/4] relative bg-gray-100 flex items-center justify-center">
                  <img
                    src={generateBoardImage() || "/placeholder.svg"}
                    alt={`Kilter Board problem: ${climb.name}`}
                    className="object-contain"
                  />
                </div>
              </Card>

              <div>
                <h1 className="text-3xl font-black mb-2 tracking-tight">{climb.name}</h1>

                <div className="flex items-center gap-2 mb-4">
                  <User className="h-4 w-4" />
                  <span className="text-gray-700">Set by {climb.setter_username}</span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span className="text-gray-700">Created on {formatDate(climb.created_at)}</span>
                </div>

                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2">Difficulty</h2>
                  <div className="inline-block bg-black text-white px-3 py-1 font-bold">HSM {climb.hsm}</div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-2">Description</h2>
                  <p className="text-gray-700">{climb.description || "No description provided for this problem."}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={handleSend}
                    className={`flex items-center gap-2 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      isSent ? "bg-green-500 text-white hover:bg-green-600" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4" />
                    {isSent ? "Sent" : "Log Send"}
                  </Button>

                  <Button
                    onClick={handleSave}
                    className={`flex items-center gap-2 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      isSaved ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <Save className="h-4 w-4" />
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  <Button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-white text-black border-2 border-black hover:bg-gray-100 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
              <p className="text-gray-700 mb-4">The climbing problem you're looking for doesn't exist.</p>
              <Link href="/kilter-board">
                <Button className="bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Browse Problems
                </Button>
              </Link>
            </div>
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