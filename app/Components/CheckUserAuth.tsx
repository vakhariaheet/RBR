'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { validateUser } from '../utils/utils';

export default function CheckUserAuth() {
	const router = useRouter();
	useEffect(() => {
		validateUser(navigator.userAgent).then((res) => {
			if (!res) {
				router.push('/login');
			}
		});
	}, []);

	return <></>;
}
