import { app } from '../../server';
import login from './post';

export default async function LoginRoutes() {
    app.register(login)
}
