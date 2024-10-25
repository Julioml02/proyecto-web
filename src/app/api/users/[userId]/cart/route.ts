import { Types } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, getCarts, GetCartResponse } from '@/lib/handlers'

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
): Promise<NextResponse<GetCartResponse> | NextResponse<ErrorResponse>> {
  
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

  const user = await getCarts(params.userId)

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