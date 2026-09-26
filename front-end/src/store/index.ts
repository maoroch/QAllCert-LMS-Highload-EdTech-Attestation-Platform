export * from './store';

// Re-export everything from authSlice except clearError (renamed to avoid collision)
export {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
  clearAuth,
  clearError as clearAuthError,
} from './auth/authSlice';
export { default as authReducer } from './auth/authSlice';

// Re-export everything from coursesSlice except clearError (renamed to avoid collision)
export {
  fetchCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  clearCurrentCourse,
  clearError as clearCoursesError,
} from './courses/coursesSlice';
export { default as coursesReducer } from './courses/coursesSlice';
