
"use client";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelectore";

import {
  type ProjectCreateFormData,
  type ProjectFormData,
  type ProjectFormInput,
  projectFormSchema,
} from "../_schema/project-schema";

import { zodResolver } from "@hookform/resolvers/zod";

import { useParams, useRouter } from "next/navigation";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useForm,
  useWatch,
  type FieldPath,
} from "react-hook-form";

import {
  createProject,
  fetchProject,
  updateProject,
} from "../_redux/project-thunk";

import { fetchLanguages } from "@/app/admin/languages/_redux/language-thunk";

// ==========================================
// GENERATE SLUG
// ==========================================
const generateSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// ==========================================
// API ERROR TYPE
// ==========================================
interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// ==========================================
// EXTRACT API ERROR
// ==========================================
const getApiError = (error: unknown): ApiError => {
  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  if (error && typeof error === "object") {
    const err = error as {
      message?: string;
      data?: {
        message?: string;
        errors?: Record<string, string>;
      };
      errors?: Record<string, string>;
      response?: {
        data?: {
          message?: string;
          errors?: Record<string, string>;
        };
      };
    };

    const responseData = err.response?.data ?? err.data;

    return {
      message:
        responseData?.message ??
        err.message ??
        "Something went wrong. Please try again.",

      errors:
        responseData?.errors ??
        err.errors,
    };
  }

  return {
    message: "Something went wrong. Please try again.",
  };
};

