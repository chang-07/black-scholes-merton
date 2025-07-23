/* eslint-disable */
var createModelModule = (() => {
  
  return (
async function(moduleArg = {}) {
  var moduleRtn;

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
var Module = moduleArg;

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).
var ENVIRONMENT_IS_WEB = true;

var ENVIRONMENT_IS_WORKER = false;

var ENVIRONMENT_IS_NODE = false;

var ENVIRONMENT_IS_SHELL = false;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
var arguments_ = [];

var thisProgram = "./this.program";

var quit_ = (status, toThrow) => {
  throw toThrow;
};

var _scriptName = import.meta.url;

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

if (ENVIRONMENT_IS_SHELL) {
  const isNode = typeof process == "object" && process.versions?.node && process.type != "renderer";
  if (isNode || typeof window == "object" || typeof WorkerGlobalScope != "undefined") throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
} else // Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL(".", _scriptName).href;
  } catch {}
  if (!(typeof window == "object" || typeof WorkerGlobalScope != "undefined")) throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");
  {
    // include: web_or_worker_shell_read.js
    readAsync = async url => {
      assert(!isFileURI(url), "readAsync does not work with file:// URLs");
      var response = await fetch(url, {
        credentials: "same-origin"
      });
      if (response.ok) {
        return response.arrayBuffer();
      }
      throw new Error(response.status + " : " + response.url);
    };
  }
} else {
  throw new Error("environment detection error");
}

var out = console.log.bind(console);

var err = console.error.bind(console);

var IDBFS = "IDBFS is no longer included by default; build with -lidbfs.js";

var PROXYFS = "PROXYFS is no longer included by default; build with -lproxyfs.js";

var WORKERFS = "WORKERFS is no longer included by default; build with -lworkerfs.js";

var FETCHFS = "FETCHFS is no longer included by default; build with -lfetchfs.js";

var ICASEFS = "ICASEFS is no longer included by default; build with -licasefs.js";

var JSFILEFS = "JSFILEFS is no longer included by default; build with -ljsfilefs.js";

var OPFS = "OPFS is no longer included by default; build with -lopfs.js";

var NODEFS = "NODEFS is no longer included by default; build with -lnodefs.js";

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message
assert(!ENVIRONMENT_IS_WORKER, "worker environment detected but not enabled at build time.  Add `worker` to `-sENVIRONMENT` to enable.");

assert(!ENVIRONMENT_IS_NODE, "node environment detected but not enabled at build time.  Add `node` to `-sENVIRONMENT` to enable.");

assert(!ENVIRONMENT_IS_SHELL, "shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");

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

if (typeof WebAssembly != "object") {
  err("no native wasm support detected");
}

// Wasm globals
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
    abort("Assertion failed" + (text ? ": " + text : ""));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _malloc() {
  abort("malloc() called but not included in the build - add `_malloc` to EXPORTED_FUNCTIONS");
}

function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort("free() called but not included in the build - add `_free` to EXPORTED_FUNCTIONS");
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */ var isFileURI = filename => filename.startsWith("file://");

// include: runtime_common.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  SAFE_HEAP_STORE(HEAPU32, ((max) >> 2), 34821223);
  SAFE_HEAP_STORE(HEAPU32, (((max) + (4)) >> 2), 2310721022);
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = SAFE_HEAP_LOAD(HEAPU32, ((max) >> 2));
  var cookie2 = SAFE_HEAP_LOAD(HEAPU32, (((max) + (4)) >> 2));
  if (cookie1 != 34821223 || cookie2 != 2310721022) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
}

// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true;

// Switch to false at runtime to disable logging at the right times
// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug != "undefined") return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 25459;
  if (h8[0] !== 115 || h8[1] !== 99) throw "Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)";
})();

function consumedModuleProp(prop) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      set() {
        abort(`Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);
      }
    });
  }
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);
}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === "FS_createPath" || name === "FS_createDataFile" || name === "FS_createPreloadedFile" || name === "FS_unlink" || name === "addRunDependency" || // The old FS has some functionality that WasmFS lacks.
  name === "FS_createLazyFile" || name === "FS_createDevice" || name === "removeRunDependency";
}

/**
 * Intercept access to a global symbol.  This enables us to give informative
 * warnings/errors when folks attempt to use symbols they did not include in
 * their build, or no symbols that no longer exist.
 */ function hookGlobalSymbolAccess(sym, func) {
  if (typeof globalThis != "undefined" && !Object.getOwnPropertyDescriptor(globalThis, sym)) {
    Object.defineProperty(globalThis, sym, {
      configurable: true,
      get() {
        func();
        return undefined;
      }
    });
  }
}

function missingGlobal(sym, msg) {
  hookGlobalSymbolAccess(sym, () => {
    warnOnce(`\`${sym}\` is not longer defined by emscripten. ${msg}`);
  });
}

missingGlobal("buffer", "Please use HEAP8.buffer or wasmMemory.buffer");

missingGlobal("asm", "Please use wasmExports instead");

function missingLibrarySymbol(sym) {
  hookGlobalSymbolAccess(sym, () => {
    // Can't `abort()` here because it would break code that does runtime
    // checks.  e.g. `if (typeof SDL === 'undefined')`.
    var msg = `\`${sym}\` is a library symbol and not included by default; add it to your library.js __deps or to DEFAULT_LIBRARY_FUNCS_TO_INCLUDE on the command line`;
    // DEFAULT_LIBRARY_FUNCS_TO_INCLUDE requires the name as it appears in
    // library.js, which means $name for a JS name with no prefix, or name
    // for a JS name like _name.
    var librarySymbol = sym;
    if (!librarySymbol.startsWith("_")) {
      librarySymbol = "$" + sym;
    }
    msg += ` (e.g. -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='${librarySymbol}')`;
    if (isExportedByForceFilesystem(sym)) {
      msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
    }
    warnOnce(msg);
  });
  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += ". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you";
        }
        abort(msg);
      }
    });
  }
}

// end include: runtime_debug.js
// include: runtime_safe_heap.js
function SAFE_HEAP_INDEX(arr, idx, action) {
  const bytes = arr.BYTES_PER_ELEMENT;
  const dest = idx * bytes;
  if (idx <= 0) abort(`segmentation fault ${action} ${bytes} bytes at address ${dest}`);
  if (runtimeInitialized) {
    var brk = _sbrk(0);
    if (dest + bytes > brk) abort(`segmentation fault, exceeded the top of the available dynamic heap when ${action} ${bytes} bytes at address ${dest}. DYNAMICTOP=${brk}`);
    if (brk < _emscripten_stack_get_base()) abort(`brk >= _emscripten_stack_get_base() (brk=${brk}, _emscripten_stack_get_base()=${_emscripten_stack_get_base()})`);
    // sbrk-managed memory must be above the stack
    if (brk > wasmMemory.buffer.byteLength) abort(`brk <= wasmMemory.buffer.byteLength (brk=${brk}, wasmMemory.buffer.byteLength=${wasmMemory.buffer.byteLength})`);
  }
  return idx;
}

