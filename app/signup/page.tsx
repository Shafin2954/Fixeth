'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleOAuthSignUp = (provider: 'google' | 'github') => async () => {
    setIsLoading(true)
    try {
      const result = await signIn(provider, { redirect: false, callbackUrl: '/onboarding' })
      if (result?.ok) {
        router.push('/onboarding')
      }
    } catch (error) {
      console.error('Sign up failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border p-8">
          <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-gray-600 text-center mb-6">Start your learning journey with Fixeth</p>

          <div className="space-y-4">
            <button
              onClick={handleOAuthSignUp('google')}
              disabled={isLoading}
              className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating account...' : 'Sign up with Google'}
            </button>

            <button
              onClick={handleOAuthSignUp('github')}
              disabled={isLoading}
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {isLoading ? 'Creating account...' : 'Sign up with GitHub'}
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
