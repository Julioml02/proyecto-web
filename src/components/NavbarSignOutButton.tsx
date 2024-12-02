'use client'

import React from 'react'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function NavbarSignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const res = await fetch('/api/auth/signout', {
      method: 'POST',
    })

    if (res.ok) {
      router.push('/auth/signin') // Redirige al usuario a la página de inicio de sesión
    } else {
      console.error('Failed to sign out')
    }
  }

  return (
    <button onClick={handleSignOut} className="flex items-center space-x-2 text-gray-800 hover:text-gray-600">
      <span className="sr-only">Sign out</span>
      <ArrowRightStartOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
      <span>Sign out</span>
    </button>
  )
}
