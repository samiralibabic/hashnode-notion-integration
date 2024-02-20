import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Privacy() {
  return (
    <>
      <Link className="flex m-5 items-center" href="/">
        <ArrowLeftIcon className="mr-2" />Back
      </Link>
      <section className="legal text-left">
        <h2>Privacy Policy</h2>
        <p>
          This Privacy Policy describes how we collect, use, and disclose
          personal data in accordance with the requirements of the General Data
          Protection Regulation (GDPR) of the European Union when you use our
          online waiting list.
        </p>

        <h3>1. Data Controller</h3>

        <p>
          The data controller responsible for data processing within the meaning
          of the GDPR is:
        </p>

        <p>
          Dipl.-Ing. Samir Alibabic – Online Marketing <br />
          hashion.link <br />
          Klugstraße 99 <br />
          80637 Munich <br />
          kontakt@samiralibabic.de
        </p>

        <h3>2. What Data We Collect</h3>

        <p>
          We may collect and process the following types of personal data for
          use on our waiting list:
        </p>

        <ul>
          <li>
            Personal identification information (e.g., name, email address,
            phone number)
          </li>
          <li>
            Demographic information (e.g., age, gender, location)
          </li>
          <li>
            Other information you voluntarily provide to us
          </li>
        </ul>

        <h3>3. Purposes and Legal Bases of Data Processing</h3>

        <p>
          We process your data for the following purposes and based on the
          corresponding legal bases:
        </p>

        <ul>
          <li>
            To fulfill a contract with you or to perform pre-contractual
            measures (Art. 6 para. 1 lit. b GDPR)
          </li>
          <li>
            To fulfill legal obligations (Art. 6 para. 1 lit. c GDPR)
          </li>
          <li>Based on your consent (Art. 6 para. 1 lit. a GDPR)</li>
          <li>
            To protect our legitimate interests, provided that your interests or
            fundamental rights and freedoms do not override (Art. 6 para. 1 lit.
            f GDPR)
          </li>
        </ul>

        <h3>4. Data Disclosure to Third Parties</h3>

        <p>
          We only disclose your data to third parties if required by law or if
          we have obtained your explicit consent to do so.
        </p>

        <h3>5. Storage Duration</h3>

        <p>
          We only store your data for as long as necessary to achieve the
          purposes for which they were collected, unless there are legal
          retention obligations.
        </p>

        <h3>6. Your Rights</h3>

        <p>
          Under the GDPR, you have certain rights regarding your personal data,
          including:
        </p>

        <ul>
          <li>
            Right to information about your stored data (Art. 15 GDPR)
          </li>
          <li>Right to rectification of inaccurate data (Art. 16 GDPR)</li>
          <li>Right to erasure of your data (Art. 17 GDPR)</li>
          <li>Right to restriction of processing (Art. 18 GDPR)</li>
          <li>Right to data portability (Art. 20 GDPR)</li>
          <li>Right to object to processing (Art. 21 GDPR)</li>
        </ul>

        <p>
          To exercise your rights or to ask questions about data processing,
          please contact us using the contact details provided below.
        </p>

        <h3>7. Right to Lodge a Complaint with the Supervisory Authority</h3>

        <p>
          You have the right to lodge a complaint with the competent data
          protection authority if you believe that the processing of your
          personal data violates data protection laws.
        </p>

        <h3>8. Matomo Analytics</h3>

        <p>
          We use Matomo Analytics, a web analytics service provided by InnoCraft Ltd., to collect and analyze information about the usage of our website. Matomo operates in compliance with the General Data Protection Regulation (GDPR) and respects user privacy.
        </p>

        <h4>Information Collected</h4>

        <p>
          Matomo does not utilize cookies on our website. Instead, it collects anonymized data directly from server logs. This data may include:
        </p>

        <ul>
          <li>Your IP address (anonymized)</li>
          <li>Pages visited on our site</li>
          <li>Time spent on each page</li>
          <li>Browser type and version</li>
          <li>Referring website</li>
          <li>Any search queries made</li>
        </ul>

        <h4>Purpose of Data Collection</h4>

        <p>
          The data collected by Matomo is used to analyze user behavior and improve the performance, usability, and content of our website. This helps us understand how visitors interact with our site, what content is most popular, and how we can enhance the user experience.
        </p>

        <h4>Legal Basis for Processing</h4>

        <p>
          The legal basis for processing this data is our legitimate interest in analyzing website traffic and improving our services. We do not process any personally identifiable information (PII) through Matomo, and all data is anonymized to protect user privacy.
        </p>

        <h4>Data Retention</h4>

        <p>
          Matomo data is retained for a limited period, after which it is automatically deleted. We do not store personal data or use the information collected by Matomo for any other purpose than website analytics.
        </p>

        <h4>Your Rights</h4>

        <p>
          As a user, you have the right to:
        </p>

        <ul>
          <li>Access the data collected by Matomo about your visit to our website.</li>
          <li>Request correction or deletion of any inaccurate data.</li>
          <li>Object to the processing of your data for analytics purposes.</li>
          <li>Lodge a complaint with a supervisory authority if you believe your rights have been violated.</li>
        </ul>

        <h4>Opting Out</h4>

        <p>
          If you prefer not to have your data collected by Matomo, you can opt out by disabling JavaScript in your browser or by using the "Do Not Track" setting. Please note that opting out may affect your ability to fully access and use certain features of our website.
        </p>

        <h3>9. Contact Us</h3>

        <p>
          If you have any questions or concerns about our privacy policy or wish
          to exercise your privacy rights, please contact us at:
        </p>

        <p>
          Dipl.-Ing. Samir Alibabic – Online Marketing <br />
          hashion.link <br />
          Klugstraße 99 <br />
          80637 Munich <br />
          kontakt@samiralibabic.de
        </p>
      </section>
    </>
  );
}
