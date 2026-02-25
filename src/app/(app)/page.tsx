"use client"
import React, { useRef } from 'react' // imp Add useRef
import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/src/components/ui/carousel"
import messages from "@/src/messages.json"
import Autoplay from "embla-carousel-autoplay" //Case sensitive

const Home = () => {
  // VIMPPP. Initialize the plugin inside a ref
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <> <div className="flex flex-col items-center justify-center p-4 md:p-24">
      <main className="flex flex-col items-center justify-center w-full max-w-6xl">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
          <p className="mt-4 text-lg">Dive into the world of anonymous feedback.</p>
        </section>

        <Carousel
          plugins={[plugin.current]} // use:  Use the ref here
          className="w-full max-w-xs md:max-w-xl"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      <h2 className="text-2xl font-semibold">{message.title}</h2>
                    </CardHeader>
                    <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                      <p className="mt-2 text-center text-gray-600">{message.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

    </div>
      
      

    </>
  )
}

export default Home