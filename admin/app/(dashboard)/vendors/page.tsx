import Vendor from '@/components/vendors/Vendor'
import React from 'react'

export const metadata = {
    title: 'Vendors | Admin Dashboard', 
    description: 'Vendors'
}

const page = () => {
    return (
        <>
            <Vendor />
        </>
    )
}

export default page