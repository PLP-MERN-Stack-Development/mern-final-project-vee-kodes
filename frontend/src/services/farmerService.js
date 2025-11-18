import api from './api';

export const getAllFarmers = async () => {
  try {
    const { data } = await api.get('/api/farmers');
    return data;
  } catch (error) {
    console.error('Failed to get farmers', error);
    throw error;
  }
};

export const getFarmerDetails = async (id) => {
    try {
      const { data } = await api.get(`/api/farmers/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to get farmer details', error);
      throw error;
    }
  };

export const registerFarmer = async (farmerData) => {
    try {
        const { data } = await api.post('/api/farmers', farmerData);
        return data;
    } catch (error) {
        console.error('Failed to register farmer', error);
        throw error;
    }
};

export const addFarmActivity = async (activityData) => {
    try {
        const { data } = await api.post('/api/activities', activityData);
        return data;
    } catch (error) {
        console.error('Failed to add activity', error);
        throw error;
    }
};

export const recordCollection = async (collectionData) => {
    try {
        const { data } = await api.post('/api/collections', collectionData);
        return data;
    } catch (error) {
        console.error('Failed to record collection', error);
        throw error;
    }
};