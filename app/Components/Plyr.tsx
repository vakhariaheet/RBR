'use client';
import { usePlyr, APITypes, } from 'plyr-react';
import React, { HTMLProps, Ref, useEffect } from 'react';


export interface PlyrProps extends HTMLProps<HTMLVideoElement> {
    plyr: Parameters<typeof usePlyr>[ 1 ];
}


export const Plyr = React.forwardRef(
	(
		props: PlyrProps,
		ref: Ref<APITypes>,
		
	) => {
		const { source, options = null } = props.plyr;
		const raptorRef = usePlyr(ref, {
			source,
			options,
        });

		return <video ref={raptorRef} className='plyr-react plyr' {...props} />;
	},
);

Plyr.displayName = 'Plyr';
