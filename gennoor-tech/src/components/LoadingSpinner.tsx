// Loading Spinner Component using Gennoor Logo
'use client'

import dynamic from 'next/dynamic'

// Dynamically import the animated logo to avoid SSR issues
const GennoorLogo = dynamic(() => import('@/components/GennoorLogo'), {
  ssr: false,
  loading: () => (
    <div className="w-[210px] h-[210px] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
})

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }: LoadingSpinnerProps) {

  const sizeClasses = {
    small: 'scale-[0.3]',
    medium: 'scale-50',
    large: 'scale-75'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} transform-gpu`}>
        <GennoorLogo
          variant="icon"
        />
      </div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}