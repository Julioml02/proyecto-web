import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { getUser, getOrder, GetOrderResponse } from '@/lib/handlers';

export const dynamic = 'force-dynamic';

export default async function Profile() {
    const session = await getSession();
    if (!session) {
        redirect('/auth/signin');
    }

    const user = await getUser(session.userId);
    const dataOrders: GetOrderResponse | null = await getOrder(session.userId);

    if (!user) {
        notFound();
    }

    return (
        <div className='flex flex-col'>
            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
                Hello, {user.name}!
            </h3>

            {/* Tabla de información del usuario */}
            <table className="w-full max-w-md">
                <tbody>
                    <tr>
                        <td className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}>
                        <strong>Full name:</strong>
                        </td>
                        <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl">{user.name + ' ' + user.surname}</td>
                    </tr>
                    <tr>
                        <td className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}>
                            <strong>Email:</strong>
                        </td>
                        <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl">{user.email}</td>
                    </tr>
                    <tr>
                        <td className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}>
                            <strong>Address:</strong>
                        </td>
                        <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl">{user.address}</td>
                    </tr>
                    <tr>
                        <td className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}>
                            <strong>Birthdate:</strong>
                        </td>
                        <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl">{user.birthdate.getUTCMonth() + 1}/{user.birthdate.getUTCDate()}/{user.birthdate.getUTCFullYear()}</td>
                    </tr>
                </tbody>
            </table>

            <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8' style={{ paddingTop: '50px' }}>
                Orders:
            </h3>

            {}
            <table className="table-fixed w-full">
                <thead className='text-left bg-gray-200 mb-4'>
                    <tr className='divide-y'>
                        <th className='p-4 text-xs sm:text-sm md:text-base lg:text-lg w-2/5 rounded-tl-lg'>ORDER ID</th>
                        <th className='p-4 text-xs sm:text-sm md:text-base lg:text-lg w-2/5 hidden sm:table-cell '>SHIPMENT ADDRESS</th>
                        <th className='p-4 text-xs sm:text-sm md:text-base lg:text-lg w-1/10 hidden sm:table-cell md:hidden lg:table-cell'>PAYMENT INFORMATION</th>
                        <th className='p-4 text-xs sm:text-sm md:text-base lg:text-lg w-1/10 rounded-tr-lg '></th>
                    </tr>
                </thead>
                <tbody className='divide-y'>
                    {dataOrders?.orders.map((order) => (
                        <tr key={order._id}>
                            <td className='p-4 text-xs sm:text-sm md:text-base lg:text-lg text-center'>
                                <Link href={`/orders/${order._id}`}>{order._id}</Link>
                            </td>
                            <td className='p-4 text-xs sm:text-sm md:text-base lg:text-lg hidden sm:table-cell'>{order.address}</td>
                            <td className='p-4 text-xs sm:text-sm md:text-base lg:text-lg hidden sm:table-cell md:hidden lg:table-cell'>
                                <div className='flex flex-col'>
                                    <span>{order.cardHolder}</span>
                                    <span className='text-sm text-gray-500'>{order.cardNumber}</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}



///OTRA OPCIÓN

// import { notFound, redirect } from 'next/navigation';
// import { getSession } from '@/lib/auth';
// import Link from 'next/link';
// import { getUser, getOrder } from '@/lib/handlers';

// export const dynamic = 'force-dynamic';

// export default async function Profile() {
//   const session = await getSession();
//   if (!session) {
//     redirect('/auth/signin');
//   }

//   // Obtener datos del usuario y órdenes
//   const user = await getUser(session.userId);
//   const dataOrders = await getOrder(session.userId);

//   if (!user) {
//     notFound();
//   }

//   // Definir las órdenes
//   const orders = dataOrders?.orders || [];

//   return (
//     <div className='flex flex-col p-8 max-w-3xl mx-auto bg-white shadow rounded-lg'>
//       <h3 className='pb-4 text-3xl font-bold text-gray-900'>Hello, {user.name}!</h3>

//       <div className="p-6 bg-gray-100 rounded-lg mb-8">
//         <p className="text-lg"><strong>Full name:</strong> {user.name} {user.surname}</p>
//         <p className="text-lg"><strong>Email:</strong> {user.email}</p>
//         <p className="text-lg"><strong>Address:</strong> {user.address}</p>
//         <p className="text-lg"><strong>Birthdate:</strong> {user.birthdate.getUTCMonth() + 1}/{user.birthdate.getUTCDate()}/{user.birthdate.getUTCFullYear()}</p>
//       </div>

//       <h3 className='pb-4 text-2xl font-bold text-gray-900'>Orders:</h3>

//       <table className='table-auto w-full'>
//         <thead className='bg-gray-200'>
//           <tr>
//             <th className='p-4 text-left'>ORDER ID</th>
//             <th className='p-4 text-left'>SHIPMENT ADDRESS</th>
//             <th className='p-4 text-left'>PAYMENT INFORMATION</th>
//             <th className='p-4 text-center'> </th>
//           </tr>
//         </thead>
//         <tbody className='divide-y'>
//           {orders.length > 0 ? (
//             orders.map((order) => (
//               <tr key={order._id.toString()} className='bg-white'>
//                 <td className='p-4 text-sm'>{order._id.toString()}</td>
//                 <td className='p-4 text-sm'>{order.address}</td>
//                 <td className='p-4 text-sm'>
//                   <div className='flex flex-col'>
//                     <span>{order.cardHolder}</span>
//                     <span className='text-gray-500'>{order.cardNumber}</span>
//                   </div>
//                 </td>
//                 <td className='p-4 text-sm text-center'>
//                 <Link href={`/orders/${order._id}`} className='text-blue-500'>view details</Link>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={4} className='p-4 text-center text-sm text-gray-500'>
//                 No orders found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


