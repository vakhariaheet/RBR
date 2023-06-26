import { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'RBR Gate Course',
	description: 'RBR Gate Course',
	viewport: 'width=device-width, initial-scale=1',
	themeColor: '#000000',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<head>
				
			</head>
			<body className={inter.className}>
				{children}
				<Script src='https://documentcloud.adobe.com/view-sdk/main.js'></Script>
			</body>
		</html>
	);
}
