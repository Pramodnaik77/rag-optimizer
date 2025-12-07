import redis
from app.config import settings
import json
from typing import Optional

class RedisClient:
    def __init__(self):
        self.client = None

    def connect(self):
        """Connect to Redis server"""
        try:
            self.client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_connect_timeout=5
            )
            # Test connection
            self.client.ping()
            print("✓ Redis connected successfully")
        except redis.ConnectionError as e:
            print(f"✗ Redis connection failed: {e}")
            print("⚠️  App will still run but documents won't persist across restarts")
            self.client = None
        except Exception as e:
            print(f"✗ Redis error: {e}")
            self.client = None

    def is_connected(self) -> bool:
        """Check if Redis is available"""
        return self.client is not None

    def set_text(self, key: str, value: str, ttl: int = 86400):
        """Store text with TTL (default 24 hours)"""
        if not self.is_connected():
            raise ConnectionError("Redis not available")
        self.client.setex(key, ttl, value)

    def get_text(self, key: str) -> Optional[str]:
        """Retrieve text"""
        if not self.is_connected():
            raise ConnectionError("Redis not available")
        return self.client.get(key)

    def set_json(self, key: str, value: dict, ttl: int = 86400):
        """Store JSON with TTL"""
        if not self.is_connected():
            raise ConnectionError("Redis not available")
        self.client.setex(key, ttl, json.dumps(value))

    def get_json(self, key: str) -> Optional[dict]:
        """Retrieve JSON"""
        if not self.is_connected():
            raise ConnectionError("Redis not available")
        data = self.client.get(key)
        return json.loads(data) if data else None

    def delete(self, key: str):
        """Delete key"""
        if not self.is_connected():
            return
        self.client.delete(key)

    def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.is_connected():
            return False
        return self.client.exists(key) > 0

    def keys(self, pattern: str) -> list:
        """Get keys matching pattern"""
        if not self.is_connected():
            return []
        return self.client.keys(pattern)

# Singleton
redis_client = RedisClient()
