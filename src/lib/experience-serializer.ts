
type ExperienceDateFields = {
  joinDate: Date;
  leaveDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeExperience<T extends ExperienceDateFields>(
  experience: T
) {
  return {
    ...experience,
    joinDate: experience.joinDate.toISOString(),
    leaveDate: experience.leaveDate
      ? experience.leaveDate.toISOString()
      : null,
    createdAt: experience.createdAt.toISOString(),
    updatedAt: experience.updatedAt.toISOString(),
  };
}
