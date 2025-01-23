import React from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqData: FAQ[] = [
  {
    question: "How do I sign in with Google, and do I need a special account?",
    answer: `
      You can sign in with any Google account—no special permissions needed. Just click “Sign In with Google” 
      on our landing page, grant access when prompted, and you're in! If you use multiple Google accounts, 
      simply choose the one you want to sync with our app.
    `,
  },
  {
    question: "Are my calendar events and personal data safe?",
    answer: `
      Absolutely. We use industry-standard encryption to protect your data in transit and at rest. 
      We never share or sell your personal information to third parties. Your Google Calendar data is 
      accessed only with your explicit permission and is used solely to display or update your events
      based on your actions in the app.
    `,
  },
  {
    question: "How do AI Summaries work, and what data is sent to the AI?",
    answer: `
      Our AI Summaries feature uses an LLM (powered by ChatGPT) to generate concise insights or summaries 
      of your event text. Only the specific details (title, description) you choose to summarize are sent 
      securely to the AI API. We don’t store these summaries long-term unless you decide to save them.
    `,
  },
  {
    question: "Can I set reminders for my events?",
    answer: `
      Yes! You can schedule real email notifications before an event starts. Simply click “Remind Me” 
      when viewing an event, choose how early you’d like to be notified, and we handle the rest—no additional 
      setup required.
    `,
  },
  {
    question: "Does the app handle multiple calendars or shared calendars?",
    answer: `
      Definitely. Our app supports multiple Google Calendars under the same account. 
      If you have access to shared or team calendars, you can switch between them in the settings 
      or display them all together. 
    `,
  },
  {
    question: "Do I need to pay for these features, and are there any usage limits?",
    answer: `
      Right now, our core features (Google SSO, event management, AI Summaries, and reminders) 
      are free to use for personal accounts. If you have extremely high usage demands (like 
      thousands of daily AI requests), please contact us for a custom plan. We’re committed to 
      keeping everyday scheduling simple and affordable.
    `,
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {faqData.map((item, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
              <details>
                <summary className="cursor-pointer font-semibold">
                  {item.question}
                </summary>
                <p className="mt-2 text-gray-600 whitespace-pre-line">
                  {item.answer.trim()}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
