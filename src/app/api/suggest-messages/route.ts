import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Corrected Redis and Ratelimit initialization
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export async function POST(request: Request) {
  // 2. Identify user by IP for rate limiting
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  try {
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "HF API key missing" }, { status: 500 });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "user",
            content: "Generate 3 short anonymous questions for a social media profile. Separate them ONLY with '||'. No numbers. Example: Question 1?||Question 2?||Question 3?"
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const rawText = await response.text();

    if (!response.ok) {
      console.error("HF Error Raw:", rawText);
      // Fallback questions if the API is down or busy
      return NextResponse.json({
        success: true,
        questions: "What's your secret talent?||What is your dream job?||What is your favorite book?",
      });
    }

    const data = JSON.parse(rawText);
    const text = data.choices[0].message.content.trim();

    return NextResponse.json({ success: true, questions: text });

  } catch (error: any) {
    console.error("HF Route Error:", error);
    return NextResponse.json(
      { success: true, questions: "What's your favorite movie?||Do you have pets?||What's your dream job?" }
    );
  }
}