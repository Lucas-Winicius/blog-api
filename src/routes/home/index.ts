import { app } from '../../server';
import get from './get';

export default async function HomeRoutes() {
    app.register(get)
}
