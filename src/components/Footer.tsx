import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="bg-surface text-muted border-t border-line mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-serif-display text-2xl font-bold text-foreground mb-3">
            Today<span className="text-accent">Magazine</span>
          </div>
          <p className="text-sm leading-relaxed">
            Independent reporting on business, technology and the stories
            shaping everyday life.
          </p>
        </div>

        <div>
          <h4 className="text-foreground font-semibold mb-3 text-sm uppercase tracking-wide">
            Sections
          </h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/category/${c.toLowerCase()}`} className="hover:text-accent">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold mb-3 text-sm uppercase tracking-wide">
            Company
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-accent">About</Link></li>
            <li><Link href="/dashboard/new" className="hover:text-accent">Write for us</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold mb-3 text-sm uppercase tracking-wide">
            Get in touch
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Email: hello@todaymagazine.com</li>
            <li>WhatsApp: +92 3XX XXXXXXX</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        &copy; {new Date().getFullYear()} TodayMagazine. All rights reserved.
      </div>
    </footer>
  );
}
