import axios from "axios";
import { TaskCardProps } from "@/components/taskCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL;

export interface TodoResponse {
  data: TaskCardProps[];
}

export async function fetchTodoTasks(): Promise<TodoResponse> {
  try {
    const response = await axios.get<TodoResponse>(`${BASE_URL}/get-new-todo`);
    console.log(response.data, "response");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch todo tasks");
  }
}

export async function fetchInProgressTasks(): Promise<TodoResponse> {
  try {
    const response = await axios.get<TodoResponse>(
      `${BASE_URL}/get-inprogress-todo`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch in-progress tasks");
  }
}

export async function fetchDoneTasks(): Promise<TodoResponse> {
  try {
    const response = await axios.get<TodoResponse>(`${BASE_URL}/get-done-todo`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch done tasks");
  }
}
