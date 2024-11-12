import { Types } from 'mongoose';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getOrder } from '@/lib/handlers';
import Link from 'next/link';

export default async function Order({ params }: { params: { orderId: string } }) {
  const session = await getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  if (!Types.ObjectId.isValid(params.orderId)) {
    notFound();
  }

  const order = await getOrder(params.orderId);

  if (!order || order.userId.toString() !== session.userId.toString()) {
    notFound();
  }

  const calculateTotalPrice = () => {
    return order.orderItems.reduce(
      (total, item) => total + item.qty * item.price,
      0
    );
  };

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Order Details
      </h3>

      {/* Información de la orden */}
      <div className='bg-gray-100 p-4 rounded-lg mb-6'>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Shipping address:</strong> {order.address}</p>
        <p><strong>Payment information:</strong> {order.cardNumber} ({order.cardHolder})</p>
        <p><strong>Date of purchase:</strong> {new Date(order.date).toLocaleString()}</p>
      </div>

      {/* Tabla de productos en la orden */}
      <div className='relative overflow-x-auto'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs uppercase text-gray-700 bg-gray-200'>
            <tr>
              <th scope='col' className='px-4 py-2'>Product Name</th>
              <th scope='col' className='px-4 py-2'>Quantity</th>
              <th scope='col' className='px-4 py-2'>Price</th>
              <th scope='col' className='px-4 py-2'>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map((item) => (
              <tr key={item.product._id.toString()} className='border-b'>
                <td className='px-4 py-2'>
                  <Link href={`/products/${item.product._id}`}>
                    {item.product.name}
                  </Link>
                </td>
                <td className='px-4 py-2'>{item.qty}</td>
                <td className='px-4 py-2'>
                  {item.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </td>
                <td className='px-4 py-2'>
                  {(item.qty * item.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className='px-4 py-2 text-right font-semibold'>Total</td>
              <td className='px-4 py-2 font-bold'>
                {calculateTotalPrice().toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
