import {
  BlackFridayCampaign,
  getBlackFridayMetadata,
} from "@/components/black-friday/black-friday-campaign";
import { withPageSchema } from "@/components/seo/page-schema";

export const metadata = getBlackFridayMetadata("/blackfriday/");

export default withPageSchema(BlackFridayCampaign, {
  path: "/blackfriday/",
  metadata,
});
