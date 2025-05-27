export class Pomodoro {
  constructor(
    public id: string,
    public sessionToday: number,
    public totalTime: number,
    public sequence: number,
    public userId: string,
  ) {}
}
