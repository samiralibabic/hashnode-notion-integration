import Header from "@/components/Header";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Imprint() {
  return (
    <>
      <Header />
      <Link className="flex m-5 items-center" href="/">
        <ArrowLeftIcon className="mr-2" />Back
      </Link>
      <section className="legal text-left">
        <h2>Imprint</h2>

        <h3>Information according to § 5 TMG</h3>

        <p>
          Dipl.-Ing. Samir Alibabic – Online Marketing <br />
          hashion.link <br />
          Klugstraße 99 <br />
          80637 Munich
        </p>

        <h3>Contact</h3>

        <p>
          Phone: +49 (0) 1516 5727063 <br />
          Email: kontakt@samiralibabic.de
        </p>

        <h3>VAT ID</h3>

        <p>
          VAT identification number according to § 27 a Value Added Tax Act:
          {" "}
          <br />
          Small business owner according to § 19 UStG
        </p>

        <h3>EU Dispute Resolution</h3>

        <p>
          The European Commission provides a platform for online dispute
          resolution (OS):{"  "}<br />
          <a href="https://ec.europa.eu/consumers/odr">
            https://ec.europa.eu/consumers/odr
          </a>. <br />
          You can find our email address above in the imprint.
        </p>

        <h3>Consumer Dispute Resolution/Universal Arbitration Body</h3>

        <p>
          We are neither willing nor obliged to participate in dispute
          resolution proceedings before a consumer arbitration board.
        </p>
      </section>
    </>
  );
}
