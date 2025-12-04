import axios from 'axios';
import { apiConfig } from '../config/api';

export interface Attachment {
  id: string;
  ownerTable: string;
  ownerId: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
  sizeBytes: number;
  createdById: string;
  createdAt: string;
}

export interface UploadAttachmentDto {
  file: File;
  ownerTable: string;
  ownerId: number;
}

export const attachmentsService = {
  async upload(data: UploadAttachmentDto): Promise<Attachment> {
    console.log('📎 ATTACHMENTS - Uploading file:', data.file.name);
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('ownerTable', data.ownerTable);
      formData.append('ownerId', String(data.ownerId));

      const token = localStorage.getItem('token');
      const response = await axios.post<Attachment>(
        `${apiConfig.baseURL}/attachments/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('✅ ATTACHMENTS - Uploaded:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ ATTACHMENTS - Error uploading:', error);
      throw error;
    }
  },

  async download(id: number): Promise<Blob> {
    console.log('⬇️ ATTACHMENTS - Downloading file:', id);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiConfig.baseURL}/attachments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      console.log('✅ ATTACHMENTS - Downloaded');
      return response.data;
    } catch (error) {
      console.error('❌ ATTACHMENTS - Error downloading:', error);
      throw error;
    }
  },

  // Helper to trigger download in browser
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
