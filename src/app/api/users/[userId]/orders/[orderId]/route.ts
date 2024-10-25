import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponse, OrderItemResponse, userOrderItem } from '@/lib/handlers';
import { Types } from 'mongoose';

//PRACTICE 2
import { getSession } from '@/lib/auth'


export async function GET
(
  request: NextRequest,
  {
    params,
  }: 
  {
    params: { userId: string, orderId: string };
  }
): Promise<NextResponse<OrderItemResponse> | NextResponse<ErrorResponse>> 
{

  //PRACTICE 2 
  //Authentication
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json(
      {
        error: 'NOT_AUTHENTICATED',
        message: 'Authentication required.',
      },
      { status: 401 }
    )
  }
  //---------

  if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.orderId)) 
  {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID or order ID.',
      },
      { status: 400 }
    )
  }

  //PRACTICE 2
  //Authorization
  if (session.userId.toString() !== params.userId) {
    return NextResponse.json(
      {
        error: 'NOT_AUTHORIZED',
        message: 'Unauthorized access.',
      },
      { status: 403 }
    )
  }
  // ----------

  const order = await userOrderItem(params.userId, params.orderId);
  if (order === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Not found user ID or order ID.',
      },
      { status: 404 }
    )
  }

  return NextResponse.json(order);
}
  