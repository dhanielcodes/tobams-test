import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { TaskCardProps } from "../components/task-card";

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
}

const initialTodoTasks: TaskCardProps[] = [
  {
    id: "task-1",
    title: "Design new ui presentation",
    description: "Dribbble marketing",
    progress: 70,
    progressText: "7/10",
    date: "24 Aug 2022",
    comments: 7,
    attachments: 2,
    avatars: [],
    color: "orange",
  },
  {
    id: "task-2",
    title: "Add more ui/ux mockups",
    description: "Pinterest promotion",
    progress: 40,
    progressText: "4/10",
    date: "25 Aug 2022",
    comments: 0,
    attachments: 2,
    avatars: ["/placeholder.svg", "/placeholder.svg"],
    color: "orange",
  },
  {
    id: "task-3",
    title: "Design few mobile screens",
    description: "Dropbox mobile app",
    progress: 30,
    progressText: "3/10",
    date: "26 Aug 2022",
    comments: 6,
    attachments: 4,
    avatars: [],
    color: "red",
  },
  {
    id: "task-4",
    title: "Create a tweet and promote",
    description: "Twitter marketing",
    progress: 14,
    progressText: "2/14",
    date: "27 Aug 2022",
    comments: 0,
    attachments: 2,
    avatars: ["/placeholder.svg", "/placeholder.svg"],
    color: "red",
  },
];

const initialInProgressTasks: TaskCardProps[] = [
  {
    id: "task-5",
    title: "Design system update",
    description: "Oreo website project",
    progress: 30,
    progressText: "3/10",
    date: "12 Nov 2022",
    comments: 0,
    attachments: 2,
    avatars: ["/placeholder.svg", "/placeholder.svg"],
    color: "orange",
  },
  {
    id: "task-6",
    title: "Create brand guideline",
    description: "Oreo branding project",
    progress: 70,
    progressText: "7/10",
    date: "13 Nov 2022",
    comments: 2,
    attachments: 13,
    avatars: [],
    color: "orange",
  },
  {
    id: "task-7",
    title: "Create wireframe for ios app",
    description: "Oreo ios app project",
    progress: 40,
    progressText: "4/10",
    date: "14 Nov 2022",
    comments: 0,
    attachments: 2,
    avatars: ["/placeholder.svg", "/placeholder.svg"],
    color: "red",
  },
  {
    id: "task-8",
    title: "Create ui kit for layout",
    description: "Crypto mobile app",
    progress: 30,
    progressText: "3/10",
    date: "15 Nov 2022",
    comments: 23,
    attachments: 12,
    avatars: [],
    color: "red",
  },
];

const initialDoneTasks: TaskCardProps[] = [
  {
    id: "task-9",
    title: "Add product to the market",
    description: "UI8 marketplace",
    progress: 100,
    progressText: "10/10",
    date: "6 Jan 2022",
    comments: 1,
    attachments: 5,
    avatars: [],
    color: "green",
  },
  {
    id: "task-10",
    title: "Launch product promotion",
    description: "Kickstarter campaign",
    progress: 100,
    progressText: "10/10",
    date: "7 Jan 2022",
    comments: 17,
    attachments: 3,
    avatars: [],
    color: "green",
  },
  {
    id: "task-11",
    title: "Make twitter banner",
    description: "Twitter marketing",
    progress: 100,
    progressText: "10/10",
    date: "8 Jan 2022",
    comments: 0,
    attachments: 2,
    avatars: ["/placeholder.svg", "/placeholder.svg"],
    color: "green",
  },
];

export const useTaskStore = create<TaskState>()(
  devtools(
    (set, get) => ({
      todoTasks: initialTodoTasks,
      inProgressTasks: initialInProgressTasks,
      doneTasks: initialDoneTasks,

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
        return state.getTasksByStatus(status).length;
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