function SAFE_HEAP_LOAD(arr, idx) {
  return arr[SAFE_HEAP_INDEX(arr, idx, "loading")];
}

function SAFE_HEAP_STORE(arr, idx, value) {
  return arr[SAFE_HEAP_INDEX(arr, idx, "storing")] = value;
}

function segfault() {
  abort("segmentation fault");
}

function alignfault() {
  abort("alignment fault");
}

// end include: runtime_safe_heap.js
var readyPromiseResolve, readyPromiseReject;

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
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(typeof Int32Array != "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray != undefined && Int32Array.prototype.set != undefined, "JS engine does not provide full typed array support");

function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function") Module["preRun"] = [ Module["preRun"] ];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  consumedModuleProp("preRun");
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;
  checkStackCookie();
  // No ATINITS hooks
  wasmExports["__wasm_call_ctors"]();
}

function postRun() {
  checkStackCookie();
  // PThreads reuse the runtime from the main thread.
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function") Module["postRun"] = [ Module["postRun"] ];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  consumedModuleProp("postRun");
  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
}

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;

var dependenciesFulfilled = null;

// overridden to take different actions when all run dependencies are fulfilled
var runDependencyTracking = {};

var runDependencyWatcher = null;

function addRunDependency(id) {
  runDependencies++;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (id) {
    assert(!runDependencyTracking[id]);
    runDependencyTracking[id] = 1;
    if (runDependencyWatcher === null && typeof setInterval != "undefined") {
      // Check for missing dependencies every few seconds
      runDependencyWatcher = setInterval(() => {
        if (ABORT) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
          return;
        }
        var shown = false;
        for (var dep in runDependencyTracking) {
          if (!shown) {
            shown = true;
            err("still waiting on run dependencies:");
          }
          err(`dependency: ${dep}`);
        }
        if (shown) {
          err("(end of list)");
        }
      }, 1e4);
    }
  } else {
    err("warning: run dependency added without ID");
  }
}

