'use client'

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline"

interface CartItemCounterProps {
  userId: string,
  productId: string,
  value: number
}

export default function CartItemCounter({
  userId,
  productId,
  value,
}: CartItemCounterProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const onPlusBtnClick = async function () {
    setIsUpdating(true)
  
    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value + 1,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  const onMinusBtnClick = async function () {
    if (value <= 1) return
    setIsUpdating(true)

    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value - 1,
        }),
      })
      router.refresh()
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center space-x-2"> {/* Added space-x-2 for horizontal spacing */}
      <button
        onClick={onMinusBtnClick}
        className='relative inline-flex items-center rounded-l-md bg-gray-100 px-3 py-2
        text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20
        focus:outline-offset-0 disabled:bg-gray-100 disabled:text-gray-400'
        disabled={isUpdating || value < 1}
      >
        <span className='sr-only'>Remove one</span>
        <MinusIcon className='h-4 w-4' aria-hidden='true' />
      </button>

      <div className='relative inline-flex items-center justify-center bg-white px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300'>
        {value}
      </div>

      <button
        onClick={onPlusBtnClick}
        className='relative inline-flex items-center rounded-r-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20
        focus:outline-offset-0 disabled:bg-gray-100 disabled:text-gray-400'
        disabled={isUpdating}
      >
        <span className='sr-only'>Add one</span>
        <PlusIcon className='h-4 w-4' aria-hidden='true' />
      </button>
    </div>
  );
}
