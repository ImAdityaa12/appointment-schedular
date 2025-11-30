import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Explore the Universe
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-300">
            Book your personalized astronomy observation session with expert astronomers
          </p>
          <Link href="/schedule">
            <Button size="lg" className="text-lg px-8 py-6">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">🔭</div>
                <h3 className="text-xl font-semibold mb-2">Telescope Sessions</h3>
                <p className="text-slate-600">
                  Experience the cosmos through our high-powered telescopes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold mb-2">Star Gazing Tours</h3>
                <p className="text-slate-600">
                  Guided tours of constellations and celestial phenomena
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Educational Programs</h3>
                <p className="text-slate-600">
                  Learn about astronomy from certified experts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Visitors Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4">
                  &quot;An absolutely magical experience! The staff was knowledgeable and the views were breathtaking.&quot;
                </p>
                <p className="font-semibold">- Sarah Johnson</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4">
                  &quot;Perfect for families! My kids learned so much and had an amazing time.&quot;
                </p>
                <p className="font-semibold">- Michael Chen</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-4">
                  &quot;The best stargazing experience I&apos;ve ever had. Highly recommend!&quot;
                </p>
                <p className="font-semibold">- Emily Rodriguez</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-8 text-slate-300">
            Book your astronomy session today and discover the wonders of the night sky
          </p>
          <Link href="/schedule">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Schedule Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
