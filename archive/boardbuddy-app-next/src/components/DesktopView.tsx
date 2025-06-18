'use client'

import { useState } from 'react'

export default function DesktopView({ climbs, board }: { climbs: any[], board: any }) {
  const [selectedProblem, setSelectedProblem] = useState<any>(null)

  const handleProblemClick = (climb: any) => {
    if (selectedProblem?.uuid === climb.uuid) {
      setSelectedProblem(null)
      console.log('Deselected problem')
    } else {
      setSelectedProblem(climb)
      console.log('Selected problem:', climb.uuid)
    }
  }

  const activeProblem = selectedProblem || climbs[0]
  const imageFilenames = activeProblem?.image_filenames || []

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full border-b-4 border-black bg-white px-8 py-6 text-center">
        <h1 className="text-3xl font-black text-black mb-1">{board?.name || 'Board'}</h1>
        {selectedProblem && (
          <h2 className="text-xl font-semibold text-cyan-700 mt-2">{selectedProblem.climb_name}</h2>
        )}
        {/* <div className="text-gray-500 text-sm">Board ID: {board?.id}</div> */}
      </header>

      {/* Main content: sidebar + board image */}
      <main className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="w-[400px] border-r-4 border-black bg-white p-8 overflow-y-auto">
          {/* <h2 className="text-2xl font-bold mb-6">Problems</h2> */}
          <div className="space-y-4">
            {climbs.map(climb => (
              <button
                key={climb.uuid}
                onClick={() => handleProblemClick(climb)}
                className={`w-full text-left p-4 border-4 transition-colors ${
                  selectedProblem?.uuid === climb.uuid
                    ? 'border-cyan-400 bg-cyan-50'
                    : 'border-black hover:bg-gray-50'
                }`}
              >
                <h3 className="text-xl font-bold mb-1">{climb.climb_name}</h3>
                <div className="flex gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Grade: {climb.grade}
                  </span>
                  <span className="text-yellow-500">
                    {'★'.repeat(climb.rating || 0)}
                  </span>
                </div>
                <p className="text-sm">Setter: {climb.setter_name}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Board image area */}
        <section className="flex-1 bg-white flex items-center justify-center relative">
          <div className="relative w-full h-full flex items-center justify-center">
            {imageFilenames.map((filename: string, index: number) => (
              <img
                key={index}
                src={`/api/image-proxy?url=${encodeURIComponent(`https://api.kilterboardapp.com/img/${filename}`)}`}
                alt="Hold position"
                className="absolute inset-0 w-full h-full object-contain p-8"
                style={{ pointerEvents: 'none' }}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t-4 border-black bg-white py-4 text-center text-gray-700 mt-auto">
        Made with ❤️ by Ze Ming and Gabriel. Source code{' '}
        <a
          href="https://github.com/lczm/boardbuddy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold hover:text-gray-900"
        >
          here
        </a>
      </footer>
    </div>
  )
}