function removeRunDependency(id) {
  runDependencies--;
  Module["monitorRunDependencies"]?.(runDependencies);
  if (id) {
    assert(runDependencyTracking[id]);
    delete runDependencyTracking[id];
  } else {
    err("warning: run dependency removed without ID");
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}

/** @param {string|number=} what */ function abort(what) {
  Module["onAbort"]?.(what);
  what = "Aborted(" + what + ")";
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);
  ABORT = true;
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
  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// show errors on likely calls to FS when it was not included
var FS = {
  error() {
    abort("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM");
  },
  init() {
    FS.error();
  },
  createDataFile() {
    FS.error();
  },
  createPreloadedFile() {
    FS.error();
  },
  createLazyFile() {
    FS.error();
  },
  open() {
    FS.error();
  },
  mkdev() {
    FS.error();
  },
  registerDevice() {
    FS.error();
  },
  analyzePath() {
    FS.error();
  },
  ErrnoError() {
    FS.error();
  }
};

function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

var wasmBinaryFile;

function findWasmBinary() {
  return base64Decode("AGFzbQEAAAABpgEbYAJ/fwF+YAF/AX9gAABgAn9/AX9gA39/fgBgAAF/YAV8fHx8fAF8YAF8AXxgAX8AYAN/f38AYAJ/fwF8YAN/f3wAYAZ/fHx8fHwBfGAHf398fHx8fAF8YAF/AXxgA39/fwF/YAN/fn8BfmACf38BfWADf399AGABfAF/YAR/f39/AX9gBH9+f38Bf2ACf3wBfGADfH5+AXxgAAF8YAF8AGACf38AArMBBwNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAABA2VudglfYWJvcnRfanMAAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCGZkX2Nsb3NlAAEWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF93cml0ZQAUFndhc2lfc25hcHNob3RfcHJldmlldzEHZmRfc2VlawAVA2VudghzZWdmYXVsdAACA2VudgphbGlnbmZhdWx0AAIDfXwCBgcHBgYGBgwNBgwNBgwNAhYHDg4HExcYGQ4HBwcTBQUFAQIBAQEPEBABCAgIBQICBQUFAQ8IAQECCBoCAQUIAQUBAwEDAwMDAwMDAwMAAAAAAAAAAAAAAAAAAAAAERERCgoKCgkJCQkJCQQEBAQEBAQEBAQSEhILCwsLBAUBcAEEBAUHAQGCAoCAAgYSA38BQfDQBAt/AUEAC38BQQALB6cDGwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAHBGdldEMACAdub3JtY2RmAAkDZXJmAAoEZ2V0UAALBWdldGQxAAwFZ2V0ZDIADQlnZXROUHJpbWUADghnZXREZWx0YQAPCGdldEdhbW1hABEIZ2V0VGhldGEAEgdnZXRWZWdhABQGZ2V0UmhvABUHY2xlYW51cAAXBmZmbHVzaABJCHN0cmVycm9yAEsXZW1zY3JpcHRlbl9nZXRfc2Jya19wdHIAKARzYnJrACkVZW1zY3JpcHRlbl9zdGFja19pbml0ADcZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQA4GWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAORhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAOhlfZW1zY3JpcHRlbl9zdGFja19yZXN0b3JlAEYXX2Vtc2NyaXB0ZW5fc3RhY2tfYWxsb2MARxxlbXNjcmlwdGVu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AEEAQQAgAEEkEFQRDwAaIABBFBBUDQBBfyEBIAJFDQEMAgsCQCAAQQQQVCIBIABBCBBUIgNGDQAgACABIANrrEEBIABBKBBUERAAGgtBACEBIABBHEEAEHEgAEEQQgAQeyAAQQRCABB6IAINAQsgABAyCyABCx0AQQAgACAAQZkBSxtBAXRBgMkAakEAEFFBgDpqCwgAIAAgABBKCy0BAX8gACABaiECIAJBAEYgAkEBahAoKAIASyACIABJcnIEQBAFAAsgAiwAAAstAQF/IAAgAWohAiACQQBGIAJBAWoQKCgCAEsgAiAASXJyBEAQBQALIAItAAALLQEBfyAAIAFqIQIgAkEARiACQQJqECgoAgBLIAIgAElycgRAEAUACyACLgAACzcBAX8gACABaiECIAJBAEYgAkECahAoKAIASyACIABJcnIEQBAFAAsgAkEBcQRAEAYLIAIuAQALLQEBfyAAIAFqIQIgAkEARiACQQJqECgoAgBLIAIgAElycgRAEAUACyACLwAACzcBAX8gACABaiECIAJBAEYgAkECahAoKAIASyACIABJcnIEQBAFAAsgAkEBcQRAEAYLIAIvAQALLQEBfyAAIAFqIQIgAkEARiACQQRqECgoAgBLIAIgAElycgRAEAUACyACKAAACzcBAX8gACABaiECIAJBAEYgAkEEahAoKAIASyACIABJcnIEQBAFAAsgAkEBcQRAEAYLIAIoAQALNwEBfyAAIAFqIQIgAkEARiACQQRqECgoAgBLIAIgAElycgRAEAUACyACQQNxBEAQBgsgAigCAAstAQF/IAAgAWohAiACQQBGIAJBAWoQKCgCAEsgAiAASXJyBEAQBQALIAIwAAALLQEBfyAAIAFqIQIgAkEARiACQQFqECgoAgBLIAIgAElycgRAEAUACyACMQAACy0BAX8gACABaiECIAJBAEYgAkECahAoKAIASyACIABJcnIEQBAFAAsgAjIAAAs3AQF/IAAgAWohAiACQQBGIAJBAmoQKCgCAEsgAiAASXJyBEAQBQALIAJBAXEEQBAGCyACMgEACy0BAX8gACABaiECIAJBAEYgAkECahAoKAIASyACIABJcnIEQBAFAAsgAjMAAAs3AQF/IAAgAWohAiACQQBGIAJBAmoQKCgCAEsgAiAASXJyBEAQBQALIAJBAXEEQBAGCyACMwEACy0BAX8gACABaiECIAJBAEYgAkEEahAoKAIASyACIABJcnIEQBAFAAsgAjQAAAs3AQF/IAAgAWohAiACQQBGIAJBBGoQKCgCAEsgAiAASXJyBEAQBQALIAJBAXEEQBAGCyACNAEACzcBAX8gACABaiECIAJBAEYgAkEEahAoKAIASyACIABJcnIEQBAFAAsgAkEDcQRAEAYLIAI0AgALLQEBfyAAIAFqIQIgAkEARiACQQRqECgoAgBLIAIgAElycgRAEAUACyACNQAACzcBAX8gACABaiECIAJBAEYgAkEEahAoKAIASyACIABJcnIEQBAFAAsgAkEBcQRAEAYLIAI1AQALNwEBfyAAIAFqIQIgAkEARiACQQRqECgoAgBLIAIgAElycgRAEAUACyACQQNxBEAQBgsgAjUCAAstAQF/IAAgAWohAiACQQBGIAJBCGoQKCgCAEsgAiAASXJyBEAQBQALIAIpAAALNwEBfyAAIAFqIQIgAkEARiACQQhqECgoAgBLIAIgAElycgRAEAUACyACQQFxBEAQBgsgAikBAAs3AQF/IAAgAWohAiACQQBGIAJBCGoQKCgCAEsgAiAASXJyBEAQBQALIAJBA3EEQBAGCyACKQIACzcBAX8gACABaiECIAJBAEYgAkEIahAoKAIASyACIABJcnIEQBAFAAsgAkEHcQRAEAYLIAIpAwALLQEBfyAAIAFqIQIgAkEARiACQQRqECgoAgBLIAIgAElycgRAEAUACyACKgAACzcBAX8gACABaiECIAJBAEYgAkEEahAoKAIASyACIABJcnIEQBAFAAsgAkEBcQRAEAYLIAIqAQALNwEBfyAAIAFqIQIgAkEARiACQQRqECgoAgBLIAIgAElycgRAEAUACyACQQNxBEAQBgsgAioCAAstAQF/IAAgAWohAiACQQBGIAJBCGoQKCgCAEsgAiAASXJyBEAQBQALIAIrAAALNwEBfyAAIAFqIQIgAkEARiACQQhqECgoAgBLIAIgAElycgRAEAUACyACQQFxBEAQBgsgAisBAAs3AQF/IAAgAWohAiACQQBGIAJBCGoQKCgCAEsgAiAASXJyBEAQBQALIAJBA3EEQBAGCyACKwIACzcBAX8gACABaiECIAJBAEYgAkEIahAoKAIASyACIABJcnIEQBAFAAsgAkEHcQRAEAYLIAIrAwALLwEBfyAAIAFqIQMgA0EARiADQQFqECgoAgBLIAMgAElycgRAEAUACyADIAI6AAALLwEBfyAAIAFqIQMgA0EARiADQQJqECgoAgBLIAMgAElycgRAEAUACyADIAI7AAALOQEBfyAAIAFqIQMgA0EARiADQQJqECgoAgBLIAMgAElycgRAEAUACyADQQFxBEAQBgsgAyACOwEACy8BAX8gACABaiEDIANBAEYgA0EEahAoKAIASyADIABJcnIEQBAFAAsgAyACNgAACzkBAX8gACABaiEDIANBAEYgA0EEahAoKAIASyADIABJcnIEQBAFAAsgA0EBcQRAEAYLIAMgAjYBAAs5AQF/IAAgAWohAyADQQBGIANBBGoQKCgCAEsgAyAASXJyBEAQBQALIANBA3EEQBAGCyADIAI2AgALLwEBfyAAIAFqIQMgA0EARiADQQFqECgoAgBLIAMgAElycgRAEAUACyADIAI8AAALLwEBfyAAIAFqIQMgA0EARiADQQJqECgoAgBLIAMgAElycgRAEAUACyADIAI9AAALOQEBfyAAIAFqIQMgA0EARiADQQJqECgoAgBLIAMgAElycgRAEAUACyADQQFxBEAQBgsgAyACPQEACy8BAX8gACABaiEDIANBAEYgA0EEahAoKAIASyADIABJcnIEQBAFAAsgAyACPgAACzkBAX8gACABaiEDIANBAEYgA0EEahAoKAIASyADIABJcnIEQBAFAAsgA0EBcQRAEAYLIAMgAj4BAAs5AQF/IAAgAWohAyADQQBGIANBBGoQKCgCAEsgAyAASXJyBEAQBQALIANBA3EEQBAGCyADIAI+AgALLwEBfyAAIAFqIQMgA0EARiADQQhqECgoAgBLIAMgAElycgRAEAUACyADIAI3AAALOQEBfyAAIAFqIQMgA0EARiADQQhqECgoAgBLIAMgAElycgRAEAUACyADQQFxBEAQBgsgAyACNwEACzkBAX8gACABaiEDIANBAEYgA0EIahAoKAIASyADIABJcnIEQBAFAAsgA0EDcQRAEAYLIAMgAjcCAAs5AQF/IAAgAWohAyADQQBGIANBCGoQKCgCAEsgAyAASXJyBEAQBQALIANBB3EEQBAGCyADIAI3AwALLwEBfyAAIAFqIQMgA0EARiADQQRqECgoAgBLIAMgAEly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bWVkIG91dABDb25uZWN0aW9uIHJlZnVzZWQASG9zdCBpcyBkb3duAEhvc3QgaXMgdW5yZWFjaGFibGUAQWRkcmVzcyBpbiB1c2UAQnJva2VuIHBpcGUASS9PIGVycm9yAE5vIHN1Y2ggZGV2aWNlIG9yIGFkZHJlc3MAQmxvY2sgZGV2aWNlIHJlcXVpcmVkAE5vIHN1Y2ggZGV2aWNlAE5vdCBhIGRpcmVjdG9yeQBJcyBhIGRpcmVjdG9yeQBUZXh0IGZpbGUgYnVzeQBFeGVjIGZvcm1hdCBlcnJvcgBJbnZhbGlkIGFyZ3VtZW50AEFyZ3VtZW50IGxpc3QgdG9vIGxvbmcAU3ltYm9saWMgbGluayBsb29wAEZpbGVuYW1lIHRvbyBsb25nAFRvbyBtYW55IG9wZW4gZmlsZXMgaW4gc3lzdGVtAE5vIGZpbGUgZGVzY3JpcHRvcnMgYXZhaWxhYmxlAEJhZCBmaWxlIGRlc2NyaXB0b3IATm8gY2hpbGQgcHJvY2VzcwBCYWQgYWRkcmVzcwBGaWxlIHRvbyBsYXJnZQBUb28gbWFueSBsaW5rcwBObyBsb2NrcyBhdmFpbGFibGUAUmVzb3VyY2UgZGVhZGxvY2sgd291bGQgb2NjdXIAU3RhdGUgbm90IHJlY292ZXJhYmxlAFByZXZpb3VzIG93bmVyIGRpZWQAT3BlcmF0aW9uIGNhbmNlbGVkAEZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZABObyBtZXNzYWdlIG9mIGRlc2lyZWQgdHlwZQBJZGVudGlmaWVyIHJlbW92ZWQARGV2aWNlIG5vdCBhIHN0cmVhbQBObyBkYXRhIGF2YWlsYWJsZQBEZXZpY2UgdGltZW91dABPdXQgb2Ygc3RyZWFtcyByZXNvdXJjZXMATGluayBoYXMgYmVlbiBzZXZlcmVkAFByb3RvY29sIGVycm9yAEJhZCBtZXNzYWdlAEZpbGUgZGVzY3JpcHRvciBpbiBiYWQgc3RhdGUATm90IGEgc29ja2V0AERlc3RpbmF0aW9uIGFkZHJlc3MgcmVxdWlyZWQATWVzc2FnZSB0b28gbGFyZ2UAUHJvdG9jb2wgd3JvbmcgdHlwZSBmb3Igc29ja2V0AFByb3RvY29sIG5vdCBhdmFpbGFibGUAUHJvdG9jb2wgbm90IHN1cHBvcnRlZABTb2NrZXQgdHlwZSBub3Qgc3VwcG9ydGVkAE5vdCBzdXBwb3J0ZWQAUHJvdG9jb2wgZmFtaWx5IG5vdCBzdXBwb3J0ZWQAQWRkcmVzcyBmYW1pbHkgbm90IHN1cHBvcnRlZCBieSBwcm90b2NvbABBZGRyZXNzIG5vdCBhdmFpbGFibGUATmV0d29yayBpcyBkb3duAE5ldHdvcmsgdW5yZWFjaGFibGUAQ29ubmVjdGlvbiByZXNldCBieSBuZXR3b3JrAENvbm5lY3Rpb24gYWJvcnRlZABObyBidWZmZXIgc3BhY2UgYXZhaWxhYmxlAFNvY2tldCBpcyBjb25uZWN0ZWQAU29ja2V0IG5vdCBjb25uZWN0ZWQAQ2Fubm90IHNlbmQgYWZ0ZXIgc29ja2V0IHNodXRkb3duAE9wZXJhdGlvbiBhbHJlYWR5IGluIHByb2dyZXNzAE9wZXJhdGlvbiBpbiBwcm9ncmVzcwBTdGFsZSBmaWxlIGhhbmRsZQBSZW1vdGUgSS9PIGVycm9yAFF1b3RhIGV4Y2VlZGVkAE5vIG1lZGl1bSBmb3VuZABXcm9uZyBtZWRpdW0gdHlwZQBNdWx0aWhvcCBhdHRlbXB0ZWQAUmVxdWlyZWQga2V5IG5vdCBhdmFpbGFibGUAS2V5IGhhcyBleHBpcmVkAEtleSBoYXMgYmVlbiByZXZva2VkAEtleSB3YXMgcmVqZWN0ZWQgYnkgc2VydmljZQAAAAAAAAAAAKUCWwDwAbUFjAUlAYMGHQOUBP8AxwMxAwsGvAGPAX8DygQrANoGrwBCA04D3AEOBBUAoQYNAZQCCwI4BmQCvAL/Al0D5wQLB88CywXvBdsF4QIeBkUChQCCAmwDbwTxAPMDGAXZANoDTAZUAnsBnQO9BAAAUQAVArsAswNtAP8BhQQvBfkEOABlAUYBnwC3BqgBcwJTAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACEEAAAAAAAAAAAvAgAAAAAAAAAAAAAAAAAAAAAAAAAANQRHBFYEAAAAAAAAAAAAAAAAAAAAAKAEAAAAAAAAAAAAAAAAAAAAAAAARgVgBW4FYQYAAM8BAAAAAAAAAADJBukG+QYeBzkHSQdeBwBBuMsAC5wBcCgBAAAAAAAFAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAwAAAGQmAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAA//////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAJQAAAJQBD3RhcmdldF9mZWF0dXJlcwgrD211dGFibGUtZ2xvYmFscysTbm9udHJhcHBpbmctZnB0b2ludCsLYnVsay1tZW1vcnkrCHNpZ24tZXh0Kw9yZWZlcmVuY2UtdHlwZXMrCm11bHRpdmFsdWUrD2J1bGstbWVtb3J5LW9wdCsWY2FsbC1pbmRpcmVjdC1vdmVybG9uZw==");
}

function getBinarySync(file) {
  if (ArrayBuffer.isView(file)) {
    return file;
  }
  if (file == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  if (readBinary) {
    return readBinary(file);
  }
  throw "both async and sync fetching of the wasm failed";
}

async function getWasmBinary(binaryFile) {
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
    // Warn on some common problems.
    if (isFileURI(wasmBinaryFile)) {
      err(`warning: Loading from a file URI (${wasmBinaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
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
    wasmMemory = wasmExports["memory"];
    assert(wasmMemory, "memory not found in wasm exports");
    updateMemoryViews();
    assignWasmExports(wasmExports);
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  // wait for the pthread pool (if any)
  addRunDependency("wasm-instantiate");
  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result["instance"]);
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
      try {
        Module["instantiateWasm"](info, (mod, inst) => {
          resolve(receiveInstance(mod, inst));
        });
      } catch (e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        reject(e);
      }
    });
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

var callRuntimeCallbacks = callbacks => {
  while (callbacks.length > 0) {
    // Pass the module as the first argument.
    callbacks.shift()(Module);
  }
};

var onPostRuns = [];

var addOnPostRun = cb => onPostRuns.push(cb);

var onPreRuns = [];

var addOnPreRun = cb => onPreRuns.push(cb);

/** @noinline */ var base64Decode = b64 => {
  assert(b64.length % 4 == 0);
  var b1, b2, i = 0, j = 0, bLength = b64.length;
  var output = new Uint8Array((bLength * 3 >> 2) - (b64[bLength - 2] == "=") - (b64[bLength - 1] == "="));
  for (;i < bLength; i += 4, j += 3) {
    b1 = base64ReverseLookup[b64.charCodeAt(i + 1)];
    b2 = base64ReverseLookup[b64.charCodeAt(i + 2)];
    output[j] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
    output[j + 1] = b1 << 4 | b2 >> 2;
    output[j + 2] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i + 3)];
  }
  return output;
};

/**
     * @param {number} ptr
     * @param {string} type
     */ function getValue(ptr, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    return SAFE_HEAP_LOAD(HEAP8, ptr);

   case "i8":
    return SAFE_HEAP_LOAD(HEAP8, ptr);

   case "i16":
    return SAFE_HEAP_LOAD(HEAP16, ((ptr) >> 1));

   case "i32":
    return SAFE_HEAP_LOAD(HEAP32, ((ptr) >> 2));

   case "i64":
    return SAFE_HEAP_LOAD(HEAP64, ((ptr) >> 3));

   case "float":
    return SAFE_HEAP_LOAD(HEAPF32, ((ptr) >> 2));

   case "double":
    return SAFE_HEAP_LOAD(HEAPF64, ((ptr) >> 3));

   case "*":
    return SAFE_HEAP_LOAD(HEAPU32, ((ptr) >> 2));

   default:
    abort(`invalid type for getValue: ${type}`);
  }
}

var noExitRuntime = true;

var ptrToString = ptr => {
  assert(typeof ptr === "number");
  // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
  ptr >>>= 0;
  return "0x" + ptr.toString(16).padStart(8, "0");
};

/**
     * @param {number} ptr
     * @param {number} value
     * @param {string} type
     */ function setValue(ptr, value, type = "i8") {
  if (type.endsWith("*")) type = "*";
  switch (type) {
   case "i1":
    SAFE_HEAP_STORE(HEAP8, ptr, value);
    break;

   case "i8":
    SAFE_HEAP_STORE(HEAP8, ptr, value);
    break;

   case "i16":
    SAFE_HEAP_STORE(HEAP16, ((ptr) >> 1), value);
    break;

   case "i32":
    SAFE_HEAP_STORE(HEAP32, ((ptr) >> 2), value);
    break;

   case "i64":
    SAFE_HEAP_STORE(HEAP64, ((ptr) >> 3), BigInt(value));
    break;

   case "float":
    SAFE_HEAP_STORE(HEAPF32, ((ptr) >> 2), value);
    break;

   case "double":
    SAFE_HEAP_STORE(HEAPF64, ((ptr) >> 3), value);
    break;

   case "*":
    SAFE_HEAP_STORE(HEAPU32, ((ptr) >> 2), value);
    break;

   default:
    abort(`invalid type for setValue: ${type}`);
  }
}

var stackRestore = val => __emscripten_stack_restore(val);

var stackSave = () => _emscripten_stack_get_current();

var unSign = (value, bits) => {
  if (value >= 0) {
    return value;
  }
  // Need some trickery, since if bits == 32, we are right at the limit of the
  // bits JS uses in bitshifts
  return bits <= 32 ? 2 * Math.abs(1 << (bits - 1)) + value : Math.pow(2, bits) + value;
};

var warnOnce = text => {
  warnOnce.shown ||= {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
};

var __abort_js = () => abort("native code called abort()");

var getHeapMax = () => // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
// full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
// for any code that deals with heap sizes, which would require special
// casing all heap size related code to treat 0 specially.
2147483648;

var alignMemory = (size, alignment) => {
  assert(alignment, "alignment argument is required");
  return Math.ceil(size / alignment) * alignment;
};

var growMemory = size => {
  var b = wasmMemory.buffer;
  var pages = ((size - b.byteLength + 65535) / 65536) | 0;
  try {
    // round size grow request up to wasm page size (fixed 64KB per spec)
    wasmMemory.grow(pages);
    // .grow() takes a delta compared to the previous size
    updateMemoryViews();
    return 1;
  } catch (e) {
    err(`growMemory: Attempted to grow heap from ${b.byteLength} bytes to ${size} bytes, but got error: ${e}`);
  }
};

var _emscripten_resize_heap = requestedSize => {
  var oldSize = HEAPU8.length;
  // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
  requestedSize >>>= 0;
  // With multithreaded builds, races can happen (another thread might increase the size
  // in between), so return a failure, and let the caller retry.
  assert(requestedSize > oldSize);
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
    err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
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
  err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
  return false;
};

var UTF8Decoder = typeof TextDecoder != "undefined" ? new TextDecoder : undefined;

/**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number=} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.  Also, use the length info to avoid running tiny
  // strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation,
  // so that undefined/NaN means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
  if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
  }
  var str = "";
  // If building with TextDecoder, we have already computed the string length
  // above, so test loop end condition against that
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
      if ((u0 & 248) != 240) warnOnce("Invalid UTF-8 leading byte " + ptrToString(u0) + " encountered when deserializing a UTF-8 string in wasm memory to a JS string!");
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
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ var UTF8ToString = (ptr, maxBytesToRead) => {
  assert(typeof ptr == "number", `UTF8ToString expects a number (got ${typeof ptr})`);
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
};

var SYSCALLS = {
  varargs: undefined,
  getStr(ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  }
};

var _fd_close = fd => {
  abort("fd_close called without SYSCALLS_REQUIRE_FILESYSTEM");
};

var INT53_MAX = 9007199254740992;

var INT53_MIN = -9007199254740992;

var bigintToI53Checked = num => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);

function _fd_seek(fd, offset, whence, newOffset) {
  offset = bigintToI53Checked(offset);
  return 70;
}

var printCharBuffers = [ null, [], [] ];

var printChar = (stream, curr) => {
  var buffer = printCharBuffers[stream];
  assert(buffer);
  if (curr === 0 || curr === 10) {
    (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
    buffer.length = 0;
  } else {
    buffer.push(curr);
  }
};

var flush_NO_FILESYSTEM = () => {
  // flush anything remaining in the buffers during shutdown
  _fflush(0);
  if (printCharBuffers[1].length) printChar(1, 10);
  if (printCharBuffers[2].length) printChar(2, 10);
};

var _fd_write = (fd, iov, iovcnt, pnum) => {
  // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
  var num = 0;
  for (var i = 0; i < iovcnt; i++) {
    var ptr = SAFE_HEAP_LOAD(HEAPU32, ((iov) >> 2));
    var len = SAFE_HEAP_LOAD(HEAPU32, (((iov) + (4)) >> 2));
    iov += 8;
    for (var j = 0; j < len; j++) {
      printChar(fd, SAFE_HEAP_LOAD(HEAPU8, ptr + j));
    }
    num += len;
  }
  SAFE_HEAP_STORE(HEAPU32, ((pnum) >> 2), num);
  return 0;
};

var getCFunc = ident => {
  var func = Module["_" + ident];
  // closure exported function
  assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
  return func;
};

var writeArrayToMemory = (array, buffer) => {
  assert(array.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
  HEAP8.set(array, buffer);
};

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
  assert(typeof str === "string", `stringToUTF8Array expects a string (got ${typeof str})`);
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
      if (u > 1114111) warnOnce("Invalid Unicode code point " + ptrToString(u) + " encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");
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

var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
  assert(typeof maxBytesToWrite == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
};

var stackAlloc = sz => __emscripten_stack_alloc(sz);

var stringToUTF8OnStack = str => {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8(str, ret, size);
  return ret;
};

/**
     * @param {string|null=} returnType
     * @param {Array=} argTypes
     * @param {Arguments|Array=} args
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
  assert(returnType !== "array", 'Return type should not be "array".');
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
     */ var cwrap = (ident, returnType, argTypes, opts) => (...args) => ccall(ident, returnType, argTypes, args, opts);

// Precreate a reverse lookup table from chars
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" back to
// bytes to make decoding fast.
for (var base64ReverseLookup = new Uint8Array(123), i = 25; i >= 0; --i) {
  base64ReverseLookup[48 + i] = 52 + i;
  // '0-9'
  base64ReverseLookup[65 + i] = i;
  // 'A-Z'
  base64ReverseLookup[97 + i] = 26 + i;
}

base64ReverseLookup[43] = 62;

// '+'
base64ReverseLookup[47] = 63;

// End JS library code
// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.
{
  // Begin ATMODULES hooks
  if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
  if (Module["print"]) out = Module["print"];
  if (Module["printErr"]) err = Module["printErr"];
  if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
  Module["FS_createDataFile"] = FS.createDataFile;
  Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
  // End ATMODULES hooks
  checkIncomingModuleAPI();
  if (Module["arguments"]) arguments_ = Module["arguments"];
  if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module["memoryInitializerPrefixURL"] == "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["pthreadMainPrefixURL"] == "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["cdInitializerPrefixURL"] == "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["filePackagePrefixURL"] == "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
  assert(typeof Module["read"] == "undefined", "Module.read option was removed");
  assert(typeof Module["readAsync"] == "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
  assert(typeof Module["readBinary"] == "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
  assert(typeof Module["setWindowTitle"] == "undefined", "Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)");
  assert(typeof Module["TOTAL_MEMORY"] == "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
  assert(typeof Module["ENVIRONMENT"] == "undefined", "Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)");
  assert(typeof Module["STACK_SIZE"] == "undefined", "STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time");
  // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
  assert(typeof Module["wasmMemory"] == "undefined", "Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally");
  assert(typeof Module["INITIAL_MEMORY"] == "undefined", "Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically");
}

// Begin runtime exports
Module["ccall"] = ccall;

Module["cwrap"] = cwrap;

var missingLibrarySymbols = [ "writeI53ToI64", "writeI53ToI64Clamped", "writeI53ToI64Signaling", "writeI53ToU64Clamped", "writeI53ToU64Signaling", "readI53FromI64", "readI53FromU64", "convertI32PairToI53", "convertI32PairToI53Checked", "convertU32PairToI53", "getTempRet0", "setTempRet0", "zeroMemory", "exitJS", "withStackSave", "strError", "inetPton4", "inetNtop4", "inetPton6", "inetNtop6", "readSockaddr", "writeSockaddr", "emscriptenLog", "readEmAsmArgs", "jstoi_q", "getExecutableName", "autoResumeAudioContext", "getDynCaller", "dynCall", "handleException", "keepRuntimeAlive", "runtimeKeepalivePush", "runtimeKeepalivePop", "callUserCallback", "maybeExit", "asmjsMangle", "asyncLoad", "mmapAlloc", "HandleAllocator", "getNativeTypeSize", "getUniqueRunDependency", "addOnInit", "addOnPostCtor", "addOnPreMain", "addOnExit", "STACK_SIZE", "STACK_ALIGN", "POINTER_SIZE", "ASSERTIONS", "uleb128Encode", "sigToWasmTypes", "generateFuncType", "convertJsFunctionToWasm", "getEmptyTableSlot", "updateTableMap", "getFunctionAddress", "addFunction", "removeFunction", "reallyNegative", "strLen", "reSign", "formatString", "intArrayFromString", "intArrayToString", "AsciiToString", "stringToAscii", "UTF16ToString", "stringToUTF16", "lengthBytesUTF16", "UTF32ToString", "stringToUTF32", "lengthBytesUTF32", "stringToNewUTF8", "registerKeyEventCallback", "maybeCStringToJsString", "findEventTarget", "getBoundingClientRect", "fillMouseEventData", "registerMouseEventCallback", "registerWheelEventCallback", "registerUiEventCallback", "registerFocusEventCallback", "fillDeviceOrientationEventData", "registerDeviceOrientationEventCallback", "fillDeviceMotionEventData", "registerDeviceMotionEventCallback", "screenOrientation", "fillOrientationChangeEventData", "registerOrientationChangeEventCallback", "fillFullscreenChangeEventData", "registerFullscreenChangeEventCallback", "JSEvents_requestFullscreen", "JSEvents_resizeCanvasForFullscreen", "registerRestoreOldStyle", "hideEverythingExceptGivenElement", "restoreHiddenElements", "setLetterbox", "softFullscreenResizeWebGLRenderTarget", "doRequestFullscreen", "fillPointerlockChangeEventData", "registerPointerlockChangeEventCallback", "registerPointerlockErrorEventCallback", "requestPointerLock", "fillVisibilityChangeEventData", "registerVisibilityChangeEventCallback", "registerTouchEventCallback", "fillGamepadEventData", "registerGamepadEventCallback", "registerBeforeUnloadEventCallback", "fillBatteryEventData", "battery", "registerBatteryEventCallback", "setCanvasElementSize", "getCanvasElementSize", "jsStackTrace", "getCallstack", "convertPCtoSourceLocation", "getEnvStrings", "checkWasiClock", "wasiRightsToMuslOFlags", "wasiOFlagsToMuslOFlags", "initRandomFill", "randomFill", "safeSetTimeout", "setImmediateWrapped", "safeRequestAnimationFrame", "clearImmediateWrapped", "registerPostMainLoop", "registerPreMainLoop", "getPromise", "makePromise", "idsToPromises", "makePromiseCallback", "ExceptionInfo", "findMatchingCatch", "Browser_asyncPrepareDataCounter", "isLeapYear", "ydayFromDate", "arraySum", "addDays", "getSocketFromFD", "getSocketAddress", "FS_createPreloadedFile", "FS_modeStringToFlags", "FS_getMode", "FS_stdin_getChar", "FS_mkdirTree", "_setNetworkCallback", "heapObjectForWebGLType", "toTypedArrayIndex", "webgl_enable_ANGLE_instanced_arrays", "webgl_enable_OES_vertex_array_object", "webgl_enable_WEBGL_draw_buffers", "webgl_enable_WEBGL_multi_draw", "webgl_enable_EXT_polygon_offset_clamp", "webgl_enable_EXT_clip_control", "webgl_enable_WEBGL_polygon_mode", "emscriptenWebGLGet", "computeUnpackAlignedImageSize", "colorChannelsInGlTextureFormat", "emscriptenWebGLGetTexPixelData", "emscriptenWebGLGetUniform", "webglGetUniformLocation", "webglPrepareUniformLocationsBeforeFirstUse", "webglGetLeftBracePos", "emscriptenWebGLGetVertexAttrib", "__glGetActiveAttribOrUniform", "writeGLArray", "registerWebGlEventCallback", "runAndAbortIfError", "ALLOC_NORMAL", "ALLOC_STACK", "allocate", "writeStringToMemory", "writeAsciiToMemory", "demangle", "stackTrace" ];

missingLibrarySymbols.forEach(missingLibrarySymbol);

var unexportedSymbols = [ "run", "addRunDependency", "removeRunDependency", "out", "err", "callMain", "abort", "wasmMemory", "wasmExports", "HEAPF32", "HEAPF64", "HEAP8", "HEAPU8", "HEAP16", "HEAPU16", "HEAP32", "HEAPU32", "HEAP64", "HEAPU64", "writeStackCookie", "checkStackCookie", "INT53_MAX", "INT53_MIN", "bigintToI53Checked", "stackSave", "stackRestore", "stackAlloc", "ptrToString", "getHeapMax", "growMemory", "ENV", "ERRNO_CODES", "DNS", "Protocols", "Sockets", "timers", "warnOnce", "readEmAsmArgsArray", "alignMemory", "wasmTable", "noExitRuntime", "addOnPreRun", "addOnPostRun", "freeTableIndexes", "functionsInTableMap", "unSign", "setValue", "getValue", "PATH", "PATH_FS", "UTF8Decoder", "UTF8ArrayToString", "UTF8ToString", "stringToUTF8Array", "stringToUTF8", "lengthBytesUTF8", "UTF16Decoder", "stringToUTF8OnStack", "writeArrayToMemory", "JSEvents", "specialHTMLTargets", "findCanvasEventTarget", "currentFullscreenStrategy", "restoreOldWindowedStyle", "UNWIND_CACHE", "ExitStatus", "flush_NO_FILESYSTEM", "emSetImmediate", "emClearImmediate_deps", "emClearImmediate", "promiseMap", "uncaughtExceptionCount", "exceptionLast", "exceptionCaught", "Browser", "requestFullscreen", "requestFullScreen", "setCanvasSize", "getUserMedia", "createContext", "getPreloadedImageData__data", "wget", "MONTH_DAYS_REGULAR", "MONTH_DAYS_LEAP", "MONTH_DAYS_REGULAR_CUMULATIVE", "MONTH_DAYS_LEAP_CUMULATIVE", "base64Decode", "SYSCALLS", "preloadPlugins", "FS_stdin_getChar_buffer", "FS_unlink", "FS_createPath", "FS_createDevice", "FS_readFile", "FS", "FS_root", "FS_mounts", "FS_devices", "FS_streams", "FS_nextInode", "FS_nameTable", "FS_currentPath", "FS_initialized", "FS_ignorePermissions", "FS_filesystems", "FS_syncFSRequests", "FS_readFiles", "FS_lookupPath", "FS_getPath", "FS_hashName", "FS_hashAddNode", "FS_hashRemoveNode", "FS_lookupNode", "FS_createNode", "FS_destroyNode", "FS_isRoot", "FS_isMountpoint", "FS_isFile", "FS_isDir", "FS_isLink", "FS_isChrdev", "FS_isBlkdev", "FS_isFIFO", "FS_isSocket", "FS_flagsToPermissionString", "FS_nodePermissions", "FS_mayLookup", "FS_mayCreate", "FS_mayDelete", "FS_mayOpen", "FS_checkOpExists", "FS_nextfd", "FS_getStreamChecked", "FS_getStream", "FS_createStream", "FS_closeStream", "FS_dupStream", "FS_doSetAttr", "FS_chrdev_stream_ops", "FS_major", "FS_minor", "FS_makedev", "FS_registerDevice", "FS_getDevice", "FS_getMounts", "FS_syncfs", "FS_mount", "FS_unmount", "FS_lookup", "FS_mknod", "FS_statfs", "FS_statfsStream", "FS_statfsNode", "FS_create", "FS_mkdir", "FS_mkdev", "FS_symlink", "FS_rename", "FS_rmdir", "FS_readdir", "FS_readlink", "FS_stat", "FS_fstat", "FS_lstat", "FS_doChmod", "FS_chmod", "FS_lchmod", "FS_fchmod", "FS_doChown", "FS_chown", "FS_lchown", "FS_fchown", "FS_doTruncate", "FS_truncate", "FS_ftruncate", "FS_utime", "FS_open", "FS_close", "FS_isClosed", "FS_llseek", "FS_read", "FS_write", "FS_mmap", "FS_msync", "FS_ioctl", "FS_writeFile", "FS_cwd", "FS_chdir", "FS_createDefaultDirectories", "FS_createDefaultDevices", "FS_createSpecialDirectories", "FS_createStandardStreams", "FS_staticInit", "FS_init", "FS_quit", "FS_findObject", "FS_analyzePath", "FS_createFile", "FS_createDataFile", "FS_forceLoadFile", "FS_createLazyFile", "FS_absolutePath", "FS_createFolder", "FS_createLink", "FS_joinPath", "FS_mmapAlloc", "FS_standardizePath", "MEMFS", "TTY", "PIPEFS", "SOCKFS", "tempFixedLengthArray", "miniTempWebGLFloatBuffers", "miniTempWebGLIntBuffers", "GL", "AL", "GLUT", "EGL", "GLEW", "IDBStore", "SDL", "SDL_gfx", "allocateUTF8", "allocateUTF8OnStack", "print", "printErr", "jstoi_s" ];

unexportedSymbols.forEach(unexportedRuntimeSymbol);

// End runtime exports
// Begin JS library exports
// End JS library exports
// end include: postlibrary.js
function checkIncomingModuleAPI() {
  ignoredModuleProp("fetchSettings");
}

// Imports from the Wasm binary.
var _getC = Module["_getC"] = makeInvalidEarlyAccess("_getC");

var _normcdf = Module["_normcdf"] = makeInvalidEarlyAccess("_normcdf");

var _erf = Module["_erf"] = makeInvalidEarlyAccess("_erf");

var _getP = Module["_getP"] = makeInvalidEarlyAccess("_getP");

var _getd1 = Module["_getd1"] = makeInvalidEarlyAccess("_getd1");

var _getd2 = Module["_getd2"] = makeInvalidEarlyAccess("_getd2");

var _getNPrime = Module["_getNPrime"] = makeInvalidEarlyAccess("_getNPrime");

var _getDelta = Module["_getDelta"] = makeInvalidEarlyAccess("_getDelta");

var _getGamma = Module["_getGamma"] = makeInvalidEarlyAccess("_getGamma");

var _getTheta = Module["_getTheta"] = makeInvalidEarlyAccess("_getTheta");

var _getVega = Module["_getVega"] = makeInvalidEarlyAccess("_getVega");

var _getRho = Module["_getRho"] = makeInvalidEarlyAccess("_getRho");

var _cleanup = Module["_cleanup"] = makeInvalidEarlyAccess("_cleanup");

var _fflush = makeInvalidEarlyAccess("_fflush");

var _strerror = makeInvalidEarlyAccess("_strerror");

var _emscripten_get_sbrk_ptr = makeInvalidEarlyAccess("_emscripten_get_sbrk_ptr");

var _sbrk = makeInvalidEarlyAccess("_sbrk");

var _emscripten_stack_init = makeInvalidEarlyAccess("_emscripten_stack_init");

var _emscripten_stack_get_free = makeInvalidEarlyAccess("_emscripten_stack_get_free");

var _emscripten_stack_get_base = makeInvalidEarlyAccess("_emscripten_stack_get_base");

var _emscripten_stack_get_end = makeInvalidEarlyAccess("_emscripten_stack_get_end");

var __emscripten_stack_restore = makeInvalidEarlyAccess("__emscripten_stack_restore");

var __emscripten_stack_alloc = makeInvalidEarlyAccess("__emscripten_stack_alloc");

var _emscripten_stack_get_current = makeInvalidEarlyAccess("_emscripten_stack_get_current");

function assignWasmExports(wasmExports) {
  Module["_getC"] = _getC = createExportWrapper("getC", 5);
  Module["_normcdf"] = _normcdf = createExportWrapper("normcdf", 1);
  Module["_erf"] = _erf = createExportWrapper("erf", 1);
  Module["_getP"] = _getP = createExportWrapper("getP", 5);
  Module["_getd1"] = _getd1 = createExportWrapper("getd1", 5);
  Module["_getd2"] = _getd2 = createExportWrapper("getd2", 5);
  Module["_getNPrime"] = _getNPrime = createExportWrapper("getNPrime", 5);
  Module["_getDelta"] = _getDelta = createExportWrapper("getDelta", 6);
  Module["_getGamma"] = _getGamma = createExportWrapper("getGamma", 5);
  Module["_getTheta"] = _getTheta = createExportWrapper("getTheta", 6);
  Module["_getVega"] = _getVega = createExportWrapper("getVega", 5);
  Module["_getRho"] = _getRho = createExportWrapper("getRho", 6);
  Module["_cleanup"] = _cleanup = createExportWrapper("cleanup", 0);
  _fflush = createExportWrapper("fflush", 1);
  _strerror = createExportWrapper("strerror", 1);
  _emscripten_get_sbrk_ptr = createExportWrapper("emscripten_get_sbrk_ptr", 0);
  _sbrk = createExportWrapper("sbrk", 1);
  _emscripten_stack_init = wasmExports["emscripten_stack_init"];
  _emscripten_stack_get_free = wasmExports["emscripten_stack_get_free"];
  _emscripten_stack_get_base = wasmExports["emscripten_stack_get_base"];
  _emscripten_stack_get_end = wasmExports["emscripten_stack_get_end"];
  __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
  __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
  _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
}

var wasmImports = {
  /** @export */ _abort_js: __abort_js,
  /** @export */ alignfault,
  /** @export */ emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */ fd_close: _fd_close,
  /** @export */ fd_seek: _fd_seek,
  /** @export */ fd_write: _fd_write,
  /** @export */ segfault
};

var wasmExports = await createWasm();

// include: postamble.js
// === Auto-generated postamble setup entry stuff ===
var calledRun;

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  stackCheckInit();
  preRun();
  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }
  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    assert(!calledRun);
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    readyPromiseResolve?.(Module);
    Module["onRuntimeInitialized"]?.();
    consumedModuleProp("onRuntimeInitialized");
    assert(!Module["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
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
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = x => {
    has = true;
  };
  try {
    // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch (e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.");
    warnOnce("(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)");
  }
}

function preInit() {
  if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [ Module["preInit"] ];
    while (Module["preInit"].length > 0) {
      Module["preInit"].shift()();
    }
  }
  consumedModuleProp("preInit");
}

preInit();

run();

// end include: postamble.js
// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
// We assign to the `moduleRtn` global here and configure closure to see
// this as and extern so it won't get minified.
if (runtimeInitialized) {
  moduleRtn = Module;
} else {
  // Set up the promise that indicates the Module is initialized
  moduleRtn = new Promise((resolve, reject) => {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });
}

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`);
      }
    });
  }
}


  return moduleRtn;
}
);
})();
export default createModelModule;
