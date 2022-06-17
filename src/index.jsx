import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

const App = lazy(() => import('./App'));

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<Suspense fallback={<div>Loading...</div>}>
		<App />
	</Suspense>,
);
