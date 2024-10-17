import Collections from "@/components/Collections";
import Products from "@/components/Products";
import Image from "next/image";


export default function Home() {
  return (
    <div className="">
      <Image
        src={'https://res.cloudinary.com/dti2tnjem/image/upload/v1725813631/wwqqitoumgzqvrt0n6jm.png'}
        alt="banner"
        width={2000}
        height={1000}
        className="object-cover"
      />
      <div className="">
        <Collections />
        <Products />
      </div>
    </div>
  );
}
