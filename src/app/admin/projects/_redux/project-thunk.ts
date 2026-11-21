import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

import type {
  ProjectItem,
  ProjectListResponse,
  ProjectQueryParams,
  ProjectResponse,
} from "../_types/project";

import type {
  ProjectCreateFormData,
  ProjectUpdateInput,
} from "../_schema/project-schema";

// =====================================
// FORM DATA HELPER
// =====================================
const createFormData = (data: object) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (typeof File !== "undefined" && value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// =====================================
// ERROR HELPER
// =====================================
const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return (
      err.response?.data?.message ??
      err.message ??
      "Something went wrong"
    );
  }

  return err instanceof Error ? err.message : "Something went wrong";
};

// =====================================
// FETCH PROJECTS
// =====================================
export const fetchProjects = createAsyncThunk<
  ProjectListResponse,
  ProjectQueryParams | undefined,
  { rejectValue: string }
>("projects/fetchProjects", async (params, { rejectWithValue }) => {
  try {
    const res = await axios.get<ProjectListResponse>("/api/v1/admin/projects", {
      params,
    });

    return res.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// =====================================
// FETCH SINGLE PROJECT
// =====================================
export const fetchProject = createAsyncThunk<
  ProjectItem,
  string,
  { rejectValue: string }
>("projects/fetchProject", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get<ProjectResponse>(
      `/api/v1/admin/projects/${encodeURIComponent(id)}`,
    );

    return res.data.data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err));
  }
});

// =====================================
// CREATE PROJECT
// =====================================
export const createProject = createAsyncThunk<
  ProjectItem,
  ProjectCreateFormData,
  { rejectValue: string }
>("projects/createProject", async (data, { rejectWithValue }) => {
  try {
    const formData = createFormData(data);

    const res = await axios.post<ProjectResponse>("/api/v1/admin/projects", formData);

    toast.success(res.data.message || "Project created successfully");

    return res.data.data;
  } catch (err) {
    const message = getErrorMessage(err);
    toast.error(message);

    return rejectWithValue(message);
  }
});

// =====================================
// UPDATE PROJECT
// =====================================
export const updateProject = createAsyncThunk<
  ProjectItem,
  { id: string; data: ProjectUpdateInput & { image?: File } },
  { rejectValue: string }
>("projects/updateProject", async ({ id, data }, { rejectWithValue }) => {
  try {
    const formData = createFormData(data);

    const res = await axios.patch<ProjectResponse>(
      `/api/v1/admin/projects/${encodeURIComponent(id)}`,
      formData,
    );

    toast.success(res.data.message || "Project updated successfully");

    return res.data.data;
  } catch (err) {
    const message = getErrorMessage(err);
    toast.error(message);

    return rejectWithValue(message);
  }
});

// =====================================
// DELETE PROJECT
// =====================================
export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("projects/deleteProject", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.delete<ProjectResponse>(
      `/api/v1/admin/projects/${encodeURIComponent(id)}`,
    );

    toast.success(res.data.message || "Project deleted successfully");

    return id;
  } catch (err) {
    const message = getErrorMessage(err);
    toast.error(message);

    return rejectWithValue(message);
  }
});