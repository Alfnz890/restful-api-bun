import { serve } from "bun";
import app from "./src";

serve({
   fetch: app.fetch,
   port: 3000
})

console.log('Server running on port 3000')