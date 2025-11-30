import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-7xl">🌌</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Explore the Universe
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100 max-w-3xl mx-auto">
            Book your personalized astronomy observation session with expert astronomers
          </p>
          <p className="text-3xl font-bold mb-10 text-white">
            Only ₹999 per session
          </p>
          <Link href="/schedule">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-blue-50">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">Our Services</h2>
          <p className="text-center text-slate-600 mb-12">Discover what makes our astronomy experience unique</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-6xl mb-4">🔭</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Telescope Sessions</h3>
                <p className="text-slate-600">
                  Experience the cosmos through our high-powered telescopes
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Star Gazing Tours</h3>
                <p className="text-slate-600">
                  Guided tours of constellations and celestial phenomena
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Educational Programs</h3>
                <p className="text-slate-600">
                  Learn about astronomy from certified experts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-slate-900">What Our Visitors Say</h2>
          <p className="text-center text-slate-600 mb-12">Join thousands of satisfied stargazers</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4">
                  &quot;An absolutely magical experience! The staff was knowledgeable and the views were breathtaking.&quot;
                </p>
                <p className="font-semibold text-slate-900">- Sarah Johnson</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4">
                  &quot;Perfect for families! My kids learned so much and had an amazing time.&quot;
                </p>
                <p className="font-semibold text-slate-900">- Michael Chen</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4">
                  &quot;The best stargazing experience I&apos;ve ever had. Highly recommend!&quot;
                </p>
                <p className="font-semibold text-slate-900">- Emily Rodriguez</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-4 text-blue-100">
            Book your astronomy session today and discover the wonders of the night sky
          </p>
          <p className="text-3xl font-bold mb-8 text-white">
            Just ₹999 per session
          </p>
          <Link href="/schedule">
            <Button size="lg" className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-blue-50">
              Schedule Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
