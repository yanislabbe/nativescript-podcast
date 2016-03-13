import * as app from 'application';
import {Color} from 'color';
import * as platform from 'platform';
import {AudioDemo} from "./main-view-model";

function pageLoaded(args) {
  var page = args.object;
  page.bindingContext = new AudioDemo();
  
  if (app.android && platform.device.sdkVersion >= "21") {
      var window = app.android.startActivity.getWindow();
      window.setNavigationBarColor(new Color("#C2185B").android);
  }
}
exports.pageLoaded = pageLoaded;
