
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose'
import { prisma } from "@/app/lib/prisma";
interface LoginBody {
    username: string;
    password: string;
}

export const POST = async (req: NextRequest, res: Response) => { 
  
    const { username, password } = await req.json() as LoginBody;
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (!user) { 
        return NextResponse.json({
            isSuccess: false,
            data: {
                message: 'User not found',
            }
        }, {
            status: 404,
        });
    }

    if (user.password !== password) { 
        return NextResponse.json({
            isSuccess: false,
            data: {
                message: 'Password is incorrect',
            }
        }, {
            status: 401,
        });
    }
    const secret = new TextEncoder().encode(process.env.NEXT_JWT as string);
    const token = await new jose.SignJWT({
        username,
        iat: Date.now(),
        id:user.id,
    }).setProtectedHeader({alg:"HS256"}).setIssuer('gate.heetvakharia.in').sign(secret);
    req.cookies.set({
        name: 'rbr-gate-token',
        value: token,
    
    });
    return NextResponse.json({
        isSuccess: true,
        data: {
            message: 'Login successful',
        }
    }, {
        status: 200,
        headers: {
            'Set-Cookie': `rbr-gate-token=${token}; Path=/; HttpOnly; SameSite=Strict; max-age=${60 * 60 * 24 * 7};`,
            'authorization': `Bearer ${token}`
        }
    })
}