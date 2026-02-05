
import { Suspense } from 'react';

import App from '../../App';

export default function GeneratePage() {
    return (
        <Suspense fallback={null}>
            <App />
        </Suspense>
    );
}
