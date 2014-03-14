datetime-range
==============

Wrapping the pickadate.js library to create a google style date and time range picker.

Currently only available as an angular directive in the master branch.

Please note that the data currently kicked out is simply an ISOString so don't panic if the time looks wrong!

# What's next

* A polymer/webcomponent version.
As compliant to open standards as possible. See firefox's web components.
* Unit tests
* Example page

# Thanks to
Amsul for pickadate and his demo scripts at http://codepen.io/collection/vLcih/

Momentjs which is bar none the best date library I have ever come across.

Also these 2 conversations on stack overflow allowed me to understand just how I'd managed to waste almost an entire night chasing the dream of a shared scope between parent and child directives.
* http://stackoverflow.com/questions/21402756/angularjs-emit-only-works-within-its-current-scope
* http://stackoverflow.com/questions/21501760/ng-transclude-in-directive-and-sending-events-to-parent
