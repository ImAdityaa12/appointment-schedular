'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Login successful');
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <Card className="w-full max-w-md shadow-2xl bg-slate-900/50 border-slate-700 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-b border-slate-700">
          <div className="mx-auto mb-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <span className="text-4xl">🔐</span>
          </div>
          <CardTitle className="text-3xl font-bold">Admin Portal</CardTitle>
          <p className="text-indigo-100 mt-2">Secure access to dashboard</p>
        </CardHeader>
        <CardContent className="pt-8 pb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="mt-2 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="mt-2 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-indigo-500/50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Logging in...
                </span>
              ) : (
                'Login to Dashboard →'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
