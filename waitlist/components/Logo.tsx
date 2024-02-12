import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/" className="relative w-16 h-16 mr-4">
        <Image
          src="/logo-icon.svg"
          alt="Hasion logo"
          fill
        />
      </Link>
      <Link
        href="/"
        className="grid items-center h-10 text-xl text-black-pearl font-bold tracking-wide"
      >
        hashion
      </Link>
    </div>
  );
}
