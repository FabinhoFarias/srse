import { NextResponse } from 'next/server';
import net from 'net';

export async function POST(req: Request) {
    const { cmd } = await req.json();
    
    return new Promise((resolve) => {
        const client = new net.Socket();
        client.connect(5050, '127.0.0.1', () => {
            client.write(cmd);
        });

        client.on('data', (data) => {
            resolve(NextResponse.json({ res: data.toString() }));
            client.destroy();
        });
    });
}