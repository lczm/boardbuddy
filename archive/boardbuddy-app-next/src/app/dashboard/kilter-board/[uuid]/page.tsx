import { getClimb } from '@/lib/api'
import ProblemModal from '@/components/ProblemModal'

export default async function ClimbPage({
  params,
}: {
  params: { uuid: string }
}) {
  const climb = await getClimb(params.uuid)

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{climb.climb_name}</h1>
      <ProblemModal problem={climb} />
    </div>
  )
}