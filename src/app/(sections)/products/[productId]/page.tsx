import { Types } from 'mongoose';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/handlers';

export default async function Product({ params }: { params: { productId: string } }) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound();
  }

  const product = await getProduct(params.productId);
  if (product === null) {
    notFound();
  }

  return (
    <div className='flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8'>

      <div className='w-full lg:w-1/2'>
        <img src={product.img} alt={product.name} className='object-cover w-full h-auto rounded-lg shadow-lg' />
      </div>

      <div className='w-full lg:w-1/2 mt-6 lg:mt-0'>
        <h3 className='text-4xl font-bold text-gray-900'>{product.name}</h3>
        <p className='text-2xl text-gray-700 my-4'>
          {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </p>

        {product.description && (
          <div className='mt-4'>
            <h4 className='text-lg font-semibold text-gray-800'>Product details</h4>
            <p className='text-gray-600 mt-2'>{product.description}</p>
          </div>
        )}

        <div className='mt-6 flex items-center space-x-4'>
          <button
            className='px-4 py-2 bg-gray-300 text-gray-700 rounded focus:outline-none cursor-pointer'
          >
            -
          </button>
          <span className='text-xl'>1</span>
          <button
            className='px-4 py-2 bg-gray-300 text-gray-700 rounded focus:outline-none cursor-pointer'
          >
            +
          </button>
        </div>

        <button
          className='mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer'
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
