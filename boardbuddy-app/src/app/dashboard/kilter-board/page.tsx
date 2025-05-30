// src/app/(dashboard)/kilter-board/page.tsx
import DesktopView from '@/components/DesktopView'
import MobileView from '@/components/MobileView'
import { getClimbs } from '@/lib/api'

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

  return (
    <div className="h-screen">
      {/* Render Desktop/Mobile views */}
      <DesktopView climbs={climbs} />
      <MobileView climbs={climbs} />
    </div>
  )
}