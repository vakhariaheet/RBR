import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => { 
    const data = await req.json() as { username: string, password: string, name: string, code: string };
    if (!data) {
        return NextResponse.json({
            isSuccess: false,
            data: {
                message: 'Missing fields',
            }
        }, {
            status: 400,
        });
    }
    const { username, password, name, code } = data;
    if(!username || !password || !name || !code) {
        return NextResponse.json({
            isSuccess: false,
            data: {
                message: 'Missing fields',
            }
        }, {
            status: 400,
        });
    }
    if (code !== process.env.NEXT_CODE) {
        return NextResponse.json({
            isSuccess: false,
            data: {
                message: 'Invalid code',
            }
        }, {
            status: 401,
        });
    }
    const user = await prisma.user.findFirst({
        where: {
            username,
        }
    });
    if (user) { 
        return NextResponse.json({
            isSuccess: false,
            data: {
                message: 'User already exists',
            }
        }, {
            status: 409,
        });
    }
    const newUser = await prisma.user.create({
        data: {
            username,
            password,
            name,
        }
    });
    return NextResponse.json({
        isSuccess: true,
        data: {
            message: 'User created',
        }
    });

    
}