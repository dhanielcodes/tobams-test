import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { TaskCardProps } from "../components/taskCard";
import {
  fetchTodoTasks,
  fetchInProgressTasks,
  fetchDoneTasks,
} from "../services/api";

export type TaskStatus = "todo" | "inprogress" | "done";

export interface TaskState {
  todoTasks: TaskCardProps[];
  inProgressTasks: TaskCardProps[];
  doneTasks: TaskCardProps[];

  moveTask: (
    taskId: string,
    fromStatus: TaskStatus,
    toStatus: TaskStatus
  ) => void;
  addTask: (task: TaskCardProps, status: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<TaskCardProps>) => void;
  deleteTask: (taskId: string, status: TaskStatus) => void;

  getTasksByStatus: (status: TaskStatus) => TaskCardProps[];
  getTaskById: (taskId: string) => TaskCardProps | undefined;
  getTaskCount: (status: TaskStatus) => number;
  getAllTasks: () => TaskCardProps[];

  isLoading: {
    todo: boolean;
    inprogress: boolean;
    done: boolean;
  };

  fetchTodoTasks: () => Promise<void>;
  fetchInProgressTasks: () => Promise<void>;
  fetchDoneTasks: () => Promise<void>;
  fetchAllTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set, get) => ({
      todoTasks: [],
      inProgressTasks: [],
      doneTasks: [],

      isLoading: {
        todo: false,
        inprogress: false,
        done: false,
      },

      fetchTodoTasks: async () => {
        set((state) => ({ isLoading: { ...state.isLoading, todo: true } }));
        try {
          const response = await fetchTodoTasks();
          set({ todoTasks: response.data });
        } catch (error) {
          console.error("Failed to fetch todo tasks:", error);
        } finally {
          set((state) => ({ isLoading: { ...state.isLoading, todo: false } }));
        }
      },

      fetchInProgressTasks: async () => {
        set((state) => ({
          isLoading: { ...state.isLoading, inprogress: true },
        }));
        try {
          const response = await fetchInProgressTasks();
          set({ inProgressTasks: response.data });
        } catch (error) {
          console.error("Failed to fetch in-progress tasks:", error);
        } finally {
          set((state) => ({
            isLoading: { ...state.isLoading, inprogress: false },
          }));
        }
      },

      fetchDoneTasks: async () => {
        set((state) => ({ isLoading: { ...state.isLoading, done: true } }));
        try {
          const response = await fetchDoneTasks();
          set({ doneTasks: response.data });
        } catch (error) {
          console.error("Failed to fetch done tasks:", error);
        } finally {
          set((state) => ({ isLoading: { ...state.isLoading, done: false } }));
        }
      },

      fetchAllTasks: async () => {
        const { fetchTodoTasks, fetchInProgressTasks, fetchDoneTasks } = get();
        await Promise.all([
          fetchTodoTasks(),
          fetchInProgressTasks(),
          fetchDoneTasks(),
        ]);
      },

      moveTask: (
        taskId: string,
        fromStatus: TaskStatus,
        toStatus: TaskStatus
      ) => {
        if (fromStatus === toStatus) return;

        const state = get();
        const sourceArray = state.getTasksByStatus(fromStatus);
        const task = sourceArray.find((t) => t.id === taskId);

        if (!task) return;

        set((state) => {
          const newState = { ...state };

          switch (fromStatus) {
            case "todo":
              newState.todoTasks = state.todoTasks.filter(
                (t) => t.id !== taskId
              );
              break;
            case "inprogress":
              newState.inProgressTasks = state.inProgressTasks.filter(
                (t) => t.id !== taskId
              );
              break;
            case "done":
              newState.doneTasks = state.doneTasks.filter(
                (t) => t.id !== taskId
              );
              break;
          }

          switch (toStatus) {
            case "todo":
              newState.todoTasks = [...newState.todoTasks, task];
              break;
            case "inprogress":
              newState.inProgressTasks = [...newState.inProgressTasks, task];
              break;
            case "done":
              newState.doneTasks = [...newState.doneTasks, task];
              break;
          }

          return newState;
        });
      },

      addTask: (task: TaskCardProps, status: TaskStatus) => {
        set((state) => {
          switch (status) {
            case "todo":
              return { ...state, todoTasks: [...state.todoTasks, task] };
            case "inprogress":
              return {
                ...state,
                inProgressTasks: [...state.inProgressTasks, task],
              };
            case "done":
              return { ...state, doneTasks: [...state.doneTasks, task] };
            default:
              return state;
          }
        });
      },

      updateTask: (taskId: string, updates: Partial<TaskCardProps>) => {
        set((state) => ({
          ...state,
          todoTasks: state.todoTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
          inProgressTasks: state.inProgressTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
          doneTasks: state.doneTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (taskId: string, status: TaskStatus) => {
        set((state) => {
          switch (status) {
            case "todo":
              return {
                ...state,
                todoTasks: state.todoTasks.filter((t) => t.id !== taskId),
              };
            case "inprogress":
              return {
                ...state,
                inProgressTasks: state.inProgressTasks.filter(
                  (t) => t.id !== taskId
                ),
              };
            case "done":
              return {
                ...state,
                doneTasks: state.doneTasks.filter((t) => t.id !== taskId),
              };
            default:
              return state;
          }
        });
      },

      getTasksByStatus: (status: TaskStatus) => {
        const state = get();
        switch (status) {
          case "todo":
            return state.todoTasks;
          case "inprogress":
            return state.inProgressTasks;
          case "done":
            return state.doneTasks;
          default:
            return [];
        }
      },

      getTaskById: (taskId: string) => {
        const state = get();
        const allTasks = [
          ...state.todoTasks,
          ...state.inProgressTasks,
          ...state.doneTasks,
        ];
        return allTasks.find((task) => task.id === taskId);
      },

      getTaskCount: (status: TaskStatus) => {
        const state = get();
        return state.getTasksByStatus(status)?.length;
      },

      getAllTasks: () => {
        const state = get();
        return [
          ...state.todoTasks,
          ...state.inProgressTasks,
          ...state.doneTasks,
        ];
      },
    }),
    {
      name: "task-store",
    }
  )
);
