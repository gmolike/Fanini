import { generateId } from "@faninitiative/shared";

export type EventStatus = "draft" | "published" | "cancelled";

export class Event {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly location: string,
    public readonly status: EventStatus,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(params: {
    title: string;
    description: string;
    date: Date;
    location: string;
    createdBy: string;
  }): Event {
    const now = new Date();
    return new Event(
      generateId(),
      params.title,
      params.description,
      params.date,
      params.location,
      "draft" as EventStatus,
      params.createdBy,
      now,
      now,
    );
  }

  canBeEditedBy(userId: string): boolean {
    return this.createdBy === userId || this.status === "draft";
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date.toISOString(),
      location: this.location,
      status: this.status,
      createdBy: this.createdBy,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
