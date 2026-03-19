import { FeaturedModel } from '../App';

const APPS_SCRIPT_URL = (import.meta as any).env?.VITE_APPS_SCRIPT_URL || '';

export interface CarModel {
  ModelID: string;
  ModelName: string;
  Type: string;
  ChassisCode: string;
  ModelYear: string;
  Engine: string;
  Transmission: string;
  Price: string;
}

export const googleSheetService = {
  async getCarModels(): Promise<CarModel[]> {
    if (!APPS_SCRIPT_URL) {
      console.warn('VITE_APPS_SCRIPT_URL is not set. Using mock data.');
      return [];
    }
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getCarModels`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching car models:', error);
      return [];
    }
  },

  async submitSurvey(data: any): Promise<boolean> {
    if (!APPS_SCRIPT_URL) return false;
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitSurvey',
          data: data
        }),
      });
      return true;
    } catch (error) {
      console.error('Error submitting survey:', error);
      return false;
    }
  },

  async saveCarModel(data: any): Promise<boolean> {
    if (!APPS_SCRIPT_URL) return false;
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveCarModel',
          data: {
            ModelID: data.id?.toString() || '',
            ModelName: data.title || '',
            Type: data.carType || '',
            ChassisCode: data.chassisCode || '',
            ModelYear: data.modelYear || '',
            Engine: data.engine || '',
            Transmission: data.transmission || '',
            Price: data.price || '',
            Image: data.image || '',
            Description: data.description || ''
          }
        }),
      });
      return true;
    } catch (error) {
      console.error('Error saving car model:', error);
      return false;
    }
  },

  async deleteCarModel(id: number): Promise<boolean> {
    if (!APPS_SCRIPT_URL) return false;
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteCarModel',
          data: { ModelID: id.toString() }
        }),
      });
      return true;
    } catch (error) {
      console.error('Error deleting car model:', error);
      return false;
    }
  },

  async getInitialData(): Promise<any> {
    if (!APPS_SCRIPT_URL) return null;
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?action=getInitialData`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching initial data:', error);
      return null;
    }
  },

  async saveCustomers(customers: any[]): Promise<boolean> {
    if (!APPS_SCRIPT_URL) return false;
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveCustomers',
          data: customers
        }),
      });
      return true;
    } catch (error) {
      console.error('Error saving customers:', error);
      return false;
    }
  }
};
