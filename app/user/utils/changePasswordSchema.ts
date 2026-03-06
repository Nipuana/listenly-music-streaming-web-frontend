import z from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm new password must be at least 6 characters"),
  })
  .superRefine(({ currentPassword, newPassword, confirmNewPassword }, ctx) => {
    if (newPassword === currentPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "New password must be different from current password",
      });
    }

    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "Confirm new password must match new password",
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
