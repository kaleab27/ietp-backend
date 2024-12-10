export type User = {
    user_id: string; // UUID
    name: string;
    email: string;
    password: string;
  };
  export type LogedInUser ={
    user_id: string; // UUID
    name: string;
    email: string;
    password: string;
  }
  
  export type Device = {
    device_id: string; // UUID
    name: string;
    layer: number; // non-negative
    unit: string;
    status: 'active' | 'inactive';
    type: 'motor' | 'sensor';
    critical_high?: number; // Only for sensors
    critical_low?: number;  // Only for sensors
    user_id: string; // Foreign key to User
  };
  
  export type Data = {
    data_id: string; // UUID
    device_id: string; // Foreign key to Device
    value: number;
    timestamp: Date;
  };
  