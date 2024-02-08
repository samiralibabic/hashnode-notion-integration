import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="grid grid-flow-col p-4 h-20 items-center border-b border-ghost">
        <div className="flex items-center">
          <div className="relative w-10 h-10 mr-2">
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
        <menu className="flex justify-end space-x-8 text-pale-sky">
          <li className="text-right">Features</li>{" "}
          <li className="text-right">Contact</li>{" "}
        </menu>
      </div>
    </header>
  );
}
