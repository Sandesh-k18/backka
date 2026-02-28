"use client"

import React, { useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/src/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/src/components/ui/carousel"
import messages from "@/src/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { ArrowRight, ShieldCheck, Zap, Heart } from "lucide-react"
import { Button } from "@/src/components/ui/button"

const Home = () => {
  const plugin = useRef(Autoplay({ delay: 3500 }))

  return (
    <main className="flex-grow bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-6 overflow-hidden">
        {/* Modern Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-50">
          <div className="absolute top-[-15%] left-[15%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-slate-50 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto text-center max-w-5xl">
          {/* Hugging Face Badge - Modern Mono Style */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-bold tracking-wider mb-10 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-yellow-400 border border-yellow-200" />
            POWERED BY HUGGING FACE AI
          </div>
          
          {/* THE LINEAR GRADIENT HEADLINE */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-slate-950 via-slate-800 to-indigo-600 leading-[1.05]">
            Unfiltered feedback. <br className="hidden md:block" /> 
            Purely anonymous.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Whisper is the secure bridge between you and your audience. 
            Receive honest insights powered by next-gen open-source intelligence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-24">
            <Link href="/sign-up">
              <Button size="lg" className="h-14 px-10 text-base font-bold bg-slate-950 hover:bg-slate-800 text-white shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all group rounded-2xl">
                Create Your Profile
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-14 px-10 text-base font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-2xl">
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Minimal Trust Grid */}
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 pt-12 border-t border-slate-100/60">
             <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-indigo-500" /> Privacy First
             </div>
             <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Zap className="h-4 w-4 text-amber-500" /> Fast Delivery
             </div>
             <div className="flex items-center gap-2.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Heart className="h-4 w-4 text-rose-500" /> Open Source
             </div>
          </div>
        </div>
      </section>

      {/* Whisper Carousel */}
      <section className="pb-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">Recent Whispers</h2>
            <div className="hidden md:block h-px flex-1 bg-slate-100 mx-8" />
          </div>

          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{ align: "start", loop: true }}
          >
            <CarouselContent className="-ml-6">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-6 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-0 bg-slate-50/50 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 rounded-[2rem] overflow-hidden group">
                    <CardContent className="p-10">
                      <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <div key={s} className="h-1 w-1 rounded-full bg-indigo-200" />
                        ))}
                      </div>
                      <h3 className="font-bold text-slate-900 text-xl mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                        {message.title}
                      </h3>
                      <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
                        "{message.content}"
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </main>
  )
}

export default Home;