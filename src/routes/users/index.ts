import { app } from '../../server';
import post from './post';

export default async function UserRoutes() {
    app.register(post)
}
