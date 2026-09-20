import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId, isSanityConfigured } from "./env";

const imageBuilder = isSanityConfigured
  ? createImageUrlBuilder({
      projectId: projectId || "demo-project-id",
      dataset: dataset || "production",
    })
  : null;

export const urlForImage = (source: Image | any) => {
  if (!imageBuilder || !source || !source.asset) return null;
  return imageBuilder.image(source).auto("format").fit("max");
};
