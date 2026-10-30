import apiConnector from "./api.service";

export interface LoginRequest {
  username?: string;
  password?: string;
}

const authService = {
  login: async (loginRequest: LoginRequest): Promise<any> => {
      const response: any = await apiConnector.post('/auth/login', loginRequest);
      if(response && response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);

        // localStorage.setItem('refreshToken', response.refreshToken); // Si el backend lo devuelve, habilitar
        localStorage.setItem('userData', JSON.stringify(response.user));
      }

      return response;
  },
  register: async (registerData: any): Promise<any> => {
      const response: any = await apiConnector.post('/auth/register', registerData);
      if(response && response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
      
return response;
  },
  me: async (): Promise<any> => {
      const response: any = await apiConnector.get('/auth/me');
      
      // Normalizar el rol para que siempre sea un string (el slug) igual que en el login
      if (response && response.role && typeof response.role === 'object') {
        response.role = response.role.slug;
      }
      
      return response;
  },
  logout: async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('role');

    return true;
  }
}
export default authService;
