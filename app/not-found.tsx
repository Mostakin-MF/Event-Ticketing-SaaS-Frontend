'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, AlertCircle } from 'lucide-react'

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="text-center space-y-8 max-w-lg mx-auto p-8 rounded-3xl">
                {/* Animated Icon */}
                <div className="flex justify-center mb-8 relative">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse h-32 w-32 -translate-x-4 -translate-y-4"></div>
                        <AlertCircle className="w-24 h-24 text-primary relative z-10" strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-8xl font-black tracking-tighter text-base-content/10 select-none">
                        404
                    </h1>
                    <h2 className="text-3xl font-bold text-base-content -mt-12 relative z-10">
                        Page Not Found
                    </h2>
                    <p className="text-base-content/60 text-lg max-w-sm mx-auto pt-4">
                        Oops! The page you are looking for has vanished or never existed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                    <button
                        onClick={() => router.back()}
                        className="btn btn-outline border-base-content/20 hover:border-base-content/40 hover:bg-base-content/5 gap-2 px-6"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="btn btn-primary gap-2 px-8 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
