import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ADMIN' | 'SELLER';
export type UserStatus = 'PENDING' | 'APPROVED' | 'BLOCKED';

export interface User {
  id: string;
  fullName: string;
  businessName?: string;
  address: string;
  email: string;
  password?: string;
  country: string;
  city: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  trialStartDate: string;
  hasValidCard: boolean;
  subscriptionActive: boolean;
  isLocked: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  image: string;
  syncedToFacebook: boolean;
  stock: number;
  sales: number;
}

export interface Order {
  id: string;
  sellerId: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'PAID' | 'SHIPPED' | 'DELIVERED';
  date: string;
}

interface AppContextType {
  user: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role' | 'status' | 'trialStartDate' | 'subscriptionActive' | 'isLocked'>) => Promise<void>;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  toggleUserLock: (userId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'sales'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  getSellerStats: (sellerId: string) => { revenue: number; visits: number; salesCount: number };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@smark.business';
const ADMIN_PASS = 'admin123';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smark_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('smark_users');
    if (saved) return JSON.parse(saved);
    
    // Initial Admin
    const initialAdmin: User = {
      id: 'admin-1',
      fullName: 'Smark Admin',
      email: ADMIN_EMAIL,
      address: 'HQ',
      country: 'Global',
      city: 'Digital',
      phone: '0000',
      role: 'ADMIN',
      status: 'APPROVED',
      trialStartDate: new Date().toISOString(),
      hasValidCard: true,
      subscriptionActive: true,
      isLocked: false,
    };
    return [initialAdmin];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('smark_products');
    return saved ? JSON.parse(saved) : [
      {
        id: 'p1',
        sellerId: 'demo-seller',
        name: 'Smart Watch Pro',
        price: 199,
        image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/product-1-8d79b429-1780053067496.webp',
        syncedToFacebook: true,
        stock: 50,
        sales: 12
      },
      {
        id: 'p2',
        sellerId: 'demo-seller',
        name: 'Wireless Headphones',
        price: 299,
        image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/product-2-f8dd43b4-1780053066830.webp',
        syncedToFacebook: false,
        stock: 30,
        sales: 8
      }
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('smark_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'o1',
        sellerId: 'demo-seller',
        customerName: 'Jean Dupont',
        productName: 'Smart Watch Pro',
        amount: 199,
        status: 'DELIVERED',
        date: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('smark_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('smark_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('smark_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('smark_current_user', JSON.stringify(user));
  }, [user]);

  const login = async (email: string, pass: string) => {
    if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const admin = users.find(u => u.role === 'ADMIN');
      if (admin) {
        setUser(admin);
        return true;
      }
    }

    const found = users.find(u => u.email === email && u.password === pass);
    if (found) {
      if (found.status === 'PENDING') {
        throw new Error('Votre compte est en attente de validation.');
      }
      if (found.isLocked) {
        throw new Error('Votre compte est bloqué. Veuillez contacter le support.');
      }
      setUser(found);
      return true;
    }
    return false;
  };

  const register = async (userData: any) => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`,
      role: 'SELLER',
      status: 'PENDING',
      trialStartDate: new Date().toISOString(),
      subscriptionActive: true,
      isLocked: false,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const logout = () => setUser(null);

  const updateUserStatus = (userId: string, status: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const toggleUserLock = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isLocked: !u.isLocked } : u));
  };

  const addProduct = (p: any) => {
    if (!user) return;
    const newProduct: Product = {
      ...p,
      id: `p-${Date.now()}`,
      sellerId: user.id,
      sales: 0
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getSellerStats = (sellerId: string) => {
    const sellerProducts = products.filter(p => p.sellerId === sellerId);
    const sellerOrders = orders.filter(o => o.sellerId === sellerId);
    const revenue = sellerOrders.reduce((sum, o) => sum + o.amount, 0);
    return {
      revenue,
      visits: sellerProducts.length * 15, // Mock data
      salesCount: sellerOrders.length
    };
  };

  return (
    <AppContext.Provider value={{ 
      user, users, products, orders, 
      login, logout, register, updateUserStatus, toggleUserLock,
      addProduct, updateProduct, deleteProduct, getSellerStats
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};