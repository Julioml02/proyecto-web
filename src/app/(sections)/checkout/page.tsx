import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getCarts, getUser, GetCartResponse } from '@/lib/handlers'
import Link from 'next/link'

export default async function Checkout() {
  // Autenticación
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  // Obtener los datos del carrito del usuario
  const cartItemsData: GetCartResponse | null = await getCarts(session.userId)
  if (!cartItemsData || cartItemsData.cartItems.length === 0) {
    return (
      <div className='flex flex-col items-center'>
        <h3 className='pb-4 text-3xl font-bold text-gray-900'>Checkout</h3>
        <p className='text-gray-500'>Your cart is empty.</p>
        <Link href='/products'>
          <button className='mt-4 rounded bg-gray-800 px-4 py-2 text-white'>Go Shopping</button>
        </Link>
      </div>
    )
  }

  // Obtener los datos del usuario
  const userData = await getUser(session.userId)
  if (!userData) {
    redirect('/auth/signin')
  }

  // Calcular el precio total
  const calculateTotalPrice = () => {
    return cartItemsData.cartItems.reduce(
      (total, cartItem) => total + cartItem.qty * cartItem.product.price,
      0
    )
  }

  return (
    <div className='flex flex-col items-center'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900'>Checkout</h3>

      <div className='w-full max-w-4xl'>
        {/* Tabla de productos */}
        <div className="overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItemsData.cartItems.map((cartItem) => (
                <tr key={cartItem.product._id.toString()} className="bg-white border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link href={`/products/${cartItem.product._id}`}>
                      {cartItem.product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{cartItem.qty}</td>
                  <td className="px-6 py-4">
                    {cartItem.product.price?.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td className="px-6 py-4">
                    {(cartItem.qty * cartItem.product.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-semibold">
                <td colSpan={3} className="px-6 py-4 text-right">Total:</td>
                <td className="px-6 py-4">
                  {calculateTotalPrice().toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formulario de dirección de envío y pago */}
        <form className='mt-6 space-y-4'>
          <div>
            <label className='block text-gray-700'>Shipping address</label>
            <input
              type='text'
              name='address'
              placeholder='123 Main St, City, Country'
              defaultValue={userData.address} // Utilizamos el valor del usuario desde getUser
              className='w-full mt-1 rounded-md border-gray-300 shadow-sm'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Card Holder</label>
            <input
              type='text'
              name='cardHolder'
              placeholder='John Doe'
              defaultValue={`${userData.name} ${userData.surname}`} // Nombre completo del usuario
              className='w-full mt-1 rounded-md border-gray-300 shadow-sm'
              required
            />
          </div>
          <div>
            <label className='block text-gray-700'>Card Number</label>
            <input
              type='text'
              name='cardNumber'
              placeholder='0000 1111 2222 3333'
              defaultValue='0000111222333344' // Número de tarjeta de ejemplo
              className='w-full mt-1 rounded-md border-gray-300 shadow-sm'
              required
            />
          </div>
          <button type='submit' className='w-full rounded bg-gray-800 px-4 py-2 text-white'>
            Purchase
          </button>
        </form>
      </div>
    </div>
  )
}
