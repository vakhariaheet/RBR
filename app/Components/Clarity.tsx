import React, { useEffect } from 'react';
import { clarity } from 'react-microsoft-clarity';

interface ClarityProps {
    [key: string]: string;
}

export const Clarity: React.FC<ClarityProps> = ({children,...props}) => {
	useEffect(() => {
        clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID || '');
        Object.entries(props).forEach(([ key, value ]) => { 
            clarity.setTag(key, value);
        })

	}, []);
	return <></>;
};
