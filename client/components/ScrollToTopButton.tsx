'use client'

import { CircleChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
    const [showButtonScrollToTop, setShowButtonScrollToTop] = useState(false);

    const handleScroll = () => {
        if(window.scrollY>100){
            setShowButtonScrollToTop(true);
        }else{
            setShowButtonScrollToTop(false);
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])

    return (
            <div>
                {showButtonScrollToTop&&(
                    <CircleChevronUp className='cursor-pointer fixed bottom-4 right-4 max-md:right-2 w-10 h-10 z-50'
                    onClick={scrollToTop}
                /> 
                )}
            </div>
            
    )
}

export default ScrollToTopButton;