'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ArchitectureSection from '@/components/sections/ArchitectureSection'
import ApproachSection from '@/components/sections/ApproachSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ChapterSection from '@/components/sections/ChapterSection'
import ContactSection from '@/components/sections/ContactSection'
import SmoothScroll from '@/components/layout/SmoothScroll'
import { CHAPTERS } from '@/data/chapters'

// Persistent canvas — only on client
const PersistentCanvas = dynamic(() => import('@/components/canvas/PersistentCanvas'), { ssr: false })

const CHAPTER_MAP = [
  { id: 'cloud',       tag: 'Cloud & Platform',       align: 'left'  as const },
  { id: 'security',    tag: 'Security & Governance',   align: 'right' as const },
  { id: 'data',        tag: 'Data & Intelligence',     align: 'left'  as const },
  { id: 'engineering', tag: 'Engineering & Delivery',  align: 'right' as const },
  { id: 'operations',  tag: 'Operations & Reliability', align: 'left' as const },
]

export default function Home() {
  const chapterById = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]))

  return (
    <SmoothScroll>
      {/* Fixed 3D canvas — always behind everything */}
      <PersistentCanvas />

      <div style={{ position: 'relative', zIndex: 10 }}>
        <Header />

        {/* ① Hero — transparent bg, reveals 3D canvas */}
        <HeroSection />

        {/* ② Architecture — light section */}
        <ArchitectureSection />

        {/* ③ Approach — light sticky scroll */}
        <ApproachSection />

        {/* ④ Services — light */}
        <ServicesSection />

        {/* ⑤ Domain chapters — transparent, camera flies through world */}
        {CHAPTER_MAP.map(({ id, tag, align }) => {
          const chapter = chapterById[id]
          if (!chapter) return null
          return (
            <ChapterSection
              key={id}
              chapter={chapter}
              tag={tag}
              align={align}
            />
          )
        })}

        {/* ⑥ Contact — light */}
        <ContactSection />

        <Footer />
      </div>
    </SmoothScroll>
  )
}
