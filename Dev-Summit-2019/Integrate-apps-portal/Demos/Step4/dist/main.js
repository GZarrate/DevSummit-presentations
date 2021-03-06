define(["esri/WebMap", "esri/views/SceneView", "esri/portal/Portal", "esri/identity/OAuthInfo", "esri/identity/IdentityManager"], function (_WebMap, _SceneView, _Portal, _OAuthInfo, _IdentityManager) {
  "use strict";

  _WebMap = _interopRequireDefault(_WebMap);
  _SceneView = _interopRequireDefault(_SceneView);
  _Portal = _interopRequireDefault(_Portal);
  _OAuthInfo = _interopRequireDefault(_OAuthInfo);
  _IdentityManager = _interopRequireDefault(_IdentityManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }

  handleAuthentication();
  var map = new _WebMap.default({
    portalItem: {
      id: "7761d81ff08e45f2a7f27997e8d3e92d"
    }
  });
  var view = new _SceneView.default({
    map: map,
    zoom: 4,
    center: [-98, 35],
    container: "viewDiv"
  }); // Step 3 Connect to portal

  var portalUrl = "https://www.arcgis.com/sharing";
  view.when(function () {
    // Step 1a: See if user is already signed-in
    _IdentityManager.default.checkSignInStatus(portalUrl).always(function (info) {
      // If user is logged-in update sign-in button and query items
      var user = info && info.userId ? info.userId : null;

      if (user) {
        getCredentials(info);
      } else {
        // Step 4a Query Items from portal
        loadPortal(user);
      }
    });
  });

  function loadPortal(_x) {
    return _loadPortal.apply(this, arguments);
  }

  function _loadPortal() {
    _loadPortal = _asyncToGenerator(
      regeneratorRuntime.mark(function _callee(user) {
        var portal, layerTypes, query, itemResults;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                portal = new _Portal.default();
                _context.next = 3;
                return portal.load();

              case 3:
                document.getElementById("title").innerHTML = "Explore ".concat(portal.name ? portal.name : "Portal"); // Get a few items from the default portal or get a few
                // items from logged in user and display as thumbnails in side panel

                layerTypes = '(type:("Feature Collection" OR "Feature Service" OR "Map Service" ) -typekeywords:"Table")  -type:"Code Attachment" -type:"Featured Items" -type:"Symbol Set" -type:"Color Set" -type:"Windows Viewer Add In" -type:"Windows Viewer Configuration" -type:"Map Area" -typekeywords:"MapAreaPackage"';
                query = user ? "owner:".concat(user, " ").concat(layerTypes) : layerTypes;
                _context.next = 8;
                return portal.queryItems({
                  extent: view.extent,
                  query: query
                });

              case 8:
                itemResults = _context.sent;
                // Step 4b: Deal with results
                displayItems(itemResults.results);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
    return _loadPortal.apply(this, arguments);
  }

  function displayItems(items) {
    var cardContainer = document.getElementById("cardContainer");
    cardContainer.innerHTML = "".concat(items.map(function (item) {
      return "<div class=\"card leader-1\">\n  <figure class=\"card-image-wrap\">\n    <img class=\"card-image\" src=".concat(item.thumbnailUrl, " alt/>\n  </figure>\n  <div class=\"card-content\">\n    <h5 >").concat(item.title, "</h5>\n    <button data-item=").concat(item.id, " class=\"add-btn btn btn-fill\">Add to Map</button>\n  </div>\n</div>");
    }).join(""));
  }

  function handleAuthentication() {
    // Switch sign in / sign out links
    var signInButton = document.getElementById("signIn");
    var signOutButton = document.getElementById("signOut");

    _IdentityManager.default.registerOAuthInfos([new _OAuthInfo.default({
      appId: "Nrt2ESvH1cqQzSYa"
    })]);

    signInButton.addEventListener("click", function () {
      getCredentials();
    });
    signOutButton.addEventListener("click", function () {
      destroyCredentials();
    });
  }

  function getCredentials() {
    return _getCredentials.apply(this, arguments);
  }

  function _getCredentials() {
    _getCredentials = _asyncToGenerator(

      regeneratorRuntime.mark(function _callee2() {
        var credential,
          _args2 = arguments;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                credential = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : null;
                // If the user isn't already logged-in use getCredential
                // to kick-off the login process
                document.getElementById("signInNav").classList.add("hide");
                document.getElementById("userNav").classList.remove("hide");

                if (credential) {
                  _context2.next = 7;
                  break;
                }

                _context2.next = 6;
                return _IdentityManager.default.getCredential(portalUrl);

              case 6:
                credential = _context2.sent;

              case 7:
                loadPortal(credential.userId);
                document.getElementById("userName").innerHTML = credential.userId;

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    return _getCredentials.apply(this, arguments);
  }

  function destroyCredentials() {
    _IdentityManager.default.destroyCredentials();

    window.location.reload();
  }
});