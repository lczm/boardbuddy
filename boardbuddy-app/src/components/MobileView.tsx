'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MobileView({ climbs }: { climbs: any[] }) {
  const [selectedProblem, setSelectedProblem] = useState<any>(null)

  return (
    <div className="mobile-dashboard h-screen">
      <div className="mobile-header p-4 bg-white border-b-2 border-black">
        <Link href="/">
          <Button variant="ghost" className="p-0">
            <ChevronLeft className="h-6 w-6" /> Back
          </Button>
        </Link>
      </div>

      <select 
        onChange={(e) => setSelectedProblem(climbs.find(c => c.uuid === e.target.value))}
        className="w-full p-2 border-b-2 border-black"
      >
        <option value="">Select a problem</option>
        {climbs.map(climb => (
          <option key={climb.uuid} value={climb.uuid}>
            {climb.climb_name} - {climb.grade}
          </option>
        ))}
      </select>

      <div className="board-image relative h-[60vh]">
        {(selectedProblem || climbs[0])?.image_filenames.map((filename: string, index: number) => (
          <img
            key={index}
            src={`/api/image-proxy?url=${encodeURIComponent(`https://api.kilterboardapp.com/img/${filename}`)}`}
            alt="Hold position"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ))}
      </div>

      {selectedProblem && (
        <div className="problem-details p-4 bg-white border-t-2 border-black">
          <h3 className="text-xl font-bold">{selectedProblem.climb_name}</h3>
          <p>Grade: {selectedProblem.grade}</p>
          <p>Setter: {selectedProblem.setter_name}</p>
          <p>Rating: {'★'.repeat(selectedProblem.rating || 0)}</p>
        </div>
      )}
    </div>
  )
}