// ==========================================
// PROJECT FORM HOOK
// ==========================================
export const useProjectForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const params = useParams<{ id?: string }>();

  const id =
    typeof params.id === "string"
      ? params.id
      : undefined;

  const isEdit = Boolean(id);

  // ==========================================
  // PROJECT REDUX STATE
  // ==========================================
  const {
    currentProject,
    loading,
  } = useAppSelector((state) => state.projects);

  // ==========================================
  // LANGUAGE REDUX STATE
  // ==========================================
  const {
    data: languages,
    listLoading: languagesLoading,
  } = useAppSelector((state) => state.languages);

  // ==========================================
  // LOCAL STATE
  // ==========================================
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const slugManuallyEdited = useRef(false);

  const populatedProjectId = useRef<string | null>(
    null
  );

  const submittingRef = useRef(false);

  // ==========================================
  // FORM
  // ==========================================
  const form = useForm<
    ProjectFormInput,
    unknown,
    ProjectFormData
  >({
    resolver: zodResolver(projectFormSchema),

    defaultValues: {
      title: "",
      slug: "",
      description: "",
      link: "",
      order: 1,
      isActive: true,
      image: undefined,
      languageIds: [],
    },

    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const title = useWatch({
    control: form.control,
    name: "title",
  });

  // ==========================================
  // FETCH LANGUAGES
  // ==========================================
  useEffect(() => {
    dispatch(
      fetchLanguages({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  // ==========================================
  // FETCH PROJECT ONLY ON EDIT
  // ==========================================
  useEffect(() => {
    if (!id) {
      return;
    }

    populatedProjectId.current = null;

    dispatch(fetchProject(id));
  }, [dispatch, id]);

  // ==========================================
  // AUTO GENERATE SLUG
  // ==========================================
  useEffect(() => {
    if (isEdit || slugManuallyEdited.current) {
      return;
    }

    if (!title?.trim()) {
      form.setValue("slug", "", {
        shouldValidate: false,
        shouldDirty: false,
      });

      return;
    }

    form.setValue("slug", generateSlug(title), {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [title, isEdit, form]);

  // ==========================================
  // MANUAL SLUG CHANGE
  // ==========================================
  const handleSlugChange = useCallback(
    (value: string) => {
      slugManuallyEdited.current = true;

      form.setValue("slug", value, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form]
  );

  // ==========================================
  // POPULATE EDIT FORM
  // ==========================================
  useEffect(() => {
    if (
      !isEdit ||
      !id ||
      !currentProject ||
      currentProject.id !== id ||
      populatedProjectId.current === id
    ) {
      return;
    }

    form.reset({
      title: currentProject.title ?? "",
      slug: currentProject.slug ?? "",
      description: currentProject.description ?? "",
      link: currentProject.link ?? "",
      order: currentProject.order ?? 1,
      isActive: currentProject.isActive ?? true,
      image: undefined,

      languageIds:
        currentProject.languages?.map(
          (item) => item.languageId
        ) ?? [],
    });

    slugManuallyEdited.current = true;

    populatedProjectId.current = id;

    setImagePreview(currentProject.image ?? null);
  }, [currentProject, id, isEdit, form]);

  // ==========================================
  // REDIRECT AFTER SUCCESS
  // ==========================================
  const redirectToProjects = useCallback(() => {
    router.replace("/admin/projects");
  }, [router]);

  // ==========================================
  // SUBMIT
  // ==========================================
  const onSubmit = useCallback(
    async (data: ProjectFormData) => {
      if (submittingRef.current) {
        return;
      }

      submittingRef.current = true;
      setIsSubmitting(true);

      form.clearErrors();

      try {
        // ======================================
        // UPDATE PROJECT
        // ======================================
        if (isEdit && id) {
          await dispatch(
            updateProject({
              id,
              data: {
                title: data.title,
                slug: data.slug,
                description: data.description,
                link: data.link,
                order: data.order,
                isActive: data.isActive,
                languageIds: data.languageIds,

                image:
                  typeof File !== "undefined" &&
                  data.image instanceof File
                    ? data.image
                    : undefined,
              },
            })
          ).unwrap();

          // Redirect after successful update.
          redirectToProjects();

          return;
        }

        // ======================================
        // CREATE IMAGE VALIDATION
        // ======================================
        if (
          typeof File === "undefined" ||
          !(data.image instanceof File)
        ) {
          form.setError("image", {
            type: "required",
            message: "Project image is required.",
          });

          return;
        }

        // ======================================
        // CREATE PROJECT DATA
        // ======================================
        const createData: ProjectCreateFormData = {
          ...data,
          image: data.image,
          languageIds: data.languageIds ?? [],
        };

        // ======================================
        // CREATE PROJECT API
        // ======================================
        await dispatch(
          createProject(createData)
        ).unwrap();

        // ======================================
        // REDIRECT AFTER SUCCESSFUL CREATION
        // ======================================
        redirectToProjects();

        return;
      } catch (error) {
        console.error(
          "PROJECT SUBMISSION ERROR:",
          error
        );

        const apiError = getApiError(error);

        // ======================================
        // SERVER FIELD VALIDATION ERRORS
        // ======================================
        const allowedFields = [
          "title",
          "slug",
          "description",
          "link",
          "order",
          "isActive",
          "image",
          "languageIds",
        ];

        let hasFieldError = false;

        if (apiError.errors) {
          Object.entries(apiError.errors).forEach(
            ([field, message]) => {
              if (
                allowedFields.includes(field)
              ) {
                form.setError(
                  field as FieldPath<ProjectFormInput>,
                  {
                    type: "server",
                    message: String(message),
                  }
                );

                hasFieldError = true;
              }
            }
          );
        }

        // ======================================
        // GENERAL ERROR
        // ======================================
        if (!hasFieldError) {
          form.setError("root.serverError", {
            type: "server",
            message: apiError.message,
          });
        }
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [
      dispatch,
      id,
      isEdit,
      form,
      redirectToProjects,
    ]
  );

  // ==========================================
  // IMAGE CHANGE
  // ==========================================
  const handleImageChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement>,
      onChange: (file: File | undefined) => void
    ) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        form.setError("image", {
          type: "validate",
          message: "Please select a valid image.",
        });

        event.target.value = "";

        return;
      }

      onChange(file);

      form.clearErrors("image");

      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };

      reader.readAsDataURL(file);
    },
    [form]
  );

  // ==========================================
  // REMOVE IMAGE
  // ==========================================
  const removeImage = useCallback(
    (onChange: (value: undefined) => void) => {
      onChange(undefined);

      setImagePreview(null);

      form.clearErrors("image");
    },
    [form]
  );

  // ==========================================
  // RETURN
  // ==========================================
  return {
    form,

    loading,

    languages: languages ?? [],
    languagesLoading,

    isLoadingProject:
      isEdit &&
      (loading ||
        !currentProject ||
        currentProject.id !== id),

    isSubmitting,

    imagePreview,

    isEdit,

    onSubmit,

    handleImageChange,

    removeImage,

    handleSlugChange,
  };
};
