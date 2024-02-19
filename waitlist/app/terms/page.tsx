import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Terms() {
  return (
    <>
      <Link className="flex m-5 items-center" href="/">
        <ArrowLeftIcon className="mr-2" />Back
      </Link>
      <section className="legal text-left">
        <h2>Terms of Use</h2>

        <p>
          These terms outline the rules and regulations for the use of our
          website and the collection of visitors' emails. By accessing this
          website, we assume you accept these terms and conditions. Do not
          continue to use our website if you do not agree with all of the terms
          and conditions stated on this page.
        </p>

        <h3>Data Collection and Usage</h3>
        <p>
          We collect and store visitors' email addresses for the purpose of
          communication, marketing, and providing relevant updates regarding our
          products or services. By submitting your email address, you consent to
          its use for these purposes.
        </p>

        <h3>GDPR Compliance</h3>
        <p>
          We are committed to protecting the privacy and security of your
          personal data in accordance with the General Data Protection
          Regulation (GDPR) and other applicable data protection laws. Your
          personal information will only be used for the purposes stated in
          these terms and will not be shared with third parties without your
          explicit consent, except where required by law.
        </p>

        <h3>Data Security</h3>
        <p>
          We take reasonable precautions to protect your personal information
          from unauthorized access, use, or disclosure. However, no method of
          transmission over the internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>

        <h3>Opt-Out</h3>
        <p>
          You have the right to opt-out of receiving marketing communications
          from us at any time. You can do this by clicking the "unsubscribe"
          link in the emails we send you or by contacting us directly.
        </p>

        <h3>Cookie Policy</h3>
        <p>
          We may use cookies to enhance your experience while visiting our
          website. Cookies are small files stored on your computer's hard drive.
          You can set your browser to refuse all or some browser cookies, or to
          alert you when websites set or access cookies. If you disable or
          refuse cookies, please note that some parts of this website may become
          inaccessible or not function properly.
        </p>

        <h3>Third-Party Links</h3>
        <p>
          Our website may contain links to third-party websites or services that
          are not owned or controlled by us. We have no control over, and assume
          no responsibility for, the content, privacy policies, or practices of
          any third-party websites or services. You further acknowledge and
          agree that we shall not be responsible or liable, directly or
          indirectly, for any damage or loss caused or alleged to be caused by
          or in connection with the use of or reliance on any such content,
          goods, or services available on or through any such websites or
          services.
        </p>

        <h3>Changes to Terms</h3>
        <p>
          We reserve the right to modify these terms at any time without prior
          notice. By continuing to access or use our website after those
          revisions become effective, you agree to be bound by the revised
          terms. If you do not agree to the new terms, please stop using the
          website.
        </p>

        <h3>Contact Us</h3>
        <p>
          If you have any questions about these terms, please contact us at
          kontakt@samiralibabic.de. By using our website, you agree to these terms
          and conditions. If you do not agree to abide by these terms and
          conditions, you are not authorized to use or access this website.
        </p>
      </section>
    </>
  );
}
