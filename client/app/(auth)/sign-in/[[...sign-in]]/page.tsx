import { SignIn } from '@clerk/nextjs'

const page = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <SignIn />
        </div>
    )
}

export default page