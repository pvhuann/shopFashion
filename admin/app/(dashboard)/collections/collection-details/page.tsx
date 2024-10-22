import React from 'react'

const page = () => {
    return (
        <div>
            <div className='flex justify-between items-center'>
                {/* title */}
                <div className='flex flex-col'>
                    <p>Collections/Collection details</p>
                    <p>Collection title</p>
                </div>

                {/* button next or previous */}
                <div>
                    <button>Next</button>
                    <button>Previous</button>
                </div>
            </div>
        </div>

    )
}

export default page