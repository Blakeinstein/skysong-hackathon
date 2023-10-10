'use server';

export type CourseData = {
  files: File[],
  links: string[],
  texts: string[],
}

export async function submitCourseMaterials(data: CourseData) {
  console.log("hello", JSON.stringify(data));
  return "ok";
}