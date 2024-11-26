export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">1. Information Collection</h2>
          <p className="mb-4">
            This website provides a login feature using Google accounts.
            When you log in, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your name</li>
            <li>Email address</li>
            <li>Profile picture</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">2. Use of Personal Information</h2>
          <p className="mb-4">
            The personal information we collect is used for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>User authentication</li>
            <li>Adding recipe plans to Google Calendar</li>
            <li>Service improvement</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">3. Sharing of Personal Information</h2>
          <p className="mb-4">
            We do not share your personal information with third parties
            except as required by law or with your explicit consent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized or unlawful
            processing, accidental loss, destruction, or damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information.
            If you wish to exercise these rights, please contact us using the information provided below.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">6. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-primary">7. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this privacy policy, please contact us at:
          </p>
          <p className="font-semibold">Email: rka147@sfu.ca</p>
        </section>
      </div>
    </div>
  );
}

