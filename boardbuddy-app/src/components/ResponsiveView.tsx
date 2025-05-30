'use client'

import DesktopView from './DesktopView'
import MobileView from './MobileView'
import { useEffect, useState } from 'react'

export default function ResponsiveView({ climbs, board }: { climbs: any[] }) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)

  useEffect(() => {
    // Set initial value
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isDesktop === null) {
    return null // Or a loading spinner
  }

  return isDesktop ? <DesktopView climbs={climbs} board={board}/> : <MobileView climbs={climbs} board={board}/>
}