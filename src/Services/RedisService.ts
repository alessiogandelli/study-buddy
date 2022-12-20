import * as Redis from 'redis';

export default class RedisService {
    private readonly redis: Redis.RedisClientType;

    constructor() {
        this.redis = Redis.createClient();
        this.connect();
    }

    public async connect() {
        this.redis.on('error',
            (err) => console.log('Redis Client Error', err)
        );
        await this.redis.connect();
    }

    public async disconnect() {
        await this.redis.disconnect();
    }

    public async setUserSelectedApp(userId: number, app: string) {
        await this.redis.set(userId.toString(), app);
    }

    public async getUserSelectedApp(userId: number): Promise<string | null> {
        return await this.redis.get(userId.toString());
    }

}