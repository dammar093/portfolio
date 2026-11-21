import type {
  SettingFormData,
} from "../_schema/setting-schema";

export interface SettingItem extends SettingFormData {
  id: string;
  logo: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SettingResponse {
  success: boolean;
  message: string;
  data: SettingItem | null;
}

export interface SettingState {
  data: SettingItem | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}