import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getOrder, GetOrderResponse, CreateOrderResponse, createOrder } from '@/lib/handlers'


//PRACTICE 2
import { getSession } from '@/lib/auth'


//GET
export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string }
  }
): Promise<NextResponse<GetOrderResponse> | NextResponse<ErrorResponse>> {
  
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
  
  if (!Types.ObjectId.isValid(params.userId)) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
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

  const user = await getOrder(params.userId)

  if (user === null) {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'User not found.',
      },
      { status: 404 }
    )
  }

  return NextResponse.json(user)
}


//POST

export async function POST
(
  request: NextRequest,
  {
    params,
  }: 
  {
    params: { userId: string };
  }
): Promise<NextResponse<CreateOrderResponse> | {}> 
{

  let body;

  try
  {
    body = await request.json();
  }
  catch (SyntaxError)
  {
    return NextResponse.json(
      {

      }, 
      { status: 400 });
  }


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
  
  if (!body.address || !body.cardHolder || !body.cardNumber) {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Request parameters are wrong or missing.',
      }, 
      { status: 400 });
  }

  if (!Types.ObjectId.isValid(params.userId)) 
  {
    return NextResponse.json(
      {
        error: 'WRONG_PARAMS',
        message: 'Invalid user ID.',
      }, 
      { status: 400 });
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

  const orderId = await createOrder(params.userId, body);
  if (orderId === null) 
  {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Order not found.',
      },
      { status: 404 });
  }
  else if (orderId === undefined)
  {
    return NextResponse.json(
      {
        error: 'NOT_FOUND',
        message: 'Order not found.',
      }, 
      { status: 404 });
  }
  
  const headers = new Headers();
  headers.append('Location', `/api/users/${orderId._id}`);
  return NextResponse.json({ _id: orderId._id }, { status: 201, headers: headers });
}