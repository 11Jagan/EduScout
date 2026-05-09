import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeroHeader } from './header'
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider'
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur'
import { ChevronRight } from 'lucide-react'
import { Spotify, VercelFull, SupabaseFull, Bolt } from '@/components/ui/svgs'

export default function HeroSection() {
    return (
        <>
            <main className="overflow-x-hidden pt-24 bg-[#FDFDFC] text-black">
                <section>
                    <div className="relative">
                        <div className="aspect-2/3 relative z-10 flex flex-col justify-end px-6 lg:aspect-video">
                            <div className="mx-auto w-full max-w-7xl pb-6 lg:px-12 lg:pb-32">
                                <div className="max-w-lg">
                                    <h1 className="text-balance text-5xl md:text-6xl xl:text-7xl font-bold text-black tracking-tight">Find Your Dream College with EduScout</h1>
                                    <p className="mt-6 text-balance text-lg text-zinc-600">Search IITs, NITs, AIIMS, and more. Compare side-by-side and predict admission chances.</p>

                                    <div className="mt-8 flex items-center gap-2">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="h-12 rounded-full bg-black text-white hover:bg-zinc-800 pl-5 pr-3 text-base">
                                            <Link href="/colleges">
                                                <span className="text-nowrap font-semibold">Browse Colleges</span>
                                                <ChevronRight className="ml-1" />
                                            </Link>
                                        </Button>
                                        <Button
                                            key={2}
                                            asChild
                                            size="lg"
                                            variant="ghost"
                                            className="h-12 rounded-full px-5 text-base text-black hover:bg-black/5 transition-colors">
                                            <Link href="/predictor">
                                                <span className="text-nowrap font-medium">Predict Chances</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="aspect-2/3 pointer-events-none absolute inset-1 overflow-hidden rounded-3xl border border-black/5 lg:aspect-video lg:rounded-[3rem]">
                            <video
                                autoPlay
                                loop
                                className="size-full -scale-x-100 object-cover opacity-80 invert grayscale"
                                src="https://videos.pexels.com/video-files/35968183/15249566_1920_1080_30fps.mp4"></video>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
