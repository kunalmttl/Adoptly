// # Contact API

import axiosInstance from './axiosInstance';

export interface ContactFormData {
  recipientId: string;
  subject: string;
  message: string;
}

/**
 * * Sends a contact message from the logged-in user to another user.
 * @param data - The contact form data.
 * @returns A promise that resolves with the server's response.
 */
export const sendMessage = async (data: ContactFormData) => {
  const response = await axiosInstance.post('/contact', data);
  return response.data;
};