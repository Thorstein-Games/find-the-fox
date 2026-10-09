import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import PageLayout from '../modules/PageLayout';
import contactStyles from '../styles/contact.module.scss';
import styles from '../styles/content-page.module.scss';

const Contact = () => {
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://formspree.io/f/mvzgjbvv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 5000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with the Find the Fox team. We'd love to hear your feedback, suggestions, or answer any questions you have about the game."
      url="/contact"
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Contact Us</h1>

          <section className={styles.section}>
            <p>
              Have a question, suggestion, or just want to say hi? We&apos;d love to hear from you! Fill out the form
              below and we&apos;ll get back to you as soon as possible.
            </p>
          </section>

          <form className={contactStyles.form} onSubmit={handleSubmit}>
            <div className={contactStyles.formGroup}>
              <label htmlFor="name">
                Name *
                <input
                  autoComplete="on"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </label>
            </div>

            <div className={contactStyles.formGroup}>
              <label htmlFor="email">
                Email *
                <input
                  autoComplete="on"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </label>
            </div>

            <div className={contactStyles.formGroup}>
              <label htmlFor="subject">
                Subject *
                <input
                  autoComplete="on"
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                />
              </label>
            </div>

            <div className={contactStyles.formGroup}>
              <label htmlFor="message">
                Message *
                <textarea
                  autoComplete="on"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us what's on your mind..."
                />
              </label>
            </div>

            <button type="submit" className={contactStyles.submitButton} disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <div className={contactStyles.successMessage}>
                ✓ Message sent successfully! We&apos;ll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className={contactStyles.errorMessage}>
                ✗ Oops! Something went wrong. Please try again or email us directly.
              </div>
            )}
          </form>

          <section className={`${styles.section} ${contactStyles.infoSection}`}>
            <h2>Other Ways to Reach Us</h2>
            <p>
              Prefer email? You can reach us directly at{' '}
              <a href="mailto:support@ThorsteinGames.com">support@ThorsteinGames.com</a>
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;
