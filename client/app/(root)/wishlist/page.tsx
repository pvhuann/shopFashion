'use client'
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react'

import Loader from '@/components/Loader';
import ProductCard from '@/components/ProductCard';
import { getProductDetails } from '@/lib/actions/actions';

const WishList = () => {
    const { user } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [wishList, setWishList] = useState<ProductType[]>([]);
    let [signInUser, setSignInUser] = useState<UserType | null>(null);

    const getUser = async () => {
        try {
            const res = await fetch(`/api/users`, { method: 'GET' });
            const data = await res.json();
            setSignInUser(data);
            setLoading(false);
        } catch (error) {
            console.log("user_GET error: ",error);
        }
    }

    useEffect(() => {
        if (user) {
            getUser()
        }
    }, [user])

    const getWishList = async () => {
        setLoading(true);
        if (!signInUser) {
            setLoading(false);
            return;
        };
        const wishListProducts = await Promise.all(signInUser.wishList.map(async (productId: string) => {
            const res = await getProductDetails(productId);
            return res
        }))
        setWishList(wishListProducts);
        setLoading(false);
    }


    useEffect(() => {
        if (signInUser) {
            getWishList();
        }
    }, [signInUser])

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

export default WishList;
export const dynamic = "force-dynamic";
