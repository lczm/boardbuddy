import BoardSelector from '@/components/BoardSelector'
import { getBoards } from '@/lib/api'

export default async function Home() {
  const boards = await getBoards()
  
  return (
    <main className="container mx-auto p-4">
      <BoardSelector boards={boards} />
      <footer>Made with ❤️ by Ze Ming and Gabriel. Source code <a href="https://github.com/lczm">here</a>.</footer>
    </main>
  )
}