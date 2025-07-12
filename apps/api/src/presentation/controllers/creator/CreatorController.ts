// src/presentation/controllers/creator/CreatorController.ts
export class CreatorController {
  async getPublicCreatorList(req: Request): Promise<Response> {
    return Response.json({
      success: true,
      data: [],
      message: "Creator feature coming soon",
    });
  }

  async getPublicCreatorDetail(req: Request): Promise<Response> {
    return Response.json({
      success: true,
      data: null,
      message: "Creator feature coming soon",
    });
  }

  async getPublicGallery(req: Request): Promise<Response> {
    return Response.json({
      success: true,
      data: [],
      message: "Gallery feature coming soon",
    });
  }

  async getPublicCreatorWorks(req: Request): Promise<Response> {
    return Response.json({
      success: true,
      data: [],
      message: "Creator works feature coming soon",
    });
  }
}
