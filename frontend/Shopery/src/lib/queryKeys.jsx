// queryKeys.ts
export const queryKeys = {
  // Auth keys
  auth: {
    user: () => ["auth", "user"],
    login: (credentials) => ["auth", "login", credentials],
    register: (userData) => ["auth", "register", userData],
    verifyEmail: (email, otp) => ["auth", "verifyEmail", email, otp],
    forgotPassword: (email) => ["auth", "forgotPassword", email],
    resetPassword: (email, newPassword) => [
      "auth",
      "resetPassword",
      email,
      newPassword,
    ],
    refreshToken: (refreshToken) => ["auth", "refreshToken", refreshToken],
    logout: () => ["auth", "logout"],
  },

  // Course keys
  course: {
    all: ["course"],
    lists: ["course", "list"],
    list: (filters) => ["course", "list", { filters }],
    details: ["course", "detail"],
    detail: (id) => ["course", "detail", id],
    categories: ["course", "categories"],
    instructors: ["course", "instructors"],
    levels: ["course", "levels"],
  },

  // User keys
  user: {
    all: ["user"],
    profile: ["user", "profile"],
    enrollments: ["user", "enrollments"],
    wishlist: ["user", "wishlist"],
  },
};
