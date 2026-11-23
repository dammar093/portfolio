
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSetting } from "../_hooks/useSetting";
import { SettingFormSkeleton } from "./form-skeleton";

import {
  LoaderCircle,
  Save,
  Search,
  Upload,
  Building2,
  Share2,
  Code,
} from "lucide-react";

export default function SettingForm() {
  const router = useRouter();

  const {
    setting,
    loading,
    submitting,
    register,
    errors,
    logoFile,
    logoPreview,
    handleLogoChange,
    onSubmit,
    resetForm,
  } = useSetting();

  // =====================================
  // SEO REDIRECT
  // =====================================
  const handleSeoRedirect = () => {
    if (!setting?.id) {
      toast.error("Please save your settings before configuring SEO");
      return;
    }

    router.push(
      `/admin/site-settings/550e8400-e29b-41d4-a716-446655440000/seo`,
    );
  };

  // =====================================
  // LOADING SKELETON
  // =====================================
  if (loading && !setting) {
    return <SettingFormSkeleton />;
  }

  // =====================================
  // FORM FIELD
  // =====================================
  const inputClass =
    "h-11 rounded-lg";

  const labelClass =
    "mb-2 block text-sm font-medium";

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full space-y-6"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Website Settings
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your website information, logo and social links.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSeoRedirect}
            disabled={!setting?.id}
          >
            <Search className="mr-2 h-4 w-4" />
            Setting SEO
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {submitting ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* GENERAL INFORMATION */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>General Information</CardTitle>
          </div>
          <CardDescription>
            Basic information displayed throughout your website.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* LOGO */}
          <div className="space-y-2">
            <label className={labelClass}>Website Logo</label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border bg-muted">
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Website logo"
                    width={112}
                    height={112}
                    unoptimized
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="setting-logo"
                  className="inline-flex h-10 cursor-pointer items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </label>

                <input
                  id="setting-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />

                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP. Maximum file size: 5MB.
                </p>

                {logoFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {logoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Website Name *</label>
              <Input
                {...register("name")}
                placeholder="Enter website name"
                className={inputClass}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Email Address *</label>
              <Input
                type="email"
                {...register("email")}
                placeholder="example@email.com"
                className={inputClass}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <Input
                {...register("phone")}
                placeholder="+977 98XXXXXXXX"
                className={inputClass}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Address *</label>
              <Input
                {...register("address")}
                placeholder="Enter your address"
                className={inputClass}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass}>Website Description *</label>
            <Textarea
              {...register("description")}
              placeholder="Write your website description..."
              rows={5}
              className="resize-y rounded-lg"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SOCIAL LINKS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <CardTitle>Social Media Links</CardTitle>
          </div>
          <CardDescription>
            Add your social media profile URLs.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <Input
              {...register("linkedin_link")}
              placeholder="https://linkedin.com/in/username"
              className={inputClass}
            />
            {errors.linkedin_link && (
              <p className="mt-1 text-sm text-destructive">
                {errors.linkedin_link.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>GitHub</label>
            <Input
              {...register("github_link")}
              placeholder="https://github.com/username"
              className={inputClass}
            />
            {errors.github_link && (
              <p className="mt-1 text-sm text-destructive">
                {errors.github_link.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>YouTube</label>
            <Input
              {...register("youtube_link")}
              placeholder="https://youtube.com/@username"
              className={inputClass}
            />
            {errors.youtube_link && (
              <p className="mt-1 text-sm text-destructive">
                {errors.youtube_link.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Facebook</label>
            <Input
              {...register("facebook_link")}
              placeholder="https://facebook.com/username"
              className={inputClass}
            />
            {errors.facebook_link && (
              <p className="mt-1 text-sm text-destructive">
                {errors.facebook_link.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Instagram</label>
            <Input
              {...register("instagram_link")}
              placeholder="https://instagram.com/username"
              className={inputClass}
            />
            {errors.instagram_link && (
              <p className="mt-1 text-sm text-destructive">
                {errors.instagram_link.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* TRACKING */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <CardTitle>Tracking & Analytics</CardTitle>
          </div>
          <CardDescription>
            Configure your Google Analytics or Google Tag Manager code.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <label className={labelClass}>
            Google Tracking Tag
          </label>

          <Textarea
            {...register("g_tag")}
            placeholder="Enter your Google Analytics or Tag Manager ID"
            rows={4}
            className="resize-y rounded-lg font-mono text-sm"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Example: G-XXXXXXXXXX or GTM-XXXXXXX
          </p>
        </CardContent>
      </Card>

      {/* BOTTOM ACTIONS */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
        >
          Reset
        </Button>

        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {submitting ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
