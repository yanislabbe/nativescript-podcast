import * as app from "tns-core-modules/application";
import * as platform from "tns-core-modules/platform";
import { Color } from "tns-core-modules/color";
import { AudioDemo } from "./main-view-model";

function pageLoaded(args) {
  const page = args.object;
  page.bindingContext = new AudioDemo(page);
}
exports.pageLoaded = pageLoaded;
