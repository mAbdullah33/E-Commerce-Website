import api from './axios';

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const getHotSaleProducts = async () => {
  const response = await api.get('/products/hot-sale');
  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/slug/${slug}`);
  return response.data;
};

export const createProduct = async (productData) => {
  // Use FormData for image upload
  const response = await api.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const deleteProductImage = async (id, publicId) => {
  const response = await api.delete(`/products/${id}/image/${publicId}`);
  return response.data;
};
