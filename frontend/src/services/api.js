import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDocument = async (file, mainQuery = '') => {
  const formData = new FormData();
  formData.append('file', file);
  if (mainQuery) {
    formData.append('main_query', mainQuery);
  }

  const response = await api.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const generateQueries = async (documentId, mainQuery = '') => {
  const response = await api.post(`/documents/${documentId}/generate-queries`, {
    main_query: mainQuery || '',
  });

  return response.data;
};

export const analyzeDocument = async (documentId, selectedQueryIds, customQueries, llmProvider = 'groq') => {
  const response = await api.post(`/documents/${documentId}/analyze`, {
    selected_query_ids: selectedQueryIds,
    custom_queries: customQueries,
    llm_provider: llmProvider,
  });

  return response.data;
};

export default api;
