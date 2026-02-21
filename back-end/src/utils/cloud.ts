import { v2 as cloud } from "cloudinary";

import {
  CLOUD_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} from "../config/env.config";

cloud.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

export default cloud;
