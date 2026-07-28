import dns from 'node:dns';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Global caching interface to prevent multiple connections during hot reloads
interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: GlobalMongoose | undefined;
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

async function dbConnect() {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
