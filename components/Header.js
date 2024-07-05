import Link from "next/link";
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
    <h1 className="px-5 py-5 font-bold text-3xl">
        Welcome to the Degen Market
    </h1>
    <div className="flex flex-row items-center  font-bold">
        <Link className="mr-4 p-6"  href="/">Home</Link>
        <Link className="mr-4 p-6" href="/sell">Sell</Link>

        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
}
