import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <div className="relative w-16 h-16 mr-4">
        <Image
          src="/logo-icon.svg"
          alt="Hasion logo"
          fill
        />
      </div>
      <span className="grid items-center h-10 text-xl text-black-pearl font-bold tracking-wide">
        hashion
      </span>
    </div>
  );
}
