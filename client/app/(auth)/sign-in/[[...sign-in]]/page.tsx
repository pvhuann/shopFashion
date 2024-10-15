import { SignIn } from '@clerk/nextjs'

const page = () => {
    return (
        <div className='flex justify-center items-center h-full m-4'>
            <SignIn />
        </div>
    )
}

export default page