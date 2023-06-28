"use client"
import React, { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';

interface ClarityProps {
    [key: string]: string;
}

export const Clarity: React.FC<ClarityProps> = ({children,...props}) => {
	useEffect(() => {
        clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID || '');
       

	}, []);
	return <></>;
};
