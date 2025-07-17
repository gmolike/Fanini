// app/api/[[...route]]/route.ts

import { setupContainer } from "../../../src/infrastructure/di/container";
import { MasterRouter } from "../../../src/presentation/routes";

const container = setupContainer();
const router = new MasterRouter(container);

export const GET = router.handle.bind(router);
export const POST = router.handle.bind(router);
export const PUT = router.handle.bind(router);
export const DELETE = router.handle.bind(router);
export const PATCH = router.handle.bind(router);
export const OPTIONS = router.handle.bind(router);
