'use client'

import Loader from '@/components/Loader';
import ProductCard from '@/components/ProductCard';
import { getProductDetails } from '@/lib/actions/actions';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react'

const WishList = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [wishList, setWishList] = useState<ProductType[]>([]);
    const [singInUser, setSingInUser] = useState<UserType|null>(null);

    const { user } = useUser();
    const getUser = async () => {
        try {
            const res = await fetch(`/api/users`, { method: 'GET' });
            const data = await res.json();
            setSingInUser(data);
            setLoading(false);
        } catch (error) {
            console.log("user_GET error: " + error);
        }
    }

    useEffect(() => {
        if (user) {
            getUser()
        }
    }, [user])
    // console.log(user);

    const getWishList = async () => {

        setLoading(true);
        if (!setSingInUser) return;

        const wishListProducts =await Promise.all(singInUser.wishList.map(async (productId) => {
            const res = await getProductDetails(productId);
            return res;
        }))
        setWishList(wishListProducts);
        setLoading(false);
    }


    useEffect(() => {
        if (singInUser) {
            getWishList()
        }
    }, [singInUser])


    return (
        <div className='m-10'>
            <div className='text-heading2-bold'>Your Wishlist</div>
            <hr />
            <div className='pt-5'>
                {loading ? <Loader /> :
                    (
                        wishList.length === 0 ? (
                            <p>No product in your wishlist!</p>
                        ) : (
                            <div className='flex gap-6 flex-wrap justify-center'>
                                {wishList.map((product: ProductType) => (
                                    <ProductCard product={product} key={product._id} />
                                ))}
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}

// export const dynamic = "force-dynamic";
export default WishList;