import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { formId } = params

    // Get the form from Salesforce
    const form = await prisma.salesforceForm.findUnique({
      where: {
        id: formId,
      },
      include: {
        fields: true,
      },
    })

    if (!form) {
      return new NextResponse('Form not found', { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching form:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
