import Link from 'next/link';
import Image from 'next/image';
import { Music, Play, Users, Share2, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-[#283F83] to-[#476FE9]">
              <Music className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl bg-gradient-to-r from-[#283F83] to-[#476FE9] bg-clip-text text-transparent font-bold">
              Listenly
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-[#476FE9] transition-colors">Features</a>
            <a href="#about" className="text-foreground hover:text-[#476FE9] transition-colors">About</a>
            <a href="#pricing" className="text-foreground hover:text-[#476FE9] transition-colors">Pricing</a>
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-[#283F83] to-[#476FE9] hover:opacity-90">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl md:text-6xl mb-6 font-bold leading-tight">
              Your Music,<br />
              <span className="bg-gradient-to-r from-[#283F83] to-[#476FE9] bg-clip-text text-transparent">
                Your Way
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Stream millions of songs, create personalized playlists, and share your favorite music with friends. Join the Listenly community today.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-[#283F83] to-[#476FE9] hover:opacity-90">
                <Link href="/signup">
                  <Play className="w-5 h-5 mr-2" />
                  Get Started Free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-blue-200">
                <Link href="/plans">View More</Link>
              </Button>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-full max-w-md h-[350px] bg-white/60 rounded-3xl shadow-2xl flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop"
                alt="Music streaming"
                className="rounded-3xl object-cover"
                width={320}
                height={320}
                priority
              />
            </div>
            <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-blue-100 flex items-center gap-3 min-w-[180px]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#283F83] to-[#476FE9] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">1.2M+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-[#476FE9] border-0">Features</Badge>
          <h2 className="text-4xl mb-4 font-bold">Everything You Need</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to enhance your music streaming experience
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/60 backdrop-blur-md border-blue-100 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#283F83] to-[#476FE9] rounded-xl flex items-center justify-center mb-4">
                <Music className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Unlimited Music</CardTitle>
              <CardDescription>
                Access millions of songs from every genre and era
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border-blue-100 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#476FE9] to-[#60a5fa] rounded-xl flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Share & Collaborate</CardTitle>
              <CardDescription>
                Create and share playlists with friends and family
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-white/60 backdrop-blur-md border-blue-100 shadow-lg hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-[#283F83] to-[#476FE9] rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>
                Discover new music tailored to your taste
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <Card className="border-none shadow-2xl bg-gradient-to-r from-[#283F83] via-[#476FE9] to-[#283F83] text-white overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl mb-4 font-bold">Ready to Get Started?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join millions of music lovers on Listenly. Start streaming for free today.
            </p>
            <Button asChild size="lg" className="bg-white text-[#476FE9] hover:bg-white/90 font-semibold">
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-blue-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow bg-gradient-to-br from-[#283F83] to-[#476FE9]">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#283F83] to-[#476FE9] bg-clip-text text-transparent">Listenly</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              The ultimate music streaming platform. Discover new music, create playlists, and connect with friends.
            </p>
            <p className="text-xs text-muted-foreground">© 2024 Listenly. All rights reserved.</p>
          </div>
          {/* Product */}
          <div>
            <h3 className="font-semibold mb-2">Product</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#features" className="hover:text-[#476FE9]">Features</a></li>
              <li><a href="#" className="hover:text-[#476FE9]">Music Library</a></li>
              <li><a href="#" className="hover:text-[#476FE9]">For Artists</a></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="font-semibold mb-2">Company</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#about" className="hover:text-[#476FE9]">About</a></li>
              <li><a href="#pricing" className="hover:text-[#476FE9]">Pricing</a></li>
              <li><a href="#" className="hover:text-[#476FE9]">Contact</a></li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-2">Stay Updated</h3>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="rounded-md border border-blue-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#476FE9] bg-white/80"
              />
              <Button type="submit" className="bg-gradient-to-r from-[#283F83] to-[#476FE9] text-white font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </footer>
    </div>
  );
}