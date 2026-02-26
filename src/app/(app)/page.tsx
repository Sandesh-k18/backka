"use client"

import React, { useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/src/components/ui/carousel"
import messages from "@/src/messages.json"
import Autoplay from "embla-carousel-autoplay"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Separator } from "@/src/components/ui/separator"

const Home = () => {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <main className="flex-grow flex flex-col items-center justify-center bg-white min-h-[80vh]">
      {/* Hero Section */}
      <section className="container mx-auto p-4 md:p-12 text-center max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Step into the World of Anonymous Feedback
        </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Whisper is a simple way to get honest feedback from your audience. 
          Share your link, receive messages, and manage them all in one clean dashboard.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/sign-up">
            <Button size="lg" className="px-8 font-semibold group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="px-8 font-semibold">
              View Dashboard
            </Button>
          </Link>
        </div>

        <Separator className="my-12" />

        {/* Carousel Section */}
        <div className="w-full max-w-lg md:max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
          </div>
          
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {messages.map((message, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <Card className="h-full bg-white border border-gray-200 rounded shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            Verified Whisper
                          </span>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {message.content}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="hidden md:flex">
              <CarouselPrevious variant="outline" className="-left-12 border-gray-200" />
              <CarouselNext variant="outline" className="-right-12 border-gray-200" />
            </div>
          </Carousel>
        </div>
      </section>
    </main>
  )
}

export default Home;