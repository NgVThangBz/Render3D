// include: shell.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module != "undefined" ? Module : {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == "object";

var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != "undefined";

// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == "object" && process.versions?.node && process.type != "renderer";

var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -sPROXY_TO_WORKER) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)
// The way we signal to a worker that it is hosting a pthread is to construct
// it with a specific name.
var ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && self.name?.startsWith("em-pthread");

if (ENVIRONMENT_IS_NODE) {
  var worker_threads = require("worker_threads");
  global.Worker = worker_threads.Worker;
  ENVIRONMENT_IS_WORKER = !worker_threads.isMainThread;
  // Under node we set `workerData` to `em-pthread` to signal that the worker
  // is hosting a pthread.
  ENVIRONMENT_IS_PTHREAD = ENVIRONMENT_IS_WORKER && worker_threads["workerData"] == "em-pthread";
}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// include: /var/folders/n2/lmfxlgzs70xgr7xzjdrx1f5w0000gn/T/tmpv1irkdlp.js
Module["expectedDataFileDownloads"] ??= 0;

Module["expectedDataFileDownloads"]++;

(() => {
  // Do not attempt to redownload the virtual filesystem data when in a pthread or a Wasm Worker context.
  var isPthread = typeof ENVIRONMENT_IS_PTHREAD != "undefined" && ENVIRONMENT_IS_PTHREAD;
  var isWasmWorker = typeof ENVIRONMENT_IS_WASM_WORKER != "undefined" && ENVIRONMENT_IS_WASM_WORKER;
  if (isPthread || isWasmWorker) return;
  var isNode = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
  async function loadPackage(metadata) {
    var PACKAGE_PATH = "";
    if (typeof window === "object") {
      PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/")) + "/");
    } else if (typeof process === "undefined" && typeof location !== "undefined") {
      // web worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.substring(0, location.pathname.lastIndexOf("/")) + "/");
    }
    var PACKAGE_NAME = "bin/BZSketch/BZSketch.data";
    var REMOTE_PACKAGE_BASE = "BZSketch.data";
    var REMOTE_PACKAGE_NAME = Module["locateFile"]?.(REMOTE_PACKAGE_BASE, "") ?? REMOTE_PACKAGE_BASE;
    var REMOTE_PACKAGE_SIZE = metadata["remote_package_size"];
    async function fetchRemotePackage(packageName, packageSize) {
      if (isNode) {
        var fsPromises = require("fs/promises");
        var contents = await fsPromises.readFile(packageName);
        return contents.buffer;
      }
      Module["dataFileDownloads"] ??= {};
      try {
        var response = await fetch(packageName);
      } catch (e) {
        throw new Error(`Network Error: ${packageName}`, {
          e
        });
      }
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.url}`);
      }
      const chunks = [];
      const headers = response.headers;
      const total = Number(headers.get("Content-Length") ?? packageSize);
      let loaded = 0;
      Module["setStatus"]?.("Downloading data...");
      const reader = response.body.getReader();
      while (1) {
        var {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        Module["dataFileDownloads"][packageName] = {
          loaded,
          total
        };
        let totalLoaded = 0;
        let totalSize = 0;
        for (const download of Object.values(Module["dataFileDownloads"])) {
          totalLoaded += download.loaded;
          totalSize += download.total;
        }
        Module["setStatus"]?.(`Downloading data... (${totalLoaded}/${totalSize})`);
      }
      const packageData = new Uint8Array(chunks.map(c => c.length).reduce((a, b) => a + b, 0));
      let offset = 0;
      for (const chunk of chunks) {
        packageData.set(chunk, offset);
        offset += chunk.length;
      }
      return packageData.buffer;
    }
    async function runWithFS(Module) {
      function assert(check, msg) {
        if (!check) throw new Error(msg);
      }
      Module["FS_createPath"]("/", "axslc", true, true);
      Module["FS_createPath"]("/axslc", "custom", true, true);
      Module["FS_createPath"]("/", "fonts", true, true);
      Module["FS_createPath"]("/", "library", true, true);
      Module["FS_createPath"]("/", "png", true, true);
      Module["FS_createPath"]("/png", "ARCOMMAND", true, true);
      Module["FS_createPath"]("/png", "BATHROOM", true, true);
      Module["FS_createPath"]("/png", "BEDROOM", true, true);
      Module["FS_createPath"]("/png", "DIMENSION", true, true);
      Module["FS_createPath"]("/png", "DOOR", true, true);
      Module["FS_createPath"]("/png", "KITCHEN", true, true);
      Module["FS_createPath"]("/png", "LIVINGROOM", true, true);
      Module["FS_createPath"]("/png", "OBJECTS", true, true);
      Module["FS_createPath"]("/png", "STAIR", true, true);
      Module["FS_createPath"]("/png", "WALLTYPE", true, true);
      Module["FS_createPath"]("/png", "WINDOW", true, true);
      Module["FS_createPath"]("/", "svg", true, true);
      Module["FS_createPath"]("/svg", "FAI", true, true);
      Module["FS_createPath"]("/svg/FAI", "BATHROOM", true, true);
      Module["FS_createPath"]("/svg/FAI", "BEDROOM", true, true);
      Module["FS_createPath"]("/svg/FAI", "DOOR", true, true);
      Module["FS_createPath"]("/svg/FAI", "KITCHEN", true, true);
      Module["FS_createPath"]("/svg/FAI", "LIVINGROOM", true, true);
      Module["FS_createPath"]("/svg/FAI", "OBJECTS", true, true);
      Module["FS_createPath"]("/svg/FAI", "STAIR", true, true);
      Module["FS_createPath"]("/svg/FAI", "WALLTYPE", true, true);
      Module["FS_createPath"]("/svg/FAI", "WINDOW", true, true);
      Module["FS_createPath"]("/svg", "FF", true, true);
      Module["FS_createPath"]("/svg/FF", "BATHROOM", true, true);
      Module["FS_createPath"]("/svg/FF", "BEDROOM", true, true);
      Module["FS_createPath"]("/svg/FF", "DOOR", true, true);
      Module["FS_createPath"]("/svg/FF", "KITCHEN", true, true);
      Module["FS_createPath"]("/svg/FF", "LIVINGROOM", true, true);
      Module["FS_createPath"]("/svg/FF", "OBJECTS", true, true);
      Module["FS_createPath"]("/svg/FF", "STAIR", true, true);
      Module["FS_createPath"]("/svg/FF", "WALLTYPE", true, true);
      Module["FS_createPath"]("/svg/FF", "WINDOW", true, true);
      Module["FS_createPath"]("/svg", "FIF", true, true);
      Module["FS_createPath"]("/svg/FIF", "BATHROOM", true, true);
      Module["FS_createPath"]("/svg/FIF", "BEDROOM", true, true);
      Module["FS_createPath"]("/svg/FIF", "DOOR", true, true);
      Module["FS_createPath"]("/svg/FIF", "KITCHEN", true, true);
      Module["FS_createPath"]("/svg/FIF", "LIVINGROOM", true, true);
      Module["FS_createPath"]("/svg/FIF", "OBJECTS", true, true);
      Module["FS_createPath"]("/svg/FIF", "STAIR", true, true);
      Module["FS_createPath"]("/svg/FIF", "WALLTYPE", true, true);
      Module["FS_createPath"]("/svg/FIF", "WINDOW", true, true);
      Module["FS_createPath"]("/svg", "SvgStyles", true, true);
      Module["FS_createPath"]("/svg", "UF", true, true);
      Module["FS_createPath"]("/svg/UF", "BATHROOM", true, true);
      Module["FS_createPath"]("/svg/UF", "BEDROOM", true, true);
      Module["FS_createPath"]("/svg/UF", "DOOR", true, true);
      Module["FS_createPath"]("/svg/UF", "KITCHEN", true, true);
      Module["FS_createPath"]("/svg/UF", "LIVINGROOM", true, true);
      Module["FS_createPath"]("/svg/UF", "OBJECTS", true, true);
      Module["FS_createPath"]("/svg/UF", "STAIR", true, true);
      Module["FS_createPath"]("/svg/UF", "WALLTYPE", true, true);
      Module["FS_createPath"]("/svg/UF", "WINDOW", true, true);
      Module["FS_createPath"]("/", "ui", true, true);
      Module["FS_createPath"]("/ui", "Button", true, true);
      Module["FS_createPath"]("/ui", "CommentMenu", true, true);
      Module["FS_createPath"]("/ui", "Cursor", true, true);
      Module["FS_createPath"]("/ui", "DimensionTools", true, true);
      Module["FS_createPath"]("/ui", "DrawMode", true, true);
      Module["FS_createPath"]("/ui", "Footer", true, true);
      Module["FS_createPath"]("/ui", "HeaderLayer", true, true);
      Module["FS_createPath"]("/ui", "Popup", true, true);
      Module["FS_createPath"]("/ui/Popup", "MainMenu", true, true);
      Module["FS_createPath"]("/ui", "PopupProject", true, true);
      Module["FS_createPath"]("/ui", "SelectTool", true, true);
      Module["FS_createPath"]("/ui", "ToolsFloor", true, true);
      Module["FS_createPath"]("/ui", "ToolsLayer", true, true);
      Module["FS_createPath"]("/ui", "WallMenu", true, true);
      Module["FS_createPath"]("/ui", "checkbox", true, true);
      Module["FS_createPath"]("/ui", "slider", true, true);
      for (var file of metadata["files"]) {
        var name = file["filename"];
        Module["addRunDependency"](`fp ${name}`);
      }
      var PACKAGE_UUID = metadata["package_uuid"];
      var IDB_RO = "readonly";
      var IDB_RW = "readwrite";
      var DB_NAME = "EM_PRELOAD_CACHE";
      var DB_VERSION = 1;
      var METADATA_STORE_NAME = "METADATA";
      var PACKAGE_STORE_NAME = "PACKAGES";
      async function openDatabase() {
        if (typeof indexedDB == "undefined") {
          throw new Error("using IndexedDB to cache data can only be done on a web page or in a web worker");
        }
        return new Promise((resolve, reject) => {
          var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
          openRequest.onupgradeneeded = event => {
            var db = /** @type {IDBDatabase} */ (event.target.result);
            if (db.objectStoreNames.contains(PACKAGE_STORE_NAME)) {
              db.deleteObjectStore(PACKAGE_STORE_NAME);
            }
            var packages = db.createObjectStore(PACKAGE_STORE_NAME);
            if (db.objectStoreNames.contains(METADATA_STORE_NAME)) {
              db.deleteObjectStore(METADATA_STORE_NAME);
            }
            var metadata = db.createObjectStore(METADATA_STORE_NAME);
          };
          openRequest.onsuccess = event => {
            var db = /** @type {IDBDatabase} */ (event.target.result);
            resolve(db);
          };
          openRequest.onerror = reject;
        });
      }
      // This is needed as chromium has a limit on per-entry files in IndexedDB
      // https://cs.chromium.org/chromium/src/content/renderer/indexed_db/webidbdatabase_impl.cc?type=cs&sq=package:chromium&g=0&l=177
      // https://cs.chromium.org/chromium/src/out/Debug/gen/third_party/blink/public/mojom/indexeddb/indexeddb.mojom.h?type=cs&sq=package:chromium&g=0&l=60
      // We set the chunk size to 64MB to stay well-below the limit
      var CHUNK_SIZE = 64 * 1024 * 1024;
      async function cacheRemotePackage(db, packageName, packageData, packageMeta) {
        var transactionPackages = db.transaction([ PACKAGE_STORE_NAME ], IDB_RW);
        var packages = transactionPackages.objectStore(PACKAGE_STORE_NAME);
        var chunkSliceStart = 0;
        var nextChunkSliceStart = 0;
        var chunkCount = Math.ceil(packageData.byteLength / CHUNK_SIZE);
        var finishedChunks = 0;
        return new Promise((resolve, reject) => {
          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            nextChunkSliceStart += CHUNK_SIZE;
            var putPackageRequest = packages.put(packageData.slice(chunkSliceStart, nextChunkSliceStart), `package/${packageName}/${chunkId}`);
            chunkSliceStart = nextChunkSliceStart;
            putPackageRequest.onsuccess = event => {
              finishedChunks++;
              if (finishedChunks == chunkCount) {
                var transaction_metadata = db.transaction([ METADATA_STORE_NAME ], IDB_RW);
                var metadata = transaction_metadata.objectStore(METADATA_STORE_NAME);
                var putMetadataRequest = metadata.put({
                  "uuid": packageMeta.uuid,
                  "chunkCount": chunkCount
                }, `metadata/${packageName}`);
                putMetadataRequest.onsuccess = event => resolve(packageData);
                putMetadataRequest.onerror = reject;
              }
            };
            putPackageRequest.onerror = reject;
          }
        });
      }
      /*
         * Check if there's a cached package, and if so whether it's the latest available.
         * Resolves to the cached metadata, or `null` if it is missing or out-of-date.
         */ async function checkCachedPackage(db, packageName) {
        var transaction = db.transaction([ METADATA_STORE_NAME ], IDB_RO);
        var metadata = transaction.objectStore(METADATA_STORE_NAME);
        var getRequest = metadata.get(`metadata/${packageName}`);
        return new Promise((resolve, reject) => {
          getRequest.onsuccess = event => {
            var result = event.target.result;
            if (result && PACKAGE_UUID === result["uuid"]) {
              resolve(result);
            } else {
              resolve(null);
            }
          };
          getRequest.onerror = reject;
        });
      }
      async function fetchCachedPackage(db, packageName, metadata) {
        var transaction = db.transaction([ PACKAGE_STORE_NAME ], IDB_RO);
        var packages = transaction.objectStore(PACKAGE_STORE_NAME);
        var chunksDone = 0;
        var totalSize = 0;
        var chunkCount = metadata["chunkCount"];
        var chunks = new Array(chunkCount);
        return new Promise((resolve, reject) => {
          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            var getRequest = packages.get(`package/${packageName}/${chunkId}`);
            getRequest.onsuccess = event => {
              if (!event.target.result) {
                reject(`CachedPackageNotFound for: ${packageName}`);
                return;
              }
              // If there's only 1 chunk, there's nothing to concatenate it with so we can just return it now
              if (chunkCount == 1) {
                resolve(event.target.result);
              } else {
                chunksDone++;
                totalSize += event.target.result.byteLength;
                chunks.push(event.target.result);
                if (chunksDone == chunkCount) {
                  if (chunksDone == 1) {
                    resolve(event.target.result);
                  } else {
                    var tempTyped = new Uint8Array(totalSize);
                    var byteOffset = 0;
                    for (var chunkId in chunks) {
                      var buffer = chunks[chunkId];
                      tempTyped.set(new Uint8Array(buffer), byteOffset);
                      byteOffset += buffer.byteLength;
                      buffer = undefined;
                    }
                    chunks = undefined;
                    resolve(tempTyped.buffer);
                    tempTyped = undefined;
                  }
                }
              }
            };
            getRequest.onerror = reject;
          }
        });
      }
      async function processPackageData(arrayBuffer) {
        assert(arrayBuffer, "Loading data file failed.");
        assert(arrayBuffer.constructor.name === ArrayBuffer.name, "bad input to processPackageData");
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        // Reuse the bytearray from the XHR as the source for file reads.
        for (var file of metadata["files"]) {
          var name = file["filename"];
          var data = byteArray.subarray(file["start"], file["end"]);
          // canOwn this data in the filesystem, it is a slice into the heap that will never change
          Module["FS_createDataFile"](name, null, data, true, true, true);
          Module["removeRunDependency"](`fp ${name}`);
        }
        Module["removeRunDependency"]("datafile_bin/BZSketch/BZSketch.data");
      }
      Module["addRunDependency"]("datafile_bin/BZSketch/BZSketch.data");
      Module["preloadResults"] ??= {};
      async function preloadFallback(error) {
        console.error(error);
        console.error("falling back to default preload behavior");
        processPackageData(await fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE));
      }
      try {
        var db = await openDatabase();
        var pkgMetadata = await checkCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME);
        var useCached = !!pkgMetadata;
        Module["preloadResults"][PACKAGE_NAME] = {
          fromCache: useCached
        };
        if (useCached) {
          processPackageData(await fetchCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME, pkgMetadata));
        } else {
          var packageData = await fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE);
          try {
            processPackageData(await cacheRemotePackage(db, PACKAGE_PATH + PACKAGE_NAME, packageData, {
              uuid: PACKAGE_UUID
            }));
          } catch (error) {
            console.error(error);
            processPackageData(packageData);
          }
        }
      } catch (e) {
        await preloadFallback(e);
      }
      Module["setStatus"]?.("Downloading...");
    }
    if (Module["calledRun"]) {
      runWithFS(Module);
    } else {
      (Module["preRun"] ??= []).push(runWithFS);
    }
  }
  loadPackage({
    "files": [ {
      "filename": "/.DS_Store",
      "start": 0,
      "end": 10244
    }, {
      "filename": "/HotKey.json",
      "start": 10244,
      "end": 16005
    }, {
      "filename": "/axslc/cameraClear_fs",
      "start": 16005,
      "end": 16207
    }, {
      "filename": "/axslc/cameraClear_vs",
      "start": 16207,
      "end": 16596
    }, {
      "filename": "/axslc/colorNormalTexture_fs",
      "start": 16596,
      "end": 21246
    }, {
      "filename": "/axslc/colorNormalTexture_fs_1",
      "start": 21246,
      "end": 25646
    }, {
      "filename": "/axslc/colorNormal_fs",
      "start": 25646,
      "end": 30229
    }, {
      "filename": "/axslc/colorTexture_fs",
      "start": 30229,
      "end": 30540
    }, {
      "filename": "/axslc/color_fs",
      "start": 30540,
      "end": 30760
    }, {
      "filename": "/axslc/custom/imgui_sprite_vs",
      "start": 30760,
      "end": 31132
    }, {
      "filename": "/axslc/custom/spineTwoColorTint_fs",
      "start": 31132,
      "end": 31698
    }, {
      "filename": "/axslc/custom/spineTwoColorTint_vs",
      "start": 31698,
      "end": 32130
    }, {
      "filename": "/axslc/dualSampler_fs",
      "start": 32130,
      "end": 32773
    }, {
      "filename": "/axslc/dualSampler_gray_fs",
      "start": 32773,
      "end": 33636
    }, {
      "filename": "/axslc/dualSampler_hsv_fs",
      "start": 33636,
      "end": 35998
    }, {
      "filename": "/axslc/grayScale_fs",
      "start": 35998,
      "end": 36514
    }, {
      "filename": "/axslc/hsv_fs",
      "start": 36514,
      "end": 38579
    }, {
      "filename": "/axslc/label_distanceGlow_fs",
      "start": 38579,
      "end": 39287
    }, {
      "filename": "/axslc/label_distanceNormal_fs",
      "start": 39287,
      "end": 39818
    }, {
      "filename": "/axslc/label_distanceOutline_fs",
      "start": 39818,
      "end": 40570
    }, {
      "filename": "/axslc/label_normal_fs",
      "start": 40570,
      "end": 40953
    }, {
      "filename": "/axslc/label_outline_fs",
      "start": 40953,
      "end": 41882
    }, {
      "filename": "/axslc/layer_radialGradient_fs",
      "start": 41882,
      "end": 42602
    }, {
      "filename": "/axslc/lineColor_fs",
      "start": 42602,
      "end": 42778
    }, {
      "filename": "/axslc/lineColor_vs",
      "start": 42778,
      "end": 43054
    }, {
      "filename": "/axslc/particleColor_fs",
      "start": 43054,
      "end": 43307
    }, {
      "filename": "/axslc/particleTexture_fs",
      "start": 43307,
      "end": 43653
    }, {
      "filename": "/axslc/particle_vs",
      "start": 43653,
      "end": 44044
    }, {
      "filename": "/axslc/posUVColor2D_vs",
      "start": 44044,
      "end": 44416
    }, {
      "filename": "/axslc/positionColorLengthTexture_fs",
      "start": 44416,
      "end": 44656
    }, {
      "filename": "/axslc/positionColorLengthTexture_vs",
      "start": 44656,
      "end": 45094
    }, {
      "filename": "/axslc/positionColorTextureAsPointsize_vs",
      "start": 45094,
      "end": 45515
    }, {
      "filename": "/axslc/positionColor_fs",
      "start": 45515,
      "end": 45691
    }, {
      "filename": "/axslc/positionColor_vs",
      "start": 45691,
      "end": 45956
    }, {
      "filename": "/axslc/positionNormalTexture_vs",
      "start": 45956,
      "end": 47306
    }, {
      "filename": "/axslc/positionNormalTexture_vs_1",
      "start": 47306,
      "end": 51127
    }, {
      "filename": "/axslc/positionTextureColorAlphaTest_fs",
      "start": 51127,
      "end": 51570
    }, {
      "filename": "/axslc/positionTextureColor_fs",
      "start": 51570,
      "end": 51837
    }, {
      "filename": "/axslc/positionTextureColor_vs",
      "start": 51837,
      "end": 52193
    }, {
      "filename": "/axslc/positionTextureGrayAlpha_fs",
      "start": 52193,
      "end": 52505
    }, {
      "filename": "/axslc/positionTextureGray_fs",
      "start": 52505,
      "end": 52817
    }, {
      "filename": "/axslc/positionTexture_fs",
      "start": 52817,
      "end": 53051
    }, {
      "filename": "/axslc/positionTexture_vs",
      "start": 53051,
      "end": 53338
    }, {
      "filename": "/axslc/positionUColor_vs",
      "start": 53338,
      "end": 53602
    }, {
      "filename": "/axslc/position_vs",
      "start": 53602,
      "end": 53787
    }, {
      "filename": "/axslc/quadColor_fs",
      "start": 53787,
      "end": 54040
    }, {
      "filename": "/axslc/quadColor_vs",
      "start": 54040,
      "end": 54305
    }, {
      "filename": "/axslc/quadTexture_fs",
      "start": 54305,
      "end": 54651
    }, {
      "filename": "/axslc/quadTexture_vs",
      "start": 54651,
      "end": 55046
    }, {
      "filename": "/axslc/skinPositionNormalTexture_vs",
      "start": 55046,
      "end": 58648
    }, {
      "filename": "/axslc/skinPositionNormalTexture_vs_1",
      "start": 58648,
      "end": 64253
    }, {
      "filename": "/axslc/skinPositionTexture_vs",
      "start": 64253,
      "end": 66534
    }, {
      "filename": "/axslc/skybox_fs",
      "start": 66534,
      "end": 66843
    }, {
      "filename": "/axslc/skybox_vs",
      "start": 66843,
      "end": 67140
    }, {
      "filename": "/axslc/terrain_fs",
      "start": 67140,
      "end": 68486
    }, {
      "filename": "/axslc/terrain_vs",
      "start": 68486,
      "end": 68845
    }, {
      "filename": "/axslc/unlit_instance_vs",
      "start": 68845,
      "end": 69216
    }, {
      "filename": "/axslc/unlit_vs",
      "start": 69216,
      "end": 69531
    }, {
      "filename": "/axslc/videoTextureBGRA_fs",
      "start": 69531,
      "end": 69803
    }, {
      "filename": "/axslc/videoTextureI420_fs",
      "start": 69803,
      "end": 70853
    }, {
      "filename": "/axslc/videoTextureNV12_fs",
      "start": 70853,
      "end": 71864
    }, {
      "filename": "/axslc/videoTextureYUY2_fs",
      "start": 71864,
      "end": 72875
    }, {
      "filename": "/axslc/vr_fs",
      "start": 72875,
      "end": 73149
    }, {
      "filename": "/axslc/vr_vs",
      "start": 73149,
      "end": 73477
    }, {
      "filename": "/fonts/GeosansLight.ttf",
      "start": 73477,
      "end": 133549
    }, {
      "filename": "/fonts/Marker Felt.ttf",
      "start": 133549,
      "end": 159325
    }, {
      "filename": "/fonts/arial.ttf",
      "start": 159325,
      "end": 937877
    }, {
      "filename": "/fonts/sears.ttf",
      "start": 937877,
      "end": 1233677
    }, {
      "filename": "/library/Example.bz",
      "start": 1233677,
      "end": 1264397
    }, {
      "filename": "/library/content.xml",
      "start": 1264397,
      "end": 1270969
    }, {
      "filename": "/library/lang.ini",
      "start": 1270969,
      "end": 1273999
    }, {
      "filename": "/library/localize.xml",
      "start": 1273999,
      "end": 1286944
    }, {
      "filename": "/png/.DS_Store",
      "start": 1286944,
      "end": 1297188
    }, {
      "filename": "/png/ARCOMMAND/Multi_measure.png",
      "start": 1297188,
      "end": 1304257
    }, {
      "filename": "/png/ARCOMMAND/Room_Plan.png",
      "start": 1304257,
      "end": 1310421
    }, {
      "filename": "/png/ARCOMMAND/Room_Scan.png",
      "start": 1310421,
      "end": 1319786
    }, {
      "filename": "/png/ARCOMMAND/Single_measure.png",
      "start": 1319786,
      "end": 1324891
    }, {
      "filename": "/png/BATHROOM/Bathtub.png",
      "start": 1324891,
      "end": 1328828
    }, {
      "filename": "/png/BATHROOM/Bathtub_corner.png",
      "start": 1328828,
      "end": 1331049
    }, {
      "filename": "/png/BATHROOM/Bathtub_corner_bath.png",
      "start": 1331049,
      "end": 1333075
    }, {
      "filename": "/png/BATHROOM/Custom_obj_bath.png",
      "start": 1333075,
      "end": 1334319
    }, {
      "filename": "/png/BATHROOM/Dusch.png",
      "start": 1334319,
      "end": 1336008
    }, {
      "filename": "/png/BATHROOM/Handbasin_bath.png",
      "start": 1336008,
      "end": 1341240
    }, {
      "filename": "/png/BATHROOM/Shower_cab.png",
      "start": 1341240,
      "end": 1342281
    }, {
      "filename": "/png/BATHROOM/Shower_cab_corner.png",
      "start": 1342281,
      "end": 1343278
    }, {
      "filename": "/png/BATHROOM/Shower_cab_corner_graded.png",
      "start": 1343278,
      "end": 1344506
    }, {
      "filename": "/png/BATHROOM/Shower_cab_corner_round.png",
      "start": 1344506,
      "end": 1346488
    }, {
      "filename": "/png/BATHROOM/Shower_cab_corner_round_part.png",
      "start": 1346488,
      "end": 1348077
    }, {
      "filename": "/png/BATHROOM/Shower_cabin.png",
      "start": 1348077,
      "end": 1349177
    }, {
      "filename": "/png/BATHROOM/Toilet_WC.png",
      "start": 1349177,
      "end": 1351202
    }, {
      "filename": "/png/BATHROOM/Tumble_dryer.png",
      "start": 1351202,
      "end": 1352596
    }, {
      "filename": "/png/BATHROOM/WC_tank.png",
      "start": 1352596,
      "end": 1354926
    }, {
      "filename": "/png/BATHROOM/WC_wall.png",
      "start": 1354926,
      "end": 1356813
    }, {
      "filename": "/png/BATHROOM/Wardrobe.png",
      "start": 1356813,
      "end": 1358289
    }, {
      "filename": "/png/BATHROOM/Washbasin_round.png",
      "start": 1358289,
      "end": 1361798
    }, {
      "filename": "/png/BATHROOM/Washbasin_square.png",
      "start": 1361798,
      "end": 1362992
    }, {
      "filename": "/png/BATHROOM/Washing_machine.png",
      "start": 1362992,
      "end": 1365324
    }, {
      "filename": "/png/BATHROOM/Washstand.png",
      "start": 1365324,
      "end": 1371125
    }, {
      "filename": "/png/BATHROOM/Washstand_cab.png",
      "start": 1371125,
      "end": 1377197
    }, {
      "filename": "/png/BATHROOM/Washstand_corner.png",
      "start": 1377197,
      "end": 1381101
    }, {
      "filename": "/png/BATHROOM/Washstand_round.png",
      "start": 1381101,
      "end": 1384468
    }, {
      "filename": "/png/BATHROOM/Washstand_square.png",
      "start": 1384468,
      "end": 1385852
    }, {
      "filename": "/png/BATHROOM/Water_faucet.png",
      "start": 1385852,
      "end": 1387796
    }, {
      "filename": "/png/BATHROOM/Water_heater.png",
      "start": 1387796,
      "end": 1391366
    }, {
      "filename": "/png/BEDROOM/Custom_obj_bedroom.png",
      "start": 1391366,
      "end": 1392610
    }, {
      "filename": "/png/BEDROOM/Double_bed.png",
      "start": 1392610,
      "end": 1393455
    }, {
      "filename": "/png/BEDROOM/Double_bed_nightstands.png",
      "start": 1393455,
      "end": 1394352
    }, {
      "filename": "/png/BEDROOM/Nightstand.png",
      "start": 1394352,
      "end": 1395024
    }, {
      "filename": "/png/BEDROOM/Single_bed.png",
      "start": 1395024,
      "end": 1395805
    }, {
      "filename": "/png/BEDROOM/Sliding_wardrobe.png",
      "start": 1395805,
      "end": 1396788
    }, {
      "filename": "/png/BEDROOM/Warderobe_1_Door.png",
      "start": 1396788,
      "end": 1397744
    }, {
      "filename": "/png/BEDROOM/Warderobe_2_Door.png",
      "start": 1397744,
      "end": 1399018
    }, {
      "filename": "/png/DIMENSION/.DS_Store",
      "start": 1399018,
      "end": 1405166
    }, {
      "filename": "/png/DOOR/Door.png",
      "start": 1405166,
      "end": 1406621
    }, {
      "filename": "/png/DOOR/DoubleDoor.png",
      "start": 1406621,
      "end": 1409237
    }, {
      "filename": "/png/DOOR/Double_door_solid_glass.png",
      "start": 1409237,
      "end": 1411450
    }, {
      "filename": "/png/DOOR/Double_sliding_doors.png",
      "start": 1411450,
      "end": 1413043
    }, {
      "filename": "/png/DOOR/Garage_door.png",
      "start": 1413043,
      "end": 1414310
    }, {
      "filename": "/png/DOOR/Glass_door.png",
      "start": 1414310,
      "end": 1419483
    }, {
      "filename": "/png/DOOR/Open_doorway.png",
      "start": 1419483,
      "end": 1420352
    }, {
      "filename": "/png/DOOR/Sliding_door.png",
      "start": 1420352,
      "end": 1421671
    }, {
      "filename": "/png/KITCHEN/Bench_double_sink.png",
      "start": 1421671,
      "end": 1422500
    }, {
      "filename": "/png/KITCHEN/Cabinet_high.png",
      "start": 1422500,
      "end": 1424182
    }, {
      "filename": "/png/KITCHEN/Chimney.png",
      "start": 1424182,
      "end": 1424897
    }, {
      "filename": "/png/KITCHEN/Custom_obj_kitchen.png",
      "start": 1424897,
      "end": 1426141
    }, {
      "filename": "/png/KITCHEN/Dishwasher.png",
      "start": 1426141,
      "end": 1429365
    }, {
      "filename": "/png/KITCHEN/Double_sink.png",
      "start": 1429365,
      "end": 1433459
    }, {
      "filename": "/png/KITCHEN/Freezer.png",
      "start": 1433459,
      "end": 1435190
    }, {
      "filename": "/png/KITCHEN/Genobj.png",
      "start": 1435190,
      "end": 1436890
    }, {
      "filename": "/png/KITCHEN/Graded_conrner_kitchen_bench.png",
      "start": 1436890,
      "end": 1437816
    }, {
      "filename": "/png/KITCHEN/Graded_conrner_kitchen_bench_with_stove.png",
      "start": 1437816,
      "end": 1441922
    }, {
      "filename": "/png/KITCHEN/Hood.png",
      "start": 1441922,
      "end": 1443855
    }, {
      "filename": "/png/KITCHEN/Induction_cooker2.png",
      "start": 1443855,
      "end": 1445969
    }, {
      "filename": "/png/KITCHEN/Induction_cooker4.png",
      "start": 1445969,
      "end": 1449345
    }, {
      "filename": "/png/KITCHEN/Kitchen_bench.png",
      "start": 1449345,
      "end": 1450245
    }, {
      "filename": "/png/KITCHEN/Refrigerator.png",
      "start": 1450245,
      "end": 1451720
    }, {
      "filename": "/png/KITCHEN/Refrigerator_freezer.png",
      "start": 1451720,
      "end": 1453263
    }, {
      "filename": "/png/KITCHEN/Round_kitchen_table.png",
      "start": 1453263,
      "end": 1458792
    }, {
      "filename": "/png/KITCHEN/Single_sink.png",
      "start": 1458792,
      "end": 1461878
    }, {
      "filename": "/png/KITCHEN/Sink_with_dryer_plate.png",
      "start": 1461878,
      "end": 1465655
    }, {
      "filename": "/png/KITCHEN/Table_with_four_chairs.png",
      "start": 1465655,
      "end": 1468906
    }, {
      "filename": "/png/KITCHEN/Table_with_six_chairs.png",
      "start": 1468906,
      "end": 1473382
    }, {
      "filename": "/png/KITCHEN/Table_with_two_chairs.png",
      "start": 1473382,
      "end": 1475562
    }, {
      "filename": "/png/LIVINGROOM/Arm_chair.png",
      "start": 1475562,
      "end": 1476292
    }, {
      "filename": "/png/LIVINGROOM/Booklet.png",
      "start": 1476292,
      "end": 1477224
    }, {
      "filename": "/png/LIVINGROOM/Chair.png",
      "start": 1477224,
      "end": 1479759
    }, {
      "filename": "/png/LIVINGROOM/Chaise_seater_sofa.png",
      "start": 1479759,
      "end": 1482104
    }, {
      "filename": "/png/LIVINGROOM/Coffee_Table.png",
      "start": 1482104,
      "end": 1482979
    }, {
      "filename": "/png/LIVINGROOM/Custom_obj_livingroom.png",
      "start": 1482979,
      "end": 1484223
    }, {
      "filename": "/png/LIVINGROOM/Desk_with_office_chair.png",
      "start": 1484223,
      "end": 1485836
    }, {
      "filename": "/png/LIVINGROOM/Fireplace.png",
      "start": 1485836,
      "end": 1486811
    }, {
      "filename": "/png/LIVINGROOM/Fireplace_corner.png",
      "start": 1486811,
      "end": 1487992
    }, {
      "filename": "/png/LIVINGROOM/Fireplace_round.png",
      "start": 1487992,
      "end": 1491089
    }, {
      "filename": "/png/LIVINGROOM/Hatrack.png",
      "start": 1491089,
      "end": 1491995
    }, {
      "filename": "/png/LIVINGROOM/TV.png",
      "start": 1491995,
      "end": 1493474
    }, {
      "filename": "/png/LIVINGROOM/Three_seater_sofa.png",
      "start": 1493474,
      "end": 1494535
    }, {
      "filename": "/png/LIVINGROOM/Tile_stove.png",
      "start": 1494535,
      "end": 1498005
    }, {
      "filename": "/png/LIVINGROOM/Two_seater_sofa.png",
      "start": 1498005,
      "end": 1498977
    }, {
      "filename": "/png/OBJECTS/Bush.png",
      "start": 1498977,
      "end": 1502595
    }, {
      "filename": "/png/OBJECTS/Custom_obj_obj.png",
      "start": 1502595,
      "end": 1503839
    }, {
      "filename": "/png/OBJECTS/Entrance_Arrow.png",
      "start": 1503839,
      "end": 1505231
    }, {
      "filename": "/png/OBJECTS/Furniture_02.png",
      "start": 1505231,
      "end": 1505907
    }, {
      "filename": "/png/OBJECTS/Furniture_round.png",
      "start": 1505907,
      "end": 1509477
    }, {
      "filename": "/png/OBJECTS/North_arrow.png",
      "start": 1509477,
      "end": 1511348
    }, {
      "filename": "/png/OBJECTS/Roof_windows.png",
      "start": 1511348,
      "end": 1513890
    }, {
      "filename": "/png/OBJECTS/Three.png",
      "start": 1513890,
      "end": 1519023
    }, {
      "filename": "/png/OBJECTS/car.png",
      "start": 1519023,
      "end": 1522394
    }, {
      "filename": "/png/STAIR/Half_circular_stair.png",
      "start": 1522394,
      "end": 1525557
    }, {
      "filename": "/png/STAIR/L_stair.png",
      "start": 1525557,
      "end": 1527512
    }, {
      "filename": "/png/STAIR/Spiral_stair.png",
      "start": 1527512,
      "end": 1532266
    }, {
      "filename": "/png/STAIR/Straight_multi_stair.png",
      "start": 1532266,
      "end": 1533477
    }, {
      "filename": "/png/STAIR/Straight_stair.png",
      "start": 1533477,
      "end": 1534669
    }, {
      "filename": "/png/STAIR/U_stair.png",
      "start": 1534669,
      "end": 1537500
    }, {
      "filename": "/png/STAIR/Winder_L_stair.png",
      "start": 1537500,
      "end": 1539778
    }, {
      "filename": "/png/SignUp_button.png",
      "start": 1539778,
      "end": 1543969
    }, {
      "filename": "/png/WALLTYPE/Chimney.png",
      "start": 1543969,
      "end": 1544679
    }, {
      "filename": "/png/WALLTYPE/Column.png",
      "start": 1544679,
      "end": 1545327
    }, {
      "filename": "/png/WALLTYPE/Column_circle.png",
      "start": 1545327,
      "end": 1546496
    }, {
      "filename": "/png/WALLTYPE/Technical_box.png",
      "start": 1546496,
      "end": 1547362
    }, {
      "filename": "/png/WINDOW/Double_window.png",
      "start": 1547362,
      "end": 1550019
    }, {
      "filename": "/png/WINDOW/Quad_window.png",
      "start": 1550019,
      "end": 1561767
    }, {
      "filename": "/png/WINDOW/Roof_Window.png",
      "start": 1561767,
      "end": 1564253
    }, {
      "filename": "/png/WINDOW/Separated_windows.png",
      "start": 1564253,
      "end": 1565796
    }, {
      "filename": "/png/WINDOW/Triple_window.png",
      "start": 1565796,
      "end": 1567528
    }, {
      "filename": "/png/WINDOW/Window.png",
      "start": 1567528,
      "end": 1568696
    }, {
      "filename": "/png/bgButton.png",
      "start": 1568696,
      "end": 1575788
    }, {
      "filename": "/png/checkbox.png",
      "start": 1575788,
      "end": 1581520
    }, {
      "filename": "/png/checkbox_selected.png",
      "start": 1581520,
      "end": 1585563
    }, {
      "filename": "/png/input_background.png",
      "start": 1585563,
      "end": 1585830
    }, {
      "filename": "/svg/.DS_Store",
      "start": 1585830,
      "end": 1591978
    }, {
      "filename": "/svg/FAI/BATHROOM/Bathtub.svg",
      "start": 1591978,
      "end": 1600680
    }, {
      "filename": "/svg/FAI/BATHROOM/Bathtub_corner.svg",
      "start": 1600680,
      "end": 1604438
    }, {
      "filename": "/svg/FAI/BATHROOM/Bathtub_corner_bath.svg",
      "start": 1604438,
      "end": 1609275
    }, {
      "filename": "/svg/FAI/BATHROOM/Custom_obj_bath.svg",
      "start": 1609275,
      "end": 1609656
    }, {
      "filename": "/svg/FAI/BATHROOM/Dusch.svg",
      "start": 1609656,
      "end": 1610348
    }, {
      "filename": "/svg/FAI/BATHROOM/Handbasin_bath.svg",
      "start": 1610348,
      "end": 1852587
    }, {
      "filename": "/svg/FAI/BATHROOM/Shower_cab.svg",
      "start": 1852587,
      "end": 1853363
    }, {
      "filename": "/svg/FAI/BATHROOM/Shower_cab_corner.svg",
      "start": 1853363,
      "end": 1854139
    }, {
      "filename": "/svg/FAI/BATHROOM/Shower_cab_corner_graded.svg",
      "start": 1854139,
      "end": 1854951
    }, {
      "filename": "/svg/FAI/BATHROOM/Shower_cab_corner_round.svg",
      "start": 1854951,
      "end": 1857490
    }, {
      "filename": "/svg/FAI/BATHROOM/Shower_cab_corner_round_part.svg",
      "start": 1857490,
      "end": 1862284
    }, {
      "filename": "/svg/FAI/BATHROOM/Shower_cabin.svg",
      "start": 1862284,
      "end": 1864432
    }, {
      "filename": "/svg/FAI/BATHROOM/Toilet_WC.svg",
      "start": 1864432,
      "end": 1873674
    }, {
      "filename": "/svg/FAI/BATHROOM/Tumble_dryer.svg",
      "start": 1873674,
      "end": 1877803
    }, {
      "filename": "/svg/FAI/BATHROOM/WC_tank.svg",
      "start": 1877803,
      "end": 1883125
    }, {
      "filename": "/svg/FAI/BATHROOM/WC_wall.svg",
      "start": 1883125,
      "end": 1886767
    }, {
      "filename": "/svg/FAI/BATHROOM/Wardrobe.svg",
      "start": 1886767,
      "end": 1887792
    }, {
      "filename": "/svg/FAI/BATHROOM/Washbasin_round.svg",
      "start": 1887792,
      "end": 1899761
    }, {
      "filename": "/svg/FAI/BATHROOM/Washbasin_square.svg",
      "start": 1899761,
      "end": 1905303
    }, {
      "filename": "/svg/FAI/BATHROOM/Washing_machine.svg",
      "start": 1905303,
      "end": 1914396
    }, {
      "filename": "/svg/FAI/BATHROOM/Washstand.svg",
      "start": 1914396,
      "end": 1944136
    }, {
      "filename": "/svg/FAI/BATHROOM/Washstand_cab.svg",
      "start": 1944136,
      "end": 1974041
    }, {
      "filename": "/svg/FAI/BATHROOM/Washstand_corner.svg",
      "start": 1974041,
      "end": 1982242
    }, {
      "filename": "/svg/FAI/BATHROOM/Washstand_round.svg",
      "start": 1982242,
      "end": 1991962
    }, {
      "filename": "/svg/FAI/BATHROOM/Washstand_square.svg",
      "start": 1991962,
      "end": 1996954
    }, {
      "filename": "/svg/FAI/BATHROOM/Water_faucet.svg",
      "start": 1996954,
      "end": 2031769
    }, {
      "filename": "/svg/FAI/BATHROOM/Water_heater.svg",
      "start": 2031769,
      "end": 2047253
    }, {
      "filename": "/svg/FAI/BEDROOM/Custom_obj_bedroom.svg",
      "start": 2047253,
      "end": 2047646
    }, {
      "filename": "/svg/FAI/BEDROOM/Double_bed.svg",
      "start": 2047646,
      "end": 2048271
    }, {
      "filename": "/svg/FAI/BEDROOM/Double_bed_nightstands.svg",
      "start": 2048271,
      "end": 2049256
    }, {
      "filename": "/svg/FAI/BEDROOM/Nightstand.svg",
      "start": 2049256,
      "end": 2049622
    }, {
      "filename": "/svg/FAI/BEDROOM/Single_bed.svg",
      "start": 2049622,
      "end": 2050122
    }, {
      "filename": "/svg/FAI/BEDROOM/Sliding_wardrobe.svg",
      "start": 2050122,
      "end": 2050621
    }, {
      "filename": "/svg/FAI/BEDROOM/Warderobe_1_Door.svg",
      "start": 2050621,
      "end": 2051121
    }, {
      "filename": "/svg/FAI/BEDROOM/Warderobe_2_Door.svg",
      "start": 2051121,
      "end": 2051751
    }, {
      "filename": "/svg/FAI/BEDROOM/bed_01.svg",
      "start": 2051751,
      "end": 2053616
    }, {
      "filename": "/svg/FAI/BEDROOM/bed_02.svg",
      "start": 2053616,
      "end": 2055626
    }, {
      "filename": "/svg/FAI/DOOR/Door.svg",
      "start": 2055626,
      "end": 2057517
    }, {
      "filename": "/svg/FAI/DOOR/DoubleDoor.svg",
      "start": 2057517,
      "end": 2060514
    }, {
      "filename": "/svg/FAI/DOOR/Double_sliding_doors.svg",
      "start": 2060514,
      "end": 2061676
    }, {
      "filename": "/svg/FAI/DOOR/Garage_door.svg",
      "start": 2061676,
      "end": 2062540
    }, {
      "filename": "/svg/FAI/DOOR/Glass_door.svg",
      "start": 2062540,
      "end": 2064636
    }, {
      "filename": "/svg/FAI/DOOR/Open_doorway.svg",
      "start": 2064636,
      "end": 2065334
    }, {
      "filename": "/svg/FAI/DOOR/Sliding_door.svg",
      "start": 2065334,
      "end": 2066262
    }, {
      "filename": "/svg/FAI/KITCHEN/Bench_double_sink.svg",
      "start": 2066262,
      "end": 2066624
    }, {
      "filename": "/svg/FAI/KITCHEN/Cabinet_high.svg",
      "start": 2066624,
      "end": 2070635
    }, {
      "filename": "/svg/FAI/KITCHEN/Chimney.svg",
      "start": 2070635,
      "end": 2071013
    }, {
      "filename": "/svg/FAI/KITCHEN/Cooking_stove_small_2_hot_plates.svg",
      "start": 2071013,
      "end": 2076512
    }, {
      "filename": "/svg/FAI/KITCHEN/Cooking_stove_small_Standard_4_hot_plates.svg",
      "start": 2076512,
      "end": 2085773
    }, {
      "filename": "/svg/FAI/KITCHEN/Custom_obj_bath.svg",
      "start": 2085773,
      "end": 2086154
    }, {
      "filename": "/svg/FAI/KITCHEN/Custom_obj_kitchen.svg",
      "start": 2086154,
      "end": 2086547
    }, {
      "filename": "/svg/FAI/KITCHEN/Dishwasher.svg",
      "start": 2086547,
      "end": 2091396
    }, {
      "filename": "/svg/FAI/KITCHEN/Double_sink.svg",
      "start": 2091396,
      "end": 2155297
    }, {
      "filename": "/svg/FAI/KITCHEN/Freezer.svg",
      "start": 2155297,
      "end": 2157063
    }, {
      "filename": "/svg/FAI/KITCHEN/Genobj.svg",
      "start": 2157063,
      "end": 2158174
    }, {
      "filename": "/svg/FAI/KITCHEN/Graded_conrner_kitchen__bench.svg",
      "start": 2158174,
      "end": 2162123
    }, {
      "filename": "/svg/FAI/KITCHEN/Graded_conrner_kitchen__bench_with_stove.svg",
      "start": 2162123,
      "end": 2193853
    }, {
      "filename": "/svg/FAI/KITCHEN/Graded_conrner_kitchen_bench.svg",
      "start": 2193853,
      "end": 2194683
    }, {
      "filename": "/svg/FAI/KITCHEN/Graded_conrner_kitchen_bench_with_stove.svg",
      "start": 2194683,
      "end": 2210368
    }, {
      "filename": "/svg/FAI/KITCHEN/Hood.svg",
      "start": 2210368,
      "end": 2211330
    }, {
      "filename": "/svg/FAI/KITCHEN/Induction_cooker2.svg",
      "start": 2211330,
      "end": 2215858
    }, {
      "filename": "/svg/FAI/KITCHEN/Induction_cooker4.svg",
      "start": 2215858,
      "end": 2223951
    }, {
      "filename": "/svg/FAI/KITCHEN/Kitchen_bench.svg",
      "start": 2223951,
      "end": 2224435
    }, {
      "filename": "/svg/FAI/KITCHEN/Refrigerator.svg",
      "start": 2224435,
      "end": 2225544
    }, {
      "filename": "/svg/FAI/KITCHEN/Refrigerator_freezer.svg",
      "start": 2225544,
      "end": 2230223
    }, {
      "filename": "/svg/FAI/KITCHEN/Round_kitchen_table.svg",
      "start": 2230223,
      "end": 2310779
    }, {
      "filename": "/svg/FAI/KITCHEN/Single_sink.svg",
      "start": 2310779,
      "end": 2370843
    }, {
      "filename": "/svg/FAI/KITCHEN/Sink_with_dryer_plate.svg",
      "start": 2370843,
      "end": 2426717
    }, {
      "filename": "/svg/FAI/KITCHEN/Table_with_four_chairs.svg",
      "start": 2426717,
      "end": 2443307
    }, {
      "filename": "/svg/FAI/KITCHEN/Table_with_six_chairs.svg",
      "start": 2443307,
      "end": 2467963
    }, {
      "filename": "/svg/FAI/KITCHEN/Table_with_two_chairs.svg",
      "start": 2467963,
      "end": 2476456
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Arm_chair.svg",
      "start": 2476456,
      "end": 2476859
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Booklet.svg",
      "start": 2476859,
      "end": 2477232
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Chair.svg",
      "start": 2477232,
      "end": 2481700
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Chaise_seater_sofa.svg",
      "start": 2481700,
      "end": 2483657
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Coffee_Table.svg",
      "start": 2483657,
      "end": 2484029
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Custom_obj_livingroom.svg",
      "start": 2484029,
      "end": 2484407
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Desk_with_office_chair.svg",
      "start": 2484407,
      "end": 2487162
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Fireplace.svg",
      "start": 2487162,
      "end": 2487943
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Fireplace_corner.svg",
      "start": 2487943,
      "end": 2488677
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Fireplace_round.svg",
      "start": 2488677,
      "end": 2494836
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Fireplace_square.svg",
      "start": 2494836,
      "end": 2496983
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Hatrack.svg",
      "start": 2496983,
      "end": 2497615
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Hatrack2.svg",
      "start": 2497615,
      "end": 2501635
    }, {
      "filename": "/svg/FAI/LIVINGROOM/TV.svg",
      "start": 2501635,
      "end": 2502267
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Three_seater_sofa.svg",
      "start": 2502267,
      "end": 2503015
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Tile_stove.svg",
      "start": 2503015,
      "end": 2509049
    }, {
      "filename": "/svg/FAI/LIVINGROOM/Two_seater_sofa.svg",
      "start": 2509049,
      "end": 2509560
    }, {
      "filename": "/svg/FAI/OBJECTS/Bush.svg",
      "start": 2509560,
      "end": 2515174
    }, {
      "filename": "/svg/FAI/OBJECTS/Bush_01.svg",
      "start": 2515174,
      "end": 2562433
    }, {
      "filename": "/svg/FAI/OBJECTS/Bush_02.svg",
      "start": 2562433,
      "end": 2571603
    }, {
      "filename": "/svg/FAI/OBJECTS/Car.svg",
      "start": 2571603,
      "end": 2575103
    }, {
      "filename": "/svg/FAI/OBJECTS/Compass.svg",
      "start": 2575103,
      "end": 2584100
    }, {
      "filename": "/svg/FAI/OBJECTS/Custom_obj_obj.svg",
      "start": 2584100,
      "end": 2584478
    }, {
      "filename": "/svg/FAI/OBJECTS/Entrance_Arrow.svg",
      "start": 2584478,
      "end": 2584807
    }, {
      "filename": "/svg/FAI/OBJECTS/Furniture_02.svg",
      "start": 2584807,
      "end": 2585188
    }, {
      "filename": "/svg/FAI/OBJECTS/Furniture_round.svg",
      "start": 2585188,
      "end": 2601220
    }, {
      "filename": "/svg/FAI/OBJECTS/North_arrow.svg",
      "start": 2601220,
      "end": 2601846
    }, {
      "filename": "/svg/FAI/OBJECTS/Roof_windows.svg",
      "start": 2601846,
      "end": 2606848
    }, {
      "filename": "/svg/FAI/OBJECTS/Three.svg",
      "start": 2606848,
      "end": 2614150
    }, {
      "filename": "/svg/FAI/STAIR/Arrow_pointing_UP.svg",
      "start": 2614150,
      "end": 2616441
    }, {
      "filename": "/svg/FAI/STAIR/Arrow_pointing_down.svg",
      "start": 2616441,
      "end": 2618302
    }, {
      "filename": "/svg/FAI/STAIR/Arrow_pointing_up_down.svg",
      "start": 2618302,
      "end": 2620037
    }, {
      "filename": "/svg/FAI/STAIR/Balcony.svg",
      "start": 2620037,
      "end": 2622126
    }, {
      "filename": "/svg/FAI/STAIR/Spiral_stairs.svg",
      "start": 2622126,
      "end": 2646969
    }, {
      "filename": "/svg/FAI/WALLTYPE/Chimney.svg",
      "start": 2646969,
      "end": 2648659
    }, {
      "filename": "/svg/FAI/WALLTYPE/Column.svg",
      "start": 2648659,
      "end": 2650323
    }, {
      "filename": "/svg/FAI/WALLTYPE/Technical_box.svg",
      "start": 2650323,
      "end": 2651997
    }, {
      "filename": "/svg/FAI/WINDOW/Connected_windoors.svg",
      "start": 2651997,
      "end": 2653748
    }, {
      "filename": "/svg/FAI/WINDOW/Double_window.svg",
      "start": 2653748,
      "end": 2655459
    }, {
      "filename": "/svg/FAI/WINDOW/Quad_window.svg",
      "start": 2655459,
      "end": 2658450
    }, {
      "filename": "/svg/FAI/WINDOW/Roof_Window.svg",
      "start": 2658450,
      "end": 2659241
    }, {
      "filename": "/svg/FAI/WINDOW/Separated_windows.svg",
      "start": 2659241,
      "end": 2660676
    }, {
      "filename": "/svg/FAI/WINDOW/Triple_window.svg",
      "start": 2660676,
      "end": 2662427
    }, {
      "filename": "/svg/FAI/WINDOW/Window.svg",
      "start": 2662427,
      "end": 2663474
    }, {
      "filename": "/svg/FF/BATHROOM/Bathtub.svg",
      "start": 2663474,
      "end": 2672176
    }, {
      "filename": "/svg/FF/BATHROOM/Bathtub_corner.svg",
      "start": 2672176,
      "end": 2675934
    }, {
      "filename": "/svg/FF/BATHROOM/Custom_obj_bath.svg",
      "start": 2675934,
      "end": 2676315
    }, {
      "filename": "/svg/FF/BATHROOM/Dusch.svg",
      "start": 2676315,
      "end": 2677007
    }, {
      "filename": "/svg/FF/BATHROOM/Shower_cab.svg",
      "start": 2677007,
      "end": 2677783
    }, {
      "filename": "/svg/FF/BATHROOM/Shower_cab_corner.svg",
      "start": 2677783,
      "end": 2678559
    }, {
      "filename": "/svg/FF/BATHROOM/Shower_cab_corner_graded.svg",
      "start": 2678559,
      "end": 2679371
    }, {
      "filename": "/svg/FF/BATHROOM/Shower_cab_corner_round.svg",
      "start": 2679371,
      "end": 2681910
    }, {
      "filename": "/svg/FF/BATHROOM/Shower_cab_corner_round_part.svg",
      "start": 2681910,
      "end": 2686704
    }, {
      "filename": "/svg/FF/BATHROOM/Tumble_dryer.svg",
      "start": 2686704,
      "end": 2690833
    }, {
      "filename": "/svg/FF/BATHROOM/WC_tank.svg",
      "start": 2690833,
      "end": 2696155
    }, {
      "filename": "/svg/FF/BATHROOM/WC_wall.svg",
      "start": 2696155,
      "end": 2699797
    }, {
      "filename": "/svg/FF/BATHROOM/Wardrobe.svg",
      "start": 2699797,
      "end": 2700822
    }, {
      "filename": "/svg/FF/BATHROOM/Washing_machine.svg",
      "start": 2700822,
      "end": 2709915
    }, {
      "filename": "/svg/FF/BATHROOM/Washstand.svg",
      "start": 2709915,
      "end": 2739655
    }, {
      "filename": "/svg/FF/BATHROOM/Washstand_cab.svg",
      "start": 2739655,
      "end": 2769560
    }, {
      "filename": "/svg/FF/BATHROOM/Washstand_corner.svg",
      "start": 2769560,
      "end": 2777761
    }, {
      "filename": "/svg/FF/BATHROOM/Washstand_round.svg",
      "start": 2777761,
      "end": 2787481
    }, {
      "filename": "/svg/FF/BATHROOM/Washstand_square.svg",
      "start": 2787481,
      "end": 2792473
    }, {
      "filename": "/svg/FF/BATHROOM/Water_faucet.svg",
      "start": 2792473,
      "end": 2827288
    }, {
      "filename": "/svg/FF/BATHROOM/Water_heater.svg",
      "start": 2827288,
      "end": 2842772
    }, {
      "filename": "/svg/FF/BEDROOM/Custom_obj_bedroom.svg",
      "start": 2842772,
      "end": 2843165
    }, {
      "filename": "/svg/FF/BEDROOM/Double_bed.svg",
      "start": 2843165,
      "end": 2843790
    }, {
      "filename": "/svg/FF/BEDROOM/Double_bed_nightstands.svg",
      "start": 2843790,
      "end": 2844775
    }, {
      "filename": "/svg/FF/BEDROOM/Nightstand.svg",
      "start": 2844775,
      "end": 2845141
    }, {
      "filename": "/svg/FF/BEDROOM/Single_bed.svg",
      "start": 2845141,
      "end": 2845641
    }, {
      "filename": "/svg/FF/BEDROOM/Sliding_wardrobe.svg",
      "start": 2845641,
      "end": 2846140
    }, {
      "filename": "/svg/FF/BEDROOM/Warderobe_1_Door.svg",
      "start": 2846140,
      "end": 2846640
    }, {
      "filename": "/svg/FF/BEDROOM/Warderobe_2_Door.svg",
      "start": 2846640,
      "end": 2847270
    }, {
      "filename": "/svg/FF/DOOR/Door.svg",
      "start": 2847270,
      "end": 2848850
    }, {
      "filename": "/svg/FF/DOOR/DoubleDoor.svg",
      "start": 2848850,
      "end": 2851236
    }, {
      "filename": "/svg/FF/DOOR/Double_door_solid_glass.svg",
      "start": 2851236,
      "end": 2853920
    }, {
      "filename": "/svg/FF/DOOR/Double_sliding_doors.svg",
      "start": 2853920,
      "end": 2855361
    }, {
      "filename": "/svg/FF/DOOR/Garage_door.svg",
      "start": 2855361,
      "end": 2856521
    }, {
      "filename": "/svg/FF/DOOR/Glass_door.svg",
      "start": 2856521,
      "end": 2858394
    }, {
      "filename": "/svg/FF/DOOR/Open_doorway.svg",
      "start": 2858394,
      "end": 2858951
    }, {
      "filename": "/svg/FF/DOOR/Sliding_door.svg",
      "start": 2858951,
      "end": 2859942
    }, {
      "filename": "/svg/FF/KITCHEN/Bench_double_sink.svg",
      "start": 2859942,
      "end": 2860304
    }, {
      "filename": "/svg/FF/KITCHEN/Cabinet_high.svg",
      "start": 2860304,
      "end": 2864315
    }, {
      "filename": "/svg/FF/KITCHEN/Chimney.svg",
      "start": 2864315,
      "end": 2864693
    }, {
      "filename": "/svg/FF/KITCHEN/Custom_obj_bath.svg",
      "start": 2864693,
      "end": 2865074
    }, {
      "filename": "/svg/FF/KITCHEN/Custom_obj_kitchen.svg",
      "start": 2865074,
      "end": 2865467
    }, {
      "filename": "/svg/FF/KITCHEN/Dishwasher.svg",
      "start": 2865467,
      "end": 2866891
    }, {
      "filename": "/svg/FF/KITCHEN/Double_sink.svg",
      "start": 2866891,
      "end": 2930792
    }, {
      "filename": "/svg/FF/KITCHEN/Freezer.svg",
      "start": 2930792,
      "end": 2932558
    }, {
      "filename": "/svg/FF/KITCHEN/Genobj.svg",
      "start": 2932558,
      "end": 2933669
    }, {
      "filename": "/svg/FF/KITCHEN/Graded_conrner_kitchen_bench.svg",
      "start": 2933669,
      "end": 2934499
    }, {
      "filename": "/svg/FF/KITCHEN/Graded_conrner_kitchen_bench_with_stove.svg",
      "start": 2934499,
      "end": 2950184
    }, {
      "filename": "/svg/FF/KITCHEN/Hood.svg",
      "start": 2950184,
      "end": 2951146
    }, {
      "filename": "/svg/FF/KITCHEN/Induction_cooker2.svg",
      "start": 2951146,
      "end": 2955674
    }, {
      "filename": "/svg/FF/KITCHEN/Induction_cooker4.svg",
      "start": 2955674,
      "end": 2963767
    }, {
      "filename": "/svg/FF/KITCHEN/Kitchen_bench.svg",
      "start": 2963767,
      "end": 2964251
    }, {
      "filename": "/svg/FF/KITCHEN/Refrigerator.svg",
      "start": 2964251,
      "end": 2965360
    }, {
      "filename": "/svg/FF/KITCHEN/Refrigerator_freezer.svg",
      "start": 2965360,
      "end": 2966505
    }, {
      "filename": "/svg/FF/KITCHEN/Round_kitchen_table.svg",
      "start": 2966505,
      "end": 3047061
    }, {
      "filename": "/svg/FF/KITCHEN/Single_sink.svg",
      "start": 3047061,
      "end": 3107125
    }, {
      "filename": "/svg/FF/KITCHEN/Sink_with_dryer_plate.svg",
      "start": 3107125,
      "end": 3162999
    }, {
      "filename": "/svg/FF/KITCHEN/Table_with_four_chairs.svg",
      "start": 3162999,
      "end": 3179589
    }, {
      "filename": "/svg/FF/KITCHEN/Table_with_six_chairs.svg",
      "start": 3179589,
      "end": 3204245
    }, {
      "filename": "/svg/FF/KITCHEN/Table_with_two_chairs.svg",
      "start": 3204245,
      "end": 3212738
    }, {
      "filename": "/svg/FF/LIVINGROOM/Arm_chair.svg",
      "start": 3212738,
      "end": 3213141
    }, {
      "filename": "/svg/FF/LIVINGROOM/Booklet.svg",
      "start": 3213141,
      "end": 3213514
    }, {
      "filename": "/svg/FF/LIVINGROOM/Chair.svg",
      "start": 3213514,
      "end": 3217982
    }, {
      "filename": "/svg/FF/LIVINGROOM/Chaise_seater_sofa.svg",
      "start": 3217982,
      "end": 3219939
    }, {
      "filename": "/svg/FF/LIVINGROOM/Coffee_Table.svg",
      "start": 3219939,
      "end": 3220311
    }, {
      "filename": "/svg/FF/LIVINGROOM/Custom_obj_livingroom.svg",
      "start": 3220311,
      "end": 3220689
    }, {
      "filename": "/svg/FF/LIVINGROOM/Desk_with_office_chair.svg",
      "start": 3220689,
      "end": 3223444
    }, {
      "filename": "/svg/FF/LIVINGROOM/Fireplace.svg",
      "start": 3223444,
      "end": 3224225
    }, {
      "filename": "/svg/FF/LIVINGROOM/Fireplace_corner.svg",
      "start": 3224225,
      "end": 3224959
    }, {
      "filename": "/svg/FF/LIVINGROOM/Fireplace_round.svg",
      "start": 3224959,
      "end": 3231118
    }, {
      "filename": "/svg/FF/LIVINGROOM/Hatrack.svg",
      "start": 3231118,
      "end": 3231750
    }, {
      "filename": "/svg/FF/LIVINGROOM/TV.svg",
      "start": 3231750,
      "end": 3232382
    }, {
      "filename": "/svg/FF/LIVINGROOM/Three_seater_sofa.svg",
      "start": 3232382,
      "end": 3233130
    }, {
      "filename": "/svg/FF/LIVINGROOM/Tile_stove.svg",
      "start": 3233130,
      "end": 3239164
    }, {
      "filename": "/svg/FF/LIVINGROOM/Two_seater_sofa.svg",
      "start": 3239164,
      "end": 3239675
    }, {
      "filename": "/svg/FF/OBJECTS/Bush.svg",
      "start": 3239675,
      "end": 3245289
    }, {
      "filename": "/svg/FF/OBJECTS/Car.svg",
      "start": 3245289,
      "end": 3248789
    }, {
      "filename": "/svg/FF/OBJECTS/Custom_obj_obj.svg",
      "start": 3248789,
      "end": 3249167
    }, {
      "filename": "/svg/FF/OBJECTS/Entrance_Arrow.svg",
      "start": 3249167,
      "end": 3249496
    }, {
      "filename": "/svg/FF/OBJECTS/Furniture_02.svg",
      "start": 3249496,
      "end": 3249877
    }, {
      "filename": "/svg/FF/OBJECTS/Furniture_round.svg",
      "start": 3249877,
      "end": 3265909
    }, {
      "filename": "/svg/FF/OBJECTS/North_arrow.svg",
      "start": 3265909,
      "end": 3266535
    }, {
      "filename": "/svg/FF/OBJECTS/Roof_windows.svg",
      "start": 3266535,
      "end": 3271537
    }, {
      "filename": "/svg/FF/OBJECTS/Three.svg",
      "start": 3271537,
      "end": 3278839
    }, {
      "filename": "/svg/FF/STAIR/Arrow_pointing_UP.svg",
      "start": 3278839,
      "end": 3281130
    }, {
      "filename": "/svg/FF/STAIR/Arrow_pointing_down.svg",
      "start": 3281130,
      "end": 3282991
    }, {
      "filename": "/svg/FF/STAIR/Arrow_pointing_up_down.svg",
      "start": 3282991,
      "end": 3284726
    }, {
      "filename": "/svg/FF/STAIR/Balcony.svg",
      "start": 3284726,
      "end": 3286815
    }, {
      "filename": "/svg/FF/STAIR/Spiral_stairs.svg",
      "start": 3286815,
      "end": 3311658
    }, {
      "filename": "/svg/FF/WALLTYPE/Chimney.svg",
      "start": 3311658,
      "end": 3313348
    }, {
      "filename": "/svg/FF/WALLTYPE/Column.svg",
      "start": 3313348,
      "end": 3315012
    }, {
      "filename": "/svg/FF/WALLTYPE/Column_circle.svg",
      "start": 3315012,
      "end": 3316643
    }, {
      "filename": "/svg/FF/WALLTYPE/Technical_box.svg",
      "start": 3316643,
      "end": 3318317
    }, {
      "filename": "/svg/FF/WINDOW/Double_window.svg",
      "start": 3318317,
      "end": 3319729
    }, {
      "filename": "/svg/FF/WINDOW/Quad_window.svg",
      "start": 3319729,
      "end": 3322095
    }, {
      "filename": "/svg/FF/WINDOW/Roof_Window.svg",
      "start": 3322095,
      "end": 3322886
    }, {
      "filename": "/svg/FF/WINDOW/Separated_windows.svg",
      "start": 3322886,
      "end": 3324321
    }, {
      "filename": "/svg/FF/WINDOW/Triple_window.svg",
      "start": 3324321,
      "end": 3326235
    }, {
      "filename": "/svg/FF/WINDOW/Window.svg",
      "start": 3326235,
      "end": 3327246
    }, {
      "filename": "/svg/FIF/BATHROOM/Bathtub.svg",
      "start": 3327246,
      "end": 3335948
    }, {
      "filename": "/svg/FIF/BATHROOM/Bathtub_corner.svg",
      "start": 3335948,
      "end": 3339706
    }, {
      "filename": "/svg/FIF/BATHROOM/Bathtub_corner_bath.svg",
      "start": 3339706,
      "end": 3344543
    }, {
      "filename": "/svg/FIF/BATHROOM/Custom_obj_bath.svg",
      "start": 3344543,
      "end": 3344924
    }, {
      "filename": "/svg/FIF/BATHROOM/Dusch.svg",
      "start": 3344924,
      "end": 3345616
    }, {
      "filename": "/svg/FIF/BATHROOM/Handbasin_bath.svg",
      "start": 3345616,
      "end": 3587855
    }, {
      "filename": "/svg/FIF/BATHROOM/Shower_cab.svg",
      "start": 3587855,
      "end": 3588631
    }, {
      "filename": "/svg/FIF/BATHROOM/Shower_cab_corner.svg",
      "start": 3588631,
      "end": 3589407
    }, {
      "filename": "/svg/FIF/BATHROOM/Shower_cab_corner_graded.svg",
      "start": 3589407,
      "end": 3590219
    }, {
      "filename": "/svg/FIF/BATHROOM/Shower_cab_corner_round.svg",
      "start": 3590219,
      "end": 3592758
    }, {
      "filename": "/svg/FIF/BATHROOM/Shower_cab_corner_round_part.svg",
      "start": 3592758,
      "end": 3597552
    }, {
      "filename": "/svg/FIF/BATHROOM/Shower_cabin.svg",
      "start": 3597552,
      "end": 3599700
    }, {
      "filename": "/svg/FIF/BATHROOM/Toilet_WC.svg",
      "start": 3599700,
      "end": 3608942
    }, {
      "filename": "/svg/FIF/BATHROOM/Tumble_dryer.svg",
      "start": 3608942,
      "end": 3613071
    }, {
      "filename": "/svg/FIF/BATHROOM/WC_tank.svg",
      "start": 3613071,
      "end": 3618393
    }, {
      "filename": "/svg/FIF/BATHROOM/WC_wall.svg",
      "start": 3618393,
      "end": 3622035
    }, {
      "filename": "/svg/FIF/BATHROOM/Wardrobe.svg",
      "start": 3622035,
      "end": 3623060
    }, {
      "filename": "/svg/FIF/BATHROOM/Washbasin_round.svg",
      "start": 3623060,
      "end": 3635029
    }, {
      "filename": "/svg/FIF/BATHROOM/Washbasin_square.svg",
      "start": 3635029,
      "end": 3640571
    }, {
      "filename": "/svg/FIF/BATHROOM/Washing_machine.svg",
      "start": 3640571,
      "end": 3649664
    }, {
      "filename": "/svg/FIF/BATHROOM/Washstand.svg",
      "start": 3649664,
      "end": 3679404
    }, {
      "filename": "/svg/FIF/BATHROOM/Washstand_cab.svg",
      "start": 3679404,
      "end": 3709309
    }, {
      "filename": "/svg/FIF/BATHROOM/Washstand_corner.svg",
      "start": 3709309,
      "end": 3717510
    }, {
      "filename": "/svg/FIF/BATHROOM/Washstand_round.svg",
      "start": 3717510,
      "end": 3727230
    }, {
      "filename": "/svg/FIF/BATHROOM/Washstand_square.svg",
      "start": 3727230,
      "end": 3732222
    }, {
      "filename": "/svg/FIF/BATHROOM/Water_faucet.svg",
      "start": 3732222,
      "end": 3767037
    }, {
      "filename": "/svg/FIF/BATHROOM/Water_heater.svg",
      "start": 3767037,
      "end": 3782521
    }, {
      "filename": "/svg/FIF/BEDROOM/Custom_obj_bedroom.svg",
      "start": 3782521,
      "end": 3782914
    }, {
      "filename": "/svg/FIF/BEDROOM/Double_bed.svg",
      "start": 3782914,
      "end": 3783539
    }, {
      "filename": "/svg/FIF/BEDROOM/Double_bed_nightstands.svg",
      "start": 3783539,
      "end": 3784524
    }, {
      "filename": "/svg/FIF/BEDROOM/Nightstand.svg",
      "start": 3784524,
      "end": 3784890
    }, {
      "filename": "/svg/FIF/BEDROOM/Single_bed.svg",
      "start": 3784890,
      "end": 3785390
    }, {
      "filename": "/svg/FIF/BEDROOM/Sliding_wardrobe.svg",
      "start": 3785390,
      "end": 3785889
    }, {
      "filename": "/svg/FIF/BEDROOM/Warderobe_1_Door.svg",
      "start": 3785889,
      "end": 3786389
    }, {
      "filename": "/svg/FIF/BEDROOM/Warderobe_2_Door.svg",
      "start": 3786389,
      "end": 3787019
    }, {
      "filename": "/svg/FIF/BEDROOM/bed_01.svg",
      "start": 3787019,
      "end": 3788884
    }, {
      "filename": "/svg/FIF/BEDROOM/bed_02.svg",
      "start": 3788884,
      "end": 3790894
    }, {
      "filename": "/svg/FIF/DOOR/Door.svg",
      "start": 3790894,
      "end": 3792785
    }, {
      "filename": "/svg/FIF/DOOR/DoubleDoor.svg",
      "start": 3792785,
      "end": 3795782
    }, {
      "filename": "/svg/FIF/DOOR/Double_sliding_doors.svg",
      "start": 3795782,
      "end": 3796944
    }, {
      "filename": "/svg/FIF/DOOR/Garage_door.svg",
      "start": 3796944,
      "end": 3797808
    }, {
      "filename": "/svg/FIF/DOOR/Glass_door.svg",
      "start": 3797808,
      "end": 3799904
    }, {
      "filename": "/svg/FIF/DOOR/Open_doorway.svg",
      "start": 3799904,
      "end": 3800602
    }, {
      "filename": "/svg/FIF/DOOR/Sliding_door.svg",
      "start": 3800602,
      "end": 3801530
    }, {
      "filename": "/svg/FIF/KITCHEN/Bench_double_sink.svg",
      "start": 3801530,
      "end": 3801892
    }, {
      "filename": "/svg/FIF/KITCHEN/Cabinet_high.svg",
      "start": 3801892,
      "end": 3805903
    }, {
      "filename": "/svg/FIF/KITCHEN/Chimney.svg",
      "start": 3805903,
      "end": 3806281
    }, {
      "filename": "/svg/FIF/KITCHEN/Cooking_stove_small_2_hot_plates.svg",
      "start": 3806281,
      "end": 3811780
    }, {
      "filename": "/svg/FIF/KITCHEN/Cooking_stove_small_Standard_4_hot_plates.svg",
      "start": 3811780,
      "end": 3821041
    }, {
      "filename": "/svg/FIF/KITCHEN/Custom_obj_bath.svg",
      "start": 3821041,
      "end": 3821422
    }, {
      "filename": "/svg/FIF/KITCHEN/Custom_obj_kitchen.svg",
      "start": 3821422,
      "end": 3821815
    }, {
      "filename": "/svg/FIF/KITCHEN/Dishwasher.svg",
      "start": 3821815,
      "end": 3826664
    }, {
      "filename": "/svg/FIF/KITCHEN/Double_sink.svg",
      "start": 3826664,
      "end": 3890565
    }, {
      "filename": "/svg/FIF/KITCHEN/Freezer.svg",
      "start": 3890565,
      "end": 3892331
    }, {
      "filename": "/svg/FIF/KITCHEN/Genobj.svg",
      "start": 3892331,
      "end": 3893442
    }, {
      "filename": "/svg/FIF/KITCHEN/Graded_conrner_kitchen__bench.svg",
      "start": 3893442,
      "end": 3897391
    }, {
      "filename": "/svg/FIF/KITCHEN/Graded_conrner_kitchen__bench_with_stove.svg",
      "start": 3897391,
      "end": 3929121
    }, {
      "filename": "/svg/FIF/KITCHEN/Graded_conrner_kitchen_bench.svg",
      "start": 3929121,
      "end": 3929951
    }, {
      "filename": "/svg/FIF/KITCHEN/Graded_conrner_kitchen_bench_with_stove.svg",
      "start": 3929951,
      "end": 3945636
    }, {
      "filename": "/svg/FIF/KITCHEN/Hood.svg",
      "start": 3945636,
      "end": 3946598
    }, {
      "filename": "/svg/FIF/KITCHEN/Induction_cooker2.svg",
      "start": 3946598,
      "end": 3951126
    }, {
      "filename": "/svg/FIF/KITCHEN/Induction_cooker4.svg",
      "start": 3951126,
      "end": 3959219
    }, {
      "filename": "/svg/FIF/KITCHEN/Kitchen_bench.svg",
      "start": 3959219,
      "end": 3959703
    }, {
      "filename": "/svg/FIF/KITCHEN/Refrigerator.svg",
      "start": 3959703,
      "end": 3960812
    }, {
      "filename": "/svg/FIF/KITCHEN/Refrigerator_freezer.svg",
      "start": 3960812,
      "end": 3961957
    }, {
      "filename": "/svg/FIF/KITCHEN/Round_kitchen_table.svg",
      "start": 3961957,
      "end": 4042513
    }, {
      "filename": "/svg/FIF/KITCHEN/Single_sink.svg",
      "start": 4042513,
      "end": 4102577
    }, {
      "filename": "/svg/FIF/KITCHEN/Sink_with_dryer_plate.svg",
      "start": 4102577,
      "end": 4158451
    }, {
      "filename": "/svg/FIF/KITCHEN/Table_with_four_chairs.svg",
      "start": 4158451,
      "end": 4175041
    }, {
      "filename": "/svg/FIF/KITCHEN/Table_with_six_chairs.svg",
      "start": 4175041,
      "end": 4199697
    }, {
      "filename": "/svg/FIF/KITCHEN/Table_with_two_chairs.svg",
      "start": 4199697,
      "end": 4208190
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Arm_chair.svg",
      "start": 4208190,
      "end": 4208593
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Booklet.svg",
      "start": 4208593,
      "end": 4208966
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Chair.svg",
      "start": 4208966,
      "end": 4213434
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Chaise_seater_sofa.svg",
      "start": 4213434,
      "end": 4215391
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Coffee_Table.svg",
      "start": 4215391,
      "end": 4215763
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Custom_obj_livingroom.svg",
      "start": 4215763,
      "end": 4216141
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Desk_with_office_chair.svg",
      "start": 4216141,
      "end": 4218896
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Fireplace.svg",
      "start": 4218896,
      "end": 4219677
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Fireplace_corner.svg",
      "start": 4219677,
      "end": 4220411
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Fireplace_round.svg",
      "start": 4220411,
      "end": 4226570
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Fireplace_square.svg",
      "start": 4226570,
      "end": 4228717
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Hatrack.svg",
      "start": 4228717,
      "end": 4229349
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Hatrack2.svg",
      "start": 4229349,
      "end": 4233369
    }, {
      "filename": "/svg/FIF/LIVINGROOM/TV.svg",
      "start": 4233369,
      "end": 4234001
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Three_seater_sofa.svg",
      "start": 4234001,
      "end": 4234749
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Tile_stove.svg",
      "start": 4234749,
      "end": 4240783
    }, {
      "filename": "/svg/FIF/LIVINGROOM/Two_seater_sofa.svg",
      "start": 4240783,
      "end": 4241294
    }, {
      "filename": "/svg/FIF/OBJECTS/Bush.svg",
      "start": 4241294,
      "end": 4246908
    }, {
      "filename": "/svg/FIF/OBJECTS/Bush_01.svg",
      "start": 4246908,
      "end": 4294167
    }, {
      "filename": "/svg/FIF/OBJECTS/Bush_02.svg",
      "start": 4294167,
      "end": 4303337
    }, {
      "filename": "/svg/FIF/OBJECTS/Car.svg",
      "start": 4303337,
      "end": 4306837
    }, {
      "filename": "/svg/FIF/OBJECTS/Compass.svg",
      "start": 4306837,
      "end": 4315834
    }, {
      "filename": "/svg/FIF/OBJECTS/Custom_obj_obj.svg",
      "start": 4315834,
      "end": 4316212
    }, {
      "filename": "/svg/FIF/OBJECTS/Entrance_Arrow.svg",
      "start": 4316212,
      "end": 4316541
    }, {
      "filename": "/svg/FIF/OBJECTS/Furniture_02.svg",
      "start": 4316541,
      "end": 4316922
    }, {
      "filename": "/svg/FIF/OBJECTS/Furniture_round.svg",
      "start": 4316922,
      "end": 4332954
    }, {
      "filename": "/svg/FIF/OBJECTS/North_arrow.svg",
      "start": 4332954,
      "end": 4333580
    }, {
      "filename": "/svg/FIF/OBJECTS/Roof_windows.svg",
      "start": 4333580,
      "end": 4338582
    }, {
      "filename": "/svg/FIF/OBJECTS/Three.svg",
      "start": 4338582,
      "end": 4345884
    }, {
      "filename": "/svg/FIF/STAIR/Arrow_pointing_UP.svg",
      "start": 4345884,
      "end": 4348175
    }, {
      "filename": "/svg/FIF/STAIR/Arrow_pointing_down.svg",
      "start": 4348175,
      "end": 4350036
    }, {
      "filename": "/svg/FIF/STAIR/Arrow_pointing_up_down.svg",
      "start": 4350036,
      "end": 4351771
    }, {
      "filename": "/svg/FIF/STAIR/Balcony.svg",
      "start": 4351771,
      "end": 4353860
    }, {
      "filename": "/svg/FIF/STAIR/Spiral_stairs.svg",
      "start": 4353860,
      "end": 4378703
    }, {
      "filename": "/svg/FIF/WALLTYPE/Chimney.svg",
      "start": 4378703,
      "end": 4380393
    }, {
      "filename": "/svg/FIF/WALLTYPE/Column.svg",
      "start": 4380393,
      "end": 4382057
    }, {
      "filename": "/svg/FIF/WALLTYPE/Column_circle.svg",
      "start": 4382057,
      "end": 4383687
    }, {
      "filename": "/svg/FIF/WALLTYPE/Technical_box.svg",
      "start": 4383687,
      "end": 4385361
    }, {
      "filename": "/svg/FIF/WINDOW/Connected_windoors.svg",
      "start": 4385361,
      "end": 4387112
    }, {
      "filename": "/svg/FIF/WINDOW/Double_window.svg",
      "start": 4387112,
      "end": 4388823
    }, {
      "filename": "/svg/FIF/WINDOW/Quad_window.svg",
      "start": 4388823,
      "end": 4391814
    }, {
      "filename": "/svg/FIF/WINDOW/Roof_Window.svg",
      "start": 4391814,
      "end": 4392605
    }, {
      "filename": "/svg/FIF/WINDOW/Separated_windows.svg",
      "start": 4392605,
      "end": 4394040
    }, {
      "filename": "/svg/FIF/WINDOW/Triple_window.svg",
      "start": 4394040,
      "end": 4395791
    }, {
      "filename": "/svg/FIF/WINDOW/Window.svg",
      "start": 4395791,
      "end": 4396838
    }, {
      "filename": "/svg/SvgStyles/FAI.json",
      "start": 4396838,
      "end": 4439559
    }, {
      "filename": "/svg/SvgStyles/FF.json",
      "start": 4439559,
      "end": 4482661
    }, {
      "filename": "/svg/SvgStyles/FIF.json",
      "start": 4482661,
      "end": 4525382
    }, {
      "filename": "/svg/SvgStyles/SvgStyles.json",
      "start": 4525382,
      "end": 4525740
    }, {
      "filename": "/svg/SvgStyles/UF.json",
      "start": 4525740,
      "end": 4568363
    }, {
      "filename": "/svg/UF/BATHROOM/Bathtub.svg",
      "start": 4568363,
      "end": 4577065
    }, {
      "filename": "/svg/UF/BATHROOM/Bathtub_corner.svg",
      "start": 4577065,
      "end": 4580823
    }, {
      "filename": "/svg/UF/BATHROOM/Bathtub_corner_bath.svg",
      "start": 4580823,
      "end": 4585660
    }, {
      "filename": "/svg/UF/BATHROOM/Custom_obj_bath.svg",
      "start": 4585660,
      "end": 4586041
    }, {
      "filename": "/svg/UF/BATHROOM/Dusch.svg",
      "start": 4586041,
      "end": 4586733
    }, {
      "filename": "/svg/UF/BATHROOM/Handbasin_bath.svg",
      "start": 4586733,
      "end": 4828972
    }, {
      "filename": "/svg/UF/BATHROOM/Shower_cab.svg",
      "start": 4828972,
      "end": 4829748
    }, {
      "filename": "/svg/UF/BATHROOM/Shower_cab_corner.svg",
      "start": 4829748,
      "end": 4830524
    }, {
      "filename": "/svg/UF/BATHROOM/Shower_cab_corner_graded.svg",
      "start": 4830524,
      "end": 4831336
    }, {
      "filename": "/svg/UF/BATHROOM/Shower_cab_corner_round.svg",
      "start": 4831336,
      "end": 4833875
    }, {
      "filename": "/svg/UF/BATHROOM/Shower_cab_corner_round_part.svg",
      "start": 4833875,
      "end": 4838669
    }, {
      "filename": "/svg/UF/BATHROOM/Shower_cabin.svg",
      "start": 4838669,
      "end": 4840817
    }, {
      "filename": "/svg/UF/BATHROOM/Toilet_WC.svg",
      "start": 4840817,
      "end": 4850059
    }, {
      "filename": "/svg/UF/BATHROOM/Tumble_dryer.svg",
      "start": 4850059,
      "end": 4854188
    }, {
      "filename": "/svg/UF/BATHROOM/WC_tank.svg",
      "start": 4854188,
      "end": 4859510
    }, {
      "filename": "/svg/UF/BATHROOM/WC_wall.svg",
      "start": 4859510,
      "end": 4863152
    }, {
      "filename": "/svg/UF/BATHROOM/Wardrobe.svg",
      "start": 4863152,
      "end": 4864177
    }, {
      "filename": "/svg/UF/BATHROOM/Washbasin_round.svg",
      "start": 4864177,
      "end": 4876146
    }, {
      "filename": "/svg/UF/BATHROOM/Washbasin_square.svg",
      "start": 4876146,
      "end": 4881688
    }, {
      "filename": "/svg/UF/BATHROOM/Washing_machine.svg",
      "start": 4881688,
      "end": 4890781
    }, {
      "filename": "/svg/UF/BATHROOM/Washstand.svg",
      "start": 4890781,
      "end": 4920521
    }, {
      "filename": "/svg/UF/BATHROOM/Washstand_cab.svg",
      "start": 4920521,
      "end": 4950426
    }, {
      "filename": "/svg/UF/BATHROOM/Washstand_corner.svg",
      "start": 4950426,
      "end": 4958627
    }, {
      "filename": "/svg/UF/BATHROOM/Washstand_round.svg",
      "start": 4958627,
      "end": 4968347
    }, {
      "filename": "/svg/UF/BATHROOM/Washstand_square.svg",
      "start": 4968347,
      "end": 4973339
    }, {
      "filename": "/svg/UF/BATHROOM/Water_faucet.svg",
      "start": 4973339,
      "end": 5008154
    }, {
      "filename": "/svg/UF/BATHROOM/Water_heater.svg",
      "start": 5008154,
      "end": 5023638
    }, {
      "filename": "/svg/UF/BEDROOM/Custom_obj_bedroom.svg",
      "start": 5023638,
      "end": 5024031
    }, {
      "filename": "/svg/UF/BEDROOM/Double_bed.svg",
      "start": 5024031,
      "end": 5024656
    }, {
      "filename": "/svg/UF/BEDROOM/Double_bed_nightstands.svg",
      "start": 5024656,
      "end": 5025641
    }, {
      "filename": "/svg/UF/BEDROOM/Nightstand.svg",
      "start": 5025641,
      "end": 5026007
    }, {
      "filename": "/svg/UF/BEDROOM/Single_bed.svg",
      "start": 5026007,
      "end": 5026507
    }, {
      "filename": "/svg/UF/BEDROOM/Sliding_wardrobe.svg",
      "start": 5026507,
      "end": 5027006
    }, {
      "filename": "/svg/UF/BEDROOM/Warderobe_1_Door.svg",
      "start": 5027006,
      "end": 5027506
    }, {
      "filename": "/svg/UF/BEDROOM/Warderobe_2_Door.svg",
      "start": 5027506,
      "end": 5028136
    }, {
      "filename": "/svg/UF/BEDROOM/bed_01.svg",
      "start": 5028136,
      "end": 5030001
    }, {
      "filename": "/svg/UF/BEDROOM/bed_02.svg",
      "start": 5030001,
      "end": 5032011
    }, {
      "filename": "/svg/UF/DOOR/Door.svg",
      "start": 5032011,
      "end": 5033902
    }, {
      "filename": "/svg/UF/DOOR/DoubleDoor.svg",
      "start": 5033902,
      "end": 5036899
    }, {
      "filename": "/svg/UF/DOOR/Double_sliding_doors.svg",
      "start": 5036899,
      "end": 5038061
    }, {
      "filename": "/svg/UF/DOOR/Garage_door.svg",
      "start": 5038061,
      "end": 5038925
    }, {
      "filename": "/svg/UF/DOOR/Glass_door.svg",
      "start": 5038925,
      "end": 5041021
    }, {
      "filename": "/svg/UF/DOOR/Open_doorway.svg",
      "start": 5041021,
      "end": 5041719
    }, {
      "filename": "/svg/UF/DOOR/Sliding_door.svg",
      "start": 5041719,
      "end": 5042647
    }, {
      "filename": "/svg/UF/KITCHEN/Bench_double_sink.svg",
      "start": 5042647,
      "end": 5043009
    }, {
      "filename": "/svg/UF/KITCHEN/Cabinet_high.svg",
      "start": 5043009,
      "end": 5047020
    }, {
      "filename": "/svg/UF/KITCHEN/Chimney.svg",
      "start": 5047020,
      "end": 5047398
    }, {
      "filename": "/svg/UF/KITCHEN/Cooking_stove_small_2_hot_plates.svg",
      "start": 5047398,
      "end": 5052897
    }, {
      "filename": "/svg/UF/KITCHEN/Cooking_stove_small_Standard_4_hot_plates.svg",
      "start": 5052897,
      "end": 5062158
    }, {
      "filename": "/svg/UF/KITCHEN/Custom_obj_bath.svg",
      "start": 5062158,
      "end": 5062539
    }, {
      "filename": "/svg/UF/KITCHEN/Custom_obj_kitchen.svg",
      "start": 5062539,
      "end": 5062932
    }, {
      "filename": "/svg/UF/KITCHEN/Dishwasher.svg",
      "start": 5062932,
      "end": 5067781
    }, {
      "filename": "/svg/UF/KITCHEN/Double_sink.svg",
      "start": 5067781,
      "end": 5131682
    }, {
      "filename": "/svg/UF/KITCHEN/Freezer.svg",
      "start": 5131682,
      "end": 5133448
    }, {
      "filename": "/svg/UF/KITCHEN/Genobj.svg",
      "start": 5133448,
      "end": 5134559
    }, {
      "filename": "/svg/UF/KITCHEN/Graded_conrner_kitchen__bench.svg",
      "start": 5134559,
      "end": 5138508
    }, {
      "filename": "/svg/UF/KITCHEN/Graded_conrner_kitchen__bench_with_stove.svg",
      "start": 5138508,
      "end": 5170238
    }, {
      "filename": "/svg/UF/KITCHEN/Graded_conrner_kitchen_bench.svg",
      "start": 5170238,
      "end": 5171068
    }, {
      "filename": "/svg/UF/KITCHEN/Graded_conrner_kitchen_bench_with_stove.svg",
      "start": 5171068,
      "end": 5186753
    }, {
      "filename": "/svg/UF/KITCHEN/Hood.svg",
      "start": 5186753,
      "end": 5187715
    }, {
      "filename": "/svg/UF/KITCHEN/Induction_cooker2.svg",
      "start": 5187715,
      "end": 5192243
    }, {
      "filename": "/svg/UF/KITCHEN/Induction_cooker4.svg",
      "start": 5192243,
      "end": 5200336
    }, {
      "filename": "/svg/UF/KITCHEN/Kitchen_bench.svg",
      "start": 5200336,
      "end": 5200820
    }, {
      "filename": "/svg/UF/KITCHEN/Refrigerator.svg",
      "start": 5200820,
      "end": 5201929
    }, {
      "filename": "/svg/UF/KITCHEN/Refrigerator_freezer.svg",
      "start": 5201929,
      "end": 5203074
    }, {
      "filename": "/svg/UF/KITCHEN/Round_kitchen_table.svg",
      "start": 5203074,
      "end": 5283630
    }, {
      "filename": "/svg/UF/KITCHEN/Single_sink.svg",
      "start": 5283630,
      "end": 5343694
    }, {
      "filename": "/svg/UF/KITCHEN/Sink_with_dryer_plate.svg",
      "start": 5343694,
      "end": 5399568
    }, {
      "filename": "/svg/UF/KITCHEN/Table_with_four_chairs.svg",
      "start": 5399568,
      "end": 5416158
    }, {
      "filename": "/svg/UF/KITCHEN/Table_with_six_chairs.svg",
      "start": 5416158,
      "end": 5440814
    }, {
      "filename": "/svg/UF/KITCHEN/Table_with_two_chairs.svg",
      "start": 5440814,
      "end": 5449307
    }, {
      "filename": "/svg/UF/LIVINGROOM/Arm_chair.svg",
      "start": 5449307,
      "end": 5449710
    }, {
      "filename": "/svg/UF/LIVINGROOM/Booklet.svg",
      "start": 5449710,
      "end": 5450083
    }, {
      "filename": "/svg/UF/LIVINGROOM/Chair.svg",
      "start": 5450083,
      "end": 5454551
    }, {
      "filename": "/svg/UF/LIVINGROOM/Chaise_seater_sofa.svg",
      "start": 5454551,
      "end": 5456508
    }, {
      "filename": "/svg/UF/LIVINGROOM/Coffee_Table.svg",
      "start": 5456508,
      "end": 5456880
    }, {
      "filename": "/svg/UF/LIVINGROOM/Custom_obj_livingroom.svg",
      "start": 5456880,
      "end": 5457258
    }, {
      "filename": "/svg/UF/LIVINGROOM/Desk_with_office_chair.svg",
      "start": 5457258,
      "end": 5460013
    }, {
      "filename": "/svg/UF/LIVINGROOM/Fireplace.svg",
      "start": 5460013,
      "end": 5460794
    }, {
      "filename": "/svg/UF/LIVINGROOM/Fireplace_corner.svg",
      "start": 5460794,
      "end": 5461528
    }, {
      "filename": "/svg/UF/LIVINGROOM/Fireplace_round.svg",
      "start": 5461528,
      "end": 5467687
    }, {
      "filename": "/svg/UF/LIVINGROOM/Fireplace_square.svg",
      "start": 5467687,
      "end": 5469834
    }, {
      "filename": "/svg/UF/LIVINGROOM/Hatrack.svg",
      "start": 5469834,
      "end": 5470466
    }, {
      "filename": "/svg/UF/LIVINGROOM/Hatrack2.svg",
      "start": 5470466,
      "end": 5474486
    }, {
      "filename": "/svg/UF/LIVINGROOM/TV.svg",
      "start": 5474486,
      "end": 5475118
    }, {
      "filename": "/svg/UF/LIVINGROOM/Three_seater_sofa.svg",
      "start": 5475118,
      "end": 5475866
    }, {
      "filename": "/svg/UF/LIVINGROOM/Tile_stove.svg",
      "start": 5475866,
      "end": 5481900
    }, {
      "filename": "/svg/UF/LIVINGROOM/Two_seater_sofa.svg",
      "start": 5481900,
      "end": 5482411
    }, {
      "filename": "/svg/UF/OBJECTS/Bush.svg",
      "start": 5482411,
      "end": 5488025
    }, {
      "filename": "/svg/UF/OBJECTS/Bush_01.svg",
      "start": 5488025,
      "end": 5535284
    }, {
      "filename": "/svg/UF/OBJECTS/Bush_02.svg",
      "start": 5535284,
      "end": 5544454
    }, {
      "filename": "/svg/UF/OBJECTS/Car.svg",
      "start": 5544454,
      "end": 5547954
    }, {
      "filename": "/svg/UF/OBJECTS/Compass.svg",
      "start": 5547954,
      "end": 5556951
    }, {
      "filename": "/svg/UF/OBJECTS/Custom_obj_obj.svg",
      "start": 5556951,
      "end": 5557329
    }, {
      "filename": "/svg/UF/OBJECTS/Entrance_Arrow.svg",
      "start": 5557329,
      "end": 5557658
    }, {
      "filename": "/svg/UF/OBJECTS/Furniture_02.svg",
      "start": 5557658,
      "end": 5558039
    }, {
      "filename": "/svg/UF/OBJECTS/Furniture_round.svg",
      "start": 5558039,
      "end": 5574071
    }, {
      "filename": "/svg/UF/OBJECTS/North_arrow.svg",
      "start": 5574071,
      "end": 5574697
    }, {
      "filename": "/svg/UF/OBJECTS/Roof_windows.svg",
      "start": 5574697,
      "end": 5579699
    }, {
      "filename": "/svg/UF/OBJECTS/Three.svg",
      "start": 5579699,
      "end": 5587001
    }, {
      "filename": "/svg/UF/STAIR/Arrow_pointing_UP.svg",
      "start": 5587001,
      "end": 5589292
    }, {
      "filename": "/svg/UF/STAIR/Arrow_pointing_down.svg",
      "start": 5589292,
      "end": 5591153
    }, {
      "filename": "/svg/UF/STAIR/Arrow_pointing_up_down.svg",
      "start": 5591153,
      "end": 5592888
    }, {
      "filename": "/svg/UF/STAIR/Balcony.svg",
      "start": 5592888,
      "end": 5594977
    }, {
      "filename": "/svg/UF/STAIR/Spiral_stairs.svg",
      "start": 5594977,
      "end": 5619820
    }, {
      "filename": "/svg/UF/WALLTYPE/Chimney.svg",
      "start": 5619820,
      "end": 5621510
    }, {
      "filename": "/svg/UF/WALLTYPE/Column.svg",
      "start": 5621510,
      "end": 5623174
    }, {
      "filename": "/svg/UF/WALLTYPE/Column_circle.svg",
      "start": 5623174,
      "end": 5624808
    }, {
      "filename": "/svg/UF/WALLTYPE/Technical_box.svg",
      "start": 5624808,
      "end": 5626482
    }, {
      "filename": "/svg/UF/WINDOW/Connected_windoors.svg",
      "start": 5626482,
      "end": 5628233
    }, {
      "filename": "/svg/UF/WINDOW/Double_window.svg",
      "start": 5628233,
      "end": 5629944
    }, {
      "filename": "/svg/UF/WINDOW/Quad_window.svg",
      "start": 5629944,
      "end": 5632935
    }, {
      "filename": "/svg/UF/WINDOW/Roof_Window.svg",
      "start": 5632935,
      "end": 5633726
    }, {
      "filename": "/svg/UF/WINDOW/Separated_windows.svg",
      "start": 5633726,
      "end": 5635161
    }, {
      "filename": "/svg/UF/WINDOW/Triple_window.svg",
      "start": 5635161,
      "end": 5636912
    }, {
      "filename": "/svg/UF/WINDOW/Window.svg",
      "start": 5636912,
      "end": 5637959
    }, {
      "filename": "/ui/.DS_Store",
      "start": 5637959,
      "end": 5652299
    }, {
      "filename": "/ui/Arrow_1.png",
      "start": 5652299,
      "end": 5673852
    }, {
      "filename": "/ui/Button/.DS_Store",
      "start": 5673852,
      "end": 5684096
    }, {
      "filename": "/ui/Button/bt_add.png",
      "start": 5684096,
      "end": 5693936
    }, {
      "filename": "/ui/Button/bt_add_clicked.png",
      "start": 5693936,
      "end": 5704081
    }, {
      "filename": "/ui/Button/bt_arrow.png",
      "start": 5704081,
      "end": 5709447
    }, {
      "filename": "/ui/Button/bt_arrow_clicked.png",
      "start": 5709447,
      "end": 5719052
    }, {
      "filename": "/ui/Button/bt_copy.png",
      "start": 5719052,
      "end": 5733144
    }, {
      "filename": "/ui/Button/bt_copy_clicked.png",
      "start": 5733144,
      "end": 5748326
    }, {
      "filename": "/ui/Button/bt_delete.png",
      "start": 5748326,
      "end": 5759286
    }, {
      "filename": "/ui/Button/bt_edit.png",
      "start": 5759286,
      "end": 5771553
    }, {
      "filename": "/ui/Button/bt_edit_clicked.png",
      "start": 5771553,
      "end": 5784451
    }, {
      "filename": "/ui/Button/bt_flip.png",
      "start": 5784451,
      "end": 5796460
    }, {
      "filename": "/ui/Button/bt_flipY.png",
      "start": 5796460,
      "end": 5808599
    }, {
      "filename": "/ui/Button/bt_flipY_clicked.png",
      "start": 5808599,
      "end": 5821721
    }, {
      "filename": "/ui/Button/bt_flip_clicked.png",
      "start": 5821721,
      "end": 5834837
    }, {
      "filename": "/ui/Button/bt_free.png",
      "start": 5834837,
      "end": 5850307
    }, {
      "filename": "/ui/Button/bt_free_clicked.png",
      "start": 5850307,
      "end": 5862116
    }, {
      "filename": "/ui/Button/bt_info.png",
      "start": 5862116,
      "end": 5868969
    }, {
      "filename": "/ui/Button/bt_info_clicked.png",
      "start": 5868969,
      "end": 5876062
    }, {
      "filename": "/ui/Button/bt_move.png",
      "start": 5876062,
      "end": 5886355
    }, {
      "filename": "/ui/Button/bt_move_left.png",
      "start": 5886355,
      "end": 5895637
    }, {
      "filename": "/ui/Button/bt_move_left_clicked.png",
      "start": 5895637,
      "end": 5905425
    }, {
      "filename": "/ui/Button/bt_move_right.png",
      "start": 5905425,
      "end": 5914585
    }, {
      "filename": "/ui/Button/bt_move_right_clicked.png",
      "start": 5914585,
      "end": 5923811
    }, {
      "filename": "/ui/Button/bt_paste.png",
      "start": 5923811,
      "end": 5938687
    }, {
      "filename": "/ui/Button/bt_paste_clicked.png",
      "start": 5938687,
      "end": 5954123
    }, {
      "filename": "/ui/Button/bt_rotate.png",
      "start": 5954123,
      "end": 5967994
    }, {
      "filename": "/ui/Button/bt_rotate_clicked.png",
      "start": 5967994,
      "end": 5982909
    }, {
      "filename": "/ui/Button/bt_scale.png",
      "start": 5982909,
      "end": 5993416
    }, {
      "filename": "/ui/Button/bt_scaleX.png",
      "start": 5993416,
      "end": 6003822
    }, {
      "filename": "/ui/Button/bt_scaleX_clicked.png",
      "start": 6003822,
      "end": 6014602
    }, {
      "filename": "/ui/Button/bt_scaleY.png",
      "start": 6014602,
      "end": 6025243
    }, {
      "filename": "/ui/Button/bt_scaleY_clicked.png",
      "start": 6025243,
      "end": 6036375
    }, {
      "filename": "/ui/Button/bt_scale_clicked.png",
      "start": 6036375,
      "end": 6047461
    }, {
      "filename": "/ui/Button/btn_background.png",
      "start": 6047461,
      "end": 6048389
    }, {
      "filename": "/ui/Button/eye.png",
      "start": 6048389,
      "end": 6051857
    }, {
      "filename": "/ui/Button/lock-icon.png",
      "start": 6051857,
      "end": 6058317
    }, {
      "filename": "/ui/Button/split.png",
      "start": 6058317,
      "end": 6104526
    }, {
      "filename": "/ui/Button/unlock-icon.png",
      "start": 6104526,
      "end": 6120742
    }, {
      "filename": "/ui/Button/video-play.png",
      "start": 6120742,
      "end": 6136134
    }, {
      "filename": "/ui/CommentMenu/film-roll.png",
      "start": 6136134,
      "end": 6142865
    }, {
      "filename": "/ui/CommentMenu/link.png",
      "start": 6142865,
      "end": 6147944
    }, {
      "filename": "/ui/CommentMenu/picture.png",
      "start": 6147944,
      "end": 6155361
    }, {
      "filename": "/ui/CommentMenu/take_picture.png",
      "start": 6155361,
      "end": 6161984
    }, {
      "filename": "/ui/CommentMenu/text.png",
      "start": 6161984,
      "end": 6169798
    }, {
      "filename": "/ui/CommentMenu/video-record.png",
      "start": 6169798,
      "end": 6179925
    }, {
      "filename": "/ui/Cursor/circle_gray.png",
      "start": 6179925,
      "end": 6181346
    }, {
      "filename": "/ui/Cursor/focusCursor.png",
      "start": 6181346,
      "end": 6181620
    }, {
      "filename": "/ui/Cursor/rotateCursor.png",
      "start": 6181620,
      "end": 6181909
    }, {
      "filename": "/ui/Cursor/scaleCursor.png",
      "start": 6181909,
      "end": 6182338
    }, {
      "filename": "/ui/Cursor/scaleXCursor.png",
      "start": 6182338,
      "end": 6182601
    }, {
      "filename": "/ui/Cursor/scaleYCursor.png",
      "start": 6182601,
      "end": 6182922
    }, {
      "filename": "/ui/Cursor/scroll.png",
      "start": 6182922,
      "end": 6183608
    }, {
      "filename": "/ui/Cursor/target.png",
      "start": 6183608,
      "end": 6188769
    }, {
      "filename": "/ui/DimensionTools/.DS_Store",
      "start": 6188769,
      "end": 6194917
    }, {
      "filename": "/ui/DrawMode/Close.png",
      "start": 6194917,
      "end": 6196483
    }, {
      "filename": "/ui/DrawMode/Curve line selected.png",
      "start": 6196483,
      "end": 6198672
    }, {
      "filename": "/ui/DrawMode/Curve line.png",
      "start": 6198672,
      "end": 6200338
    }, {
      "filename": "/ui/DrawMode/Endsnap_OFF.png",
      "start": 6200338,
      "end": 6202137
    }, {
      "filename": "/ui/DrawMode/Endsnap_ON.png",
      "start": 6202137,
      "end": 6204458
    }, {
      "filename": "/ui/DrawMode/Fast draw selected.png",
      "start": 6204458,
      "end": 6207105
    }, {
      "filename": "/ui/DrawMode/Fast draw.png",
      "start": 6207105,
      "end": 6209113
    }, {
      "filename": "/ui/DrawMode/Normal draw selected.png",
      "start": 6209113,
      "end": 6210403
    }, {
      "filename": "/ui/DrawMode/Normal draw.png",
      "start": 6210403,
      "end": 6211372
    }, {
      "filename": "/ui/DrawMode/Snap grid.png",
      "start": 6211372,
      "end": 6212510
    }, {
      "filename": "/ui/DrawMode/multipleSelect.png",
      "start": 6212510,
      "end": 6214669
    }, {
      "filename": "/ui/DrawMode/perp.png",
      "start": 6214669,
      "end": 6215701
    }, {
      "filename": "/ui/Footer/download.png",
      "start": 6215701,
      "end": 6259524
    }, {
      "filename": "/ui/Footer/network.png",
      "start": 6259524,
      "end": 6264601
    }, {
      "filename": "/ui/Footer/paint_1.png",
      "start": 6264601,
      "end": 6274017
    }, {
      "filename": "/ui/Footer/paint_2.png",
      "start": 6274017,
      "end": 6284063
    }, {
      "filename": "/ui/Footer/server_done.png",
      "start": 6284063,
      "end": 6314475
    }, {
      "filename": "/ui/Footer/upload.png",
      "start": 6314475,
      "end": 6356442
    }, {
      "filename": "/ui/Footer/upload_cloud.png",
      "start": 6356442,
      "end": 6383513
    }, {
      "filename": "/ui/Footer/user_white.png",
      "start": 6383513,
      "end": 6409283
    }, {
      "filename": "/ui/HeaderLayer/LOGO.png",
      "start": 6409283,
      "end": 6424012
    }, {
      "filename": "/ui/HeaderLayer/Sync.png",
      "start": 6424012,
      "end": 6426943
    }, {
      "filename": "/ui/HeaderLayer/done.png",
      "start": 6426943,
      "end": 6430545
    }, {
      "filename": "/ui/HeaderLayer/list.png",
      "start": 6430545,
      "end": 6431754
    }, {
      "filename": "/ui/HeaderLayer/next.png",
      "start": 6431754,
      "end": 6432999
    }, {
      "filename": "/ui/HeaderLayer/save.png",
      "start": 6432999,
      "end": 6434771
    }, {
      "filename": "/ui/HeaderLayer/tool.png",
      "start": 6434771,
      "end": 6436738
    }, {
      "filename": "/ui/HeaderLayer/undo.png",
      "start": 6436738,
      "end": 6437963
    }, {
      "filename": "/ui/Popup/MainMenu/about.png",
      "start": 6437963,
      "end": 6447718
    }, {
      "filename": "/ui/Popup/MainMenu/download.png",
      "start": 6447718,
      "end": 6459212
    }, {
      "filename": "/ui/Popup/MainMenu/export.png",
      "start": 6459212,
      "end": 6475387
    }, {
      "filename": "/ui/Popup/MainMenu/help.png",
      "start": 6475387,
      "end": 6492432
    }, {
      "filename": "/ui/Popup/MainMenu/legal.png",
      "start": 6492432,
      "end": 6506929
    }, {
      "filename": "/ui/Popup/MainMenu/network.png",
      "start": 6506929,
      "end": 6517380
    }, {
      "filename": "/ui/Popup/MainMenu/save.png",
      "start": 6517380,
      "end": 6537679
    }, {
      "filename": "/ui/Popup/MainMenu/setting.png",
      "start": 6537679,
      "end": 6562402
    }, {
      "filename": "/ui/Popup/MainMenu/upload.png",
      "start": 6562402,
      "end": 6573987
    }, {
      "filename": "/ui/Popup/MainMenu/user.png",
      "start": 6573987,
      "end": 6590507
    }, {
      "filename": "/ui/Popup/bgEdit.png",
      "start": 6590507,
      "end": 6591090
    }, {
      "filename": "/ui/Popup/cancel.png",
      "start": 6591090,
      "end": 6606132
    }, {
      "filename": "/ui/Popup/circle.png",
      "start": 6606132,
      "end": 6606770
    }, {
      "filename": "/ui/Popup/close.png",
      "start": 6606770,
      "end": 6610589
    }, {
      "filename": "/ui/Popup/logo.png",
      "start": 6610589,
      "end": 6976315
    }, {
      "filename": "/ui/Popup/mailIcon.png",
      "start": 6976315,
      "end": 6993249
    }, {
      "filename": "/ui/Popup/passIcon.png",
      "start": 6993249,
      "end": 7007402
    }, {
      "filename": "/ui/Popup/passInvisible.png",
      "start": 7007402,
      "end": 7017898
    }, {
      "filename": "/ui/Popup/passVisible.png",
      "start": 7017898,
      "end": 7027546
    }, {
      "filename": "/ui/Popup/previous.png",
      "start": 7027546,
      "end": 7031071
    }, {
      "filename": "/ui/PopupProject/layerBg.png",
      "start": 7031071,
      "end": 7033374
    }, {
      "filename": "/ui/PopupProject/new_project.png",
      "start": 7033374,
      "end": 7038176
    }, {
      "filename": "/ui/PopupProject/open_project.png",
      "start": 7038176,
      "end": 7040583
    }, {
      "filename": "/ui/PopupProject/open_project_cloud.png",
      "start": 7040583,
      "end": 7046514
    }, {
      "filename": "/ui/PopupProject/open_project_clound_color.png",
      "start": 7046514,
      "end": 7054890
    }, {
      "filename": "/ui/PopupProject/open_project_clound_grey.png",
      "start": 7054890,
      "end": 7062926
    }, {
      "filename": "/ui/PopupProject/order.png",
      "start": 7062926,
      "end": 7065935
    }, {
      "filename": "/ui/PopupProject/order_grey.png",
      "start": 7065935,
      "end": 7068506
    }, {
      "filename": "/ui/SelectTool/MultiSelect.png",
      "start": 7068506,
      "end": 7071894
    }, {
      "filename": "/ui/SelectTool/MultiSelect_selected.png",
      "start": 7071894,
      "end": 7075452
    }, {
      "filename": "/ui/SelectTool/SelectAll.png",
      "start": 7075452,
      "end": 7077948
    }, {
      "filename": "/ui/SelectTool/SelectAll_selected.png",
      "start": 7077948,
      "end": 7080518
    }, {
      "filename": "/ui/SelectTool/SelectIcon.png",
      "start": 7080518,
      "end": 7090222
    }, {
      "filename": "/ui/SelectTool/SelectIcon_selected.png",
      "start": 7090222,
      "end": 7100475
    }, {
      "filename": "/ui/SelectTool/layers.png",
      "start": 7100475,
      "end": 7102389
    }, {
      "filename": "/ui/SelectTool/layers_selected.png",
      "start": 7102389,
      "end": 7105760
    }, {
      "filename": "/ui/ToolsFloor/fl1000.png",
      "start": 7105760,
      "end": 7124682
    }, {
      "filename": "/ui/ToolsFloor/fl1001.png",
      "start": 7124682,
      "end": 7141643
    }, {
      "filename": "/ui/ToolsFloor/fl1002.png",
      "start": 7141643,
      "end": 7150564
    }, {
      "filename": "/ui/ToolsFloor/fl1003.png",
      "start": 7150564,
      "end": 7174068
    }, {
      "filename": "/ui/ToolsFloor/fl1004.png",
      "start": 7174068,
      "end": 7189328
    }, {
      "filename": "/ui/ToolsFloor/fl1005.png",
      "start": 7189328,
      "end": 7201945
    }, {
      "filename": "/ui/ToolsFloor/fl1006.png",
      "start": 7201945,
      "end": 7213491
    }, {
      "filename": "/ui/ToolsFloor/fl1007.png",
      "start": 7213491,
      "end": 7229666
    }, {
      "filename": "/ui/ToolsFloor/fl1008.png",
      "start": 7229666,
      "end": 7240050
    }, {
      "filename": "/ui/ToolsFloor/fl1009.png",
      "start": 7240050,
      "end": 7246290
    }, {
      "filename": "/ui/ToolsLayer/ar.png",
      "start": 7246290,
      "end": 7248192
    }, {
      "filename": "/ui/ToolsLayer/bathroom.png",
      "start": 7248192,
      "end": 7250647
    }, {
      "filename": "/ui/ToolsLayer/bedroom.png",
      "start": 7250647,
      "end": 7252386
    }, {
      "filename": "/ui/ToolsLayer/bgButton.png",
      "start": 7252386,
      "end": 7252942
    }, {
      "filename": "/ui/ToolsLayer/blueprint.png",
      "start": 7252942,
      "end": 7254469
    }, {
      "filename": "/ui/ToolsLayer/comment.png",
      "start": 7254469,
      "end": 7256279
    }, {
      "filename": "/ui/ToolsLayer/door.png",
      "start": 7256279,
      "end": 7257723
    }, {
      "filename": "/ui/ToolsLayer/edit.png",
      "start": 7257723,
      "end": 7259168
    }, {
      "filename": "/ui/ToolsLayer/free.png",
      "start": 7259168,
      "end": 7261055
    }, {
      "filename": "/ui/ToolsLayer/invisible.png",
      "start": 7261055,
      "end": 7263941
    }, {
      "filename": "/ui/ToolsLayer/kitchen.png",
      "start": 7263941,
      "end": 7266994
    }, {
      "filename": "/ui/ToolsLayer/list.png",
      "start": 7266994,
      "end": 7269070
    }, {
      "filename": "/ui/ToolsLayer/livingroom.png",
      "start": 7269070,
      "end": 7270114
    }, {
      "filename": "/ui/ToolsLayer/next.png",
      "start": 7270114,
      "end": 7272650
    }, {
      "filename": "/ui/ToolsLayer/objects.png",
      "start": 7272650,
      "end": 7275019
    }, {
      "filename": "/ui/ToolsLayer/stair.png",
      "start": 7275019,
      "end": 7276784
    }, {
      "filename": "/ui/ToolsLayer/text.png",
      "start": 7276784,
      "end": 7279121
    }, {
      "filename": "/ui/ToolsLayer/undo.png",
      "start": 7279121,
      "end": 7281659
    }, {
      "filename": "/ui/ToolsLayer/visible.png",
      "start": 7281659,
      "end": 7283731
    }, {
      "filename": "/ui/ToolsLayer/wall.png",
      "start": 7283731,
      "end": 7284542
    }, {
      "filename": "/ui/ToolsLayer/window.png",
      "start": 7284542,
      "end": 7285464
    }, {
      "filename": "/ui/WallMenu/area_line.png",
      "start": 7285464,
      "end": 7304417
    }, {
      "filename": "/ui/WallMenu/construction_line.png",
      "start": 7304417,
      "end": 7320122
    }, {
      "filename": "/ui/WallMenu/divider.png",
      "start": 7320122,
      "end": 7332169
    }, {
      "filename": "/ui/WallMenu/kitchen_bench_line.png",
      "start": 7332169,
      "end": 7346661
    }, {
      "filename": "/ui/WallMenu/kitchen_wall.png",
      "start": 7346661,
      "end": 7360177
    }, {
      "filename": "/ui/WallMenu/railing_line.png",
      "start": 7360177,
      "end": 7376682
    }, {
      "filename": "/ui/WallMenu/roof_line.png",
      "start": 7376682,
      "end": 7391261
    }, {
      "filename": "/ui/WallMenu/wall_1.png",
      "start": 7391261,
      "end": 7405239
    }, {
      "filename": "/ui/backgound.png",
      "start": 7405239,
      "end": 7408601
    }, {
      "filename": "/ui/button_background.png",
      "start": 7408601,
      "end": 7408758
    }, {
      "filename": "/ui/checkbox/CheckBoxNode_Disable.png",
      "start": 7408758,
      "end": 7409989
    }, {
      "filename": "/ui/checkbox/CheckBoxNode_Normal.png",
      "start": 7409989,
      "end": 7411230
    }, {
      "filename": "/ui/checkbox/CheckBox_Disable.png",
      "start": 7411230,
      "end": 7412434
    }, {
      "filename": "/ui/checkbox/CheckBox_Normal.png",
      "start": 7412434,
      "end": 7413638
    }, {
      "filename": "/ui/checkbox/CheckBox_Press.png",
      "start": 7413638,
      "end": 7414881
    }, {
      "filename": "/ui/circle.png",
      "start": 7414881,
      "end": 7417670
    }, {
      "filename": "/ui/download.png",
      "start": 7417670,
      "end": 7419032
    }, {
      "filename": "/ui/dry-clean.png",
      "start": 7419032,
      "end": 7422425
    }, {
      "filename": "/ui/item_project.png",
      "start": 7422425,
      "end": 7427016
    }, {
      "filename": "/ui/layerBg.png",
      "start": 7427016,
      "end": 7429319
    }, {
      "filename": "/ui/loading.png",
      "start": 7429319,
      "end": 7442529
    }, {
      "filename": "/ui/slider/SliderNode_Disable.png",
      "start": 7442529,
      "end": 7444204
    }, {
      "filename": "/ui/slider/SliderNode_Normal.png",
      "start": 7444204,
      "end": 7445882
    }, {
      "filename": "/ui/slider/SliderNode_Press.png",
      "start": 7445882,
      "end": 7447449
    }, {
      "filename": "/ui/slider/Slider_Back.png",
      "start": 7447449,
      "end": 7448615
    }, {
      "filename": "/ui/slider/Slider_PressBar.png",
      "start": 7448615,
      "end": 7449702
    }, {
      "filename": "/ui/slider/sliderProgress.png",
      "start": 7449702,
      "end": 7450598
    }, {
      "filename": "/ui/slider/sliderThumb.png",
      "start": 7450598,
      "end": 7454756
    }, {
      "filename": "/ui/slider/sliderTrack.png",
      "start": 7454756,
      "end": 7456164
    }, {
      "filename": "/ui/slider/slider_pressbar_bp.png",
      "start": 7456164,
      "end": 7459238
    }, {
      "filename": "/ui/trash.png",
      "start": 7459238,
      "end": 7461584
    } ],
    "remote_package_size": 7461584,
    "package_uuid": "sha256-8000a4172f2c45b7bffa047ad0364df4c63b5e9999c51fa08a8e060f9265816a"
  });
})();

// end include: /var/folders/n2/lmfxlgzs70xgr7xzjdrx1f5w0000gn/T/tmpv1irkdlp.js
var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

// In MODULARIZE mode _scriptName needs to be captured already at the very top of the page immediately when the page is parsed, so it is generated there
// before the page load. In non-MODULARIZE modes generate it here.
var _scriptName = typeof document != "undefined" ? document.currentScript?.src : undefined;

if (typeof __filename != "undefined") {
  // Node
  _scriptName = __filename;
} else if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = "";

function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require("fs");
  scriptDirectory = __dirname + "/";
  // include: node_shell_read.js
  readBinary = filename => {
    // We need to re-wrap `file://` strings to URLs.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename);
    return ret;
  };
  readAsync = async (filename, binary = true) => {
    // See the comment in the `readBinary` function.
    filename = isFileURI(filename) ? new URL(filename) : filename;
    var ret = fs.readFileSync(filename, binary ? undefined : "utf8");
    return ret;
  };
  // end include: node_shell_read.js
  if (process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, "/");
  }
  arguments_ = process.argv.slice(2);
  // MODULARIZE will export the module in the proper place outside, we don't need to export here
  if (typeof module != "undefined") {
    module["exports"] = Module;
  }
  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };
} else // Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  if (!ENVIRONMENT_IS_NODE) {
    // include: web_or_worker_shell_read.js
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = url => {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
      };
    }
    readAsync = async url => {
      // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
      // See https://github.com/github/fetch/pull/92#issuecomment-140665932
      // Cordova or Electron apps are typically loaded from a file:// url.
      // So use XHR on webview if URL is a file URL.
      if (isFileURI(url)) {
        return new Promise((resolve, reject) => {
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, true);
          xhr.responseType = "arraybuffer";
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              // file URLs can return 0
              resolve(xhr.response);
              return;
            }
            reject(xhr.status);
          };
          xhr.onerror = reject;
          xhr.send(null);
        });
      }
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {}

// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
// Normally just binding console.log/console.error here works fine, but
// under node (with workers) we see missing/out-of-order messages so route
// directly to stdout and stderr.
// See https://github.com/emscripten-core/emscripten/issues/14804
var defaultPrint = console.log.bind(console);

var defaultPrintErr = console.error.bind(console);

if (ENVIRONMENT_IS_NODE) {
  var utils = require("util");
  var stringify = a => typeof a == "object" ? utils.inspect(a) : a;
  defaultPrint = (...args) => fs.writeSync(1, args.map(stringify).join(" ") + "\n");
  defaultPrintErr = (...args) => fs.writeSync(2, args.map(stringify).join(" ") + "\n");
}

var out = defaultPrint;

var err = defaultPrintErr;

// end include: shell.js
// include: preamble.js
// === Preamble library stuff ===
// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html
var wasmBinary;

// Wasm globals
// For sending to workers.
var wasmModule;

//========================================
// Runtime essentials
//========================================
// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */ function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implementation here for now.
    abort(text);
  }
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_common.js
// include: runtime_stack_check.js
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
// end include: runtime_debug.js
// Support for growable heap + pthreads, where the buffer may change, so JS views
// must be updated.
function growMemViews() {
  // `updateMemoryViews` updates all the views simultaneously, so it's enough to check any of them.
  if (wasmMemory.buffer != HEAP8.buffer) {
    updateMemoryViews();
  }
}

if (ENVIRONMENT_IS_NODE && (ENVIRONMENT_IS_PTHREAD)) {
  // Create as web-worker-like an environment as we can.
  var parentPort = worker_threads["parentPort"];
  parentPort.on("message", msg => global.onmessage?.({
    data: msg
  }));
  Object.assign(globalThis, {
    self: global,
    postMessage: msg => parentPort["postMessage"](msg)
  });
  // Node.js Workers do not pass postMessage()s and uncaught exception events to the parent
  // thread necessarily in the same order where they were generated in sequential program order.
  // See https://github.com/nodejs/node/issues/59617
  // To remedy this, capture all uncaughtExceptions in the Worker, and sequentialize those over
  // to the same postMessage pipe that other messages use.
  process.on("uncaughtException", err => {
    postMessage({
      cmd: "uncaughtException",
      error: err
    });
    // Also shut down the Worker to match the same semantics as if this uncaughtException
    // handler was not registered.
    // (n.b. this will not shut down the whole Node.js app process, but just the Worker)
    process.exit(1);
  });
}

// include: runtime_pthread.js
// Pthread Web Worker handling code.
// This code runs only on pthread web workers and handles pthread setup
// and communication with the main thread via postMessage.
var startWorker;

if (ENVIRONMENT_IS_PTHREAD) {
  // Thread-local guard variable for one-time init of the JS state
  var initializedJS = false;
  // Turn unhandled rejected promises into errors so that the main thread will be
  // notified about them.
  self.onunhandledrejection = e => {
    throw e.reason || e;
  };
  function handleMessage(e) {
    try {
      var msgData = e["data"];
      //dbg('msgData: ' + Object.keys(msgData));
      var cmd = msgData.cmd;
      if (cmd === "load") {
        // Preload command that is called once per worker to parse and load the Emscripten code.
        // Until we initialize the runtime, queue up any further incoming messages.
        let messageQueue = [];
        self.onmessage = e => messageQueue.push(e);
        // And add a callback for when the runtime is initialized.
        startWorker = () => {
          // Notify the main thread that this thread has loaded.
          postMessage({
            cmd: "loaded"
          });
          // Process any messages that were queued before the thread was ready.
          for (let msg of messageQueue) {
            handleMessage(msg);
          }
          // Restore the real message handler.
          self.onmessage = handleMessage;
        };
        // Use `const` here to ensure that the variable is scoped only to
        // that iteration, allowing safe reference from a closure.
        for (const handler of msgData.handlers) {
          // The the main module has a handler for a certain even, but no
          // handler exists on the pthread worker, then proxy that handler
          // back to the main thread.
          if (!Module[handler] || Module[handler].proxy) {
            Module[handler] = (...args) => {
              postMessage({
                cmd: "callHandler",
                handler,
                args
              });
            };
            // Rebind the out / err handlers if needed
            if (handler == "print") out = Module[handler];
            if (handler == "printErr") err = Module[handler];
          }
        }
        wasmMemory = msgData.wasmMemory;
        updateMemoryViews();
        wasmModule = msgData.wasmModule;
        createWasm();
        run();
      } else if (cmd === "run") {
        // Call inside JS module to set up the stack frame for this pthread in JS module scope.
        // This needs to be the first thing that we do, as we cannot call to any C/C++ functions
        // until the thread stack is initialized.
        establishStackSpace(msgData.pthread_ptr);
        // Pass the thread address to wasm to store it for fast access.
        __emscripten_thread_init(msgData.pthread_ptr, /*is_main=*/ 0, /*is_runtime=*/ 0, /*can_block=*/ 1, 0, 0);
        PThread.threadInitTLS();
        // Await mailbox notifications with `Atomics.waitAsync` so we can start
        // using the fast `Atomics.notify` notification path.
        __emscripten_thread_mailbox_await(msgData.pthread_ptr);
        if (!initializedJS) {
          initializedJS = true;
        }
        try {
          invokeEntryPoint(msgData.start_routine, msgData.arg);
        } catch (ex) {
          if (ex != "unwind") {
            // The pthread "crashed".  Do not call `_emscripten_thread_exit` (which
            // would make this thread joinable).  Instead, re-throw the exception
            // and let the top level handler propagate it back to the main thread.
            throw ex;
          }
        }
      } else if (msgData.target === "setimmediate") {} else if (cmd === "checkMailbox") {
        if (initializedJS) {
          checkMailbox();
        }
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a cmd field present), but is not one of the
        // recognized commands:
        err(`worker: received unknown command ${cmd}`);
        err(msgData);
      }
    } catch (ex) {
      __emscripten_thread_crashed();
      throw ex;
    }
  }
  self.onmessage = handleMessage;
}

// ENVIRONMENT_IS_PTHREAD
// end include: runtime_pthread.js
// Memory management
var wasmMemory;

var /** @type {!Int8Array} */ HEAP8, /** @type {!Uint8Array} */ HEAPU8, /** @type {!Int16Array} */ HEAP16, /** @type {!Uint16Array} */ HEAPU16, /** @type {!Int32Array} */ HEAP32, /** @type {!Uint32Array} */ HEAPU32, /** @type {!Float32Array} */ HEAPF32, /** @type {!Float64Array} */ HEAPF64;

// BigInt64Array type is not correctly defined in closure
var /** not-@type {!BigInt64Array} */ HEAP64, /* BigUint64Array type is not correctly defined in closure
/** not-@type {!BigUint64Array} */ HEAPU64;

var runtimeInitialized = false;

function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// In non-standalone/normal mode, we create the memory here.
// include: runtime_init_memory.js
// Create the wasm memory. (Note: this only applies if IMPORTED_MEMORY is defined)
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
function initMemory() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"];
  } else {
    var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 134217728;
    /** @suppress {checkTypes} */ wasmMemory = new WebAssembly.Memory({
      "initial": INITIAL_MEMORY / 65536,
      // In theory we should not need to emit the maximum if we want "unlimited"
      // or 4GB of memory, but VMs error on that atm, see
      // https://github.com/emscripten-core/emscripten/issues/14130
      // And in the pthreads case we definitely need to emit a maximum. So
      // always emit one.
      "maximum": 32768,
      "shared": true
    });
  }
  updateMemoryViews();
}

// end include: runtime_init_memory.js
// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  runtimeInitialized = true;
  if (ENVIRONMENT_IS_PTHREAD) return startWorker();
  // Begin ATINITS hooks
  if (!Module["noFSInit"] && !FS.initialized) FS.init();
  TTY.init();
  PIPEFS.root = FS.mount(PIPEFS, {}, null);
  SOCKFS.root = FS.mount(SOCKFS, {}, null);
  // End ATINITS hooks
  wasmExports["__wasm_call_ctors"]();
  // Begin ATPOSTCTORS hooks
  FS.ignorePermissions = false;
}

function preMain() {}

function postRun() {
  if ((ENVIRONMENT_IS_PTHREAD)) {
    return;
  }
  // PThreads reuse the runtime from the main thread.
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
}

/** @param {string|number=} what */ function abort(what) {
  Module["onAbort"]?.(what);
  what = "Aborted(" + what + ")";
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
  what += ". Build with -sASSERTIONS for more info.";
  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.
  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */ var e = new WebAssembly.RuntimeError(what);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

var wasmBinaryFile;

function findWasmBinary() {
  return locateFile("BZSketch.wasm");
}

function getBinarySync(file) {
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally adviables since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
  // If we don't have the binary yet, load it asynchronously using readAsync.
  if (!wasmBinary) {
    // Fetch the binary using readAsync
    try {
      var response = await readAsync(binaryFile);
      return new Uint8Array(response);
    } catch {}
  }
  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  if (!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
    try {
      var response = fetch(binaryFile, {
        credentials: "same-origin"
      });
      var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
      return instantiationResult;
    } catch (reason) {
      // We expect the most common failure cause to be a bad MIME type for the binary,
      // in which case falling back to ArrayBuffer instantiation should work.
      err(`wasm streaming compile failed: ${reason}`);
      err("falling back to ArrayBuffer instantiation");
    }
  }
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  assignWasmImports();
  // prepare imports
  return {
    "env": wasmImports,
    "wasi_snapshot_preview1": wasmImports
  };
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
    wasmExports = instance.exports;
    registerTLSInit(wasmExports["_emscripten_tls_init"]);
    wasmTable = wasmExports["__indirect_function_table"];
    // We now have the Wasm module loaded up, keep a reference to the compiled module so we can post it to the workers.
    wasmModule = module;
    assignWasmExports(wasmExports);
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  addRunDependency("wasm-instantiate");
  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    return receiveInstance(result["instance"], result["module"]);
  }
  var info = getWasmImports();
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module["instantiateWasm"]) {
    return new Promise((resolve, reject) => {
      Module["instantiateWasm"](info, (mod, inst) => {
        resolve(receiveInstance(mod, inst));
      });
    });
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    // Instantiate from the module that was recieved via postMessage from
    // the main thread. We can just use sync instantiation in the worker.
    var instance = new WebAssembly.Instance(wasmModule, getWasmImports());
    return receiveInstance(instance, wasmModule);
  }
  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js
// Begin JS library code
class ExitStatus {
  name="ExitStatus";
  constructor(status) {
    this.message = `Program terminated with exit(${status})`;
    this.status = status;
  }
}

var terminateWorker = worker => {
  worker.terminate();
  // terminate() can be asynchronous, so in theory the worker can continue
  // to run for some amount of time after termination.  However from our POV
  // the worker now dead and we don't want to hear from it again, so we stub
  // out its message handler here.  This avoids having to check in each of
  // the onmessage handlers if the message was coming from valid worker.
  worker.onmessage = e => {};
};

var cleanupThread = pthread_ptr => {
  var worker = PThread.pthreads[pthread_ptr];
  PThread.returnWorkerToPool(worker);
};

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

var runDependencies = 0;

var dependenciesFulfilled = null;

var removeRunDependency = id => {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (runDependencies == 0) {
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
};

var addRunDependency = id => {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
};

var spawnThread = threadParams => {
  var worker = PThread.getNewWorker();
  if (!worker) {
    // No available workers in the PThread pool.
    return 6;
  }
  PThread.runningWorkers.push(worker);
  // Add to pthreads map
  PThread.pthreads[threadParams.pthread_ptr] = worker;
  worker.pthread_ptr = threadParams.pthread_ptr;
  var msg = {
    cmd: "run",
    start_routine: threadParams.startRoutine,
    arg: threadParams.arg,
    pthread_ptr: threadParams.pthread_ptr
  };
  if (ENVIRONMENT_IS_NODE) {
    // Mark worker as weakly referenced once we start executing a pthread,
    // so that its existence does not prevent Node.js from exiting.  This
    // has no effect if the worker is already weakly referenced (e.g. if
    // this worker was previously idle/unused).
    worker.unref();
  }
  // Ask the worker to start executing its pthread entry point function.
  worker.postMessage(msg, threadParams.transferList);
  return 0;
};

var runtimeKeepaliveCounter = 0;

var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;

var stackSave = () => _emscripten_stack_get_current();

var stackRestore = val => __emscripten_stack_restore(val);

var stackAlloc = sz => __emscripten_stack_alloc(sz);

/** @type{function(number, (number|boolean), ...number)} */ var proxyToMainThread = (funcIndex, emAsmAddr, sync, ...callArgs) => {
  // EM_ASM proxying is done by passing a pointer to the address of the EM_ASM
  // content as `emAsmAddr`.  JS library proxying is done by passing an index
  // into `proxiedJSCallArgs` as `funcIndex`. If `emAsmAddr` is non-zero then
  // `funcIndex` will be ignored.
  // Additional arguments are passed after the first three are the actual
  // function arguments.
  // The serialization buffer contains the number of call params, and then
  // all the args here.
  // We also pass 'sync' to C separately, since C needs to look at it.
  // Allocate a buffer, which will be copied by the C code.
  // First passed parameter specifies the number of arguments to the function.
  // When BigInt support is enabled, we must handle types in a more complex
  // way, detecting at runtime if a value is a BigInt or not (as we have no
  // type info here). To do that, add a "prefix" before each value that
  // indicates if it is a BigInt, which effectively doubles the number of
  // values we serialize for proxying. TODO: pack this?
  var serializedNumCallArgs = callArgs.length * 2;
  var sp = stackSave();
  var args = stackAlloc(serializedNumCallArgs * 8);
  var b = ((args) >> 3);
  for (var i = 0; i < callArgs.length; i++) {
    var arg = callArgs[i];
    if (typeof arg == "bigint") {
      // The prefix is non-zero to indicate a bigint.
      (growMemViews(), HEAP64)[b + 2 * i] = 1n;
      (growMemViews(), HEAP64)[b + 2 * i + 1] = arg;
    } else {
      // The prefix is zero to indicate a JS Number.
      (growMemViews(), HEAP64)[b + 2 * i] = 0n;
      (growMemViews(), HEAPF64)[b + 2 * i + 1] = arg;
    }
  }
  var rtn = __emscripten_run_js_on_main_thread(funcIndex, emAsmAddr, serializedNumCallArgs, args, sync);
  stackRestore(sp);
  return rtn;
};

function _proc_exit(code) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(0, 0, 1, code);
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    PThread.terminateAllThreads();
    Module["onExit"]?.(code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
}

function exitOnMainThread(returnCode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(1, 0, 0, returnCode);
  _exit(returnCode);
}

/** @suppress {duplicate } */ /** @param {boolean|number=} implicit */ var exitJS = (status, implicit) => {
  EXITSTATUS = status;
  if (ENVIRONMENT_IS_PTHREAD) {
    // implicit exit can never happen on a pthread
    // When running in a pthread we propagate the exit back to the main thread
    // where it can decide if the whole process should be shut down or not.
    // The pthread may have decided not to exit its own runtime, for example
    // because it runs a main loop, but that doesn't affect the main thread.
    exitOnMainThread(status);
    throw "unwind";
  }
  _proc_exit(status);
};

var _exit = exitJS;

var PThread = {
  unusedWorkers: [],
  runningWorkers: [],
  tlsInitFunctions: [],
  pthreads: {},
  init() {
    if ((!(ENVIRONMENT_IS_PTHREAD))) {
      PThread.initMainThread();
    }
  },
  initMainThread() {
    var pthreadPoolSize = 4;
    // Start loading up the Worker pool, if requested.
    while (pthreadPoolSize--) {
      PThread.allocateUnusedWorker();
    }
    // MINIMAL_RUNTIME takes care of calling loadWasmModuleToAllWorkers
    // in postamble_minimal.js
    addOnPreRun(async () => {
      var pthreadPoolReady = PThread.loadWasmModuleToAllWorkers();
      addRunDependency("loading-workers");
      await pthreadPoolReady;
      removeRunDependency("loading-workers");
    });
  },
  terminateAllThreads: () => {
    // Attempt to kill all workers.  Sadly (at least on the web) there is no
    // way to terminate a worker synchronously, or to be notified when a
    // worker in actually terminated.  This means there is some risk that
    // pthreads will continue to be executing after `worker.terminate` has
    // returned.  For this reason, we don't call `returnWorkerToPool` here or
    // free the underlying pthread data structures.
    for (var worker of PThread.runningWorkers) {
      terminateWorker(worker);
    }
    for (var worker of PThread.unusedWorkers) {
      terminateWorker(worker);
    }
    PThread.unusedWorkers = [];
    PThread.runningWorkers = [];
    PThread.pthreads = {};
  },
  returnWorkerToPool: worker => {
    // We don't want to run main thread queued calls here, since we are doing
    // some operations that leave the worker queue in an invalid state until
    // we are completely done (it would be bad if free() ends up calling a
    // queued pthread_create which looks at the global data structures we are
    // modifying). To achieve that, defer the free() til the very end, when
    // we are all done.
    var pthread_ptr = worker.pthread_ptr;
    delete PThread.pthreads[pthread_ptr];
    // Note: worker is intentionally not terminated so the pool can
    // dynamically grow.
    PThread.unusedWorkers.push(worker);
    PThread.runningWorkers.splice(PThread.runningWorkers.indexOf(worker), 1);
    // Not a running Worker anymore
    // Detach the worker from the pthread object, and return it to the
    // worker pool as an unused worker.
    worker.pthread_ptr = 0;
    // Finally, free the underlying (and now-unused) pthread structure in
    // linear memory.
    __emscripten_thread_free_data(pthread_ptr);
  },
  threadInitTLS() {
    // Call thread init functions (these are the _emscripten_tls_init for each
    // module loaded.
    PThread.tlsInitFunctions.forEach(f => f());
  },
  loadWasmModuleToWorker: worker => new Promise(onFinishedLoading => {
    worker.onmessage = e => {
      var d = e["data"];
      var cmd = d.cmd;
      // If this message is intended to a recipient that is not the main
      // thread, forward it to the target thread.
      if (d.targetThread && d.targetThread != _pthread_self()) {
        var targetWorker = PThread.pthreads[d.targetThread];
        if (targetWorker) {
          targetWorker.postMessage(d, d.transferList);
        } else {
          err(`Internal error! Worker sent a message "${cmd}" to target pthread ${d.targetThread}, but that thread no longer exists!`);
        }
        return;
      }
      if (cmd === "checkMailbox") {
        checkMailbox();
      } else if (cmd === "spawnThread") {
        spawnThread(d);
      } else if (cmd === "cleanupThread") {
        // cleanupThread needs to be run via callUserCallback since it calls
        // back into user code to free thread data. Without this it's possible
        // the unwind or ExitStatus exception could escape here.
        callUserCallback(() => cleanupThread(d.thread));
      } else if (cmd === "loaded") {
        worker.loaded = true;
        // Check that this worker doesn't have an associated pthread.
        if (ENVIRONMENT_IS_NODE && !worker.pthread_ptr) {
          // Once worker is loaded & idle, mark it as weakly referenced,
          // so that mere existence of a Worker in the pool does not prevent
          // Node.js from exiting the app.
          worker.unref();
        }
        onFinishedLoading(worker);
      } else if (d.target === "setimmediate") {
        // Worker wants to postMessage() to itself to implement setImmediate()
        // emulation.
        worker.postMessage(d);
      } else if (cmd === "uncaughtException") {
        // Message handler for Node.js specific out-of-order behavior:
        // https://github.com/nodejs/node/issues/59617
        // A pthread sent an uncaught exception event. Re-raise it on the main thread.
        worker.onerror(d.error);
      } else if (cmd === "callHandler") {
        Module[d.handler](...d.args);
      } else if (cmd) {
        // The received message looks like something that should be handled by this message
        // handler, (since there is a e.data.cmd field present), but is not one of the
        // recognized commands:
        err(`worker sent an unknown command ${cmd}`);
      }
    };
    worker.onerror = e => {
      var message = "worker sent an error!";
      err(`${message} ${e.filename}:${e.lineno}: ${e.message}`);
      throw e;
    };
    if (ENVIRONMENT_IS_NODE) {
      worker.on("message", data => worker.onmessage({
        data
      }));
      worker.on("error", e => worker.onerror(e));
    }
    // When running on a pthread, none of the incoming parameters on the module
    // object are present. Proxy known handlers back to the main thread if specified.
    var handlers = [];
    var knownHandlers = [ "onExit", "onAbort", "print", "printErr" ];
    for (var handler of knownHandlers) {
      if (Module.propertyIsEnumerable(handler)) {
        handlers.push(handler);
      }
    }
    // Ask the new worker to load up the Emscripten-compiled page. This is a heavy operation.
    worker.postMessage({
      cmd: "load",
      handlers,
      wasmMemory,
      wasmModule
    });
  }),
  async loadWasmModuleToAllWorkers() {
    // Instantiation is synchronous in pthreads.
    if (ENVIRONMENT_IS_PTHREAD) {
      return;
    }
    let pthreadPoolReady = Promise.all(PThread.unusedWorkers.map(PThread.loadWasmModuleToWorker));
    return pthreadPoolReady;
  },
  allocateUnusedWorker() {
    var worker;
    var pthreadMainJs = _scriptName;
    // We can't use makeModuleReceiveWithVar here since we want to also
    // call URL.createObjectURL on the mainScriptUrlOrBlob.
    if (Module["mainScriptUrlOrBlob"]) {
      pthreadMainJs = Module["mainScriptUrlOrBlob"];
      if (typeof pthreadMainJs != "string") {
        pthreadMainJs = URL.createObjectURL(pthreadMainJs);
      }
    }
    worker = new Worker(pthreadMainJs, {
      // This is the way that we signal to the node worker that it is hosting
      // a pthread.
      "workerData": "em-pthread",
      // This is the way that we signal to the Web Worker that it is hosting
      // a pthread.
      "name": "em-pthread"
    });
    PThread.unusedWorkers.push(worker);
  },
  getNewWorker() {
    if (PThread.unusedWorkers.length == 0) {
      // PTHREAD_POOL_SIZE_STRICT should show a warning and, if set to level `2`, return from the function.
      PThread.allocateUnusedWorker();
      PThread.loadWasmModuleToWorker(PThread.unusedWorkers[0]);
    }
    return PThread.unusedWorkers.pop();
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

function establishStackSpace(pthread_ptr) {
  var stackHigh = (growMemViews(), HEAPU32)[(((pthread_ptr) + (52)) >> 2)];
  var stackSize = (growMemViews(), HEAPU32)[(((pthread_ptr) + (56)) >> 2)];
  var stackLow = stackHigh - stackSize;
  // Set stack limits used by `emscripten/stack.h` function.  These limits are
  // cached in wasm-side globals to make checks as fast as possible.
  _emscripten_stack_set_limits(stackHigh, stackLow);
  // Call inside wasm module to set up the stack frame for this pthread in wasm module scope
  stackRestore(stackHigh);
}

/**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return (growMemViews(), HEAP8)[ptr];

   case "i8":
    return (growMemViews(), HEAP8)[ptr];

   case "i16":
    return (growMemViews(), HEAP16)[((ptr) >> 1)];

   case "i32":
    return (growMemViews(), HEAP32)[((ptr) >> 2)];

   case "i64":
    return (growMemViews(), HEAP64)[((ptr) >> 3)];

   case "float":
    return (growMemViews(), HEAPF32)[((ptr) >> 2)];

   case "double":
    return (growMemViews(), HEAPF64)[((ptr) >> 3)];

   case "*":
    return (growMemViews(), HEAPU32)[((ptr) >> 2)];

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var wasmTableMirror = [];

/** @type {WebAssembly.Table} */ var wasmTable;

var getWasmTableEntry = funcPtr => {
  var func = wasmTableMirror[funcPtr];
  if (!func) {
    /** @suppress {checkTypes} */ wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
  }
  return func;
};

var invokeEntryPoint = (ptr, arg) => {
  // An old thread on this worker may have been canceled without returning the
  // `runtimeKeepaliveCounter` to zero. Reset it now so the new thread won't
  // be affected.
  runtimeKeepaliveCounter = 0;
  // Same for noExitRuntime.  The default for pthreads should always be false
  // otherwise pthreads would never complete and attempts to pthread_join to
  // them would block forever.
  // pthreads can still choose to set `noExitRuntime` explicitly, or
  // call emscripten_unwind_to_js_event_loop to extend their lifetime beyond
  // their main function.  See comment in src/runtime_pthread.js for more.
  noExitRuntime = 0;
  // pthread entry points are always of signature 'void *ThreadMain(void *arg)'
  // Native codebases sometimes spawn threads with other thread entry point
  // signatures, such as void ThreadMain(void *arg), void *ThreadMain(), or
  // void ThreadMain().  That is not acceptable per C/C++ specification, but
  // x86 compiler ABI extensions enable that to work. If you find the
  // following line to crash, either change the signature to "proper" void
  // *ThreadMain(void *arg) form, or try linking with the Emscripten linker
  // flag -sEMULATE_FUNCTION_POINTER_CASTS to add in emulation for this x86
  // ABI extension.
  var result = getWasmTableEntry(ptr)(arg);
  function finish(result) {
    // In MINIMAL_RUNTIME the noExitRuntime concept does not apply to
    // pthreads. To exit a pthread with live runtime, use the function
    // emscripten_unwind_to_js_event_loop() in the pthread body.
    if (keepRuntimeAlive()) {
      EXITSTATUS = result;
      return;
    }
    __emscripten_thread_exit(result);
  }
  finish(result);
};

var noExitRuntime = true;

var registerTLSInit = tlsInitFunc => PThread.tlsInitFunctions.push(tlsInitFunc);

/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    (growMemViews(), HEAP8)[ptr] = value;
    break;

   case "i8":
    (growMemViews(), HEAP8)[ptr] = value;
    break;

   case "i16":
    (growMemViews(), HEAP16)[((ptr) >> 1)] = value;
    break;

   case "i32":
    (growMemViews(), HEAP32)[((ptr) >> 2)] = value;
    break;

   case "i64":
    (growMemViews(), HEAP64)[((ptr) >> 3)] = BigInt(value);
    break;

   case "float":
    (growMemViews(), HEAPF32)[((ptr) >> 2)] = value;
    break;

   case "double":
    (growMemViews(), HEAPF64)[((ptr) >> 3)] = value;
    break;

   case "*":
    (growMemViews(), HEAPU32)[((ptr) >> 2)] = value;
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;

var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
  var maxIdx = idx + maxBytesToRead;
  if (ignoreNul) return maxIdx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.
  // As a tiny code save trick, compare idx against maxIdx using a negation,
  // so that maxBytesToRead=undefined/NaN means Infinity.
  while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
  return idx;
};

/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.buffer instanceof ArrayBuffer ? heapOrArray.subarray(idx, endPtr) : heapOrArray.slice(idx, endPtr));
  }
  var str = "";
  while (idx < endPtr) {
    // For UTF8 byte structure, see:
    // http://en.wikipedia.org/wiki/UTF-8#Description
    // https://www.ietf.org/rfc/rfc2279.txt
    // https://tools.ietf.org/html/rfc3629
    var u0 = heapOrArray[idx++];
    if (!(u0 & 128)) {
      str += String.fromCharCode(u0);
      continue;
    }
    var u1 = heapOrArray[idx++] & 63;
    if ((u0 & 224) == 192) {
      str += String.fromCharCode(((u0 & 31) << 6) | u1);
      continue;
    }
    var u2 = heapOrArray[idx++] & 63;
    if ((u0 & 240) == 224) {
      u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
    } else {
      u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
    }
    if (u0 < 65536) {
      str += String.fromCharCode(u0);
    } else {
      var ch = u0 - 65536;
      str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
    }
  }
  return str;
};

/**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index.
     * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString((growMemViews(), 
HEAPU8), ptr, maxBytesToRead, ignoreNul) : "";

var ___assert_fail = (condition, filename, line, func) => abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [ filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function" ]);

var ___call_sighandler = (fp, sig) => getWasmTableEntry(fp)(sig);

class ExceptionInfo {
  // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
  constructor(excPtr) {
    this.excPtr = excPtr;
    this.ptr = excPtr - 24;
  }
  set_type(type) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (4)) >> 2)] = type;
  }
  get_type() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (4)) >> 2)];
  }
  set_destructor(destructor) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (8)) >> 2)] = destructor;
  }
  get_destructor() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (8)) >> 2)];
  }
  set_caught(caught) {
    caught = caught ? 1 : 0;
    (growMemViews(), HEAP8)[(this.ptr) + (12)] = caught;
  }
  get_caught() {
    return (growMemViews(), HEAP8)[(this.ptr) + (12)] != 0;
  }
  set_rethrown(rethrown) {
    rethrown = rethrown ? 1 : 0;
    (growMemViews(), HEAP8)[(this.ptr) + (13)] = rethrown;
  }
  get_rethrown() {
    return (growMemViews(), HEAP8)[(this.ptr) + (13)] != 0;
  }
  // Initialize native structure fields. Should be called once after allocated.
  init(type, destructor) {
    this.set_adjusted_ptr(0);
    this.set_type(type);
    this.set_destructor(destructor);
  }
  set_adjusted_ptr(adjustedPtr) {
    (growMemViews(), HEAPU32)[(((this.ptr) + (16)) >> 2)] = adjustedPtr;
  }
  get_adjusted_ptr() {
    return (growMemViews(), HEAPU32)[(((this.ptr) + (16)) >> 2)];
  }
}

var exceptionLast = 0;

var uncaughtExceptionCount = 0;

var ___cxa_throw = (ptr, type, destructor) => {
  var info = new ExceptionInfo(ptr);
  // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
  info.init(type, destructor);
  exceptionLast = ptr;
  uncaughtExceptionCount++;
  throw exceptionLast;
};

function pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(2, 0, 1, pthread_ptr, attr, startRoutine, arg);
  return ___pthread_create_js(pthread_ptr, attr, startRoutine, arg);
}

var _emscripten_has_threading_support = () => typeof SharedArrayBuffer != "undefined";

var ___pthread_create_js = (pthread_ptr, attr, startRoutine, arg) => {
  if (!_emscripten_has_threading_support()) {
    return 6;
  }
  // List of JS objects that will transfer ownership to the Worker hosting the thread
  var transferList = [];
  var error = 0;
  // Synchronously proxy the thread creation to main thread if possible. If we
  // need to transfer ownership of objects, then proxy asynchronously via
  // postMessage.
  if (ENVIRONMENT_IS_PTHREAD && (transferList.length === 0 || error)) {
    return pthreadCreateProxied(pthread_ptr, attr, startRoutine, arg);
  }
  // If on the main thread, and accessing Canvas/OffscreenCanvas failed, abort
  // with the detected error.
  if (error) return error;
  var threadParams = {
    startRoutine,
    pthread_ptr,
    arg,
    transferList
  };
  if (ENVIRONMENT_IS_PTHREAD) {
    // The prepopulated pool of web workers that can host pthreads is stored
    // in the main JS thread. Therefore if a pthread is attempting to spawn a
    // new thread, the thread creation must be deferred to the main JS thread.
    threadParams.cmd = "spawnThread";
    postMessage(threadParams, transferList);
    // When we defer thread creation this way, we have no way to detect thread
    // creation synchronously today, so we have to assume success and return 0.
    return 0;
  }
  // We are the main thread, so we have the pthread warmup pool in this
  // thread and can fire off JS thread creation directly ourselves.
  return spawnThread(threadParams);
};

var PATH = {
  isAbs: path => path.charAt(0) === "/",
  splitPath: filename => {
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: (parts, allowAboveRoot) => {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
      for (;up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: path => {
    var isAbsolute = PATH.isAbs(path), trailingSlash = path.slice(-1) === "/";
    // Normalize the path
    path = PATH.normalizeArray(path.split("/").filter(p => !!p), !isAbsolute).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: path => {
    var result = PATH.splitPath(path), root = result[0], dir = result[1];
    if (!root && !dir) {
      // No dirname whatsoever
      return ".";
    }
    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.slice(0, -1);
    }
    return root + dir;
  },
  basename: path => path && path.match(/([^\/]+|\/)\/*$/)[1],
  join: (...paths) => PATH.normalize(paths.join("/")),
  join2: (l, r) => PATH.normalize(l + "/" + r)
};

var initRandomFill = () => {
  // This block is not needed on v19+ since crypto.getRandomValues is builtin
  if (ENVIRONMENT_IS_NODE) {
    var nodeCrypto = require("crypto");
    return view => nodeCrypto.randomFillSync(view);
  }
  // like with most Web APIs, we can't use Web Crypto API directly on shared memory,
  // so we need to create an intermediate buffer and copy it to the destination
  return view => view.set(crypto.getRandomValues(new Uint8Array(view.byteLength)));
};

var randomFill = view => {
  // Lazily init on the first invocation.
  (randomFill = initRandomFill())(view);
};

var PATH_FS = {
  resolve: (...args) => {
    var resolvedPath = "", resolvedAbsolute = false;
    for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = (i >= 0) ? args[i] : FS.cwd();
      // Skip empty and invalid entries
      if (typeof path != "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = PATH.isAbs(path);
    }
    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)
    resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(p => !!p), !resolvedAbsolute).join("/");
    return ((resolvedAbsolute ? "/" : "") + resolvedPath) || ".";
  },
  relative: (from, to) => {
    from = PATH_FS.resolve(from).slice(1);
    to = PATH_FS.resolve(to).slice(1);
    function trim(arr) {
      var start = 0;
      for (;start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (;end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  }
};

var FS_stdin_getChar_buffer = [];

var lengthBytesUTF8 = str => {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i);
    // possibly a lead surrogate
    if (c <= 127) {
      len++;
    } else if (c <= 2047) {
      len += 2;
    } else if (c >= 55296 && c <= 57343) {
      len += 4;
      ++i;
    } else {
      len += 3;
    }
  }
  return len;
};

var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.codePointAt(i);
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
      // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
      // We need to manually skip over the second code unit for correct iteration.
      i++;
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
};

/** @type {function(string, boolean=, number=)} */ var intArrayFromString = (stringy, dontAddNull, length) => {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
};

var FS_stdin_getChar = () => {
  if (!FS_stdin_getChar_buffer.length) {
    var result = null;
    if (ENVIRONMENT_IS_NODE) {
      // we will read data by chunks of BUFSIZE
      var BUFSIZE = 256;
      var buf = Buffer.alloc(BUFSIZE);
      var bytesRead = 0;
      // For some reason we must suppress a closure warning here, even though
      // fd definitely exists on process.stdin, and is even the proper way to
      // get the fd of stdin,
      // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
      // This started to happen after moving this logic out of library_tty.js,
      // so it is related to the surrounding code in some unclear manner.
      /** @suppress {missingProperties} */ var fd = process.stdin.fd;
      try {
        bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
      } catch (e) {
        // Cross-platform differences: on Windows, reading EOF throws an
        // exception, but on other OSes, reading EOF returns 0. Uniformize
        // behavior by treating the EOF exception to return 0.
        if (e.toString().includes("EOF")) bytesRead = 0; else throw e;
      }
      if (bytesRead > 0) {
        result = buf.slice(0, bytesRead).toString("utf-8");
      }
    } else if (typeof window != "undefined" && typeof window.prompt == "function") {
      // Browser.
      result = window.prompt("Input: ");
      // returns null on cancel
      if (result !== null) {
        result += "\n";
      }
    } else {}
    if (!result) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(result, true);
  }
  return FS_stdin_getChar_buffer.shift();
};

var TTY = {
  ttys: [],
  init() {},
  shutdown() {},
  register(dev, ops) {
    TTY.ttys[dev] = {
      input: [],
      output: [],
      ops
    };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open(stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close(stream) {
      // flush any pending line data
      stream.tty.ops.fsync(stream.tty);
    },
    fsync(stream) {
      stream.tty.ops.fsync(stream.tty);
    },
    read(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.atime = Date.now();
      }
      return bytesRead;
    },
    write(stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.mtime = stream.node.ctime = Date.now();
      }
      return i;
    }
  },
  default_tty_ops: {
    get_char(tty) {
      return FS_stdin_getChar();
    },
    put_char(tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        out(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    },
    ioctl_tcgets(tty) {
      // typical setting
      return {
        c_iflag: 25856,
        c_oflag: 5,
        c_cflag: 191,
        c_lflag: 35387,
        c_cc: [ 3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
      };
    },
    ioctl_tcsets(tty, optional_actions, data) {
      // currently just ignore
      return 0;
    },
    ioctl_tiocgwinsz(tty) {
      return [ 24, 80 ];
    }
  },
  default_tty1_ops: {
    put_char(tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    fsync(tty) {
      if (tty.output?.length > 0) {
        err(UTF8ArrayToString(tty.output));
        tty.output = [];
      }
    }
  }
};

var zeroMemory = (ptr, size) => (growMemViews(), HEAPU8).fill(0, ptr, ptr + size);

var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;

var mmapAlloc = size => {
  size = alignMemory(size, 65536);
  var ptr = _emscripten_builtin_memalign(65536, size);
  if (ptr) zeroMemory(ptr, size);
  return ptr;
};

var MEMFS = {
  ops_table: null,
  mount(mount) {
    return MEMFS.createNode(null, "/", 16895, 0);
  },
  createNode(parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      // no supported
      throw new FS.ErrnoError(63);
    }
    MEMFS.ops_table ||= {
      dir: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          lookup: MEMFS.node_ops.lookup,
          mknod: MEMFS.node_ops.mknod,
          rename: MEMFS.node_ops.rename,
          unlink: MEMFS.node_ops.unlink,
          rmdir: MEMFS.node_ops.rmdir,
          readdir: MEMFS.node_ops.readdir,
          symlink: MEMFS.node_ops.symlink
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek
        }
      },
      file: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: {
          llseek: MEMFS.stream_ops.llseek,
          read: MEMFS.stream_ops.read,
          write: MEMFS.stream_ops.write,
          mmap: MEMFS.stream_ops.mmap,
          msync: MEMFS.stream_ops.msync
        }
      },
      link: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr,
          readlink: MEMFS.node_ops.readlink
        },
        stream: {}
      },
      chrdev: {
        node: {
          getattr: MEMFS.node_ops.getattr,
          setattr: MEMFS.node_ops.setattr
        },
        stream: FS.chrdev_stream_ops
      }
    };
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
      // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
      // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
      // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.atime = node.mtime = node.ctime = Date.now();
    // add the new node to the parent
    if (parent) {
      parent.contents[name] = node;
      parent.atime = parent.mtime = parent.ctime = node.atime;
    }
    return node;
  },
  getFileDataAsTypedArray(node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
    // Make sure to not return excess unused bytes.
    return new Uint8Array(node.contents);
  },
  expandFileStorage(node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    // No need to expand, the storage was already large enough.
    // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
    // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
    // avoid overshooting the allocation cap by a very large margin.
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0);
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    // At minimum allocate 256b for each file when expanding.
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    // Allocate new storage.
    if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
  },
  resizeFileStorage(node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      // Fully decommit when requesting a resize to zero.
      node.usedBytes = 0;
    } else {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      // Allocate new storage.
      if (oldContents) {
        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
      }
      node.usedBytes = newSize;
    }
  },
  node_ops: {
    getattr(node) {
      var attr = {};
      // device numbers reuse inode numbers.
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.atime);
      attr.mtime = new Date(node.mtime);
      attr.ctime = new Date(node.ctime);
      // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
      //       but this is not required by the standard.
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr(node, attr) {
      for (const key of [ "mode", "atime", "mtime", "ctime" ]) {
        if (attr[key] != null) {
          node[key] = attr[key];
        }
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup(parent, name) {
      // This error may happen quite a bit. To avoid overhead we reuse it (and
      // suffer a lack of stack info).
      if (!MEMFS.doesNotExistError) {
        MEMFS.doesNotExistError = new FS.ErrnoError(44);
        /** @suppress {checkTypes} */ MEMFS.doesNotExistError.stack = "<generic error, no stack>";
      }
      throw MEMFS.doesNotExistError;
    },
    mknod(parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename(old_node, new_dir, new_name) {
      var new_node;
      try {
        new_node = FS.lookupNode(new_dir, new_name);
      } catch (e) {}
      if (new_node) {
        if (FS.isDir(old_node.mode)) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
        FS.hashRemoveNode(new_node);
      }
      // do the internal rewiring
      delete old_node.parent.contents[old_node.name];
      new_dir.contents[new_name] = old_node;
      old_node.name = new_name;
      new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
    },
    unlink(parent, name) {
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    rmdir(parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
      parent.ctime = parent.mtime = Date.now();
    },
    readdir(node) {
      return [ ".", "..", ...Object.keys(node.contents) ];
    },
    symlink(parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink(node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    }
  },
  stream_ops: {
    read(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
        // non-trivial, and typed array
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write(stream, buffer, offset, length, position, canOwn) {
      // If the buffer is located in main memory (HEAP), and if
      // memory can grow, we can't hold on to references of the
      // memory buffer, as they may get invalidated. That means we
      // need to do copy its contents.
      if (buffer.buffer === (growMemViews(), HEAP8).buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.mtime = node.ctime = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        // This write is from a typed array to a typed array?
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          // Writing to an already allocated and used subrange of the file?
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
        // Use typed array write which is available.
        node.contents.set(buffer.subarray(offset, offset + length), position);
      } else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek(stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    mmap(stream, length, position, prot, flags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      // Only make a new copy when MAP_PRIVATE is specified.
      if (!(flags & 2) && contents && contents.buffer === (growMemViews(), HEAP8).buffer) {
        // We can't emulate MAP_SHARED when the file is not backed by the
        // buffer we're mapping to (e.g. the HEAP buffer).
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        allocated = true;
        ptr = mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        if (contents) {
          // Try to avoid unnecessary slices.
          if (position > 0 || position + length < contents.length) {
            if (contents.subarray) {
              contents = contents.subarray(position, position + length);
            } else {
              contents = Array.prototype.slice.call(contents, position, position + length);
            }
          }
          (growMemViews(), HEAP8).set(contents, ptr);
        }
      }
      return {
        ptr,
        allocated
      };
    },
    msync(stream, buffer, offset, length, mmapFlags) {
      MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
      // should we check if bytesWritten and length are the same?
      return 0;
    }
  }
};

var FS_modeStringToFlags = str => {
  var flagModes = {
    "r": 0,
    "r+": 2,
    "w": 512 | 64 | 1,
    "w+": 512 | 64 | 2,
    "a": 1024 | 64 | 1,
    "a+": 1024 | 64 | 2
  };
  var flags = flagModes[str];
  if (typeof flags == "undefined") {
    throw new Error(`Unknown file open mode: ${str}`);
  }
  return flags;
};

var FS_getMode = (canRead, canWrite) => {
  var mode = 0;
  if (canRead) mode |= 292 | 73;
  if (canWrite) mode |= 146;
  return mode;
};

var IDBFS = {
  dbs: {},
  indexedDB: () => indexedDB,
  DB_VERSION: 21,
  DB_STORE_NAME: "FILE_DATA",
  queuePersist: mount => {
    function onPersistComplete() {
      if (mount.idbPersistState === "again") startPersist(); else mount.idbPersistState = 0;
    }
    function startPersist() {
      mount.idbPersistState = "idb";
      // Mark that we are currently running a sync operation
      IDBFS.syncfs(mount, /*populate:*/ false, onPersistComplete);
    }
    if (!mount.idbPersistState) {
      // Programs typically write/copy/move multiple files in the in-memory
      // filesystem within a single app frame, so when a filesystem sync
      // command is triggered, do not start it immediately, but only after
      // the current frame is finished. This way all the modified files
      // inside the main loop tick will be batched up to the same sync.
      mount.idbPersistState = setTimeout(startPersist, 0);
    } else if (mount.idbPersistState === "idb") {
      // There is an active IndexedDB sync operation in-flight, but we now
      // have accumulated more files to sync. We should therefore queue up
      // a new sync after the current one finishes so that all writes
      // will be properly persisted.
      mount.idbPersistState = "again";
    }
  },
  mount: mount => {
    // reuse core MEMFS functionality
    var mnt = MEMFS.mount(mount);
    // If the automatic IDBFS persistence option has been selected, then automatically persist
    // all modifications to the filesystem as they occur.
    if (mount?.opts?.autoPersist) {
      mount.idbPersistState = 0;
      // IndexedDB sync starts in idle state
      var memfs_node_ops = mnt.node_ops;
      mnt.node_ops = {
        ...mnt.node_ops
      };
      // Clone node_ops to inject write tracking
      mnt.node_ops.mknod = (parent, name, mode, dev) => {
        var node = memfs_node_ops.mknod(parent, name, mode, dev);
        // Propagate injected node_ops to the newly created child node
        node.node_ops = mnt.node_ops;
        // Remember for each IDBFS node which IDBFS mount point they came from so we know which mount to persist on modification.
        node.idbfs_mount = mnt.mount;
        // Remember original MEMFS stream_ops for this node
        node.memfs_stream_ops = node.stream_ops;
        // Clone stream_ops to inject write tracking
        node.stream_ops = {
          ...node.stream_ops
        };
        // Track all file writes
        node.stream_ops.write = (stream, buffer, offset, length, position, canOwn) => {
          // This file has been modified, we must persist IndexedDB when this file closes
          stream.node.isModified = true;
          return node.memfs_stream_ops.write(stream, buffer, offset, length, position, canOwn);
        };
        // Persist IndexedDB on file close
        node.stream_ops.close = stream => {
          var n = stream.node;
          if (n.isModified) {
            IDBFS.queuePersist(n.idbfs_mount);
            n.isModified = false;
          }
          if (n.memfs_stream_ops.close) return n.memfs_stream_ops.close(stream);
        };
        // Persist the node we just created to IndexedDB
        IDBFS.queuePersist(mnt.mount);
        return node;
      };
      // Also kick off persisting the filesystem on other operations that modify the filesystem.
      mnt.node_ops.rmdir = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.rmdir(...args));
      mnt.node_ops.symlink = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.symlink(...args));
      mnt.node_ops.unlink = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.unlink(...args));
      mnt.node_ops.rename = (...args) => (IDBFS.queuePersist(mnt.mount), memfs_node_ops.rename(...args));
    }
    return mnt;
  },
  syncfs: (mount, populate, callback) => {
    IDBFS.getLocalSet(mount, (err, local) => {
      if (err) return callback(err);
      IDBFS.getRemoteSet(mount, (err, remote) => {
        if (err) return callback(err);
        var src = populate ? remote : local;
        var dst = populate ? local : remote;
        IDBFS.reconcile(src, dst, callback);
      });
    });
  },
  quit: () => {
    Object.values(IDBFS.dbs).forEach(value => value.close());
    IDBFS.dbs = {};
  },
  getDB: (name, callback) => {
    // check the cache first
    var db = IDBFS.dbs[name];
    if (db) {
      return callback(null, db);
    }
    var req;
    try {
      req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
    } catch (e) {
      return callback(e);
    }
    if (!req) {
      return callback("Unable to connect to IndexedDB");
    }
    req.onupgradeneeded = e => {
      var db = /** @type {IDBDatabase} */ (e.target.result);
      var transaction = e.target.transaction;
      var fileStore;
      if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
      } else {
        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
      }
      if (!fileStore.indexNames.contains("timestamp")) {
        fileStore.createIndex("timestamp", "timestamp", {
          unique: false
        });
      }
    };
    req.onsuccess = () => {
      db = /** @type {IDBDatabase} */ (req.result);
      // add to the cache
      IDBFS.dbs[name] = db;
      callback(null, db);
    };
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  getLocalSet: (mount, callback) => {
    var entries = {};
    function isRealDir(p) {
      return p !== "." && p !== "..";
    }
    function toAbsolute(root) {
      return p => PATH.join2(root, p);
    }
    var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
    while (check.length) {
      var path = check.pop();
      var stat;
      try {
        stat = FS.stat(path);
      } catch (e) {
        return callback(e);
      }
      if (FS.isDir(stat.mode)) {
        check.push(...FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
      }
      entries[path] = {
        "timestamp": stat.mtime
      };
    }
    return callback(null, {
      type: "local",
      entries
    });
  },
  getRemoteSet: (mount, callback) => {
    var entries = {};
    IDBFS.getDB(mount.mountpoint, (err, db) => {
      if (err) return callback(err);
      try {
        var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readonly");
        transaction.onerror = e => {
          callback(e.target.error);
          e.preventDefault();
        };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        var index = store.index("timestamp");
        index.openKeyCursor().onsuccess = event => {
          var cursor = event.target.result;
          if (!cursor) {
            return callback(null, {
              type: "remote",
              db,
              entries
            });
          }
          entries[cursor.primaryKey] = {
            "timestamp": cursor.key
          };
          cursor.continue();
        };
      } catch (e) {
        return callback(e);
      }
    });
  },
  loadLocalEntry: (path, callback) => {
    var stat, node;
    try {
      var lookup = FS.lookupPath(path);
      node = lookup.node;
      stat = FS.stat(path);
    } catch (e) {
      return callback(e);
    }
    if (FS.isDir(stat.mode)) {
      return callback(null, {
        "timestamp": stat.mtime,
        "mode": stat.mode
      });
    } else if (FS.isFile(stat.mode)) {
      // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
      // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
      node.contents = MEMFS.getFileDataAsTypedArray(node);
      return callback(null, {
        "timestamp": stat.mtime,
        "mode": stat.mode,
        "contents": node.contents
      });
    } else {
      return callback(new Error("node type not supported"));
    }
  },
  storeLocalEntry: (path, entry, callback) => {
    try {
      if (FS.isDir(entry["mode"])) {
        FS.mkdirTree(path, entry["mode"]);
      } else if (FS.isFile(entry["mode"])) {
        FS.writeFile(path, entry["contents"], {
          canOwn: true
        });
      } else {
        return callback(new Error("node type not supported"));
      }
      FS.chmod(path, entry["mode"]);
      FS.utime(path, entry["timestamp"], entry["timestamp"]);
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  removeLocalEntry: (path, callback) => {
    try {
      var stat = FS.stat(path);
      if (FS.isDir(stat.mode)) {
        FS.rmdir(path);
      } else if (FS.isFile(stat.mode)) {
        FS.unlink(path);
      }
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  loadRemoteEntry: (store, path, callback) => {
    var req = store.get(path);
    req.onsuccess = event => callback(null, event.target.result);
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  storeRemoteEntry: (store, path, entry, callback) => {
    try {
      var req = store.put(entry, path);
    } catch (e) {
      callback(e);
      return;
    }
    req.onsuccess = event => callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  removeRemoteEntry: (store, path, callback) => {
    var req = store.delete(path);
    req.onsuccess = event => callback();
    req.onerror = e => {
      callback(e.target.error);
      e.preventDefault();
    };
  },
  reconcile: (src, dst, callback) => {
    var total = 0;
    var create = [];
    Object.keys(src.entries).forEach(key => {
      var e = src.entries[key];
      var e2 = dst.entries[key];
      if (!e2 || e["timestamp"].getTime() != e2["timestamp"].getTime()) {
        create.push(key);
        total++;
      }
    });
    var remove = [];
    Object.keys(dst.entries).forEach(key => {
      if (!src.entries[key]) {
        remove.push(key);
        total++;
      }
    });
    if (!total) {
      return callback(null);
    }
    var errored = false;
    var db = src.type === "remote" ? src.db : dst.db;
    var transaction = db.transaction([ IDBFS.DB_STORE_NAME ], "readwrite");
    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
    function done(err) {
      if (err && !errored) {
        errored = true;
        return callback(err);
      }
    }
    // transaction may abort if (for example) there is a QuotaExceededError
    transaction.onerror = transaction.onabort = e => {
      done(e.target.error);
      e.preventDefault();
    };
    transaction.oncomplete = e => {
      if (!errored) {
        callback(null);
      }
    };
    // sort paths in ascending order so directory entries are created
    // before the files inside them
    create.sort().forEach(path => {
      if (dst.type === "local") {
        IDBFS.loadRemoteEntry(store, path, (err, entry) => {
          if (err) return done(err);
          IDBFS.storeLocalEntry(path, entry, done);
        });
      } else {
        IDBFS.loadLocalEntry(path, (err, entry) => {
          if (err) return done(err);
          IDBFS.storeRemoteEntry(store, path, entry, done);
        });
      }
    });
    // sort paths in descending order so files are deleted before their
    // parent directories
    remove.sort().reverse().forEach(path => {
      if (dst.type === "local") {
        IDBFS.removeLocalEntry(path, done);
      } else {
        IDBFS.removeRemoteEntry(store, path, done);
      }
    });
  }
};

var asyncLoad = async url => {
  var arrayBuffer = await readAsync(url);
  return new Uint8Array(arrayBuffer);
};

var FS_createDataFile = (...args) => FS.createDataFile(...args);

var getUniqueRunDependency = id => id;

var preloadPlugins = [];

var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
  // Ensure plugins are ready.
  if (typeof Browser != "undefined") Browser.init();
  for (var plugin of preloadPlugins) {
    if (plugin["canHandle"](fullname)) {
      return plugin["handle"](byteArray, fullname);
    }
  }
  // In no plugin handled this file then return the original/unmodified
  // byteArray.
  return byteArray;
};

var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
  // TODO we should allow people to just pass in a complete filename instead
  // of parent and name being that we just join them anyways
  var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
  var dep = getUniqueRunDependency(`cp ${fullname}`);
  // might have several active requests for the same fullname
  addRunDependency(dep);
  try {
    var byteArray = url;
    if (typeof url == "string") {
      byteArray = await asyncLoad(url);
    }
    byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
    preFinish?.();
    if (!dontCreateFile) {
      FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
    }
  } finally {
    removeRunDependency(dep);
  }
};

var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
  FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
};

var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  filesystems: null,
  syncFSRequests: 0,
  readFiles: {},
  ErrnoError: class {
    name="ErrnoError";
    // We set the `name` property to be able to identify `FS.ErrnoError`
    // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
    // - when using PROXYFS, an error can come from an underlying FS
    // as different FS objects have their own FS.ErrnoError each,
    // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
    // we'll use the reliable test `err.name == "ErrnoError"` instead
    constructor(errno) {
      this.errno = errno;
    }
  },
  FSStream: class {
    shared={};
    get object() {
      return this.node;
    }
    set object(val) {
      this.node = val;
    }
    get isRead() {
      return (this.flags & 2097155) !== 1;
    }
    get isWrite() {
      return (this.flags & 2097155) !== 0;
    }
    get isAppend() {
      return (this.flags & 1024);
    }
    get flags() {
      return this.shared.flags;
    }
    set flags(val) {
      this.shared.flags = val;
    }
    get position() {
      return this.shared.position;
    }
    set position(val) {
      this.shared.position = val;
    }
  },
  FSNode: class {
    node_ops={};
    stream_ops={};
    readMode=292 | 73;
    writeMode=146;
    mounted=null;
    constructor(parent, name, mode, rdev) {
      if (!parent) {
        parent = this;
      }
      this.parent = parent;
      this.mount = parent.mount;
      this.id = FS.nextInode++;
      this.name = name;
      this.mode = mode;
      this.rdev = rdev;
      this.atime = this.mtime = this.ctime = Date.now();
    }
    get read() {
      return (this.mode & this.readMode) === this.readMode;
    }
    set read(val) {
      val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
    }
    get write() {
      return (this.mode & this.writeMode) === this.writeMode;
    }
    set write(val) {
      val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
    }
    get isFolder() {
      return FS.isDir(this.mode);
    }
    get isDevice() {
      return FS.isChrdev(this.mode);
    }
  },
  lookupPath(path, opts = {}) {
    if (!path) {
      throw new FS.ErrnoError(44);
    }
    opts.follow_mount ??= true;
    if (!PATH.isAbs(path)) {
      path = FS.cwd() + "/" + path;
    }
    // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
    linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
      // split the absolute path
      var parts = path.split("/").filter(p => !!p);
      // start at the root
      var current = FS.root;
      var current_path = "/";
      for (var i = 0; i < parts.length; i++) {
        var islast = (i === parts.length - 1);
        if (islast && opts.parent) {
          // stop resolving
          break;
        }
        if (parts[i] === ".") {
          continue;
        }
        if (parts[i] === "..") {
          current_path = PATH.dirname(current_path);
          if (FS.isRoot(current)) {
            path = current_path + "/" + parts.slice(i + 1).join("/");
            // We're making progress here, don't let many consecutive ..'s
            // lead to ELOOP
            nlinks--;
            continue linkloop;
          } else {
            current = current.parent;
          }
          continue;
        }
        current_path = PATH.join2(current_path, parts[i]);
        try {
          current = FS.lookupNode(current, parts[i]);
        } catch (e) {
          // if noent_okay is true, suppress a ENOENT in the last component
          // and return an object with an undefined node. This is needed for
          // resolving symlinks in the path when creating a file.
          if ((e?.errno === 44) && islast && opts.noent_okay) {
            return {
              path: current_path
            };
          }
          throw e;
        }
        // jump to the mount's root node if this is a mountpoint
        if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
          current = current.mounted.root;
        }
        // by default, lookupPath will not follow a symlink if it is the final path component.
        // setting opts.follow = true will override this behavior.
        if (FS.isLink(current.mode) && (!islast || opts.follow)) {
          if (!current.node_ops.readlink) {
            throw new FS.ErrnoError(52);
          }
          var link = current.node_ops.readlink(current);
          if (!PATH.isAbs(link)) {
            link = PATH.dirname(current_path) + "/" + link;
          }
          path = link + "/" + parts.slice(i + 1).join("/");
          continue linkloop;
        }
      }
      return {
        path: current_path,
        node: current
      };
    }
    throw new FS.ErrnoError(32);
  },
  getPath(node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/" ? `${mount}/${path}` : mount + path;
      }
      path = path ? `${node.name}/${path}` : node.name;
      node = node.parent;
    }
  },
  hashName(parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode(node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode(parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    // if we failed to find it in the cache, call into the VFS
    return FS.lookup(parent, name);
  },
  createNode(parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode(node) {
    FS.hashRemoveNode(node);
  },
  isRoot(node) {
    return node === node.parent;
  },
  isMountpoint(node) {
    return !!node.mounted;
  },
  isFile(mode) {
    return (mode & 61440) === 32768;
  },
  isDir(mode) {
    return (mode & 61440) === 16384;
  },
  isLink(mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev(mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev(mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO(mode) {
    return (mode & 61440) === 4096;
  },
  isSocket(mode) {
    return (mode & 49152) === 49152;
  },
  flagsToPermissionString(flag) {
    var perms = [ "r", "w", "rw" ][flag & 3];
    if ((flag & 512)) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions(node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    // return 0 if any user, group or owner bits are set.
    if (perms.includes("r") && !(node.mode & 292)) {
      return 2;
    } else if (perms.includes("w") && !(node.mode & 146)) {
      return 2;
    } else if (perms.includes("x") && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup(dir) {
    if (!FS.isDir(dir.mode)) return 54;
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate(dir, name) {
    if (!FS.isDir(dir.mode)) {
      return 54;
    }
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete(dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen(node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || (flags & (512 | 64))) {
        // TODO: check for O_SEARCH? (== search for dir only)
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  checkOpExists(op, err) {
    if (!op) {
      throw new FS.ErrnoError(err);
    }
    return op;
  },
  MAX_OPEN_FDS: 4096,
  nextfd() {
    for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStreamChecked(fd) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    return stream;
  },
  getStream: fd => FS.streams[fd],
  createStream(stream, fd = -1) {
    // clone it, so we can return an instance of FSStream
    stream = Object.assign(new FS.FSStream, stream);
    if (fd == -1) {
      fd = FS.nextfd();
    }
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream(fd) {
    FS.streams[fd] = null;
  },
  dupStream(origStream, fd = -1) {
    var stream = FS.createStream(origStream, fd);
    stream.stream_ops?.dup?.(stream);
    return stream;
  },
  doSetAttr(stream, node, attr) {
    var setattr = stream?.stream_ops.setattr;
    var arg = setattr ? stream : node;
    setattr ??= node.node_ops.setattr;
    FS.checkOpExists(setattr, 63);
    setattr(arg, attr);
  },
  chrdev_stream_ops: {
    open(stream) {
      var device = FS.getDevice(stream.node.rdev);
      // override node's stream ops with the device's
      stream.stream_ops = device.stream_ops;
      // forward the open call
      stream.stream_ops.open?.(stream);
    },
    llseek() {
      throw new FS.ErrnoError(70);
    }
  },
  major: dev => ((dev) >> 8),
  minor: dev => ((dev) & 255),
  makedev: (ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
    FS.devices[dev] = {
      stream_ops: ops
    };
  },
  getDevice: dev => FS.devices[dev],
  getMounts(mount) {
    var mounts = [];
    var check = [ mount ];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push(...m.mounts);
    }
    return mounts;
  },
  syncfs(populate, callback) {
    if (typeof populate == "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    // sync all mounts
    mounts.forEach(mount => {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount(type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, {
        follow_mount: false
      });
      mountpoint = lookup.path;
      // use the absolute path
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = {
      type,
      opts,
      mountpoint,
      mounts: []
    };
    // create a root node for the fs
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      // set as a mountpoint
      node.mounted = mount;
      // add the new mount to the current mount's children
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount(mountpoint) {
    var lookup = FS.lookupPath(mountpoint, {
      follow_mount: false
    });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    // destroy the nodes for this mount, and all its child mounts
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    Object.keys(FS.nameTable).forEach(hash => {
      var current = FS.nameTable[hash];
      while (current) {
        var next = current.name_next;
        if (mounts.includes(current.mount)) {
          FS.destroyNode(current);
        }
        current = next;
      }
    });
    // no longer a mountpoint
    node.mounted = null;
    // remove this mount from the child mounts
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup(parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod(path, mode, dev) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name) {
      throw new FS.ErrnoError(28);
    }
    if (name === "." || name === "..") {
      throw new FS.ErrnoError(20);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  statfs(path) {
    return FS.statfsNode(FS.lookupPath(path, {
      follow: true
    }).node);
  },
  statfsStream(stream) {
    // We keep a separate statfsStream function because noderawfs overrides
    // it. In noderawfs, stream.node is sometimes null. Instead, we need to
    // look at stream.path.
    return FS.statfsNode(stream.node);
  },
  statfsNode(node) {
    // NOTE: None of the defaults here are true. We're just returning safe and
    //       sane values. Currently nodefs and rawfs replace these defaults,
    //       other file systems leave them alone.
    var rtn = {
      bsize: 4096,
      frsize: 4096,
      blocks: 1e6,
      bfree: 5e5,
      bavail: 5e5,
      files: FS.nextInode,
      ffree: FS.nextInode - 1,
      fsid: 42,
      flags: 2,
      namelen: 255
    };
    if (node.node_ops.statfs) {
      Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
    }
    return rtn;
  },
  create(path, mode = 438) {
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir(path, mode = 511) {
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree(path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var dir of dirs) {
      if (!dir) continue;
      if (d || PATH.isAbs(path)) d += "/";
      d += dir;
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev(path, mode, dev) {
    if (typeof dev == "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink(oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename(old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    // parents must exist
    var lookup, old_dir, new_dir;
    // let the errors from non existent directories percolate up
    lookup = FS.lookupPath(old_path, {
      parent: true
    });
    old_dir = lookup.node;
    lookup = FS.lookupPath(new_path, {
      parent: true
    });
    new_dir = lookup.node;
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    // need to be part of the same mount
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    // source must exist
    var old_node = FS.lookupNode(old_dir, old_name);
    // old path should not be an ancestor of the new path
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    // new path should not be an ancestor of the old path
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    // see if the new path already exists
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    // early out if nothing needs to change
    if (old_node === new_node) {
      return;
    }
    // we'll need to delete the old entry
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    // need delete permissions if we'll be overwriting.
    // need create permissions if new doesn't already exist.
    errCode = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    // if we are going to change the parent, check write permissions
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // remove the node from the lookup hash
    FS.hashRemoveNode(old_node);
    // do the underlying fs rename
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
      // update old node (we do this here to avoid each backend
      // needing to)
      old_node.parent = new_dir;
    } catch (e) {
      throw e;
    } finally {
      // add the node back to the hash (in case node_ops.rename
      // changed its name)
      FS.hashAddNode(old_node);
    }
  },
  rmdir(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
  },
  readdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
    return readdir(node);
  },
  unlink(path) {
    var lookup = FS.lookupPath(path, {
      parent: true
    });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      // According to POSIX, we should map EISDIR to EPERM, but
      // we instead do what Linux does (and we must, as we use
      // the musl linux libc).
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
  },
  readlink(path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return link.node_ops.readlink(link);
  },
  stat(path, dontFollow) {
    var lookup = FS.lookupPath(path, {
      follow: !dontFollow
    });
    var node = lookup.node;
    var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
    return getattr(node);
  },
  fstat(fd) {
    var stream = FS.getStreamChecked(fd);
    var node = stream.node;
    var getattr = stream.stream_ops.getattr;
    var arg = getattr ? stream : node;
    getattr ??= node.node_ops.getattr;
    FS.checkOpExists(getattr, 63);
    return getattr(arg);
  },
  lstat(path) {
    return FS.stat(path, true);
  },
  doChmod(stream, node, mode, dontFollow) {
    FS.doSetAttr(stream, node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      ctime: Date.now(),
      dontFollow
    });
  },
  chmod(path, mode, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChmod(null, node, mode, dontFollow);
  },
  lchmod(path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod(fd, mode) {
    var stream = FS.getStreamChecked(fd);
    FS.doChmod(stream, stream.node, mode, false);
  },
  doChown(stream, node, dontFollow) {
    FS.doSetAttr(stream, node, {
      timestamp: Date.now(),
      dontFollow
    });
  },
  chown(path, uid, gid, dontFollow) {
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: !dontFollow
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doChown(null, node, dontFollow);
  },
  lchown(path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown(fd, uid, gid) {
    var stream = FS.getStreamChecked(fd);
    FS.doChown(stream, stream.node, false);
  },
  doTruncate(stream, node, len) {
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.doSetAttr(stream, node, {
      size: len,
      timestamp: Date.now()
    });
  },
  truncate(path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path == "string") {
      var lookup = FS.lookupPath(path, {
        follow: true
      });
      node = lookup.node;
    } else {
      node = path;
    }
    FS.doTruncate(null, node, len);
  },
  ftruncate(fd, len) {
    var stream = FS.getStreamChecked(fd);
    if (len < 0 || (stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.doTruncate(stream, stream.node, len);
  },
  utime(path, atime, mtime) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
    setattr(node, {
      atime,
      mtime
    });
  },
  open(path, flags, mode = 438) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags == "string" ? FS_modeStringToFlags(flags) : flags;
    if ((flags & 64)) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    var isDirPath;
    if (typeof path == "object") {
      node = path;
    } else {
      isDirPath = path.endsWith("/");
      // noent_okay makes it so that if the final component of the path
      // doesn't exist, lookupPath returns `node: undefined`. `path` will be
      // updated to point to the target of all symlinks.
      var lookup = FS.lookupPath(path, {
        follow: !(flags & 131072),
        noent_okay: true
      });
      node = lookup.node;
      path = lookup.path;
    }
    // perhaps we need to create the node
    var created = false;
    if ((flags & 64)) {
      if (node) {
        // if O_CREAT and O_EXCL are set, error out if the node already exists
        if ((flags & 128)) {
          throw new FS.ErrnoError(20);
        }
      } else if (isDirPath) {
        throw new FS.ErrnoError(31);
      } else {
        // node doesn't exist, try to create it
        // Ignore the permission bits here to ensure we can `open` this new
        // file below. We use chmod below the apply the permissions once the
        // file is open.
        node = FS.mknod(path, mode | 511, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    // can't truncate a device
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    // if asked only for a directory, then this must be one
    if ((flags & 65536) && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    // check permissions, if this is not a file we just created now (it is ok to
    // create and write to a file with read-only permissions; it is read-only
    // for later use)
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    // do truncation if necessary
    if ((flags & 512) && !created) {
      FS.truncate(node, 0);
    }
    // we've already handled these, don't pass down to the underlying vfs
    flags &= ~(128 | 512 | 131072);
    // register the stream with the filesystem
    var stream = FS.createStream({
      node,
      path: FS.getPath(node),
      // we want the absolute path to the node
      flags,
      seekable: true,
      position: 0,
      stream_ops: node.stream_ops,
      // used by the file family libc calls (fopen, fwrite, ferror, etc.)
      ungotten: [],
      error: false
    });
    // call the new stream's open function
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (created) {
      FS.chmod(node, mode & 511);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
      }
    }
    return stream;
  },
  close(stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    // free readdir state
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed(stream) {
    return stream.fd === null;
  },
  llseek(stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read(stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write(stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      // seek to the end before writing in append mode
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position != "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
    if (!seeking) stream.position += bytesWritten;
    return bytesWritten;
  },
  mmap(stream, length, position, prot, flags) {
    // User requests writing to file (prot & PROT_WRITE != 0).
    // Checking if we have permissions to write to the file unless
    // MAP_PRIVATE flag is set. According to POSIX spec it is possible
    // to write to file opened in read-only mode with MAP_PRIVATE flag,
    // as all modifications will be visible only in the memory of
    // the current process.
    if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    if (!length) {
      throw new FS.ErrnoError(28);
    }
    return stream.stream_ops.mmap(stream, length, position, prot, flags);
  },
  msync(stream, buffer, offset, length, mmapFlags) {
    if (!stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  ioctl(stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile(path, opts = {}) {
    opts.flags = opts.flags || 0;
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      abort(`Invalid encoding type "${opts.encoding}"`);
    }
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      buf = UTF8ArrayToString(buf);
    }
    FS.close(stream);
    return buf;
  },
  writeFile(path, data, opts = {}) {
    opts.flags = opts.flags || 577;
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data == "string") {
      data = new Uint8Array(intArrayFromString(data, true));
    }
    if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      abort("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: () => FS.currentPath,
  chdir(path) {
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories() {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices() {
    // create /dev
    FS.mkdir("/dev");
    // setup /dev/null
    FS.registerDevice(FS.makedev(1, 3), {
      read: () => 0,
      write: (stream, buffer, offset, length, pos) => length,
      llseek: () => 0
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    // setup /dev/tty and /dev/tty1
    // stderr needs to print output using err() rather than out()
    // so we register a second tty just for it.
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    // setup /dev/[u]random
    // use a buffer to avoid overhead of individual crypto calls per byte
    var randomBuffer = new Uint8Array(1024), randomLeft = 0;
    var randomByte = () => {
      if (randomLeft === 0) {
        randomFill(randomBuffer);
        randomLeft = randomBuffer.byteLength;
      }
      return randomBuffer[--randomLeft];
    };
    FS.createDevice("/dev", "random", randomByte);
    FS.createDevice("/dev", "urandom", randomByte);
    // we're not going to emulate the actual shm device,
    // just create the tmp dirs that reside in it commonly
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories() {
    // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
    // name of the stream for fd 6 (see test_unistd_ttyname)
    FS.mkdir("/proc");
    var proc_self = FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount({
      mount() {
        var node = FS.createNode(proc_self, "fd", 16895, 73);
        node.stream_ops = {
          llseek: MEMFS.stream_ops.llseek
        };
        node.node_ops = {
          lookup(parent, name) {
            var fd = +name;
            var stream = FS.getStreamChecked(fd);
            var ret = {
              parent: null,
              mount: {
                mountpoint: "fake"
              },
              node_ops: {
                readlink: () => stream.path
              },
              id: fd + 1
            };
            ret.parent = ret;
            // make it look like a simple root node
            return ret;
          },
          readdir() {
            return Array.from(FS.streams.entries()).filter(([k, v]) => v).map(([k, v]) => k.toString());
          }
        };
        return node;
      }
    }, {}, "/proc/self/fd");
  },
  createStandardStreams(input, output, error) {
    // TODO deprecate the old functionality of a single
    // input / output callback and that utilizes FS.createDevice
    // and instead require a unique set of stream ops
    // by default, we symlink the standard streams to the
    // default tty devices. however, if the standard streams
    // have been overwritten we create a unique device for
    // them instead.
    if (input) {
      FS.createDevice("/dev", "stdin", input);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (output) {
      FS.createDevice("/dev", "stdout", null, output);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (error) {
      FS.createDevice("/dev", "stderr", null, error);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    // open default streams for the stdin, stdout and stderr devices
    var stdin = FS.open("/dev/stdin", 0);
    var stdout = FS.open("/dev/stdout", 1);
    var stderr = FS.open("/dev/stderr", 1);
  },
  staticInit() {
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = {
      "MEMFS": MEMFS,
      "IDBFS": IDBFS
    };
  },
  init(input, output, error) {
    FS.initialized = true;
    // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
    input ??= Module["stdin"];
    output ??= Module["stdout"];
    error ??= Module["stderr"];
    FS.createStandardStreams(input, output, error);
  },
  quit() {
    FS.initialized = false;
    // force-flush all streams, so we get musl std streams printed out
    // close all of our streams
    for (var stream of FS.streams) {
      if (stream) {
        FS.close(stream);
      }
    }
  },
  findObject(path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (!ret.exists) {
      return null;
    }
    return ret.object;
  },
  analyzePath(path, dontResolveLastLink) {
    // operate from within the context of the symlink's target
    try {
      var lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null
    };
    try {
      var lookup = FS.lookupPath(path, {
        parent: true
      });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, {
        follow: !dontResolveLastLink
      });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createPath(parent, path, canRead, canWrite) {
    parent = typeof parent == "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
      parent = current;
    }
    return current;
  },
  createFile(parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
    var path = name;
    if (parent) {
      parent = typeof parent == "string" ? parent : FS.getPath(parent);
      path = name ? PATH.join2(parent, name) : parent;
    }
    var mode = FS_getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data == "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
        data = arr;
      }
      // make sure we can write to the file
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, 577);
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
  },
  createDevice(parent, name, input, output) {
    var path = PATH.join2(typeof parent == "string" ? parent : FS.getPath(parent), name);
    var mode = FS_getMode(!!input, !!output);
    FS.createDevice.major ??= 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    // Create a fake device that a set of stream ops to emulate
    // the old behavior.
    FS.registerDevice(dev, {
      open(stream) {
        stream.seekable = false;
      },
      close(stream) {
        // flush any pending line data
        if (output?.buffer?.length) {
          output(10);
        }
      },
      read(stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.atime = Date.now();
        }
        return bytesRead;
      },
      write(stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.mtime = stream.node.ctime = Date.now();
        }
        return i;
      }
    });
    return FS.mkdev(path, mode, dev);
  },
  forceLoadFile(obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    if (typeof XMLHttpRequest != "undefined") {
      abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
    } else {
      // Command-line.
      try {
        obj.contents = readBinary(obj.url);
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
    }
  },
  createLazyFile(parent, name, url, canRead, canWrite) {
    // Lazy chunked Uint8Array (implements get and length from Uint8Array).
    // Actual getting is abstracted away for eventual reuse.
    class LazyUint8Array {
      lengthKnown=false;
      chunks=[];
      // Loaded chunks. Index is the chunk number
      get(idx) {
        if (idx > this.length - 1 || idx < 0) {
          return undefined;
        }
        var chunkOffset = idx % this.chunkSize;
        var chunkNum = (idx / this.chunkSize) | 0;
        return this.getter(chunkNum)[chunkOffset];
      }
      setDataGetter(getter) {
        this.getter = getter;
      }
      cacheLength() {
        // Find length
        var xhr = new XMLHttpRequest;
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
        var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
        var chunkSize = 1024 * 1024;
        // Chunk size in bytes
        if (!hasByteServing) chunkSize = datalength;
        // Function to get a range from the remote URL.
        var doXHR = (from, to) => {
          if (from > to) abort("invalid range (" + from + ", " + to + ") or no bytes requested!");
          if (to > datalength - 1) abort("only " + datalength + " bytes available! programmer error!");
          // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
          var xhr = new XMLHttpRequest;
          xhr.open("GET", url, false);
          if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
          // Some hints to the browser that we want binary data.
          xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(/** @type{Array<number>} */ (xhr.response || []));
          }
          return intArrayFromString(xhr.responseText || "", true);
        };
        var lazyArray = this;
        lazyArray.setDataGetter(chunkNum => {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          // including this byte
          end = Math.min(end, datalength - 1);
          // if datalength-1 is selected, this is the last block
          if (typeof lazyArray.chunks[chunkNum] == "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] == "undefined") abort("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
          chunkSize = datalength = 1;
          // this will force getter(0)/doXHR do download the whole file
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out("LazyFiles on gzip forces download of the whole file when length is accessed");
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      }
      get length() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._length;
      }
      get chunkSize() {
        if (!this.lengthKnown) {
          this.cacheLength();
        }
        return this._chunkSize;
      }
    }
    if (typeof XMLHttpRequest != "undefined") {
      if (!ENVIRONMENT_IS_WORKER) abort("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");
      var lazyArray = new LazyUint8Array;
      var properties = {
        isDevice: false,
        contents: lazyArray
      };
    } else {
      var properties = {
        isDevice: false,
        url
      };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    // This is a total hack, but I want to get this lazy file code out of the
    // core of MEMFS. If we want to keep this lazy file concept I feel it should
    // be its own thin LAZYFS proxying calls to MEMFS.
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    // Add a function that defers querying the file size until it is asked the first time.
    Object.defineProperties(node, {
      usedBytes: {
        get: function() {
          return this.contents.length;
        }
      }
    });
    // override each stream op with one that tries to force load the lazy file first
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(key => {
      var fn = node.stream_ops[key];
      stream_ops[key] = (...args) => {
        FS.forceLoadFile(node);
        return fn(...args);
      };
    });
    function writeChunks(stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        // normal array
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          // LazyUint8Array from sync binary XHR
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    }
    // use a custom read function
    stream_ops.read = (stream, buffer, offset, length, position) => {
      FS.forceLoadFile(node);
      return writeChunks(stream, buffer, offset, length, position);
    };
    // use a custom mmap function
    stream_ops.mmap = (stream, length, position, prot, flags) => {
      FS.forceLoadFile(node);
      var ptr = mmapAlloc(length);
      if (!ptr) {
        throw new FS.ErrnoError(48);
      }
      writeChunks(stream, (growMemViews(), HEAP8), ptr, length, position);
      return {
        ptr,
        allocated: true
      };
    };
    node.stream_ops = stream_ops;
    return node;
  }
};

var SYSCALLS = {
  DEFAULT_POLLMASK: 5,
  calculateAt(dirfd, path, allowEmpty) {
    if (PATH.isAbs(path)) {
      return path;
    }
    // relative path
    var dir;
    if (dirfd === -100) {
      dir = FS.cwd();
    } else {
      var dirstream = SYSCALLS.getStreamFromFD(dirfd);
      dir = dirstream.path;
    }
    if (path.length == 0) {
      if (!allowEmpty) {
        throw new FS.ErrnoError(44);
      }
      return dir;
    }
    return dir + "/" + path;
  },
  writeStat(buf, stat) {
    (growMemViews(), HEAPU32)[((buf) >> 2)] = stat.dev;
    (growMemViews(), HEAPU32)[(((buf) + (4)) >> 2)] = stat.mode;
    (growMemViews(), HEAPU32)[(((buf) + (8)) >> 2)] = stat.nlink;
    (growMemViews(), HEAPU32)[(((buf) + (12)) >> 2)] = stat.uid;
    (growMemViews(), HEAPU32)[(((buf) + (16)) >> 2)] = stat.gid;
    (growMemViews(), HEAPU32)[(((buf) + (20)) >> 2)] = stat.rdev;
    (growMemViews(), HEAP64)[(((buf) + (24)) >> 3)] = BigInt(stat.size);
    (growMemViews(), HEAP32)[(((buf) + (32)) >> 2)] = 4096;
    (growMemViews(), HEAP32)[(((buf) + (36)) >> 2)] = stat.blocks;
    var atime = stat.atime.getTime();
    var mtime = stat.mtime.getTime();
    var ctime = stat.ctime.getTime();
    (growMemViews(), HEAP64)[(((buf) + (40)) >> 3)] = BigInt(Math.floor(atime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (48)) >> 2)] = (atime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (56)) >> 3)] = BigInt(Math.floor(mtime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (64)) >> 2)] = (mtime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (72)) >> 3)] = BigInt(Math.floor(ctime / 1e3));
    (growMemViews(), HEAPU32)[(((buf) + (80)) >> 2)] = (ctime % 1e3) * 1e3 * 1e3;
    (growMemViews(), HEAP64)[(((buf) + (88)) >> 3)] = BigInt(stat.ino);
    return 0;
  },
  writeStatFs(buf, stats) {
    (growMemViews(), HEAPU32)[(((buf) + (4)) >> 2)] = stats.bsize;
    (growMemViews(), HEAPU32)[(((buf) + (60)) >> 2)] = stats.bsize;
    (growMemViews(), HEAP64)[(((buf) + (8)) >> 3)] = BigInt(stats.blocks);
    (growMemViews(), HEAP64)[(((buf) + (16)) >> 3)] = BigInt(stats.bfree);
    (growMemViews(), HEAP64)[(((buf) + (24)) >> 3)] = BigInt(stats.bavail);
    (growMemViews(), HEAP64)[(((buf) + (32)) >> 3)] = BigInt(stats.files);
    (growMemViews(), HEAP64)[(((buf) + (40)) >> 3)] = BigInt(stats.ffree);
    (growMemViews(), HEAPU32)[(((buf) + (48)) >> 2)] = stats.fsid;
    (growMemViews(), HEAPU32)[(((buf) + (64)) >> 2)] = stats.flags;
    // ST_NOSUID
    (growMemViews(), HEAPU32)[(((buf) + (56)) >> 2)] = stats.namelen;
  },
  doMsync(addr, stream, len, flags, offset) {
    if (!FS.isFile(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (flags & 2) {
      // MAP_PRIVATE calls need not to be synced back to underlying fs
      return 0;
    }
    var buffer = (growMemViews(), HEAPU8).slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  getStreamFromFD(fd) {
    var stream = FS.getStreamChecked(fd);
    return stream;
  },
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

function ___syscall_chmod(path, mode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(3, 0, 1, path, mode);
  try {
    path = SYSCALLS.getStr(path);
    FS.chmod(path, mode);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_faccessat(dirfd, path, amode, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(4, 0, 1, dirfd, path, amode, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (amode & ~7) {
      // need a valid mode
      return -28;
    }
    var lookup = FS.lookupPath(path, {
      follow: true
    });
    var node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fchmod(fd, mode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(5, 0, 1, fd, mode);
  try {
    FS.fchmod(fd, mode);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fchown32(fd, owner, group) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(6, 0, 1, fd, owner, group);
  try {
    FS.fchown(fd, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

/** @suppress {duplicate } */ var syscallGetVarargI = () => {
  // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
  var ret = (growMemViews(), HEAP32)[((+SYSCALLS.varargs) >> 2)];
  SYSCALLS.varargs += 4;
  return ret;
};

var syscallGetVarargP = syscallGetVarargI;

function ___syscall_fcntl64(fd, cmd, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(7, 0, 1, fd, cmd, varargs);
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
     case 0:
      {
        var arg = syscallGetVarargI();
        if (arg < 0) {
          return -28;
        }
        while (FS.streams[arg]) {
          arg++;
        }
        var newStream;
        newStream = FS.dupStream(stream, arg);
        return newStream.fd;
      }

     case 1:
     case 2:
      return 0;

     // FD_CLOEXEC makes no sense for a single process.
      case 3:
      return stream.flags;

     case 4:
      {
        var arg = syscallGetVarargI();
        stream.flags |= arg;
        return 0;
      }

     case 12:
      {
        var arg = syscallGetVarargP();
        var offset = 0;
        // We're always unlocked.
        (growMemViews(), HEAP16)[(((arg) + (offset)) >> 1)] = 2;
        return 0;
      }

     case 13:
     case 14:
      // Pretend that the locking is successful. These are process-level locks,
      // and Emscripten programs are a single process. If we supported linking a
      // filesystem between programs, we'd need to do more here.
      // See https://github.com/emscripten-core/emscripten/issues/23697
      return 0;
    }
    return -28;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_fstat64(fd, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(8, 0, 1, fd, buf);
  try {
    return SYSCALLS.writeStat(buf, FS.fstat(fd));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

function ___syscall_ftruncate64(fd, length) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(9, 0, 1, fd, length);
  length = bigintToI53Checked(length);
  try {
    if (isNaN(length)) return -61;
    FS.ftruncate(fd, length);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, (growMemViews(), 
HEAPU8), outPtr, maxBytesToWrite);

function ___syscall_getcwd(buf, size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(10, 0, 1, buf, size);
  try {
    if (size === 0) return -28;
    var cwd = FS.cwd();
    var cwdLengthInBytes = lengthBytesUTF8(cwd) + 1;
    if (size < cwdLengthInBytes) return -68;
    stringToUTF8(cwd, buf, size);
    return cwdLengthInBytes;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_getdents64(fd, dirp, count) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(11, 0, 1, fd, dirp, count);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    stream.getdents ||= FS.readdir(stream.path);
    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);
    var startIdx = Math.floor(off / struct_size);
    var endIdx = Math.min(stream.getdents.length, startIdx + Math.floor(count / struct_size));
    for (var idx = startIdx; idx < endIdx; idx++) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name === ".") {
        id = stream.node.id;
        type = 4;
      } else if (name === "..") {
        var lookup = FS.lookupPath(stream.path, {
          parent: true
        });
        id = lookup.node.id;
        type = 4;
      } else {
        var child;
        try {
          child = FS.lookupNode(stream.node, name);
        } catch (e) {
          // If the entry is not a directory, file, or symlink, nodefs
          // lookupNode will raise EINVAL. Skip these and continue.
          if (e?.errno === 28) {
            continue;
          }
          throw e;
        }
        id = child.id;
        type = FS.isChrdev(child.mode) ? 2 : // DT_CHR, character device.
        FS.isDir(child.mode) ? 4 : // DT_DIR, directory.
        FS.isLink(child.mode) ? 10 : // DT_LNK, symbolic link.
        8;
      }
      (growMemViews(), HEAP64)[((dirp + pos) >> 3)] = BigInt(id);
      (growMemViews(), HEAP64)[(((dirp + pos) + (8)) >> 3)] = BigInt((idx + 1) * struct_size);
      (growMemViews(), HEAP16)[(((dirp + pos) + (16)) >> 1)] = 280;
      (growMemViews(), HEAP8)[(dirp + pos) + (18)] = type;
      stringToUTF8(name, dirp + pos + 19, 256);
      pos += struct_size;
    }
    FS.llseek(stream, idx * struct_size, 0);
    return pos;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_ioctl(fd, op, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(12, 0, 1, fd, op, varargs);
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
     case 21509:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21505:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcgets) {
          var termios = stream.tty.ops.ioctl_tcgets(stream);
          var argp = syscallGetVarargP();
          (growMemViews(), HEAP32)[((argp) >> 2)] = termios.c_iflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (4)) >> 2)] = termios.c_oflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (8)) >> 2)] = termios.c_cflag || 0;
          (growMemViews(), HEAP32)[(((argp) + (12)) >> 2)] = termios.c_lflag || 0;
          for (var i = 0; i < 32; i++) {
            (growMemViews(), HEAP8)[(argp + i) + (17)] = termios.c_cc[i] || 0;
          }
          return 0;
        }
        return 0;
      }

     case 21510:
     case 21511:
     case 21512:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     case 21506:
     case 21507:
     case 21508:
      {
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tcsets) {
          var argp = syscallGetVarargP();
          var c_iflag = (growMemViews(), HEAP32)[((argp) >> 2)];
          var c_oflag = (growMemViews(), HEAP32)[(((argp) + (4)) >> 2)];
          var c_cflag = (growMemViews(), HEAP32)[(((argp) + (8)) >> 2)];
          var c_lflag = (growMemViews(), HEAP32)[(((argp) + (12)) >> 2)];
          var c_cc = [];
          for (var i = 0; i < 32; i++) {
            c_cc.push((growMemViews(), HEAP8)[(argp + i) + (17)]);
          }
          return stream.tty.ops.ioctl_tcsets(stream.tty, op, {
            c_iflag,
            c_oflag,
            c_cflag,
            c_lflag,
            c_cc
          });
        }
        return 0;
      }

     case 21519:
      {
        if (!stream.tty) return -59;
        var argp = syscallGetVarargP();
        (growMemViews(), HEAP32)[((argp) >> 2)] = 0;
        return 0;
      }

     case 21520:
      {
        if (!stream.tty) return -59;
        return -28;
      }

     case 21537:
     case 21531:
      {
        var argp = syscallGetVarargP();
        return FS.ioctl(stream, op, argp);
      }

     case 21523:
      {
        // TODO: in theory we should write to the winsize struct that gets
        // passed in, but for now musl doesn't read anything on it
        if (!stream.tty) return -59;
        if (stream.tty.ops.ioctl_tiocgwinsz) {
          var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
          var argp = syscallGetVarargP();
          (growMemViews(), HEAP16)[((argp) >> 1)] = winsize[0];
          (growMemViews(), HEAP16)[(((argp) + (2)) >> 1)] = winsize[1];
        }
        return 0;
      }

     case 21524:
      {
        // TODO: technically, this ioctl call should change the window size.
        // but, since emscripten doesn't have any concept of a terminal window
        // yet, we'll just silently throw it away as we do TIOCGWINSZ
        if (!stream.tty) return -59;
        return 0;
      }

     case 21515:
      {
        if (!stream.tty) return -59;
        return 0;
      }

     default:
      return -28;
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_lstat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(13, 0, 1, path, buf);
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.lstat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_mkdirat(dirfd, path, mode) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(14, 0, 1, dirfd, path, mode);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    FS.mkdir(path, mode, 0);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_newfstatat(dirfd, path, buf, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(15, 0, 1, dirfd, path, buf, flags);
  try {
    path = SYSCALLS.getStr(path);
    var nofollow = flags & 256;
    var allowEmpty = flags & 4096;
    flags = flags & (~6400);
    path = SYSCALLS.calculateAt(dirfd, path, allowEmpty);
    return SYSCALLS.writeStat(buf, nofollow ? FS.lstat(path) : FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_openat(dirfd, path, flags, varargs) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(16, 0, 1, dirfd, path, flags, varargs);
  SYSCALLS.varargs = varargs;
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    var mode = varargs ? syscallGetVarargI() : 0;
    return FS.open(path, flags, mode).fd;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var PIPEFS = {
  BUCKET_BUFFER_SIZE: 8192,
  mount(mount) {
    // Do not pollute the real root directory or its child nodes with pipes
    // Looks like it is OK to create another pseudo-root node not linked to the FS.root hierarchy this way
    return FS.createNode(null, "/", 16384 | 511, 0);
  },
  createPipe() {
    var pipe = {
      buckets: [],
      // refcnt 2 because pipe has a read end and a write end. We need to be
      // able to read from the read end after write end is closed.
      refcnt: 2,
      timestamp: new Date
    };
    pipe.buckets.push({
      buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
      offset: 0,
      roffset: 0
    });
    var rName = PIPEFS.nextname();
    var wName = PIPEFS.nextname();
    var rNode = FS.createNode(PIPEFS.root, rName, 4096, 0);
    var wNode = FS.createNode(PIPEFS.root, wName, 4096, 0);
    rNode.pipe = pipe;
    wNode.pipe = pipe;
    var readableStream = FS.createStream({
      path: rName,
      node: rNode,
      flags: 0,
      seekable: false,
      stream_ops: PIPEFS.stream_ops
    });
    rNode.stream = readableStream;
    var writableStream = FS.createStream({
      path: wName,
      node: wNode,
      flags: 1,
      seekable: false,
      stream_ops: PIPEFS.stream_ops
    });
    wNode.stream = writableStream;
    return {
      readable_fd: readableStream.fd,
      writable_fd: writableStream.fd
    };
  },
  stream_ops: {
    getattr(stream) {
      var node = stream.node;
      var timestamp = node.pipe.timestamp;
      return {
        dev: 14,
        ino: node.id,
        mode: 4480,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        size: 0,
        atime: timestamp,
        mtime: timestamp,
        ctime: timestamp,
        blksize: 4096,
        blocks: 0
      };
    },
    poll(stream) {
      var pipe = stream.node.pipe;
      if ((stream.flags & 2097155) === 1) {
        return (256 | 4);
      }
      for (var bucket of pipe.buckets) {
        if (bucket.offset - bucket.roffset > 0) {
          return (64 | 1);
        }
      }
      return 0;
    },
    dup(stream) {
      stream.node.pipe.refcnt++;
    },
    ioctl(stream, request, varargs) {
      return 28;
    },
    fsync(stream) {
      return 28;
    },
    read(stream, buffer, offset, length, position) {
      var pipe = stream.node.pipe;
      var currentLength = 0;
      for (var bucket of pipe.buckets) {
        currentLength += bucket.offset - bucket.roffset;
      }
      var data = buffer.subarray(offset, offset + length);
      if (length <= 0) {
        return 0;
      }
      if (currentLength == 0) {
        // Behave as if the read end is always non-blocking
        throw new FS.ErrnoError(6);
      }
      var toRead = Math.min(currentLength, length);
      var totalRead = toRead;
      var toRemove = 0;
      for (var bucket of pipe.buckets) {
        var bucketSize = bucket.offset - bucket.roffset;
        if (toRead <= bucketSize) {
          var tmpSlice = bucket.buffer.subarray(bucket.roffset, bucket.offset);
          if (toRead < bucketSize) {
            tmpSlice = tmpSlice.subarray(0, toRead);
            bucket.roffset += toRead;
          } else {
            toRemove++;
          }
          data.set(tmpSlice);
          break;
        } else {
          var tmpSlice = bucket.buffer.subarray(bucket.roffset, bucket.offset);
          data.set(tmpSlice);
          data = data.subarray(tmpSlice.byteLength);
          toRead -= tmpSlice.byteLength;
          toRemove++;
        }
      }
      if (toRemove && toRemove == pipe.buckets.length) {
        // Do not generate excessive garbage in use cases such as
        // write several bytes, read everything, write several bytes, read everything...
        toRemove--;
        pipe.buckets[toRemove].offset = 0;
        pipe.buckets[toRemove].roffset = 0;
      }
      pipe.buckets.splice(0, toRemove);
      return totalRead;
    },
    write(stream, buffer, offset, length, position) {
      var pipe = stream.node.pipe;
      var data = buffer.subarray(offset, offset + length);
      var dataLen = data.byteLength;
      if (dataLen <= 0) {
        return 0;
      }
      var currBucket = null;
      if (pipe.buckets.length == 0) {
        currBucket = {
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: 0,
          roffset: 0
        };
        pipe.buckets.push(currBucket);
      } else {
        currBucket = pipe.buckets[pipe.buckets.length - 1];
      }
      var freeBytesInCurrBuffer = PIPEFS.BUCKET_BUFFER_SIZE - currBucket.offset;
      if (freeBytesInCurrBuffer >= dataLen) {
        currBucket.buffer.set(data, currBucket.offset);
        currBucket.offset += dataLen;
        return dataLen;
      } else if (freeBytesInCurrBuffer > 0) {
        currBucket.buffer.set(data.subarray(0, freeBytesInCurrBuffer), currBucket.offset);
        currBucket.offset += freeBytesInCurrBuffer;
        data = data.subarray(freeBytesInCurrBuffer, data.byteLength);
      }
      var numBuckets = (data.byteLength / PIPEFS.BUCKET_BUFFER_SIZE) | 0;
      var remElements = data.byteLength % PIPEFS.BUCKET_BUFFER_SIZE;
      for (var i = 0; i < numBuckets; i++) {
        var newBucket = {
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: PIPEFS.BUCKET_BUFFER_SIZE,
          roffset: 0
        };
        pipe.buckets.push(newBucket);
        newBucket.buffer.set(data.subarray(0, PIPEFS.BUCKET_BUFFER_SIZE));
        data = data.subarray(PIPEFS.BUCKET_BUFFER_SIZE, data.byteLength);
      }
      if (remElements > 0) {
        var newBucket = {
          buffer: new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),
          offset: data.byteLength,
          roffset: 0
        };
        pipe.buckets.push(newBucket);
        newBucket.buffer.set(data);
      }
      return dataLen;
    },
    close(stream) {
      var pipe = stream.node.pipe;
      pipe.refcnt--;
      if (pipe.refcnt === 0) {
        pipe.buckets = null;
      }
    }
  },
  nextname() {
    if (!PIPEFS.nextname.current) {
      PIPEFS.nextname.current = 0;
    }
    return "pipe[" + (PIPEFS.nextname.current++) + "]";
  }
};

function ___syscall_pipe(fdPtr) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(17, 0, 1, fdPtr);
  try {
    if (fdPtr == 0) {
      throw new FS.ErrnoError(21);
    }
    var res = PIPEFS.createPipe();
    (growMemViews(), HEAP32)[((fdPtr) >> 2)] = res.readable_fd;
    (growMemViews(), HEAP32)[(((fdPtr) + (4)) >> 2)] = res.writable_fd;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_readlinkat(dirfd, path, buf, bufsize) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(18, 0, 1, dirfd, path, buf, bufsize);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize, lengthBytesUTF8(ret));
    var endChar = (growMemViews(), HEAP8)[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
    // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
    (growMemViews(), HEAP8)[buf + len] = endChar;
    return len;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var SOCKFS = {
  websocketArgs: {},
  callbacks: {},
  on(event, callback) {
    SOCKFS.callbacks[event] = callback;
  },
  emit(event, param) {
    SOCKFS.callbacks[event]?.(param);
  },
  mount(mount) {
    // The incomming Module['websocket'] can be used for configuring 
    // configuring subprotocol/url, etc
    SOCKFS.websocketArgs = Module["websocket"] || {};
    // Add the Event registration mechanism to the exported websocket configuration
    // object so we can register network callbacks from native JavaScript too.
    // For more documentation see system/include/emscripten/emscripten.h
    (Module["websocket"] ??= {})["on"] = SOCKFS.on;
    return FS.createNode(null, "/", 16895, 0);
  },
  createSocket(family, type, protocol) {
    // Emscripten only supports AF_INET
    if (family != 2) {
      throw new FS.ErrnoError(5);
    }
    type &= ~526336;
    // Some applications may pass it; it makes no sense for a single process.
    // Emscripten only supports SOCK_STREAM and SOCK_DGRAM
    if (type != 1 && type != 2) {
      throw new FS.ErrnoError(28);
    }
    var streaming = type == 1;
    if (streaming && protocol && protocol != 6) {
      throw new FS.ErrnoError(66);
    }
    // create our internal socket structure
    var sock = {
      family,
      type,
      protocol,
      server: null,
      error: null,
      // Used in getsockopt for SOL_SOCKET/SO_ERROR test
      peers: {},
      pending: [],
      recv_queue: [],
      sock_ops: SOCKFS.websocket_sock_ops
    };
    // create the filesystem node to store the socket structure
    var name = SOCKFS.nextname();
    var node = FS.createNode(SOCKFS.root, name, 49152, 0);
    node.sock = sock;
    // and the wrapping stream that enables library functions such
    // as read and write to indirectly interact with the socket
    var stream = FS.createStream({
      path: name,
      node,
      flags: 2,
      seekable: false,
      stream_ops: SOCKFS.stream_ops
    });
    // map the new stream to the socket structure (sockets have a 1:1
    // relationship with a stream)
    sock.stream = stream;
    return sock;
  },
  getSocket(fd) {
    var stream = FS.getStream(fd);
    if (!stream || !FS.isSocket(stream.node.mode)) {
      return null;
    }
    return stream.node.sock;
  },
  stream_ops: {
    poll(stream) {
      var sock = stream.node.sock;
      return sock.sock_ops.poll(sock);
    },
    ioctl(stream, request, varargs) {
      var sock = stream.node.sock;
      return sock.sock_ops.ioctl(sock, request, varargs);
    },
    read(stream, buffer, offset, length, position) {
      var sock = stream.node.sock;
      var msg = sock.sock_ops.recvmsg(sock, length);
      if (!msg) {
        // socket is closed
        return 0;
      }
      buffer.set(msg.buffer, offset);
      return msg.buffer.length;
    },
    write(stream, buffer, offset, length, position) {
      var sock = stream.node.sock;
      return sock.sock_ops.sendmsg(sock, buffer, offset, length);
    },
    close(stream) {
      var sock = stream.node.sock;
      sock.sock_ops.close(sock);
    }
  },
  nextname() {
    if (!SOCKFS.nextname.current) {
      SOCKFS.nextname.current = 0;
    }
    return `socket[${SOCKFS.nextname.current++}]`;
  },
  websocket_sock_ops: {
    createPeer(sock, addr, port) {
      var ws;
      if (typeof addr == "object") {
        ws = addr;
        addr = null;
        port = null;
      }
      if (ws) {
        // for sockets that've already connected (e.g. we're the server)
        // we can inspect the _socket property for the address
        if (ws._socket) {
          addr = ws._socket.remoteAddress;
          port = ws._socket.remotePort;
        } else {
          var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
          if (!result) {
            throw new Error("WebSocket URL must be in the format ws(s)://address:port");
          }
          addr = result[1];
          port = parseInt(result[2], 10);
        }
      } else {
        // create the actual websocket object and connect
        try {
          // The default value is 'ws://' the replace is needed because the compiler replaces '//' comments with '#'
          // comments without checking context, so we'd end up with ws:#, the replace swaps the '#' for '//' again.
          var url = "ws://".replace("#", "//");
          // Make the WebSocket subprotocol (Sec-WebSocket-Protocol) default to binary if no configuration is set.
          var subProtocols = "binary";
          // The default value is 'binary'
          // The default WebSocket options
          var opts = undefined;
          // Fetch runtime WebSocket URL config.
          if (SOCKFS.websocketArgs["url"]) {
            url = SOCKFS.websocketArgs["url"];
          }
          // Fetch runtime WebSocket subprotocol config.
          if (SOCKFS.websocketArgs["subprotocol"]) {
            subProtocols = SOCKFS.websocketArgs["subprotocol"];
          } else if (SOCKFS.websocketArgs["subprotocol"] === null) {
            subProtocols = "null";
          }
          if (url === "ws://" || url === "wss://") {
            // Is the supplied URL config just a prefix, if so complete it.
            var parts = addr.split("/");
            url = url + parts[0] + ":" + port + "/" + parts.slice(1).join("/");
          }
          if (subProtocols !== "null") {
            // The regex trims the string (removes spaces at the beginning and end, then splits the string by
            // <any space>,<any space> into an Array. Whitespace removal is important for Websockify and ws.
            subProtocols = subProtocols.replace(/^ +| +$/g, "").split(/ *, */);
            opts = subProtocols;
          }
          // If node we use the ws library.
          var WebSocketConstructor;
          if (ENVIRONMENT_IS_NODE) {
            WebSocketConstructor = /** @type{(typeof WebSocket)} */ (require("ws"));
          } else {
            WebSocketConstructor = WebSocket;
          }
          ws = new WebSocketConstructor(url, opts);
          ws.binaryType = "arraybuffer";
        } catch (e) {
          throw new FS.ErrnoError(23);
        }
      }
      var peer = {
        addr,
        port,
        socket: ws,
        msg_send_queue: []
      };
      SOCKFS.websocket_sock_ops.addPeer(sock, peer);
      SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
      // if this is a bound dgram socket, send the port number first to allow
      // us to override the ephemeral port reported to us by remotePort on the
      // remote end.
      if (sock.type === 2 && typeof sock.sport != "undefined") {
        peer.msg_send_queue.push(new Uint8Array([ 255, 255, 255, 255, "p".charCodeAt(0), "o".charCodeAt(0), "r".charCodeAt(0), "t".charCodeAt(0), ((sock.sport & 65280) >> 8), (sock.sport & 255) ]));
      }
      return peer;
    },
    getPeer(sock, addr, port) {
      return sock.peers[addr + ":" + port];
    },
    addPeer(sock, peer) {
      sock.peers[peer.addr + ":" + peer.port] = peer;
    },
    removePeer(sock, peer) {
      delete sock.peers[peer.addr + ":" + peer.port];
    },
    handlePeerEvents(sock, peer) {
      var first = true;
      var handleOpen = function() {
        sock.connecting = false;
        SOCKFS.emit("open", sock.stream.fd);
        try {
          var queued = peer.msg_send_queue.shift();
          while (queued) {
            peer.socket.send(queued);
            queued = peer.msg_send_queue.shift();
          }
        } catch (e) {
          // not much we can do here in the way of proper error handling as we've already
          // lied and said this data was sent. shut it down.
          peer.socket.close();
        }
      };
      function handleMessage(data) {
        if (typeof data == "string") {
          var encoder = new TextEncoder;
          // should be utf-8
          data = encoder.encode(data);
        } else {
          if (data.byteLength == 0) {
            // An empty ArrayBuffer will emit a pseudo disconnect event
            // as recv/recvmsg will return zero which indicates that a socket
            // has performed a shutdown although the connection has not been disconnected yet.
            return;
          }
          data = new Uint8Array(data);
        }
        // if this is the port message, override the peer's port with it
        var wasfirst = first;
        first = false;
        if (wasfirst && data.length === 10 && data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 && data[4] === "p".charCodeAt(0) && data[5] === "o".charCodeAt(0) && data[6] === "r".charCodeAt(0) && data[7] === "t".charCodeAt(0)) {
          // update the peer's port and it's key in the peer map
          var newport = ((data[8] << 8) | data[9]);
          SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          peer.port = newport;
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          return;
        }
        sock.recv_queue.push({
          addr: peer.addr,
          port: peer.port,
          data
        });
        SOCKFS.emit("message", sock.stream.fd);
      }
      if (ENVIRONMENT_IS_NODE) {
        peer.socket.on("open", handleOpen);
        peer.socket.on("message", function(data, isBinary) {
          if (!isBinary) {
            return;
          }
          handleMessage((new Uint8Array(data)).buffer);
        });
        peer.socket.on("close", function() {
          SOCKFS.emit("close", sock.stream.fd);
        });
        peer.socket.on("error", function(error) {
          // Although the ws library may pass errors that may be more descriptive than
          // ECONNREFUSED they are not necessarily the expected error code e.g.
          // ENOTFOUND on getaddrinfo seems to be node.js specific, so using ECONNREFUSED
          // is still probably the most useful thing to do.
          sock.error = 14;
          // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
          SOCKFS.emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
        });
      } else {
        peer.socket.onopen = handleOpen;
        peer.socket.onclose = function() {
          SOCKFS.emit("close", sock.stream.fd);
        };
        peer.socket.onmessage = function peer_socket_onmessage(event) {
          handleMessage(event.data);
        };
        peer.socket.onerror = function(error) {
          // The WebSocket spec only allows a 'simple event' to be thrown on error,
          // so we only really know as much as ECONNREFUSED.
          sock.error = 14;
          // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
          SOCKFS.emit("error", [ sock.stream.fd, sock.error, "ECONNREFUSED: Connection refused" ]);
        };
      }
    },
    poll(sock) {
      if (sock.type === 1 && sock.server) {
        // listen sockets should only say they're available for reading
        // if there are pending clients.
        return sock.pending.length ? (64 | 1) : 0;
      }
      var mask = 0;
      var dest = sock.type === 1 ? // we only care about the socket state for connection-based sockets
      SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) : null;
      if (sock.recv_queue.length || !dest || // connection-less sockets are always ready to read
      (dest && dest.socket.readyState === dest.socket.CLOSING) || (dest && dest.socket.readyState === dest.socket.CLOSED)) {
        // let recv return 0 once closed
        mask |= (64 | 1);
      }
      if (!dest || // connection-less sockets are always ready to write
      (dest && dest.socket.readyState === dest.socket.OPEN)) {
        mask |= 4;
      }
      if ((dest && dest.socket.readyState === dest.socket.CLOSING) || (dest && dest.socket.readyState === dest.socket.CLOSED)) {
        // When an non-blocking connect fails mark the socket as writable.
        // Its up to the calling code to then use getsockopt with SO_ERROR to
        // retrieve the error.
        // See https://man7.org/linux/man-pages/man2/connect.2.html
        if (sock.connecting) {
          mask |= 4;
        } else {
          mask |= 16;
        }
      }
      return mask;
    },
    ioctl(sock, request, arg) {
      switch (request) {
       case 21531:
        var bytes = 0;
        if (sock.recv_queue.length) {
          bytes = sock.recv_queue[0].data.length;
        }
        (growMemViews(), HEAP32)[((arg) >> 2)] = bytes;
        return 0;

       case 21537:
        var on = (growMemViews(), HEAP32)[((arg) >> 2)];
        if (on) {
          sock.stream.flags |= 2048;
        } else {
          sock.stream.flags &= ~2048;
        }
        return 0;

       default:
        return 28;
      }
    },
    close(sock) {
      // if we've spawned a listen server, close it
      if (sock.server) {
        try {
          sock.server.close();
        } catch (e) {}
        sock.server = null;
      }
      // close any peer connections
      for (var peer of Object.values(sock.peers)) {
        try {
          peer.socket.close();
        } catch (e) {}
        SOCKFS.websocket_sock_ops.removePeer(sock, peer);
      }
      return 0;
    },
    bind(sock, addr, port) {
      if (typeof sock.saddr != "undefined" || typeof sock.sport != "undefined") {
        throw new FS.ErrnoError(28);
      }
      sock.saddr = addr;
      sock.sport = port;
      // in order to emulate dgram sockets, we need to launch a listen server when
      // binding on a connection-less socket
      // note: this is only required on the server side
      if (sock.type === 2) {
        // close the existing server if it exists
        if (sock.server) {
          sock.server.close();
          sock.server = null;
        }
        // swallow error operation not supported error that occurs when binding in the
        // browser where this isn't supported
        try {
          sock.sock_ops.listen(sock, 0);
        } catch (e) {
          if (!(e.name === "ErrnoError")) throw e;
          if (e.errno !== 138) throw e;
        }
      }
    },
    connect(sock, addr, port) {
      if (sock.server) {
        throw new FS.ErrnoError(138);
      }
      // TODO autobind
      // if (!sock.addr && sock.type == 2) {
      // }
      // early out if we're already connected / in the middle of connecting
      if (typeof sock.daddr != "undefined" && typeof sock.dport != "undefined") {
        var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
        if (dest) {
          if (dest.socket.readyState === dest.socket.CONNECTING) {
            throw new FS.ErrnoError(7);
          } else {
            throw new FS.ErrnoError(30);
          }
        }
      }
      // add the socket to our peer list and set our
      // destination address / port to match
      var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
      sock.daddr = peer.addr;
      sock.dport = peer.port;
      // because we cannot synchronously block to wait for the WebSocket
      // connection to complete, we return here pretending that the connection
      // was a success.
      sock.connecting = true;
    },
    listen(sock, backlog) {
      if (!ENVIRONMENT_IS_NODE) {
        throw new FS.ErrnoError(138);
      }
      if (sock.server) {
        throw new FS.ErrnoError(28);
      }
      var WebSocketServer = require("ws").Server;
      var host = sock.saddr;
      sock.server = new WebSocketServer({
        host,
        port: sock.sport
      });
      SOCKFS.emit("listen", sock.stream.fd);
      // Send Event with listen fd.
      sock.server.on("connection", function(ws) {
        if (sock.type === 1) {
          var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
          // create a peer on the new socket
          var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
          newsock.daddr = peer.addr;
          newsock.dport = peer.port;
          // push to queue for accept to pick up
          sock.pending.push(newsock);
          SOCKFS.emit("connection", newsock.stream.fd);
        } else {
          // create a peer on the listen socket so calling sendto
          // with the listen socket and an address will resolve
          // to the correct client
          SOCKFS.websocket_sock_ops.createPeer(sock, ws);
          SOCKFS.emit("connection", sock.stream.fd);
        }
      });
      sock.server.on("close", function() {
        SOCKFS.emit("close", sock.stream.fd);
        sock.server = null;
      });
      sock.server.on("error", function(error) {
        // Although the ws library may pass errors that may be more descriptive than
        // ECONNREFUSED they are not necessarily the expected error code e.g.
        // ENOTFOUND on getaddrinfo seems to be node.js specific, so using EHOSTUNREACH
        // is still probably the most useful thing to do. This error shouldn't
        // occur in a well written app as errors should get trapped in the compiled
        // app's own getaddrinfo call.
        sock.error = 23;
        // Used in getsockopt for SOL_SOCKET/SO_ERROR test.
        SOCKFS.emit("error", [ sock.stream.fd, sock.error, "EHOSTUNREACH: Host is unreachable" ]);
      });
    },
    accept(listensock) {
      if (!listensock.server || !listensock.pending.length) {
        throw new FS.ErrnoError(28);
      }
      var newsock = listensock.pending.shift();
      newsock.stream.flags = listensock.stream.flags;
      return newsock;
    },
    getname(sock, peer) {
      var addr, port;
      if (peer) {
        if (sock.daddr === undefined || sock.dport === undefined) {
          throw new FS.ErrnoError(53);
        }
        addr = sock.daddr;
        port = sock.dport;
      } else {
        // TODO saddr and sport will be set for bind()'d UDP sockets, but what
        // should we be returning for TCP sockets that've been connect()'d?
        addr = sock.saddr || 0;
        port = sock.sport || 0;
      }
      return {
        addr,
        port
      };
    },
    sendmsg(sock, buffer, offset, length, addr, port) {
      if (sock.type === 2) {
        // connection-less sockets will honor the message address,
        // and otherwise fall back to the bound destination address
        if (addr === undefined || port === undefined) {
          addr = sock.daddr;
          port = sock.dport;
        }
        // if there was no address to fall back to, error out
        if (addr === undefined || port === undefined) {
          throw new FS.ErrnoError(17);
        }
      } else {
        // connection-based sockets will only use the bound
        addr = sock.daddr;
        port = sock.dport;
      }
      // find the peer for the destination address
      var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
      // early out if not connected with a connection-based socket
      if (sock.type === 1) {
        if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
          throw new FS.ErrnoError(53);
        }
      }
      // create a copy of the incoming data to send, as the WebSocket API
      // doesn't work entirely with an ArrayBufferView, it'll just send
      // the entire underlying buffer
      if (ArrayBuffer.isView(buffer)) {
        offset += buffer.byteOffset;
        buffer = buffer.buffer;
      }
      var data = buffer.slice(offset, offset + length);
      // WebSockets .send() does not allow passing a SharedArrayBuffer, so
      // clone the the SharedArrayBuffer as regular ArrayBuffer before
      // sending.
      if (data instanceof SharedArrayBuffer) {
        data = new Uint8Array(new Uint8Array(data)).buffer;
      }
      // if we don't have a cached connectionless UDP datagram connection, or
      // the TCP socket is still connecting, queue the message to be sent upon
      // connect, and lie, saying the data was sent now.
      if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
        // if we're not connected, open a new connection
        if (sock.type === 2) {
          if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
            dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          }
        }
        dest.msg_send_queue.push(data);
        return length;
      }
      try {
        // send the actual data
        dest.socket.send(data);
        return length;
      } catch (e) {
        throw new FS.ErrnoError(28);
      }
    },
    recvmsg(sock, length) {
      // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
      if (sock.type === 1 && sock.server) {
        // tcp servers should not be recv()'ing on the listen socket
        throw new FS.ErrnoError(53);
      }
      var queued = sock.recv_queue.shift();
      if (!queued) {
        if (sock.type === 1) {
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
          if (!dest) {
            // if we have a destination address but are not connected, error out
            throw new FS.ErrnoError(53);
          }
          if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
            // return null if the socket has closed
            return null;
          }
          // else, our socket is in a valid state but truly has nothing available
          throw new FS.ErrnoError(6);
        }
        throw new FS.ErrnoError(6);
      }
      // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
      // requeued TCP data it'll be an ArrayBufferView
      var queuedLength = queued.data.byteLength || queued.data.length;
      var queuedOffset = queued.data.byteOffset || 0;
      var queuedBuffer = queued.data.buffer || queued.data;
      var bytesRead = Math.min(length, queuedLength);
      var res = {
        buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
        addr: queued.addr,
        port: queued.port
      };
      // push back any unread data for TCP connections
      if (sock.type === 1 && bytesRead < queuedLength) {
        var bytesRemaining = queuedLength - bytesRead;
        queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
        sock.recv_queue.unshift(queued);
      }
      return res;
    }
  }
};

var getSocketFromFD = fd => {
  var socket = SOCKFS.getSocket(fd);
  if (!socket) throw new FS.ErrnoError(8);
  return socket;
};

var inetPton4 = str => {
  var b = str.split(".");
  for (var i = 0; i < 4; i++) {
    var tmp = Number(b[i]);
    if (isNaN(tmp)) return null;
    b[i] = tmp;
  }
  return (b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)) >>> 0;
};

var inetPton6 = str => {
  var words;
  var w, offset, z, i;
  /* http://home.deds.nl/~aeron/regex/ */ var valid6regx = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;
  var parts = [];
  if (!valid6regx.test(str)) {
    return null;
  }
  if (str === "::") {
    return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  }
  // Z placeholder to keep track of zeros when splitting the string on ":"
  if (str.startsWith("::")) {
    str = str.replace("::", "Z:");
  } else {
    str = str.replace("::", ":Z:");
  }
  if (str.indexOf(".") > 0) {
    // parse IPv4 embedded stress
    str = str.replace(new RegExp("[.]", "g"), ":");
    words = str.split(":");
    words[words.length - 4] = Number(words[words.length - 4]) + Number(words[words.length - 3]) * 256;
    words[words.length - 3] = Number(words[words.length - 2]) + Number(words[words.length - 1]) * 256;
    words = words.slice(0, words.length - 2);
  } else {
    words = str.split(":");
  }
  offset = 0;
  z = 0;
  for (w = 0; w < words.length; w++) {
    if (typeof words[w] == "string") {
      if (words[w] === "Z") {
        // compressed zeros - write appropriate number of zero words
        for (z = 0; z < (8 - words.length + 1); z++) {
          parts[w + z] = 0;
        }
        offset = z - 1;
      } else {
        // parse hex to field to 16-bit value and write it in network byte-order
        parts[w + offset] = _htons(parseInt(words[w], 16));
      }
    } else {
      // parsed IPv4 words
      parts[w + offset] = words[w];
    }
  }
  return [ (parts[1] << 16) | parts[0], (parts[3] << 16) | parts[2], (parts[5] << 16) | parts[4], (parts[7] << 16) | parts[6] ];
};

/** @param {number=} addrlen */ var writeSockaddr = (sa, family, addr, port, addrlen) => {
  switch (family) {
   case 2:
    addr = inetPton4(addr);
    zeroMemory(sa, 16);
    if (addrlen) {
      (growMemViews(), HEAP32)[((addrlen) >> 2)] = 16;
    }
    (growMemViews(), HEAP16)[((sa) >> 1)] = family;
    (growMemViews(), HEAP32)[(((sa) + (4)) >> 2)] = addr;
    (growMemViews(), HEAP16)[(((sa) + (2)) >> 1)] = _htons(port);
    break;

   case 10:
    addr = inetPton6(addr);
    zeroMemory(sa, 28);
    if (addrlen) {
      (growMemViews(), HEAP32)[((addrlen) >> 2)] = 28;
    }
    (growMemViews(), HEAP32)[((sa) >> 2)] = family;
    (growMemViews(), HEAP32)[(((sa) + (8)) >> 2)] = addr[0];
    (growMemViews(), HEAP32)[(((sa) + (12)) >> 2)] = addr[1];
    (growMemViews(), HEAP32)[(((sa) + (16)) >> 2)] = addr[2];
    (growMemViews(), HEAP32)[(((sa) + (20)) >> 2)] = addr[3];
    (growMemViews(), HEAP16)[(((sa) + (2)) >> 1)] = _htons(port);
    break;

   default:
    return 5;
  }
  return 0;
};

var DNS = {
  address_map: {
    id: 1,
    addrs: {},
    names: {}
  },
  lookup_name(name) {
    // If the name is already a valid ipv4 / ipv6 address, don't generate a fake one.
    var res = inetPton4(name);
    if (res !== null) {
      return name;
    }
    res = inetPton6(name);
    if (res !== null) {
      return name;
    }
    // See if this name is already mapped.
    var addr;
    if (DNS.address_map.addrs[name]) {
      addr = DNS.address_map.addrs[name];
    } else {
      var id = DNS.address_map.id++;
      addr = "172.29." + (id & 255) + "." + (id & 65280);
      DNS.address_map.names[addr] = name;
      DNS.address_map.addrs[name] = addr;
    }
    return addr;
  },
  lookup_addr(addr) {
    if (DNS.address_map.names[addr]) {
      return DNS.address_map.names[addr];
    }
    return null;
  }
};

function ___syscall_recvfrom(fd, buf, len, flags, addr, addrlen) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(19, 0, 1, fd, buf, len, flags, addr, addrlen);
  try {
    var sock = getSocketFromFD(fd);
    var msg = sock.sock_ops.recvmsg(sock, len);
    if (!msg) return 0;
    // socket is closed
    if (addr) {
      var errno = writeSockaddr(addr, sock.family, DNS.lookup_name(msg.addr), msg.port, addrlen);
    }
    (growMemViews(), HEAPU8).set(msg.buffer, buf);
    return msg.buffer.byteLength;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_renameat(olddirfd, oldpath, newdirfd, newpath) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(20, 0, 1, olddirfd, oldpath, newdirfd, newpath);
  try {
    oldpath = SYSCALLS.getStr(oldpath);
    newpath = SYSCALLS.getStr(newpath);
    oldpath = SYSCALLS.calculateAt(olddirfd, oldpath);
    newpath = SYSCALLS.calculateAt(newdirfd, newpath);
    FS.rename(oldpath, newpath);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_rmdir(path) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(21, 0, 1, path);
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var inetNtop4 = addr => (addr & 255) + "." + ((addr >> 8) & 255) + "." + ((addr >> 16) & 255) + "." + ((addr >> 24) & 255);

var inetNtop6 = ints => {
  //  ref:  http://www.ietf.org/rfc/rfc2373.txt - section 2.5.4
  //  Format for IPv4 compatible and mapped  128-bit IPv6 Addresses
  //  128-bits are split into eight 16-bit words
  //  stored in network byte order (big-endian)
  //  |                80 bits               | 16 |      32 bits        |
  //  +-----------------------------------------------------------------+
  //  |               10 bytes               |  2 |      4 bytes        |
  //  +--------------------------------------+--------------------------+
  //  +               5 words                |  1 |      2 words        |
  //  +--------------------------------------+--------------------------+
  //  |0000..............................0000|0000|    IPv4 ADDRESS     | (compatible)
  //  +--------------------------------------+----+---------------------+
  //  |0000..............................0000|FFFF|    IPv4 ADDRESS     | (mapped)
  //  +--------------------------------------+----+---------------------+
  var str = "";
  var word = 0;
  var longest = 0;
  var lastzero = 0;
  var zstart = 0;
  var len = 0;
  var i = 0;
  var parts = [ ints[0] & 65535, (ints[0] >> 16), ints[1] & 65535, (ints[1] >> 16), ints[2] & 65535, (ints[2] >> 16), ints[3] & 65535, (ints[3] >> 16) ];
  // Handle IPv4-compatible, IPv4-mapped, loopback and any/unspecified addresses
  var hasipv4 = true;
  var v4part = "";
  // check if the 10 high-order bytes are all zeros (first 5 words)
  for (i = 0; i < 5; i++) {
    if (parts[i] !== 0) {
      hasipv4 = false;
      break;
    }
  }
  if (hasipv4) {
    // low-order 32-bits store an IPv4 address (bytes 13 to 16) (last 2 words)
    v4part = inetNtop4(parts[6] | (parts[7] << 16));
    // IPv4-mapped IPv6 address if 16-bit value (bytes 11 and 12) == 0xFFFF (6th word)
    if (parts[5] === -1) {
      str = "::ffff:";
      str += v4part;
      return str;
    }
    // IPv4-compatible IPv6 address if 16-bit value (bytes 11 and 12) == 0x0000 (6th word)
    if (parts[5] === 0) {
      str = "::";
      //special case IPv6 addresses
      if (v4part === "0.0.0.0") v4part = "";
      // any/unspecified address
      if (v4part === "0.0.0.1") v4part = "1";
      // loopback address
      str += v4part;
      return str;
    }
  }
  // Handle all other IPv6 addresses
  // first run to find the longest contiguous zero words
  for (word = 0; word < 8; word++) {
    if (parts[word] === 0) {
      if (word - lastzero > 1) {
        len = 0;
      }
      lastzero = word;
      len++;
    }
    if (len > longest) {
      longest = len;
      zstart = word - longest + 1;
    }
  }
  for (word = 0; word < 8; word++) {
    if (longest > 1) {
      // compress contiguous zeros - to produce "::"
      if (parts[word] === 0 && word >= zstart && word < (zstart + longest)) {
        if (word === zstart) {
          str += ":";
          if (zstart === 0) str += ":";
        }
        continue;
      }
    }
    // converts 16-bit words from big-endian to little-endian before converting to hex string
    str += Number(_ntohs(parts[word] & 65535)).toString(16);
    str += word < 7 ? ":" : "";
  }
  return str;
};

var readSockaddr = (sa, salen) => {
  // family / port offsets are common to both sockaddr_in and sockaddr_in6
  var family = (growMemViews(), HEAP16)[((sa) >> 1)];
  var port = _ntohs((growMemViews(), HEAPU16)[(((sa) + (2)) >> 1)]);
  var addr;
  switch (family) {
   case 2:
    if (salen !== 16) {
      return {
        errno: 28
      };
    }
    addr = (growMemViews(), HEAP32)[(((sa) + (4)) >> 2)];
    addr = inetNtop4(addr);
    break;

   case 10:
    if (salen !== 28) {
      return {
        errno: 28
      };
    }
    addr = [ (growMemViews(), HEAP32)[(((sa) + (8)) >> 2)], (growMemViews(), HEAP32)[(((sa) + (12)) >> 2)], (growMemViews(), 
    HEAP32)[(((sa) + (16)) >> 2)], (growMemViews(), HEAP32)[(((sa) + (20)) >> 2)] ];
    addr = inetNtop6(addr);
    break;

   default:
    return {
      errno: 5
    };
  }
  return {
    family,
    addr,
    port
  };
};

var getSocketAddress = (addrp, addrlen) => {
  var info = readSockaddr(addrp, addrlen);
  if (info.errno) throw new FS.ErrnoError(info.errno);
  info.addr = DNS.lookup_addr(info.addr) || info.addr;
  return info;
};

function ___syscall_sendto(fd, message, length, flags, addr, addr_len) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(22, 0, 1, fd, message, length, flags, addr, addr_len);
  try {
    var sock = getSocketFromFD(fd);
    if (!addr) {
      // send, no address provided
      return FS.write(sock.stream, (growMemViews(), HEAP8), message, length);
    }
    var dest = getSocketAddress(addr, addr_len);
    // sendto an address
    return sock.sock_ops.sendmsg(sock, (growMemViews(), HEAP8), message, length, dest.addr, dest.port);
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_stat64(path, buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(23, 0, 1, path, buf);
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.writeStat(buf, FS.stat(path));
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function ___syscall_unlinkat(dirfd, path, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(24, 0, 1, dirfd, path, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path);
    if (!flags) {
      FS.unlink(path);
    } else if (flags === 512) {
      FS.rmdir(path);
    } else {
      return -28;
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var readI53FromI64 = ptr => (growMemViews(), HEAPU32)[((ptr) >> 2)] + (growMemViews(), 
HEAP32)[(((ptr) + (4)) >> 2)] * 4294967296;

function ___syscall_utimensat(dirfd, path, times, flags) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(25, 0, 1, dirfd, path, times, flags);
  try {
    path = SYSCALLS.getStr(path);
    path = SYSCALLS.calculateAt(dirfd, path, true);
    var now = Date.now(), atime, mtime;
    if (!times) {
      atime = now;
      mtime = now;
    } else {
      var seconds = readI53FromI64(times);
      var nanoseconds = (growMemViews(), HEAP32)[(((times) + (8)) >> 2)];
      if (nanoseconds == 1073741823) {
        atime = now;
      } else if (nanoseconds == 1073741822) {
        atime = null;
      } else {
        atime = (seconds * 1e3) + (nanoseconds / (1e3 * 1e3));
      }
      times += 16;
      seconds = readI53FromI64(times);
      nanoseconds = (growMemViews(), HEAP32)[(((times) + (8)) >> 2)];
      if (nanoseconds == 1073741823) {
        mtime = now;
      } else if (nanoseconds == 1073741822) {
        mtime = null;
      } else {
        mtime = (seconds * 1e3) + (nanoseconds / (1e3 * 1e3));
      }
    }
    // null here means UTIME_OMIT was passed. If both were set to UTIME_OMIT then
    // we can skip the call completely.
    if ((mtime ?? atime) !== null) {
      FS.utime(path, atime, mtime);
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __abort_js = () => abort("");

var __emscripten_init_main_thread_js = tb => {
  // Pass the thread address to the native code where they stored in wasm
  // globals which act as a form of TLS. Global constructors trying
  // to access this value will read the wrong value, but that is UB anyway.
  __emscripten_thread_init(tb, /*is_main=*/ !ENVIRONMENT_IS_WORKER, /*is_runtime=*/ 1, /*can_block=*/ !ENVIRONMENT_IS_WEB, /*default_stacksize=*/ 4194304, /*start_profiling=*/ false);
  PThread.threadInitTLS();
};

var handleException = e => {
  // Certain exception types we do not treat as errors since they are used for
  // internal control flow.
  // 1. ExitStatus, which is thrown by exit()
  // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
  //    that wish to return to JS event loop.
  if (e instanceof ExitStatus || e == "unwind") {
    return EXITSTATUS;
  }
  quit_(1, e);
};

var maybeExit = () => {
  if (!keepRuntimeAlive()) {
    try {
      if (ENVIRONMENT_IS_PTHREAD) {
        // exit the current thread, but only if there is one active.
        // TODO(https://github.com/emscripten-core/emscripten/issues/25076):
        // Unify this check with the runtimeExited check above
        if (_pthread_self()) __emscripten_thread_exit(EXITSTATUS);
        return;
      }
      _exit(EXITSTATUS);
    } catch (e) {
      handleException(e);
    }
  }
};

var callUserCallback = func => {
  if (ABORT) {
    return;
  }
  try {
    func();
    maybeExit();
  } catch (e) {
    handleException(e);
  }
};

var __emscripten_thread_mailbox_await = pthread_ptr => {
  if (typeof Atomics.waitAsync === "function") {
    // Wait on the pthread's initial self-pointer field because it is easy and
    // safe to access from sending threads that need to notify the waiting
    // thread.
    // TODO: How to make this work with wasm64?
    var wait = Atomics.waitAsync((growMemViews(), HEAP32), ((pthread_ptr) >> 2), pthread_ptr);
    wait.value.then(checkMailbox);
    var waitingAsync = pthread_ptr + 128;
    Atomics.store((growMemViews(), HEAP32), ((waitingAsync) >> 2), 1);
  }
};

var checkMailbox = () => callUserCallback(() => {
  // Only check the mailbox if we have a live pthread runtime. We implement
  // pthread_self to return 0 if there is no live runtime.
  // TODO(https://github.com/emscripten-core/emscripten/issues/25076):
  // Is this check still needed?  `callUserCallback` is supposed to
  // ensure the runtime is alive, and if `_pthread_self` is NULL then the
  // runtime certainly is *not* alive, so this should be a redundant check.
  var pthread_ptr = _pthread_self();
  if (pthread_ptr) {
    // If we are using Atomics.waitAsync as our notification mechanism, wait
    // for a notification before processing the mailbox to avoid missing any
    // work that could otherwise arrive after we've finished processing the
    // mailbox and before we're ready for the next notification.
    __emscripten_thread_mailbox_await(pthread_ptr);
    __emscripten_check_mailbox();
  }
});

var __emscripten_notify_mailbox_postmessage = (targetThread, currThreadId) => {
  if (targetThread == currThreadId) {
    setTimeout(checkMailbox);
  } else if (ENVIRONMENT_IS_PTHREAD) {
    postMessage({
      targetThread,
      cmd: "checkMailbox"
    });
  } else {
    var worker = PThread.pthreads[targetThread];
    if (!worker) {
      return;
    }
    worker.postMessage({
      cmd: "checkMailbox"
    });
  }
};

var proxiedJSCallArgs = [];

var __emscripten_receive_on_main_thread_js = (funcIndex, emAsmAddr, callingThread, numCallArgs, args) => {
  // Sometimes we need to backproxy events to the calling thread (e.g.
  // HTML5 DOM events handlers such as
  // emscripten_set_mousemove_callback()), so keep track in a globally
  // accessible variable about the thread that initiated the proxying.
  numCallArgs /= 2;
  proxiedJSCallArgs.length = numCallArgs;
  var b = ((args) >> 3);
  for (var i = 0; i < numCallArgs; i++) {
    if ((growMemViews(), HEAP64)[b + 2 * i]) {
      // It's a BigInt.
      proxiedJSCallArgs[i] = (growMemViews(), HEAP64)[b + 2 * i + 1];
    } else {
      // It's a Number.
      proxiedJSCallArgs[i] = (growMemViews(), HEAPF64)[b + 2 * i + 1];
    }
  }
  // Proxied JS library funcs use funcIndex and EM_ASM functions use emAsmAddr
  var func = emAsmAddr ? ASM_CONSTS[emAsmAddr] : proxiedFunctionTable[funcIndex];
  PThread.currentProxiedOperationCallerThread = callingThread;
  var rtn = func(...proxiedJSCallArgs);
  PThread.currentProxiedOperationCallerThread = 0;
  return rtn;
};

var __emscripten_runtime_keepalive_clear = () => {
  noExitRuntime = false;
  runtimeKeepaliveCounter = 0;
};

var __emscripten_thread_cleanup = thread => {
  // Called when a thread needs to be cleaned up so it can be reused.
  // A thread is considered reusable when it either returns from its
  // entry point, calls pthread_exit, or acts upon a cancellation.
  // Detached threads are responsible for calling this themselves,
  // otherwise pthread_join is responsible for calling this.
  if (!ENVIRONMENT_IS_PTHREAD) cleanupThread(thread); else postMessage({
    cmd: "cleanupThread",
    thread
  });
};

var __emscripten_thread_set_strongref = thread => {
  // Called when a thread needs to be strongly referenced.
  // Currently only used for:
  // - keeping the "main" thread alive in PROXY_TO_PTHREAD mode;
  // - crashed threads that needs to propagate the uncaught exception
  //   back to the main thread.
  if (ENVIRONMENT_IS_NODE) {
    PThread.pthreads[thread].ref();
  }
};

var __emscripten_throw_longjmp = () => {
  throw Infinity;
};

var isLeapYear = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

var MONTH_DAYS_LEAP_CUMULATIVE = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ];

var MONTH_DAYS_REGULAR_CUMULATIVE = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];

var ydayFromDate = date => {
  var leap = isLeapYear(date.getFullYear());
  var monthDaysCumulative = (leap ? MONTH_DAYS_LEAP_CUMULATIVE : MONTH_DAYS_REGULAR_CUMULATIVE);
  var yday = monthDaysCumulative[date.getMonth()] + date.getDate() - 1;
  // -1 since it's days since Jan 1
  return yday;
};

function __localtime_js(time, tmPtr) {
  time = bigintToI53Checked(time);
  var date = new Date(time * 1e3);
  (growMemViews(), HEAP32)[((tmPtr) >> 2)] = date.getSeconds();
  (growMemViews(), HEAP32)[(((tmPtr) + (4)) >> 2)] = date.getMinutes();
  (growMemViews(), HEAP32)[(((tmPtr) + (8)) >> 2)] = date.getHours();
  (growMemViews(), HEAP32)[(((tmPtr) + (12)) >> 2)] = date.getDate();
  (growMemViews(), HEAP32)[(((tmPtr) + (16)) >> 2)] = date.getMonth();
  (growMemViews(), HEAP32)[(((tmPtr) + (20)) >> 2)] = date.getFullYear() - 1900;
  (growMemViews(), HEAP32)[(((tmPtr) + (24)) >> 2)] = date.getDay();
  var yday = ydayFromDate(date) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (28)) >> 2)] = yday;
  (growMemViews(), HEAP32)[(((tmPtr) + (36)) >> 2)] = -(date.getTimezoneOffset() * 60);
  // Attention: DST is in December in South, and some regions don't have DST at all.
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  (growMemViews(), HEAP32)[(((tmPtr) + (32)) >> 2)] = dst;
}

function __mmap_js(len, prot, flags, fd, offset, allocated, addr) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(26, 0, 1, len, prot, flags, fd, offset, allocated, addr);
  offset = bigintToI53Checked(offset);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var res = FS.mmap(stream, len, offset, prot, flags);
    var ptr = res.ptr;
    (growMemViews(), HEAP32)[((allocated) >> 2)] = res.allocated;
    (growMemViews(), HEAPU32)[((addr) >> 2)] = ptr;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

function __munmap_js(addr, len, prot, flags, fd, offset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(27, 0, 1, addr, len, prot, flags, fd, offset);
  offset = bigintToI53Checked(offset);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (prot & 2) {
      SYSCALLS.doMsync(addr, stream, len, flags, offset);
    }
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return -e.errno;
  }
}

var __tzset_js = (timezone, daylight, std_name, dst_name) => {
  // TODO: Use (malleable) environment variables instead of system settings.
  var currentYear = (new Date).getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  var winterOffset = winter.getTimezoneOffset();
  var summerOffset = summer.getTimezoneOffset();
  // Local standard timezone offset. Local standard time is not adjusted for
  // daylight savings.  This code uses the fact that getTimezoneOffset returns
  // a greater value during Standard Time versus Daylight Saving Time (DST).
  // Thus it determines the expected output during Standard Time, and it
  // compares whether the output of the given date the same (Standard) or less
  // (DST).
  var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  // timezone is specified as seconds west of UTC ("The external variable
  // `timezone` shall be set to the difference, in seconds, between
  // Coordinated Universal Time (UTC) and local standard time."), the same
  // as returned by stdTimezoneOffset.
  // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
  (growMemViews(), HEAPU32)[((timezone) >> 2)] = stdTimezoneOffset * 60;
  (growMemViews(), HEAP32)[((daylight) >> 2)] = Number(winterOffset != summerOffset);
  var extractZone = timezoneOffset => {
    // Why inverse sign?
    // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    var sign = timezoneOffset >= 0 ? "-" : "+";
    var absOffset = Math.abs(timezoneOffset);
    var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
    var minutes = String(absOffset % 60).padStart(2, "0");
    return `UTC${sign}${hours}${minutes}`;
  };
  var winterName = extractZone(winterOffset);
  var summerName = extractZone(summerOffset);
  if (summerOffset < winterOffset) {
    // Northern hemisphere
    stringToUTF8(winterName, std_name, 17);
    stringToUTF8(summerName, dst_name, 17);
  } else {
    stringToUTF8(winterName, dst_name, 17);
    stringToUTF8(summerName, std_name, 17);
  }
};

var runtimeKeepalivePush = () => {
  runtimeKeepaliveCounter += 1;
};

var _emscripten_set_main_loop_timing = (mode, value) => {
  MainLoop.timingMode = mode;
  MainLoop.timingValue = value;
  if (!MainLoop.func) {
    return 1;
  }
  if (!MainLoop.running) {
    runtimeKeepalivePush();
    MainLoop.running = true;
  }
  if (mode == 0) {
    MainLoop.scheduler = function MainLoop_scheduler_setTimeout() {
      var timeUntilNextTick = Math.max(0, MainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
      setTimeout(MainLoop.runner, timeUntilNextTick);
    };
    MainLoop.method = "timeout";
  } else if (mode == 1) {
    MainLoop.scheduler = function MainLoop_scheduler_rAF() {
      MainLoop.requestAnimationFrame(MainLoop.runner);
    };
    MainLoop.method = "rAF";
  } else if (mode == 2) {
    if (typeof MainLoop.setImmediate == "undefined") {
      if (typeof setImmediate == "undefined") {
        // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
        var setImmediates = [];
        var emscriptenMainLoopMessageId = "setimmediate";
        /** @param {Event} event */ var MainLoop_setImmediate_messageHandler = event => {
          // When called in current thread or Worker, the main loop ID is structured slightly different to accommodate for --proxy-to-worker runtime listening to Worker events,
          // so check for both cases.
          if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
            event.stopPropagation();
            setImmediates.shift()();
          }
        };
        addEventListener("message", MainLoop_setImmediate_messageHandler, true);
        MainLoop.setImmediate = /** @type{function(function(): ?, ...?): number} */ (func => {
          setImmediates.push(func);
          if (ENVIRONMENT_IS_WORKER) {
            Module["setImmediates"] ??= [];
            Module["setImmediates"].push(func);
            postMessage({
              target: emscriptenMainLoopMessageId
            });
          } else postMessage(emscriptenMainLoopMessageId, "*");
        });
      } else {
        MainLoop.setImmediate = setImmediate;
      }
    }
    MainLoop.scheduler = function MainLoop_scheduler_setImmediate() {
      MainLoop.setImmediate(MainLoop.runner);
    };
    MainLoop.method = "immediate";
  }
  return 0;
};

var _emscripten_get_now = () => performance.timeOrigin + performance.now();

var runtimeKeepalivePop = () => {
  runtimeKeepaliveCounter -= 1;
};

/**
     * @param {number=} arg
     * @param {boolean=} noSetTiming
     */ var setMainLoop = (iterFunc, fps, simulateInfiniteLoop, arg, noSetTiming) => {
  MainLoop.func = iterFunc;
  MainLoop.arg = arg;
  var thisMainLoopId = MainLoop.currentlyRunningMainloop;
  function checkIsRunning() {
    if (thisMainLoopId < MainLoop.currentlyRunningMainloop) {
      runtimeKeepalivePop();
      maybeExit();
      return false;
    }
    return true;
  }
  // We create the loop runner here but it is not actually running until
  // _emscripten_set_main_loop_timing is called (which might happen a
  // later time).  This member signifies that the current runner has not
  // yet been started so that we can call runtimeKeepalivePush when it
  // gets it timing set for the first time.
  MainLoop.running = false;
  MainLoop.runner = function MainLoop_runner() {
    if (ABORT) return;
    if (MainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = MainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (MainLoop.remainingBlockers) {
        var remaining = MainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          MainLoop.remainingBlockers = next;
        } else {
          // not counted, but move the progress along a tiny bit
          next = next + .5;
          // do not steal all the next one's progress
          MainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      MainLoop.updateStatus();
      // catches pause/resume main loop from blocker execution
      if (!checkIsRunning()) return;
      setTimeout(MainLoop.runner, 0);
      return;
    }
    // catch pauses from non-main loop sources
    if (!checkIsRunning()) return;
    // Implement very basic swap interval control
    MainLoop.currentFrameNumber = MainLoop.currentFrameNumber + 1 | 0;
    if (MainLoop.timingMode == 1 && MainLoop.timingValue > 1 && MainLoop.currentFrameNumber % MainLoop.timingValue != 0) {
      // Not the scheduled time to render this frame - skip.
      MainLoop.scheduler();
      return;
    } else if (MainLoop.timingMode == 0) {
      MainLoop.tickStartTime = _emscripten_get_now();
    }
    MainLoop.runIter(iterFunc);
    // catch pauses from the main loop itself
    if (!checkIsRunning()) return;
    MainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps > 0) {
      _emscripten_set_main_loop_timing(0, 1e3 / fps);
    } else {
      // Do rAF by rendering each frame (no decimating)
      _emscripten_set_main_loop_timing(1, 1);
    }
    MainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
};

var MainLoop = {
  running: false,
  scheduler: null,
  method: "",
  currentlyRunningMainloop: 0,
  func: null,
  arg: 0,
  timingMode: 0,
  timingValue: 0,
  currentFrameNumber: 0,
  queue: [],
  preMainLoop: [],
  postMainLoop: [],
  pause() {
    MainLoop.scheduler = null;
    // Incrementing this signals the previous main loop that it's now become old, and it must return.
    MainLoop.currentlyRunningMainloop++;
  },
  resume() {
    MainLoop.currentlyRunningMainloop++;
    var timingMode = MainLoop.timingMode;
    var timingValue = MainLoop.timingValue;
    var func = MainLoop.func;
    MainLoop.func = null;
    // do not set timing and call scheduler, we will do it on the next lines
    setMainLoop(func, 0, false, MainLoop.arg, true);
    _emscripten_set_main_loop_timing(timingMode, timingValue);
    MainLoop.scheduler();
  },
  updateStatus() {
    if (Module["setStatus"]) {
      var message = Module["statusMessage"] || "Please wait...";
      var remaining = MainLoop.remainingBlockers ?? 0;
      var expected = MainLoop.expectedBlockers ?? 0;
      if (remaining) {
        if (remaining < expected) {
          Module["setStatus"](`{message} ({expected - remaining}/{expected})`);
        } else {
          Module["setStatus"](message);
        }
      } else {
        Module["setStatus"]("");
      }
    }
  },
  init() {
    Module["preMainLoop"] && MainLoop.preMainLoop.push(Module["preMainLoop"]);
    Module["postMainLoop"] && MainLoop.postMainLoop.push(Module["postMainLoop"]);
  },
  runIter(func) {
    if (ABORT) return;
    for (var pre of MainLoop.preMainLoop) {
      if (pre() === false) {
        return;
      }
    }
    callUserCallback(func);
    for (var post of MainLoop.postMainLoop) {
      post();
    }
  },
  nextRAF: 0,
  fakeRequestAnimationFrame(func) {
    // try to keep 60fps between calls to here
    var now = Date.now();
    if (MainLoop.nextRAF === 0) {
      MainLoop.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= MainLoop.nextRAF) {
        // fudge a little, to avoid timer jitter causing us to do lots of delay:0
        MainLoop.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(MainLoop.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame(func) {
    if (typeof requestAnimationFrame == "function") {
      requestAnimationFrame(func);
    } else {
      MainLoop.fakeRequestAnimationFrame(func);
    }
  }
};

var AL = {
  QUEUE_INTERVAL: 25,
  QUEUE_LOOKAHEAD: .1,
  DEVICE_NAME: "Emscripten OpenAL",
  CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
  ALC_EXTENSIONS: {
    ALC_SOFT_pause_device: true,
    ALC_SOFT_HRTF: true
  },
  AL_EXTENSIONS: {
    AL_EXT_float32: true,
    AL_SOFT_loop_points: true,
    AL_SOFT_source_length: true,
    AL_EXT_source_distance_model: true,
    AL_SOFT_source_spatialize: true
  },
  _alcErr: 0,
  alcErr: 0,
  deviceRefCounts: {},
  alcStringCache: {},
  paused: false,
  stringCache: {},
  contexts: {},
  currentCtx: null,
  buffers: {
    0: {
      id: 0,
      refCount: 0,
      audioBuf: null,
      frequency: 0,
      bytesPerSample: 2,
      channels: 1,
      length: 0
    }
  },
  paramArray: [],
  _nextId: 1,
  newId: () => AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++,
  freeIds: [],
  scheduleContextAudio: ctx => {
    // If we are animating using the requestAnimationFrame method, then the main loop does not run when in the background.
    // To give a perfect glitch-free audio stop when switching from foreground to background, we need to avoid updating
    // audio altogether when in the background, so detect that case and kill audio buffer streaming if so.
    if (MainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
      return;
    }
    for (var i in ctx.sources) {
      AL.scheduleSourceAudio(ctx.sources[i]);
    }
  },
  scheduleSourceAudio: (src, lookahead) => {
    // See comment on scheduleContextAudio above.
    if (MainLoop.timingMode === 1 && document["visibilityState"] != "visible") {
      return;
    }
    if (src.state !== 4114) {
      return;
    }
    var currentTime = AL.updateSourceTime(src);
    var startTime = src.bufStartTime;
    var startOffset = src.bufOffset;
    var bufCursor = src.bufsProcessed;
    // Advance past any audio that is already scheduled
    for (var i = 0; i < src.audioQueue.length; i++) {
      var audioSrc = src.audioQueue[i];
      startTime = audioSrc._startTime + audioSrc._duration;
      startOffset = 0;
      bufCursor += audioSrc._skipCount + 1;
    }
    if (!lookahead) {
      lookahead = AL.QUEUE_LOOKAHEAD;
    }
    var lookaheadTime = currentTime + lookahead;
    var skipCount = 0;
    while (startTime < lookaheadTime) {
      if (bufCursor >= src.bufQueue.length) {
        if (src.looping) {
          bufCursor %= src.bufQueue.length;
        } else {
          break;
        }
      }
      var buf = src.bufQueue[bufCursor % src.bufQueue.length];
      // If the buffer contains no data, skip it
      if (buf.length === 0) {
        skipCount++;
        // If we've gone through the whole queue and everything is 0 length, just give up
        if (skipCount === src.bufQueue.length) {
          break;
        }
      } else {
        var audioSrc = src.context.audioCtx.createBufferSource();
        audioSrc.buffer = buf.audioBuf;
        audioSrc.playbackRate.value = src.playbackRate;
        if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
          audioSrc.loopStart = buf.audioBuf._loopStart;
          audioSrc.loopEnd = buf.audioBuf._loopEnd;
        }
        var duration = 0;
        // If the source is a looping static buffer, use native looping for gapless playback
        if (src.type === 4136 && src.looping) {
          duration = Number.POSITIVE_INFINITY;
          audioSrc.loop = true;
          if (buf.audioBuf._loopStart) {
            audioSrc.loopStart = buf.audioBuf._loopStart;
          }
          if (buf.audioBuf._loopEnd) {
            audioSrc.loopEnd = buf.audioBuf._loopEnd;
          }
        } else {
          duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
        }
        audioSrc._startOffset = startOffset;
        audioSrc._duration = duration;
        audioSrc._skipCount = skipCount;
        skipCount = 0;
        audioSrc.connect(src.gain);
        if (typeof audioSrc.start != "undefined") {
          // Sample the current time as late as possible to mitigate drift
          startTime = Math.max(startTime, src.context.audioCtx.currentTime);
          audioSrc.start(startTime, startOffset);
        } else if (typeof audioSrc.noteOn != "undefined") {
          startTime = Math.max(startTime, src.context.audioCtx.currentTime);
          audioSrc.noteOn(startTime);
        }
        audioSrc._startTime = startTime;
        src.audioQueue.push(audioSrc);
        startTime += duration;
      }
      startOffset = 0;
      bufCursor++;
    }
  },
  updateSourceTime: src => {
    var currentTime = src.context.audioCtx.currentTime;
    if (src.state !== 4114) {
      return currentTime;
    }
    // if the start time is unset, determine it based on the current offset.
    // This will be the case when a source is resumed after being paused, and
    // allows us to pretend that the source actually started playing some time
    // in the past such that it would just now have reached the stored offset.
    if (!isFinite(src.bufStartTime)) {
      src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
      src.bufOffset = 0;
    }
    var nextStartTime = 0;
    while (src.audioQueue.length) {
      var audioSrc = src.audioQueue[0];
      src.bufsProcessed += audioSrc._skipCount;
      nextStartTime = audioSrc._startTime + audioSrc._duration;
      // n.b. audioSrc._duration already factors in playbackRate, so no divide by src.playbackRate on it.
      if (currentTime < nextStartTime) {
        break;
      }
      src.audioQueue.shift();
      src.bufStartTime = nextStartTime;
      src.bufOffset = 0;
      src.bufsProcessed++;
    }
    if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
      // The source has played its entire queue and is non-looping, so just mark it as stopped.
      AL.setSourceState(src, 4116);
    } else if (src.type === 4136 && src.looping) {
      // If the source is a looping static buffer, determine the buffer offset based on the loop points
      var buf = src.bufQueue[0];
      if (buf.length === 0) {
        src.bufOffset = 0;
      } else {
        var delta = (currentTime - src.bufStartTime) * src.playbackRate;
        var loopStart = buf.audioBuf._loopStart || 0;
        var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
        if (loopEnd <= loopStart) {
          loopEnd = buf.audioBuf.duration;
        }
        if (delta < loopEnd) {
          src.bufOffset = delta;
        } else {
          src.bufOffset = loopStart + (delta - loopStart) % (loopEnd - loopStart);
        }
      }
    } else if (src.audioQueue[0]) {
      // The source is still actively playing, so we just need to calculate where we are in the current buffer
      // so it can be remembered if the source gets paused.
      src.bufOffset = (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
    } else {
      // The source hasn't finished yet, but there is no scheduled audio left for it. This can be because
      // the source has just been started/resumed, or due to an underrun caused by a long blocking operation.
      // We need to determine what state we would be in by this point in time so that when we next schedule
      // audio playback, it will be just as if no underrun occurred.
      if (src.type !== 4136 && src.looping) {
        // if the source is a looping buffer queue, let's first calculate the queue duration, so we can
        // quickly fast forward past any full loops of the queue and only worry about the remainder.
        var srcDuration = AL.sourceDuration(src) / src.playbackRate;
        if (srcDuration > 0) {
          src.bufStartTime += Math.floor((currentTime - src.bufStartTime) / srcDuration) * srcDuration;
        }
      }
      // Since we've already skipped any full-queue loops if there were any, we just need to find
      // out where in the queue the remaining time puts us, which won't require stepping through the
      // entire queue more than once.
      for (var i = 0; i < src.bufQueue.length; i++) {
        if (src.bufsProcessed >= src.bufQueue.length) {
          if (src.looping) {
            src.bufsProcessed %= src.bufQueue.length;
          } else {
            AL.setSourceState(src, 4116);
            break;
          }
        }
        var buf = src.bufQueue[src.bufsProcessed];
        if (buf.length > 0) {
          nextStartTime = src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
          if (currentTime < nextStartTime) {
            src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
            break;
          }
          src.bufStartTime = nextStartTime;
        }
        src.bufOffset = 0;
        src.bufsProcessed++;
      }
    }
    return currentTime;
  },
  cancelPendingSourceAudio: src => {
    AL.updateSourceTime(src);
    for (var i = 1; i < src.audioQueue.length; i++) {
      var audioSrc = src.audioQueue[i];
      audioSrc.stop();
    }
    if (src.audioQueue.length > 1) {
      src.audioQueue.length = 1;
    }
  },
  stopSourceAudio: src => {
    for (var i = 0; i < src.audioQueue.length; i++) {
      src.audioQueue[i].stop();
    }
    src.audioQueue.length = 0;
  },
  setSourceState: (src, state) => {
    if (state === 4114) {
      if (src.state === 4114 || src.state == 4116) {
        src.bufsProcessed = 0;
        src.bufOffset = 0;
      } else {}
      AL.stopSourceAudio(src);
      src.state = 4114;
      src.bufStartTime = Number.NEGATIVE_INFINITY;
      AL.scheduleSourceAudio(src);
    } else if (state === 4115) {
      if (src.state === 4114) {
        // Store off the current offset to restore with on resume.
        AL.updateSourceTime(src);
        AL.stopSourceAudio(src);
        src.state = 4115;
      }
    } else if (state === 4116) {
      if (src.state !== 4113) {
        src.state = 4116;
        src.bufsProcessed = src.bufQueue.length;
        src.bufStartTime = Number.NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src);
      }
    } else if (state === 4113) {
      if (src.state !== 4113) {
        src.state = 4113;
        src.bufsProcessed = 0;
        src.bufStartTime = Number.NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src);
      }
    }
  },
  initSourcePanner: src => {
    if (src.type === 4144) {
      return;
    }
    // Find the first non-zero buffer in the queue to determine the proper format
    var templateBuf = AL.buffers[0];
    for (var i = 0; i < src.bufQueue.length; i++) {
      if (src.bufQueue[i].id !== 0) {
        templateBuf = src.bufQueue[i];
        break;
      }
    }
    // Create a panner if AL_SOURCE_SPATIALIZE_SOFT is set to true, or alternatively if it's set to auto and the source is mono
    if (src.spatialize === 1 || (src.spatialize === 2 && templateBuf.channels === 1)) {
      if (src.panner) {
        return;
      }
      src.panner = src.context.audioCtx.createPanner();
      AL.updateSourceGlobal(src);
      AL.updateSourceSpace(src);
      src.panner.connect(src.context.gain);
      src.gain.disconnect();
      src.gain.connect(src.panner);
    } else {
      if (!src.panner) {
        return;
      }
      src.panner.disconnect();
      src.gain.disconnect();
      src.gain.connect(src.context.gain);
      src.panner = null;
    }
  },
  updateContextGlobal: ctx => {
    for (var i in ctx.sources) {
      AL.updateSourceGlobal(ctx.sources[i]);
    }
  },
  updateSourceGlobal: src => {
    var panner = src.panner;
    if (!panner) {
      return;
    }
    panner.refDistance = src.refDistance;
    panner.maxDistance = src.maxDistance;
    panner.rolloffFactor = src.rolloffFactor;
    panner.panningModel = src.context.hrtf ? "HRTF" : "equalpower";
    // Use the source's distance model if AL_SOURCE_DISTANCE_MODEL is enabled
    var distanceModel = src.context.sourceDistanceModel ? src.distanceModel : src.context.distanceModel;
    switch (distanceModel) {
     case 0:
      panner.distanceModel = "inverse";
      panner.refDistance = 340282e33;
      break;

     case 53249:
     case 53250:
      panner.distanceModel = "inverse";
      break;

     case 53251:
     case 53252:
      panner.distanceModel = "linear";
      break;

     case 53253:
     case 53254:
      panner.distanceModel = "exponential";
      break;
    }
  },
  updateListenerSpace: ctx => {
    var listener = ctx.audioCtx.listener;
    if (listener.positionX) {
      listener.positionX.value = ctx.listener.position[0];
      listener.positionY.value = ctx.listener.position[1];
      listener.positionZ.value = ctx.listener.position[2];
    } else {
      listener.setPosition(ctx.listener.position[0], ctx.listener.position[1], ctx.listener.position[2]);
    }
    if (listener.forwardX) {
      listener.forwardX.value = ctx.listener.direction[0];
      listener.forwardY.value = ctx.listener.direction[1];
      listener.forwardZ.value = ctx.listener.direction[2];
      listener.upX.value = ctx.listener.up[0];
      listener.upY.value = ctx.listener.up[1];
      listener.upZ.value = ctx.listener.up[2];
    } else {
      listener.setOrientation(ctx.listener.direction[0], ctx.listener.direction[1], ctx.listener.direction[2], ctx.listener.up[0], ctx.listener.up[1], ctx.listener.up[2]);
    }
    // Update sources that are relative to the listener
    for (var i in ctx.sources) {
      AL.updateSourceSpace(ctx.sources[i]);
    }
  },
  updateSourceSpace: src => {
    if (!src.panner) {
      return;
    }
    var panner = src.panner;
    var posX = src.position[0];
    var posY = src.position[1];
    var posZ = src.position[2];
    var dirX = src.direction[0];
    var dirY = src.direction[1];
    var dirZ = src.direction[2];
    var listener = src.context.listener;
    var lPosX = listener.position[0];
    var lPosY = listener.position[1];
    var lPosZ = listener.position[2];
    // WebAudio does spatialization in world-space coordinates, meaning both the buffer sources and
    // the listener position are in the same absolute coordinate system relative to a fixed origin.
    // By default, OpenAL works this way as well, but it also provides a "listener relative" mode, where
    // a buffer source's coordinate are interpreted not in absolute world space, but as being relative
    // to the listener object itself, so as the listener moves the source appears to move with it
    // with no update required. Since web audio does not support this mode, we must transform the source
    // coordinates from listener-relative space to absolute world space.
    // We do this via affine transformation matrices applied to the source position and source direction.
    // A change-of-basis converts from listener-space displacements to world-space displacements,
    // which must be done for both the source position and direction. Lastly, the source position must be
    // added to the listener position to get the final source position, since the source position represents
    // a displacement from the listener.
    if (src.relative) {
      // Negate the listener direction since forward is -Z.
      var lBackX = -listener.direction[0];
      var lBackY = -listener.direction[1];
      var lBackZ = -listener.direction[2];
      var lUpX = listener.up[0];
      var lUpY = listener.up[1];
      var lUpZ = listener.up[2];
      var inverseMagnitude = (x, y, z) => {
        var length = Math.sqrt(x * x + y * y + z * z);
        if (length < Number.EPSILON) {
          return 0;
        }
        return 1 / length;
      };
      // Normalize the Back vector
      var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
      lBackX *= invMag;
      lBackY *= invMag;
      lBackZ *= invMag;
      // ...and the Up vector
      invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
      lUpX *= invMag;
      lUpY *= invMag;
      lUpZ *= invMag;
      // Calculate the Right vector as the cross product of the Up and Back vectors
      var lRightX = (lUpY * lBackZ - lUpZ * lBackY);
      var lRightY = (lUpZ * lBackX - lUpX * lBackZ);
      var lRightZ = (lUpX * lBackY - lUpY * lBackX);
      // Back and Up might not be exactly perpendicular, so the cross product also needs normalization
      invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
      lRightX *= invMag;
      lRightY *= invMag;
      lRightZ *= invMag;
      // Recompute Up from the now orthonormal Right and Back vectors so we have a fully orthonormal basis
      lUpX = (lBackY * lRightZ - lBackZ * lRightY);
      lUpY = (lBackZ * lRightX - lBackX * lRightZ);
      lUpZ = (lBackX * lRightY - lBackY * lRightX);
      var oldX = dirX;
      var oldY = dirY;
      var oldZ = dirZ;
      // Use our 3 vectors to apply a change-of-basis matrix to the source direction
      dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
      dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
      dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
      oldX = posX;
      oldY = posY;
      oldZ = posZ;
      // ...and to the source position
      posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
      posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
      posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
      // The change-of-basis corrects the orientation, but the origin is still the listener.
      // Translate the source position by the listener position to finish.
      posX += lPosX;
      posY += lPosY;
      posZ += lPosZ;
    }
    if (panner.positionX) {
      // Assigning to panner.positionX/Y/Z unnecessarily seems to cause performance issues
      // See https://github.com/emscripten-core/emscripten/issues/15847
      if (posX != panner.positionX.value) panner.positionX.value = posX;
      if (posY != panner.positionY.value) panner.positionY.value = posY;
      if (posZ != panner.positionZ.value) panner.positionZ.value = posZ;
    } else {
      panner.setPosition(posX, posY, posZ);
    }
    if (panner.orientationX) {
      // Assigning to panner.orientation/Y/Z unnecessarily seems to cause performance issues
      // See https://github.com/emscripten-core/emscripten/issues/15847
      if (dirX != panner.orientationX.value) panner.orientationX.value = dirX;
      if (dirY != panner.orientationY.value) panner.orientationY.value = dirY;
      if (dirZ != panner.orientationZ.value) panner.orientationZ.value = dirZ;
    } else {
      panner.setOrientation(dirX, dirY, dirZ);
    }
    var oldShift = src.dopplerShift;
    var velX = src.velocity[0];
    var velY = src.velocity[1];
    var velZ = src.velocity[2];
    var lVelX = listener.velocity[0];
    var lVelY = listener.velocity[1];
    var lVelZ = listener.velocity[2];
    if (posX === lPosX && posY === lPosY && posZ === lPosZ || velX === lVelX && velY === lVelY && velZ === lVelZ) {
      src.dopplerShift = 1;
    } else {
      // Doppler algorithm from 1.1 spec
      var speedOfSound = src.context.speedOfSound;
      var dopplerFactor = src.context.dopplerFactor;
      var slX = lPosX - posX;
      var slY = lPosY - posY;
      var slZ = lPosZ - posZ;
      var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
      var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
      var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
      vls = Math.min(vls, speedOfSound / dopplerFactor);
      vss = Math.min(vss, speedOfSound / dopplerFactor);
      src.dopplerShift = (speedOfSound - dopplerFactor * vls) / (speedOfSound - dopplerFactor * vss);
    }
    if (src.dopplerShift !== oldShift) {
      AL.updateSourceRate(src);
    }
  },
  updateSourceRate: src => {
    if (src.state === 4114) {
      // clear scheduled buffers
      AL.cancelPendingSourceAudio(src);
      var audioSrc = src.audioQueue[0];
      if (!audioSrc) {
        return;
      }
      var duration;
      if (src.type === 4136 && src.looping) {
        duration = Number.POSITIVE_INFINITY;
      } else {
        // audioSrc._duration is expressed after factoring in playbackRate, so when changing playback rate, need
        // to recompute/rescale the rate to the new playback speed.
        duration = (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
      }
      audioSrc._duration = duration;
      audioSrc.playbackRate.value = src.playbackRate;
      // reschedule buffers with the new playbackRate
      AL.scheduleSourceAudio(src);
    }
  },
  sourceDuration: src => {
    var length = 0;
    for (var i = 0; i < src.bufQueue.length; i++) {
      var audioBuf = src.bufQueue[i].audioBuf;
      length += audioBuf ? audioBuf.duration : 0;
    }
    return length;
  },
  sourceTell: src => {
    AL.updateSourceTime(src);
    var offset = 0;
    for (var i = 0; i < src.bufsProcessed; i++) {
      if (src.bufQueue[i].audioBuf) {
        offset += src.bufQueue[i].audioBuf.duration;
      }
    }
    offset += src.bufOffset;
    return offset;
  },
  sourceSeek: (src, offset) => {
    var playing = src.state == 4114;
    if (playing) {
      AL.setSourceState(src, 4113);
    }
    if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
      src.bufsProcessed = 0;
      while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
        offset -= src.bufQueue[src.bufsProcessed].audioBuf.duration;
        src.bufsProcessed++;
      }
      src.bufOffset = offset;
    }
    if (playing) {
      AL.setSourceState(src, 4114);
    }
  },
  getGlobalParam: (funcname, param) => {
    if (!AL.currentCtx) {
      return null;
    }
    switch (param) {
     case 49152:
      return AL.currentCtx.dopplerFactor;

     case 49155:
      return AL.currentCtx.speedOfSound;

     case 53248:
      return AL.currentCtx.distanceModel;

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setGlobalParam: (funcname, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    switch (param) {
     case 49152:
      if (!Number.isFinite(value) || value < 0) {
        // Strictly negative values are disallowed
        AL.currentCtx.err = 40963;
        return;
      }
      AL.currentCtx.dopplerFactor = value;
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 49155:
      if (!Number.isFinite(value) || value <= 0) {
        // Negative or zero values are disallowed
        AL.currentCtx.err = 40963;
        return;
      }
      AL.currentCtx.speedOfSound = value;
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 53248:
      switch (value) {
       case 0:
       case 53249:
       case 53250:
       case 53251:
       case 53252:
       case 53253:
       case 53254:
        AL.currentCtx.distanceModel = value;
        AL.updateContextGlobal(AL.currentCtx);
        break;

       default:
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  getListenerParam: (funcname, param) => {
    if (!AL.currentCtx) {
      return null;
    }
    switch (param) {
     case 4100:
      return AL.currentCtx.listener.position;

     case 4102:
      return AL.currentCtx.listener.velocity;

     case 4111:
      return AL.currentCtx.listener.direction.concat(AL.currentCtx.listener.up);

     case 4106:
      return AL.currentCtx.gain.gain.value;

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setListenerParam: (funcname, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    var listener = AL.currentCtx.listener;
    switch (param) {
     case 4100:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      listener.position[0] = value[0];
      listener.position[1] = value[1];
      listener.position[2] = value[2];
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 4102:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      listener.velocity[0] = value[0];
      listener.velocity[1] = value[1];
      listener.velocity[2] = value[2];
      AL.updateListenerSpace(AL.currentCtx);
      break;

     case 4106:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.currentCtx.gain.gain.value = value;
      break;

     case 4111:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2]) || !Number.isFinite(value[3]) || !Number.isFinite(value[4]) || !Number.isFinite(value[5])) {
        AL.currentCtx.err = 40963;
        return;
      }
      listener.direction[0] = value[0];
      listener.direction[1] = value[1];
      listener.direction[2] = value[2];
      listener.up[0] = value[3];
      listener.up[1] = value[4];
      listener.up[2] = value[5];
      AL.updateListenerSpace(AL.currentCtx);
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  getBufferParam: (funcname, bufferId, param) => {
    if (!AL.currentCtx) {
      return;
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return;
    }
    switch (param) {
     case 8193:
      return buf.frequency;

     case 8194:
      return buf.bytesPerSample * 8;

     case 8195:
      return buf.channels;

     case 8196:
      return buf.length * buf.bytesPerSample * buf.channels;

     case 8213:
      if (buf.length === 0) {
        return [ 0, 0 ];
      }
      return [ (buf.audioBuf._loopStart || 0) * buf.frequency, (buf.audioBuf._loopEnd || buf.length) * buf.frequency ];

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setBufferParam: (funcname, bufferId, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    switch (param) {
     case 8196:
      if (value !== 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      // Per the spec, setting AL_SIZE to 0 is a legal NOP.
      break;

     case 8213:
      if (value[0] < 0 || value[0] > buf.length || value[1] < 0 || value[1] > buf.Length || value[0] >= value[1]) {
        AL.currentCtx.err = 40963;
        return;
      }
      if (buf.refCount > 0) {
        AL.currentCtx.err = 40964;
        return;
      }
      if (buf.audioBuf) {
        buf.audioBuf._loopStart = value[0] / buf.frequency;
        buf.audioBuf._loopEnd = value[1] / buf.frequency;
      }
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  getSourceParam: (funcname, sourceId, param) => {
    if (!AL.currentCtx) {
      return null;
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return null;
    }
    switch (param) {
     case 514:
      return src.relative;

     case 4097:
      return src.coneInnerAngle;

     case 4098:
      return src.coneOuterAngle;

     case 4099:
      return src.pitch;

     case 4100:
      return src.position;

     case 4101:
      return src.direction;

     case 4102:
      return src.velocity;

     case 4103:
      return src.looping;

     case 4105:
      if (src.type === 4136) {
        return src.bufQueue[0].id;
      }
      return 0;

     case 4106:
      return src.gain.gain.value;

     case 4109:
      return src.minGain;

     case 4110:
      return src.maxGain;

     case 4112:
      return src.state;

     case 4117:
      if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
        return 0;
      }
      return src.bufQueue.length;

     case 4118:
      if ((src.bufQueue.length === 1 && src.bufQueue[0].id === 0) || src.looping) {
        return 0;
      }
      return src.bufsProcessed;

     case 4128:
      return src.refDistance;

     case 4129:
      return src.rolloffFactor;

     case 4130:
      return src.coneOuterGain;

     case 4131:
      return src.maxDistance;

     case 4132:
      return AL.sourceTell(src);

     case 4133:
      var offset = AL.sourceTell(src);
      if (offset > 0) {
        offset *= src.bufQueue[0].frequency;
      }
      return offset;

     case 4134:
      var offset = AL.sourceTell(src);
      if (offset > 0) {
        offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
      }
      return offset;

     case 4135:
      return src.type;

     case 4628:
      return src.spatialize;

     case 8201:
      var length = 0;
      var bytesPerFrame = 0;
      for (var i = 0; i < src.bufQueue.length; i++) {
        length += src.bufQueue[i].length;
        if (src.bufQueue[i].id !== 0) {
          bytesPerFrame = src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
        }
      }
      return length * bytesPerFrame;

     case 8202:
      var length = 0;
      for (var i = 0; i < src.bufQueue.length; i++) {
        length += src.bufQueue[i].length;
      }
      return length;

     case 8203:
      return AL.sourceDuration(src);

     case 53248:
      return src.distanceModel;

     default:
      AL.currentCtx.err = 40962;
      return null;
    }
  },
  setSourceParam: (funcname, sourceId, param, value) => {
    if (!AL.currentCtx) {
      return;
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    switch (param) {
     case 514:
      if (value === 1) {
        src.relative = true;
        AL.updateSourceSpace(src);
      } else if (value === 0) {
        src.relative = false;
        AL.updateSourceSpace(src);
      } else {
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     case 4097:
      if (!Number.isFinite(value)) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.coneInnerAngle = value;
      if (src.panner) {
        src.panner.coneInnerAngle = value % 360;
      }
      break;

     case 4098:
      if (!Number.isFinite(value)) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.coneOuterAngle = value;
      if (src.panner) {
        src.panner.coneOuterAngle = value % 360;
      }
      break;

     case 4099:
      if (!Number.isFinite(value) || value <= 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      if (src.pitch === value) {
        break;
      }
      src.pitch = value;
      AL.updateSourceRate(src);
      break;

     case 4100:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.position[0] = value[0];
      src.position[1] = value[1];
      src.position[2] = value[2];
      AL.updateSourceSpace(src);
      break;

     case 4101:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.direction[0] = value[0];
      src.direction[1] = value[1];
      src.direction[2] = value[2];
      AL.updateSourceSpace(src);
      break;

     case 4102:
      if (!Number.isFinite(value[0]) || !Number.isFinite(value[1]) || !Number.isFinite(value[2])) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.velocity[0] = value[0];
      src.velocity[1] = value[1];
      src.velocity[2] = value[2];
      AL.updateSourceSpace(src);
      break;

     case 4103:
      if (value === 1) {
        src.looping = true;
        AL.updateSourceTime(src);
        if (src.type === 4136 && src.audioQueue.length > 0) {
          var audioSrc = src.audioQueue[0];
          audioSrc.loop = true;
          audioSrc._duration = Number.POSITIVE_INFINITY;
        }
      } else if (value === 0) {
        src.looping = false;
        var currentTime = AL.updateSourceTime(src);
        if (src.type === 4136 && src.audioQueue.length > 0) {
          var audioSrc = src.audioQueue[0];
          audioSrc.loop = false;
          audioSrc._duration = src.bufQueue[0].audioBuf.duration / src.playbackRate;
          audioSrc._startTime = currentTime - src.bufOffset / src.playbackRate;
        }
      } else {
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     case 4105:
      if (src.state === 4114 || src.state === 4115) {
        AL.currentCtx.err = 40964;
        return;
      }
      if (value === 0) {
        for (var i in src.bufQueue) {
          src.bufQueue[i].refCount--;
        }
        src.bufQueue.length = 1;
        src.bufQueue[0] = AL.buffers[0];
        src.bufsProcessed = 0;
        src.type = 4144;
      } else {
        var buf = AL.buffers[value];
        if (!buf) {
          AL.currentCtx.err = 40963;
          return;
        }
        for (var i in src.bufQueue) {
          src.bufQueue[i].refCount--;
        }
        src.bufQueue.length = 0;
        buf.refCount++;
        src.bufQueue = [ buf ];
        src.bufsProcessed = 0;
        src.type = 4136;
      }
      AL.initSourcePanner(src);
      AL.scheduleSourceAudio(src);
      break;

     case 4106:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.gain.gain.value = value;
      break;

     case 4109:
      if (!Number.isFinite(value) || value < 0 || value > Math.min(src.maxGain, 1)) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.minGain = value;
      break;

     case 4110:
      if (!Number.isFinite(value) || value < Math.max(0, src.minGain) || value > 1) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.maxGain = value;
      break;

     case 4128:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.refDistance = value;
      if (src.panner) {
        src.panner.refDistance = value;
      }
      break;

     case 4129:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.rolloffFactor = value;
      if (src.panner) {
        src.panner.rolloffFactor = value;
      }
      break;

     case 4130:
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.coneOuterGain = value;
      if (src.panner) {
        src.panner.coneOuterGain = value;
      }
      break;

     case 4131:
      if (!Number.isFinite(value) || value < 0) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.maxDistance = value;
      if (src.panner) {
        src.panner.maxDistance = value;
      }
      break;

     case 4132:
      if (value < 0 || value > AL.sourceDuration(src)) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.sourceSeek(src, value);
      break;

     case 4133:
      var srcLen = AL.sourceDuration(src);
      if (srcLen > 0) {
        var frequency;
        for (var bufId in src.bufQueue) {
          if (bufId) {
            frequency = src.bufQueue[bufId].frequency;
            break;
          }
        }
        value /= frequency;
      }
      if (value < 0 || value > srcLen) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.sourceSeek(src, value);
      break;

     case 4134:
      var srcLen = AL.sourceDuration(src);
      if (srcLen > 0) {
        var bytesPerSec;
        for (var bufId in src.bufQueue) {
          if (bufId) {
            var buf = src.bufQueue[bufId];
            bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
            break;
          }
        }
        value /= bytesPerSec;
      }
      if (value < 0 || value > srcLen) {
        AL.currentCtx.err = 40963;
        return;
      }
      AL.sourceSeek(src, value);
      break;

     case 4628:
      if (value !== 0 && value !== 1 && value !== 2) {
        AL.currentCtx.err = 40963;
        return;
      }
      src.spatialize = value;
      AL.initSourcePanner(src);
      break;

     case 8201:
     case 8202:
     case 8203:
      AL.currentCtx.err = 40964;
      break;

     case 53248:
      switch (value) {
       case 0:
       case 53249:
       case 53250:
       case 53251:
       case 53252:
       case 53253:
       case 53254:
        src.distanceModel = value;
        if (AL.currentCtx.sourceDistanceModel) {
          AL.updateContextGlobal(AL.currentCtx);
        }
        break;

       default:
        AL.currentCtx.err = 40963;
        return;
      }
      break;

     default:
      AL.currentCtx.err = 40962;
      return;
    }
  },
  captures: {},
  sharedCaptureAudioCtx: null,
  requireValidCaptureDevice: (deviceId, funcname) => {
    if (deviceId === 0) {
      AL.alcErr = 40961;
      return null;
    }
    var c = AL.captures[deviceId];
    if (!c) {
      AL.alcErr = 40961;
      return null;
    }
    var err = c.mediaStreamError;
    if (err) {
      AL.alcErr = 40961;
      return null;
    }
    return c;
  }
};

function _alDeleteBuffers(count, pBufferIds) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(28, 0, 1, count, pBufferIds);
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var bufId = (growMemViews(), HEAP32)[(((pBufferIds) + (i * 4)) >> 2)];
    /// Deleting the zero buffer is a legal NOP, so ignore it
    if (bufId === 0) {
      continue;
    }
    // Make sure the buffer index is valid.
    if (!AL.buffers[bufId]) {
      AL.currentCtx.err = 40961;
      return;
    }
    // Make sure the buffer is no longer in use.
    if (AL.buffers[bufId].refCount) {
      AL.currentCtx.err = 40964;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = (growMemViews(), HEAP32)[(((pBufferIds) + (i * 4)) >> 2)];
    if (bufId === 0) {
      continue;
    }
    AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
    delete AL.buffers[bufId];
    AL.freeIds.push(bufId);
  }
}

function _alGetSourcei(sourceId, param, pValue) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(29, 0, 1, sourceId, param, pValue);
  var val = AL.getSourceParam("alGetSourcei", sourceId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
   case 514:
   case 4097:
   case 4098:
   case 4103:
   case 4105:
   case 4112:
   case 4117:
   case 4118:
   case 4128:
   case 4129:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 4135:
   case 4628:
   case 8201:
   case 8202:
   case 53248:
    (growMemViews(), HEAP32)[((pValue) >> 2)] = val;
    break;

   default:
    AL.currentCtx.err = 40962;
    return;
  }
}

function _alIsBuffer(bufferId) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(30, 0, 1, bufferId);
  if (!AL.currentCtx) {
    return false;
  }
  if (bufferId > AL.buffers.length) {
    return false;
  }
  if (!AL.buffers[bufferId]) {
    return false;
  }
  return true;
}

function _alSourceStop(sourceId) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(31, 0, 1, sourceId);
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4116);
}

function _alSourcei(sourceId, param, value) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(32, 0, 1, sourceId, param, value);
  switch (param) {
   case 514:
   case 4097:
   case 4098:
   case 4103:
   case 4105:
   case 4128:
   case 4129:
   case 4131:
   case 4132:
   case 4133:
   case 4134:
   case 4628:
   case 8201:
   case 8202:
   case 53248:
    AL.setSourceParam("alSourcei", sourceId, param, value);
    break;

   default:
    AL.setSourceParam("alSourcei", sourceId, param, null);
    break;
  }
}

var _emscripten_date_now = () => Date.now();

var nowIsMonotonic = 1;

var checkWasiClock = clock_id => clock_id >= 0 && clock_id <= 3;

function _clock_time_get(clk_id, ignored_precision, ptime) {
  ignored_precision = bigintToI53Checked(ignored_precision);
  if (!checkWasiClock(clk_id)) {
    return 28;
  }
  var now;
  // all wasi clocks but realtime are monotonic
  if (clk_id === 0) {
    now = _emscripten_date_now();
  } else if (nowIsMonotonic) {
    now = _emscripten_get_now();
  } else {
    return 52;
  }
  // "now" is in ms, and wasi times are in ns.
  var nsec = Math.round(now * 1e3 * 1e3);
  (growMemViews(), HEAP64)[((ptime) >> 3)] = BigInt(nsec);
  return 0;
}

var readEmAsmArgsArray = [];

var readEmAsmArgs = (sigPtr, buf) => {
  readEmAsmArgsArray.length = 0;
  var ch;
  // Most arguments are i32s, so shift the buffer pointer so it is a plain
  // index into HEAP32.
  while (ch = (growMemViews(), HEAPU8)[sigPtr++]) {
    // Floats are always passed as doubles, so all types except for 'i'
    // are 8 bytes and require alignment.
    var wide = (ch != 105);
    wide &= (ch != 112);
    buf += wide && (buf % 8) ? 4 : 0;
    readEmAsmArgsArray.push(// Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
    ch == 112 ? (growMemViews(), HEAPU32)[((buf) >> 2)] : ch == 106 ? (growMemViews(), 
    HEAP64)[((buf) >> 3)] : ch == 105 ? (growMemViews(), HEAP32)[((buf) >> 2)] : (growMemViews(), 
    HEAPF64)[((buf) >> 3)]);
    buf += wide ? 8 : 4;
  }
  return readEmAsmArgsArray;
};

var runEmAsmFunction = (code, sigPtr, argbuf) => {
  var args = readEmAsmArgs(sigPtr, argbuf);
  return ASM_CONSTS[code](...args);
};

var _emscripten_asm_const_double = (code, sigPtr, argbuf) => runEmAsmFunction(code, sigPtr, argbuf);

var _emscripten_asm_const_int = (code, sigPtr, argbuf) => runEmAsmFunction(code, sigPtr, argbuf);

var _emscripten_asm_const_ptr = (code, sigPtr, argbuf) => runEmAsmFunction(code, sigPtr, argbuf);

var _emscripten_cancel_main_loop = () => {
  MainLoop.pause();
  MainLoop.func = null;
};

var _emscripten_check_blocking_allowed = () => {};

var _emscripten_exit_with_live_runtime = () => {
  runtimeKeepalivePush();
  throw "unwind";
};

function _emscripten_fetch_free(id) {
  if (Fetch.xhrs.has(id)) {
    var xhr = Fetch.xhrs.get(id);
    Fetch.xhrs.free(id);
    // check if fetch is still in progress and should be aborted
    if (xhr.readyState > 0 && xhr.readyState < 4) {
      xhr.abort();
    }
  }
}

var maybeCStringToJsString = cString => cString > 2 ? UTF8ToString(cString) : cString;

/** @type {Object} */ var specialHTMLTargets = [ 0, typeof document != "undefined" ? document : 0, typeof window != "undefined" ? window : 0 ];

/** @suppress {duplicate } */ var findEventTarget = target => {
  target = maybeCStringToJsString(target);
  var domElement = specialHTMLTargets[target] || (typeof document != "undefined" ? document.querySelector(target) : null);
  return domElement;
};

var findCanvasEventTarget = findEventTarget;

var getCanvasSizeCallingThread = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  if (!canvas.controlTransferredOffscreen) {
    (growMemViews(), HEAP32)[((width) >> 2)] = canvas.width;
    (growMemViews(), HEAP32)[((height) >> 2)] = canvas.height;
  } else {
    return -4;
  }
  return 0;
};

function getCanvasSizeMainThread(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(33, 0, 1, target, width, height);
  return getCanvasSizeCallingThread(target, width, height);
}

var _emscripten_get_canvas_element_size = (target, width, height) => {
  var canvas = findCanvasEventTarget(target);
  if (canvas) {
    return getCanvasSizeCallingThread(target, width, height);
  }
  return getCanvasSizeMainThread(target, width, height);
};

var getBoundingClientRect = e => specialHTMLTargets.indexOf(e) < 0 ? e.getBoundingClientRect() : {
  "left": 0,
  "top": 0
};

function _emscripten_get_element_css_size(target, width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(34, 0, 1, target, width, height);
  target = findEventTarget(target);
  if (!target) return -4;
  var rect = getBoundingClientRect(target);
  (growMemViews(), HEAPF64)[((width) >> 3)] = rect.width;
  (growMemViews(), HEAPF64)[((height) >> 3)] = rect.height;
  return 0;
}

var onExits = [];

var addOnExit = cb => onExits.push(cb);

var JSEvents = {
  memcpy(target, src, size) {
    (growMemViews(), HEAP8).set((growMemViews(), HEAP8).subarray(src, src + size), target);
  },
  removeAllEventListeners() {
    while (JSEvents.eventHandlers.length) {
      JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
    }
    JSEvents.deferredCalls = [];
  },
  inEventHandler: 0,
  deferredCalls: [],
  deferCall(targetFunction, precedence, argsList) {
    function arraysHaveEqualContent(arrA, arrB) {
      if (arrA.length != arrB.length) return false;
      for (var i in arrA) {
        if (arrA[i] != arrB[i]) return false;
      }
      return true;
    }
    // Test if the given call was already queued, and if so, don't add it again.
    for (var call of JSEvents.deferredCalls) {
      if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
        return;
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction,
      precedence,
      argsList
    });
    JSEvents.deferredCalls.sort((x, y) => x.precedence < y.precedence);
  },
  removeDeferredCalls(targetFunction) {
    JSEvents.deferredCalls = JSEvents.deferredCalls.filter(call => call.targetFunction != targetFunction);
  },
  canPerformEventHandlerRequests() {
    if (navigator.userActivation) {
      // Verify against transient activation status from UserActivation API
      // whether it is possible to perform a request here without needing to defer. See
      // https://developer.mozilla.org/en-US/docs/Web/Security/User_activation#transient_activation
      // and https://caniuse.com/mdn-api_useractivation
      // At the time of writing, Firefox does not support this API: https://bugzilla.mozilla.org/show_bug.cgi?id=1791079
      return navigator.userActivation.isActive;
    }
    return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
  },
  runDeferredCalls() {
    if (!JSEvents.canPerformEventHandlerRequests()) {
      return;
    }
    var deferredCalls = JSEvents.deferredCalls;
    JSEvents.deferredCalls = [];
    for (var call of deferredCalls) {
      call.targetFunction(...call.argsList);
    }
  },
  eventHandlers: [],
  removeAllHandlersOnTarget: (target, eventTypeString) => {
    for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
      if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
        JSEvents._removeHandler(i--);
      }
    }
  },
  _removeHandler(i) {
    var h = JSEvents.eventHandlers[i];
    h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
    JSEvents.eventHandlers.splice(i, 1);
  },
  registerOrRemoveHandler(eventHandler) {
    if (!eventHandler.target) {
      return -4;
    }
    if (eventHandler.callbackfunc) {
      eventHandler.eventListenerFunc = function(event) {
        // Increment nesting count for the event handler.
        ++JSEvents.inEventHandler;
        JSEvents.currentEventHandler = eventHandler;
        // Process any old deferred calls the user has placed.
        JSEvents.runDeferredCalls();
        // Process the actual event, calls back to user C code handler.
        eventHandler.handlerFunc(event);
        // Process any new deferred calls that were placed right now from this event handler.
        JSEvents.runDeferredCalls();
        // Out of event handler - restore nesting count.
        --JSEvents.inEventHandler;
      };
      eventHandler.target.addEventListener(eventHandler.eventTypeString, eventHandler.eventListenerFunc, eventHandler.useCapture);
      JSEvents.eventHandlers.push(eventHandler);
    } else {
      for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
        if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
          JSEvents._removeHandler(i--);
        }
      }
    }
    return 0;
  },
  getTargetThreadForEventCallback(targetThread) {
    switch (targetThread) {
     case 1:
      // The event callback for the current event should be called on the
      // main browser thread. (0 == don't proxy)
      return 0;

     case 2:
      // The event callback for the current event should be backproxied to
      // the thread that is registering the event.
      // This can be 0 in the case that the caller uses
      // EM_CALLBACK_THREAD_CONTEXT_CALLING_THREAD but on the main thread
      // itself.
      return PThread.currentProxiedOperationCallerThread;

     default:
      // The event callback for the current event should be proxied to the
      // given specific thread.
      return targetThread;
    }
  },
  getNodeNameForTarget(target) {
    if (!target) return "";
    if (target == window) return "#window";
    if (target == screen) return "#screen";
    return target?.nodeName || "";
  },
  fullscreenEnabled() {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled;
  }
};

function getFullscreenElement() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement || document.msFullscreenElement;
}

var fillFullscreenChangeEventData = eventStruct => {
  var fullscreenElement = getFullscreenElement();
  var isFullscreen = !!fullscreenElement;
  // Assigning a boolean to HEAP32 with expected type coercion.
  /** @suppress{checkTypes} */ (growMemViews(), HEAP8)[eventStruct] = isFullscreen;
  (growMemViews(), HEAP8)[(eventStruct) + (1)] = JSEvents.fullscreenEnabled();
  // If transitioning to fullscreen, report info about the element that is now fullscreen.
  // If transitioning to windowed mode, report info about the element that just was fullscreen.
  var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
  var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
  var id = reportedElement?.id || "";
  stringToUTF8(nodeName, eventStruct + 2, 128);
  stringToUTF8(id, eventStruct + 130, 128);
  (growMemViews(), HEAP32)[(((eventStruct) + (260)) >> 2)] = reportedElement ? reportedElement.clientWidth : 0;
  (growMemViews(), HEAP32)[(((eventStruct) + (264)) >> 2)] = reportedElement ? reportedElement.clientHeight : 0;
  (growMemViews(), HEAP32)[(((eventStruct) + (268)) >> 2)] = screen.width;
  (growMemViews(), HEAP32)[(((eventStruct) + (272)) >> 2)] = screen.height;
  if (isFullscreen) {
    JSEvents.previousFullscreenElement = fullscreenElement;
  }
};

function _emscripten_get_fullscreen_status(fullscreenStatus) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(35, 0, 1, fullscreenStatus);
  if (!JSEvents.fullscreenEnabled()) return -1;
  fillFullscreenChangeEventData(fullscreenStatus);
  return 0;
}

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
2147483648;

var _emscripten_get_heap_max = () => getHeapMax();

/** @param {number=} timeout */ var safeSetTimeout = (func, timeout) => {
  runtimeKeepalivePush();
  return setTimeout(() => {
    runtimeKeepalivePop();
    callUserCallback(func);
  }, timeout);
};

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    if (ENVIRONMENT_IS_NODE) text = "warning: " + text;
    err(text);
  }
};

var Browser = {
  useWebGL: false,
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  workers: [],
  preloadedImages: {},
  preloadedAudios: {},
  getCanvas: () => Module["canvas"],
  init() {
    if (Browser.initted) return;
    Browser.initted = true;
    // Support for plugins that can process preloaded files. You can add more of these to
    // your app by creating and appending to preloadPlugins.
    // Each plugin is asked if it can handle a file based on the file's name. If it can,
    // it is given the file's raw data. When it is done, it calls a callback with the file's
    // (possibly modified) data. For example, a plugin might decompress a file, or it
    // might create some side data structure for use later (like an Image element, etc.).
    var imagePlugin = {};
    imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
      return !Module["noImageDecoding"] && /\.(jpg|jpeg|png|bmp|webp)$/i.test(name);
    };
    imagePlugin["handle"] = async function imagePlugin_handle(byteArray, name) {
      var b = new Blob([ byteArray ], {
        type: Browser.getMimetype(name)
      });
      if (b.size !== byteArray.length) {
        // Safari bug #118630
        // Safari's Blob can only take an ArrayBuffer
        b = new Blob([ (new Uint8Array(byteArray)).buffer ], {
          type: Browser.getMimetype(name)
        });
      }
      var url = URL.createObjectURL(b);
      return new Promise((resolve, reject) => {
        var img = new Image;
        img.onload = () => {
          var canvas = /** @type {!HTMLCanvasElement} */ (document.createElement("canvas"));
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          Browser.preloadedImages[name] = canvas;
          URL.revokeObjectURL(url);
          resolve(byteArray);
        };
        img.onerror = event => {
          err(`Image ${url} could not be decoded`);
          reject();
        };
        img.src = url;
      });
    };
    preloadPlugins.push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
      return !Module["noAudioDecoding"] && name.slice(-4) in {
        ".ogg": 1,
        ".wav": 1,
        ".mp3": 1
      };
    };
    audioPlugin["handle"] = async function audioPlugin_handle(byteArray, name) {
      return new Promise((resolve, reject) => {
        var done = false;
        function finish(audio) {
          if (done) return;
          done = true;
          Browser.preloadedAudios[name] = audio;
          resolve(byteArray);
        }
        var b = new Blob([ byteArray ], {
          type: Browser.getMimetype(name)
        });
        var url = URL.createObjectURL(b);
        // XXX we never revoke this!
        var audio = new Audio;
        audio.addEventListener("canplaythrough", () => finish(audio), false);
        // use addEventListener due to chromium bug 124926
        audio.onerror = function audio_onerror(event) {
          if (done) return;
          err(`warning: browser could not fully decode audio ${name}, trying slower base64 approach`);
          function encode64(data) {
            var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var PAD = "=";
            var ret = "";
            var leftchar = 0;
            var leftbits = 0;
            for (var i = 0; i < data.length; i++) {
              leftchar = (leftchar << 8) | data[i];
              leftbits += 8;
              while (leftbits >= 6) {
                var curr = (leftchar >> (leftbits - 6)) & 63;
                leftbits -= 6;
                ret += BASE[curr];
              }
            }
            if (leftbits == 2) {
              ret += BASE[(leftchar & 3) << 4];
              ret += PAD + PAD;
            } else if (leftbits == 4) {
              ret += BASE[(leftchar & 15) << 2];
              ret += PAD;
            }
            return ret;
          }
          audio.src = "data:audio/x-" + name.slice(-3) + ";base64," + encode64(byteArray);
          finish(audio);
        };
        audio.src = url;
        // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
        safeSetTimeout(() => {
          finish(audio);
        }, 1e4);
      });
    };
    preloadPlugins.push(audioPlugin);
    // Canvas event setup
    function pointerLockChange() {
      var canvas = Browser.getCanvas();
      Browser.pointerLock = document.pointerLockElement === canvas;
    }
    var canvas = Browser.getCanvas();
    if (canvas) {
      // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
      // Module['forcedAspectRatio'] = 4 / 3;
      document.addEventListener("pointerlockchange", pointerLockChange, false);
      if (Module["elementPointerLock"]) {
        canvas.addEventListener("click", ev => {
          if (!Browser.pointerLock && Browser.getCanvas().requestPointerLock) {
            Browser.getCanvas().requestPointerLock();
            ev.preventDefault();
          }
        }, false);
      }
    }
  },
  createContext(/** @type {HTMLCanvasElement} */ canvas, useWebGL, setInModule, webGLContextAttributes) {
    if (useWebGL && Module["ctx"] && canvas == Browser.getCanvas()) return Module["ctx"];
    // no need to recreate GL context if it's already been created for this canvas.
    var ctx;
    var contextHandle;
    if (useWebGL) {
      // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
      var contextAttributes = {
        antialias: false,
        alpha: false,
        majorVersion: 2
      };
      if (webGLContextAttributes) {
        for (var attribute in webGLContextAttributes) {
          contextAttributes[attribute] = webGLContextAttributes[attribute];
        }
      }
      // This check of existence of GL is here to satisfy Closure compiler, which yells if variable GL is referenced below but GL object is not
      // actually compiled in because application is not doing any GL operations. TODO: Ideally if GL is not being used, this function
      // Browser.createContext() should not even be emitted.
      if (typeof GL != "undefined") {
        contextHandle = GL.createContext(canvas, contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(contextHandle).GLctx;
        }
      }
    } else {
      ctx = canvas.getContext("2d");
    }
    if (!ctx) return null;
    if (setInModule) {
      Module["ctx"] = ctx;
      if (useWebGL) GL.makeContextCurrent(contextHandle);
      Browser.useWebGL = useWebGL;
      Browser.moduleContextCreatedCallbacks.forEach(callback => callback());
      Browser.init();
    }
    return ctx;
  },
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen(lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
    var canvas = Browser.getCanvas();
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (getFullscreenElement() === canvasContainer) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      } else {
        // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      }
      Module["onFullScreen"]?.(Browser.isFullscreen);
      Module["onFullscreen"]?.(Browser.isFullscreen);
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange, false);
      document.addEventListener("mozfullscreenchange", fullscreenChange, false);
      document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
      document.addEventListener("MSFullscreenChange", fullscreenChange, false);
    }
    // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
    canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
    canvasContainer.requestFullscreen();
  },
  exitFullscreen() {
    // This is workaround for chrome. Trying to exit from fullscreen
    // not in fullscreen state will cause "TypeError: Document not active"
    // in chrome. See https://github.com/emscripten-core/emscripten/pull/8236
    if (!Browser.isFullscreen) {
      return false;
    }
    var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || (() => {});
    CFS.apply(document, []);
    return true;
  },
  safeSetTimeout(func, timeout) {
    // Legacy function, this is used by the SDL2 port so we need to keep it
    // around at least until that is updated.
    // See https://github.com/libsdl-org/SDL/pull/6304
    return safeSetTimeout(func, timeout);
  },
  getMimetype(name) {
    return {
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "bmp": "image/bmp",
      "ogg": "audio/ogg",
      "wav": "audio/wav",
      "mp3": "audio/mpeg"
    }[name.slice(name.lastIndexOf(".") + 1)];
  },
  getUserMedia(func) {
    window.getUserMedia ||= navigator["getUserMedia"] || navigator["mozGetUserMedia"];
    window.getUserMedia(func);
  },
  getMovementX(event) {
    return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0;
  },
  getMovementY(event) {
    return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0;
  },
  getMouseWheelDelta(event) {
    var delta = 0;
    switch (event.type) {
     case "DOMMouseScroll":
      // 3 lines make up a step
      delta = event.detail / 3;
      break;

     case "mousewheel":
      // 120 units make up a step
      delta = event.wheelDelta / 120;
      break;

     case "wheel":
      delta = event.deltaY;
      switch (event.deltaMode) {
       case 0:
        // DOM_DELTA_PIXEL: 100 pixels make up a step
        delta /= 100;
        break;

       case 1:
        // DOM_DELTA_LINE: 3 lines make up a step
        delta /= 3;
        break;

       case 2:
        // DOM_DELTA_PAGE: A page makes up 80 steps
        delta *= 80;
        break;

       default:
        abort("unrecognized mouse wheel delta mode: " + event.deltaMode);
      }
      break;

     default:
      abort("unrecognized mouse wheel event: " + event.type);
    }
    return delta;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseCoords(pageX, pageY) {
    // Calculate the movement based on the changes
    // in the coordinates.
    var canvas = Browser.getCanvas();
    var rect = canvas.getBoundingClientRect();
    // Neither .scrollX or .pageXOffset are defined in a spec, but
    // we prefer .scrollX because it is currently in a spec draft.
    // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
    var scrollX = ((typeof window.scrollX != "undefined") ? window.scrollX : window.pageXOffset);
    var scrollY = ((typeof window.scrollY != "undefined") ? window.scrollY : window.pageYOffset);
    var adjustedX = pageX - (scrollX + rect.left);
    var adjustedY = pageY - (scrollY + rect.top);
    // the canvas might be CSS-scaled compared to its backbuffer;
    // SDL-using content will want mouse coordinates in terms
    // of backbuffer units.
    adjustedX = adjustedX * (canvas.width / rect.width);
    adjustedY = adjustedY * (canvas.height / rect.height);
    return {
      x: adjustedX,
      y: adjustedY
    };
  },
  setMouseCoords(pageX, pageY) {
    const {x, y} = Browser.calculateMouseCoords(pageX, pageY);
    Browser.mouseMovementX = x - Browser.mouseX;
    Browser.mouseMovementY = y - Browser.mouseY;
    Browser.mouseX = x;
    Browser.mouseY = y;
  },
  calculateMouseEvent(event) {
    // event should be mousemove, mousedown or mouseup
    if (Browser.pointerLock) {
      // When the pointer is locked, calculate the coordinates
      // based on the movement of the mouse.
      // Workaround for Firefox bug 764498
      if (event.type != "mousemove" && ("mozMovementX" in event)) {
        Browser.mouseMovementX = Browser.mouseMovementY = 0;
      } else {
        Browser.mouseMovementX = Browser.getMovementX(event);
        Browser.mouseMovementY = Browser.getMovementY(event);
      }
      // add the mouse delta to the current absolute mouse position
      Browser.mouseX += Browser.mouseMovementX;
      Browser.mouseY += Browser.mouseMovementY;
    } else {
      if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
        var touch = event.touch;
        if (touch === undefined) {
          return;
        }
        var coords = Browser.calculateMouseCoords(touch.pageX, touch.pageY);
        if (event.type === "touchstart") {
          Browser.lastTouches[touch.identifier] = coords;
          Browser.touches[touch.identifier] = coords;
        } else if (event.type === "touchend" || event.type === "touchmove") {
          var last = Browser.touches[touch.identifier];
          last ||= coords;
          Browser.lastTouches[touch.identifier] = last;
          Browser.touches[touch.identifier] = coords;
        }
        return;
      }
      Browser.setMouseCoords(event.pageX, event.pageY);
    }
  },
  resizeListeners: [],
  updateResizeListeners() {
    var canvas = Browser.getCanvas();
    Browser.resizeListeners.forEach(listener => listener(canvas.width, canvas.height));
  },
  setCanvasSize(width, height, noUpdates) {
    var canvas = Browser.getCanvas();
    Browser.updateCanvasDimensions(canvas, width, height);
    if (!noUpdates) Browser.updateResizeListeners();
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = (growMemViews(), HEAPU32)[((SDL.screen) >> 2)];
      flags = flags | 8388608;
      // set SDL_FULLSCREEN flag
      (growMemViews(), HEAP32)[((SDL.screen) >> 2)] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize() {
    // check if SDL is available
    if (typeof SDL != "undefined") {
      var flags = (growMemViews(), HEAPU32)[((SDL.screen) >> 2)];
      flags = flags & ~8388608;
      // clear SDL_FULLSCREEN flag
      (growMemViews(), HEAP32)[((SDL.screen) >> 2)] = flags;
    }
    Browser.updateCanvasDimensions(Browser.getCanvas());
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions(canvas, wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] > 0) {
      if (w / h < Module["forcedAspectRatio"]) {
        w = Math.round(h * Module["forcedAspectRatio"]);
      } else {
        h = Math.round(w / Module["forcedAspectRatio"]);
      }
    }
    if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != "undefined")) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas.width = w;
      if (canvas.height != h) canvas.height = h;
      if (typeof canvas.style != "undefined") {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    } else {
      if (canvas.width != wNative) canvas.width = wNative;
      if (canvas.height != hNative) canvas.height = hNative;
      if (typeof canvas.style != "undefined") {
        if (w != wNative || h != hNative) {
          canvas.style.setProperty("width", w + "px", "important");
          canvas.style.setProperty("height", h + "px", "important");
        } else {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      }
    }
  }
};

function _emscripten_get_screen_size(width, height) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(36, 0, 1, width, height);
  (growMemViews(), HEAP32)[((width) >> 2)] = screen.width;
  (growMemViews(), HEAP32)[((height) >> 2)] = screen.height;
}

var GLctx;

var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = ctx => // Closure is expected to be allowed to minify the '.dibvbi' property, so not accessing it quoted.
!!(ctx.dibvbi = ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"));

var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = ctx => !!(ctx.mdibvbi = ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"));

var webgl_enable_EXT_polygon_offset_clamp = ctx => !!(ctx.extPolygonOffsetClamp = ctx.getExtension("EXT_polygon_offset_clamp"));

var webgl_enable_EXT_clip_control = ctx => !!(ctx.extClipControl = ctx.getExtension("EXT_clip_control"));

var webgl_enable_WEBGL_polygon_mode = ctx => !!(ctx.webglPolygonMode = ctx.getExtension("WEBGL_polygon_mode"));

var webgl_enable_WEBGL_multi_draw = ctx => // Closure is expected to be allowed to minify the '.multiDrawWebgl' property, so not accessing it quoted.
!!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));

var getEmscriptenSupportedExtensions = ctx => {
  // Restrict the list of advertised extensions to those that we actually
  // support.
  var supportedExtensions = [ // WebGL 2 extensions
  "EXT_color_buffer_float", "EXT_conservative_depth", "EXT_disjoint_timer_query_webgl2", "EXT_texture_norm16", "NV_shader_noperspective_interpolation", "WEBGL_clip_cull_distance", // WebGL 1 and WebGL 2 extensions
  "EXT_clip_control", "EXT_color_buffer_half_float", "EXT_depth_clamp", "EXT_float_blend", "EXT_polygon_offset_clamp", "EXT_texture_compression_bptc", "EXT_texture_compression_rgtc", "EXT_texture_filter_anisotropic", "KHR_parallel_shader_compile", "OES_texture_float_linear", "WEBGL_blend_func_extended", "WEBGL_compressed_texture_astc", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_etc1", "WEBGL_compressed_texture_s3tc", "WEBGL_compressed_texture_s3tc_srgb", "WEBGL_debug_renderer_info", "WEBGL_debug_shaders", "WEBGL_lose_context", "WEBGL_multi_draw", "WEBGL_polygon_mode" ];
  // .getSupportedExtensions() can return null if context is lost, so coerce to empty array.
  return (ctx.getSupportedExtensions() || []).filter(ext => supportedExtensions.includes(ext));
};

var GL = {
  counter: 1,
  buffers: [],
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  shaders: [],
  vaos: [],
  contexts: {},
  offscreenCanvases: {},
  queries: [],
  samplers: [],
  transformFeedbacks: [],
  syncs: [],
  stringCache: {},
  stringiCache: {},
  unpackAlignment: 4,
  unpackRowLength: 0,
  recordError: errorCode => {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: table => {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    return ret;
  },
  genObject: (n, buffers, createFunction, objectTable) => {
    for (var i = 0; i < n; i++) {
      var buffer = GLctx[createFunction]();
      var id = buffer && GL.getNewId(objectTable);
      if (buffer) {
        buffer.name = id;
        objectTable[id] = buffer;
      } else {
        GL.recordError(1282);
      }
      (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >> 2)] = id;
    }
  },
  getSource: (shader, count, string, length) => {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? (growMemViews(), HEAPU32)[(((length) + (i * 4)) >> 2)] : undefined;
      source += UTF8ToString((growMemViews(), HEAPU32)[(((string) + (i * 4)) >> 2)], len);
    }
    return source;
  },
  createContext: (/** @type {HTMLCanvasElement} */ canvas, webGLContextAttributes) => {
    // BUG: Workaround Safari WebGL issue: After successfully acquiring WebGL
    // context on a canvas, calling .getContext() will always return that
    // context independent of which 'webgl' or 'webgl2'
    // context version was passed. See:
    //   https://bugs.webkit.org/show_bug.cgi?id=222758
    // and:
    //   https://github.com/emscripten-core/emscripten/issues/13295.
    // TODO: Once the bug is fixed and shipped in Safari, adjust the Safari
    // version field in above check.
    if (!canvas.getContextSafariWebGL2Fixed) {
      canvas.getContextSafariWebGL2Fixed = canvas.getContext;
      /** @type {function(this:HTMLCanvasElement, string, (Object|null)=): (Object|null)} */ function fixedGetContext(ver, attrs) {
        var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
        return ((ver == "webgl") == (gl instanceof WebGLRenderingContext)) ? gl : null;
      }
      canvas.getContext = fixedGetContext;
    }
    var ctx = canvas.getContext("webgl2", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: (ctx, webGLContextAttributes) => {
    // with pthreads a context is a location in memory with some synchronized
    // data between threads
    var handle = _malloc(8);
    (growMemViews(), HEAPU32)[(((handle) + (4)) >> 2)] = _pthread_self();
    // the thread pointer of the thread that owns the control of the context
    var context = {
      handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx
    };
    // Store the created context object so that we can access the context
    // given a canvas without having to pass the parameters again.
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (typeof webGLContextAttributes.enableExtensionsByDefault == "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
      GL.initExtensions(context);
    }
    return handle;
  },
  makeContextCurrent: contextHandle => {
    // Active Emscripten GL layer context object.
    GL.currentContext = GL.contexts[contextHandle];
    // Active WebGL context object.
    Module["ctx"] = GLctx = GL.currentContext?.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: contextHandle => GL.contexts[contextHandle],
  deleteContext: contextHandle => {
    if (GL.currentContext === GL.contexts[contextHandle]) {
      GL.currentContext = null;
    }
    if (typeof JSEvents == "object") {
      // Release all JS event handlers on the DOM element that the GL context is
      // associated with since the context is now deleted.
      JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
    }
    // Make sure the canvas object no longer refers to the context object so
    // there are no GC surprises.
    if (GL.contexts[contextHandle]?.GLctx.canvas) {
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    }
    _free(GL.contexts[contextHandle].handle);
    GL.contexts[contextHandle] = null;
  },
  initExtensions: context => {
    // If this function is called without a specific context object, init the
    // extensions of the currently active context.
    context ||= GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    // Detect the presence of a few extensions manually, ction GL interop
    // layer itself will need to know if they exist.
    // Extensions that are available in both WebGL 1 and WebGL 2
    webgl_enable_WEBGL_multi_draw(GLctx);
    webgl_enable_EXT_polygon_offset_clamp(GLctx);
    webgl_enable_EXT_clip_control(GLctx);
    webgl_enable_WEBGL_polygon_mode(GLctx);
    // Extensions that are available from WebGL >= 2 (no-op if called on a WebGL 1 context active)
    webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
    webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
    // On WebGL 2, EXT_disjoint_timer_query is replaced with an alternative
    // that's based on core APIs, and exposes only the queryCounterEXT()
    // entrypoint.
    if (context.version >= 2) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query_webgl2");
    }
    // However, Firefox exposes the WebGL 1 version on WebGL 2 as well and
    // thus we look for the WebGL 1 version again if the WebGL 2 version
    // isn't present. https://bugzilla.mozilla.org/show_bug.cgi?id=1328882
    if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
      GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
    }
    getEmscriptenSupportedExtensions(GLctx).forEach(ext => {
      // WEBGL_lose_context, WEBGL_debug_renderer_info and WEBGL_debug_shaders
      // are not enabled by default.
      if (!ext.includes("lose_context") && !ext.includes("debug")) {
        // Call .getExtension() to enable that extension permanently.
        GLctx.getExtension(ext);
      }
    });
  }
};

/** @suppress {duplicate } */ var _glActiveTexture = x0 => GLctx.activeTexture(x0);

var _emscripten_glActiveTexture = _glActiveTexture;

/** @suppress {duplicate } */ var _glAttachShader = (program, shader) => {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glAttachShader = _glAttachShader;

/** @suppress {duplicate } */ var _glBeginQuery = (target, id) => {
  GLctx.beginQuery(target, GL.queries[id]);
};

var _emscripten_glBeginQuery = _glBeginQuery;

/** @suppress {duplicate } */ var _glBeginQueryEXT = (target, id) => {
  GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.queries[id]);
};

var _emscripten_glBeginQueryEXT = _glBeginQueryEXT;

/** @suppress {duplicate } */ var _glBeginTransformFeedback = x0 => GLctx.beginTransformFeedback(x0);

var _emscripten_glBeginTransformFeedback = _glBeginTransformFeedback;

/** @suppress {duplicate } */ var _glBindAttribLocation = (program, index, name) => {
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
};

var _emscripten_glBindAttribLocation = _glBindAttribLocation;

/** @suppress {duplicate } */ var _glBindBuffer = (target, buffer) => {
  if (target == 35051) {
    // In WebGL 2 glReadPixels entry point, we need to use a different WebGL 2
    // API function call when a buffer is bound to
    // GL_PIXEL_PACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelPackBufferBinding = buffer;
  } else if (target == 35052) {
    // In WebGL 2 gl(Compressed)Tex(Sub)Image[23]D entry points, we need to
    // use a different WebGL 2 API function call when a buffer is bound to
    // GL_PIXEL_UNPACK_BUFFER_BINDING point, so must keep track whether that
    // binding point is non-null to know what is the proper API function to
    // call.
    GLctx.currentPixelUnpackBufferBinding = buffer;
  }
  GLctx.bindBuffer(target, GL.buffers[buffer]);
};

var _emscripten_glBindBuffer = _glBindBuffer;

/** @suppress {duplicate } */ var _glBindBufferBase = (target, index, buffer) => {
  GLctx.bindBufferBase(target, index, GL.buffers[buffer]);
};

var _emscripten_glBindBufferBase = _glBindBufferBase;

/** @suppress {duplicate } */ var _glBindBufferRange = (target, index, buffer, offset, ptrsize) => {
  GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize);
};

var _emscripten_glBindBufferRange = _glBindBufferRange;

/** @suppress {duplicate } */ var _glBindFramebuffer = (target, framebuffer) => {
  GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
};

var _emscripten_glBindFramebuffer = _glBindFramebuffer;

/** @suppress {duplicate } */ var _glBindRenderbuffer = (target, renderbuffer) => {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glBindRenderbuffer = _glBindRenderbuffer;

/** @suppress {duplicate } */ var _glBindSampler = (unit, sampler) => {
  GLctx.bindSampler(unit, GL.samplers[sampler]);
};

var _emscripten_glBindSampler = _glBindSampler;

/** @suppress {duplicate } */ var _glBindTexture = (target, texture) => {
  GLctx.bindTexture(target, GL.textures[texture]);
};

var _emscripten_glBindTexture = _glBindTexture;

/** @suppress {duplicate } */ var _glBindTransformFeedback = (target, id) => {
  GLctx.bindTransformFeedback(target, GL.transformFeedbacks[id]);
};

var _emscripten_glBindTransformFeedback = _glBindTransformFeedback;

/** @suppress {duplicate } */ var _glBindVertexArray = vao => {
  GLctx.bindVertexArray(GL.vaos[vao]);
};

var _emscripten_glBindVertexArray = _glBindVertexArray;

/** @suppress {duplicate } */ var _glBindVertexArrayOES = _glBindVertexArray;

var _emscripten_glBindVertexArrayOES = _glBindVertexArrayOES;

/** @suppress {duplicate } */ var _glBlendColor = (x0, x1, x2, x3) => GLctx.blendColor(x0, x1, x2, x3);

var _emscripten_glBlendColor = _glBlendColor;

/** @suppress {duplicate } */ var _glBlendEquation = x0 => GLctx.blendEquation(x0);

var _emscripten_glBlendEquation = _glBlendEquation;

/** @suppress {duplicate } */ var _glBlendEquationSeparate = (x0, x1) => GLctx.blendEquationSeparate(x0, x1);

var _emscripten_glBlendEquationSeparate = _glBlendEquationSeparate;

/** @suppress {duplicate } */ var _glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);

var _emscripten_glBlendFunc = _glBlendFunc;

/** @suppress {duplicate } */ var _glBlendFuncSeparate = (x0, x1, x2, x3) => GLctx.blendFuncSeparate(x0, x1, x2, x3);

var _emscripten_glBlendFuncSeparate = _glBlendFuncSeparate;

/** @suppress {duplicate } */ var _glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) => GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

var _emscripten_glBlitFramebuffer = _glBlitFramebuffer;

/** @suppress {duplicate } */ var _glBufferData = (target, size, data, usage) => {
  if (true) {
    // If size is zero, WebGL would interpret uploading the whole input
    // arraybuffer (starting from given offset), which would not make sense in
    // WebAssembly, so avoid uploading if size is zero. However we must still
    // call bufferData to establish a backing storage of zero bytes.
    if (data && size) {
      GLctx.bufferData(target, (growMemViews(), HEAPU8), usage, data, size);
    } else {
      GLctx.bufferData(target, size, usage);
    }
    return;
  }
};

var _emscripten_glBufferData = _glBufferData;

/** @suppress {duplicate } */ var _glBufferSubData = (target, offset, size, data) => {
  if (true) {
    size && GLctx.bufferSubData(target, offset, (growMemViews(), HEAPU8), data, size);
    return;
  }
};

var _emscripten_glBufferSubData = _glBufferSubData;

/** @suppress {duplicate } */ var _glCheckFramebufferStatus = x0 => GLctx.checkFramebufferStatus(x0);

var _emscripten_glCheckFramebufferStatus = _glCheckFramebufferStatus;

/** @suppress {duplicate } */ var _glClear = x0 => GLctx.clear(x0);

var _emscripten_glClear = _glClear;

/** @suppress {duplicate } */ var _glClearBufferfi = (x0, x1, x2, x3) => GLctx.clearBufferfi(x0, x1, x2, x3);

var _emscripten_glClearBufferfi = _glClearBufferfi;

/** @suppress {duplicate } */ var _glClearBufferfv = (buffer, drawbuffer, value) => {
  GLctx.clearBufferfv(buffer, drawbuffer, (growMemViews(), HEAPF32), ((value) >> 2));
};

var _emscripten_glClearBufferfv = _glClearBufferfv;

/** @suppress {duplicate } */ var _glClearBufferiv = (buffer, drawbuffer, value) => {
  GLctx.clearBufferiv(buffer, drawbuffer, (growMemViews(), HEAP32), ((value) >> 2));
};

var _emscripten_glClearBufferiv = _glClearBufferiv;

/** @suppress {duplicate } */ var _glClearBufferuiv = (buffer, drawbuffer, value) => {
  GLctx.clearBufferuiv(buffer, drawbuffer, (growMemViews(), HEAPU32), ((value) >> 2));
};

var _emscripten_glClearBufferuiv = _glClearBufferuiv;

/** @suppress {duplicate } */ var _glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);

var _emscripten_glClearColor = _glClearColor;

/** @suppress {duplicate } */ var _glClearDepthf = x0 => GLctx.clearDepth(x0);

var _emscripten_glClearDepthf = _glClearDepthf;

/** @suppress {duplicate } */ var _glClearStencil = x0 => GLctx.clearStencil(x0);

var _emscripten_glClearStencil = _glClearStencil;

/** @suppress {duplicate } */ var _glClientWaitSync = (sync, flags, timeout) => {
  // WebGL2 vs GLES3 differences: in GLES3, the timeout parameter is a uint64, where 0xFFFFFFFFFFFFFFFFULL means GL_TIMEOUT_IGNORED.
  // In JS, there's no 64-bit value types, so instead timeout is taken to be signed, and GL_TIMEOUT_IGNORED is given value -1.
  // Inherently the value accepted in the timeout is lossy, and can't take in arbitrary u64 bit pattern (but most likely doesn't matter)
  // See https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15
  timeout = Number(timeout);
  return GLctx.clientWaitSync(GL.syncs[sync], flags, timeout);
};

var _emscripten_glClientWaitSync = _glClientWaitSync;

/** @suppress {duplicate } */ var _glClipControlEXT = (origin, depth) => {
  GLctx.extClipControl["clipControlEXT"](origin, depth);
};

var _emscripten_glClipControlEXT = _glClipControlEXT;

/** @suppress {duplicate } */ var _glColorMask = (red, green, blue, alpha) => {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
};

var _emscripten_glColorMask = _glColorMask;

/** @suppress {duplicate } */ var _glCompileShader = shader => {
  GLctx.compileShader(GL.shaders[shader]);
};

var _emscripten_glCompileShader = _glCompileShader;

/** @suppress {duplicate } */ var _glCompressedTexImage2D = (target, level, internalFormat, width, height, border, imageSize, data) => {
  // `data` may be null here, which means "allocate uniniitalized space but
  // don't upload" in GLES parlance, but `compressedTexImage2D` requires the
  // final data parameter, so we simply pass a heap view starting at zero
  // effectively uploading whatever happens to be near address zero.  See
  // https://github.com/emscripten-core/emscripten/issues/19300.
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data);
      return;
    }
    GLctx.compressedTexImage2D(target, level, internalFormat, width, height, border, (growMemViews(), 
    HEAPU8), data, imageSize);
    return;
  }
};

var _emscripten_glCompressedTexImage2D = _glCompressedTexImage2D;

/** @suppress {duplicate } */ var _glCompressedTexImage3D = (target, level, internalFormat, width, height, depth, border, imageSize, data) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, imageSize, data);
  } else {
    GLctx.compressedTexImage3D(target, level, internalFormat, width, height, depth, border, (growMemViews(), 
    HEAPU8), data, imageSize);
  }
};

var _emscripten_glCompressedTexImage3D = _glCompressedTexImage3D;

/** @suppress {duplicate } */ var _glCompressedTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, imageSize, data) => {
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding || !imageSize) {
      GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data);
      return;
    }
    GLctx.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, (growMemViews(), 
    HEAPU8), data, imageSize);
    return;
  }
};

var _emscripten_glCompressedTexSubImage2D = _glCompressedTexSubImage2D;

/** @suppress {duplicate } */ var _glCompressedTexSubImage3D = (target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, data);
  } else {
    GLctx.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, (growMemViews(), 
    HEAPU8), data, imageSize);
  }
};

var _emscripten_glCompressedTexSubImage3D = _glCompressedTexSubImage3D;

/** @suppress {duplicate } */ var _glCopyBufferSubData = (x0, x1, x2, x3, x4) => GLctx.copyBufferSubData(x0, x1, x2, x3, x4);

var _emscripten_glCopyBufferSubData = _glCopyBufferSubData;

/** @suppress {duplicate } */ var _glCopyTexImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexImage2D = _glCopyTexImage2D;

/** @suppress {duplicate } */ var _glCopyTexSubImage2D = (x0, x1, x2, x3, x4, x5, x6, x7) => GLctx.copyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7);

var _emscripten_glCopyTexSubImage2D = _glCopyTexSubImage2D;

/** @suppress {duplicate } */ var _glCopyTexSubImage3D = (x0, x1, x2, x3, x4, x5, x6, x7, x8) => GLctx.copyTexSubImage3D(x0, x1, x2, x3, x4, x5, x6, x7, x8);

var _emscripten_glCopyTexSubImage3D = _glCopyTexSubImage3D;

/** @suppress {duplicate } */ var _glCreateProgram = () => {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  // Store additional information needed for each shader program:
  program.name = id;
  // Lazy cache results of
  // glGetProgramiv(GL_ACTIVE_UNIFORM_MAX_LENGTH/GL_ACTIVE_ATTRIBUTE_MAX_LENGTH/GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH)
  program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
  program.uniformIdCounter = 1;
  GL.programs[id] = program;
  return id;
};

var _emscripten_glCreateProgram = _glCreateProgram;

/** @suppress {duplicate } */ var _glCreateShader = shaderType => {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
};

var _emscripten_glCreateShader = _glCreateShader;

/** @suppress {duplicate } */ var _glCullFace = x0 => GLctx.cullFace(x0);

var _emscripten_glCullFace = _glCullFace;

/** @suppress {duplicate } */ var _glDeleteBuffers = (n, buffers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((buffers) + (i * 4)) >> 2)];
    var buffer = GL.buffers[id];
    // From spec: "glDeleteBuffers silently ignores 0's and names that do not
    // correspond to existing buffer objects."
    if (!buffer) continue;
    GLctx.deleteBuffer(buffer);
    buffer.name = 0;
    GL.buffers[id] = null;
    if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
    if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
  }
};

var _emscripten_glDeleteBuffers = _glDeleteBuffers;

/** @suppress {duplicate } */ var _glDeleteFramebuffers = (n, framebuffers) => {
  for (var i = 0; i < n; ++i) {
    var id = (growMemViews(), HEAP32)[(((framebuffers) + (i * 4)) >> 2)];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
    // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
};

var _emscripten_glDeleteFramebuffers = _glDeleteFramebuffers;

/** @suppress {duplicate } */ var _glDeleteProgram = id => {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    // glDeleteProgram actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
};

var _emscripten_glDeleteProgram = _glDeleteProgram;

/** @suppress {duplicate } */ var _glDeleteQueries = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteQuery(query);
    GL.queries[id] = null;
  }
};

var _emscripten_glDeleteQueries = _glDeleteQueries;

/** @suppress {duplicate } */ var _glDeleteQueriesEXT = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)];
    var query = GL.queries[id];
    if (!query) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
    GL.queries[id] = null;
  }
};

var _emscripten_glDeleteQueriesEXT = _glDeleteQueriesEXT;

/** @suppress {duplicate } */ var _glDeleteRenderbuffers = (n, renderbuffers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((renderbuffers) + (i * 4)) >> 2)];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
    // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
};

var _emscripten_glDeleteRenderbuffers = _glDeleteRenderbuffers;

/** @suppress {duplicate } */ var _glDeleteSamplers = (n, samplers) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((samplers) + (i * 4)) >> 2)];
    var sampler = GL.samplers[id];
    if (!sampler) continue;
    GLctx.deleteSampler(sampler);
    sampler.name = 0;
    GL.samplers[id] = null;
  }
};

var _emscripten_glDeleteSamplers = _glDeleteSamplers;

/** @suppress {duplicate } */ var _glDeleteShader = id => {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    // glDeleteShader actually signals an error when deleting a nonexisting
    // object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
};

var _emscripten_glDeleteShader = _glDeleteShader;

/** @suppress {duplicate } */ var _glDeleteSync = id => {
  if (!id) return;
  var sync = GL.syncs[id];
  if (!sync) {
    // glDeleteSync signals an error when deleting a nonexisting object, unlike some other GL delete functions.
    GL.recordError(1281);
    return;
  }
  GLctx.deleteSync(sync);
  sync.name = 0;
  GL.syncs[id] = null;
};

var _emscripten_glDeleteSync = _glDeleteSync;

/** @suppress {duplicate } */ var _glDeleteTextures = (n, textures) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((textures) + (i * 4)) >> 2)];
    var texture = GL.textures[id];
    // GL spec: "glDeleteTextures silently ignores 0s and names that do not
    // correspond to existing textures".
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
};

var _emscripten_glDeleteTextures = _glDeleteTextures;

/** @suppress {duplicate } */ var _glDeleteTransformFeedbacks = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)];
    var transformFeedback = GL.transformFeedbacks[id];
    if (!transformFeedback) continue;
    // GL spec: "unused names in ids are ignored, as is the name zero."
    GLctx.deleteTransformFeedback(transformFeedback);
    transformFeedback.name = 0;
    GL.transformFeedbacks[id] = null;
  }
};

var _emscripten_glDeleteTransformFeedbacks = _glDeleteTransformFeedbacks;

/** @suppress {duplicate } */ var _glDeleteVertexArrays = (n, vaos) => {
  for (var i = 0; i < n; i++) {
    var id = (growMemViews(), HEAP32)[(((vaos) + (i * 4)) >> 2)];
    GLctx.deleteVertexArray(GL.vaos[id]);
    GL.vaos[id] = null;
  }
};

var _emscripten_glDeleteVertexArrays = _glDeleteVertexArrays;

/** @suppress {duplicate } */ var _glDeleteVertexArraysOES = _glDeleteVertexArrays;

var _emscripten_glDeleteVertexArraysOES = _glDeleteVertexArraysOES;

/** @suppress {duplicate } */ var _glDepthFunc = x0 => GLctx.depthFunc(x0);

var _emscripten_glDepthFunc = _glDepthFunc;

/** @suppress {duplicate } */ var _glDepthMask = flag => {
  GLctx.depthMask(!!flag);
};

var _emscripten_glDepthMask = _glDepthMask;

/** @suppress {duplicate } */ var _glDepthRangef = (x0, x1) => GLctx.depthRange(x0, x1);

var _emscripten_glDepthRangef = _glDepthRangef;

/** @suppress {duplicate } */ var _glDetachShader = (program, shader) => {
  GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
};

var _emscripten_glDetachShader = _glDetachShader;

/** @suppress {duplicate } */ var _glDisable = x0 => GLctx.disable(x0);

var _emscripten_glDisable = _glDisable;

/** @suppress {duplicate } */ var _glDisableVertexAttribArray = index => {
  GLctx.disableVertexAttribArray(index);
};

var _emscripten_glDisableVertexAttribArray = _glDisableVertexAttribArray;

/** @suppress {duplicate } */ var _glDrawArrays = (mode, first, count) => {
  GLctx.drawArrays(mode, first, count);
};

var _emscripten_glDrawArrays = _glDrawArrays;

/** @suppress {duplicate } */ var _glDrawArraysInstanced = (mode, first, count, primcount) => {
  GLctx.drawArraysInstanced(mode, first, count, primcount);
};

var _emscripten_glDrawArraysInstanced = _glDrawArraysInstanced;

/** @suppress {duplicate } */ var _glDrawArraysInstancedANGLE = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedANGLE = _glDrawArraysInstancedANGLE;

/** @suppress {duplicate } */ var _glDrawArraysInstancedARB = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedARB = _glDrawArraysInstancedARB;

/** @suppress {duplicate } */ var _glDrawArraysInstancedEXT = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedEXT = _glDrawArraysInstancedEXT;

/** @suppress {duplicate } */ var _glDrawArraysInstancedNV = _glDrawArraysInstanced;

var _emscripten_glDrawArraysInstancedNV = _glDrawArraysInstancedNV;

var tempFixedLengthArray = [];

/** @suppress {duplicate } */ var _glDrawBuffers = (n, bufs) => {
  var bufArray = tempFixedLengthArray[n];
  for (var i = 0; i < n; i++) {
    bufArray[i] = (growMemViews(), HEAP32)[(((bufs) + (i * 4)) >> 2)];
  }
  GLctx.drawBuffers(bufArray);
};

var _emscripten_glDrawBuffers = _glDrawBuffers;

/** @suppress {duplicate } */ var _glDrawBuffersEXT = _glDrawBuffers;

var _emscripten_glDrawBuffersEXT = _glDrawBuffersEXT;

/** @suppress {duplicate } */ var _glDrawBuffersWEBGL = _glDrawBuffers;

var _emscripten_glDrawBuffersWEBGL = _glDrawBuffersWEBGL;

/** @suppress {duplicate } */ var _glDrawElements = (mode, count, type, indices) => {
  GLctx.drawElements(mode, count, type, indices);
};

var _emscripten_glDrawElements = _glDrawElements;

/** @suppress {duplicate } */ var _glDrawElementsInstanced = (mode, count, type, indices, primcount) => {
  GLctx.drawElementsInstanced(mode, count, type, indices, primcount);
};

var _emscripten_glDrawElementsInstanced = _glDrawElementsInstanced;

/** @suppress {duplicate } */ var _glDrawElementsInstancedANGLE = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedANGLE = _glDrawElementsInstancedANGLE;

/** @suppress {duplicate } */ var _glDrawElementsInstancedARB = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedARB = _glDrawElementsInstancedARB;

/** @suppress {duplicate } */ var _glDrawElementsInstancedEXT = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedEXT = _glDrawElementsInstancedEXT;

/** @suppress {duplicate } */ var _glDrawElementsInstancedNV = _glDrawElementsInstanced;

var _emscripten_glDrawElementsInstancedNV = _glDrawElementsInstancedNV;

/** @suppress {duplicate } */ var _glDrawRangeElements = (mode, start, end, count, type, indices) => {
  // TODO: This should be a trivial pass-though function registered at the bottom of this page as
  // glFuncs[6][1] += ' drawRangeElements';
  // but due to https://bugzilla.mozilla.org/show_bug.cgi?id=1202427,
  // we work around by ignoring the range.
  _glDrawElements(mode, count, type, indices);
};

var _emscripten_glDrawRangeElements = _glDrawRangeElements;

/** @suppress {duplicate } */ var _glEnable = x0 => GLctx.enable(x0);

var _emscripten_glEnable = _glEnable;

/** @suppress {duplicate } */ var _glEnableVertexAttribArray = index => {
  GLctx.enableVertexAttribArray(index);
};

var _emscripten_glEnableVertexAttribArray = _glEnableVertexAttribArray;

/** @suppress {duplicate } */ var _glEndQuery = x0 => GLctx.endQuery(x0);

var _emscripten_glEndQuery = _glEndQuery;

/** @suppress {duplicate } */ var _glEndQueryEXT = target => {
  GLctx.disjointTimerQueryExt["endQueryEXT"](target);
};

var _emscripten_glEndQueryEXT = _glEndQueryEXT;

/** @suppress {duplicate } */ var _glEndTransformFeedback = () => GLctx.endTransformFeedback();

var _emscripten_glEndTransformFeedback = _glEndTransformFeedback;

/** @suppress {duplicate } */ var _glFenceSync = (condition, flags) => {
  var sync = GLctx.fenceSync(condition, flags);
  if (sync) {
    var id = GL.getNewId(GL.syncs);
    sync.name = id;
    GL.syncs[id] = sync;
    return id;
  }
  return 0;
};

var _emscripten_glFenceSync = _glFenceSync;

/** @suppress {duplicate } */ var _glFinish = () => GLctx.finish();

var _emscripten_glFinish = _glFinish;

/** @suppress {duplicate } */ var _glFlush = () => GLctx.flush();

var _emscripten_glFlush = _glFlush;

/** @suppress {duplicate } */ var _glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
  GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
};

var _emscripten_glFramebufferRenderbuffer = _glFramebufferRenderbuffer;

/** @suppress {duplicate } */ var _glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
  GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
};

var _emscripten_glFramebufferTexture2D = _glFramebufferTexture2D;

/** @suppress {duplicate } */ var _glFramebufferTextureLayer = (target, attachment, texture, level, layer) => {
  GLctx.framebufferTextureLayer(target, attachment, GL.textures[texture], level, layer);
};

var _emscripten_glFramebufferTextureLayer = _glFramebufferTextureLayer;

/** @suppress {duplicate } */ var _glFrontFace = x0 => GLctx.frontFace(x0);

var _emscripten_glFrontFace = _glFrontFace;

/** @suppress {duplicate } */ var _glGenBuffers = (n, buffers) => {
  GL.genObject(n, buffers, "createBuffer", GL.buffers);
};

var _emscripten_glGenBuffers = _glGenBuffers;

/** @suppress {duplicate } */ var _glGenFramebuffers = (n, ids) => {
  GL.genObject(n, ids, "createFramebuffer", GL.framebuffers);
};

var _emscripten_glGenFramebuffers = _glGenFramebuffers;

/** @suppress {duplicate } */ var _glGenQueries = (n, ids) => {
  GL.genObject(n, ids, "createQuery", GL.queries);
};

var _emscripten_glGenQueries = _glGenQueries;

/** @suppress {duplicate } */ var _glGenQueriesEXT = (n, ids) => {
  for (var i = 0; i < n; i++) {
    var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
    if (!query) {
      GL.recordError(1282);
      while (i < n) (growMemViews(), HEAP32)[(((ids) + (i++ * 4)) >> 2)] = 0;
      return;
    }
    var id = GL.getNewId(GL.queries);
    query.name = id;
    GL.queries[id] = query;
    (growMemViews(), HEAP32)[(((ids) + (i * 4)) >> 2)] = id;
  }
};

var _emscripten_glGenQueriesEXT = _glGenQueriesEXT;

/** @suppress {duplicate } */ var _glGenRenderbuffers = (n, renderbuffers) => {
  GL.genObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
};

var _emscripten_glGenRenderbuffers = _glGenRenderbuffers;

/** @suppress {duplicate } */ var _glGenSamplers = (n, samplers) => {
  GL.genObject(n, samplers, "createSampler", GL.samplers);
};

var _emscripten_glGenSamplers = _glGenSamplers;

/** @suppress {duplicate } */ var _glGenTextures = (n, textures) => {
  GL.genObject(n, textures, "createTexture", GL.textures);
};

var _emscripten_glGenTextures = _glGenTextures;

/** @suppress {duplicate } */ var _glGenTransformFeedbacks = (n, ids) => {
  GL.genObject(n, ids, "createTransformFeedback", GL.transformFeedbacks);
};

var _emscripten_glGenTransformFeedbacks = _glGenTransformFeedbacks;

/** @suppress {duplicate } */ var _glGenVertexArrays = (n, arrays) => {
  GL.genObject(n, arrays, "createVertexArray", GL.vaos);
};

var _emscripten_glGenVertexArrays = _glGenVertexArrays;

/** @suppress {duplicate } */ var _glGenVertexArraysOES = _glGenVertexArrays;

var _emscripten_glGenVertexArraysOES = _glGenVertexArraysOES;

/** @suppress {duplicate } */ var _glGenerateMipmap = x0 => GLctx.generateMipmap(x0);

var _emscripten_glGenerateMipmap = _glGenerateMipmap;

var __glGetActiveAttribOrUniform = (funcName, program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
    // If an error occurs, nothing will be written to length, size and type and name.
    var numBytesWrittenExclNull = name && stringToUTF8(info.name, name, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
    if (size) (growMemViews(), HEAP32)[((size) >> 2)] = info.size;
    if (type) (growMemViews(), HEAP32)[((type) >> 2)] = info.type;
  }
};

/** @suppress {duplicate } */ var _glGetActiveAttrib = (program, index, bufSize, length, size, type, name) => __glGetActiveAttribOrUniform("getActiveAttrib", program, index, bufSize, length, size, type, name);

var _emscripten_glGetActiveAttrib = _glGetActiveAttrib;

/** @suppress {duplicate } */ var _glGetActiveUniform = (program, index, bufSize, length, size, type, name) => __glGetActiveAttribOrUniform("getActiveUniform", program, index, bufSize, length, size, type, name);

var _emscripten_glGetActiveUniform = _glGetActiveUniform;

/** @suppress {duplicate } */ var _glGetActiveUniformBlockName = (program, uniformBlockIndex, bufSize, length, uniformBlockName) => {
  program = GL.programs[program];
  var result = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
  if (!result) return;
  // If an error occurs, nothing will be written to uniformBlockName or length.
  if (uniformBlockName && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(result, uniformBlockName, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
  } else {
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = 0;
  }
};

var _emscripten_glGetActiveUniformBlockName = _glGetActiveUniformBlockName;

/** @suppress {duplicate } */ var _glGetActiveUniformBlockiv = (program, uniformBlockIndex, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35393) {
    var name = GLctx.getActiveUniformBlockName(program, uniformBlockIndex);
    (growMemViews(), HEAP32)[((params) >> 2)] = name.length + 1;
    return;
  }
  var result = GLctx.getActiveUniformBlockParameter(program, uniformBlockIndex, pname);
  if (result === null) return;
  // If an error occurs, nothing should be written to params.
  if (pname == 35395) {
    for (var i = 0; i < result.length; i++) {
      (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = result[i];
    }
  } else {
    (growMemViews(), HEAP32)[((params) >> 2)] = result;
  }
};

var _emscripten_glGetActiveUniformBlockiv = _glGetActiveUniformBlockiv;

/** @suppress {duplicate } */ var _glGetActiveUniformsiv = (program, uniformCount, uniformIndices, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && uniformIndices == 0) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var ids = [];
  for (var i = 0; i < uniformCount; i++) {
    ids.push((growMemViews(), HEAP32)[(((uniformIndices) + (i * 4)) >> 2)]);
  }
  var result = GLctx.getActiveUniforms(program, ids, pname);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to params.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = result[i];
  }
};

var _emscripten_glGetActiveUniformsiv = _glGetActiveUniformsiv;

/** @suppress {duplicate } */ var _glGetAttachedShaders = (program, maxCount, count, shaders) => {
  var result = GLctx.getAttachedShaders(GL.programs[program]);
  var len = result.length;
  if (len > maxCount) {
    len = maxCount;
  }
  (growMemViews(), HEAP32)[((count) >> 2)] = len;
  for (var i = 0; i < len; ++i) {
    var id = GL.shaders.indexOf(result[i]);
    (growMemViews(), HEAP32)[(((shaders) + (i * 4)) >> 2)] = id;
  }
};

var _emscripten_glGetAttachedShaders = _glGetAttachedShaders;

/** @suppress {duplicate } */ var _glGetAttribLocation = (program, name) => GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));

var _emscripten_glGetAttribLocation = _glGetAttribLocation;

var writeI53ToI64 = (ptr, num) => {
  (growMemViews(), HEAPU32)[((ptr) >> 2)] = num;
  var lower = (growMemViews(), HEAPU32)[((ptr) >> 2)];
  (growMemViews(), HEAPU32)[(((ptr) + (4)) >> 2)] = (num - lower) / 4294967296;
};

var webglGetExtensions = () => {
  var exts = getEmscriptenSupportedExtensions(GLctx);
  exts = exts.concat(exts.map(e => "GL_" + e));
  return exts;
};

var emscriptenWebGLGet = (name_, p, type) => {
  // Guard against user passing a null pointer.
  // Note that GLES2 spec does not say anything about how passing a null
  // pointer should be treated.  Testing on desktop core GL 3, the application
  // crashes on glGetIntegerv to a null pointer, but better to report an error
  // instead of doing anything random.
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
   // Handle a few trivial GLES values
    case 36346:
    // GL_SHADER_COMPILER
    ret = 1;
    break;

   case 36344:
    // GL_SHADER_BINARY_FORMATS
    if (type != 0 && type != 1) {
      GL.recordError(1280);
    }
    // Do not write anything to the out pointer, since no binary formats are
    // supported.
    return;

   case 34814:
   // GL_NUM_PROGRAM_BINARY_FORMATS
    case 36345:
    // GL_NUM_SHADER_BINARY_FORMATS
    ret = 0;
    break;

   case 34466:
    // GL_NUM_COMPRESSED_TEXTURE_FORMATS
    // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete
    // since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be
    // queried for length), so implement it ourselves to allow C++ GLES2
    // code get the length.
    var formats = GLctx.getParameter(34467);
    ret = formats ? formats.length : 0;
    break;

   case 33309:
    // GL_NUM_EXTENSIONS
    if (GL.currentContext.version < 2) {
      // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
      GL.recordError(1282);
      return;
    }
    ret = webglGetExtensions().length;
    break;

   case 33307:
   // GL_MAJOR_VERSION
    case 33308:
    // GL_MINOR_VERSION
    if (GL.currentContext.version < 2) {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    ret = name_ == 33307 ? 3 : 0;
    // return version 3.0
    break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
     case "number":
      ret = result;
      break;

     case "boolean":
      ret = result ? 1 : 0;
      break;

     case "string":
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;

     case "object":
      if (result === null) {
        // null is a valid result for some (e.g., which buffer is bound -
        // perhaps nothing is bound), but otherwise can mean an invalid
        // name_, which we need to report as an error
        switch (name_) {
         case 34964:
         // ARRAY_BUFFER_BINDING
          case 35725:
         // CURRENT_PROGRAM
          case 34965:
         // ELEMENT_ARRAY_BUFFER_BINDING
          case 36006:
         // FRAMEBUFFER_BINDING or DRAW_FRAMEBUFFER_BINDING
          case 36007:
         // RENDERBUFFER_BINDING
          case 32873:
         // TEXTURE_BINDING_2D
          case 34229:
         // WebGL 2 GL_VERTEX_ARRAY_BINDING, or WebGL 1 extension OES_vertex_array_object GL_VERTEX_ARRAY_BINDING_OES
          case 36662:
         // COPY_READ_BUFFER_BINDING or COPY_READ_BUFFER
          case 36663:
         // COPY_WRITE_BUFFER_BINDING or COPY_WRITE_BUFFER
          case 35053:
         // PIXEL_PACK_BUFFER_BINDING
          case 35055:
         // PIXEL_UNPACK_BUFFER_BINDING
          case 36010:
         // READ_FRAMEBUFFER_BINDING
          case 35097:
         // SAMPLER_BINDING
          case 35869:
         // TEXTURE_BINDING_2D_ARRAY
          case 32874:
         // TEXTURE_BINDING_3D
          case 36389:
         // TRANSFORM_FEEDBACK_BINDING
          case 35983:
         // TRANSFORM_FEEDBACK_BUFFER_BINDING
          case 35368:
         // UNIFORM_BUFFER_BINDING
          case 34068:
          {
            // TEXTURE_BINDING_CUBE_MAP
            ret = 0;
            break;
          }

         default:
          {
            GL.recordError(1280);
            // GL_INVALID_ENUM
            return;
          }
        }
      } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
        for (var i = 0; i < result.length; ++i) {
          switch (type) {
           case 0:
            (growMemViews(), HEAP32)[(((p) + (i * 4)) >> 2)] = result[i];
            break;

           case 2:
            (growMemViews(), HEAPF32)[(((p) + (i * 4)) >> 2)] = result[i];
            break;

           case 4:
            (growMemViews(), HEAP8)[(p) + (i)] = result[i] ? 1 : 0;
            break;
          }
        }
        return;
      } else {
        try {
          ret = result.name | 0;
        } catch (e) {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          err(`GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`);
          return;
        }
      }
      break;

     default:
      GL.recordError(1280);
      // GL_INVALID_ENUM
      err(`GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof (result)}!`);
      return;
    }
  }
  switch (type) {
   case 1:
    writeI53ToI64(p, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((p) >> 2)] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((p) >> 2)] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[p] = ret ? 1 : 0;
    break;
  }
};

/** @suppress {duplicate } */ var _glGetBooleanv = (name_, p) => emscriptenWebGLGet(name_, p, 4);

var _emscripten_glGetBooleanv = _glGetBooleanv;

/** @suppress {duplicate } */ var _glGetBufferParameteri64v = (target, value, data) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  writeI53ToI64(data, GLctx.getBufferParameter(target, value));
};

var _emscripten_glGetBufferParameteri64v = _glGetBufferParameteri64v;

/** @suppress {duplicate } */ var _glGetBufferParameteriv = (target, value, data) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null
    // pointer. Since calling this function does not make sense if data ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((data) >> 2)] = GLctx.getBufferParameter(target, value);
};

var _emscripten_glGetBufferParameteriv = _glGetBufferParameteriv;

/** @suppress {duplicate } */ var _glGetError = () => {
  var error = GLctx.getError() || GL.lastError;
  GL.lastError = 0;
  return error;
};

var _emscripten_glGetError = _glGetError;

/** @suppress {duplicate } */ var _glGetFloatv = (name_, p) => emscriptenWebGLGet(name_, p, 2);

var _emscripten_glGetFloatv = _glGetFloatv;

/** @suppress {duplicate } */ var _glGetFragDataLocation = (program, name) => GLctx.getFragDataLocation(GL.programs[program], UTF8ToString(name));

var _emscripten_glGetFragDataLocation = _glGetFragDataLocation;

/** @suppress {duplicate } */ var _glGetFramebufferAttachmentParameteriv = (target, attachment, pname, params) => {
  var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
  if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
    result = result.name | 0;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = result;
};

var _emscripten_glGetFramebufferAttachmentParameteriv = _glGetFramebufferAttachmentParameteriv;

var emscriptenWebGLGetIndexed = (target, index, data, type) => {
  if (!data) {
    // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
    // if data == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var result = GLctx.getIndexedParameter(target, index);
  var ret;
  switch (typeof result) {
   case "boolean":
    ret = result ? 1 : 0;
    break;

   case "number":
    ret = result;
    break;

   case "object":
    if (result === null) {
      switch (target) {
       case 35983:
       // TRANSFORM_FEEDBACK_BUFFER_BINDING
        case 35368:
        // UNIFORM_BUFFER_BINDING
        ret = 0;
        break;

       default:
        {
          GL.recordError(1280);
          // GL_INVALID_ENUM
          return;
        }
      }
    } else if (result instanceof WebGLBuffer) {
      ret = result.name | 0;
    } else {
      GL.recordError(1280);
      // GL_INVALID_ENUM
      return;
    }
    break;

   default:
    GL.recordError(1280);
    // GL_INVALID_ENUM
    return;
  }
  switch (type) {
   case 1:
    writeI53ToI64(data, ret);
    break;

   case 0:
    (growMemViews(), HEAP32)[((data) >> 2)] = ret;
    break;

   case 2:
    (growMemViews(), HEAPF32)[((data) >> 2)] = ret;
    break;

   case 4:
    (growMemViews(), HEAP8)[data] = ret ? 1 : 0;
    break;

   default:
    abort("internal emscriptenWebGLGetIndexed() error, bad type: " + type);
  }
};

/** @suppress {duplicate } */ var _glGetInteger64i_v = (target, index, data) => emscriptenWebGLGetIndexed(target, index, data, 1);

var _emscripten_glGetInteger64i_v = _glGetInteger64i_v;

/** @suppress {duplicate } */ var _glGetInteger64v = (name_, p) => {
  emscriptenWebGLGet(name_, p, 1);
};

var _emscripten_glGetInteger64v = _glGetInteger64v;

/** @suppress {duplicate } */ var _glGetIntegeri_v = (target, index, data) => emscriptenWebGLGetIndexed(target, index, data, 0);

var _emscripten_glGetIntegeri_v = _glGetIntegeri_v;

/** @suppress {duplicate } */ var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);

var _emscripten_glGetIntegerv = _glGetIntegerv;

/** @suppress {duplicate } */ var _glGetInternalformativ = (target, internalformat, pname, bufSize, params) => {
  if (bufSize < 0) {
    GL.recordError(1281);
    return;
  }
  if (!params) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getInternalformatParameter(target, internalformat, pname);
  if (ret === null) return;
  for (var i = 0; i < ret.length && i < bufSize; ++i) {
    (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = ret[i];
  }
};

var _emscripten_glGetInternalformativ = _glGetInternalformativ;

/** @suppress {duplicate } */ var _glGetProgramBinary = (program, bufSize, length, binaryFormat, binary) => {
  GL.recordError(1282);
};

var _emscripten_glGetProgramBinary = _glGetProgramBinary;

/** @suppress {duplicate } */ var _glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
};

var _emscripten_glGetProgramInfoLog = _glGetProgramInfoLog;

/** @suppress {duplicate } */ var _glGetProgramiv = (program, pname, p) => {
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getProgramInfoLog(program);
    if (log === null) log = "(unknown error)";
    (growMemViews(), HEAP32)[((p) >> 2)] = log.length + 1;
  } else if (pname == 35719) {
    if (!program.maxUniformLength) {
      var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
      for (var i = 0; i < numActiveUniforms; ++i) {
        program.maxUniformLength = Math.max(program.maxUniformLength, GLctx.getActiveUniform(program, i).name.length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >> 2)] = program.maxUniformLength;
  } else if (pname == 35722) {
    if (!program.maxAttributeLength) {
      var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
      for (var i = 0; i < numActiveAttributes; ++i) {
        program.maxAttributeLength = Math.max(program.maxAttributeLength, GLctx.getActiveAttrib(program, i).name.length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >> 2)] = program.maxAttributeLength;
  } else if (pname == 35381) {
    if (!program.maxUniformBlockNameLength) {
      var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
      for (var i = 0; i < numActiveUniformBlocks; ++i) {
        program.maxUniformBlockNameLength = Math.max(program.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(program, i).length + 1);
      }
    }
    (growMemViews(), HEAP32)[((p) >> 2)] = program.maxUniformBlockNameLength;
  } else {
    (growMemViews(), HEAP32)[((p) >> 2)] = GLctx.getProgramParameter(program, pname);
  }
};

var _emscripten_glGetProgramiv = _glGetProgramiv;

/** @suppress {duplicate } */ var _glGetQueryObjecti64vEXT = (id, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param;
  if (GL.currentContext.version < 2) {
    param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  } else {
    param = GLctx.getQueryParameter(query, pname);
  }
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  writeI53ToI64(params, ret);
};

var _emscripten_glGetQueryObjecti64vEXT = _glGetQueryObjecti64vEXT;

/** @suppress {duplicate } */ var _glGetQueryObjectivEXT = (id, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = ret;
};

var _emscripten_glGetQueryObjectivEXT = _glGetQueryObjectivEXT;

/** @suppress {duplicate } */ var _glGetQueryObjectui64vEXT = _glGetQueryObjecti64vEXT;

var _emscripten_glGetQueryObjectui64vEXT = _glGetQueryObjectui64vEXT;

/** @suppress {duplicate } */ var _glGetQueryObjectuiv = (id, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var query = GL.queries[id];
  var param = GLctx.getQueryParameter(query, pname);
  var ret;
  if (typeof param == "boolean") {
    ret = param ? 1 : 0;
  } else {
    ret = param;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = ret;
};

var _emscripten_glGetQueryObjectuiv = _glGetQueryObjectuiv;

/** @suppress {duplicate } */ var _glGetQueryObjectuivEXT = _glGetQueryObjectivEXT;

var _emscripten_glGetQueryObjectuivEXT = _glGetQueryObjectuivEXT;

/** @suppress {duplicate } */ var _glGetQueryiv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getQuery(target, pname);
};

var _emscripten_glGetQueryiv = _glGetQueryiv;

/** @suppress {duplicate } */ var _glGetQueryivEXT = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
};

var _emscripten_glGetQueryivEXT = _glGetQueryivEXT;

/** @suppress {duplicate } */ var _glGetRenderbufferParameteriv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if params == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getRenderbufferParameter(target, pname);
};

var _emscripten_glGetRenderbufferParameteriv = _glGetRenderbufferParameteriv;

/** @suppress {duplicate } */ var _glGetSamplerParameterfv = (sampler, pname, params) => {
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAPF32)[((params) >> 2)] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
};

var _emscripten_glGetSamplerParameterfv = _glGetSamplerParameterfv;

/** @suppress {duplicate } */ var _glGetSamplerParameteriv = (sampler, pname, params) => {
  if (!params) {
    // GLES3 specification does not specify how to behave if params is a null pointer. Since calling this function does not make sense
    // if p == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getSamplerParameter(GL.samplers[sampler], pname);
};

var _emscripten_glGetSamplerParameteriv = _glGetSamplerParameteriv;

/** @suppress {duplicate } */ var _glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull = (maxLength > 0 && infoLog) ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
};

var _emscripten_glGetShaderInfoLog = _glGetShaderInfoLog;

/** @suppress {duplicate } */ var _glGetShaderPrecisionFormat = (shaderType, precisionType, range, precision) => {
  var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
  (growMemViews(), HEAP32)[((range) >> 2)] = result.rangeMin;
  (growMemViews(), HEAP32)[(((range) + (4)) >> 2)] = result.rangeMax;
  (growMemViews(), HEAP32)[((precision) >> 2)] = result.precision;
};

var _emscripten_glGetShaderPrecisionFormat = _glGetShaderPrecisionFormat;

/** @suppress {duplicate } */ var _glGetShaderSource = (shader, bufSize, length, source) => {
  var result = GLctx.getShaderSource(GL.shaders[shader]);
  if (!result) return;
  // If an error occurs, nothing will be written to length or source.
  var numBytesWrittenExclNull = (bufSize > 0 && source) ? stringToUTF8(result, source, bufSize) : 0;
  if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
};

var _emscripten_glGetShaderSource = _glGetShaderSource;

/** @suppress {duplicate } */ var _glGetShaderiv = (shader, pname, p) => {
  if (!p) {
    // GLES2 specification does not specify how to behave if p is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
    // GL_INFO_LOG_LENGTH
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    // The GLES2 specification says that if the shader has an empty info log,
    // a value of 0 is returned. Otherwise the log has a null char appended.
    // (An empty string is falsey, so we can just check that instead of
    // looking at log.length.)
    var logLength = log ? log.length + 1 : 0;
    (growMemViews(), HEAP32)[((p) >> 2)] = logLength;
  } else if (pname == 35720) {
    // GL_SHADER_SOURCE_LENGTH
    var source = GLctx.getShaderSource(GL.shaders[shader]);
    // source may be a null, or the empty string, both of which are falsey
    // values that we report a 0 length for.
    var sourceLength = source ? source.length + 1 : 0;
    (growMemViews(), HEAP32)[((p) >> 2)] = sourceLength;
  } else {
    (growMemViews(), HEAP32)[((p) >> 2)] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
};

var _emscripten_glGetShaderiv = _glGetShaderiv;

var stringToNewUTF8 = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8(str, ret, size);
  return ret;
};

/** @suppress {duplicate } */ var _glGetString = name_ => {
  var ret = GL.stringCache[name_];
  if (!ret) {
    switch (name_) {
     case 7939:
      ret = stringToNewUTF8(webglGetExtensions().join(" "));
      break;

     case 7936:
     case 7937:
     case 37445:
     case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = s ? stringToNewUTF8(s) : 0;
      break;

     case 7938:
      var webGLVersion = GLctx.getParameter(7938);
      // return GLES version string corresponding to the version of the WebGL context
      var glVersion = `OpenGL ES 2.0 (${webGLVersion})`;
      if (true) glVersion = `OpenGL ES 3.0 (${webGLVersion})`;
      ret = stringToNewUTF8(glVersion);
      break;

     case 35724:
      var glslVersion = GLctx.getParameter(35724);
      // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
        // ensure minor version has 2 digits
        glslVersion = `OpenGL ES GLSL ES ${ver_num[1]} (${glslVersion})`;
      }
      ret = stringToNewUTF8(glslVersion);
      break;

     default:
      GL.recordError(1280);
    }
    GL.stringCache[name_] = ret;
  }
  return ret;
};

var _emscripten_glGetString = _glGetString;

/** @suppress {duplicate } */ var _glGetStringi = (name, index) => {
  if (GL.currentContext.version < 2) {
    GL.recordError(1282);
    // Calling GLES3/WebGL2 function with a GLES2/WebGL1 context
    return 0;
  }
  var stringiCache = GL.stringiCache[name];
  if (stringiCache) {
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];
  }
  switch (name) {
   case 7939:
    var exts = webglGetExtensions().map(stringToNewUTF8);
    stringiCache = GL.stringiCache[name] = exts;
    if (index < 0 || index >= stringiCache.length) {
      GL.recordError(1281);
      return 0;
    }
    return stringiCache[index];

   default:
    GL.recordError(1280);
    return 0;
  }
};

var _emscripten_glGetStringi = _glGetStringi;

/** @suppress {duplicate } */ var _glGetSynciv = (sync, pname, bufSize, length, values) => {
  if (bufSize < 0) {
    // GLES3 specification does not specify how to behave if bufSize < 0, however in the spec wording for glGetInternalformativ, it does say that GL_INVALID_VALUE should be raised,
    // so raise GL_INVALID_VALUE here as well.
    GL.recordError(1281);
    return;
  }
  if (!values) {
    // GLES3 specification does not specify how to behave if values is a null pointer. Since calling this function does not make sense
    // if values == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var ret = GLctx.getSyncParameter(GL.syncs[sync], pname);
  if (ret !== null) {
    (growMemViews(), HEAP32)[((values) >> 2)] = ret;
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = 1;
  }
};

var _emscripten_glGetSynciv = _glGetSynciv;

/** @suppress {duplicate } */ var _glGetTexParameterfv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAPF32)[((params) >> 2)] = GLctx.getTexParameter(target, pname);
};

var _emscripten_glGetTexParameterfv = _glGetTexParameterfv;

/** @suppress {duplicate } */ var _glGetTexParameteriv = (target, pname, params) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if p == null,
    // issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((params) >> 2)] = GLctx.getTexParameter(target, pname);
};

var _emscripten_glGetTexParameteriv = _glGetTexParameteriv;

/** @suppress {duplicate } */ var _glGetTransformFeedbackVarying = (program, index, bufSize, length, size, type, name) => {
  program = GL.programs[program];
  var info = GLctx.getTransformFeedbackVarying(program, index);
  if (!info) return;
  // If an error occurred, the return parameters length, size, type and name will be unmodified.
  if (name && bufSize > 0) {
    var numBytesWrittenExclNull = stringToUTF8(info.name, name, bufSize);
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = numBytesWrittenExclNull;
  } else {
    if (length) (growMemViews(), HEAP32)[((length) >> 2)] = 0;
  }
  if (size) (growMemViews(), HEAP32)[((size) >> 2)] = info.size;
  if (type) (growMemViews(), HEAP32)[((type) >> 2)] = info.type;
};

var _emscripten_glGetTransformFeedbackVarying = _glGetTransformFeedbackVarying;

/** @suppress {duplicate } */ var _glGetUniformBlockIndex = (program, uniformBlockName) => GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));

var _emscripten_glGetUniformBlockIndex = _glGetUniformBlockIndex;

/** @suppress {duplicate } */ var _glGetUniformIndices = (program, uniformCount, uniformNames, uniformIndices) => {
  if (!uniformIndices) {
    // GLES2 specification does not specify how to behave if uniformIndices is a null pointer. Since calling this function does not make sense
    // if uniformIndices == null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  if (uniformCount > 0 && (uniformNames == 0 || uniformIndices == 0)) {
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  var names = [];
  for (var i = 0; i < uniformCount; i++) names.push(UTF8ToString((growMemViews(), 
  HEAP32)[(((uniformNames) + (i * 4)) >> 2)]));
  var result = GLctx.getUniformIndices(program, names);
  if (!result) return;
  // GL spec: If an error is generated, nothing is written out to uniformIndices.
  var len = result.length;
  for (var i = 0; i < len; i++) {
    (growMemViews(), HEAP32)[(((uniformIndices) + (i * 4)) >> 2)] = result[i];
  }
};

var _emscripten_glGetUniformIndices = _glGetUniformIndices;

/** @suppress {checkTypes} */ var jstoi_q = str => parseInt(str);

/** @noinline */ var webglGetLeftBracePos = name => name.slice(-1) == "]" && name.lastIndexOf("[");

var webglPrepareUniformLocationsBeforeFirstUse = program => {
  var uniformLocsById = program.uniformLocsById, // Maps GLuint -> WebGLUniformLocation
  uniformSizeAndIdsByName = program.uniformSizeAndIdsByName, // Maps name -> [uniform array length, GLuint]
  i, j;
  // On the first time invocation of glGetUniformLocation on this shader program:
  // initialize cache data structures and discover which uniforms are arrays.
  if (!uniformLocsById) {
    // maps GLint integer locations to WebGLUniformLocations
    program.uniformLocsById = uniformLocsById = {};
    // maps integer locations back to uniform name strings, so that we can lazily fetch uniform array locations
    program.uniformArrayNamesById = {};
    var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
    for (i = 0; i < numActiveUniforms; ++i) {
      var u = GLctx.getActiveUniform(program, i);
      var nm = u.name;
      var sz = u.size;
      var lb = webglGetLeftBracePos(nm);
      var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
      // Assign a new location.
      var id = program.uniformIdCounter;
      program.uniformIdCounter += sz;
      // Eagerly get the location of the uniformArray[0] base element.
      // The remaining indices >0 will be left for lazy evaluation to
      // improve performance. Those may never be needed to fetch, if the
      // application fills arrays always in full starting from the first
      // element of the array.
      uniformSizeAndIdsByName[arrayName] = [ sz, id ];
      // Store placeholder integers in place that highlight that these
      // >0 index locations are array indices pending population.
      for (j = 0; j < sz; ++j) {
        uniformLocsById[id] = j;
        program.uniformArrayNamesById[id++] = arrayName;
      }
    }
  }
};

/** @suppress {duplicate } */ var _glGetUniformLocation = (program, name) => {
  name = UTF8ToString(name);
  if (program = GL.programs[program]) {
    webglPrepareUniformLocationsBeforeFirstUse(program);
    var uniformLocsById = program.uniformLocsById;
    // Maps GLuint -> WebGLUniformLocation
    var arrayIndex = 0;
    var uniformBaseName = name;
    // Invariant: when populating integer IDs for uniform locations, we must
    // maintain the precondition that arrays reside in contiguous addresses,
    // i.e. for a 'vec4 colors[10];', colors[4] must be at location
    // colors[0]+4.  However, user might call glGetUniformLocation(program,
    // "colors") for an array, so we cannot discover based on the user input
    // arguments whether the uniform we are dealing with is an array. The only
    // way to discover which uniforms are arrays is to enumerate over all the
    // active uniforms in the program.
    var leftBrace = webglGetLeftBracePos(name);
    // If user passed an array accessor "[index]", parse the array index off the accessor.
    if (leftBrace > 0) {
      arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
      // "index]", coerce parseInt(']') with >>>0 to treat "foo[]" as "foo[0]" and foo[-1] as unsigned out-of-bounds.
      uniformBaseName = name.slice(0, leftBrace);
    }
    // Have we cached the location of this uniform before?
    // A pair [array length, GLint of the uniform location]
    var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
    // If an uniform with this name exists, and if its index is within the
    // array limits (if it's even an array), query the WebGLlocation, or
    // return an existing cached location.
    if (sizeAndId && arrayIndex < sizeAndId[0]) {
      arrayIndex += sizeAndId[1];
      // Add the base location of the uniform to the array index offset.
      if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
        return arrayIndex;
      }
    }
  } else {
    // N.b. we are currently unable to distinguish between GL program IDs that
    // never existed vs GL program IDs that have been deleted, so report
    // GL_INVALID_VALUE in both cases.
    GL.recordError(1281);
  }
  return -1;
};

var _emscripten_glGetUniformLocation = _glGetUniformLocation;

var webglGetUniformLocation = location => {
  var p = GLctx.currentProgram;
  if (p) {
    var webglLoc = p.uniformLocsById[location];
    // p.uniformLocsById[location] stores either an integer, or a
    // WebGLUniformLocation.
    // If an integer, we have not yet bound the location, so do it now. The
    // integer value specifies the array index we should bind to.
    if (typeof webglLoc == "number") {
      p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(p, p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ""));
    }
    // Else an already cached WebGLUniformLocation, return it.
    return webglLoc;
  } else {
    GL.recordError(1282);
  }
};

/** @suppress{checkTypes} */ var emscriptenWebGLGetUniform = (program, location, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  program = GL.programs[program];
  webglPrepareUniformLocationsBeforeFirstUse(program);
  var data = GLctx.getUniform(program, webglGetUniformLocation(location));
  if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      (growMemViews(), HEAP32)[((params) >> 2)] = data;
      break;

     case 2:
      (growMemViews(), HEAPF32)[((params) >> 2)] = data;
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;

       case 2:
        (growMemViews(), HEAPF32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;
      }
    }
  }
};

/** @suppress {duplicate } */ var _glGetUniformfv = (program, location, params) => {
  emscriptenWebGLGetUniform(program, location, params, 2);
};

var _emscripten_glGetUniformfv = _glGetUniformfv;

/** @suppress {duplicate } */ var _glGetUniformiv = (program, location, params) => {
  emscriptenWebGLGetUniform(program, location, params, 0);
};

var _emscripten_glGetUniformiv = _glGetUniformiv;

/** @suppress {duplicate } */ var _glGetUniformuiv = (program, location, params) => emscriptenWebGLGetUniform(program, location, params, 0);

var _emscripten_glGetUniformuiv = _glGetUniformuiv;

/** @suppress{checkTypes} */ var emscriptenWebGLGetVertexAttrib = (index, pname, params, type) => {
  if (!params) {
    // GLES2 specification does not specify how to behave if params is a null
    // pointer. Since calling this function does not make sense if params ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  var data = GLctx.getVertexAttrib(index, pname);
  if (pname == 34975) {
    (growMemViews(), HEAP32)[((params) >> 2)] = data && data["name"];
  } else if (typeof data == "number" || typeof data == "boolean") {
    switch (type) {
     case 0:
      (growMemViews(), HEAP32)[((params) >> 2)] = data;
      break;

     case 2:
      (growMemViews(), HEAPF32)[((params) >> 2)] = data;
      break;

     case 5:
      (growMemViews(), HEAP32)[((params) >> 2)] = Math.fround(data);
      break;
    }
  } else {
    for (var i = 0; i < data.length; i++) {
      switch (type) {
       case 0:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;

       case 2:
        (growMemViews(), HEAPF32)[(((params) + (i * 4)) >> 2)] = data[i];
        break;

       case 5:
        (growMemViews(), HEAP32)[(((params) + (i * 4)) >> 2)] = Math.fround(data[i]);
        break;
      }
    }
  }
};

/** @suppress {duplicate } */ var _glGetVertexAttribIiv = (index, pname, params) => {
  // N.B. This function may only be called if the vertex attribute was specified using the function glVertexAttribI4iv(),
  // otherwise the results are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 0);
};

var _emscripten_glGetVertexAttribIiv = _glGetVertexAttribIiv;

/** @suppress {duplicate } */ var _glGetVertexAttribIuiv = _glGetVertexAttribIiv;

var _emscripten_glGetVertexAttribIuiv = _glGetVertexAttribIuiv;

/** @suppress {duplicate } */ var _glGetVertexAttribPointerv = (index, pname, pointer) => {
  if (!pointer) {
    // GLES2 specification does not specify how to behave if pointer is a null
    // pointer. Since calling this function does not make sense if pointer ==
    // null, issue a GL error to notify user about it.
    GL.recordError(1281);
    return;
  }
  (growMemViews(), HEAP32)[((pointer) >> 2)] = GLctx.getVertexAttribOffset(index, pname);
};

var _emscripten_glGetVertexAttribPointerv = _glGetVertexAttribPointerv;

/** @suppress {duplicate } */ var _glGetVertexAttribfv = (index, pname, params) => {
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
};

var _emscripten_glGetVertexAttribfv = _glGetVertexAttribfv;

/** @suppress {duplicate } */ var _glGetVertexAttribiv = (index, pname, params) => {
  // N.B. This function may only be called if the vertex attribute was
  // specified using the function glVertexAttrib*f(), otherwise the results
  // are undefined. (GLES3 spec 6.1.12)
  emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
};

var _emscripten_glGetVertexAttribiv = _glGetVertexAttribiv;

/** @suppress {duplicate } */ var _glHint = (x0, x1) => GLctx.hint(x0, x1);

var _emscripten_glHint = _glHint;

/** @suppress {duplicate } */ var _glInvalidateFramebuffer = (target, numAttachments, attachments) => {
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = (growMemViews(), HEAP32)[(((attachments) + (i * 4)) >> 2)];
  }
  GLctx.invalidateFramebuffer(target, list);
};

var _emscripten_glInvalidateFramebuffer = _glInvalidateFramebuffer;

/** @suppress {duplicate } */ var _glInvalidateSubFramebuffer = (target, numAttachments, attachments, x, y, width, height) => {
  var list = tempFixedLengthArray[numAttachments];
  for (var i = 0; i < numAttachments; i++) {
    list[i] = (growMemViews(), HEAP32)[(((attachments) + (i * 4)) >> 2)];
  }
  GLctx.invalidateSubFramebuffer(target, list, x, y, width, height);
};

var _emscripten_glInvalidateSubFramebuffer = _glInvalidateSubFramebuffer;

/** @suppress {duplicate } */ var _glIsBuffer = buffer => {
  var b = GL.buffers[buffer];
  if (!b) return 0;
  return GLctx.isBuffer(b);
};

var _emscripten_glIsBuffer = _glIsBuffer;

/** @suppress {duplicate } */ var _glIsEnabled = x0 => GLctx.isEnabled(x0);

var _emscripten_glIsEnabled = _glIsEnabled;

/** @suppress {duplicate } */ var _glIsFramebuffer = framebuffer => {
  var fb = GL.framebuffers[framebuffer];
  if (!fb) return 0;
  return GLctx.isFramebuffer(fb);
};

var _emscripten_glIsFramebuffer = _glIsFramebuffer;

/** @suppress {duplicate } */ var _glIsProgram = program => {
  program = GL.programs[program];
  if (!program) return 0;
  return GLctx.isProgram(program);
};

var _emscripten_glIsProgram = _glIsProgram;

/** @suppress {duplicate } */ var _glIsQuery = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.isQuery(query);
};

var _emscripten_glIsQuery = _glIsQuery;

/** @suppress {duplicate } */ var _glIsQueryEXT = id => {
  var query = GL.queries[id];
  if (!query) return 0;
  return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
};

var _emscripten_glIsQueryEXT = _glIsQueryEXT;

/** @suppress {duplicate } */ var _glIsRenderbuffer = renderbuffer => {
  var rb = GL.renderbuffers[renderbuffer];
  if (!rb) return 0;
  return GLctx.isRenderbuffer(rb);
};

var _emscripten_glIsRenderbuffer = _glIsRenderbuffer;

/** @suppress {duplicate } */ var _glIsSampler = id => {
  var sampler = GL.samplers[id];
  if (!sampler) return 0;
  return GLctx.isSampler(sampler);
};

var _emscripten_glIsSampler = _glIsSampler;

/** @suppress {duplicate } */ var _glIsShader = shader => {
  var s = GL.shaders[shader];
  if (!s) return 0;
  return GLctx.isShader(s);
};

var _emscripten_glIsShader = _glIsShader;

/** @suppress {duplicate } */ var _glIsSync = sync => GLctx.isSync(GL.syncs[sync]);

var _emscripten_glIsSync = _glIsSync;

/** @suppress {duplicate } */ var _glIsTexture = id => {
  var texture = GL.textures[id];
  if (!texture) return 0;
  return GLctx.isTexture(texture);
};

var _emscripten_glIsTexture = _glIsTexture;

/** @suppress {duplicate } */ var _glIsTransformFeedback = id => GLctx.isTransformFeedback(GL.transformFeedbacks[id]);

var _emscripten_glIsTransformFeedback = _glIsTransformFeedback;

/** @suppress {duplicate } */ var _glIsVertexArray = array => {
  var vao = GL.vaos[array];
  if (!vao) return 0;
  return GLctx.isVertexArray(vao);
};

var _emscripten_glIsVertexArray = _glIsVertexArray;

/** @suppress {duplicate } */ var _glIsVertexArrayOES = _glIsVertexArray;

var _emscripten_glIsVertexArrayOES = _glIsVertexArrayOES;

/** @suppress {duplicate } */ var _glLineWidth = x0 => GLctx.lineWidth(x0);

var _emscripten_glLineWidth = _glLineWidth;

/** @suppress {duplicate } */ var _glLinkProgram = program => {
  program = GL.programs[program];
  GLctx.linkProgram(program);
  // Invalidate earlier computed uniform->ID mappings, those have now become stale
  program.uniformLocsById = 0;
  // Mark as null-like so that glGetUniformLocation() knows to populate this again.
  program.uniformSizeAndIdsByName = {};
};

var _emscripten_glLinkProgram = _glLinkProgram;

/** @suppress {duplicate } */ var _glPauseTransformFeedback = () => GLctx.pauseTransformFeedback();

var _emscripten_glPauseTransformFeedback = _glPauseTransformFeedback;

/** @suppress {duplicate } */ var _glPixelStorei = (pname, param) => {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  } else if (pname == 3314) {
    GL.unpackRowLength = param;
  }
  GLctx.pixelStorei(pname, param);
};

var _emscripten_glPixelStorei = _glPixelStorei;

/** @suppress {duplicate } */ var _glPolygonModeWEBGL = (face, mode) => {
  GLctx.webglPolygonMode["polygonModeWEBGL"](face, mode);
};

var _emscripten_glPolygonModeWEBGL = _glPolygonModeWEBGL;

/** @suppress {duplicate } */ var _glPolygonOffset = (x0, x1) => GLctx.polygonOffset(x0, x1);

var _emscripten_glPolygonOffset = _glPolygonOffset;

/** @suppress {duplicate } */ var _glPolygonOffsetClampEXT = (factor, units, clamp) => {
  GLctx.extPolygonOffsetClamp["polygonOffsetClampEXT"](factor, units, clamp);
};

var _emscripten_glPolygonOffsetClampEXT = _glPolygonOffsetClampEXT;

/** @suppress {duplicate } */ var _glProgramBinary = (program, binaryFormat, binary, length) => {
  GL.recordError(1280);
};

var _emscripten_glProgramBinary = _glProgramBinary;

/** @suppress {duplicate } */ var _glProgramParameteri = (program, pname, value) => {
  GL.recordError(1280);
};

var _emscripten_glProgramParameteri = _glProgramParameteri;

/** @suppress {duplicate } */ var _glQueryCounterEXT = (id, target) => {
  GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.queries[id], target);
};

var _emscripten_glQueryCounterEXT = _glQueryCounterEXT;

/** @suppress {duplicate } */ var _glReadBuffer = x0 => GLctx.readBuffer(x0);

var _emscripten_glReadBuffer = _glReadBuffer;

var heapObjectForWebGLType = type => {
  // Micro-optimization for size: Subtract lowest GL enum number (0x1400/* GL_BYTE */) from type to compare
  // smaller values for the heap, for shorter generated code size.
  // Also the type HEAPU16 is not tested for explicitly, but any unrecognized type will return out HEAPU16.
  // (since most types are HEAPU16)
  type -= 5120;
  if (type == 0) return (growMemViews(), HEAP8);
  if (type == 1) return (growMemViews(), HEAPU8);
  if (type == 2) return (growMemViews(), HEAP16);
  if (type == 4) return (growMemViews(), HEAP32);
  if (type == 6) return (growMemViews(), HEAPF32);
  if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return (growMemViews(), 
  HEAPU32);
  return (growMemViews(), HEAPU16);
};

var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));

/** @suppress {duplicate } */ var _glReadPixels = (x, y, width, height, format, type, pixels) => {
  if (true) {
    if (GLctx.currentPixelPackBufferBinding) {
      GLctx.readPixels(x, y, width, height, format, type, pixels);
      return;
    }
    var heap = heapObjectForWebGLType(type);
    var target = toTypedArrayIndex(pixels, heap);
    GLctx.readPixels(x, y, width, height, format, type, heap, target);
    return;
  }
};

var _emscripten_glReadPixels = _glReadPixels;

/** @suppress {duplicate } */ var _glReleaseShaderCompiler = () => {};

var _emscripten_glReleaseShaderCompiler = _glReleaseShaderCompiler;

/** @suppress {duplicate } */ var _glRenderbufferStorage = (x0, x1, x2, x3) => GLctx.renderbufferStorage(x0, x1, x2, x3);

var _emscripten_glRenderbufferStorage = _glRenderbufferStorage;

/** @suppress {duplicate } */ var _glRenderbufferStorageMultisample = (x0, x1, x2, x3, x4) => GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);

var _emscripten_glRenderbufferStorageMultisample = _glRenderbufferStorageMultisample;

/** @suppress {duplicate } */ var _glResumeTransformFeedback = () => GLctx.resumeTransformFeedback();

var _emscripten_glResumeTransformFeedback = _glResumeTransformFeedback;

/** @suppress {duplicate } */ var _glSampleCoverage = (value, invert) => {
  GLctx.sampleCoverage(value, !!invert);
};

var _emscripten_glSampleCoverage = _glSampleCoverage;

/** @suppress {duplicate } */ var _glSamplerParameterf = (sampler, pname, param) => {
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameterf = _glSamplerParameterf;

/** @suppress {duplicate } */ var _glSamplerParameterfv = (sampler, pname, params) => {
  var param = (growMemViews(), HEAPF32)[((params) >> 2)];
  GLctx.samplerParameterf(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameterfv = _glSamplerParameterfv;

/** @suppress {duplicate } */ var _glSamplerParameteri = (sampler, pname, param) => {
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameteri = _glSamplerParameteri;

/** @suppress {duplicate } */ var _glSamplerParameteriv = (sampler, pname, params) => {
  var param = (growMemViews(), HEAP32)[((params) >> 2)];
  GLctx.samplerParameteri(GL.samplers[sampler], pname, param);
};

var _emscripten_glSamplerParameteriv = _glSamplerParameteriv;

/** @suppress {duplicate } */ var _glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);

var _emscripten_glScissor = _glScissor;

/** @suppress {duplicate } */ var _glShaderBinary = (count, shaders, binaryformat, binary, length) => {
  GL.recordError(1280);
};

var _emscripten_glShaderBinary = _glShaderBinary;

/** @suppress {duplicate } */ var _glShaderSource = (shader, count, string, length) => {
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
};

var _emscripten_glShaderSource = _glShaderSource;

/** @suppress {duplicate } */ var _glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);

var _emscripten_glStencilFunc = _glStencilFunc;

/** @suppress {duplicate } */ var _glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);

var _emscripten_glStencilFuncSeparate = _glStencilFuncSeparate;

/** @suppress {duplicate } */ var _glStencilMask = x0 => GLctx.stencilMask(x0);

var _emscripten_glStencilMask = _glStencilMask;

/** @suppress {duplicate } */ var _glStencilMaskSeparate = (x0, x1) => GLctx.stencilMaskSeparate(x0, x1);

var _emscripten_glStencilMaskSeparate = _glStencilMaskSeparate;

/** @suppress {duplicate } */ var _glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);

var _emscripten_glStencilOp = _glStencilOp;

/** @suppress {duplicate } */ var _glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);

var _emscripten_glStencilOpSeparate = _glStencilOpSeparate;

var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
  return height * alignedRowSize;
};

var colorChannelsInGlTextureFormat = format => {
  // Micro-optimizations for size: map format to size by subtracting smallest
  // enum value (0x1902) from all values first.  Also omit the most common
  // size value (1) from the list, which is assumed by formats not on the
  // list.
  var colorChannels = {
    // 0x1902 /* GL_DEPTH_COMPONENT */ - 0x1902: 1,
    // 0x1906 /* GL_ALPHA */ - 0x1902: 1,
    5: 3,
    6: 4,
    // 0x1909 /* GL_LUMINANCE */ - 0x1902: 1,
    8: 2,
    29502: 3,
    29504: 4,
    // 0x1903 /* GL_RED */ - 0x1902: 1,
    26917: 2,
    26918: 2,
    // 0x8D94 /* GL_RED_INTEGER */ - 0x1902: 1,
    29846: 3,
    29847: 4
  };
  return colorChannels[format - 6402] || 1;
};

var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
  var heap = heapObjectForWebGLType(type);
  var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
  var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
  return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap));
};

/** @suppress {duplicate } */ var _glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
      return;
    }
    if (pixels) {
      var heap = heapObjectForWebGLType(type);
      var index = toTypedArrayIndex(pixels, heap);
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, index);
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null;
  GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
};

var _emscripten_glTexImage2D = _glTexImage2D;

/** @suppress {duplicate } */ var _glTexImage3D = (target, level, internalFormat, width, height, depth, border, format, type, pixels) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, heap, toTypedArrayIndex(pixels, heap));
  } else {
    GLctx.texImage3D(target, level, internalFormat, width, height, depth, border, format, type, null);
  }
};

var _emscripten_glTexImage3D = _glTexImage3D;

/** @suppress {duplicate } */ var _glTexParameterf = (x0, x1, x2) => GLctx.texParameterf(x0, x1, x2);

var _emscripten_glTexParameterf = _glTexParameterf;

/** @suppress {duplicate } */ var _glTexParameterfv = (target, pname, params) => {
  var param = (growMemViews(), HEAPF32)[((params) >> 2)];
  GLctx.texParameterf(target, pname, param);
};

var _emscripten_glTexParameterfv = _glTexParameterfv;

/** @suppress {duplicate } */ var _glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);

var _emscripten_glTexParameteri = _glTexParameteri;

/** @suppress {duplicate } */ var _glTexParameteriv = (target, pname, params) => {
  var param = (growMemViews(), HEAP32)[((params) >> 2)];
  GLctx.texParameteri(target, pname, param);
};

var _emscripten_glTexParameteriv = _glTexParameteriv;

/** @suppress {duplicate } */ var _glTexStorage2D = (x0, x1, x2, x3, x4) => GLctx.texStorage2D(x0, x1, x2, x3, x4);

var _emscripten_glTexStorage2D = _glTexStorage2D;

/** @suppress {duplicate } */ var _glTexStorage3D = (x0, x1, x2, x3, x4, x5) => GLctx.texStorage3D(x0, x1, x2, x3, x4, x5);

var _emscripten_glTexStorage3D = _glTexStorage3D;

/** @suppress {duplicate } */ var _glTexSubImage2D = (target, level, xoffset, yoffset, width, height, format, type, pixels) => {
  if (true) {
    if (GLctx.currentPixelUnpackBufferBinding) {
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
      return;
    }
    if (pixels) {
      var heap = heapObjectForWebGLType(type);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, heap, toTypedArrayIndex(pixels, heap));
      return;
    }
  }
  var pixelData = pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0) : null;
  GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
};

var _emscripten_glTexSubImage2D = _glTexSubImage2D;

/** @suppress {duplicate } */ var _glTexSubImage3D = (target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels) => {
  if (GLctx.currentPixelUnpackBufferBinding) {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pixels);
  } else if (pixels) {
    var heap = heapObjectForWebGLType(type);
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, heap, toTypedArrayIndex(pixels, heap));
  } else {
    GLctx.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, null);
  }
};

var _emscripten_glTexSubImage3D = _glTexSubImage3D;

/** @suppress {duplicate } */ var _glTransformFeedbackVaryings = (program, count, varyings, bufferMode) => {
  program = GL.programs[program];
  var vars = [];
  for (var i = 0; i < count; i++) vars.push(UTF8ToString((growMemViews(), HEAP32)[(((varyings) + (i * 4)) >> 2)]));
  GLctx.transformFeedbackVaryings(program, vars, bufferMode);
};

var _emscripten_glTransformFeedbackVaryings = _glTransformFeedbackVaryings;

/** @suppress {duplicate } */ var _glUniform1f = (location, v0) => {
  GLctx.uniform1f(webglGetUniformLocation(location), v0);
};

var _emscripten_glUniform1f = _glUniform1f;

/** @suppress {duplicate } */ var _glUniform1fv = (location, count, value) => {
  count && GLctx.uniform1fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count);
};

var _emscripten_glUniform1fv = _glUniform1fv;

/** @suppress {duplicate } */ var _glUniform1i = (location, v0) => {
  GLctx.uniform1i(webglGetUniformLocation(location), v0);
};

var _emscripten_glUniform1i = _glUniform1i;

/** @suppress {duplicate } */ var _glUniform1iv = (location, count, value) => {
  count && GLctx.uniform1iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count);
};

var _emscripten_glUniform1iv = _glUniform1iv;

/** @suppress {duplicate } */ var _glUniform1ui = (location, v0) => {
  GLctx.uniform1ui(webglGetUniformLocation(location), v0);
};

var _emscripten_glUniform1ui = _glUniform1ui;

/** @suppress {duplicate } */ var _glUniform1uiv = (location, count, value) => {
  count && GLctx.uniform1uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count);
};

var _emscripten_glUniform1uiv = _glUniform1uiv;

/** @suppress {duplicate } */ var _glUniform2f = (location, v0, v1) => {
  GLctx.uniform2f(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2f = _glUniform2f;

/** @suppress {duplicate } */ var _glUniform2fv = (location, count, value) => {
  count && GLctx.uniform2fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count * 2);
};

var _emscripten_glUniform2fv = _glUniform2fv;

/** @suppress {duplicate } */ var _glUniform2i = (location, v0, v1) => {
  GLctx.uniform2i(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2i = _glUniform2i;

/** @suppress {duplicate } */ var _glUniform2iv = (location, count, value) => {
  count && GLctx.uniform2iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count * 2);
};

var _emscripten_glUniform2iv = _glUniform2iv;

/** @suppress {duplicate } */ var _glUniform2ui = (location, v0, v1) => {
  GLctx.uniform2ui(webglGetUniformLocation(location), v0, v1);
};

var _emscripten_glUniform2ui = _glUniform2ui;

/** @suppress {duplicate } */ var _glUniform2uiv = (location, count, value) => {
  count && GLctx.uniform2uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count * 2);
};

var _emscripten_glUniform2uiv = _glUniform2uiv;

/** @suppress {duplicate } */ var _glUniform3f = (location, v0, v1, v2) => {
  GLctx.uniform3f(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3f = _glUniform3f;

/** @suppress {duplicate } */ var _glUniform3fv = (location, count, value) => {
  count && GLctx.uniform3fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count * 3);
};

var _emscripten_glUniform3fv = _glUniform3fv;

/** @suppress {duplicate } */ var _glUniform3i = (location, v0, v1, v2) => {
  GLctx.uniform3i(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3i = _glUniform3i;

/** @suppress {duplicate } */ var _glUniform3iv = (location, count, value) => {
  count && GLctx.uniform3iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count * 3);
};

var _emscripten_glUniform3iv = _glUniform3iv;

/** @suppress {duplicate } */ var _glUniform3ui = (location, v0, v1, v2) => {
  GLctx.uniform3ui(webglGetUniformLocation(location), v0, v1, v2);
};

var _emscripten_glUniform3ui = _glUniform3ui;

/** @suppress {duplicate } */ var _glUniform3uiv = (location, count, value) => {
  count && GLctx.uniform3uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count * 3);
};

var _emscripten_glUniform3uiv = _glUniform3uiv;

/** @suppress {duplicate } */ var _glUniform4f = (location, v0, v1, v2, v3) => {
  GLctx.uniform4f(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4f = _glUniform4f;

/** @suppress {duplicate } */ var _glUniform4fv = (location, count, value) => {
  count && GLctx.uniform4fv(webglGetUniformLocation(location), (growMemViews(), HEAPF32), ((value) >> 2), count * 4);
};

var _emscripten_glUniform4fv = _glUniform4fv;

/** @suppress {duplicate } */ var _glUniform4i = (location, v0, v1, v2, v3) => {
  GLctx.uniform4i(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4i = _glUniform4i;

/** @suppress {duplicate } */ var _glUniform4iv = (location, count, value) => {
  count && GLctx.uniform4iv(webglGetUniformLocation(location), (growMemViews(), HEAP32), ((value) >> 2), count * 4);
};

var _emscripten_glUniform4iv = _glUniform4iv;

/** @suppress {duplicate } */ var _glUniform4ui = (location, v0, v1, v2, v3) => {
  GLctx.uniform4ui(webglGetUniformLocation(location), v0, v1, v2, v3);
};

var _emscripten_glUniform4ui = _glUniform4ui;

/** @suppress {duplicate } */ var _glUniform4uiv = (location, count, value) => {
  count && GLctx.uniform4uiv(webglGetUniformLocation(location), (growMemViews(), HEAPU32), ((value) >> 2), count * 4);
};

var _emscripten_glUniform4uiv = _glUniform4uiv;

/** @suppress {duplicate } */ var _glUniformBlockBinding = (program, uniformBlockIndex, uniformBlockBinding) => {
  program = GL.programs[program];
  GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding);
};

var _emscripten_glUniformBlockBinding = _glUniformBlockBinding;

/** @suppress {duplicate } */ var _glUniformMatrix2fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 4);
};

var _emscripten_glUniformMatrix2fv = _glUniformMatrix2fv;

/** @suppress {duplicate } */ var _glUniformMatrix2x3fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix2x3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 6);
};

var _emscripten_glUniformMatrix2x3fv = _glUniformMatrix2x3fv;

/** @suppress {duplicate } */ var _glUniformMatrix2x4fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix2x4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 8);
};

var _emscripten_glUniformMatrix2x4fv = _glUniformMatrix2x4fv;

/** @suppress {duplicate } */ var _glUniformMatrix3fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 9);
};

var _emscripten_glUniformMatrix3fv = _glUniformMatrix3fv;

/** @suppress {duplicate } */ var _glUniformMatrix3x2fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix3x2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 6);
};

var _emscripten_glUniformMatrix3x2fv = _glUniformMatrix3x2fv;

/** @suppress {duplicate } */ var _glUniformMatrix3x4fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix3x4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 12);
};

var _emscripten_glUniformMatrix3x4fv = _glUniformMatrix3x4fv;

/** @suppress {duplicate } */ var _glUniformMatrix4fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix4fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 16);
};

var _emscripten_glUniformMatrix4fv = _glUniformMatrix4fv;

/** @suppress {duplicate } */ var _glUniformMatrix4x2fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix4x2fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 8);
};

var _emscripten_glUniformMatrix4x2fv = _glUniformMatrix4x2fv;

/** @suppress {duplicate } */ var _glUniformMatrix4x3fv = (location, count, transpose, value) => {
  count && GLctx.uniformMatrix4x3fv(webglGetUniformLocation(location), !!transpose, (growMemViews(), 
  HEAPF32), ((value) >> 2), count * 12);
};

var _emscripten_glUniformMatrix4x3fv = _glUniformMatrix4x3fv;

/** @suppress {duplicate } */ var _glUseProgram = program => {
  program = GL.programs[program];
  GLctx.useProgram(program);
  // Record the currently active program so that we can access the uniform
  // mapping table of that program.
  GLctx.currentProgram = program;
};

var _emscripten_glUseProgram = _glUseProgram;

/** @suppress {duplicate } */ var _glValidateProgram = program => {
  GLctx.validateProgram(GL.programs[program]);
};

var _emscripten_glValidateProgram = _glValidateProgram;

/** @suppress {duplicate } */ var _glVertexAttrib1f = (x0, x1) => GLctx.vertexAttrib1f(x0, x1);

var _emscripten_glVertexAttrib1f = _glVertexAttrib1f;

/** @suppress {duplicate } */ var _glVertexAttrib1fv = (index, v) => {
  GLctx.vertexAttrib1f(index, (growMemViews(), HEAPF32)[v >> 2]);
};

var _emscripten_glVertexAttrib1fv = _glVertexAttrib1fv;

/** @suppress {duplicate } */ var _glVertexAttrib2f = (x0, x1, x2) => GLctx.vertexAttrib2f(x0, x1, x2);

var _emscripten_glVertexAttrib2f = _glVertexAttrib2f;

/** @suppress {duplicate } */ var _glVertexAttrib2fv = (index, v) => {
  GLctx.vertexAttrib2f(index, (growMemViews(), HEAPF32)[v >> 2], (growMemViews(), 
  HEAPF32)[v + 4 >> 2]);
};

var _emscripten_glVertexAttrib2fv = _glVertexAttrib2fv;

/** @suppress {duplicate } */ var _glVertexAttrib3f = (x0, x1, x2, x3) => GLctx.vertexAttrib3f(x0, x1, x2, x3);

var _emscripten_glVertexAttrib3f = _glVertexAttrib3f;

/** @suppress {duplicate } */ var _glVertexAttrib3fv = (index, v) => {
  GLctx.vertexAttrib3f(index, (growMemViews(), HEAPF32)[v >> 2], (growMemViews(), 
  HEAPF32)[v + 4 >> 2], (growMemViews(), HEAPF32)[v + 8 >> 2]);
};

var _emscripten_glVertexAttrib3fv = _glVertexAttrib3fv;

/** @suppress {duplicate } */ var _glVertexAttrib4f = (x0, x1, x2, x3, x4) => GLctx.vertexAttrib4f(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttrib4f = _glVertexAttrib4f;

/** @suppress {duplicate } */ var _glVertexAttrib4fv = (index, v) => {
  GLctx.vertexAttrib4f(index, (growMemViews(), HEAPF32)[v >> 2], (growMemViews(), 
  HEAPF32)[v + 4 >> 2], (growMemViews(), HEAPF32)[v + 8 >> 2], (growMemViews(), HEAPF32)[v + 12 >> 2]);
};

var _emscripten_glVertexAttrib4fv = _glVertexAttrib4fv;

/** @suppress {duplicate } */ var _glVertexAttribDivisor = (index, divisor) => {
  GLctx.vertexAttribDivisor(index, divisor);
};

var _emscripten_glVertexAttribDivisor = _glVertexAttribDivisor;

/** @suppress {duplicate } */ var _glVertexAttribDivisorANGLE = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorANGLE = _glVertexAttribDivisorANGLE;

/** @suppress {duplicate } */ var _glVertexAttribDivisorARB = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorARB = _glVertexAttribDivisorARB;

/** @suppress {duplicate } */ var _glVertexAttribDivisorEXT = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorEXT = _glVertexAttribDivisorEXT;

/** @suppress {duplicate } */ var _glVertexAttribDivisorNV = _glVertexAttribDivisor;

var _emscripten_glVertexAttribDivisorNV = _glVertexAttribDivisorNV;

/** @suppress {duplicate } */ var _glVertexAttribI4i = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4i(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttribI4i = _glVertexAttribI4i;

/** @suppress {duplicate } */ var _glVertexAttribI4iv = (index, v) => {
  GLctx.vertexAttribI4i(index, (growMemViews(), HEAP32)[v >> 2], (growMemViews(), 
  HEAP32)[v + 4 >> 2], (growMemViews(), HEAP32)[v + 8 >> 2], (growMemViews(), HEAP32)[v + 12 >> 2]);
};

var _emscripten_glVertexAttribI4iv = _glVertexAttribI4iv;

/** @suppress {duplicate } */ var _glVertexAttribI4ui = (x0, x1, x2, x3, x4) => GLctx.vertexAttribI4ui(x0, x1, x2, x3, x4);

var _emscripten_glVertexAttribI4ui = _glVertexAttribI4ui;

/** @suppress {duplicate } */ var _glVertexAttribI4uiv = (index, v) => {
  GLctx.vertexAttribI4ui(index, (growMemViews(), HEAPU32)[v >> 2], (growMemViews(), 
  HEAPU32)[v + 4 >> 2], (growMemViews(), HEAPU32)[v + 8 >> 2], (growMemViews(), HEAPU32)[v + 12 >> 2]);
};

var _emscripten_glVertexAttribI4uiv = _glVertexAttribI4uiv;

/** @suppress {duplicate } */ var _glVertexAttribIPointer = (index, size, type, stride, ptr) => {
  GLctx.vertexAttribIPointer(index, size, type, stride, ptr);
};

var _emscripten_glVertexAttribIPointer = _glVertexAttribIPointer;

/** @suppress {duplicate } */ var _glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
};

var _emscripten_glVertexAttribPointer = _glVertexAttribPointer;

/** @suppress {duplicate } */ var _glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);

var _emscripten_glViewport = _glViewport;

/** @suppress {duplicate } */ var _glWaitSync = (sync, flags, timeout) => {
  // See WebGL2 vs GLES3 difference on GL_TIMEOUT_IGNORED above (https://www.khronos.org/registry/webgl/specs/latest/2.0/#5.15)
  timeout = Number(timeout);
  GLctx.waitSync(GL.syncs[sync], flags, timeout);
};

var _emscripten_glWaitSync = _glWaitSync;

var _emscripten_num_logical_cores = () => ENVIRONMENT_IS_NODE ? require("os").cpus().length : navigator["hardwareConcurrency"];

var _emscripten_random = () => Math.random();

var growMemory = size => {
  var oldHeapSize = wasmMemory.buffer.byteLength;
  var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {}
};

var _emscripten_resize_heap = requestedSize => {
  var oldSize = (growMemViews(), HEAPU8).length;
  // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
  requestedSize >>>= 0;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  if (requestedSize <= oldSize) {
    return false;
  }
  // Memory resize rules:
  // 1.  Always increase heap size to at least the requested size, rounded up
  //     to next page multiple.
  // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
  //     geometrically: increase the heap size according to
  //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
  //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
  // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
  //     linearly: increase the heap size by at least
  //     MEMORY_GROWTH_LINEAR_STEP bytes.
  // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
  //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
  // 4.  If we were unable to allocate as much memory, it may be due to
  //     over-eager decision to excessively reserve due to (3) above.
  //     Hence if an allocation fails, cut down on the amount of excess
  //     growth, in an attempt to succeed to perform a smaller allocation.
  // A limit is set for how much we can grow. We should not exceed that
  // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
  var maxHeapSize = getHeapMax();
  if (requestedSize > maxHeapSize) {
    return false;
  }
  // Loop through potential heap size increases. If we attempt a too eager
  // reservation that fails, cut down on the attempted size and reserve a
  // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + .2 / cutDown);
    // ensure geometric growth
    // but limit overreserving (default to capping at +96MB overgrowth at most)
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = growMemory(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
};

var registerFullscreenChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  JSEvents.fullscreenChangeEvent ||= _malloc(276);
  var fullscreenChangeEventhandlerFunc = (e = event) => {
    var fullscreenChangeEvent = targetThread ? _malloc(276) : JSEvents.fullscreenChangeEvent;
    fillFullscreenChangeEventData(fullscreenChangeEvent);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, fullscreenChangeEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, fullscreenChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    callbackfunc,
    handlerFunc: fullscreenChangeEventhandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_fullscreenchange_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(37, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  // Unprefixed Fullscreen API shipped in Chromium 71 (https://bugs.chromium.org/p/chromium/issues/detail?id=383813)
  // As of Safari 13.0.3 on macOS Catalina 10.15.1 still ships with prefixed webkitfullscreenchange. TODO: revisit this check once Safari ships unprefixed version.
  registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "webkitfullscreenchange", targetThread);
  return registerFullscreenChangeEventCallback(target, userData, useCapture, callbackfunc, 19, "fullscreenchange", targetThread);
}

var _emscripten_set_main_loop = (func, fps, simulateInfiniteLoop) => {
  var iterFunc = getWasmTableEntry(func);
  setMainLoop(iterFunc, fps, simulateInfiniteLoop);
};

var screenOrientation = () => {
  if (!window.screen) return undefined;
  return screen.orientation || screen["mozOrientation"] || screen["webkitOrientation"];
};

var fillOrientationChangeEventData = eventStruct => {
  // OrientationType enum
  var orientationsType1 = [ "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary" ];
  // alternative selection from OrientationLockType enum
  var orientationsType2 = [ "portrait", "portrait", "landscape", "landscape" ];
  var orientationIndex = 0;
  var orientationAngle = 0;
  var screenOrientObj = screenOrientation();
  if (typeof screenOrientObj === "object") {
    orientationIndex = orientationsType1.indexOf(screenOrientObj.type);
    if (orientationIndex < 0) {
      orientationIndex = orientationsType2.indexOf(screenOrientObj.type);
    }
    if (orientationIndex >= 0) {
      orientationIndex = 1 << orientationIndex;
    }
    orientationAngle = screenOrientObj.angle;
  } else {
    // fallback for Safari earlier than 16.4 (March 2023)
    orientationAngle = window.orientation;
  }
  (growMemViews(), HEAP32)[((eventStruct) >> 2)] = orientationIndex;
  (growMemViews(), HEAP32)[(((eventStruct) + (4)) >> 2)] = orientationAngle;
};

var registerOrientationChangeEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  JSEvents.orientationChangeEvent ||= _malloc(8);
  var orientationChangeEventHandlerFunc = (e = event) => {
    var orientationChangeEvent = targetThread ? _malloc(8) : JSEvents.orientationChangeEvent;
    fillOrientationChangeEventData(orientationChangeEvent);
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, orientationChangeEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, orientationChangeEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    eventTypeString,
    callbackfunc,
    handlerFunc: orientationChangeEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_orientationchange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(38, 0, 1, userData, useCapture, callbackfunc, targetThread);
  if (!window.screen || !screen.orientation) return -1;
  return registerOrientationChangeEventCallback(screen.orientation, userData, useCapture, callbackfunc, 18, "change", targetThread);
}

var registerTouchEventCallback = (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) => {
  targetThread = JSEvents.getTargetThreadForEventCallback(targetThread);
  JSEvents.touchEvent ||= _malloc(1552);
  target = findEventTarget(target);
  var touchEventHandlerFunc = e => {
    var t, touches = {}, et = e.touches;
    // To ease marshalling different kinds of touches that browser reports (all touches are listed in e.touches,
    // only changed touches in e.changedTouches, and touches on target at a.targetTouches), mark a boolean in
    // each Touch object so that we can later loop only once over all touches we see to marshall over to Wasm.
    for (let t of et) {
      // Browser might recycle the generated Touch objects between each frame (Firefox on Android), so reset any
      // changed/target states we may have set from previous frame.
      t.isChanged = t.onTarget = 0;
      touches[t.identifier] = t;
    }
    // Mark which touches are part of the changedTouches list.
    for (let t of e.changedTouches) {
      t.isChanged = 1;
      touches[t.identifier] = t;
    }
    // Mark which touches are part of the targetTouches list.
    for (let t of e.targetTouches) {
      touches[t.identifier].onTarget = 1;
    }
    var touchEvent = targetThread ? _malloc(1552) : JSEvents.touchEvent;
    (growMemViews(), HEAPF64)[((touchEvent) >> 3)] = e.timeStamp;
    (growMemViews(), HEAP8)[touchEvent + 12] = e.ctrlKey;
    (growMemViews(), HEAP8)[touchEvent + 13] = e.shiftKey;
    (growMemViews(), HEAP8)[touchEvent + 14] = e.altKey;
    (growMemViews(), HEAP8)[touchEvent + 15] = e.metaKey;
    var idx = touchEvent + 16;
    var targetRect = getBoundingClientRect(target);
    var numTouches = 0;
    for (let t of Object.values(touches)) {
      var idx32 = ((idx) >> 2);
      // Pre-shift the ptr to index to HEAP32 to save code size
      (growMemViews(), HEAP32)[idx32 + 0] = t.identifier;
      (growMemViews(), HEAP32)[idx32 + 1] = t.screenX;
      (growMemViews(), HEAP32)[idx32 + 2] = t.screenY;
      (growMemViews(), HEAP32)[idx32 + 3] = t.clientX;
      (growMemViews(), HEAP32)[idx32 + 4] = t.clientY;
      (growMemViews(), HEAP32)[idx32 + 5] = t.pageX;
      (growMemViews(), HEAP32)[idx32 + 6] = t.pageY;
      (growMemViews(), HEAP8)[idx + 28] = t.isChanged;
      (growMemViews(), HEAP8)[idx + 29] = t.onTarget;
      (growMemViews(), HEAP32)[idx32 + 8] = t.clientX - (targetRect.left | 0);
      (growMemViews(), HEAP32)[idx32 + 9] = t.clientY - (targetRect.top | 0);
      idx += 48;
      if (++numTouches > 31) {
        break;
      }
    }
    (growMemViews(), HEAP32)[(((touchEvent) + (8)) >> 2)] = numTouches;
    if (targetThread) __emscripten_run_callback_on_thread(targetThread, callbackfunc, eventTypeId, touchEvent, userData); else if (getWasmTableEntry(callbackfunc)(eventTypeId, touchEvent, userData)) e.preventDefault();
  };
  var eventHandler = {
    target,
    allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
    eventTypeString,
    callbackfunc,
    handlerFunc: touchEventHandlerFunc,
    useCapture
  };
  return JSEvents.registerOrRemoveHandler(eventHandler);
};

function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(39, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
}

function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(40, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
}

function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(41, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
}

function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(42, 0, 1, target, userData, useCapture, callbackfunc, targetThread);
  return registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
}

class HandleAllocator {
  allocated=[ undefined ];
  freelist=[];
  get(id) {
    return this.allocated[id];
  }
  has(id) {
    return this.allocated[id] !== undefined;
  }
  allocate(handle) {
    var id = this.freelist.pop() || this.allocated.length;
    this.allocated[id] = handle;
    return id;
  }
  free(id) {
    // Set the slot to `undefined` rather than using `delete` here since
    // apparently arrays with holes in them can be less efficient.
    this.allocated[id] = undefined;
    this.freelist.push(id);
  }
}

var Fetch = {
  async openDatabase(dbname, dbversion) {
    return new Promise((resolve, reject) => {
      try {
        var openRequest = indexedDB.open(dbname, dbversion);
      } catch (e) {
        return reject(e);
      }
      openRequest.onupgradeneeded = event => {
        var db = /** @type {IDBDatabase} */ (event.target.result);
        if (db.objectStoreNames.contains("FILES")) {
          db.deleteObjectStore("FILES");
        }
        db.createObjectStore("FILES");
      };
      openRequest.onsuccess = event => resolve(event.target.result);
      openRequest.onerror = reject;
    });
  },
  async init() {
    Fetch.xhrs = new HandleAllocator;
    if (ENVIRONMENT_IS_PTHREAD) return;
    addRunDependency("library_fetch_init");
    try {
      var db = await Fetch.openDatabase("emscripten_filesystem", 1);
      Fetch.dbInstance = db;
    } catch (e) {
      Fetch.dbInstance = false;
    } finally {
      removeRunDependency("library_fetch_init");
    }
  }
};

function fetchXHR(fetch, onsuccess, onerror, onprogress, onreadystatechange) {
  var url = (growMemViews(), HEAPU32)[(((fetch) + (8)) >> 2)];
  if (!url) {
    onerror(fetch, "no url specified!");
    return;
  }
  var url_ = UTF8ToString(url);
  var fetch_attr = fetch + 108;
  var requestMethod = UTF8ToString(fetch_attr + 0);
  requestMethod ||= "GET";
  var timeoutMsecs = (growMemViews(), HEAPU32)[(((fetch_attr) + (56)) >> 2)];
  var userName = (growMemViews(), HEAPU32)[(((fetch_attr) + (68)) >> 2)];
  var password = (growMemViews(), HEAPU32)[(((fetch_attr) + (72)) >> 2)];
  var requestHeaders = (growMemViews(), HEAPU32)[(((fetch_attr) + (76)) >> 2)];
  var overriddenMimeType = (growMemViews(), HEAPU32)[(((fetch_attr) + (80)) >> 2)];
  var dataPtr = (growMemViews(), HEAPU32)[(((fetch_attr) + (84)) >> 2)];
  var dataLength = (growMemViews(), HEAPU32)[(((fetch_attr) + (88)) >> 2)];
  var fetchAttributes = (growMemViews(), HEAPU32)[(((fetch_attr) + (52)) >> 2)];
  var fetchAttrLoadToMemory = !!(fetchAttributes & 1);
  var fetchAttrStreamData = !!(fetchAttributes & 2);
  var fetchAttrSynchronous = !!(fetchAttributes & 64);
  var userNameStr = userName ? UTF8ToString(userName) : undefined;
  var passwordStr = password ? UTF8ToString(password) : undefined;
  var xhr = new XMLHttpRequest;
  xhr.withCredentials = !!(growMemViews(), HEAPU8)[(fetch_attr) + (60)];
  xhr.open(requestMethod, url_, !fetchAttrSynchronous, userNameStr, passwordStr);
  if (!fetchAttrSynchronous) xhr.timeout = timeoutMsecs;
  // XHR timeout field is only accessible in async XHRs, and must be set after .open() but before .send().
  xhr.url_ = url_;
  // Save the url for debugging purposes (and for comparing to the responseURL that server side advertised)
  xhr.responseType = "arraybuffer";
  if (overriddenMimeType) {
    var overriddenMimeTypeStr = UTF8ToString(overriddenMimeType);
    xhr.overrideMimeType(overriddenMimeTypeStr);
  }
  if (requestHeaders) {
    for (;;) {
      var key = (growMemViews(), HEAPU32)[((requestHeaders) >> 2)];
      if (!key) break;
      var value = (growMemViews(), HEAPU32)[(((requestHeaders) + (4)) >> 2)];
      if (!value) break;
      requestHeaders += 8;
      var keyStr = UTF8ToString(key);
      var valueStr = UTF8ToString(value);
      xhr.setRequestHeader(keyStr, valueStr);
    }
  }
  var id = Fetch.xhrs.allocate(xhr);
  (growMemViews(), HEAPU32)[((fetch) >> 2)] = id;
  var data = (dataPtr && dataLength) ? (growMemViews(), HEAPU8).slice(dataPtr, dataPtr + dataLength) : null;
  // TODO: Support specifying custom headers to the request.
  // Share the code to save the response, as we need to do so both on success
  // and on error (despite an error, there may be a response, like a 404 page).
  // This receives a condition, which determines whether to save the xhr's
  // response, or just 0.
  function saveResponseAndStatus() {
    var ptr = 0;
    var ptrLen = 0;
    if (xhr.response && fetchAttrLoadToMemory && (growMemViews(), HEAPU32)[(((fetch) + (12)) >> 2)] === 0) {
      ptrLen = xhr.response.byteLength;
    }
    if (ptrLen > 0) {
      // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
      // freed when emscripten_fetch_close() is called.
      ptr = _malloc(ptrLen);
      (growMemViews(), HEAPU8).set(new Uint8Array(/** @type{Array<number>} */ (xhr.response)), ptr);
    }
    (growMemViews(), HEAPU32)[(((fetch) + (12)) >> 2)] = ptr;
    writeI53ToI64(fetch + 16, ptrLen);
    writeI53ToI64(fetch + 24, 0);
    var len = xhr.response ? xhr.response.byteLength : 0;
    if (len) {
      // If the final XHR.onload handler receives the bytedata to compute total length, report that,
      // otherwise don't write anything out here, which will retain the latest byte size reported in
      // the most recent XHR.onprogress handler.
      writeI53ToI64(fetch + 32, len);
    }
    (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = xhr.readyState;
    (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = xhr.status;
    if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
    if (fetchAttrSynchronous) {
      // The response url pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
      // freed when emscripten_fetch_close() is called.
      var ruPtr = stringToNewUTF8(xhr.responseURL);
      (growMemViews(), HEAPU32)[(((fetch) + (200)) >> 2)] = ruPtr;
    }
  }
  xhr.onload = e => {
    // check if xhr was aborted by user and don't try to call back
    if (!Fetch.xhrs.has(id)) {
      return;
    }
    saveResponseAndStatus();
    if (xhr.status >= 200 && xhr.status < 300) {
      onsuccess(fetch, xhr, e);
    } else {
      onerror(fetch, e);
    }
  };
  xhr.onerror = e => {
    // check if xhr was aborted by user and don't try to call back
    if (!Fetch.xhrs.has(id)) {
      return;
    }
    saveResponseAndStatus();
    onerror(fetch, e);
  };
  xhr.ontimeout = e => {
    // check if xhr was aborted by user and don't try to call back
    if (!Fetch.xhrs.has(id)) {
      return;
    }
    onerror(fetch, e);
  };
  xhr.onprogress = e => {
    // check if xhr was aborted by user and don't try to call back
    if (!Fetch.xhrs.has(id)) {
      return;
    }
    var ptrLen = (fetchAttrLoadToMemory && fetchAttrStreamData && xhr.response) ? xhr.response.byteLength : 0;
    var ptr = 0;
    if (ptrLen > 0 && fetchAttrLoadToMemory && fetchAttrStreamData) {
      // Allocate byte data in Emscripten heap for the streamed memory block (freed immediately after onprogress call)
      ptr = _malloc(ptrLen);
      (growMemViews(), HEAPU8).set(new Uint8Array(/** @type{Array<number>} */ (xhr.response)), ptr);
    }
    (growMemViews(), HEAPU32)[(((fetch) + (12)) >> 2)] = ptr;
    writeI53ToI64(fetch + 16, ptrLen);
    writeI53ToI64(fetch + 24, e.loaded - ptrLen);
    writeI53ToI64(fetch + 32, e.total);
    (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = xhr.readyState;
    var status = xhr.status;
    // If loading files from a source that does not give HTTP status code, assume success if we get data bytes
    if (xhr.readyState >= 3 && xhr.status === 0 && e.loaded > 0) status = 200;
    (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = status;
    if (xhr.statusText) stringToUTF8(xhr.statusText, fetch + 44, 64);
    onprogress(fetch, e);
    _free(ptr);
  };
  xhr.onreadystatechange = e => {
    // check if xhr was aborted by user and don't try to call back
    if (!Fetch.xhrs.has(id)) {
      runtimeKeepalivePop();
      return;
    }
    (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = xhr.readyState;
    if (xhr.readyState >= 2) {
      (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = xhr.status;
    }
    if (!fetchAttrSynchronous && (xhr.readyState === 2 && xhr.responseURL.length > 0)) {
      // The response url pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
      // freed when emscripten_fetch_close() is called.
      var ruPtr = stringToNewUTF8(xhr.responseURL);
      (growMemViews(), HEAPU32)[(((fetch) + (200)) >> 2)] = ruPtr;
    }
    onreadystatechange(fetch, e);
  };
  try {
    xhr.send(data);
  } catch (e) {
    onerror(fetch, e);
  }
}

function fetchCacheData(/** @type {IDBDatabase} */ db, fetch, data, onsuccess, onerror) {
  if (!db) {
    onerror(fetch, 0, "IndexedDB not available!");
    return;
  }
  var fetch_attr = fetch + 108;
  var destinationPath = (growMemViews(), HEAPU32)[(((fetch_attr) + (64)) >> 2)];
  destinationPath ||= (growMemViews(), HEAPU32)[(((fetch) + (8)) >> 2)];
  var destinationPathStr = UTF8ToString(destinationPath);
  try {
    var transaction = db.transaction([ "FILES" ], "readwrite");
    var packages = transaction.objectStore("FILES");
    var putRequest = packages.put(data, destinationPathStr);
    putRequest.onsuccess = event => {
      (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
      // Mimic XHR readyState 4 === 'DONE: The operation is complete'
      (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 200;
      // Mimic XHR HTTP status code 200 "OK"
      stringToUTF8("OK", fetch + 44, 64);
      onsuccess(fetch, 0, destinationPathStr);
    };
    putRequest.onerror = error => {
      // Most likely we got an error if IndexedDB is unwilling to store any more data for this page.
      // TODO: Can we identify and break down different IndexedDB-provided errors and convert those
      // to more HTTP status codes for more information?
      (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
      // Mimic XHR readyState 4 === 'DONE: The operation is complete'
      (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 413;
      // Mimic XHR HTTP status code 413 "Payload Too Large"
      stringToUTF8("Payload Too Large", fetch + 44, 64);
      onerror(fetch, 0, error);
    };
  } catch (e) {
    onerror(fetch, 0, e);
  }
}

function fetchLoadCachedData(db, fetch, onsuccess, onerror) {
  if (!db) {
    onerror(fetch, 0, "IndexedDB not available!");
    return;
  }
  var fetch_attr = fetch + 108;
  var path = (growMemViews(), HEAPU32)[(((fetch_attr) + (64)) >> 2)];
  path ||= (growMemViews(), HEAPU32)[(((fetch) + (8)) >> 2)];
  var pathStr = UTF8ToString(path);
  try {
    var transaction = db.transaction([ "FILES" ], "readonly");
    var packages = transaction.objectStore("FILES");
    var getRequest = packages.get(pathStr);
    getRequest.onsuccess = event => {
      if (event.target.result) {
        var value = event.target.result;
        var len = value.byteLength || value.length;
        // The data pointer malloc()ed here has the same lifetime as the emscripten_fetch_t structure itself has, and is
        // freed when emscripten_fetch_close() is called.
        var ptr = _malloc(len);
        (growMemViews(), HEAPU8).set(new Uint8Array(value), ptr);
        (growMemViews(), HEAPU32)[(((fetch) + (12)) >> 2)] = ptr;
        writeI53ToI64(fetch + 16, len);
        writeI53ToI64(fetch + 24, 0);
        writeI53ToI64(fetch + 32, len);
        (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
        // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 200;
        // Mimic XHR HTTP status code 200 "OK"
        stringToUTF8("OK", fetch + 44, 64);
        onsuccess(fetch, 0, value);
      } else {
        // Succeeded to load, but the load came back with the value of undefined, treat that as an error since we never store undefined in db.
        (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
        // Mimic XHR readyState 4 === 'DONE: The operation is complete'
        (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 404;
        // Mimic XHR HTTP status code 404 "Not Found"
        stringToUTF8("Not Found", fetch + 44, 64);
        onerror(fetch, 0, "no data");
      }
    };
    getRequest.onerror = error => {
      (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
      // Mimic XHR readyState 4 === 'DONE: The operation is complete'
      (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 404;
      // Mimic XHR HTTP status code 404 "Not Found"
      stringToUTF8("Not Found", fetch + 44, 64);
      onerror(fetch, 0, error);
    };
  } catch (e) {
    onerror(fetch, 0, e);
  }
}

function fetchDeleteCachedData(db, fetch, onsuccess, onerror) {
  if (!db) {
    onerror(fetch, 0, "IndexedDB not available!");
    return;
  }
  var fetch_attr = fetch + 108;
  var path = (growMemViews(), HEAPU32)[(((fetch_attr) + (64)) >> 2)];
  path ||= (growMemViews(), HEAPU32)[(((fetch) + (8)) >> 2)];
  var pathStr = UTF8ToString(path);
  try {
    var transaction = db.transaction([ "FILES" ], "readwrite");
    var packages = transaction.objectStore("FILES");
    var request = packages.delete(pathStr);
    request.onsuccess = event => {
      var value = event.target.result;
      (growMemViews(), HEAPU32)[(((fetch) + (12)) >> 2)] = 0;
      writeI53ToI64(fetch + 16, 0);
      writeI53ToI64(fetch + 24, 0);
      writeI53ToI64(fetch + 32, 0);
      // Mimic XHR readyState 4 === 'DONE: The operation is complete'
      (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
      // Mimic XHR HTTP status code 200 "OK"
      (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 200;
      stringToUTF8("OK", fetch + 44, 64);
      onsuccess(fetch, 0, value);
    };
    request.onerror = error => {
      (growMemViews(), HEAP16)[(((fetch) + (40)) >> 1)] = 4;
      // Mimic XHR readyState 4 === 'DONE: The operation is complete'
      (growMemViews(), HEAP16)[(((fetch) + (42)) >> 1)] = 404;
      // Mimic XHR HTTP status code 404 "Not Found"
      stringToUTF8("Not Found", fetch + 44, 64);
      onerror(fetch, 0, error);
    };
  } catch (e) {
    onerror(fetch, 0, e);
  }
}

function _emscripten_start_fetch(fetch, successcb, errorcb, progresscb, readystatechangecb) {
  // Avoid shutting down the runtime since we want to wait for the async
  // response.
  runtimeKeepalivePush();
  var fetch_attr = fetch + 108;
  var onsuccess = (growMemViews(), HEAPU32)[(((fetch_attr) + (36)) >> 2)];
  var onerror = (growMemViews(), HEAPU32)[(((fetch_attr) + (40)) >> 2)];
  var onprogress = (growMemViews(), HEAPU32)[(((fetch_attr) + (44)) >> 2)];
  var onreadystatechange = (growMemViews(), HEAPU32)[(((fetch_attr) + (48)) >> 2)];
  var fetchAttributes = (growMemViews(), HEAPU32)[(((fetch_attr) + (52)) >> 2)];
  var fetchAttrSynchronous = !!(fetchAttributes & 64);
  function doCallback(f) {
    if (fetchAttrSynchronous) {
      f();
    } else {
      callUserCallback(f);
    }
  }
  var reportSuccess = (fetch, xhr, e) => {
    runtimeKeepalivePop();
    doCallback(() => {
      if (onsuccess) getWasmTableEntry(onsuccess)(fetch); else successcb?.(fetch);
    });
  };
  var reportProgress = (fetch, e) => {
    doCallback(() => {
      if (onprogress) getWasmTableEntry(onprogress)(fetch); else progresscb?.(fetch);
    });
  };
  var reportError = (fetch, e) => {
    runtimeKeepalivePop();
    doCallback(() => {
      if (onerror) getWasmTableEntry(onerror)(fetch); else errorcb?.(fetch);
    });
  };
  var reportReadyStateChange = (fetch, e) => {
    doCallback(() => {
      if (onreadystatechange) getWasmTableEntry(onreadystatechange)(fetch); else readystatechangecb?.(fetch);
    });
  };
  var performUncachedXhr = (fetch, xhr, e) => {
    fetchXHR(fetch, reportSuccess, reportError, reportProgress, reportReadyStateChange);
  };
  var cacheResultAndReportSuccess = (fetch, xhr, e) => {
    var storeSuccess = (fetch, xhr, e) => {
      runtimeKeepalivePop();
      doCallback(() => {
        if (onsuccess) getWasmTableEntry(onsuccess)(fetch); else successcb?.(fetch);
      });
    };
    var storeError = (fetch, xhr, e) => {
      runtimeKeepalivePop();
      doCallback(() => {
        if (onsuccess) getWasmTableEntry(onsuccess)(fetch); else successcb?.(fetch);
      });
    };
    fetchCacheData(Fetch.dbInstance, fetch, xhr.response, storeSuccess, storeError);
  };
  var performCachedXhr = (fetch, xhr, e) => {
    fetchXHR(fetch, cacheResultAndReportSuccess, reportError, reportProgress, reportReadyStateChange);
  };
  var requestMethod = UTF8ToString(fetch_attr + 0);
  var fetchAttrReplace = !!(fetchAttributes & 16);
  var fetchAttrPersistFile = !!(fetchAttributes & 4);
  var fetchAttrNoDownload = !!(fetchAttributes & 32);
  if (requestMethod === "EM_IDB_STORE") {
    // TODO(?): Here we perform a clone of the data, because storing shared typed arrays to IndexedDB does not seem to be allowed.
    var ptr = (growMemViews(), HEAPU32)[(((fetch_attr) + (84)) >> 2)];
    var size = (growMemViews(), HEAPU32)[(((fetch_attr) + (88)) >> 2)];
    fetchCacheData(Fetch.dbInstance, fetch, (growMemViews(), HEAPU8).slice(ptr, ptr + size), reportSuccess, reportError);
  } else if (requestMethod === "EM_IDB_DELETE") {
    fetchDeleteCachedData(Fetch.dbInstance, fetch, reportSuccess, reportError);
  } else if (!fetchAttrReplace) {
    fetchLoadCachedData(Fetch.dbInstance, fetch, reportSuccess, fetchAttrNoDownload ? reportError : (fetchAttrPersistFile ? performCachedXhr : performUncachedXhr));
  } else if (!fetchAttrNoDownload) {
    fetchXHR(fetch, fetchAttrPersistFile ? cacheResultAndReportSuccess : reportSuccess, reportError, reportProgress, reportReadyStateChange);
  } else {
    return 0;
  }
  return fetch;
}

var ENV = {};

var getExecutableName = () => thisProgram || "./this.program";

var getEnvStrings = () => {
  if (!getEnvStrings.strings) {
    // Default values.
    // Browser language detection #8751
    var lang = ((typeof navigator == "object" && navigator.language) || "C").replace("-", "_") + ".UTF-8";
    var env = {
      "USER": "web_user",
      "LOGNAME": "web_user",
      "PATH": "/",
      "PWD": "/",
      "HOME": "/home/web_user",
      "LANG": lang,
      "_": getExecutableName()
    };
    // Apply the user-provided values, if any.
    for (var x in ENV) {
      // x is a key in ENV; if ENV[x] is undefined, that means it was
      // explicitly set to be so. We allow user code to do that to
      // force variables with default values to remain unset.
      if (ENV[x] === undefined) delete env[x]; else env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(`${x}=${env[x]}`);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
};

function _environ_get(__environ, environ_buf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(43, 0, 1, __environ, environ_buf);
  var bufSize = 0;
  var envp = 0;
  for (var string of getEnvStrings()) {
    var ptr = environ_buf + bufSize;
    (growMemViews(), HEAPU32)[(((__environ) + (envp)) >> 2)] = ptr;
    bufSize += stringToUTF8(string, ptr, Infinity) + 1;
    envp += 4;
  }
  return 0;
}

function _environ_sizes_get(penviron_count, penviron_buf_size) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(44, 0, 1, penviron_count, penviron_buf_size);
  var strings = getEnvStrings();
  (growMemViews(), HEAPU32)[((penviron_count) >> 2)] = strings.length;
  var bufSize = 0;
  for (var string of strings) {
    bufSize += lengthBytesUTF8(string) + 1;
  }
  (growMemViews(), HEAPU32)[((penviron_buf_size) >> 2)] = bufSize;
  return 0;
}

function _fd_close(fd) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(45, 0, 1, fd);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_fdstat_get(fd, pbuf) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(46, 0, 1, fd, pbuf);
  try {
    var rightsBase = 0;
    var rightsInheriting = 0;
    var flags = 0;
    {
      var stream = SYSCALLS.getStreamFromFD(fd);
      // All character devices are terminals (other things a Linux system would
      // assume is a character device, like the mouse, we have special APIs for).
      var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
    }
    (growMemViews(), HEAP8)[pbuf] = type;
    (growMemViews(), HEAP16)[(((pbuf) + (2)) >> 1)] = flags;
    (growMemViews(), HEAP64)[(((pbuf) + (8)) >> 3)] = BigInt(rightsBase);
    (growMemViews(), HEAP64)[(((pbuf) + (16)) >> 3)] = BigInt(rightsInheriting);
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doReadv = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = (growMemViews(), HEAPU32)[((iov) >> 2)];
    var len = (growMemViews(), HEAPU32)[(((iov) + (4)) >> 2)];
    iov += 8;
    var curr = FS.read(stream, (growMemViews(), HEAP8), ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) break;
    // nothing more to read
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_read(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(47, 0, 1, fd, iov, iovcnt, pnum);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doReadv(stream, iov, iovcnt);
    (growMemViews(), HEAPU32)[((pnum) >> 2)] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_seek(fd, offset, whence, newOffset) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(48, 0, 1, fd, offset, whence, newOffset);
  offset = bigintToI53Checked(offset);
  try {
    if (isNaN(offset)) return 61;
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.llseek(stream, offset, whence);
    (growMemViews(), HEAP64)[((newOffset) >> 3)] = BigInt(stream.position);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    // reset readdir state
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

function _fd_sync(fd) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(49, 0, 1, fd);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (stream.stream_ops?.fsync) {
      return stream.stream_ops.fsync(stream);
    }
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @param {number=} offset */ var doWritev = (stream, iov, iovcnt, offset) => {
  var ret = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = (growMemViews(), HEAPU32)[((iov) >> 2)];
    var len = (growMemViews(), HEAPU32)[(((iov) + (4)) >> 2)];
    iov += 8;
    var curr = FS.write(stream, (growMemViews(), HEAP8), ptr, len, offset);
    if (curr < 0) return -1;
    ret += curr;
    if (curr < len) {
      // No more space to write.
      break;
    }
    if (typeof offset != "undefined") {
      offset += curr;
    }
  }
  return ret;
};

function _fd_write(fd, iov, iovcnt, pnum) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(50, 0, 1, fd, iov, iovcnt, pnum);
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = doWritev(stream, iov, iovcnt);
    (growMemViews(), HEAPU32)[((pnum) >> 2)] = num;
    return 0;
  } catch (e) {
    if (typeof FS == "undefined" || !(e.name === "ErrnoError")) throw e;
    return e.errno;
  }
}

/** @constructor */ function GLFW_Window(id, width, height, framebufferWidth, framebufferHeight, title, monitor, share) {
  this.id = id;
  this.x = 0;
  this.y = 0;
  this.fullscreen = false;
  // Used to determine if app in fullscreen mode
  this.storedX = 0;
  // Used to store X before fullscreen
  this.storedY = 0;
  // Used to store Y before fullscreen
  this.width = width;
  this.height = height;
  this.framebufferWidth = framebufferWidth;
  this.framebufferHeight = framebufferHeight;
  this.storedWidth = width;
  // Used to store width before fullscreen
  this.storedHeight = height;
  // Used to store height before fullscreen
  this.title = title;
  this.monitor = monitor;
  this.share = share;
  this.attributes = {
    ...GLFW.hints
  };
  this.inputModes = {
    208897: 212993,
    // GLFW_CURSOR (GLFW_CURSOR_NORMAL)
    208898: 0,
    // GLFW_STICKY_KEYS
    208899: 0
  };
  this.buttons = 0;
  this.keys = new Array;
  this.domKeys = new Array;
  this.shouldClose = 0;
  this.title = null;
  this.windowPosFunc = 0;
  // GLFWwindowposfun
  this.windowSizeFunc = 0;
  // GLFWwindowsizefun
  this.windowCloseFunc = 0;
  // GLFWwindowclosefun
  this.windowRefreshFunc = 0;
  // GLFWwindowrefreshfun
  this.windowFocusFunc = 0;
  // GLFWwindowfocusfun
  this.windowIconifyFunc = 0;
  // GLFWwindowiconifyfun
  this.windowMaximizeFunc = 0;
  // GLFWwindowmaximizefun
  this.framebufferSizeFunc = 0;
  // GLFWframebuffersizefun
  this.windowContentScaleFunc = 0;
  // GLFWwindowcontentscalefun
  this.mouseButtonFunc = 0;
  // GLFWmousebuttonfun
  this.cursorPosFunc = 0;
  // GLFWcursorposfun
  this.cursorEnterFunc = 0;
  // GLFWcursorenterfun
  this.scrollFunc = 0;
  // GLFWscrollfun
  this.dropFunc = 0;
  // GLFWdropfun
  this.keyFunc = 0;
  // GLFWkeyfun
  this.charFunc = 0;
  // GLFWcharfun
  this.userptr = 0;
}

function _emscripten_set_window_title(title) {
  if (ENVIRONMENT_IS_PTHREAD) return proxyToMainThread(51, 0, 1, title);
  return document.title = UTF8ToString(title);
}

var GLFW = {
  WindowFromId: id => {
    if (id <= 0 || !GLFW.windows) return null;
    return GLFW.windows[id - 1];
  },
  joystickFunc: 0,
  errorFunc: 0,
  monitorFunc: 0,
  active: null,
  scale: null,
  windows: null,
  monitors: null,
  monitorString: null,
  versionString: null,
  initialTime: null,
  extensions: null,
  devicePixelRatioMQL: null,
  hints: null,
  primaryTouchId: null,
  defaultHints: {
    131073: 0,
    131074: 0,
    131075: 1,
    131076: 1,
    131077: 1,
    131082: 0,
    135169: 8,
    135170: 8,
    135171: 8,
    135172: 8,
    135173: 24,
    135174: 8,
    135175: 0,
    135176: 0,
    135177: 0,
    135178: 0,
    135179: 0,
    135180: 0,
    135181: 0,
    135182: 0,
    135183: 0,
    139265: 196609,
    139266: 1,
    139267: 0,
    139268: 0,
    139269: 0,
    139270: 0,
    139271: 0,
    139272: 0,
    139276: 0
  },
  DOMToGLFWKeyCode: keycode => {
    switch (keycode) {
     // these keycodes are only defined for GLFW3, assume they are the same for GLFW2
      case 32:
      return 32;

     // DOM_VK_SPACE -> GLFW_KEY_SPACE
      case 222:
      return 39;

     // DOM_VK_QUOTE -> GLFW_KEY_APOSTROPHE
      case 188:
      return 44;

     // DOM_VK_COMMA -> GLFW_KEY_COMMA
      case 173:
      return 45;

     // DOM_VK_HYPHEN_MINUS -> GLFW_KEY_MINUS
      case 189:
      return 45;

     // DOM_VK_MINUS -> GLFW_KEY_MINUS
      case 190:
      return 46;

     // DOM_VK_PERIOD -> GLFW_KEY_PERIOD
      case 191:
      return 47;

     // DOM_VK_SLASH -> GLFW_KEY_SLASH
      case 48:
      return 48;

     // DOM_VK_0 -> GLFW_KEY_0
      case 49:
      return 49;

     // DOM_VK_1 -> GLFW_KEY_1
      case 50:
      return 50;

     // DOM_VK_2 -> GLFW_KEY_2
      case 51:
      return 51;

     // DOM_VK_3 -> GLFW_KEY_3
      case 52:
      return 52;

     // DOM_VK_4 -> GLFW_KEY_4
      case 53:
      return 53;

     // DOM_VK_5 -> GLFW_KEY_5
      case 54:
      return 54;

     // DOM_VK_6 -> GLFW_KEY_6
      case 55:
      return 55;

     // DOM_VK_7 -> GLFW_KEY_7
      case 56:
      return 56;

     // DOM_VK_8 -> GLFW_KEY_8
      case 57:
      return 57;

     // DOM_VK_9 -> GLFW_KEY_9
      case 59:
      return 59;

     // DOM_VK_SEMICOLON -> GLFW_KEY_SEMICOLON
      case 61:
      return 61;

     // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
      case 187:
      return 61;

     // DOM_VK_EQUALS -> GLFW_KEY_EQUAL
      case 65:
      return 65;

     // DOM_VK_A -> GLFW_KEY_A
      case 66:
      return 66;

     // DOM_VK_B -> GLFW_KEY_B
      case 67:
      return 67;

     // DOM_VK_C -> GLFW_KEY_C
      case 68:
      return 68;

     // DOM_VK_D -> GLFW_KEY_D
      case 69:
      return 69;

     // DOM_VK_E -> GLFW_KEY_E
      case 70:
      return 70;

     // DOM_VK_F -> GLFW_KEY_F
      case 71:
      return 71;

     // DOM_VK_G -> GLFW_KEY_G
      case 72:
      return 72;

     // DOM_VK_H -> GLFW_KEY_H
      case 73:
      return 73;

     // DOM_VK_I -> GLFW_KEY_I
      case 74:
      return 74;

     // DOM_VK_J -> GLFW_KEY_J
      case 75:
      return 75;

     // DOM_VK_K -> GLFW_KEY_K
      case 76:
      return 76;

     // DOM_VK_L -> GLFW_KEY_L
      case 77:
      return 77;

     // DOM_VK_M -> GLFW_KEY_M
      case 78:
      return 78;

     // DOM_VK_N -> GLFW_KEY_N
      case 79:
      return 79;

     // DOM_VK_O -> GLFW_KEY_O
      case 80:
      return 80;

     // DOM_VK_P -> GLFW_KEY_P
      case 81:
      return 81;

     // DOM_VK_Q -> GLFW_KEY_Q
      case 82:
      return 82;

     // DOM_VK_R -> GLFW_KEY_R
      case 83:
      return 83;

     // DOM_VK_S -> GLFW_KEY_S
      case 84:
      return 84;

     // DOM_VK_T -> GLFW_KEY_T
      case 85:
      return 85;

     // DOM_VK_U -> GLFW_KEY_U
      case 86:
      return 86;

     // DOM_VK_V -> GLFW_KEY_V
      case 87:
      return 87;

     // DOM_VK_W -> GLFW_KEY_W
      case 88:
      return 88;

     // DOM_VK_X -> GLFW_KEY_X
      case 89:
      return 89;

     // DOM_VK_Y -> GLFW_KEY_Y
      case 90:
      return 90;

     // DOM_VK_Z -> GLFW_KEY_Z
      case 219:
      return 91;

     // DOM_VK_OPEN_BRACKET -> GLFW_KEY_LEFT_BRACKET
      case 220:
      return 92;

     // DOM_VK_BACKSLASH -> GLFW_KEY_BACKSLASH
      case 221:
      return 93;

     // DOM_VK_CLOSE_BRACKET -> GLFW_KEY_RIGHT_BRACKET
      case 192:
      return 96;

     // DOM_VK_BACK_QUOTE -> GLFW_KEY_GRAVE_ACCENT
      case 27:
      return 256;

     // DOM_VK_ESCAPE -> GLFW_KEY_ESCAPE
      case 13:
      return 257;

     // DOM_VK_RETURN -> GLFW_KEY_ENTER
      case 9:
      return 258;

     // DOM_VK_TAB -> GLFW_KEY_TAB
      case 8:
      return 259;

     // DOM_VK_BACK -> GLFW_KEY_BACKSPACE
      case 45:
      return 260;

     // DOM_VK_INSERT -> GLFW_KEY_INSERT
      case 46:
      return 261;

     // DOM_VK_DELETE -> GLFW_KEY_DELETE
      case 39:
      return 262;

     // DOM_VK_RIGHT -> GLFW_KEY_RIGHT
      case 37:
      return 263;

     // DOM_VK_LEFT -> GLFW_KEY_LEFT
      case 40:
      return 264;

     // DOM_VK_DOWN -> GLFW_KEY_DOWN
      case 38:
      return 265;

     // DOM_VK_UP -> GLFW_KEY_UP
      case 33:
      return 266;

     // DOM_VK_PAGE_UP -> GLFW_KEY_PAGE_UP
      case 34:
      return 267;

     // DOM_VK_PAGE_DOWN -> GLFW_KEY_PAGE_DOWN
      case 36:
      return 268;

     // DOM_VK_HOME -> GLFW_KEY_HOME
      case 35:
      return 269;

     // DOM_VK_END -> GLFW_KEY_END
      case 20:
      return 280;

     // DOM_VK_CAPS_LOCK -> GLFW_KEY_CAPS_LOCK
      case 145:
      return 281;

     // DOM_VK_SCROLL_LOCK -> GLFW_KEY_SCROLL_LOCK
      case 144:
      return 282;

     // DOM_VK_NUM_LOCK -> GLFW_KEY_NUM_LOCK
      case 44:
      return 283;

     // DOM_VK_SNAPSHOT -> GLFW_KEY_PRINT_SCREEN
      case 19:
      return 284;

     // DOM_VK_PAUSE -> GLFW_KEY_PAUSE
      case 112:
      return 290;

     // DOM_VK_F1 -> GLFW_KEY_F1
      case 113:
      return 291;

     // DOM_VK_F2 -> GLFW_KEY_F2
      case 114:
      return 292;

     // DOM_VK_F3 -> GLFW_KEY_F3
      case 115:
      return 293;

     // DOM_VK_F4 -> GLFW_KEY_F4
      case 116:
      return 294;

     // DOM_VK_F5 -> GLFW_KEY_F5
      case 117:
      return 295;

     // DOM_VK_F6 -> GLFW_KEY_F6
      case 118:
      return 296;

     // DOM_VK_F7 -> GLFW_KEY_F7
      case 119:
      return 297;

     // DOM_VK_F8 -> GLFW_KEY_F8
      case 120:
      return 298;

     // DOM_VK_F9 -> GLFW_KEY_F9
      case 121:
      return 299;

     // DOM_VK_F10 -> GLFW_KEY_F10
      case 122:
      return 300;

     // DOM_VK_F11 -> GLFW_KEY_F11
      case 123:
      return 301;

     // DOM_VK_F12 -> GLFW_KEY_F12
      case 124:
      return 302;

     // DOM_VK_F13 -> GLFW_KEY_F13
      case 125:
      return 303;

     // DOM_VK_F14 -> GLFW_KEY_F14
      case 126:
      return 304;

     // DOM_VK_F15 -> GLFW_KEY_F15
      case 127:
      return 305;

     // DOM_VK_F16 -> GLFW_KEY_F16
      case 128:
      return 306;

     // DOM_VK_F17 -> GLFW_KEY_F17
      case 129:
      return 307;

     // DOM_VK_F18 -> GLFW_KEY_F18
      case 130:
      return 308;

     // DOM_VK_F19 -> GLFW_KEY_F19
      case 131:
      return 309;

     // DOM_VK_F20 -> GLFW_KEY_F20
      case 132:
      return 310;

     // DOM_VK_F21 -> GLFW_KEY_F21
      case 133:
      return 311;

     // DOM_VK_F22 -> GLFW_KEY_F22
      case 134:
      return 312;

     // DOM_VK_F23 -> GLFW_KEY_F23
      case 135:
      return 313;

     // DOM_VK_F24 -> GLFW_KEY_F24
      case 136:
      return 314;

     // 0x88 (not used?) -> GLFW_KEY_F25
      case 96:
      return 320;

     // DOM_VK_NUMPAD0 -> GLFW_KEY_KP_0
      case 97:
      return 321;

     // DOM_VK_NUMPAD1 -> GLFW_KEY_KP_1
      case 98:
      return 322;

     // DOM_VK_NUMPAD2 -> GLFW_KEY_KP_2
      case 99:
      return 323;

     // DOM_VK_NUMPAD3 -> GLFW_KEY_KP_3
      case 100:
      return 324;

     // DOM_VK_NUMPAD4 -> GLFW_KEY_KP_4
      case 101:
      return 325;

     // DOM_VK_NUMPAD5 -> GLFW_KEY_KP_5
      case 102:
      return 326;

     // DOM_VK_NUMPAD6 -> GLFW_KEY_KP_6
      case 103:
      return 327;

     // DOM_VK_NUMPAD7 -> GLFW_KEY_KP_7
      case 104:
      return 328;

     // DOM_VK_NUMPAD8 -> GLFW_KEY_KP_8
      case 105:
      return 329;

     // DOM_VK_NUMPAD9 -> GLFW_KEY_KP_9
      case 110:
      return 330;

     // DOM_VK_DECIMAL -> GLFW_KEY_KP_DECIMAL
      case 111:
      return 331;

     // DOM_VK_DIVIDE -> GLFW_KEY_KP_DIVIDE
      case 106:
      return 332;

     // DOM_VK_MULTIPLY -> GLFW_KEY_KP_MULTIPLY
      case 109:
      return 333;

     // DOM_VK_SUBTRACT -> GLFW_KEY_KP_SUBTRACT
      case 107:
      return 334;

     // DOM_VK_ADD -> GLFW_KEY_KP_ADD
      // case 0x0D:return 335; // DOM_VK_RETURN -> GLFW_KEY_KP_ENTER (DOM_KEY_LOCATION_RIGHT)
      // case 0x61:return 336; // DOM_VK_EQUALS -> GLFW_KEY_KP_EQUAL (DOM_KEY_LOCATION_RIGHT)
      case 16:
      return 340;

     // DOM_VK_SHIFT -> GLFW_KEY_LEFT_SHIFT
      case 17:
      return 341;

     // DOM_VK_CONTROL -> GLFW_KEY_LEFT_CONTROL
      case 18:
      return 342;

     // DOM_VK_ALT -> GLFW_KEY_LEFT_ALT
      case 91:
      return 343;

     // DOM_VK_WIN -> GLFW_KEY_LEFT_SUPER
      case 224:
      return 343;

     // DOM_VK_META -> GLFW_KEY_LEFT_SUPER
      // case 0x10:return 344; // DOM_VK_SHIFT -> GLFW_KEY_RIGHT_SHIFT (DOM_KEY_LOCATION_RIGHT)
      // case 0x11:return 345; // DOM_VK_CONTROL -> GLFW_KEY_RIGHT_CONTROL (DOM_KEY_LOCATION_RIGHT)
      // case 0x12:return 346; // DOM_VK_ALT -> GLFW_KEY_RIGHT_ALT (DOM_KEY_LOCATION_RIGHT)
      // case 0x5B:return 347; // DOM_VK_WIN -> GLFW_KEY_RIGHT_SUPER (DOM_KEY_LOCATION_RIGHT)
      case 93:
      return 348;

     // DOM_VK_CONTEXT_MENU -> GLFW_KEY_MENU
      // XXX: GLFW_KEY_WORLD_1, GLFW_KEY_WORLD_2 what are these?
      default:
      return -1;
    }
  },
  getModBits: win => {
    var mod = 0;
    if (win.keys[340]) mod |= 1;
    // GLFW_MOD_SHIFT
    if (win.keys[341]) mod |= 2;
    // GLFW_MOD_CONTROL
    if (win.keys[342]) mod |= 4;
    // GLFW_MOD_ALT
    if (win.keys[343] || win.keys[348]) mod |= 8;
    // GLFW_MOD_SUPER
    // add caps and num lock keys? only if lock_key_mod is set
    return mod;
  },
  onKeyPress: event => {
    if (!GLFW.active || !GLFW.active.charFunc) return;
    if (event.ctrlKey || event.metaKey) return;
    // correct unicode charCode is only available with onKeyPress event
    var charCode = event.charCode;
    if (charCode == 0 || (charCode >= 0 && charCode <= 31)) return;
    getWasmTableEntry(GLFW.active.charFunc)(GLFW.active.id, charCode);
  },
  onKeyChanged: (keyCode, status) => {
    if (!GLFW.active) return;
    var key = GLFW.DOMToGLFWKeyCode(keyCode);
    if (key == -1) return;
    var repeat = status && GLFW.active.keys[key];
    GLFW.active.keys[key] = status;
    GLFW.active.domKeys[keyCode] = status;
    if (GLFW.active.keyFunc) {
      if (repeat) status = 2;
      // GLFW_REPEAT
      getWasmTableEntry(GLFW.active.keyFunc)(GLFW.active.id, key, keyCode, status, GLFW.getModBits(GLFW.active));
    }
  },
  onGamepadConnected: event => {
    GLFW.refreshJoysticks();
  },
  onGamepadDisconnected: event => {
    GLFW.refreshJoysticks();
  },
  onKeydown: event => {
    GLFW.onKeyChanged(event.keyCode, 1);
    // GLFW_PRESS or GLFW_REPEAT
    // This logic comes directly from the sdl implementation. We cannot
    // call preventDefault on all keydown events otherwise onKeyPress will
    // not get called
    if (event.key == "Backspace" || event.key == "Tab") {
      event.preventDefault();
    }
  },
  onKeyup: event => {
    GLFW.onKeyChanged(event.keyCode, 0);
  },
  onBlur: event => {
    if (!GLFW.active) return;
    for (var i = 0; i < GLFW.active.domKeys.length; ++i) {
      if (GLFW.active.domKeys[i]) {
        GLFW.onKeyChanged(i, 0);
      }
    }
  },
  onMousemove: event => {
    if (!GLFW.active) return;
    if (event.type === "touchmove") {
      // Handling for touch events that are being converted to mouse input.
      // Don't let the browser fire a duplicate mouse event.
      event.preventDefault();
      let primaryChanged = false;
      for (let i of event.changedTouches) {
        // If our chosen primary touch moved, update Browser mouse coords
        if (GLFW.primaryTouchId === i.identifier) {
          Browser.setMouseCoords(i.pageX, i.pageY);
          primaryChanged = true;
          break;
        }
      }
      if (!primaryChanged) {
        // Do not send mouse events if some touch other than the primary triggered this.
        return;
      }
    } else {
      // Handling for non-touch mouse input events.
      Browser.calculateMouseEvent(event);
    }
    if (event.target != Browser.getCanvas() || !GLFW.active.cursorPosFunc) return;
    if (GLFW.active.cursorPosFunc) {
      getWasmTableEntry(GLFW.active.cursorPosFunc)(GLFW.active.id, Browser.mouseX, Browser.mouseY);
    }
  },
  DOMToGLFWMouseButton: event => {
    // DOM and glfw have different button codes.
    // See http://www.w3schools.com/jsref/event_button.asp.
    var eventButton = event["button"];
    if (eventButton > 0) {
      if (eventButton == 1) {
        eventButton = 2;
      } else {
        eventButton = 1;
      }
    }
    return eventButton;
  },
  onMouseenter: event => {
    if (!GLFW.active) return;
    if (event.target != Browser.getCanvas()) return;
    if (GLFW.active.cursorEnterFunc) {
      getWasmTableEntry(GLFW.active.cursorEnterFunc)(GLFW.active.id, 1);
    }
  },
  onMouseleave: event => {
    if (!GLFW.active) return;
    if (event.target != Browser.getCanvas()) return;
    if (GLFW.active.cursorEnterFunc) {
      getWasmTableEntry(GLFW.active.cursorEnterFunc)(GLFW.active.id, 0);
    }
  },
  onMouseButtonChanged: (event, status) => {
    if (!GLFW.active) return;
    if (event.target != Browser.getCanvas()) return;
    // Is this from a touch event?
    const isTouchType = event.type === "touchstart" || event.type === "touchend" || event.type === "touchcancel";
    // Only emulating mouse left-click behavior for touches.
    let eventButton = 0;
    if (isTouchType) {
      // Handling for touch events that are being converted to mouse input.
      // Don't let the browser fire a duplicate mouse event.
      event.preventDefault();
      let primaryChanged = false;
      // Set a primary touch if we have none.
      if (GLFW.primaryTouchId === null && event.type === "touchstart" && event.targetTouches.length > 0) {
        // Pick the first touch that started in the canvas and treat it as primary.
        const chosenTouch = event.targetTouches[0];
        GLFW.primaryTouchId = chosenTouch.identifier;
        Browser.setMouseCoords(chosenTouch.pageX, chosenTouch.pageY);
        primaryChanged = true;
      } else if (event.type === "touchend" || event.type === "touchcancel") {
        // Clear the primary touch if it ended.
        for (let i of event.changedTouches) {
          // If our chosen primary touch ended, remove it.
          if (GLFW.primaryTouchId === i.identifier) {
            GLFW.primaryTouchId = null;
            primaryChanged = true;
            break;
          }
        }
      }
      if (!primaryChanged) {
        // Do not send mouse events if some touch other than the primary triggered this.
        return;
      }
    } else {
      // Handling for non-touch mouse input events.
      Browser.calculateMouseEvent(event);
      eventButton = GLFW.DOMToGLFWMouseButton(event);
    }
    if (status == 1) {
      // GLFW_PRESS
      GLFW.active.buttons |= (1 << eventButton);
      try {
        event.target.setCapture();
      } catch (e) {}
    } else {
      // GLFW_RELEASE
      GLFW.active.buttons &= ~(1 << eventButton);
    }
    // Send mouse event to GLFW.
    if (GLFW.active.mouseButtonFunc) {
      getWasmTableEntry(GLFW.active.mouseButtonFunc)(GLFW.active.id, eventButton, status, GLFW.getModBits(GLFW.active));
    }
  },
  onMouseButtonDown: event => {
    if (!GLFW.active) return;
    GLFW.onMouseButtonChanged(event, 1);
  },
  onMouseButtonUp: event => {
    if (!GLFW.active) return;
    GLFW.onMouseButtonChanged(event, 0);
  },
  onMouseWheel: event => {
    // Note the minus sign that flips browser wheel direction (positive direction scrolls page down) to native wheel direction (positive direction is mouse wheel up)
    var delta = -Browser.getMouseWheelDelta(event);
    delta = (delta == 0) ? 0 : (delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1));
    // Quantize to integer so that minimum scroll is at least +/- 1.
    GLFW.wheelPos += delta;
    if (!GLFW.active || !GLFW.active.scrollFunc || event.target != Browser.getCanvas()) return;
    var sx = 0;
    var sy = delta;
    if (event.type == "mousewheel") {
      sx = event.wheelDeltaX;
    } else {
      sx = event.deltaX;
    }
    getWasmTableEntry(GLFW.active.scrollFunc)(GLFW.active.id, sx, sy);
    event.preventDefault();
  },
  onCanvasResize: (width, height, framebufferWidth, framebufferHeight) => {
    if (!GLFW.active) return;
    var resizeNeeded = false;
    // If the client is requesting fullscreen mode
    if (getFullscreenElement()) {
      if (!GLFW.active.fullscreen) {
        resizeNeeded = width != screen.width || height != screen.height;
        GLFW.active.storedX = GLFW.active.x;
        GLFW.active.storedY = GLFW.active.y;
        GLFW.active.storedWidth = GLFW.active.width;
        GLFW.active.storedHeight = GLFW.active.height;
        GLFW.active.x = GLFW.active.y = 0;
        GLFW.active.width = screen.width;
        GLFW.active.height = screen.height;
        GLFW.active.fullscreen = true;
      }
    } else if (GLFW.active.fullscreen == true) {
      resizeNeeded = width != GLFW.active.storedWidth || height != GLFW.active.storedHeight;
      GLFW.active.x = GLFW.active.storedX;
      GLFW.active.y = GLFW.active.storedY;
      GLFW.active.width = GLFW.active.storedWidth;
      GLFW.active.height = GLFW.active.storedHeight;
      GLFW.active.fullscreen = false;
    }
    if (resizeNeeded) {
      // width or height is changed (fullscreen / exit fullscreen) which will call this listener back
      // with proper framebufferWidth/framebufferHeight
      Browser.setCanvasSize(GLFW.active.width, GLFW.active.height);
    } else if (GLFW.active.width != width || GLFW.active.height != height || GLFW.active.framebufferWidth != framebufferWidth || GLFW.active.framebufferHeight != framebufferHeight) {
      GLFW.active.width = width;
      GLFW.active.height = height;
      GLFW.active.framebufferWidth = framebufferWidth;
      GLFW.active.framebufferHeight = framebufferHeight;
      GLFW.onWindowSizeChanged();
      GLFW.onFramebufferSizeChanged();
    }
  },
  onWindowSizeChanged: () => {
    if (!GLFW.active) return;
    if (GLFW.active.windowSizeFunc) {
      getWasmTableEntry(GLFW.active.windowSizeFunc)(GLFW.active.id, GLFW.active.width, GLFW.active.height);
    }
  },
  onFramebufferSizeChanged: () => {
    if (!GLFW.active) return;
    if (GLFW.active.framebufferSizeFunc) {
      getWasmTableEntry(GLFW.active.framebufferSizeFunc)(GLFW.active.id, GLFW.active.framebufferWidth, GLFW.active.framebufferHeight);
    }
  },
  onWindowContentScaleChanged: scale => {
    GLFW.scale = scale;
    if (!GLFW.active) return;
    if (GLFW.active.windowContentScaleFunc) {
      getWasmTableEntry(GLFW.active.windowContentScaleFunc)(GLFW.active.id, GLFW.scale, GLFW.scale);
    }
  },
  getTime: () => _emscripten_get_now() / 1e3,
  setWindowTitle: (winid, title) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    win.title = title;
    if (GLFW.active.id == win.id) {
      _emscripten_set_window_title(title);
    }
  },
  setJoystickCallback: cbfun => {
    var prevcbfun = GLFW.joystickFunc;
    GLFW.joystickFunc = cbfun;
    GLFW.refreshJoysticks();
    return prevcbfun;
  },
  joys: {},
  lastGamepadState: [],
  lastGamepadStateFrame: null,
  refreshJoysticks: () => {
    // Produce a new Gamepad API sample if we are ticking a new game frame, or if not using emscripten_set_main_loop() at all to drive animation.
    if (MainLoop.currentFrameNumber !== GLFW.lastGamepadStateFrame || !MainLoop.currentFrameNumber) {
      GLFW.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads || []);
      GLFW.lastGamepadStateFrame = MainLoop.currentFrameNumber;
      for (var joy = 0; joy < GLFW.lastGamepadState.length; ++joy) {
        var gamepad = GLFW.lastGamepadState[joy];
        if (gamepad) {
          if (!GLFW.joys[joy]) {
            out("glfw joystick connected:", joy);
            GLFW.joys[joy] = {
              id: stringToNewUTF8(gamepad.id),
              buttonsCount: gamepad.buttons.length,
              axesCount: gamepad.axes.length,
              buttons: _malloc(gamepad.buttons.length),
              axes: _malloc(gamepad.axes.length * 4)
            };
            if (GLFW.joystickFunc) {
              getWasmTableEntry(GLFW.joystickFunc)(joy, 262145);
            }
          }
          var data = GLFW.joys[joy];
          for (var i = 0; i < gamepad.buttons.length; ++i) {
            (growMemViews(), HEAP8)[data.buttons + i] = gamepad.buttons[i].pressed;
          }
          for (var i = 0; i < gamepad.axes.length; ++i) {
            (growMemViews(), HEAPF32)[((data.axes + i * 4) >> 2)] = gamepad.axes[i];
          }
        } else {
          if (GLFW.joys[joy]) {
            out("glfw joystick disconnected", joy);
            if (GLFW.joystickFunc) {
              getWasmTableEntry(GLFW.joystickFunc)(joy, 262146);
            }
            _free(GLFW.joys[joy].id);
            _free(GLFW.joys[joy].buttons);
            _free(GLFW.joys[joy].axes);
            delete GLFW.joys[joy];
          }
        }
      }
    }
  },
  setKeyCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.keyFunc;
    win.keyFunc = cbfun;
    return prevcbfun;
  },
  setCharCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.charFunc;
    win.charFunc = cbfun;
    return prevcbfun;
  },
  setMouseButtonCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.mouseButtonFunc;
    win.mouseButtonFunc = cbfun;
    return prevcbfun;
  },
  setCursorPosCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.cursorPosFunc;
    win.cursorPosFunc = cbfun;
    return prevcbfun;
  },
  setScrollCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.scrollFunc;
    win.scrollFunc = cbfun;
    return prevcbfun;
  },
  setDropCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.dropFunc;
    win.dropFunc = cbfun;
    return prevcbfun;
  },
  onDrop: event => {
    if (!GLFW.active || !GLFW.active.dropFunc) return;
    if (!event.dataTransfer || !event.dataTransfer.files || event.dataTransfer.files.length == 0) return;
    event.preventDefault();
    var filenames = _malloc(event.dataTransfer.files.length * 4);
    var filenamesArray = [];
    var count = event.dataTransfer.files.length;
    // Read and save the files to emscripten's FS
    var written = 0;
    var drop_dir = ".glfw_dropped_files";
    FS.createPath("/", drop_dir);
    function save(file) {
      var path = "/" + drop_dir + "/" + file.name.replace(/\//g, "_");
      var reader = new FileReader;
      reader.onloadend = e => {
        if (reader.readyState != 2) {
          // not DONE
          ++written;
          out("failed to read dropped file: " + file.name + ": " + reader.error);
          return;
        }
        var data = e.target.result;
        FS.writeFile(path, new Uint8Array(data));
        if (++written === count) {
          getWasmTableEntry(GLFW.active.dropFunc)(GLFW.active.id, count, filenames);
          for (var i = 0; i < filenamesArray.length; ++i) {
            _free(filenamesArray[i]);
          }
          _free(filenames);
        }
      };
      reader.readAsArrayBuffer(file);
      var filename = stringToNewUTF8(path);
      filenamesArray.push(filename);
      (growMemViews(), HEAPU32)[(((filenames) + (i * 4)) >> 2)] = filename;
    }
    for (var i = 0; i < count; ++i) {
      save(event.dataTransfer.files[i]);
    }
    return false;
  },
  onDragover: event => {
    if (!GLFW.active || !GLFW.active.dropFunc) return;
    event.preventDefault();
    return false;
  },
  setWindowSizeCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.windowSizeFunc;
    win.windowSizeFunc = cbfun;
    return prevcbfun;
  },
  setWindowCloseCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.windowCloseFunc;
    win.windowCloseFunc = cbfun;
    return prevcbfun;
  },
  setWindowRefreshCallback: (winid, cbfun) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return null;
    var prevcbfun = win.windowRefreshFunc;
    win.windowRefreshFunc = cbfun;
    return prevcbfun;
  },
  onClickRequestPointerLock: e => {
    var canvas = Browser.getCanvas();
    if (!Browser.pointerLock && canvas.requestPointerLock) {
      canvas.requestPointerLock();
      e.preventDefault();
    }
  },
  setInputMode: (winid, mode, value) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    switch (mode) {
     case 208897:
      {
        // GLFW_CURSOR
        var canvas = Browser.getCanvas();
        switch (value) {
         case 212993:
          {
            // GLFW_CURSOR_NORMAL
            win.inputModes[mode] = value;
            canvas.removeEventListener("click", GLFW.onClickRequestPointerLock, true);
            document.exitPointerLock();
            break;
          }

         case 212994:
          {
            // GLFW_CURSOR_HIDDEN
            err("glfwSetInputMode called with GLFW_CURSOR_HIDDEN value not implemented");
            break;
          }

         case 212995:
          {
            // GLFW_CURSOR_DISABLED
            win.inputModes[mode] = value;
            canvas.addEventListener("click", GLFW.onClickRequestPointerLock, true);
            canvas.requestPointerLock();
            break;
          }

         default:
          {
            err(`glfwSetInputMode called with unknown value parameter value: ${value}`);
            break;
          }
        }
        break;
      }

     case 208898:
      {
        // GLFW_STICKY_KEYS
        err("glfwSetInputMode called with GLFW_STICKY_KEYS mode not implemented");
        break;
      }

     case 208899:
      {
        // GLFW_STICKY_MOUSE_BUTTONS
        err("glfwSetInputMode called with GLFW_STICKY_MOUSE_BUTTONS mode not implemented");
        break;
      }

     case 208900:
      {
        // GLFW_LOCK_KEY_MODS
        err("glfwSetInputMode called with GLFW_LOCK_KEY_MODS mode not implemented");
        break;
      }

     case 3342341:
      {
        // GLFW_RAW_MOUSE_MOTION
        err("glfwSetInputMode called with GLFW_RAW_MOUSE_MOTION mode not implemented");
        break;
      }

     default:
      {
        err(`glfwSetInputMode called with unknown mode parameter value: ${mode}`);
        break;
      }
    }
  },
  getKey: (winid, key) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return 0;
    return win.keys[key];
  },
  getMouseButton: (winid, button) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return 0;
    return (win.buttons & (1 << button)) > 0;
  },
  getCursorPos: (winid, x, y) => {
    (growMemViews(), HEAPF64)[((x) >> 3)] = Browser.mouseX;
    (growMemViews(), HEAPF64)[((y) >> 3)] = Browser.mouseY;
  },
  getMousePos: (winid, x, y) => {
    (growMemViews(), HEAP32)[((x) >> 2)] = Browser.mouseX;
    (growMemViews(), HEAP32)[((y) >> 2)] = Browser.mouseY;
  },
  setCursorPos: (winid, x, y) => {},
  getWindowPos: (winid, x, y) => {
    var wx = 0;
    var wy = 0;
    var win = GLFW.WindowFromId(winid);
    if (win) {
      wx = win.x;
      wy = win.y;
    }
    if (x) {
      (growMemViews(), HEAP32)[((x) >> 2)] = wx;
    }
    if (y) {
      (growMemViews(), HEAP32)[((y) >> 2)] = wy;
    }
  },
  setWindowPos: (winid, x, y) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    win.x = x;
    win.y = y;
  },
  getWindowSize: (winid, width, height) => {
    var ww = 0;
    var wh = 0;
    var win = GLFW.WindowFromId(winid);
    if (win) {
      ww = win.width;
      wh = win.height;
    }
    if (width) {
      (growMemViews(), HEAP32)[((width) >> 2)] = ww;
    }
    if (height) {
      (growMemViews(), HEAP32)[((height) >> 2)] = wh;
    }
  },
  setWindowSize: (winid, width, height) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    if (GLFW.active.id == win.id) {
      Browser.setCanvasSize(width, height);
    }
  },
  defaultWindowHints: () => {
    GLFW.hints = {
      ...GLFW.defaultHints
    };
  },
  createWindow: (width, height, title, monitor, share) => {
    var i, id;
    for (i = 0; i < GLFW.windows.length && GLFW.windows[i] !== null; i++) {}
    if (i > 0) abort("glfwCreateWindow only supports one window at time currently");
    // id for window
    id = i + 1;
    // not valid
    if (width <= 0 || height <= 0) return 0;
    if (monitor) {
      Browser.requestFullscreen();
    } else {
      Browser.setCanvasSize(width, height);
    }
    // Create context when there are no existing alive windows
    for (i = 0; i < GLFW.windows.length && GLFW.windows[i] == null; i++) {}
    const canvas = Browser.getCanvas();
    var useWebGL = GLFW.hints[139265] > 0;
    // Use WebGL when we are told to based on GLFW_CLIENT_API
    if (i == GLFW.windows.length) {
      if (useWebGL) {
        var contextAttributes = {
          antialias: (GLFW.hints[135181] > 1),
          // GLFW_SAMPLES
          depth: (GLFW.hints[135173] > 0),
          // GLFW_DEPTH_BITS
          stencil: (GLFW.hints[135174] > 0),
          // GLFW_STENCIL_BITS
          alpha: (GLFW.hints[135172] > 0)
        };
        Browser.createContext(canvas, /*useWebGL=*/ true, /*setInModule=*/ true, contextAttributes);
      } else {
        Browser.init();
      }
    }
    // If context creation failed, do not return a valid window
    if (!Module["ctx"] && useWebGL) return 0;
    // Initializes the framebuffer size from the canvas
    var win = new GLFW_Window(id, width, height, canvas.width, canvas.height, title, monitor, share);
    // Set window to array
    if (id - 1 == GLFW.windows.length) {
      GLFW.windows.push(win);
    } else {
      GLFW.windows[id - 1] = win;
    }
    GLFW.active = win;
    GLFW.adjustCanvasDimensions();
    return win.id;
  },
  destroyWindow: winid => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    if (win.windowCloseFunc) {
      getWasmTableEntry(win.windowCloseFunc)(win.id);
    }
    GLFW.windows[win.id - 1] = null;
    if (GLFW.active.id == win.id) {
      GLFW.active = null;
    }
    // Destroy context when no alive windows
    for (win of GLFW.windows) {
      if (win !== null) return;
    }
    delete Module["ctx"];
  },
  swapBuffers: winid => {},
  requestFullscreen(lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer == "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas == "undefined") Browser.resizeCanvas = false;
    var canvas = Browser.getCanvas();
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (getFullscreenElement() === canvasContainer) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
          Browser.updateResizeListeners();
        }
      } else {
        // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
          Browser.updateResizeListeners();
        }
      }
      Module["onFullScreen"]?.(Browser.isFullscreen);
      Module["onFullscreen"]?.(Browser.isFullscreen);
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange, false);
      document.addEventListener("mozfullscreenchange", fullscreenChange, false);
      document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
      document.addEventListener("MSFullscreenChange", fullscreenChange, false);
    }
    // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
    canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? () => canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null) || (canvasContainer["webkitRequestFullScreen"] ? () => canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"]) : null);
    canvasContainer.requestFullscreen();
  },
  updateCanvasDimensions(canvas, wNative, hNative) {
    const scale = GLFW.getHiDPIScale();
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
      if (w / h < Module["forcedAspectRatio"]) {
        w = Math.round(h * Module["forcedAspectRatio"]);
      } else {
        h = Math.round(w / Module["forcedAspectRatio"]);
      }
    }
    if ((getFullscreenElement() === canvas.parentNode) && (typeof screen != "undefined")) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      wNative = w;
      hNative = h;
    }
    const wNativeScaled = Math.floor(wNative * scale);
    const hNativeScaled = Math.floor(hNative * scale);
    if (canvas.width != wNativeScaled) canvas.width = wNativeScaled;
    if (canvas.height != hNativeScaled) canvas.height = hNativeScaled;
    if (typeof canvas.style != "undefined") {
      if (!GLFW.isCSSScalingEnabled()) {
        canvas.style.setProperty("width", wNative + "px", "important");
        canvas.style.setProperty("height", hNative + "px", "important");
      } else {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    }
  },
  calculateMouseCoords(pageX, pageY) {
    // Calculate the movement based on the changes
    // in the coordinates.
    const rect = Browser.getCanvas().getBoundingClientRect();
    // Neither .scrollX or .pageXOffset are defined in a spec, but
    // we prefer .scrollX because it is currently in a spec draft.
    // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
    var scrollX = ((typeof window.scrollX != "undefined") ? window.scrollX : window.pageXOffset);
    var scrollY = ((typeof window.scrollY != "undefined") ? window.scrollY : window.pageYOffset);
    var adjustedX = pageX - (scrollX + rect.left);
    var adjustedY = pageY - (scrollY + rect.top);
    // getBoundingClientRect() returns dimension affected by CSS, so as a result:
    // - when CSS scaling is enabled, this will fix the mouse coordinates to match the width/height of the window
    // - otherwise the CSS width/height are forced to the width/height of the GLFW window (see updateCanvasDimensions),
    //   so there is no need to adjust the position
    if (GLFW.isCSSScalingEnabled() && GLFW.active) {
      adjustedX = adjustedX * (GLFW.active.width / rect.width);
      adjustedY = adjustedY * (GLFW.active.height / rect.height);
    }
    return {
      x: adjustedX,
      y: adjustedY
    };
  },
  setWindowAttrib: (winid, attrib, value) => {
    var win = GLFW.WindowFromId(winid);
    if (!win) return;
    const isHiDPIAware = GLFW.isHiDPIAware();
    win.attributes[attrib] = value;
    if (isHiDPIAware !== GLFW.isHiDPIAware()) GLFW.adjustCanvasDimensions();
  },
  getDevicePixelRatio() {
    return (typeof devicePixelRatio == "number" && devicePixelRatio) || 1;
  },
  isHiDPIAware() {
    if (GLFW.active) return GLFW.active.attributes[139276] > 0; else return false;
  },
  isCSSScalingEnabled() {
    return !GLFW.isHiDPIAware();
  },
  adjustCanvasDimensions() {
    if (GLFW.active) {
      Browser.updateCanvasDimensions(Browser.getCanvas(), GLFW.active.width, GLFW.active.height);
      Browser.updateResizeListeners();
    }
  },
  getHiDPIScale() {
    return GLFW.isHiDPIAware() ? GLFW.scale : 1;
  },
  onDevicePixelRatioChange() {
    GLFW.onWindowContentScaleChanged(GLFW.getDevicePixelRatio());
    GLFW.adjustCanvasDimensions();
  },
  GLFW2ParamToGLFW3Param: param => {
    var table = {
      196609: 0,
      // GLFW_MOUSE_CURSOR
      196610: 0,
      // GLFW_STICKY_KEYS
      196611: 0,
      // GLFW_STICKY_MOUSE_BUTTONS
      196612: 0,
      // GLFW_SYSTEM_KEYS
      196613: 0,
      // GLFW_KEY_REPEAT
      196614: 0,
      // GLFW_AUTO_POLL_EVENTS
      131073: 0,
      // GLFW_OPENED
      131074: 0,
      // GLFW_ACTIVE
      131075: 0,
      // GLFW_ICONIFIED
      131076: 0,
      // GLFW_ACCELERATED
      131077: 135169,
      // GLFW_RED_BITS
      131078: 135170,
      // GLFW_GREEN_BITS
      131079: 135171,
      // GLFW_BLUE_BITS
      131080: 135172,
      // GLFW_ALPHA_BITS
      131081: 135173,
      // GLFW_DEPTH_BITS
      131082: 135174,
      // GLFW_STENCIL_BITS
      131083: 135183,
      // GLFW_REFRESH_RATE
      131084: 135175,
      // GLFW_ACCUM_RED_BITS
      131085: 135176,
      // GLFW_ACCUM_GREEN_BITS
      131086: 135177,
      // GLFW_ACCUM_BLUE_BITS
      131087: 135178,
      // GLFW_ACCUM_ALPHA_BITS
      131088: 135179,
      // GLFW_AUX_BUFFERS
      131089: 135180,
      // GLFW_STEREO
      131090: 0,
      // GLFW_WINDOW_NO_RESIZE
      131091: 135181,
      // GLFW_FSAA_SAMPLES
      131092: 139266,
      // GLFW_OPENGL_VERSION_MAJOR
      131093: 139267,
      // GLFW_OPENGL_VERSION_MINOR
      131094: 139270,
      // GLFW_OPENGL_FORWARD_COMPAT
      131095: 139271,
      // GLFW_OPENGL_DEBUG_CONTEXT
      131096: 139272
    };
    return table[param];
  }
};

var _glfwCreateWindow = (width, height, title, monitor, share) => GLFW.createWindow(width, height, title, monitor, share);

var _glfwGetFramebufferSize = (winid, width, height) => {
  var ww = 0;
  var wh = 0;
  var win = GLFW.WindowFromId(winid);
  if (win) {
    ww = win.framebufferWidth;
    wh = win.framebufferHeight;
  }
  if (width) {
    (growMemViews(), HEAP32)[((width) >> 2)] = ww;
  }
  if (height) {
    (growMemViews(), HEAP32)[((height) >> 2)] = wh;
  }
};

var _glfwGetMouseButton = (winid, button) => GLFW.getMouseButton(winid, button);

var _glfwGetPrimaryMonitor = () => 1;

var _glfwGetVideoMode = monitor => 0;

var _glfwGetWindowContentScale = (winid, x, y) => {
  // winid doesn't matter. all windows will use same scale anyway.
  // hope i used this makeSetValue correctly
  (growMemViews(), HEAPF32)[((x) >> 2)] = GLFW.scale;
  (growMemViews(), HEAPF32)[((y) >> 2)] = GLFW.scale;
};

var _glfwGetWindowSize = (winid, width, height) => GLFW.getWindowSize(winid, width, height);

var _glfwInit = () => {
  if (GLFW.windows) return 1;
  // GL_TRUE
  GLFW.initialTime = GLFW.getTime();
  GLFW.defaultWindowHints();
  GLFW.windows = new Array;
  GLFW.active = null;
  GLFW.scale = GLFW.getDevicePixelRatio();
  window.addEventListener("gamepadconnected", GLFW.onGamepadConnected, true);
  window.addEventListener("gamepaddisconnected", GLFW.onGamepadDisconnected, true);
  window.addEventListener("keydown", GLFW.onKeydown, true);
  window.addEventListener("keypress", GLFW.onKeyPress, true);
  window.addEventListener("keyup", GLFW.onKeyup, true);
  window.addEventListener("blur", GLFW.onBlur, true);
  // watch for devicePixelRatio changes
  GLFW.devicePixelRatioMQL = window.matchMedia("(resolution: " + GLFW.getDevicePixelRatio() + "dppx)");
  GLFW.devicePixelRatioMQL.addEventListener("change", GLFW.onDevicePixelRatioChange);
  var canvas = Browser.getCanvas();
  canvas.addEventListener("touchmove", GLFW.onMousemove, true);
  canvas.addEventListener("touchstart", GLFW.onMouseButtonDown, true);
  canvas.addEventListener("touchcancel", GLFW.onMouseButtonUp, true);
  canvas.addEventListener("touchend", GLFW.onMouseButtonUp, true);
  canvas.addEventListener("mousemove", GLFW.onMousemove, true);
  canvas.addEventListener("mousedown", GLFW.onMouseButtonDown, true);
  canvas.addEventListener("mouseup", GLFW.onMouseButtonUp, true);
  canvas.addEventListener("wheel", GLFW.onMouseWheel, true);
  canvas.addEventListener("mousewheel", GLFW.onMouseWheel, true);
  canvas.addEventListener("mouseenter", GLFW.onMouseenter, true);
  canvas.addEventListener("mouseleave", GLFW.onMouseleave, true);
  canvas.addEventListener("drop", GLFW.onDrop, true);
  canvas.addEventListener("dragover", GLFW.onDragover, true);
  // Overriding implementation to account for HiDPI
  Browser.requestFullscreen = GLFW.requestFullscreen;
  Browser.calculateMouseCoords = GLFW.calculateMouseCoords;
  Browser.updateCanvasDimensions = GLFW.updateCanvasDimensions;
  Browser.resizeListeners.push((width, height) => {
    if (GLFW.isHiDPIAware()) {
      var canvas = Browser.getCanvas();
      GLFW.onCanvasResize(canvas.clientWidth, canvas.clientHeight, width, height);
    } else {
      GLFW.onCanvasResize(width, height, width, height);
    }
  });
  return 1;
};

var _glfwMakeContextCurrent = winid => 0;

var _glfwPollEvents = () => 0;

var _glfwSetCharCallback = (winid, cbfun) => GLFW.setCharCallback(winid, cbfun);

var _glfwSetCursorPosCallback = (winid, cbfun) => GLFW.setCursorPosCallback(winid, cbfun);

var _glfwSetErrorCallback = cbfun => {
  var prevcbfun = GLFW.errorFunc;
  GLFW.errorFunc = cbfun;
  return prevcbfun;
};

var _glfwSetFramebufferSizeCallback = (winid, cbfun) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return null;
  var prevcbfun = win.framebufferSizeFunc;
  win.framebufferSizeFunc = cbfun;
  return prevcbfun;
};

var _glfwSetInputMode = (winid, mode, value) => {
  GLFW.setInputMode(winid, mode, value);
};

var _glfwSetKeyCallback = (winid, cbfun) => GLFW.setKeyCallback(winid, cbfun);

var _glfwSetMouseButtonCallback = (winid, cbfun) => GLFW.setMouseButtonCallback(winid, cbfun);

var _glfwSetScrollCallback = (winid, cbfun) => GLFW.setScrollCallback(winid, cbfun);

var _glfwSetWindowCloseCallback = (winid, cbfun) => GLFW.setWindowCloseCallback(winid, cbfun);

var _glfwSetWindowFocusCallback = (winid, cbfun) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return null;
  var prevcbfun = win.windowFocusFunc;
  win.windowFocusFunc = cbfun;
  return prevcbfun;
};

var _glfwSetWindowIconifyCallback = (winid, cbfun) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return null;
  var prevcbfun = win.windowIconifyFunc;
  win.windowIconifyFunc = cbfun;
  return prevcbfun;
};

var _glfwSetWindowPosCallback = (winid, cbfun) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return null;
  var prevcbfun = win.windowPosFunc;
  win.windowPosFunc = cbfun;
  return prevcbfun;
};

var _glfwSetWindowShouldClose = (winid, value) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return;
  win.shouldClose = value;
};

var _glfwSetWindowSize = (winid, width, height) => GLFW.setWindowSize(winid, width, height);

var _glfwSetWindowSizeCallback = (winid, cbfun) => GLFW.setWindowSizeCallback(winid, cbfun);

var _glfwSetWindowSizeLimits = (winid, minwidth, minheight, maxwidth, maxheight) => 0;

var _glfwSetWindowUserPointer = (winid, ptr) => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return;
  win.userptr = ptr;
};

var _glfwSwapBuffers = winid => GLFW.swapBuffers(winid);

var _glfwTerminate = () => {
  window.removeEventListener("gamepadconnected", GLFW.onGamepadConnected, true);
  window.removeEventListener("gamepaddisconnected", GLFW.onGamepadDisconnected, true);
  window.removeEventListener("keydown", GLFW.onKeydown, true);
  window.removeEventListener("keypress", GLFW.onKeyPress, true);
  window.removeEventListener("keyup", GLFW.onKeyup, true);
  window.removeEventListener("blur", GLFW.onBlur, true);
  var canvas = Browser.getCanvas();
  canvas.removeEventListener("touchmove", GLFW.onMousemove, true);
  canvas.removeEventListener("touchstart", GLFW.onMouseButtonDown, true);
  canvas.removeEventListener("touchcancel", GLFW.onMouseButtonUp, true);
  canvas.removeEventListener("touchend", GLFW.onMouseButtonUp, true);
  canvas.removeEventListener("mousemove", GLFW.onMousemove, true);
  canvas.removeEventListener("mousedown", GLFW.onMouseButtonDown, true);
  canvas.removeEventListener("mouseup", GLFW.onMouseButtonUp, true);
  canvas.removeEventListener("wheel", GLFW.onMouseWheel, true);
  canvas.removeEventListener("mousewheel", GLFW.onMouseWheel, true);
  canvas.removeEventListener("mouseenter", GLFW.onMouseenter, true);
  canvas.removeEventListener("mouseleave", GLFW.onMouseleave, true);
  canvas.removeEventListener("drop", GLFW.onDrop, true);
  canvas.removeEventListener("dragover", GLFW.onDragover, true);
  if (GLFW.devicePixelRatioMQL) GLFW.devicePixelRatioMQL.removeEventListener("change", GLFW.onDevicePixelRatioChange);
  canvas.width = canvas.height = 1;
  GLFW.windows = null;
  GLFW.active = null;
};

var _glfwWindowHint = (target, hint) => {
  GLFW.hints[target] = hint;
};

var _glfwWindowShouldClose = winid => {
  var win = GLFW.WindowFromId(winid);
  if (!win) return 0;
  return win.shouldClose;
};

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

var getCFunc = ident => {
  var func = Module["_" + ident];
  // closure exported function
  return func;
};

var writeArrayToMemory = (array, buffer) => {
  (growMemViews(), HEAP8).set(array, buffer);
};

/**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Array=} args
     * @param {Object=} opts
     */ var ccall = (ident, returnType, argTypes, args, opts) => {
  // For fast lookup of conversion functions
  var toC = {
    "string": str => {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        // null string
        ret = stringToUTF8OnStack(str);
      }
      return ret;
    },
    "array": arr => {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };
  function convertReturnValue(ret) {
    if (returnType === "string") {
      return UTF8ToString(ret);
    }
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func(...cArgs);
  function onDone(ret) {
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }
  ret = onDone(ret);
  return ret;
};

/**
     * @param {string=} returnType
     * @param {Array=} argTypes
     * @param {Object=} opts
     */ var cwrap = (ident, returnType, argTypes, opts) => {
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean");
  var numericRet = returnType !== "string";
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return (...args) => ccall(ident, returnType, argTypes, args, opts);
};

var requestFullscreen = Browser.requestFullscreen;

var FS_createPath = (...args) => FS.createPath(...args);

var FS_unlink = (...args) => FS.unlink(...args);

var FS_createLazyFile = (...args) => FS.createLazyFile(...args);

var FS_createDevice = (...args) => FS.createDevice(...args);

PThread.init();

FS.createPreloadedFile = FS_createPreloadedFile;

FS.preloadFile = FS_preloadFile;

FS.staticInit();

Module["requestAnimationFrame"] = MainLoop.requestAnimationFrame;

Module["pauseMainLoop"] = MainLoop.pause;

Module["resumeMainLoop"] = MainLoop.resume;

MainLoop.init();

for (let i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));

Fetch.init();

// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{
  // With WASM_ESM_INTEGRATION this has to happen at the top level and not
  // delayed until processModuleArgs.
  initMemory();
  // Begin ATMODULES hooks
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["preloadPlugins"]) preloadPlugins = Module["preloadPlugins"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
  // End ATMODULES hooks
  if (Module["arguments"]) arguments_ = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
    while (Module["preInit"].length > 0) {
      Module["preInit"].shift()();
    }
  }
}

// Begin runtime exports
Module["addRunDependency"] = addRunDependency;

Module["removeRunDependency"] = removeRunDependency;

Module["ccall"] = ccall;

Module["cwrap"] = cwrap;

Module["requestFullscreen"] = requestFullscreen;

Module["FS_preloadFile"] = FS_preloadFile;

Module["FS_unlink"] = FS_unlink;

Module["FS_createPath"] = FS_createPath;

Module["FS_createDevice"] = FS_createDevice;

Module["FS_createDataFile"] = FS_createDataFile;

Module["FS_createLazyFile"] = FS_createLazyFile;

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
// proxiedFunctionTable specifies the list of functions that can be called
// either synchronously or asynchronously from other threads in postMessage()d
// or internally queued events. This way a pthread in a Worker can synchronously
// access e.g. the DOM on the main thread.
var proxiedFunctionTable = [ _proc_exit, exitOnMainThread, pthreadCreateProxied, ___syscall_chmod, ___syscall_faccessat, ___syscall_fchmod, ___syscall_fchown32, ___syscall_fcntl64, ___syscall_fstat64, ___syscall_ftruncate64, ___syscall_getcwd, ___syscall_getdents64, ___syscall_ioctl, ___syscall_lstat64, ___syscall_mkdirat, ___syscall_newfstatat, ___syscall_openat, ___syscall_pipe, ___syscall_readlinkat, ___syscall_recvfrom, ___syscall_renameat, ___syscall_rmdir, ___syscall_sendto, ___syscall_stat64, ___syscall_unlinkat, ___syscall_utimensat, __mmap_js, __munmap_js, _alDeleteBuffers, _alGetSourcei, _alIsBuffer, _alSourceStop, _alSourcei, getCanvasSizeMainThread, _emscripten_get_element_css_size, _emscripten_get_fullscreen_status, _emscripten_get_screen_size, _emscripten_set_fullscreenchange_callback_on_thread, _emscripten_set_orientationchange_callback_on_thread, _emscripten_set_touchcancel_callback_on_thread, _emscripten_set_touchend_callback_on_thread, _emscripten_set_touchmove_callback_on_thread, _emscripten_set_touchstart_callback_on_thread, _environ_get, _environ_sizes_get, _fd_close, _fd_fdstat_get, _fd_read, _fd_seek, _fd_sync, _fd_write, _emscripten_set_window_title ];

var ASM_CONSTS = {
  1034660: ($0, $1) => {
    window.alert(UTF8ToString($0) + ": " + UTF8ToString($1));
  },
  1034722: $0 => {
    window.open(UTF8ToString($0));
  },
  1034757: $0 => {
    var lang = localStorage.getItem("localization_language");
    if (lang == null) {
      stringToUTF8(window.navigator.language.replace(/-.*/, ""), $0, 16);
    } else {
      stringToUTF8(lang, $0, 16);
    }
  },
  1034946: () => (("ontouchstart" in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) ? 1 : 0,
  1035061: () => {
    document.addEventListener("click", function(event) {
      Module.ccall("axmol_onwebclickcallback");
    });
  },
  1035163: () => canvas.getBoundingClientRect().left,
  1035206: () => canvas.getBoundingClientRect().top,
  1035248: () => window.devicePixelRatio,
  1035279: ($0, $1, $2, $3, $4, $5, $6) => {
    var lines = UTF8ToString($0).split("\n");
    var fontName = UTF8ToString($1);
    var fontSize = $2;
    var color = UTF8ToString($3);
    var dimWidth = $4;
    var dimHeight = $5;
    var align = $6;
    var canvas = Module.axmolSharedCanvas = Module.axmolSharedCanvas || document.createElement("canvas");
    var context = canvas.getContext("2d", {
      willReadFrequently: true
    });
    context.font = fontSize + "px " + fontName;
    context.textBaseline = "alphabetic";
    var linesWidth = [];
    var linesAscent = [];
    var linesDescent = [];
    var totalHeight = 0;
    var maxWidth = dimWidth > 0 ? dimWidth : 0;
    var defaultAscent = 0;
    var defaultDescent = 0;
    var measureDefault = () => {
      if (defaultAscent == 0 && defaultDescent == 0) {
        var metrics = context.measureText("M");
        defaultAscent = (typeof metrics.actualBoundingBoxAscent === "number") ? metrics.actualBoundingBoxAscent : fontSize * .8;
        defaultDescent = (typeof metrics.actualBoundingBoxDescent === "number") ? metrics.actualBoundingBoxDescent : fontSize * .2;
      }
    };
    for (var i = 0; i < lines.length; i++) {
      var metrics = context.measureText(lines[i]);
      var lineWidth = metrics.width;
      var ascent = (typeof metrics.actualBoundingBoxAscent === "number") ? metrics.actualBoundingBoxAscent : fontSize * .8;
      var descent = (typeof metrics.actualBoundingBoxDescent === "number") ? metrics.actualBoundingBoxDescent : fontSize * .2;
      var lineHeight = ascent + descent;
      if (lineHeight == 0) {
        measureDefault();
        ascent = defaultAscent;
        descent = defaultDescent;
        lineHeight = ascent + descent;
      }
      linesWidth.push(lineWidth);
      linesAscent.push(ascent);
      linesDescent.push(descent);
      if (dimWidth <= 0 && lineWidth > maxWidth) {
        maxWidth = lineWidth;
      }
      totalHeight += lineHeight;
    }
    if (dimHeight > 0) {
      totalHeight = dimHeight;
    }
    var canvasWidth = Math.ceil(maxWidth);
    var canvasHeight = Math.ceil(totalHeight);
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.font = fontSize + "px " + fontName;
    context.fillStyle = color;
    context.textBaseline = "alphabetic";
    var offsetY = 0;
    if ((align & 240) === 48) {
      offsetY = (canvasHeight - totalHeight) / 2;
    } else if ((align & 240) === 32) {
      offsetY = canvasHeight - totalHeight;
    }
    for (var i = 0; i < lines.length; i++) {
      var lineH = linesAscent[i] + linesDescent[i];
      var offsetX = 0;
      if ((align & 15) === 3) {
        offsetX = (canvasWidth - linesWidth[i]) / 2;
      } else if ((align & 15) === 2) {
        offsetX = canvasWidth - linesWidth[i];
      }
      var baselineY = offsetY + linesAscent[i];
      context.fillText(lines[i], offsetX, baselineY);
      offsetY += lineH;
    }
    var data = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
    var ptr = _malloc(data.byteLength);
    var buffer = new Uint8Array(Module.HEAPU8.buffer, ptr, data.byteLength);
    buffer.set(data);
    return ptr;
  },
  1038055: () => Module.axmolSharedCanvas.width,
  1038098: () => Module.axmolSharedCanvas.height,
  1038142: () => PThread.unusedWorkers.length,
  1038178: $0 => {
    var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
    input.style.fontSize = $0 + "px";
  },
  1038314: $0 => {
    var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
    input.value = UTF8ToString($0);
  },
  1038448: ($0, $1, $2) => {
    var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
    if ($0 == 0) input.style.display = "none"; else {
      var inputMode = $1;
      var inputFlag = $2;
      switch (inputMode) {
       case 2:
       case 3:
        input.type = "number";

       default:
        if (inputFlag != 0) {
          input.type = "text";
        } else {
          input.type = "password";
        }
      }
      input.style.display = "";
      var canvas = document.getElementById("canvas");
      var inputParent = input.parentNode;
      var canvasParent = canvas.parentNode;
      if (inputParent != canvasParent) {
        if (inputParent != null) {
          inputParent.removeChild(input);
        }
        canvasParent.insertBefore(input, canvas);
      }
    }
  },
  1039080: ($0, $1, $2, $3) => {
    var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
    var canvas = Module["canvas"];
    input.style.position = "absolute";
    input.style.left = canvas.offsetLeft + $0 + "px";
    input.style.top = canvas.offsetTop + $1 + "px";
    input.style.width = $2 + "px";
    input.style.height = $3 + "px";
  },
  1039409: ($0, $1) => {
    var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
    input.value = UTF8ToString($0);
    input.maxlength = $1 != -1 ? $1 : undefined;
    input.focus();
  },
  1039603: () => {
    var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
    input.type = "text";
    input.style.position = "absolute";
    input.style.left = "0px";
    input.style.top = "0px";
    input.style.width = "200px";
    input.style.height = "30px";
    input.style.padding = " 0 0 0 0px";
    input.addEventListener("keydown", function(event) {
      if (event.key === "Backspace") {
        var cursorPosition = input.selectionStart;
        if (cursorPosition > 0) {
          var value = input.value;
          var newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
          input.value = newValue;
          input.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
        }
        return;
      }
      if (input.maxlength !== undefined && input.value.length >= input.maxlength) {
        event.preventDefault();
      }
    });
    input.addEventListener("change", function() {
      var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
      var value = input.value;
      var lengthBytes = lengthBytesUTF8(value) + 1;
      var stringOnWasmHeap = _malloc(lengthBytes);
      stringToUTF8(value, stringOnWasmHeap, lengthBytes);
      _getInputChange(stringOnWasmHeap, lengthBytes);
    });
    input.addEventListener("blur", function() {
      var input = Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
      input.style.display = "none";
      var value = input.value;
      var lengthBytes = lengthBytesUTF8(value) + 1;
      var stringOnWasmHeap = _malloc(lengthBytes);
      stringToUTF8(value, stringOnWasmHeap, lengthBytes);
      _getInputOver(stringOnWasmHeap, lengthBytes);
    });
  },
  1041132: () => {
    Module.axmolSharedInput = Module.axmolSharedInput || document.createElement("input");
  },
  1041222: $0 => {
    try {
      document.cookie = FS.readFile(UTF8ToString($0));
    } catch (e) {}
  },
  1041296: $0 => {
    FS.writeFile(UTF8ToString($0), document.cookie);
  }
};

// Imports from the Wasm binary.
var _malloc, _free, _main, _axmol_hdoc_visibilitychange, _axmol_webglcontextlost, _axmol_webglcontextrestored, _axmol_dev_pause, _axmol_dev_resume, _axmol_dev_step, _axmol_onwebclickcallback, _pthread_self, _getInputOver, _getInputChange, _ntohs, __emscripten_tls_init, _emscripten_builtin_memalign, __emscripten_run_callback_on_thread, __emscripten_thread_init, __emscripten_thread_crashed, _htonl, _htons, __emscripten_run_js_on_main_thread, __emscripten_thread_free_data, __emscripten_thread_exit, __emscripten_check_mailbox, _setThrew, _emscripten_stack_set_limits, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current;

function assignWasmExports(wasmExports) {
  _malloc = wasmExports["malloc"];
  _free = wasmExports["free"];
  Module["_main"] = _main = wasmExports["__main_argc_argv"];
  Module["_axmol_hdoc_visibilitychange"] = _axmol_hdoc_visibilitychange = wasmExports["axmol_hdoc_visibilitychange"];
  Module["_axmol_webglcontextlost"] = _axmol_webglcontextlost = wasmExports["axmol_webglcontextlost"];
  Module["_axmol_webglcontextrestored"] = _axmol_webglcontextrestored = wasmExports["axmol_webglcontextrestored"];
  Module["_axmol_dev_pause"] = _axmol_dev_pause = wasmExports["axmol_dev_pause"];
  Module["_axmol_dev_resume"] = _axmol_dev_resume = wasmExports["axmol_dev_resume"];
  Module["_axmol_dev_step"] = _axmol_dev_step = wasmExports["axmol_dev_step"];
  Module["_axmol_onwebclickcallback"] = _axmol_onwebclickcallback = wasmExports["axmol_onwebclickcallback"];
  _pthread_self = wasmExports["pthread_self"];
  Module["_getInputOver"] = _getInputOver = wasmExports["getInputOver"];
  Module["_getInputChange"] = _getInputChange = wasmExports["getInputChange"];
  _ntohs = wasmExports["ntohs"];
  __emscripten_tls_init = wasmExports["_emscripten_tls_init"];
  _emscripten_builtin_memalign = wasmExports["emscripten_builtin_memalign"];
  __emscripten_run_callback_on_thread = wasmExports["_emscripten_run_callback_on_thread"];
  __emscripten_thread_init = wasmExports["_emscripten_thread_init"];
  __emscripten_thread_crashed = wasmExports["_emscripten_thread_crashed"];
  _htonl = wasmExports["htonl"];
  _htons = wasmExports["htons"];
  __emscripten_run_js_on_main_thread = wasmExports["_emscripten_run_js_on_main_thread"];
  __emscripten_thread_free_data = wasmExports["_emscripten_thread_free_data"];
  __emscripten_thread_exit = wasmExports["_emscripten_thread_exit"];
  __emscripten_check_mailbox = wasmExports["_emscripten_check_mailbox"];
  _setThrew = wasmExports["setThrew"];
  _emscripten_stack_set_limits = wasmExports["emscripten_stack_set_limits"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
}

var wasmImports;

function assignWasmImports() {
  wasmImports = {
    /** @export */ __assert_fail: ___assert_fail,
    /** @export */ __call_sighandler: ___call_sighandler,
    /** @export */ __cxa_throw: ___cxa_throw,
    /** @export */ __pthread_create_js: ___pthread_create_js,
    /** @export */ __syscall_chmod: ___syscall_chmod,
    /** @export */ __syscall_faccessat: ___syscall_faccessat,
    /** @export */ __syscall_fchmod: ___syscall_fchmod,
    /** @export */ __syscall_fchown32: ___syscall_fchown32,
    /** @export */ __syscall_fcntl64: ___syscall_fcntl64,
    /** @export */ __syscall_fstat64: ___syscall_fstat64,
    /** @export */ __syscall_ftruncate64: ___syscall_ftruncate64,
    /** @export */ __syscall_getcwd: ___syscall_getcwd,
    /** @export */ __syscall_getdents64: ___syscall_getdents64,
    /** @export */ __syscall_ioctl: ___syscall_ioctl,
    /** @export */ __syscall_lstat64: ___syscall_lstat64,
    /** @export */ __syscall_mkdirat: ___syscall_mkdirat,
    /** @export */ __syscall_newfstatat: ___syscall_newfstatat,
    /** @export */ __syscall_openat: ___syscall_openat,
    /** @export */ __syscall_pipe: ___syscall_pipe,
    /** @export */ __syscall_readlinkat: ___syscall_readlinkat,
    /** @export */ __syscall_recvfrom: ___syscall_recvfrom,
    /** @export */ __syscall_renameat: ___syscall_renameat,
    /** @export */ __syscall_rmdir: ___syscall_rmdir,
    /** @export */ __syscall_sendto: ___syscall_sendto,
    /** @export */ __syscall_stat64: ___syscall_stat64,
    /** @export */ __syscall_unlinkat: ___syscall_unlinkat,
    /** @export */ __syscall_utimensat: ___syscall_utimensat,
    /** @export */ _abort_js: __abort_js,
    /** @export */ _emscripten_init_main_thread_js: __emscripten_init_main_thread_js,
    /** @export */ _emscripten_notify_mailbox_postmessage: __emscripten_notify_mailbox_postmessage,
    /** @export */ _emscripten_receive_on_main_thread_js: __emscripten_receive_on_main_thread_js,
    /** @export */ _emscripten_runtime_keepalive_clear: __emscripten_runtime_keepalive_clear,
    /** @export */ _emscripten_thread_cleanup: __emscripten_thread_cleanup,
    /** @export */ _emscripten_thread_mailbox_await: __emscripten_thread_mailbox_await,
    /** @export */ _emscripten_thread_set_strongref: __emscripten_thread_set_strongref,
    /** @export */ _emscripten_throw_longjmp: __emscripten_throw_longjmp,
    /** @export */ _localtime_js: __localtime_js,
    /** @export */ _mmap_js: __mmap_js,
    /** @export */ _munmap_js: __munmap_js,
    /** @export */ _tzset_js: __tzset_js,
    /** @export */ alDeleteBuffers: _alDeleteBuffers,
    /** @export */ alGetSourcei: _alGetSourcei,
    /** @export */ alIsBuffer: _alIsBuffer,
    /** @export */ alSourceStop: _alSourceStop,
    /** @export */ alSourcei: _alSourcei,
    /** @export */ clock_time_get: _clock_time_get,
    /** @export */ emscripten_asm_const_double: _emscripten_asm_const_double,
    /** @export */ emscripten_asm_const_int: _emscripten_asm_const_int,
    /** @export */ emscripten_asm_const_ptr: _emscripten_asm_const_ptr,
    /** @export */ emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
    /** @export */ emscripten_check_blocking_allowed: _emscripten_check_blocking_allowed,
    /** @export */ emscripten_date_now: _emscripten_date_now,
    /** @export */ emscripten_exit_with_live_runtime: _emscripten_exit_with_live_runtime,
    /** @export */ emscripten_fetch_free: _emscripten_fetch_free,
    /** @export */ emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
    /** @export */ emscripten_get_element_css_size: _emscripten_get_element_css_size,
    /** @export */ emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
    /** @export */ emscripten_get_heap_max: _emscripten_get_heap_max,
    /** @export */ emscripten_get_now: _emscripten_get_now,
    /** @export */ emscripten_get_screen_size: _emscripten_get_screen_size,
    /** @export */ emscripten_glActiveTexture: _emscripten_glActiveTexture,
    /** @export */ emscripten_glAttachShader: _emscripten_glAttachShader,
    /** @export */ emscripten_glBeginQuery: _emscripten_glBeginQuery,
    /** @export */ emscripten_glBeginQueryEXT: _emscripten_glBeginQueryEXT,
    /** @export */ emscripten_glBeginTransformFeedback: _emscripten_glBeginTransformFeedback,
    /** @export */ emscripten_glBindAttribLocation: _emscripten_glBindAttribLocation,
    /** @export */ emscripten_glBindBuffer: _emscripten_glBindBuffer,
    /** @export */ emscripten_glBindBufferBase: _emscripten_glBindBufferBase,
    /** @export */ emscripten_glBindBufferRange: _emscripten_glBindBufferRange,
    /** @export */ emscripten_glBindFramebuffer: _emscripten_glBindFramebuffer,
    /** @export */ emscripten_glBindRenderbuffer: _emscripten_glBindRenderbuffer,
    /** @export */ emscripten_glBindSampler: _emscripten_glBindSampler,
    /** @export */ emscripten_glBindTexture: _emscripten_glBindTexture,
    /** @export */ emscripten_glBindTransformFeedback: _emscripten_glBindTransformFeedback,
    /** @export */ emscripten_glBindVertexArray: _emscripten_glBindVertexArray,
    /** @export */ emscripten_glBindVertexArrayOES: _emscripten_glBindVertexArrayOES,
    /** @export */ emscripten_glBlendColor: _emscripten_glBlendColor,
    /** @export */ emscripten_glBlendEquation: _emscripten_glBlendEquation,
    /** @export */ emscripten_glBlendEquationSeparate: _emscripten_glBlendEquationSeparate,
    /** @export */ emscripten_glBlendFunc: _emscripten_glBlendFunc,
    /** @export */ emscripten_glBlendFuncSeparate: _emscripten_glBlendFuncSeparate,
    /** @export */ emscripten_glBlitFramebuffer: _emscripten_glBlitFramebuffer,
    /** @export */ emscripten_glBufferData: _emscripten_glBufferData,
    /** @export */ emscripten_glBufferSubData: _emscripten_glBufferSubData,
    /** @export */ emscripten_glCheckFramebufferStatus: _emscripten_glCheckFramebufferStatus,
    /** @export */ emscripten_glClear: _emscripten_glClear,
    /** @export */ emscripten_glClearBufferfi: _emscripten_glClearBufferfi,
    /** @export */ emscripten_glClearBufferfv: _emscripten_glClearBufferfv,
    /** @export */ emscripten_glClearBufferiv: _emscripten_glClearBufferiv,
    /** @export */ emscripten_glClearBufferuiv: _emscripten_glClearBufferuiv,
    /** @export */ emscripten_glClearColor: _emscripten_glClearColor,
    /** @export */ emscripten_glClearDepthf: _emscripten_glClearDepthf,
    /** @export */ emscripten_glClearStencil: _emscripten_glClearStencil,
    /** @export */ emscripten_glClientWaitSync: _emscripten_glClientWaitSync,
    /** @export */ emscripten_glClipControlEXT: _emscripten_glClipControlEXT,
    /** @export */ emscripten_glColorMask: _emscripten_glColorMask,
    /** @export */ emscripten_glCompileShader: _emscripten_glCompileShader,
    /** @export */ emscripten_glCompressedTexImage2D: _emscripten_glCompressedTexImage2D,
    /** @export */ emscripten_glCompressedTexImage3D: _emscripten_glCompressedTexImage3D,
    /** @export */ emscripten_glCompressedTexSubImage2D: _emscripten_glCompressedTexSubImage2D,
    /** @export */ emscripten_glCompressedTexSubImage3D: _emscripten_glCompressedTexSubImage3D,
    /** @export */ emscripten_glCopyBufferSubData: _emscripten_glCopyBufferSubData,
    /** @export */ emscripten_glCopyTexImage2D: _emscripten_glCopyTexImage2D,
    /** @export */ emscripten_glCopyTexSubImage2D: _emscripten_glCopyTexSubImage2D,
    /** @export */ emscripten_glCopyTexSubImage3D: _emscripten_glCopyTexSubImage3D,
    /** @export */ emscripten_glCreateProgram: _emscripten_glCreateProgram,
    /** @export */ emscripten_glCreateShader: _emscripten_glCreateShader,
    /** @export */ emscripten_glCullFace: _emscripten_glCullFace,
    /** @export */ emscripten_glDeleteBuffers: _emscripten_glDeleteBuffers,
    /** @export */ emscripten_glDeleteFramebuffers: _emscripten_glDeleteFramebuffers,
    /** @export */ emscripten_glDeleteProgram: _emscripten_glDeleteProgram,
    /** @export */ emscripten_glDeleteQueries: _emscripten_glDeleteQueries,
    /** @export */ emscripten_glDeleteQueriesEXT: _emscripten_glDeleteQueriesEXT,
    /** @export */ emscripten_glDeleteRenderbuffers: _emscripten_glDeleteRenderbuffers,
    /** @export */ emscripten_glDeleteSamplers: _emscripten_glDeleteSamplers,
    /** @export */ emscripten_glDeleteShader: _emscripten_glDeleteShader,
    /** @export */ emscripten_glDeleteSync: _emscripten_glDeleteSync,
    /** @export */ emscripten_glDeleteTextures: _emscripten_glDeleteTextures,
    /** @export */ emscripten_glDeleteTransformFeedbacks: _emscripten_glDeleteTransformFeedbacks,
    /** @export */ emscripten_glDeleteVertexArrays: _emscripten_glDeleteVertexArrays,
    /** @export */ emscripten_glDeleteVertexArraysOES: _emscripten_glDeleteVertexArraysOES,
    /** @export */ emscripten_glDepthFunc: _emscripten_glDepthFunc,
    /** @export */ emscripten_glDepthMask: _emscripten_glDepthMask,
    /** @export */ emscripten_glDepthRangef: _emscripten_glDepthRangef,
    /** @export */ emscripten_glDetachShader: _emscripten_glDetachShader,
    /** @export */ emscripten_glDisable: _emscripten_glDisable,
    /** @export */ emscripten_glDisableVertexAttribArray: _emscripten_glDisableVertexAttribArray,
    /** @export */ emscripten_glDrawArrays: _emscripten_glDrawArrays,
    /** @export */ emscripten_glDrawArraysInstanced: _emscripten_glDrawArraysInstanced,
    /** @export */ emscripten_glDrawArraysInstancedANGLE: _emscripten_glDrawArraysInstancedANGLE,
    /** @export */ emscripten_glDrawArraysInstancedARB: _emscripten_glDrawArraysInstancedARB,
    /** @export */ emscripten_glDrawArraysInstancedEXT: _emscripten_glDrawArraysInstancedEXT,
    /** @export */ emscripten_glDrawArraysInstancedNV: _emscripten_glDrawArraysInstancedNV,
    /** @export */ emscripten_glDrawBuffers: _emscripten_glDrawBuffers,
    /** @export */ emscripten_glDrawBuffersEXT: _emscripten_glDrawBuffersEXT,
    /** @export */ emscripten_glDrawBuffersWEBGL: _emscripten_glDrawBuffersWEBGL,
    /** @export */ emscripten_glDrawElements: _emscripten_glDrawElements,
    /** @export */ emscripten_glDrawElementsInstanced: _emscripten_glDrawElementsInstanced,
    /** @export */ emscripten_glDrawElementsInstancedANGLE: _emscripten_glDrawElementsInstancedANGLE,
    /** @export */ emscripten_glDrawElementsInstancedARB: _emscripten_glDrawElementsInstancedARB,
    /** @export */ emscripten_glDrawElementsInstancedEXT: _emscripten_glDrawElementsInstancedEXT,
    /** @export */ emscripten_glDrawElementsInstancedNV: _emscripten_glDrawElementsInstancedNV,
    /** @export */ emscripten_glDrawRangeElements: _emscripten_glDrawRangeElements,
    /** @export */ emscripten_glEnable: _emscripten_glEnable,
    /** @export */ emscripten_glEnableVertexAttribArray: _emscripten_glEnableVertexAttribArray,
    /** @export */ emscripten_glEndQuery: _emscripten_glEndQuery,
    /** @export */ emscripten_glEndQueryEXT: _emscripten_glEndQueryEXT,
    /** @export */ emscripten_glEndTransformFeedback: _emscripten_glEndTransformFeedback,
    /** @export */ emscripten_glFenceSync: _emscripten_glFenceSync,
    /** @export */ emscripten_glFinish: _emscripten_glFinish,
    /** @export */ emscripten_glFlush: _emscripten_glFlush,
    /** @export */ emscripten_glFramebufferRenderbuffer: _emscripten_glFramebufferRenderbuffer,
    /** @export */ emscripten_glFramebufferTexture2D: _emscripten_glFramebufferTexture2D,
    /** @export */ emscripten_glFramebufferTextureLayer: _emscripten_glFramebufferTextureLayer,
    /** @export */ emscripten_glFrontFace: _emscripten_glFrontFace,
    /** @export */ emscripten_glGenBuffers: _emscripten_glGenBuffers,
    /** @export */ emscripten_glGenFramebuffers: _emscripten_glGenFramebuffers,
    /** @export */ emscripten_glGenQueries: _emscripten_glGenQueries,
    /** @export */ emscripten_glGenQueriesEXT: _emscripten_glGenQueriesEXT,
    /** @export */ emscripten_glGenRenderbuffers: _emscripten_glGenRenderbuffers,
    /** @export */ emscripten_glGenSamplers: _emscripten_glGenSamplers,
    /** @export */ emscripten_glGenTextures: _emscripten_glGenTextures,
    /** @export */ emscripten_glGenTransformFeedbacks: _emscripten_glGenTransformFeedbacks,
    /** @export */ emscripten_glGenVertexArrays: _emscripten_glGenVertexArrays,
    /** @export */ emscripten_glGenVertexArraysOES: _emscripten_glGenVertexArraysOES,
    /** @export */ emscripten_glGenerateMipmap: _emscripten_glGenerateMipmap,
    /** @export */ emscripten_glGetActiveAttrib: _emscripten_glGetActiveAttrib,
    /** @export */ emscripten_glGetActiveUniform: _emscripten_glGetActiveUniform,
    /** @export */ emscripten_glGetActiveUniformBlockName: _emscripten_glGetActiveUniformBlockName,
    /** @export */ emscripten_glGetActiveUniformBlockiv: _emscripten_glGetActiveUniformBlockiv,
    /** @export */ emscripten_glGetActiveUniformsiv: _emscripten_glGetActiveUniformsiv,
    /** @export */ emscripten_glGetAttachedShaders: _emscripten_glGetAttachedShaders,
    /** @export */ emscripten_glGetAttribLocation: _emscripten_glGetAttribLocation,
    /** @export */ emscripten_glGetBooleanv: _emscripten_glGetBooleanv,
    /** @export */ emscripten_glGetBufferParameteri64v: _emscripten_glGetBufferParameteri64v,
    /** @export */ emscripten_glGetBufferParameteriv: _emscripten_glGetBufferParameteriv,
    /** @export */ emscripten_glGetError: _emscripten_glGetError,
    /** @export */ emscripten_glGetFloatv: _emscripten_glGetFloatv,
    /** @export */ emscripten_glGetFragDataLocation: _emscripten_glGetFragDataLocation,
    /** @export */ emscripten_glGetFramebufferAttachmentParameteriv: _emscripten_glGetFramebufferAttachmentParameteriv,
    /** @export */ emscripten_glGetInteger64i_v: _emscripten_glGetInteger64i_v,
    /** @export */ emscripten_glGetInteger64v: _emscripten_glGetInteger64v,
    /** @export */ emscripten_glGetIntegeri_v: _emscripten_glGetIntegeri_v,
    /** @export */ emscripten_glGetIntegerv: _emscripten_glGetIntegerv,
    /** @export */ emscripten_glGetInternalformativ: _emscripten_glGetInternalformativ,
    /** @export */ emscripten_glGetProgramBinary: _emscripten_glGetProgramBinary,
    /** @export */ emscripten_glGetProgramInfoLog: _emscripten_glGetProgramInfoLog,
    /** @export */ emscripten_glGetProgramiv: _emscripten_glGetProgramiv,
    /** @export */ emscripten_glGetQueryObjecti64vEXT: _emscripten_glGetQueryObjecti64vEXT,
    /** @export */ emscripten_glGetQueryObjectivEXT: _emscripten_glGetQueryObjectivEXT,
    /** @export */ emscripten_glGetQueryObjectui64vEXT: _emscripten_glGetQueryObjectui64vEXT,
    /** @export */ emscripten_glGetQueryObjectuiv: _emscripten_glGetQueryObjectuiv,
    /** @export */ emscripten_glGetQueryObjectuivEXT: _emscripten_glGetQueryObjectuivEXT,
    /** @export */ emscripten_glGetQueryiv: _emscripten_glGetQueryiv,
    /** @export */ emscripten_glGetQueryivEXT: _emscripten_glGetQueryivEXT,
    /** @export */ emscripten_glGetRenderbufferParameteriv: _emscripten_glGetRenderbufferParameteriv,
    /** @export */ emscripten_glGetSamplerParameterfv: _emscripten_glGetSamplerParameterfv,
    /** @export */ emscripten_glGetSamplerParameteriv: _emscripten_glGetSamplerParameteriv,
    /** @export */ emscripten_glGetShaderInfoLog: _emscripten_glGetShaderInfoLog,
    /** @export */ emscripten_glGetShaderPrecisionFormat: _emscripten_glGetShaderPrecisionFormat,
    /** @export */ emscripten_glGetShaderSource: _emscripten_glGetShaderSource,
    /** @export */ emscripten_glGetShaderiv: _emscripten_glGetShaderiv,
    /** @export */ emscripten_glGetString: _emscripten_glGetString,
    /** @export */ emscripten_glGetStringi: _emscripten_glGetStringi,
    /** @export */ emscripten_glGetSynciv: _emscripten_glGetSynciv,
    /** @export */ emscripten_glGetTexParameterfv: _emscripten_glGetTexParameterfv,
    /** @export */ emscripten_glGetTexParameteriv: _emscripten_glGetTexParameteriv,
    /** @export */ emscripten_glGetTransformFeedbackVarying: _emscripten_glGetTransformFeedbackVarying,
    /** @export */ emscripten_glGetUniformBlockIndex: _emscripten_glGetUniformBlockIndex,
    /** @export */ emscripten_glGetUniformIndices: _emscripten_glGetUniformIndices,
    /** @export */ emscripten_glGetUniformLocation: _emscripten_glGetUniformLocation,
    /** @export */ emscripten_glGetUniformfv: _emscripten_glGetUniformfv,
    /** @export */ emscripten_glGetUniformiv: _emscripten_glGetUniformiv,
    /** @export */ emscripten_glGetUniformuiv: _emscripten_glGetUniformuiv,
    /** @export */ emscripten_glGetVertexAttribIiv: _emscripten_glGetVertexAttribIiv,
    /** @export */ emscripten_glGetVertexAttribIuiv: _emscripten_glGetVertexAttribIuiv,
    /** @export */ emscripten_glGetVertexAttribPointerv: _emscripten_glGetVertexAttribPointerv,
    /** @export */ emscripten_glGetVertexAttribfv: _emscripten_glGetVertexAttribfv,
    /** @export */ emscripten_glGetVertexAttribiv: _emscripten_glGetVertexAttribiv,
    /** @export */ emscripten_glHint: _emscripten_glHint,
    /** @export */ emscripten_glInvalidateFramebuffer: _emscripten_glInvalidateFramebuffer,
    /** @export */ emscripten_glInvalidateSubFramebuffer: _emscripten_glInvalidateSubFramebuffer,
    /** @export */ emscripten_glIsBuffer: _emscripten_glIsBuffer,
    /** @export */ emscripten_glIsEnabled: _emscripten_glIsEnabled,
    /** @export */ emscripten_glIsFramebuffer: _emscripten_glIsFramebuffer,
    /** @export */ emscripten_glIsProgram: _emscripten_glIsProgram,
    /** @export */ emscripten_glIsQuery: _emscripten_glIsQuery,
    /** @export */ emscripten_glIsQueryEXT: _emscripten_glIsQueryEXT,
    /** @export */ emscripten_glIsRenderbuffer: _emscripten_glIsRenderbuffer,
    /** @export */ emscripten_glIsSampler: _emscripten_glIsSampler,
    /** @export */ emscripten_glIsShader: _emscripten_glIsShader,
    /** @export */ emscripten_glIsSync: _emscripten_glIsSync,
    /** @export */ emscripten_glIsTexture: _emscripten_glIsTexture,
    /** @export */ emscripten_glIsTransformFeedback: _emscripten_glIsTransformFeedback,
    /** @export */ emscripten_glIsVertexArray: _emscripten_glIsVertexArray,
    /** @export */ emscripten_glIsVertexArrayOES: _emscripten_glIsVertexArrayOES,
    /** @export */ emscripten_glLineWidth: _emscripten_glLineWidth,
    /** @export */ emscripten_glLinkProgram: _emscripten_glLinkProgram,
    /** @export */ emscripten_glPauseTransformFeedback: _emscripten_glPauseTransformFeedback,
    /** @export */ emscripten_glPixelStorei: _emscripten_glPixelStorei,
    /** @export */ emscripten_glPolygonModeWEBGL: _emscripten_glPolygonModeWEBGL,
    /** @export */ emscripten_glPolygonOffset: _emscripten_glPolygonOffset,
    /** @export */ emscripten_glPolygonOffsetClampEXT: _emscripten_glPolygonOffsetClampEXT,
    /** @export */ emscripten_glProgramBinary: _emscripten_glProgramBinary,
    /** @export */ emscripten_glProgramParameteri: _emscripten_glProgramParameteri,
    /** @export */ emscripten_glQueryCounterEXT: _emscripten_glQueryCounterEXT,
    /** @export */ emscripten_glReadBuffer: _emscripten_glReadBuffer,
    /** @export */ emscripten_glReadPixels: _emscripten_glReadPixels,
    /** @export */ emscripten_glReleaseShaderCompiler: _emscripten_glReleaseShaderCompiler,
    /** @export */ emscripten_glRenderbufferStorage: _emscripten_glRenderbufferStorage,
    /** @export */ emscripten_glRenderbufferStorageMultisample: _emscripten_glRenderbufferStorageMultisample,
    /** @export */ emscripten_glResumeTransformFeedback: _emscripten_glResumeTransformFeedback,
    /** @export */ emscripten_glSampleCoverage: _emscripten_glSampleCoverage,
    /** @export */ emscripten_glSamplerParameterf: _emscripten_glSamplerParameterf,
    /** @export */ emscripten_glSamplerParameterfv: _emscripten_glSamplerParameterfv,
    /** @export */ emscripten_glSamplerParameteri: _emscripten_glSamplerParameteri,
    /** @export */ emscripten_glSamplerParameteriv: _emscripten_glSamplerParameteriv,
    /** @export */ emscripten_glScissor: _emscripten_glScissor,
    /** @export */ emscripten_glShaderBinary: _emscripten_glShaderBinary,
    /** @export */ emscripten_glShaderSource: _emscripten_glShaderSource,
    /** @export */ emscripten_glStencilFunc: _emscripten_glStencilFunc,
    /** @export */ emscripten_glStencilFuncSeparate: _emscripten_glStencilFuncSeparate,
    /** @export */ emscripten_glStencilMask: _emscripten_glStencilMask,
    /** @export */ emscripten_glStencilMaskSeparate: _emscripten_glStencilMaskSeparate,
    /** @export */ emscripten_glStencilOp: _emscripten_glStencilOp,
    /** @export */ emscripten_glStencilOpSeparate: _emscripten_glStencilOpSeparate,
    /** @export */ emscripten_glTexImage2D: _emscripten_glTexImage2D,
    /** @export */ emscripten_glTexImage3D: _emscripten_glTexImage3D,
    /** @export */ emscripten_glTexParameterf: _emscripten_glTexParameterf,
    /** @export */ emscripten_glTexParameterfv: _emscripten_glTexParameterfv,
    /** @export */ emscripten_glTexParameteri: _emscripten_glTexParameteri,
    /** @export */ emscripten_glTexParameteriv: _emscripten_glTexParameteriv,
    /** @export */ emscripten_glTexStorage2D: _emscripten_glTexStorage2D,
    /** @export */ emscripten_glTexStorage3D: _emscripten_glTexStorage3D,
    /** @export */ emscripten_glTexSubImage2D: _emscripten_glTexSubImage2D,
    /** @export */ emscripten_glTexSubImage3D: _emscripten_glTexSubImage3D,
    /** @export */ emscripten_glTransformFeedbackVaryings: _emscripten_glTransformFeedbackVaryings,
    /** @export */ emscripten_glUniform1f: _emscripten_glUniform1f,
    /** @export */ emscripten_glUniform1fv: _emscripten_glUniform1fv,
    /** @export */ emscripten_glUniform1i: _emscripten_glUniform1i,
    /** @export */ emscripten_glUniform1iv: _emscripten_glUniform1iv,
    /** @export */ emscripten_glUniform1ui: _emscripten_glUniform1ui,
    /** @export */ emscripten_glUniform1uiv: _emscripten_glUniform1uiv,
    /** @export */ emscripten_glUniform2f: _emscripten_glUniform2f,
    /** @export */ emscripten_glUniform2fv: _emscripten_glUniform2fv,
    /** @export */ emscripten_glUniform2i: _emscripten_glUniform2i,
    /** @export */ emscripten_glUniform2iv: _emscripten_glUniform2iv,
    /** @export */ emscripten_glUniform2ui: _emscripten_glUniform2ui,
    /** @export */ emscripten_glUniform2uiv: _emscripten_glUniform2uiv,
    /** @export */ emscripten_glUniform3f: _emscripten_glUniform3f,
    /** @export */ emscripten_glUniform3fv: _emscripten_glUniform3fv,
    /** @export */ emscripten_glUniform3i: _emscripten_glUniform3i,
    /** @export */ emscripten_glUniform3iv: _emscripten_glUniform3iv,
    /** @export */ emscripten_glUniform3ui: _emscripten_glUniform3ui,
    /** @export */ emscripten_glUniform3uiv: _emscripten_glUniform3uiv,
    /** @export */ emscripten_glUniform4f: _emscripten_glUniform4f,
    /** @export */ emscripten_glUniform4fv: _emscripten_glUniform4fv,
    /** @export */ emscripten_glUniform4i: _emscripten_glUniform4i,
    /** @export */ emscripten_glUniform4iv: _emscripten_glUniform4iv,
    /** @export */ emscripten_glUniform4ui: _emscripten_glUniform4ui,
    /** @export */ emscripten_glUniform4uiv: _emscripten_glUniform4uiv,
    /** @export */ emscripten_glUniformBlockBinding: _emscripten_glUniformBlockBinding,
    /** @export */ emscripten_glUniformMatrix2fv: _emscripten_glUniformMatrix2fv,
    /** @export */ emscripten_glUniformMatrix2x3fv: _emscripten_glUniformMatrix2x3fv,
    /** @export */ emscripten_glUniformMatrix2x4fv: _emscripten_glUniformMatrix2x4fv,
    /** @export */ emscripten_glUniformMatrix3fv: _emscripten_glUniformMatrix3fv,
    /** @export */ emscripten_glUniformMatrix3x2fv: _emscripten_glUniformMatrix3x2fv,
    /** @export */ emscripten_glUniformMatrix3x4fv: _emscripten_glUniformMatrix3x4fv,
    /** @export */ emscripten_glUniformMatrix4fv: _emscripten_glUniformMatrix4fv,
    /** @export */ emscripten_glUniformMatrix4x2fv: _emscripten_glUniformMatrix4x2fv,
    /** @export */ emscripten_glUniformMatrix4x3fv: _emscripten_glUniformMatrix4x3fv,
    /** @export */ emscripten_glUseProgram: _emscripten_glUseProgram,
    /** @export */ emscripten_glValidateProgram: _emscripten_glValidateProgram,
    /** @export */ emscripten_glVertexAttrib1f: _emscripten_glVertexAttrib1f,
    /** @export */ emscripten_glVertexAttrib1fv: _emscripten_glVertexAttrib1fv,
    /** @export */ emscripten_glVertexAttrib2f: _emscripten_glVertexAttrib2f,
    /** @export */ emscripten_glVertexAttrib2fv: _emscripten_glVertexAttrib2fv,
    /** @export */ emscripten_glVertexAttrib3f: _emscripten_glVertexAttrib3f,
    /** @export */ emscripten_glVertexAttrib3fv: _emscripten_glVertexAttrib3fv,
    /** @export */ emscripten_glVertexAttrib4f: _emscripten_glVertexAttrib4f,
    /** @export */ emscripten_glVertexAttrib4fv: _emscripten_glVertexAttrib4fv,
    /** @export */ emscripten_glVertexAttribDivisor: _emscripten_glVertexAttribDivisor,
    /** @export */ emscripten_glVertexAttribDivisorANGLE: _emscripten_glVertexAttribDivisorANGLE,
    /** @export */ emscripten_glVertexAttribDivisorARB: _emscripten_glVertexAttribDivisorARB,
    /** @export */ emscripten_glVertexAttribDivisorEXT: _emscripten_glVertexAttribDivisorEXT,
    /** @export */ emscripten_glVertexAttribDivisorNV: _emscripten_glVertexAttribDivisorNV,
    /** @export */ emscripten_glVertexAttribI4i: _emscripten_glVertexAttribI4i,
    /** @export */ emscripten_glVertexAttribI4iv: _emscripten_glVertexAttribI4iv,
    /** @export */ emscripten_glVertexAttribI4ui: _emscripten_glVertexAttribI4ui,
    /** @export */ emscripten_glVertexAttribI4uiv: _emscripten_glVertexAttribI4uiv,
    /** @export */ emscripten_glVertexAttribIPointer: _emscripten_glVertexAttribIPointer,
    /** @export */ emscripten_glVertexAttribPointer: _emscripten_glVertexAttribPointer,
    /** @export */ emscripten_glViewport: _emscripten_glViewport,
    /** @export */ emscripten_glWaitSync: _emscripten_glWaitSync,
    /** @export */ emscripten_num_logical_cores: _emscripten_num_logical_cores,
    /** @export */ emscripten_random: _emscripten_random,
    /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
    /** @export */ emscripten_set_fullscreenchange_callback_on_thread: _emscripten_set_fullscreenchange_callback_on_thread,
    /** @export */ emscripten_set_main_loop: _emscripten_set_main_loop,
    /** @export */ emscripten_set_orientationchange_callback_on_thread: _emscripten_set_orientationchange_callback_on_thread,
    /** @export */ emscripten_set_touchcancel_callback_on_thread: _emscripten_set_touchcancel_callback_on_thread,
    /** @export */ emscripten_set_touchend_callback_on_thread: _emscripten_set_touchend_callback_on_thread,
    /** @export */ emscripten_set_touchmove_callback_on_thread: _emscripten_set_touchmove_callback_on_thread,
    /** @export */ emscripten_set_touchstart_callback_on_thread: _emscripten_set_touchstart_callback_on_thread,
    /** @export */ emscripten_start_fetch: _emscripten_start_fetch,
    /** @export */ environ_get: _environ_get,
    /** @export */ environ_sizes_get: _environ_sizes_get,
    /** @export */ exit: _exit,
    /** @export */ fd_close: _fd_close,
    /** @export */ fd_fdstat_get: _fd_fdstat_get,
    /** @export */ fd_read: _fd_read,
    /** @export */ fd_seek: _fd_seek,
    /** @export */ fd_sync: _fd_sync,
    /** @export */ fd_write: _fd_write,
    /** @export */ glfwCreateWindow: _glfwCreateWindow,
    /** @export */ glfwGetFramebufferSize: _glfwGetFramebufferSize,
    /** @export */ glfwGetMouseButton: _glfwGetMouseButton,
    /** @export */ glfwGetPrimaryMonitor: _glfwGetPrimaryMonitor,
    /** @export */ glfwGetVideoMode: _glfwGetVideoMode,
    /** @export */ glfwGetWindowContentScale: _glfwGetWindowContentScale,
    /** @export */ glfwGetWindowSize: _glfwGetWindowSize,
    /** @export */ glfwInit: _glfwInit,
    /** @export */ glfwMakeContextCurrent: _glfwMakeContextCurrent,
    /** @export */ glfwPollEvents: _glfwPollEvents,
    /** @export */ glfwSetCharCallback: _glfwSetCharCallback,
    /** @export */ glfwSetCursorPosCallback: _glfwSetCursorPosCallback,
    /** @export */ glfwSetErrorCallback: _glfwSetErrorCallback,
    /** @export */ glfwSetFramebufferSizeCallback: _glfwSetFramebufferSizeCallback,
    /** @export */ glfwSetInputMode: _glfwSetInputMode,
    /** @export */ glfwSetKeyCallback: _glfwSetKeyCallback,
    /** @export */ glfwSetMouseButtonCallback: _glfwSetMouseButtonCallback,
    /** @export */ glfwSetScrollCallback: _glfwSetScrollCallback,
    /** @export */ glfwSetWindowCloseCallback: _glfwSetWindowCloseCallback,
    /** @export */ glfwSetWindowFocusCallback: _glfwSetWindowFocusCallback,
    /** @export */ glfwSetWindowIconifyCallback: _glfwSetWindowIconifyCallback,
    /** @export */ glfwSetWindowPosCallback: _glfwSetWindowPosCallback,
    /** @export */ glfwSetWindowShouldClose: _glfwSetWindowShouldClose,
    /** @export */ glfwSetWindowSize: _glfwSetWindowSize,
    /** @export */ glfwSetWindowSizeCallback: _glfwSetWindowSizeCallback,
    /** @export */ glfwSetWindowSizeLimits: _glfwSetWindowSizeLimits,
    /** @export */ glfwSetWindowUserPointer: _glfwSetWindowUserPointer,
    /** @export */ glfwSwapBuffers: _glfwSwapBuffers,
    /** @export */ glfwTerminate: _glfwTerminate,
    /** @export */ glfwWindowHint: _glfwWindowHint,
    /** @export */ glfwWindowShouldClose: _glfwWindowShouldClose,
    /** @export */ invoke_ii,
    /** @export */ invoke_iii,
    /** @export */ invoke_iiii,
    /** @export */ invoke_iiiii,
    /** @export */ invoke_iiiiiii,
    /** @export */ invoke_iiiiiiiiii,
    /** @export */ invoke_vi,
    /** @export */ invoke_vii,
    /** @export */ invoke_viii,
    /** @export */ invoke_viiii,
    /** @export */ memory: wasmMemory,
    /** @export */ proc_exit: _proc_exit
  };
}

function invoke_iiii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_ii(index, a1) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vii(index, a1, a2) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iii(index, a1, a2) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_vi(index, a1) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_viiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    getWasmTableEntry(index)(a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
  var sp = stackSave();
  try {
    return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0) throw e;
    _setThrew(1, 0);
  }
}

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
function callMain(args = []) {
  var entryFunction = _main;
  args.unshift(thisProgram);
  var argc = args.length;
  var argv = stackAlloc((argc + 1) * 4);
  var argv_ptr = argv;
  args.forEach(arg => {
    (growMemViews(), HEAPU32)[((argv_ptr) >> 2)] = stringToUTF8OnStack(arg);
    argv_ptr += 4;
  });
  (growMemViews(), HEAPU32)[((argv_ptr) >> 2)] = 0;
  try {
    var ret = entryFunction(argc, argv);
    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function run(args = arguments_) {
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  if ((ENVIRONMENT_IS_PTHREAD)) {
    initRuntime();
    return;
  }
  preRun();
  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    Module["onRuntimeInitialized"]?.();
    var noInitialRun = Module["noInitialRun"] || false;
    if (!noInitialRun) callMain(args);
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(() => {
      setTimeout(() => Module["setStatus"](""), 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}

var wasmExports;

if ((!(ENVIRONMENT_IS_PTHREAD))) {
  // Call createWasm on startup if we are the main thread.
  // Worker threads call this once they receive the module via postMessage
  // With async instantation wasmExports is assigned asynchronously when the
  // instance is received.
  createWasm();
  run();
}
