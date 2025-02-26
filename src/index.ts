import { Hono } from 'hono'
import UserRoute from './routes/user.route'

const app = new Hono()

app.get('/', (c) => {
   return c.text('Hello Hono!')
})

app.route("/api", UserRoute)
export default app
