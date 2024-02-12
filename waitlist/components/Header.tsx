import Logo from "./Logo";

export default function Header() {
  return (
    <header>
      <div className="grid grid-flow-col h-20 items-center">
        <Logo />
        <menu className="flex justify-end space-x-8 text-pale-sky">
          <a href="/#features"><li className="text-right">Features</li></a>
          <a href="/#contact"><li className="text-right">Contact</li></a>
        </menu>
      </div>
    </header>
  );
}
