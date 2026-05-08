import { defineUserSignupFields } from "wasp/server/auth";

export const userSignupFields = defineUserSignupFields({
  email: (data: any) => {
    if (typeof data.email !== "string") {
      throw new Error("Email is required.");
    }
    return data.email;
  },
});
