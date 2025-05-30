export interface CreateRoutineDTO {
  userId: string;
  title: string;
  description?: string;
  weekDay: number;
  time?: string;
  category?: string;
}

export interface FindAllRoutinesByUserDTO {
  userId: string;
}