
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Declare process to fix TS2580 error in Vite config (which runs in Node)
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load các biến môi trường từ file .env
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // CHỈ định nghĩa biến cụ thể này. 
      // Không định nghĩa 'process.env': {} vì nó sẽ làm mất giá trị API_KEY.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  };
});
