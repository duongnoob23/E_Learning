// Định nghĩa query keys để tránh duplicate và dễ maintain
export const queryKeys = {
  // Auth keys
  auth: {
    all: ["auth"],
    user: () => [...queryKeys.auth.all, "user"],
    verifyEmail: (email) => [...queryKeys.auth.all, "verifyEmail", email],
    forgotPassword: (email) => [...queryKeys.auth.all, "forgotPassword", email],
  },

  // Course keys
  course: {
    all: ["course"],
    lists: () => [...queryKeys.course.all, "list"],
    list: (filters) => [...queryKeys.course.lists(), { filters }],
    details: () => [...queryKeys.course.all, "detail"],
    detail: (id) => [...queryKeys.course.details(), id],
    categories: () => [...queryKeys.course.all, "categories"],
    instructors: () => [...queryKeys.course.all, "instructors"],
  },

  // User keys
  user: {
    all: ["user"],
    profile: () => [...queryKeys.user.all, "profile"],
    enrollments: () => [...queryKeys.user.all, "enrollments"],
    wishlist: () => [...queryKeys.user.all, "wishlist"],
  },
};
