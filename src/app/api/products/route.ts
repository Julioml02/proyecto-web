import { getProducts, GetProductsResponse } from '@/lib/handlers'
import { NextRequest, NextResponse } from 'next/server'


//PRACTICA 2
//No hace falta autenticarse ni tener autorizacion porque esta informacion es publica

export async function GET(
  request: NextRequest
): Promise<NextResponse<GetProductsResponse>> {
  const products = await getProducts()

  return NextResponse.json(products)
}