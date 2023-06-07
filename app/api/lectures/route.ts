import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server';
import subjects from "@/app/data.json";

export async function GET(request: Request) { 
    return NextResponse.json(subjects.map((subject) => ({
        id: subject.order,
        name: subject.name,
    })));
}







