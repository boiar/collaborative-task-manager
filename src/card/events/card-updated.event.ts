export class CardUpdatedEvent {
  constructor(
    public readonly cardId: number,
    public readonly updatedData: any,
    public readonly updatedBy: number,
    public readonly success: boolean,
  ) {}
}
