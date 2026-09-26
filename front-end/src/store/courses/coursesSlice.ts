import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Course, ApiError } from '../../types';
import apiClient from '../../lib/api/client';

interface CoursesState {
    items: Course[];
    currentCourse: Course | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: CoursesState = {
    items: [],
    currentCourse: null,
    isLoading: false,
    error: null,
};

export const fetchCourses = createAsyncThunk<Course[], { search?: string; teacherId?: number } | void, { rejectValue: ApiError }>(
    'courses/fetchCourses',
    async (args, { rejectWithValue }) => {
        try {
            const params: Record<string, any> = {};
            if (args?.search) params.search = args.search;
            if (args?.teacherId) params.teacherId = args.teacherId;
            const response = await apiClient.get<Course[]>('/courses', { params });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to fetch courses' });
        }
    }
);

export const fetchCourseById = createAsyncThunk<Course, number, { rejectValue: ApiError }>(
    'courses/fetchCourseById',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<Course>(`/courses/${courseId}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to fetch course' });
        }
    }
);

export const createCourse = createAsyncThunk<Course, { title: string; description: string }, { rejectValue: ApiError }>(
    'courses/createCourse',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<Course>('/courses', payload);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to create course' });
        }
    }
);

export const updateCourse = createAsyncThunk<Course, { id: number; title?: string; description?: string; price?: number; currency?: string }, { rejectValue: ApiError }>(
    'courses/updateCourse',
    async ({ id, ...payload }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<Course>(`/courses/${id}`, payload);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to update course' });
        }
    }
);

export const deleteCourse = createAsyncThunk<number, number, { rejectValue: ApiError }>(
    'courses/deleteCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/courses/${courseId}`);
            return courseId;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to delete course' });
        }
    }
);

export const publishCourse = createAsyncThunk<Course, number, { rejectValue: ApiError }>(
    'courses/publishCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<Course>(`/courses/${courseId}/publish`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to publish course' });
        }
    }
);

export const unpublishCourse = createAsyncThunk<Course, number, { rejectValue: ApiError }>(
    'courses/unpublishCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<Course>(`/courses/${courseId}/unpublish`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: 'Failed to unpublish course' });
        }
    }
);

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearCurrentCourse(state) { state.currentCourse = null; },
        clearError(state) { state.error = null; },
    },
    extraReducers: (builder) => {
        const setLoading = (s: CoursesState) => { s.isLoading = true; s.error = null; };
        const setError = (s: CoursesState, a: any) => { s.isLoading = false; s.error = a.payload?.error || 'Failed'; };
        const patchCurrent = (s: CoursesState, a: any) => {
            s.isLoading = false;
            s.currentCourse = a.payload;
            const i = s.items.findIndex((c) => c.id === a.payload.id);
            if (i !== -1) s.items[i] = a.payload;
        };

        builder
            .addCase(fetchCourses.pending, setLoading)
            .addCase(fetchCourses.fulfilled, (s, a) => { s.isLoading = false; s.items = a.payload; })
            .addCase(fetchCourses.rejected, setError)

            .addCase(fetchCourseById.pending, setLoading)
            .addCase(fetchCourseById.fulfilled, (s, a) => { s.isLoading = false; s.currentCourse = a.payload; })
            .addCase(fetchCourseById.rejected, setError)

            .addCase(createCourse.pending, setLoading)
            .addCase(createCourse.fulfilled, (s, a) => { s.isLoading = false; s.items.push(a.payload); })
            .addCase(createCourse.rejected, setError)

            .addCase(updateCourse.pending, setLoading)
            .addCase(updateCourse.fulfilled, patchCurrent)
            .addCase(updateCourse.rejected, setError)

            .addCase(deleteCourse.pending, setLoading)
            .addCase(deleteCourse.fulfilled, (s, a) => {
                s.isLoading = false;
                s.items = s.items.filter((c) => c.id !== a.payload);
                if (s.currentCourse?.id === a.payload) s.currentCourse = null;
            })
            .addCase(deleteCourse.rejected, setError)

            .addCase(publishCourse.pending, setLoading)
            .addCase(publishCourse.fulfilled, patchCurrent)
            .addCase(publishCourse.rejected, setError)

            .addCase(unpublishCourse.pending, setLoading)
            .addCase(unpublishCourse.fulfilled, patchCurrent)
            .addCase(unpublishCourse.rejected, setError);
    },
});

export const { clearCurrentCourse, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
