// //MI FORMA DE HACERLO

// import { redirect } from 'next/navigation';
// import { getCarts } from '@/lib/handlers';
// import Link from 'next/link';
// import { getSession } from '@/lib/auth';

// export default async function Cart() {
//   const session = await getSession();
//   if (!session) {
//     redirect('/auth/signin');
//   }

//   const cartItemsData = await getCarts(session.userId);
//   if (!cartItemsData) {
//     redirect('/auth/signin');
//   }

//   const calculateTotalPrice = () => {
//     return cartItemsData.cartItems.reduce(
//       (total, cartItem) => total + cartItem.qty * cartItem.product.price,
//       0
//     );
//   };

//   return (
//     <div className='flex flex-col'>
//       <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
//         My Shopping Cart
//       </h3>
//       {cartItemsData.cartItems.length === 0 ? (
//         <div className='text-center'>
//           <span className='text-sm text-gray-400'>The cart is empty</span>
//         </div>
//       ) : (
//         <>
//           <div className='relative overflow-x-auto'>
//             <table className='w-full text-sm text-left text-gray-500'>
//               <tbody>
//                 {cartItemsData.cartItems.map((cartItem) => (
//                   <tr key={cartItem.product._id.toString()} className='rounded bg-white'>
//                     <td className='lg:w-3/5'>
//                       <Link href={`/products/${cartItem.product._id}`}>
//                         {cartItem.product.name}
//                       </Link>
//                       <td>{cartItem.product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
//                     </td>
//                     <td>
//                       <th className='rounded py-2 text-left'> Price per unit </th>
//                       {(cartItem.qty * cartItem.product.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
//                     </td>
//                     <td className='flex items-center space-x-2'>
//                       <button className='text-gray rounded bg-gray-300 px-2 py-1 cursor-default'>
//                         {' '}
//                         -{' '}
//                       </button>
//                       <span className='text-gray rounded bg-white px-2 py-1'>
//                         {' '}
//                         {cartItem.qty}
//                       </span>
//                       <button className='text-gray rounded bg-gray-300 px-2 py-1 cursor-default'>
//                         {' '}
//                         +{' '}
//                       </button>
//                       <button className='rounded bg-red-200 px-2 py-1 text-white cursor-default'>
//                         {' '}
//                         <svg className='w-6 h-6 text-gray-600' xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='none' viewBox='0 0 24 24'>
//                           <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z'/>
//                         </svg>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className='mb-4 w-full rounded bg-gray-200 p-4'>
//               <span className='text-lg font-bold'>Total:</span>
//               <span className='ml-2 text-lg'>
//                 {calculateTotalPrice().toFixed(2) + ' €'}
//               </span>
//             </div>

//             <div className='text-center'>
//               <Link href='/checkout'>
//                 <button className='rounded bg-gray-800 px-4 py-2 text-white'>
//                   Checkout
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { redirect } from 'next/navigation';
import { getCarts } from '@/lib/handlers';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

export default async function Cart() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/signin');
  }

  const cartItemsData = await getCarts(session.userId);
  if (!cartItemsData) {
    redirect('/auth/signin');
  }

  const calculateTotalPrice = () => {
    return cartItemsData.cartItems.reduce(
      (total, cartItem) => total + cartItem.qty * cartItem.product.price,
      0
    );
  };

  return (
    <div className="flex flex-col">
      <h3 className="pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8">
        My Shopping Cart
      </h3>
      {cartItemsData.cartItems.length === 0 ? (
        <div className="text-center">
          <span className="text-sm text-gray-400">The cart is empty</span>
        </div>
      ) : (
        <>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <tbody>
                {cartItemsData.cartItems.map((cartItem) => (
                  <tr
                    key={cartItem.product._id.toString()}
                    className="rounded bg-white"
                  >
                    {/* Imagen del producto */}
                    <td className="p-4 align-middle">
                      <Link href={`/products/${cartItem.product._id}`}>
                        <img
                          src={cartItem.product.img}
                          alt={cartItem.product.name}
                          className="w-24 h-24 rounded-md object-cover"
                        />
                      </Link>
                    </td>
                    {/* Nombre del producto */}
                    <td className="p-4 lg:w-3/5 align-middle">
                      <Link
                        href={`/products/${cartItem.product._id}`}
                        className="text-lg font-medium text-gray-900 hover:underline"
                      >
                        {cartItem.product.name}
                      </Link>
                      <p className="text-sm text-gray-600">
                        Per unit: {cartItem.product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </p>
                    </td>
                    {/* Precio total en negrita */}
                    <td className="p-4 text-right align-middle">
                      <span className="font-bold">
                        {(cartItem.qty * cartItem.product.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </span>
                    </td>
                    {/* Botones */}
                    <td className="p-4 align-middle">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray rounded bg-gray-300 px-2 py-1">
                          {' '}
                          -{' '}
                        </button>
                        <span className="text-gray rounded bg-white px-2 py-1">
                          {cartItem.qty}
                        </span>
                        <button className="text-gray rounded bg-gray-300 px-2 py-1">
                          {' '}
                          +{' '}
                        </button>
                        <button className="rounded bg-red-200 px-2 py-1 text-white">
                          <svg
                            className="w-6 h-6 text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mb-4 w-full rounded bg-gray-200 p-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="ml-2 text-lg">
                {calculateTotalPrice().toFixed(2) + ' €'}
              </span>
            </div>

            <div className="text-center">
              <Link href="/checkout">
                <button
                  className={`rounded px-4 py-2 text-white ${
                    cartItemsData.cartItems.length === 0
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gray-800'
                  }`}
                  disabled={cartItemsData.cartItems.length === 0}
                >
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


