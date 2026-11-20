"use client";
import { GetAllMatchesResponse } from "../../../types/matches/responses";
import sliceCreator from "..";
import { MATCHES } from "@/constants";
import { GetAllMatchesPayload } from "@/types/matches/payloads";

const getAllMatchesSlice = sliceCreator<GetAllMatchesPayload, GetAllMatchesResponse>(
  "getAllMatchesAction",
  MATCHES,
  "get"
);

const {
  reducer: getAllMatchesReducer,
  asyncAction: getAllMatchesAction,
  clearData: clearGetAllMatchesAction,
} = getAllMatchesSlice;
export { getAllMatchesAction, clearGetAllMatchesAction };
export default getAllMatchesReducer;