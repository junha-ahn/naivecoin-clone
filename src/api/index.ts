import { Router } from 'express';
import common from './routes/common';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	common(app);

	return app
}