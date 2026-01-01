'use client';

import Image from 'next/image';
import { useState } from 'react';

interface EmployeePhotoProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
}

export default function EmployeePhoto({
    src,
    alt,
    fallbackSrc = '/images/employees/placeholder.svg'
}: EmployeePhotoProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            priority
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
