"use client";
import { useEffect, useRef } from 'react';
export default function Banner(): JSX.Element {
	const banner = useRef<HTMLDivElement>(null);

	const atOptions = {
		key: 'a9975221053c7830bbe80f0c27cd5d4a',
		format: 'iframe',
		height: 50,
		width: 320,
		params: {},
	};
	useEffect(() => {
		if (banner.current && !banner.current.firstChild) {
			const conf = document.createElement('script');
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src =
				location.protocol +
				`//www.highcpmcreativeformat.com/${atOptions.key}/invoke.js`;
			conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;
			banner.current.append(conf);
			banner.current.append(script);
		}
	}, [banner]);

	return (
		<div
			className='mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center'
			ref={banner}
		></div>
	);
}
