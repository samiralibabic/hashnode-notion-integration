import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="grid grid-flow-col h-20 items-center">
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
        <menu className="flex justify-end space-x-8 text-pale-sky">
          <a href="#features"><li className="text-right">Features</li></a>
          <a href="#contact"><li className="text-right">Contact</li></a>
        </menu>
      </div>
    </header>
  );
}
