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
				<Script
					id='clarity'
					strategy='afterInteractive'
					dangerouslySetInnerHTML={{
						__html: `
					
					(function(c,l,a,r,i,t,y){
						c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
						t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
						y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
					})(window, document, "clarity", "script", "hmhnomnyax");
				`,
					}}
				/>
			</head>
			<body className={inter.className}>
				{children}
				<Script src='https://documentcloud.adobe.com/view-sdk/main.js'></Script>
			</body>
		</html>
	);
}
