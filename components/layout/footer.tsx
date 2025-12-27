import { Music } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background/60 backdrop-blur-md border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow bg-primary">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">Listenly</span>
          </div>
          <p className="text-foreground-muted text-sm mb-4">
            The ultimate music streaming platform. Discover new music, create playlists, and connect with friends.
          </p>
          <p className="text-xs text-foreground-muted">© 2024 Listenly. All rights reserved.</p>
        </div>
        {/* Product */}
        <div>
          <h3 className="font-semibold mb-2 text-primary">Product</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#features" className="hover:text-secondary">Features</a></li>
            <li><a href="#" className="hover:text-secondary">Music Library</a></li>
            <li><a href="#" className="hover:text-secondary">For Artists</a></li>
          </ul>
        </div>
        {/* Company */}
        <div>
          <h3 className="font-semibold mb-2 text-primary">Company</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#about" className="hover:text-secondary">About</a></li>
            <li><a href="#pricing" className="hover:text-secondary">Pricing</a></li>
            <li><a href="#" className="hover:text-secondary">Contact</a></li>
          </ul>
        </div>
        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-2 text-primary">Stay Updated</h3>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary bg-background"
            />
            <button type="submit" className="bg-secondary text-secondary-foreground font-semibold rounded px-4 py-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}