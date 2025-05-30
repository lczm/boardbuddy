'use client'

import { useState } from 'react'
import ProblemModal from '@/components/ProblemModal'

export default function DesktopView({ climbs }: { climbs: any[] }) {
  const [selectedProblem, setSelectedProblem] = useState<any>(null)

  return (
    <div className="dashboard h-screen">
      <div className="sidebar border-r-2 border-black overflow-y-auto">
        <div className="p-4 space-y-4">
          {climbs.map(climb => (
            <div
              key={climb.uuid}
              onClick={() => setSelectedProblem(climb)}
              className="problem-item p-4 border-2 border-black cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <h4 className="text-lg font-bold">{climb.climb_name}</h4>
              <p>Grade: {climb.grade}</p>
              <p>Setter: {climb.setter_name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content relative bg-gray-100">
        <div className="board-image h-full w-full">
          {(selectedProblem || climbs[0])?.image_filenames.map((filename: string, index: number) => (
            <img
              key={index}
              src={`/api/image-proxy?url=${encodeURIComponent(`https://api.kilterboardapp.com/img/${filename}`)}`}
              alt="Hold position"
              className="absolute inset-0 w-full h-full object-contain"
            />
          ))}
        </div>
      </div>

      <ProblemModal problem={selectedProblem} onClose={() => setSelectedProblem(null)} />
    </div>
  )
}