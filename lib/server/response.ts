/**
 * Response helpers that produce the BaseResponse / PaginatedResponse
 * envelope shape that api-client.ts already knows how to unwrap.
 *
 * BaseResponse:     { success, message?, data?, timestamp }
 * PaginatedResponse via baseResponse with a data object containing
 *   { <key>: items[], pagination: { page, limit, totalPages, totalItems, hasNext, hasPrev } }
 */

function timestamp(): string {
  return new Date().toISOString()
}

export function baseResponse(
  data: unknown,
  message?: string,
  status = 200
): Response {
  return Response.json(
    { success: true, data, message: message ?? null, timestamp: timestamp() },
    { status }
  )
}

export function paginatedResponse(
  key: string,
  items: unknown[],
  total: number,
  page: number,
  limit: number,
  status = 200
): Response {
  const totalPages = Math.ceil(total / limit)
  return Response.json(
    {
      success: true,
      data: {
        [key]: items,
        pagination: {
          page,
          limit,
          totalPages,
          totalItems: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      timestamp: timestamp(),
    },
    { status }
  )
}

export function errorResponse(message: string, status: number): Response {
  return Response.json(
    { success: false, message, timestamp: timestamp() },
    { status }
  )
}
