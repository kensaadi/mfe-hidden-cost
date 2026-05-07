import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/mfe-hidden-cost/",
  plugins: [react()],
});
