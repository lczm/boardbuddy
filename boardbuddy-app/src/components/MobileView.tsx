'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MobileView({ climbs, board }: { climbs: any[], board: any }) {
  const [selectedProblem, setSelectedProblem] = useState<any>(null)

  const activeProblem = selectedProblem || climbs[0]
  const imageFilenames = activeProblem?.image_filenames || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 bg-white border-b-2 border-black flex items-center">
        <Link href="/">
          <Button variant="ghost" className="p-0 mr-2">
            <ChevronLeft className="h-6 w-6" /> Back
          </Button>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="text-xl font-black text-black">{board?.name || 'Board'}</h1>
          {activeProblem && (
            <h2 className="text-base font-semibold text-cyan-700 mt-1">{activeProblem.climb_name}</h2>
          )}
        </div>
      </div>

      {/* Problem Selector */}
      <div className="p-4 bg-white border-b border-gray-200">
        <select
          onChange={e => setSelectedProblem(climbs.find(c => c.uuid === e.target.value))}
          className="w-full p-2 border-2 border-black rounded"
          value={selectedProblem?.uuid || ''}
        >
          <option value="">Select a problem</option>
          {climbs.map(climb => (
            <option key={climb.uuid} value={climb.uuid}>
              {climb.climb_name} - {climb.grade}
            </option>
          ))}
        </select>
      </div>

      {/* Board Image */}
      <div className="relative flex-1 bg-white flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {imageFilenames.map((filename: string, index: number) => (
            <img
              key={index}
              src={`/api/image-proxy?url=${encodeURIComponent(
                `https://api.kilterboardapp.com/img/${filename}`
              )}`}
              alt="Hold position"
              className="absolute inset-0 w-full h-full object-contain p-4"
              style={{ pointerEvents: 'none' }}
            />
          ))}
        </div>
      </div>

      {/* Problem Details */}
      <div className="p-4 bg-white border-t-2 border-black">
        <h3 className="text-lg font-bold mb-1">{activeProblem.climb_name}</h3>
        <div className="flex gap-2 items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Grade: {activeProblem.grade}
          </span>
          <span className="text-yellow-500">
            {'★'.repeat(activeProblem.rating || 0)}
          </span>
        </div>
        <p className="text-sm text-gray-600">Setter: {activeProblem.setter_name}</p>
      </div>
    </div>
  )
}