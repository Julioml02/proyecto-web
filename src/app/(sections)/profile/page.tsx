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
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8">
        Hello, {user.name}!
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full max-w-md">
          <tbody>
            <tr>
              <td
                className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl"
                style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}
              >
                <strong className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm10 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-8-5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm1.942 4a3 3 0 0 0-2.847 2.051l-.044.133-.004.012c-.042.126-.055.167-.042.195.006.013.02.023.038.039.032.025.08.064.146.155A1 1 0 0 0 6 17h6a1 1 0 0 0 .811-.415.713.713 0 0 1 .146-.155c.019-.016.031-.026.038-.04.014-.027 0-.068-.042-.194l-.004-.012-.044-.133A3 3 0 0 0 10.059 14H7.942Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Full Name:
                </strong>
              </td>
              <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap' }}>
                {user.name + ' ' + user.surname}
              </td>
            </tr>
            <tr>
              <td
                className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl"
                style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}
              >
                <strong className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                    <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
                  </svg>
                  Email:
                </strong>
              </td>
              <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl">{user.email}</td>
            </tr>
            <tr>
              <td
                className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl"
                style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}
              >
                <strong className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Address:
                </strong>
              </td>
              <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap' }}>
                {user.address}
              </td>
            </tr>
            <tr>
              <td
                className="pb-2 text-left text-sm sm:text-base md:text-lg lg:text-xl"
                style={{ whiteSpace: 'nowrap', paddingRight: '45px' }}
              >
                <strong className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path d="M20 7h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C10.4 2.842 8.949 2 7.5 2A3.5 3.5 0 0 0 4 5.5c.003.52.123 1.033.351 1.5H4a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V9a2 2 0 0 0-2-2Zm-9.942 0H7.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM13 14h-2v8h2v-8Zm-4 0H4v6a2 2 0 0 0 2 2h3v-8Zm6 0v8h3a2 2 0 0 0 2-2v-6h-5Z" />
                  </svg>
                  Birthdate:
                </strong>
              </td>
              <td className="pb-2 text-sm sm:text-base md:text-lg lg:text-xl" style={{ whiteSpace: 'nowrap' }}>
                {user.birthdate.getUTCMonth() + 1}/{user.birthdate.getUTCDate()}/{user.birthdate.getUTCFullYear()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8" style={{ paddingTop: '50px' }}>
        Orders:
      </h3>

      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Shipment Address</th>
              <th className="px-6 py-3">Payment Information</th>
            </tr>
          </thead>
          <tbody>
            {dataOrders?.orders.map((order) => (
              <tr key={order._id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  <Link href={`/orders/${order._id}`} className="text-gray-700">
                    {' '}
                    {order._id}
                  </Link>
                </td>
                <td className="px-6 py-4">{order.address}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span>{order.cardHolder}</span>
                    <span className="text-gray-500">{order.cardNumber}</span>
                  </div>
                </td>
              </tr>
            ))}
            {dataOrders?.orders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
