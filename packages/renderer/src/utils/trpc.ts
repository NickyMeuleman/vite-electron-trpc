import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../../../api/router/index';

export const trpc = createReactQueryHooks<AppRouter>();