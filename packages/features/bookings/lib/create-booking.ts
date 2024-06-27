import { post } from "@calcom/lib/fetch-wrapper";

import type { BookingCreateBody, BookingResponse } from "../types";

export const createBooking = async (data: BookingCreateBody) => {
  console.log("Creating booking", data);
  const response = await post<BookingCreateBody, BookingResponse>("/api/book/event", data);
  return response;
};
