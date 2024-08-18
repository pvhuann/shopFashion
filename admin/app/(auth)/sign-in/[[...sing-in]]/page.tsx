import { SignIn } from '@clerk/nextjs'

const page = () => {
    return (
        <div className='flex justify-center items-center h-full'>
            <SignIn afterSignOutUrl={'/dashboard'}/>
        </div>
    )
}

export default page