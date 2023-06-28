'use client';
import { useState } from 'react';

import { useRouter } from 'next/navigation';
import * as jose from 'jose';

import { Clarity } from '../Components/Clarity';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	const onLogin = async () => {
		const res = await fetch(`${window.location.origin}/api/auth/login`, {
			method: 'POST',
			body: JSON.stringify({
				username,
				password,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await res.json();
    
		if (data.isSuccess) {

           router.push('/');
			
        }
        else alert('Invalid username or password');
	};

	return (
		<div className='p-4'>
			<Clarity page='Login' /> 
			<h1 className='text-5xl text-center '>Login</h1>
			<div className='flex justify-center mt-10'>
				<div className='flex flex-col gap-4 max-w-[50rem] w-full items-center '>
					<input
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='p-2 text-lg w-full rounded-md shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400'
					/>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder='Password'
						className='p-2 text-lg w-full rounded-md shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400'
					/>
					<button
						className='block px-16 py-4 mt-4 border rounded-md hover:border-blue-400 hover:text-blue-400 bg-white w-max'
						onClick={onLogin}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	);
}
