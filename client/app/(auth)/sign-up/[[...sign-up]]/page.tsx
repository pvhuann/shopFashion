import { SignUp } from '@clerk/nextjs'

const page = () => {
    return (
        <div className='flex justify-center items-center h-full max-sm:items-start'>
            <SignUp />
        </div>
    )
}

export default page