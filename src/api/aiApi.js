import axiosInstance from './axiosConfig';

export const aiApi = {
  // Remove Background
  removeBackground: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await axiosInstance.post('/ai/remove-background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Text-to-Image
  textToImage: async (prompt, options = {}) => {
    const response = await axiosInstance.post('/ai/text-to-image', {
      prompt,
      ...options,
    });
    return response.data;
  },

  // Image-to-Image
  imageToImage: async (imageFile, prompt, options = {}) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('prompt', prompt);
    
    if (options.size) {
      formData.append('size', options.size);
    }

    const response = await axiosInstance.post('/ai/image-to-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Generate Etsy Tags
  generateEtsyTags: async (productInfo) => {
    const response = await axiosInstance.post('/ai/generate-etsy-tags', productInfo);
    return response.data;
  },

  // Generate Etsy Title
  generateEtsyTitle: async (productInfo) => {
    const response = await axiosInstance.post('/ai/generate-etsy-title', productInfo);
    return response.data;
  },

  // Generate Etsy Description
  generateEtsyDescription: async (productInfo) => {
    const response = await axiosInstance.post('/ai/generate-etsy-description', productInfo);
    return response.data;
  },

  // Generate Mockup
  generateMockup: async (designFile, productType, productColor, options = {}) => {
    const formData = new FormData();
    formData.append('design', designFile);
    formData.append('productType', productType);
    formData.append('productColor', productColor);
    
    if (options.size) {
      formData.append('size', options.size);
    }

    const response = await axiosInstance.post('/ai/generate-mockup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

