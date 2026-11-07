"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Editor as TinymceReact } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";

// const defaultPlugins = [
//   "anchor autolink charmap codesample emoticons image",
//   "link lists media searchreplace table visualblocks wordcount",
// ];
import { FieldError } from "react-hook-form";

export interface IRichTxtProp {
  value: string;
  name: string;
  onChange?: (e: any, value: any) => void;
  onBlur?: any;
  disabled?: boolean;
  setValue: any;
  error?: FieldError;
  imageUpload?: boolean;
  marginTop?: string;
  marginBottom?: string;
  label?: string;
  required?: boolean;
  resError?: string;
  onFocus?: () => void;
}

export interface ITextEditor {
  value?: string;
  onChange?: Function;
  plugins?: string;
  menubar?: string;
  toolbar?: string;
  options?: {};
}

const defaultPlugins = [
  "anchor",
  "autolink",
  "charmap",
  "codesample",
  "emoticons",
  "image",
  "link",
  "lists",
  "media",
  "searchreplace",
  "table",
  "visualblocks",
  "wordcount",
];

const defaultMenubar = "file edit view insert format tools table";

const defaultToolbar =
  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | " +
  "link image media table | align lineheight | checklist numlist bullist indent outdent | " +
  "emoticons charmap | removeformat";

export const BaseTextEditor = (props: ITextEditor) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const {
    value,
    onChange,
    plugins,
    menubar,
    toolbar,
    options = {},
    ...rest
  } = props;

  return (
    <TinymceReact
      key={isDark ? "dark" : "light"}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      value={value}
      licenseKey="gpl"
      init={{
        base_url: "/tinymce",
        suffix: ".min",
        promotion: false,
        skin: isDark ? "oxide-dark" : "oxide",
        skin_url: `/tinymce/skins/ui/${isDark ? "oxide-dark" : "oxide"}`,
        content_css: `/tinymce/skins/content/${isDark ? "dark" : "default"}/content.min.css`,

        plugins: plugins ?? defaultPlugins,
        menubar: menubar ?? defaultMenubar,
        toolbar: toolbar ?? defaultToolbar,

        ...options,
      }}
      onEditorChange={(content) => onChange?.(content)}
      {...rest}
    />
  );
};

interface TextEditorProps<T extends FieldValues> extends Omit<
  ITextEditor,
  "value" | "onChange"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  xs?: number;
  rules?: any;
}

export const TextEditor = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  xs = 12,
  rules,
  ...editorProps
}: TextEditorProps<T>) => {
  return (
    <div className={`col-xs-${xs}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label || name} is required` : false,
          ...rules,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <BaseTextEditor
              value={value ?? ""}
              onChange={onChange}
              {...editorProps}
            />
          </>
        )}
      />
    </div>
  );
};
