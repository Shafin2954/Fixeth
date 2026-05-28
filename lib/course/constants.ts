import type { Module } from "@/types/ui";

export const CORE_MODULES: Module[] = [
  {
    id: 1,
    title: "Python Fundamentals & Logic",
    lessons: [
      { id: 1, title: "1.1 Scopes & Scaffolding", done: true, dur: "12:34" },
      { id: 2, title: "1.2 Functions Syntax & def", done: true, dur: "18:02" },
      { id: 3, title: "1.3 Scopes and Scuttles Check", done: false, dur: "22:15", active: true },
      { id: 4, title: "1.4 Modular return Returns", done: false, dur: "15:40" }
    ]
  },
  {
    id: 2,
    title: "Data Operations Analytics",
    lessons: [
      { id: 5, title: "2.1 NumPy Dimension Scaling", done: false, dur: "20:10" },
      { id: 6, title: "2.2 Pandas DataFrame Cleansing", done: false, dur: "25:30" }
    ]
  }
];

export const DEFAULT_LESSON_ID = 3;
