// src/presentation/routes/public/NewsletterPublicRouter.ts
import { BaseRouter } from "../BaseRouter";

export class NewsletterPublicRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("NewsletterController");

    this.addRoute({
      method: "POST",
      path: "/api/public/newsletter/subscribe",
      handler: controller.subscribe.bind(controller)
    });

    this.addRoute({
      method: "POST",
      path: "/api/public/newsletter/confirm",
      handler: controller.confirmSubscription.bind(controller)
    });

    this.addRoute({
      method: "POST",
      path: "/api/public/newsletter/unsubscribe",
      handler: controller.unsubscribe.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/newsletter/list",
      handler: controller.getPublicNewsletterList.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/newsletter/:newsletterId",
      handler: controller.getPublicNewsletterDetail.bind(controller)
    });
  }
}
