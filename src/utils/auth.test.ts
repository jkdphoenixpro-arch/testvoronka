import { isAuthenticated, getUser, logout } from './auth';

// Мокируем localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('auth utils', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('isAuthenticated', () => {
    test('возвращает false если пользователь не авторизован', () => {
      expect(isAuthenticated()).toBe(false);
    });

    test('возвращает true если пользователь авторизован', () => {
      mockLocalStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@test.com' }));
      expect(isAuthenticated()).toBe(true);
    });

    test('возвращает false если localStorage содержит "undefined"', () => {
      mockLocalStorage.setItem('user', 'undefined');
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getUser', () => {
    test('возвращает null если пользователь не авторизован', () => {
      expect(getUser()).toBe(null);
    });

    test('возвращает объект пользователя если авторизован', () => {
      const user = { id: '1', email: 'test@test.com' };
      mockLocalStorage.setItem('user', JSON.stringify(user));
      expect(getUser()).toEqual(user);
    });
  });

  describe('logout', () => {
    test('удаляет данные пользователя', () => {
      mockLocalStorage.setItem('user', JSON.stringify({ id: '1' }));
      logout();
      expect(getUser()).toBe(null);
      expect(isAuthenticated()).toBe(false);
    });
  });
});