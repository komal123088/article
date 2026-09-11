import { Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold mb-4">Get in touch</h1>
      <p className="text-muted leading-relaxed mb-8">
        For questions, feedback, or paid submissions, get in touch with us.
      </p>

      <div className="space-y-4">
        <a
          href="mailto:hello@todaymagazine.com"
          className="flex items-center gap-3 border border-line rounded-lg p-4 hover:border-accent transition-colors"
        >
          <Mail className="text-accent" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted">hello@todaymagazine.com</p>
          </div>
        </a>

        <a
          href="https://wa.me/923000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-line rounded-lg p-4 hover:border-accent transition-colors"
        >
          <MessageCircle className="text-accent" />
          <div>
            <p className="font-medium">WhatsApp</p>
            <p className="text-sm text-muted">+92 3XX XXXXXXX</p>
          </div>
        </a>
      </div>
    </div>
  );
}
