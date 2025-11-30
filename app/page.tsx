import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Hero Section */}
      <section className="relative text-white py-32 px-4 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-sm text-indigo-300">AI-Powered Astronomy Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Explore the Universe
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-slate-300 max-w-3xl mx-auto">
            Book your personalized astronomy observation session with expert astronomers
          </p>
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <span className="text-2xl font-bold">₹999</span>
            </div>
            <span className="text-slate-400">per session</span>
          </div>
          <Link href="/schedule">
            <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-2xl shadow-indigo-500/50">
              Book Your Session →
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Our Services</h2>
            <p className="text-slate-400 text-lg">Discover what makes our astronomy experience unique</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all hover:scale-105 hover:border-indigo-500/50">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
                  🔭
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Telescope Sessions</h3>
                <p className="text-slate-400">
                  Experience the cosmos through our high-powered telescopes
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all hover:scale-105 hover:border-indigo-500/50">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
                  🌟
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Star Gazing Tours</h3>
                <p className="text-slate-400">
                  Guided tours of constellations and celestial phenomena
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all hover:scale-105 hover:border-indigo-500/50">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
                  📚
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Educational Programs</h3>
                <p className="text-slate-400">
                  Learn about astronomy from certified experts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">What Our Visitors Say</h2>
            <p className="text-slate-400 text-lg">Join thousands of satisfied stargazers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  &quot;An absolutely magical experience! The staff was knowledgeable and the views were breathtaking.&quot;
                </p>
                <p className="font-semibold text-white">- Sarah Johnson</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  &quot;Perfect for families! My kids learned so much and had an amazing time.&quot;
                </p>
                <p className="font-semibold text-white">- Michael Chen</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  &quot;The best stargazing experience I&apos;ve ever had. Highly recommend!&quot;
                </p>
                <p className="font-semibold text-white">- Emily Rodriguez</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-4 text-slate-300">
            Book your astronomy session today and discover the wonders of the night sky
          </p>
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
              <span className="text-3xl font-bold">₹999</span>
            </div>
            <span className="text-slate-400">per session</span>
          </div>
          <div>
            <Link href="/schedule">
              <Button size="lg" className="text-lg px-10 py-7 bg-white text-indigo-600 hover:bg-slate-100 shadow-2xl">
                Schedule Now →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
