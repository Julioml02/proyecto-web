import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import {ErrorResponse,getCarts, deleteCartItem, updateCartItem, UpdateCartResponse, DeleteCartResponse} from '@/lib/handlers';

//PRACTICE 2
import { getSession } from '@/lib/auth'


export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string; productId: string };
  }
): Promise<NextResponse<UpdateCartResponse> | {}> {

  const body = await request.json();


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
    return NextResponse.json({

      error: 'WRONG_PARAMS',
      message: 'Invalid user ID',

    }, { status: 400 });

  } else if (!Types.ObjectId.isValid(params.productId)) {
    return NextResponse.json({

      error: 'WRONG_PARAMS',
      message: 'Invalid product ID.',

    }, { status: 400 });

  } else if (body.qty <= 0) {
    return NextResponse.json({

      error: 'WRONG_PARAMS',
      message: 'Number of items not greater than 0',
      
    }, { status: 400 });
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
  
  const cartItems = await updateCartItem(
    params.userId,
    params.productId,
    body.qty
  );

  if(!cartItems){
    return NextResponse.json({
      error: 'NOT_FOUND',
      message: 'User or product not found.',
    }, { status: 404 });
  }
  const updatedCart = await getCarts(params.userId);
  if(cartItems?.created){
    return NextResponse.json(updatedCart,{status: 201});
  }; 

  return NextResponse.json(updatedCart);
}



//DELETE
export async function DELETE
(
  request: NextRequest,
  {
    params,
  }:
  {
    params: { userId: string, productId: string };
  }
): Promise<NextResponse<DeleteCartResponse> | NextResponse<ErrorResponse>> {


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

  if (!Types.ObjectId.isValid(params.userId) || !Types.ObjectId.isValid(params.productId)) 
  {
    return NextResponse.json({
      error: 'WRONG_PARAMS',
      message: 'Invalid user ID or product.',
    }, { status: 400 });
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
    
  const cartItems = await deleteCartItem(params.userId, params.productId);

  if (cartItems === null) 
  {
    return NextResponse.json({
      error: 'NOT_FOUND',
      message: 'User or product not found.',
    }, { status: 404 });
  }

  return NextResponse.json(cartItems, {status: 200});

}
