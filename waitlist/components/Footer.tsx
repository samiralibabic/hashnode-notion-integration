import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="gap-12 bg-[url('/footer-bg.svg')] bg-no-repeat bg-bottom bg-contain">
      <div className="flex justify-around text-pale-sky">
        <Link href="/imprint">Imprint</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Use</Link>
      </div>
      <p className="">
        <span className="font-bold">hashion</span> is a product of <br />
        <Link
          href="https://www.samiralibabic.com"
          className="underline"
        >
          Dipl.-Ing. Samir Alibabic - Online Marketing
        </Link>
      </p>
      <div className="flex justify-center">
        <Logo />
      </div>
      <p>© 2024. All rights reserved.</p>
    </footer>
  );
}
