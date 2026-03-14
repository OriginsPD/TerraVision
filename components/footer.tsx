import Link from "next/link"
import { Compass, Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react"

const footerLinks = {
  platform: [
    { name: "Properties", href: "/properties" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Floor Plans", href: "/marketplace/floor-plans" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/api" },
    { name: "Community", href: "/community" },
    { name: "Partners", href: "/partners" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-white/5 backdrop-blur-xl pt-24 pb-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute left-[-10%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute right-[-10%] top-[-10%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 mb-16">
          {/* Brand & Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg transition-transform group-hover:scale-110">
                <Compass className="h-6 w-6 text-white" />
              </div>
              <span className="font-serif text-2xl tracking-tight text-foreground font-bold">
                Terra<span className="text-primary">Vision</span>
              </span>
            </Link>
            <p className="max-w-xs text-lg font-medium text-muted-foreground/80 leading-relaxed mb-8">
              The world's most immersive real estate marketplace. Discover, visualize, and build your dream property with AI-powered 3D visualization.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/70">
                <Mail className="h-4 w-4 text-primary" />
                hello@terravision.com
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/70">
                <Phone className="h-4 w-4 text-primary" />
                +1 (555) 000-0000
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/70">
                <MapPin className="h-4 w-4 text-primary" />
                Silicon Valley, CA
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Platform</h3>
              <ul className="space-y-4">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-medium text-muted-foreground transition-all hover:text-primary hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-6">Company</h3>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-medium text-muted-foreground transition-all hover:text-accent hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Resources</h3>
              <ul className="space-y-4">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-medium text-muted-foreground transition-all hover:text-primary hover:translate-x-1 inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-medium text-muted-foreground">
            &copy; {new Date().getFullYear()} TerraVision. Built with passion for the future.
          </p>
          
          <div className="flex items-center gap-4">
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground transition-all hover:bg-primary/20 hover:text-primary">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground transition-all hover:bg-accent/20 hover:text-accent">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-muted-foreground transition-all hover:bg-primary/20 hover:text-primary">
              <Github className="h-5 w-5" />
            </Link>
          </div>

          <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
