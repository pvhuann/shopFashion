import { SignUp } from '@clerk/nextjs'

const page = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <SignUp afterSignOutUrl={'/dashboard'}/>
        </div>
    )
}

export default page