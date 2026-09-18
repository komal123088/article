import { Mail, Phone, ExternalLink } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-serif-display text-3xl font-bold mb-4">
        Get in touch
      </h1>
      <p className="text-muted leading-relaxed mb-8">
        For questions, feedback, story tips, or paid submissions, reach out
        using any of the options below. We read every message and usually reply
        within a couple of working days.
      </p>

      <div className="space-y-4">
        <a
          href="mailto:info.johnniker@gmail.com"
          className="flex items-center gap-3 border border-line rounded-lg p-4 hover:border-accent transition-colors"
        >
          <Mail className="text-accent" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-muted">info.johnniker@gmail.com</p>
          </div>
        </a>

        <a
          href="https://wa.me/923216855949"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-line rounded-lg p-4 hover:border-accent transition-colors"
        >
          <Phone className="text-accent" />
          <div>
            <p className="font-medium">Phone / WhatsApp</p>
            <p className="text-sm text-muted">0321 6855949</p>
          </div>
        </a>

        <a
          href="https://www.facebook.com/profile.php?id=61575931508977"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-line rounded-lg p-4 hover:border-accent transition-colors"
        >
          <ExternalLink className="text-accent" />
          <div>
            <p className="font-medium">Facebook</p>
            <p className="text-sm text-muted">Follow our page for updates</p>
          </div>
        </a>
      </div>
    </div>
  );
}
