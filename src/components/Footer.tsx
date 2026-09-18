import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { Mail, Phone, ExternalLink } from "lucide-react";

export default function Footer() {
  const half = Math.ceil(CATEGORIES.length / 2);
  const firstHalf = CATEGORIES.slice(0, half);
  const secondHalf = CATEGORIES.slice(half);

  return (
    <footer className="bg-surface text-muted border-t border-line mt-16">
      <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand + description */}
        <div className="md:col-span-4">
          <div className="font-serif-display text-2xl font-bold text-foreground mb-3">
            Today<span className="text-accent">Magazine</span>
          </div>
          <p className="text-sm leading-relaxed mb-3">
            TodayMagazine is an independent publication covering the stories
            that shape everyday life — from business and technology to health,
            fashion and lifestyle. We publish clear, practical reporting for
            readers who want to understand what is changing around them, without
            the noise.
          </p>
          <p className="text-sm leading-relaxed">
            Our contributors come from a range of backgrounds, and anyone can
            create a free account to submit an article. Every submission is
            reviewed by our editorial team before it goes live, so readers can
            trust what they find here.
          </p>
        </div>

        {/* Sections, split into two columns */}
        <div className="md:col-span-4 grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-foreground font-semibold mb-3 text-sm uppercase tracking-wide">
              Sections
            </h4>
            <ul className="space-y-2 text-sm">
              {firstHalf.map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${c.toLowerCase()}`}
                    className="hover:text-accent"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-3 text-sm uppercase tracking-wide">
              More
            </h4>
            <ul className="space-y-2 text-sm">
              {secondHalf.map((c) => (
                <li key={c}>
                  <Link
                    href={`/category/${c.toLowerCase()}`}
                    className="hover:text-accent"
                  >
                    {c}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/about" className="hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link href="/dashboard/new" className="hover:text-accent">
                  Write for us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="md:col-span-4">
          <h4 className="text-foreground font-semibold mb-3 text-sm uppercase tracking-wide">
            Get in touch
          </h4>
          <p className="text-sm leading-relaxed mb-4">
            Have a story tip, a correction, or a partnership enquiry? We read
            every message and usually reply within a couple of working days.
          </p>

          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="mailto:info.johnniker@gmail.com"
                className="flex items-center gap-2 hover:text-accent"
              >
                <Mail size={15} className="text-accent shrink-0" />
                info.johnniker@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/923216855949"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent"
              >
                <Phone size={15} className="text-accent shrink-0" />
                0321 6855949
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61575931508977"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-accent"
              >
                <ExternalLink size={15} className="text-accent shrink-0" />
                Follow us on Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-4 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} TodayMagazine. All rights reserved.
      </div>
    </footer>
  );
}
