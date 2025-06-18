import ResponsiveView from '@/components/ResponsiveView'
import { getClimbs, getBoards } from '@/lib/api'

export default async function KilterBoardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const boardId = searchParams.boardId?.toString() || ''

  if (!boardId) {
    return <div>Missing board ID</div>
  }

  const climbs = await getClimbs(boardId)
  const boards = await getBoards()
  const board = boards.find((b: any) => b.id.toString() === boardId)

  return (
    <div className="h-screen">
      <ResponsiveView climbs={climbs} board={board} />
    </div>
  )
}
