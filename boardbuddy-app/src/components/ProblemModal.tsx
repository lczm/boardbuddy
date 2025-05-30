'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'

export default function ProblemModal({
  problem,
  onClose,
}: {
  problem: any
  onClose: () => void
}) {
  return (
    <Dialog open={!!problem} onOpenChange={onClose}>
      <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-2xl font-bold">{problem?.climb_name}</h2>
        <div className="space-y-2">
          <p>Grade: {problem?.grade}</p>
          <p>Setter: {problem?.setter_name}</p>
          <p>Rating: {'★'.repeat(problem?.rating || 0)}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}