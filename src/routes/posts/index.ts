import { app } from '../../server';
import post from './post';

export default async function PostRoutes() {
    app.register(post)
}
