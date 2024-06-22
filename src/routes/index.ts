import { app } from '../server';
import HomeRoutes from './home';

export default async function routes() {
    app.register(HomeRoutes)
}
