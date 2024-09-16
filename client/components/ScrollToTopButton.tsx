'use client'

import { CircleChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const ScrollToTopButton = () => {
    const [showButtonScrollToTop, setShowButtonScrollToTop] = useState(false)

    const handleScroll = () => {
        if(window.scrollY>100){
            setShowButtonScrollToTop(true)
        }else{
            setShowButtonScrollToTop(false)
        }
        // window.screenY > 100 ? setShowButtonScrollToTop(true) : setShowButtonScrollToTop(false)
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
            <>
                {showButtonScrollToTop&&(
                    <CircleChevronUp className='cursor-pointer fixed bottom-4 right-4 w-10 h-10 z-50'
                    onClick={scrollToTop}
                /> 
                )}
            </>
            
    )
}

export default ScrollToTopButton