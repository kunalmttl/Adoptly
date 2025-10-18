// src/api/contactAPI.ts

import axiosInstance from './axiosInstance';

/**
 * Defines the data structure for sending a contact message.
 */
export interface ContactFormData {
  recipientId: string;
  subject: string;
  message: string;
}

/**
 * Sends a contact message from the logged-in user to another user.
 * @param data - The contact form data, including the recipient's ID.
 * @returns A promise that resolves with the server's confirmation message.
 */
export const sendMessage = async (data: ContactFormData): Promise<{ message: string }> => {
  const response = await axiosInstance.post('/contact', data);
  return response.data;
};