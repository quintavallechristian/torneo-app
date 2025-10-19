'use client';

import dynamic from 'next/dynamic';

// Import dinamico solo lato client
const AddressPickerInner = dynamic(() => import('./AddressPickerInner'), {
  ssr: false,
});

export default AddressPickerInner;
