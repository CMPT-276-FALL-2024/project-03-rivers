export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Terms of Service</h1>
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">1. Introduction</h2>
          <p className="mb-4">
            These Terms of Service ("Terms") govern your use of the RNA service ("Service").
            By using the Service, you agree to these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">2. Use of Service</h2>
          <p className="mb-4">
            Our Service provides recipe search and storage functionality, as well as
            integration with Google Calendar. By using our Service, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Authenticate using your Google account</li>
            <li>Allow the addition of events to your Google Calendar</li>
            <li>Use the Service in a lawful and appropriate manner</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">3. User Accounts</h2>
          <p className="mb-4">
            You are responsible for maintaining the confidentiality of your account
            and password. You agree to accept responsibility for all activities that
            occur under your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">4. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality are
            owned by RNA and are protected by international copyright, trademark,
            patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">5. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and bar access to the Service
            immediately, without prior notice or liability, under our sole discretion,
            for any reason whatsoever and without limitation, including but not limited
            to a breach of the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall RNA, nor its directors, employees, partners, agents,
            suppliers, or affiliates, be liable for any indirect, incidental, special,
            consequential or punitive damages, including without limitation, loss of
            profits, data, use, goodwill, or other intangible losses, resulting from
            your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">7. Changes</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these
            Terms at any time. What constitutes a material change will be determined
            at our sole discretion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="font-semibold">Email: rka147@sfu.ca</p>
        </section>
      </div>
    </div>
  );
}

