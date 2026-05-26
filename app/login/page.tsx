'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleOAuthSignIn = (provider: 'google' | 'github') => async () => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, { redirect: false })
      if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Sign in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign In to Fixeth</h1>

          <div className="space-y-4">
            <button
              onClick={handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <button
              onClick={handleOAuthSignIn('github')}
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
