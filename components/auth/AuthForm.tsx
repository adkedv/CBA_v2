'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function AuthForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else if (mode === 'signup') {
      setMessage('Check your email to confirm your account.')
      setLoading(false)
    } else {
      router.push('/app')
      // Don't setLoading(false) — navigation will unmount this component
    }
  }

  async function handleGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setMessage('Google sign-in failed. Please try again.')
      setLoading(false)
    }
    // On success: browser redirects to Google, page navigates away
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <h1 className="font-serif text-2xl font-bold text-brand-espresso mb-6 text-center">
        {mode === 'signin' ? 'Welcome back' : 'Create account'}
      </h1>

      <Button variant="secondary" size="lg" onClick={handleGoogle} disabled={loading} className="mb-4">
        Continue with Google
      </Button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-brand-tan/40" />
        <span className="text-xs text-brand-tan">or</span>
        <div className="flex-1 h-px bg-brand-tan/40" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-brand-tan/40 bg-white text-brand-espresso placeholder:text-brand-tan focus:outline-none focus:border-brand-brown text-sm"
        />
        <input
          type="password"
          placeholder={mode === 'signup' ? 'Password (min. 8 characters)' : 'Password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={mode === 'signup' ? 8 : undefined}
          className="w-full px-4 py-2.5 rounded-xl border border-brand-tan/40 bg-white text-brand-espresso placeholder:text-brand-tan focus:outline-none focus:border-brand-brown text-sm"
        />
        {message && <p className="text-sm text-center text-brand-amber">{message}</p>}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-sm text-center text-brand-brown/60 mt-4">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-brand-brown font-medium underline"
        >
          {mode === 'signin' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </Card>
  )
}
