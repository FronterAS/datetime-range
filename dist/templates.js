angular.module('templates-main', ['allday.html', 'datepicker.html', 'datetimeRange.html', 'index.html', 'timepicker.html']);

angular.module("allday.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("allday.html",
    "<input type=\"checkbox\" />\n" +
    "");
}]);

angular.module("datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("datepicker.html",
    "<input\n" +
    "    type=\"text\"\n" +
    "    placeholder=\"Select date\"\n" +
    "    readonly=\"\"\n" +
    "    aria-haspopup=\"true\"\n" +
    "    aria-expanded=\"false\"\n" +
    "    aria-readonly=\"false\" />\n" +
    "");
}]);

angular.module("datetimeRange.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("datetimeRange.html",
    "<date-picker start-date></date-picker>\n" +
    "<time-picker start-time ng-hide=\"allDay\"></time-picker>\n" +
    "<time-picker end-time ng-hide=\"allDay\"></time-picker>\n" +
    "<date-picker end-date></date-picker>\n" +
    "<allday></allday>\n" +
    "");
}]);

angular.module("index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("index.html",
    "<!DOCTYPE html>\n" +
    "<html lang=\"en\" ng-app=\"UIcomponents\">\n" +
    "    <head>\n" +
    "        <meta charset=\"utf-8\">\n" +
    "        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
    "        <title>Directive test</title>\n" +
    "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1.0\">\n" +
    "\n" +
    "        <!-- build:css main.css -->\n" +
    "        <link rel=\"stylesheet\" href=\"components/pickadate/lib/themes/default.css\" />\n" +
    "        <link rel=\"stylesheet\" href=\"components/pickadate/lib/themes/default.date.css\" />\n" +
    "        <link rel=\"stylesheet\" href=\"components/pickadate/lib/themes/default.time.css\" />\n" +
    "        <!-- endbuild -->\n" +
    "\n" +
    "        <!-- build:js vendors.js -->\n" +
    "        <script src=\"components/jquery/dist/jquery.js\"></script>\n" +
    "        <script src=\"components/momentjs/moment.js\"></script>\n" +
    "        <script src=\"components/pickadate/lib/picker.js\"></script>\n" +
    "        <script src=\"components/pickadate/lib/picker.date.js\"></script>\n" +
    "        <script src=\"components/pickadate/lib/picker.time.js\"></script>\n" +
    "        <!-- endbuild -->\n" +
    "\n" +
    "        <!-- build:js application.js -->\n" +
    "        <script src=\"components/angular/angular.js\"></script>\n" +
    "        <script src=\"main.js\"></script>\n" +
    "        <script src=\"extras.js\"></script>\n" +
    "        <script src=\"directives.js\"></script>\n" +
    "        <script src=\"templates.js\"></script>\n" +
    "        <!-- endbuild -->\n" +
    "\n" +
    "    </head>\n" +
    "    <body>\n" +
    "\n" +
    "        <div ng-controller=\"MainCtrl\">\n" +
    "            <form ng-submit=\"onSubmit()\">\n" +
    "                <datetime-range\n" +
    "                    id=\"datetimeRangePicker\"\n" +
    "                    date-format=\"yyyy-mm-dd\"\n" +
    "                    min-time=\"06:00\"\n" +
    "                    max-time=\"18:00\"\n" +
    "                    time-format=\"HH:mm\">\n" +
    "                </datetime-range>\n" +
    "                <input type=\"submit\" />\n" +
    "            </form>\n" +
    "        </div>\n" +
    "\n" +
    "    </body>\n" +
    "</html>\n" +
    "");
}]);

angular.module("timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("timepicker.html",
    "<input type=\"time\" />\n" +
    "");
}]);
