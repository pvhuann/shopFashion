
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex gap-4 p-10">
      <UserButton/>
      <Link href={'http://localhost:3000/'} >go to client</Link>
    </div>
  );
}
