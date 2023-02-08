import tracer from 'dd-trace';
import { ENV } from './ENV';
tracer.init({
	logInjection: true,
	analytics: true,
	runtimeMetrics: true,
	version: ENV.API_VERSION,
	service: ENV.API_TITLE,
	env: ENV.env,
}); // initialized in a different file to avoid hoisting.
export default tracer;
