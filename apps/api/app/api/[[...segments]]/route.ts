import { setupContainer } from "@/infrastructure/di/container";
import { ApiRouter } from "@/infrastructure/http/router";

const container = setupContainer();
const router = new ApiRouter(container);

export const GET = router.handle.bind(router);
export const POST = router.handle.bind(router);
export const PUT = router.handle.bind(router);
export const DELETE = router.handle.bind(router);
export const PATCH = router.handle.bind(router);
