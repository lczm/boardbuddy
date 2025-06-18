import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BoardSelector({ boards }: { boards: any[] }) {
  return (
    <div className="landing">
      <h1 className="text-4xl font-black mb-8">BoardBuddy</h1>
      <div className="board-grid">
        {boards.map((board) => (
          <Link 
            key={board.id}
            href={{
              pathname: '/dashboard/kilter-board',
              query: { boardId: board.id }
            }}
            className="board-card"
          >
            <h3 className="text-xl font-semibold">{board.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}