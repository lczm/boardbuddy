import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const boards = [
    { name: "MoonBoard", slug: "moonboard", available: false },
    { name: "Tension Board", slug: "tension-board", available: false },
    { name: "Kilter Board", slug: "kilter-board", available: true },
    { name: "Grasshopper Board", slug: "grasshopper-board", available: false },
    { name: "Custom", slug: "custom", available: false },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black mb-4 tracking-tight">BoardBuddy</h1>
            <p className="text-xl text-gray-700">Select your climbing board to get started</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <Card
                key={board.slug}
                className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 ${!board.available ? "opacity-60" : ""}`}
              >
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{board.name}</h2>
                  {board.available ? (
                    <Link href={`/${board.slug}`}>
                      <Button className="w-full bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Select
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 border-2 border-black font-bold rounded-none"
                    >
                      Coming Soon
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <footer className="py-6 border-t-4 border-black bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="flex items-center justify-center gap-1 text-sm">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by Ze Ming and Gabriel.
            <a
              href="https://github.com/lczm/boardbuddy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-gray-700"
            >
              Source code here.
            </a>
          </p>
        </div>
      </footer>
    </main>
  )
}