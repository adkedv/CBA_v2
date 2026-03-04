import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <AuthForm />
    </div>
  )
}
