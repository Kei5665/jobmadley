import type Redis from "ioredis"

type Entry = { value: string; expiresAt: number }

class MemoryKV {
  private store: Map<string, Entry>

  constructor() {
    const g: any = globalThis as any
    if (!g.__APP_MEMORY_KV__) {
      g.__APP_MEMORY_KV__ = new Map<string, Entry>()
    }
    this.store = g.__APP_MEMORY_KV__
  }

  private sweep(now = Date.now()) {
    for (const [k, v] of this.store) {
      if (v.expiresAt <= now) this.store.delete(k)
    }
  }

  async exists(key: string): Promise<boolean> {
    const now = Date.now()
    const entry = this.store.get(key)
    if (!entry) return false
    if (entry.expiresAt <= now) {
      this.store.delete(key)
      return false
    }
    return true
  }

  async setNX(key: string, value: string, ttlSec: number): Promise<boolean> {
    const now = Date.now()
    this.sweep(now)
    const entry = this.store.get(key)
    if (entry && entry.expiresAt > now) return false
    this.store.set(key, { value, expiresAt: now + ttlSec * 1000 })
    return true
  }

  async setEX(key: string, value: string, ttlSec: number): Promise<void> {
    const now = Date.now()
    this.store.set(key, { value, expiresAt: now + ttlSec * 1000 })
  }
}

let redisClient: Redis | null = null

function getRedisClient(): Redis | null {
  try {
    if (redisClient) return redisClient
    const url = process.env.REDIS_URL
    if (!url) return null
    // Lazy import to avoid dependency at build time when unused
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RedisImpl = require("ioredis") as typeof import("ioredis")
    redisClient = new RedisImpl.default(url, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: false,
    })
    return redisClient
  } catch (_) {
    return null
  }
}

export type KV = {
  exists(key: string): Promise<boolean>
  setNX(key: string, value: string, ttlSec: number): Promise<boolean>
  setEX(key: string, value: string, ttlSec: number): Promise<void>
}

export function getKV(): KV {
  // 1) Prefer native Redis if REDIS_URL is configured
  const redis = getRedisClient()
  if (redis) {
    return {
      async exists(key: string): Promise<boolean> {
        const res = await redis.exists(key)
        return res === 1
      },
      async setNX(key: string, value: string, ttlSec: number): Promise<boolean> {
        const res = await redis.set(key, value, "NX", "EX", ttlSec)
        return res === "OK"
      },
      async setEX(key: string, value: string, ttlSec: number): Promise<void> {
        await redis.set(key, value, "EX", ttlSec)
      },
    }
  }

  // 2) If Upstash REST is configured, use REST client
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN
  if (upstashUrl && upstashToken) {
    const headers = {
      Authorization: `Bearer ${upstashToken}`,
      "Content-Type": "application/json",
    }
    const request = async (cmd: string[]): Promise<any> => {
      const res = await fetch(upstashUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ cmd }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const msg = data?.error || `Upstash REST error: ${res.status}`
        throw new Error(msg)
      }
      return data
    }
    return {
      async exists(key: string): Promise<boolean> {
        const data = await request(["EXISTS", key])
        const result = typeof data?.result === "number" ? data.result : Number(data?.result)
        return result === 1
      },
      async setNX(key: string, value: string, ttlSec: number): Promise<boolean> {
        const data = await request(["SET", key, value, "EX", String(ttlSec), "NX"])
        return data?.result === "OK"
      },
      async setEX(key: string, value: string, ttlSec: number): Promise<void> {
        await request(["SET", key, value, "EX", String(ttlSec)])
      },
    }
  }

  // 3) Fallback to in-memory KV
  return new MemoryKV()
}


