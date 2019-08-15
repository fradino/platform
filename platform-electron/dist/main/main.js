module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "920d4f8b87eec2da360b"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/devtron/api.js":
/*!*************************************!*\
  !*** ./node_modules/devtron/api.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* WEBPACK VAR INJECTION */(function(__dirname) {const electron = __webpack_require__(/*! electron */ \"electron\")\n\nexports.install = () => {\n  if (process.type === 'renderer') {\n    console.log(`Installing Devtron from ${__dirname}`)\n    if (electron.remote.BrowserWindow.getDevToolsExtensions &&\n        electron.remote.BrowserWindow.getDevToolsExtensions().devtron) return true\n    return electron.remote.BrowserWindow.addDevToolsExtension(__dirname)\n  } else if (process.type === 'browser') {\n    console.log(`Installing Devtron from ${__dirname}`)\n    if (electron.BrowserWindow.getDevToolsExtensions &&\n        electron.BrowserWindow.getDevToolsExtensions().devtron) return true\n    return electron.BrowserWindow.addDevToolsExtension(__dirname)\n  } else {\n    throw new Error('Devtron can only be installed from an Electron process.')\n  }\n}\n\nexports.uninstall = () => {\n  if (process.type === 'renderer') {\n    console.log(`Uninstalling Devtron from ${__dirname}`)\n    return electron.remote.BrowserWindow.removeDevToolsExtension('devtron')\n  } else if (process.type === 'browser') {\n    console.log(`Uninstalling Devtron from ${__dirname}`)\n    return electron.BrowserWindow.removeDevToolsExtension('devtron')\n  } else {\n    throw new Error('Devtron can only be uninstalled from an Electron process.')\n  }\n}\n\nexports.path = __dirname\n\n/* WEBPACK VAR INJECTION */}.call(this, \"node_modules\\\\devtron\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZGV2dHJvbi9hcGkuanM/YjFjZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDLFVBQVU7QUFDckQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILDJDQUEyQyxVQUFVO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0EsR0FBRztBQUNILDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9kZXZ0cm9uL2FwaS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuXG5leHBvcnRzLmluc3RhbGwgPSAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgSW5zdGFsbGluZyBEZXZ0cm9uIGZyb20gJHtfX2Rpcm5hbWV9YClcbiAgICBpZiAoZWxlY3Ryb24ucmVtb3RlLkJyb3dzZXJXaW5kb3cuZ2V0RGV2VG9vbHNFeHRlbnNpb25zICYmXG4gICAgICAgIGVsZWN0cm9uLnJlbW90ZS5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucygpLmRldnRyb24pIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGVsZWN0cm9uLnJlbW90ZS5Ccm93c2VyV2luZG93LmFkZERldlRvb2xzRXh0ZW5zaW9uKF9fZGlybmFtZSlcbiAgfSBlbHNlIGlmIChwcm9jZXNzLnR5cGUgPT09ICdicm93c2VyJykge1xuICAgIGNvbnNvbGUubG9nKGBJbnN0YWxsaW5nIERldnRyb24gZnJvbSAke19fZGlybmFtZX1gKVxuICAgIGlmIChlbGVjdHJvbi5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucyAmJlxuICAgICAgICBlbGVjdHJvbi5Ccm93c2VyV2luZG93LmdldERldlRvb2xzRXh0ZW5zaW9ucygpLmRldnRyb24pIHJldHVybiB0cnVlXG4gICAgcmV0dXJuIGVsZWN0cm9uLkJyb3dzZXJXaW5kb3cuYWRkRGV2VG9vbHNFeHRlbnNpb24oX19kaXJuYW1lKVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignRGV2dHJvbiBjYW4gb25seSBiZSBpbnN0YWxsZWQgZnJvbSBhbiBFbGVjdHJvbiBwcm9jZXNzLicpXG4gIH1cbn1cblxuZXhwb3J0cy51bmluc3RhbGwgPSAoKSA9PiB7XG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgVW5pbnN0YWxsaW5nIERldnRyb24gZnJvbSAke19fZGlybmFtZX1gKVxuICAgIHJldHVybiBlbGVjdHJvbi5yZW1vdGUuQnJvd3NlcldpbmRvdy5yZW1vdmVEZXZUb29sc0V4dGVuc2lvbignZGV2dHJvbicpXG4gIH0gZWxzZSBpZiAocHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicpIHtcbiAgICBjb25zb2xlLmxvZyhgVW5pbnN0YWxsaW5nIERldnRyb24gZnJvbSAke19fZGlybmFtZX1gKVxuICAgIHJldHVybiBlbGVjdHJvbi5Ccm93c2VyV2luZG93LnJlbW92ZURldlRvb2xzRXh0ZW5zaW9uKCdkZXZ0cm9uJylcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0RldnRyb24gY2FuIG9ubHkgYmUgdW5pbnN0YWxsZWQgZnJvbSBhbiBFbGVjdHJvbiBwcm9jZXNzLicpXG4gIH1cbn1cblxuZXhwb3J0cy5wYXRoID0gX19kaXJuYW1lXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/devtron/api.js\n");

/***/ }),

/***/ "./node_modules/electron-settings/index.js":
/*!*************************************************!*\
  !*** ./node_modules/electron-settings/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * A simple persistent user settings framework for Electron.\n *\n * @module main\n * @author Nathan Buchar\n * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>\n * @license ISC\n */\n\nconst Settings = __webpack_require__(/*! ./lib/settings */ \"./node_modules/electron-settings/lib/settings.js\");\n\nmodule.exports = new Settings();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tc2V0dGluZ3MvaW5kZXguanM/OTkxZCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXNldHRpbmdzL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBIHNpbXBsZSBwZXJzaXN0ZW50IHVzZXIgc2V0dGluZ3MgZnJhbWV3b3JrIGZvciBFbGVjdHJvbi5cbiAqXG4gKiBAbW9kdWxlIG1haW5cbiAqIEBhdXRob3IgTmF0aGFuIEJ1Y2hhclxuICogQGNvcHlyaWdodCAyMDE2LTIwMTcgTmF0aGFuIEJ1Y2hhciA8aGVsbG9AbmF0aGFuYnVjaGFyLmNvbT5cbiAqIEBsaWNlbnNlIElTQ1xuICovXG5cbmNvbnN0IFNldHRpbmdzID0gcmVxdWlyZSgnLi9saWIvc2V0dGluZ3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2V0dGluZ3MoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-settings/index.js\n");

/***/ }),

/***/ "./node_modules/electron-settings/lib/settings-helpers.js":
/*!****************************************************************!*\
  !*** ./node_modules/electron-settings/lib/settings-helpers.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * A module that contains key path helpers. Adapted from atom/key-path-helpers.\n *\n * @module settings-helpers\n * @author Nathan Buchar\n * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>\n * @license ISC\n */\n\n/**\n * Checks if the given object contains the given key path.\n *\n * @param {Object} obj\n * @param {string} keyPath\n * @returns {boolean}\n */\nmodule.exports.hasKeyPath = (obj, keyPath) => {\n  const keys = keyPath.split(/\\./);\n\n  for (let i = 0, len = keys.length; i < len; i++) {\n    const key = keys[i];\n\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      obj = obj[key];\n    } else {\n      return false;\n    }\n  }\n\n  return true;\n};\n\n/**\n * Gets the value of the given object at the given key path.\n *\n * @param {Object} obj\n * @param {string} keyPath\n * @returns {any}\n */\nmodule.exports.getValueAtKeyPath = (obj, keyPath) => {\n  const keys = keyPath.split(/\\./);\n\n  for (let i = 0, len = keys.length; i < len; i++) {\n    const key = keys[i];\n\n    if (Object.prototype.hasOwnProperty.call(obj, key)) {\n      obj = obj[key];\n    } else {\n      return undefined;\n    }\n  }\n\n  return obj;\n};\n\n/**\n * Sets the value of the given object at the given key path.\n *\n * @param {Object} obj\n * @param {string} keyPath\n * @param {any} value\n */\nmodule.exports.setValueAtKeyPath = (obj, keyPath, value) => {\n  const keys = keyPath.split(/\\./);\n\n  while (keys.length > 1) {\n    const key = keys.shift();\n\n    if (!Object.prototype.hasOwnProperty.call(obj, key)) {\n      obj[key] = {};\n    }\n\n    obj = obj[key];\n  }\n\n  obj[keys.shift()] = value;\n};\n\n/**\n * Deletes the value of the given object at the given key path.\n *\n * @param {Object} obj\n * @param {string} keyPath\n */\nmodule.exports.deleteValueAtKeyPath = (obj, keyPath) => {\n  const keys = keyPath.split(/\\./);\n\n  while (keys.length > 1) {\n    const key = keys.shift();\n\n    if (!Object.prototype.hasOwnProperty.call(obj, key)) {\n      return;\n    }\n\n    obj = obj[key];\n  }\n\n  delete obj[keys.shift()];\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tc2V0dGluZ3MvbGliL3NldHRpbmdzLWhlbHBlcnMuanM/MjE3ZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0MsU0FBUztBQUM3Qzs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0MsU0FBUztBQUM3Qzs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsV0FBVyxJQUFJO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tc2V0dGluZ3MvbGliL3NldHRpbmdzLWhlbHBlcnMuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgbW9kdWxlIHRoYXQgY29udGFpbnMga2V5IHBhdGggaGVscGVycy4gQWRhcHRlZCBmcm9tIGF0b20va2V5LXBhdGgtaGVscGVycy5cbiAqXG4gKiBAbW9kdWxlIHNldHRpbmdzLWhlbHBlcnNcbiAqIEBhdXRob3IgTmF0aGFuIEJ1Y2hhclxuICogQGNvcHlyaWdodCAyMDE2LTIwMTcgTmF0aGFuIEJ1Y2hhciA8aGVsbG9AbmF0aGFuYnVjaGFyLmNvbT5cbiAqIEBsaWNlbnNlIElTQ1xuICovXG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBnaXZlbiBvYmplY3QgY29udGFpbnMgdGhlIGdpdmVuIGtleSBwYXRoLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlQYXRoXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMuaGFzS2V5UGF0aCA9IChvYmosIGtleVBhdGgpID0+IHtcbiAgY29uc3Qga2V5cyA9IGtleVBhdGguc3BsaXQoL1xcLi8pO1xuXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBrZXlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcblxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBvYmogPSBvYmpba2V5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gb2JqZWN0IGF0IHRoZSBnaXZlbiBrZXkgcGF0aC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICogQHJldHVybnMge2FueX1cbiAqL1xubW9kdWxlLmV4cG9ydHMuZ2V0VmFsdWVBdEtleVBhdGggPSAob2JqLCBrZXlQYXRoKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBrZXlQYXRoLnNwbGl0KC9cXC4vKTtcblxuICBmb3IgKGxldCBpID0gMCwgbGVuID0ga2V5cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xuICAgICAgb2JqID0gb2JqW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIG9iamVjdCBhdCB0aGUgZ2l2ZW4ga2V5IHBhdGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IGtleVBhdGhcbiAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICovXG5tb2R1bGUuZXhwb3J0cy5zZXRWYWx1ZUF0S2V5UGF0aCA9IChvYmosIGtleVBhdGgsIHZhbHVlKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBrZXlQYXRoLnNwbGl0KC9cXC4vKTtcblxuICB3aGlsZSAoa2V5cy5sZW5ndGggPiAxKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5cy5zaGlmdCgpO1xuXG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICBvYmpba2V5XSA9IHt9O1xuICAgIH1cblxuICAgIG9iaiA9IG9ialtrZXldO1xuICB9XG5cbiAgb2JqW2tleXMuc2hpZnQoKV0gPSB2YWx1ZTtcbn07XG5cbi8qKlxuICogRGVsZXRlcyB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIG9iamVjdCBhdCB0aGUgZ2l2ZW4ga2V5IHBhdGguXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9ialxuICogQHBhcmFtIHtzdHJpbmd9IGtleVBhdGhcbiAqL1xubW9kdWxlLmV4cG9ydHMuZGVsZXRlVmFsdWVBdEtleVBhdGggPSAob2JqLCBrZXlQYXRoKSA9PiB7XG4gIGNvbnN0IGtleXMgPSBrZXlQYXRoLnNwbGl0KC9cXC4vKTtcblxuICB3aGlsZSAoa2V5cy5sZW5ndGggPiAxKSB7XG4gICAgY29uc3Qga2V5ID0ga2V5cy5zaGlmdCgpO1xuXG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgb2JqID0gb2JqW2tleV07XG4gIH1cblxuICBkZWxldGUgb2JqW2tleXMuc2hpZnQoKV07XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-settings/lib/settings-helpers.js\n");

/***/ }),

/***/ "./node_modules/electron-settings/lib/settings-observer.js":
/*!*****************************************************************!*\
  !*** ./node_modules/electron-settings/lib/settings-observer.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * A module that delegates settings changes.\n *\n * @module settings-observer\n * @author Nathan Buchar\n * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>\n * @license ISC\n */\n\nconst assert = __webpack_require__(/*! assert */ \"assert\");\n\nclass SettingsObserver {\n\n  constructor(settings, keyPath, handler, currentValue) {\n\n    /**\n     * A reference to the Settings instance.\n     *\n     * @type {Settings}\n     * @private\n     */\n    this._settings = settings;\n\n    /**\n     * The key path that this observer instance is watching for changes.\n     *\n     * @type {string}\n     * @private\n     */\n    this._keyPath = keyPath;\n\n    /**\n     * The handler function to be called when the value at the observed\n     * key path is changed.\n     *\n     * @type {Function}\n     * @private\n     */\n    this._handler = handler;\n\n    /**\n     * The current value of the setting at the given key path.\n     *\n     * @type {any}\n     * @private\n     */\n    this._currentValue = currentValue;\n\n    /**\n     * Called when the settings file is changed.\n     *\n     * @type {Object}\n     * @private\n     */\n    this._handleChange = this._onChange.bind(this);\n\n    this._init();\n  }\n\n  /**\n   * Initializes this instance.\n   *\n   * @private\n   */\n  _init() {\n    this._settings.on('change', this._handleChange);\n  }\n\n  /**\n   * Called when the settings file is changed.\n   *\n   * @private\n   */\n  _onChange() {\n    const oldValue = this._currentValue;\n    const newValue = this._settings.get(this._keyPath);\n\n    try {\n      assert.deepEqual(newValue, oldValue);\n    } catch (err) {\n      this._currentValue = newValue;\n\n      // Call the watch handler and pass in the new and old values.\n      this._handler.call(this, newValue, oldValue);\n    }\n  }\n\n  /**\n   * Disposes of this key path observer.\n   *\n   * @public\n   */\n  dispose() {\n    this._settings.removeListener('change', this._handleChange);\n  }\n}\n\nmodule.exports = SettingsObserver;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tc2V0dGluZ3MvbGliL3NldHRpbmdzLW9ic2VydmVyLmpzPzM0ZmYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1zZXR0aW5ncy9saWIvc2V0dGluZ3Mtb2JzZXJ2ZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgbW9kdWxlIHRoYXQgZGVsZWdhdGVzIHNldHRpbmdzIGNoYW5nZXMuXG4gKlxuICogQG1vZHVsZSBzZXR0aW5ncy1vYnNlcnZlclxuICogQGF1dGhvciBOYXRoYW4gQnVjaGFyXG4gKiBAY29weXJpZ2h0IDIwMTYtMjAxNyBOYXRoYW4gQnVjaGFyIDxoZWxsb0BuYXRoYW5idWNoYXIuY29tPlxuICogQGxpY2Vuc2UgSVNDXG4gKi9cblxuY29uc3QgYXNzZXJ0ID0gcmVxdWlyZSgnYXNzZXJ0Jyk7XG5cbmNsYXNzIFNldHRpbmdzT2JzZXJ2ZXIge1xuXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzLCBrZXlQYXRoLCBoYW5kbGVyLCBjdXJyZW50VmFsdWUpIHtcblxuICAgIC8qKlxuICAgICAqIEEgcmVmZXJlbmNlIHRvIHRoZSBTZXR0aW5ncyBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTZXR0aW5nc31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3NldHRpbmdzID0gc2V0dGluZ3M7XG5cbiAgICAvKipcbiAgICAgKiBUaGUga2V5IHBhdGggdGhhdCB0aGlzIG9ic2VydmVyIGluc3RhbmNlIGlzIHdhdGNoaW5nIGZvciBjaGFuZ2VzLlxuICAgICAqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2tleVBhdGggPSBrZXlQYXRoO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGhhbmRsZXIgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHZhbHVlIGF0IHRoZSBvYnNlcnZlZFxuICAgICAqIGtleSBwYXRoIGlzIGNoYW5nZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9oYW5kbGVyID0gaGFuZGxlcjtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBzZXR0aW5nIGF0IHRoZSBnaXZlbiBrZXkgcGF0aC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHthbnl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9jdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWU7XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgc2V0dGluZ3MgZmlsZSBpcyBjaGFuZ2VkLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2hhbmRsZUNoYW5nZSA9IHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9pbml0KCk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgdGhpcyBpbnN0YW5jZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0KCkge1xuICAgIHRoaXMuX3NldHRpbmdzLm9uKCdjaGFuZ2UnLCB0aGlzLl9oYW5kbGVDaGFuZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBzZXR0aW5ncyBmaWxlIGlzIGNoYW5nZWQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfb25DaGFuZ2UoKSB7XG4gICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLl9jdXJyZW50VmFsdWU7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLl9zZXR0aW5ncy5nZXQodGhpcy5fa2V5UGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5fY3VycmVudFZhbHVlID0gbmV3VmFsdWU7XG5cbiAgICAgIC8vIENhbGwgdGhlIHdhdGNoIGhhbmRsZXIgYW5kIHBhc3MgaW4gdGhlIG5ldyBhbmQgb2xkIHZhbHVlcy5cbiAgICAgIHRoaXMuX2hhbmRsZXIuY2FsbCh0aGlzLCBuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwb3NlcyBvZiB0aGlzIGtleSBwYXRoIG9ic2VydmVyLlxuICAgKlxuICAgKiBAcHVibGljXG4gICAqL1xuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuX3NldHRpbmdzLnJlbW92ZUxpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLl9oYW5kbGVDaGFuZ2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3NPYnNlcnZlcjtcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/electron-settings/lib/settings-observer.js\n");

/***/ }),

/***/ "./node_modules/electron-settings/lib/settings.js":
/*!********************************************************!*\
  !*** ./node_modules/electron-settings/lib/settings.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\n * A module that handles read and writing to the disk.\n *\n * @module settings\n * @author Nathan Buchar\n * @copyright 2016-2017 Nathan Buchar <hello@nathanbuchar.com>\n * @license ISC\n */\n\nconst assert = __webpack_require__(/*! assert */ \"assert\");\nconst electron = __webpack_require__(/*! electron */ \"electron\");\nconst { EventEmitter } = __webpack_require__(/*! events */ \"events\");\nconst fs = __webpack_require__(/*! fs */ \"fs\");\nconst jsonfile = __webpack_require__(/*! jsonfile */ \"./node_modules/jsonfile/index.js\");\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst Helpers = __webpack_require__(/*! ./settings-helpers */ \"./node_modules/electron-settings/lib/settings-helpers.js\");\nconst Observer = __webpack_require__(/*! ./settings-observer */ \"./node_modules/electron-settings/lib/settings-observer.js\");\n\n/**\n * The name of the settings file.\n *\n * @type {string}\n */\nconst defaultSettingsFileName = 'Settings';\n\n/**\n * The electron-settings class.\n *\n * @extends EventEmitter\n * @class\n */\nclass Settings extends EventEmitter {\n\n  constructor() {\n    super();\n\n    /**\n     * The absolute path to the custom settings file on the disk.\n     *\n     * @type {string}\n     * @default null\n     * @private\n     */\n    this._customSettingsFilePath = null;\n\n    /**\n     * The FSWatcher instance. This will watch if the settings file and\n     * notify key path observers.\n     *\n     * @type {FSWatcher}\n     * @default null\n     * @private\n     */\n    this._fsWatcher = null;\n\n    /**\n     * Called when the settings file is changed or renamed.\n     *\n     * @type {Object}\n     * @private\n     */\n    this._handleSettingsFileChange = this._onSettingsFileChange.bind(this);\n  }\n\n  /**\n   * Returns the settings file path.\n   *\n   * @returns {string}\n   * @private\n   */\n  _getSettingsFilePath() {\n    if (this._customSettingsFilePath) return this._customSettingsFilePath;\n\n    const app = electron.app || electron.remote.app;\n    const userDataPath = app.getPath('userData');\n    const defaultSettingsFilePath = path.join(userDataPath, defaultSettingsFileName);\n\n    return defaultSettingsFilePath;\n  }\n\n  /**\n   * Sets a custom settings file path.\n   *\n   * @param {string} filePath\n   * @private\n   */\n  _setSettingsFilePath(filePath) {\n    this._customSettingsFilePath = filePath;\n\n    // Reset FSWatcher.\n    this._unwatchSettings(true);\n  }\n\n  /**\n   * Clears the custom settings file path.\n   *\n   * @private\n   */\n  _clearSettingsFilePath() {\n    this._setSettingsFilePath(null);\n  }\n\n  /**\n   * Watches the settings file for changes using the native `FSWatcher`\n   * class in case the settings file is changed outside of\n   * ElectronSettings' jursidiction.\n   *\n   * @private\n   */\n  _watchSettings() {\n    if (!this._fsWatcher) {\n      try {\n        this._fsWatcher = fs.watch(this._getSettingsFilePath(), this._handleSettingsFileChange);\n      } catch (err) {\n        // File may not exist yet or the user may not have permission to\n        // access the file or directory. Fail gracefully.\n      }\n    }\n  }\n\n  /**\n   * Unwatches the settings file by closing the FSWatcher and nullifying its\n   * references. If the `reset` parameter is true, attempt to watch the\n   * settings file again.\n   *\n   * @param {boolean} [reset=false]\n   * @private\n   */\n  _unwatchSettings(reset = false) {\n    if (this._fsWatcher) {\n      this._fsWatcher.close();\n      this._fsWatcher = null;\n\n      if (reset) {\n        this._watchSettings();\n      }\n    }\n  }\n\n  /**\n   * Ensures that the settings file exists, then initializes the FSWatcher.\n   *\n   * @private\n   */\n  _ensureSettings() {\n    const settingsFilePath = this._getSettingsFilePath();\n\n    try {\n      jsonfile.readFileSync(settingsFilePath);\n    } catch (err) {\n      try {\n        jsonfile.writeFileSync(settingsFilePath, {});\n      } catch (err) {\n        // Cannot read or write file. The user may not have permission to\n        // access the file or directory. Throw error.\n        throw err;\n      }\n    }\n\n    this._watchSettings();\n  }\n\n  /**\n   * Writes the settings to the disk.\n   *\n   * @param {Object} [obj={}]\n   * @param {Object} [opts={}]\n   * @private\n   */\n  _writeSettings(obj = {}, opts = {}) {\n    this._ensureSettings();\n\n    try {\n      const spaces = opts.prettify ? 2 : 0;\n\n      jsonfile.writeFileSync(this._getSettingsFilePath(), obj, { spaces });\n    } catch (err) {\n      // Could not write the file. The user may not have permission to\n      // access the file or directory. Throw error.\n      throw err;\n    }\n  }\n\n  /**\n   * Returns the parsed contents of the settings file.\n   *\n   * @returns {Object}\n   * @private\n   */\n  _readSettings() {\n    this._ensureSettings();\n\n    try {\n      return jsonfile.readFileSync(this._getSettingsFilePath());\n    } catch (err) {\n      // Could not read the file. The user may not have permission to\n      // access the file or directory. Throw error.\n      throw err;\n    }\n  }\n\n  /**\n   * Called when the settings file has been changed or\n   * renamed (moved/deleted).\n   *\n   * @type {string} eventType\n   * @private\n   */\n  _onSettingsFileChange(eventType) {\n    switch (eventType) {\n      case Settings.FSWatcherEvents.CHANGE: {\n        this._emitChangeEvent();\n        break;\n      }\n      case Settings.FSWatcherEvents.RENAME: {\n        this._unwatchSettings(true);\n        break;\n      }\n    }\n  }\n\n  /**\n   * Broadcasts the internal \"change\" event.\n   *\n   * @emits ElectronSettings:change\n   * @private\n   */\n  _emitChangeEvent() {\n    this.emit(Settings.Events.CHANGE);\n  }\n\n  /**\n   * Returns a boolean indicating whether the settings object contains\n   * the given key path.\n   *\n   * @param {string} keyPath\n   * @returns {boolean}\n   * @private\n   */\n  _checkKeyPathExists(keyPath) {\n    const obj = this._readSettings();\n    const exists = Helpers.hasKeyPath(obj, keyPath);\n\n    return exists;\n  }\n\n  /**\n   * Sets the value at the given key path, or the entire settings object if\n   * an empty key path is given.\n   *\n   * @param {string} keyPath\n   * @param {any} value\n   * @param {Object} opts\n   * @private\n   */\n  _setValueAtKeyPath(keyPath, value, opts) {\n    let obj = value;\n\n    if (keyPath !== '') {\n      obj = this._readSettings();\n\n      Helpers.setValueAtKeyPath(obj, keyPath, value);\n    }\n\n    this._writeSettings(obj, opts);\n  }\n\n  /**\n   * Returns the value at the given key path, or sets the value at that key\n   * path to the default value, if provided, if the key does not exist. If an\n   * empty key path is given, the entire settings object will be returned.\n   *\n   * @param {string} keyPath\n   * @param {any} defaultValue\n   * @param {Object} opts\n   * @returns {any}\n   * @private\n   */\n  _getValueAtKeyPath(keyPath, defaultValue, opts) {\n    const obj = this._readSettings();\n\n    if (keyPath !== '') {\n      const exists = Helpers.hasKeyPath(obj, keyPath);\n      const value = Helpers.getValueAtKeyPath(obj, keyPath);\n\n      // The key does not exist but a default value does. Set the value at the\n      // key path to the default value and then get the new value.\n      if (!exists && typeof defaultValue !== 'undefined') {\n        this._setValueAtKeyPath(keyPath, defaultValue, opts);\n\n        // Get the new value now that the default has been set.\n        return this._getValueAtKeyPath(keyPath);\n      }\n\n      return value;\n    }\n\n    return obj;\n  }\n\n  /**\n   * Deletes the key and value at the given key path, or clears the entire\n   * settings object if an empty key path is given.\n   *\n   * @param {string} keyPath\n   * @param {Object} opts\n   * @private\n   */\n  _deleteValueAtKeyPath(keyPath, opts) {\n    if (keyPath === '') {\n      this._writeSettings({}, opts);\n    } else {\n      const obj = this._readSettings();\n      const exists = Helpers.hasKeyPath(obj, keyPath);\n\n      if (exists) {\n        Helpers.deleteValueAtKeyPath(obj, keyPath);\n        this._writeSettings(obj, opts);\n      }\n    }\n  }\n\n  /**\n   * Watches the given key path for changes and calls the given handler\n   * if the value changes. To unsubscribe from changes, call `dispose()`\n   * on the Observer instance that is returned.\n   *\n   * @param {string} keyPath\n   * @param {Function} handler\n   * @returns {Observer}\n   * @private\n   */\n  _watchValueAtKeyPath(keyPath, handler) {\n    const currentValue = this._getValueAtKeyPath(keyPath);\n\n    return new Observer(this, keyPath, handler, currentValue);\n  }\n\n  /**\n   * Returns a boolean indicating whether the settings object contains\n   * the given key path.\n   *\n   * @param {string} keyPath\n   * @returns {boolean}\n   * @public\n   */\n  has(keyPath) {\n    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string');\n\n    return this._checkKeyPathExists(keyPath);\n  }\n\n  /**\n   * Sets the value at the given key path.\n   *\n   * @param {string} keyPath\n   * @param {any} value\n   * @param {Object} [opts={}]\n   * @param {boolean} [opts.prettify=false]\n   * @returns {Settings}\n   * @public\n   */\n  set(keyPath, value, opts = {}) {\n    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string. Did you mean to use `setAll()` instead?');\n    assert.strictEqual(typeof opts, 'object', 'Second parameter must be an object');\n\n    this._setValueAtKeyPath(keyPath, value, opts);\n\n    return this;\n  }\n\n  /**\n   * Sets all settings.\n   *\n   * @param {Object} obj\n   * @param {Object} [opts={}]\n   * @param {boolean} [opts.prettify=false]\n   * @returns {Settings}\n   * @public\n   */\n  setAll(obj, opts = {}) {\n    assert.strictEqual(typeof obj, 'object', 'First parameter must be an object');\n    assert.strictEqual(typeof opts, 'object', 'Second parameter must be an object');\n\n    this._setValueAtKeyPath('', obj, opts);\n\n    return this;\n  }\n\n  /**\n   * Returns the value at the given key path, or sets the value at that key\n   * path to the default value, if provided, if the key does not exist.\n   *\n   * @param {string} keyPath\n   * @param {any} [defaultValue]\n   * @param {Object} [opts={}]\n   * @returns {any}\n   * @public\n   */\n  get(keyPath, defaultValue, opts = {}) {\n    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string. Did you mean to use `getAll()` instead?');\n\n    return this._getValueAtKeyPath(keyPath, defaultValue, opts);\n  }\n\n  /**\n   * Returns all settings.\n   *\n   * @returns {Object}\n   * @public\n   */\n  getAll() {\n    return this._getValueAtKeyPath('');\n  }\n\n  /**\n   * Deletes the key and value at the given key path.\n   *\n   * @param {string} keyPath\n   * @param {Object} [opts={}]\n   * @param {boolean} [opts.prettify=false]\n   * @returns {Settings}\n   * @public\n   */\n  delete(keyPath, opts = {}) {\n    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string. Did you mean to use `deleteAll()` instead?');\n    assert.strictEqual(typeof opts, 'object', 'Second parameter must be an object');\n\n    this._deleteValueAtKeyPath(keyPath, opts);\n\n    return this;\n  }\n\n  /**\n   * Deletes all settings.\n   *\n   * @param {Object} [opts={}]\n   * @param {boolean} [opts.prettify=false]\n   * @returns {Settings}\n   * @public\n   */\n  deleteAll(opts = {}) {\n    assert.strictEqual(typeof opts, 'object', 'First parameter must be an object');\n\n    this._deleteValueAtKeyPath('', opts);\n\n    return this;\n  }\n\n  /**\n   * Watches the given key path for changes and calls the given handler\n   * if the value changes. To unsubscribe from changes, call `dispose()`\n   * on the Observer instance that is returned.\n   *\n   * @param {string} keyPath\n   * @param {Function} handler\n   * @returns {Observer}\n   * @public\n   */\n  watch(keyPath, handler) {\n    assert.strictEqual(typeof keyPath, 'string', 'First parameter must be a string');\n    assert.strictEqual(typeof handler, 'function', 'Second parameter must be a function');\n\n    return this._watchValueAtKeyPath(keyPath, handler);\n  }\n\n  /**\n   * Sets a custom settings file path.\n   *\n   * @param {string} filePath\n   * @returns {Settings}\n   * @public\n   */\n  setPath(filePath) {\n    assert.strictEqual(typeof filePath, 'string', 'First parameter must be a string');\n\n    this._setSettingsFilePath(filePath);\n\n    return this;\n  }\n\n  /**\n   * Clears the custom settings file path.\n   *\n   * @returns {Settings}\n   * @public\n   */\n  clearPath() {\n    this._clearSettingsFilePath();\n\n    return this;\n  }\n\n  /**\n   * Returns the absolute path to where the settings file is or will be stored.\n   *\n   * @returns {string}\n   * @public\n   */\n  file() {\n    return this._getSettingsFilePath();\n  }\n}\n\n/**\n * ElectronSettings event names.\n *\n * @enum {string}\n * @readonly\n */\nSettings.FSWatcherEvents = {\n  CHANGE: 'change',\n  RENAME: 'rename'\n};\n\n/**\n * ElectronSettings event names.\n *\n * @enum {string}\n * @readonly\n */\nSettings.Events = {\n  CHANGE: 'change'\n};\n\nmodule.exports = Settings;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tc2V0dGluZ3MvbGliL3NldHRpbmdzLmpzPzNiNWQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxlQUFlO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxtREFBbUQ7QUFDbkQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU8sUUFBUTtBQUM1QixhQUFhLE9BQU8sU0FBUztBQUM3QjtBQUNBO0FBQ0EseUJBQXlCLFdBQVc7QUFDcEM7O0FBRUE7QUFDQTs7QUFFQSxnRUFBZ0UsU0FBUztBQUN6RSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxJQUFJO0FBQ2pCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsSUFBSTtBQUNqQixhQUFhLE9BQU87QUFDcEIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QixLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLFNBQVM7QUFDdEIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsSUFBSTtBQUNqQixhQUFhLE9BQU8sU0FBUztBQUM3QixhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU8sU0FBUztBQUM3QixhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGFBQWEsSUFBSTtBQUNqQixhQUFhLE9BQU8sU0FBUztBQUM3QixlQUFlO0FBQ2Y7QUFDQTtBQUNBLHNDQUFzQztBQUN0Qzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQixhQUFhLE9BQU8sU0FBUztBQUM3QixhQUFhLFFBQVE7QUFDckIsZUFBZTtBQUNmO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTyxTQUFTO0FBQzdCLGFBQWEsUUFBUTtBQUNyQixlQUFlO0FBQ2Y7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEIsYUFBYSxTQUFTO0FBQ3RCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1zZXR0aW5ncy9saWIvc2V0dGluZ3MuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgbW9kdWxlIHRoYXQgaGFuZGxlcyByZWFkIGFuZCB3cml0aW5nIHRvIHRoZSBkaXNrLlxuICpcbiAqIEBtb2R1bGUgc2V0dGluZ3NcbiAqIEBhdXRob3IgTmF0aGFuIEJ1Y2hhclxuICogQGNvcHlyaWdodCAyMDE2LTIwMTcgTmF0aGFuIEJ1Y2hhciA8aGVsbG9AbmF0aGFuYnVjaGFyLmNvbT5cbiAqIEBsaWNlbnNlIElTQ1xuICovXG5cbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpO1xuY29uc3QgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xuY29uc3QgeyBFdmVudEVtaXR0ZXIgfSA9IHJlcXVpcmUoJ2V2ZW50cycpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QganNvbmZpbGUgPSByZXF1aXJlKCdqc29uZmlsZScpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuY29uc3QgSGVscGVycyA9IHJlcXVpcmUoJy4vc2V0dGluZ3MtaGVscGVycycpO1xuY29uc3QgT2JzZXJ2ZXIgPSByZXF1aXJlKCcuL3NldHRpbmdzLW9ic2VydmVyJyk7XG5cbi8qKlxuICogVGhlIG5hbWUgb2YgdGhlIHNldHRpbmdzIGZpbGUuXG4gKlxuICogQHR5cGUge3N0cmluZ31cbiAqL1xuY29uc3QgZGVmYXVsdFNldHRpbmdzRmlsZU5hbWUgPSAnU2V0dGluZ3MnO1xuXG4vKipcbiAqIFRoZSBlbGVjdHJvbi1zZXR0aW5ncyBjbGFzcy5cbiAqXG4gKiBAZXh0ZW5kcyBFdmVudEVtaXR0ZXJcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBTZXR0aW5ncyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBjdXN0b20gc2V0dGluZ3MgZmlsZSBvbiB0aGUgZGlzay5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY3VzdG9tU2V0dGluZ3NGaWxlUGF0aCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgRlNXYXRjaGVyIGluc3RhbmNlLiBUaGlzIHdpbGwgd2F0Y2ggaWYgdGhlIHNldHRpbmdzIGZpbGUgYW5kXG4gICAgICogbm90aWZ5IGtleSBwYXRoIG9ic2VydmVycy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtGU1dhdGNoZXJ9XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZnNXYXRjaGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBzZXR0aW5ncyBmaWxlIGlzIGNoYW5nZWQgb3IgcmVuYW1lZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9oYW5kbGVTZXR0aW5nc0ZpbGVDaGFuZ2UgPSB0aGlzLl9vblNldHRpbmdzRmlsZUNoYW5nZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNldHRpbmdzIGZpbGUgcGF0aC5cbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9nZXRTZXR0aW5nc0ZpbGVQYXRoKCkge1xuICAgIGlmICh0aGlzLl9jdXN0b21TZXR0aW5nc0ZpbGVQYXRoKSByZXR1cm4gdGhpcy5fY3VzdG9tU2V0dGluZ3NGaWxlUGF0aDtcblxuICAgIGNvbnN0IGFwcCA9IGVsZWN0cm9uLmFwcCB8fCBlbGVjdHJvbi5yZW1vdGUuYXBwO1xuICAgIGNvbnN0IHVzZXJEYXRhUGF0aCA9IGFwcC5nZXRQYXRoKCd1c2VyRGF0YScpO1xuICAgIGNvbnN0IGRlZmF1bHRTZXR0aW5nc0ZpbGVQYXRoID0gcGF0aC5qb2luKHVzZXJEYXRhUGF0aCwgZGVmYXVsdFNldHRpbmdzRmlsZU5hbWUpO1xuXG4gICAgcmV0dXJuIGRlZmF1bHRTZXR0aW5nc0ZpbGVQYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBjdXN0b20gc2V0dGluZ3MgZmlsZSBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRTZXR0aW5nc0ZpbGVQYXRoKGZpbGVQYXRoKSB7XG4gICAgdGhpcy5fY3VzdG9tU2V0dGluZ3NGaWxlUGF0aCA9IGZpbGVQYXRoO1xuXG4gICAgLy8gUmVzZXQgRlNXYXRjaGVyLlxuICAgIHRoaXMuX3Vud2F0Y2hTZXR0aW5ncyh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGN1c3RvbSBzZXR0aW5ncyBmaWxlIHBhdGguXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2xlYXJTZXR0aW5nc0ZpbGVQYXRoKCkge1xuICAgIHRoaXMuX3NldFNldHRpbmdzRmlsZVBhdGgobnVsbCk7XG4gIH1cblxuICAvKipcbiAgICogV2F0Y2hlcyB0aGUgc2V0dGluZ3MgZmlsZSBmb3IgY2hhbmdlcyB1c2luZyB0aGUgbmF0aXZlIGBGU1dhdGNoZXJgXG4gICAqIGNsYXNzIGluIGNhc2UgdGhlIHNldHRpbmdzIGZpbGUgaXMgY2hhbmdlZCBvdXRzaWRlIG9mXG4gICAqIEVsZWN0cm9uU2V0dGluZ3MnIGp1cnNpZGljdGlvbi5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF93YXRjaFNldHRpbmdzKCkge1xuICAgIGlmICghdGhpcy5fZnNXYXRjaGVyKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLl9mc1dhdGNoZXIgPSBmcy53YXRjaCh0aGlzLl9nZXRTZXR0aW5nc0ZpbGVQYXRoKCksIHRoaXMuX2hhbmRsZVNldHRpbmdzRmlsZUNoYW5nZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gRmlsZSBtYXkgbm90IGV4aXN0IHlldCBvciB0aGUgdXNlciBtYXkgbm90IGhhdmUgcGVybWlzc2lvbiB0b1xuICAgICAgICAvLyBhY2Nlc3MgdGhlIGZpbGUgb3IgZGlyZWN0b3J5LiBGYWlsIGdyYWNlZnVsbHkuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVud2F0Y2hlcyB0aGUgc2V0dGluZ3MgZmlsZSBieSBjbG9zaW5nIHRoZSBGU1dhdGNoZXIgYW5kIG51bGxpZnlpbmcgaXRzXG4gICAqIHJlZmVyZW5jZXMuIElmIHRoZSBgcmVzZXRgIHBhcmFtZXRlciBpcyB0cnVlLCBhdHRlbXB0IHRvIHdhdGNoIHRoZVxuICAgKiBzZXR0aW5ncyBmaWxlIGFnYWluLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtyZXNldD1mYWxzZV1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91bndhdGNoU2V0dGluZ3MocmVzZXQgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLl9mc1dhdGNoZXIpIHtcbiAgICAgIHRoaXMuX2ZzV2F0Y2hlci5jbG9zZSgpO1xuICAgICAgdGhpcy5fZnNXYXRjaGVyID0gbnVsbDtcblxuICAgICAgaWYgKHJlc2V0KSB7XG4gICAgICAgIHRoaXMuX3dhdGNoU2V0dGluZ3MoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW5zdXJlcyB0aGF0IHRoZSBzZXR0aW5ncyBmaWxlIGV4aXN0cywgdGhlbiBpbml0aWFsaXplcyB0aGUgRlNXYXRjaGVyLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2Vuc3VyZVNldHRpbmdzKCkge1xuICAgIGNvbnN0IHNldHRpbmdzRmlsZVBhdGggPSB0aGlzLl9nZXRTZXR0aW5nc0ZpbGVQYXRoKCk7XG5cbiAgICB0cnkge1xuICAgICAganNvbmZpbGUucmVhZEZpbGVTeW5jKHNldHRpbmdzRmlsZVBhdGgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdHJ5IHtcbiAgICAgICAganNvbmZpbGUud3JpdGVGaWxlU3luYyhzZXR0aW5nc0ZpbGVQYXRoLCB7fSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gQ2Fubm90IHJlYWQgb3Igd3JpdGUgZmlsZS4gVGhlIHVzZXIgbWF5IG5vdCBoYXZlIHBlcm1pc3Npb24gdG9cbiAgICAgICAgLy8gYWNjZXNzIHRoZSBmaWxlIG9yIGRpcmVjdG9yeS4gVGhyb3cgZXJyb3IuXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl93YXRjaFNldHRpbmdzKCk7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSBzZXR0aW5ncyB0byB0aGUgZGlzay5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvYmo9e31dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF93cml0ZVNldHRpbmdzKG9iaiA9IHt9LCBvcHRzID0ge30pIHtcbiAgICB0aGlzLl9lbnN1cmVTZXR0aW5ncygpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNwYWNlcyA9IG9wdHMucHJldHRpZnkgPyAyIDogMDtcblxuICAgICAganNvbmZpbGUud3JpdGVGaWxlU3luYyh0aGlzLl9nZXRTZXR0aW5nc0ZpbGVQYXRoKCksIG9iaiwgeyBzcGFjZXMgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBDb3VsZCBub3Qgd3JpdGUgdGhlIGZpbGUuIFRoZSB1c2VyIG1heSBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvXG4gICAgICAvLyBhY2Nlc3MgdGhlIGZpbGUgb3IgZGlyZWN0b3J5LiBUaHJvdyBlcnJvci5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcGFyc2VkIGNvbnRlbnRzIG9mIHRoZSBzZXR0aW5ncyBmaWxlLlxuICAgKlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlYWRTZXR0aW5ncygpIHtcbiAgICB0aGlzLl9lbnN1cmVTZXR0aW5ncygpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBqc29uZmlsZS5yZWFkRmlsZVN5bmModGhpcy5fZ2V0U2V0dGluZ3NGaWxlUGF0aCgpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIENvdWxkIG5vdCByZWFkIHRoZSBmaWxlLiBUaGUgdXNlciBtYXkgbm90IGhhdmUgcGVybWlzc2lvbiB0b1xuICAgICAgLy8gYWNjZXNzIHRoZSBmaWxlIG9yIGRpcmVjdG9yeS4gVGhyb3cgZXJyb3IuXG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBzZXR0aW5ncyBmaWxlIGhhcyBiZWVuIGNoYW5nZWQgb3JcbiAgICogcmVuYW1lZCAobW92ZWQvZGVsZXRlZCkuXG4gICAqXG4gICAqIEB0eXBlIHtzdHJpbmd9IGV2ZW50VHlwZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29uU2V0dGluZ3NGaWxlQ2hhbmdlKGV2ZW50VHlwZSkge1xuICAgIHN3aXRjaCAoZXZlbnRUeXBlKSB7XG4gICAgICBjYXNlIFNldHRpbmdzLkZTV2F0Y2hlckV2ZW50cy5DSEFOR0U6IHtcbiAgICAgICAgdGhpcy5fZW1pdENoYW5nZUV2ZW50KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSBTZXR0aW5ncy5GU1dhdGNoZXJFdmVudHMuUkVOQU1FOiB7XG4gICAgICAgIHRoaXMuX3Vud2F0Y2hTZXR0aW5ncyh0cnVlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJyb2FkY2FzdHMgdGhlIGludGVybmFsIFwiY2hhbmdlXCIgZXZlbnQuXG4gICAqXG4gICAqIEBlbWl0cyBFbGVjdHJvblNldHRpbmdzOmNoYW5nZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2VtaXRDaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLmVtaXQoU2V0dGluZ3MuRXZlbnRzLkNIQU5HRSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBzZXR0aW5ncyBvYmplY3QgY29udGFpbnNcbiAgICogdGhlIGdpdmVuIGtleSBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja0tleVBhdGhFeGlzdHMoa2V5UGF0aCkge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuX3JlYWRTZXR0aW5ncygpO1xuICAgIGNvbnN0IGV4aXN0cyA9IEhlbHBlcnMuaGFzS2V5UGF0aChvYmosIGtleVBhdGgpO1xuXG4gICAgcmV0dXJuIGV4aXN0cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBhdCB0aGUgZ2l2ZW4ga2V5IHBhdGgsIG9yIHRoZSBlbnRpcmUgc2V0dGluZ3Mgb2JqZWN0IGlmXG4gICAqIGFuIGVtcHR5IGtleSBwYXRoIGlzIGdpdmVuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRWYWx1ZUF0S2V5UGF0aChrZXlQYXRoLCB2YWx1ZSwgb3B0cykge1xuICAgIGxldCBvYmogPSB2YWx1ZTtcblxuICAgIGlmIChrZXlQYXRoICE9PSAnJykge1xuICAgICAgb2JqID0gdGhpcy5fcmVhZFNldHRpbmdzKCk7XG5cbiAgICAgIEhlbHBlcnMuc2V0VmFsdWVBdEtleVBhdGgob2JqLCBrZXlQYXRoLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5fd3JpdGVTZXR0aW5ncyhvYmosIG9wdHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIGF0IHRoZSBnaXZlbiBrZXkgcGF0aCwgb3Igc2V0cyB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICogcGF0aCB0byB0aGUgZGVmYXVsdCB2YWx1ZSwgaWYgcHJvdmlkZWQsIGlmIHRoZSBrZXkgZG9lcyBub3QgZXhpc3QuIElmIGFuXG4gICAqIGVtcHR5IGtleSBwYXRoIGlzIGdpdmVuLCB0aGUgZW50aXJlIHNldHRpbmdzIG9iamVjdCB3aWxsIGJlIHJldHVybmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICAgKiBAcGFyYW0ge2FueX0gZGVmYXVsdFZhbHVlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZ2V0VmFsdWVBdEtleVBhdGgoa2V5UGF0aCwgZGVmYXVsdFZhbHVlLCBvcHRzKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5fcmVhZFNldHRpbmdzKCk7XG5cbiAgICBpZiAoa2V5UGF0aCAhPT0gJycpIHtcbiAgICAgIGNvbnN0IGV4aXN0cyA9IEhlbHBlcnMuaGFzS2V5UGF0aChvYmosIGtleVBhdGgpO1xuICAgICAgY29uc3QgdmFsdWUgPSBIZWxwZXJzLmdldFZhbHVlQXRLZXlQYXRoKG9iaiwga2V5UGF0aCk7XG5cbiAgICAgIC8vIFRoZSBrZXkgZG9lcyBub3QgZXhpc3QgYnV0IGEgZGVmYXVsdCB2YWx1ZSBkb2VzLiBTZXQgdGhlIHZhbHVlIGF0IHRoZVxuICAgICAgLy8ga2V5IHBhdGggdG8gdGhlIGRlZmF1bHQgdmFsdWUgYW5kIHRoZW4gZ2V0IHRoZSBuZXcgdmFsdWUuXG4gICAgICBpZiAoIWV4aXN0cyAmJiB0eXBlb2YgZGVmYXVsdFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLl9zZXRWYWx1ZUF0S2V5UGF0aChrZXlQYXRoLCBkZWZhdWx0VmFsdWUsIG9wdHMpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgbmV3IHZhbHVlIG5vdyB0aGF0IHRoZSBkZWZhdWx0IGhhcyBiZWVuIHNldC5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldFZhbHVlQXRLZXlQYXRoKGtleVBhdGgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIHRoZSBrZXkgYW5kIHZhbHVlIGF0IHRoZSBnaXZlbiBrZXkgcGF0aCwgb3IgY2xlYXJzIHRoZSBlbnRpcmVcbiAgICogc2V0dGluZ3Mgb2JqZWN0IGlmIGFuIGVtcHR5IGtleSBwYXRoIGlzIGdpdmVuLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlbGV0ZVZhbHVlQXRLZXlQYXRoKGtleVBhdGgsIG9wdHMpIHtcbiAgICBpZiAoa2V5UGF0aCA9PT0gJycpIHtcbiAgICAgIHRoaXMuX3dyaXRlU2V0dGluZ3Moe30sIG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBvYmogPSB0aGlzLl9yZWFkU2V0dGluZ3MoKTtcbiAgICAgIGNvbnN0IGV4aXN0cyA9IEhlbHBlcnMuaGFzS2V5UGF0aChvYmosIGtleVBhdGgpO1xuXG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIEhlbHBlcnMuZGVsZXRlVmFsdWVBdEtleVBhdGgob2JqLCBrZXlQYXRoKTtcbiAgICAgICAgdGhpcy5fd3JpdGVTZXR0aW5ncyhvYmosIG9wdHMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaGVzIHRoZSBnaXZlbiBrZXkgcGF0aCBmb3IgY2hhbmdlcyBhbmQgY2FsbHMgdGhlIGdpdmVuIGhhbmRsZXJcbiAgICogaWYgdGhlIHZhbHVlIGNoYW5nZXMuIFRvIHVuc3Vic2NyaWJlIGZyb20gY2hhbmdlcywgY2FsbCBgZGlzcG9zZSgpYFxuICAgKiBvbiB0aGUgT2JzZXJ2ZXIgaW5zdGFuY2UgdGhhdCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICAgKiBAcmV0dXJucyB7T2JzZXJ2ZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfd2F0Y2hWYWx1ZUF0S2V5UGF0aChrZXlQYXRoLCBoYW5kbGVyKSB7XG4gICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy5fZ2V0VmFsdWVBdEtleVBhdGgoa2V5UGF0aCk7XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmVyKHRoaXMsIGtleVBhdGgsIGhhbmRsZXIsIGN1cnJlbnRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBzZXR0aW5ncyBvYmplY3QgY29udGFpbnNcbiAgICogdGhlIGdpdmVuIGtleSBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgaGFzKGtleVBhdGgpIHtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIGtleVBhdGgsICdzdHJpbmcnLCAnRmlyc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBzdHJpbmcnKTtcblxuICAgIHJldHVybiB0aGlzLl9jaGVja0tleVBhdGhFeGlzdHMoa2V5UGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgYXQgdGhlIGdpdmVuIGtleSBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5UGF0aFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLnByZXR0aWZ5PWZhbHNlXVxuICAgKiBAcmV0dXJucyB7U2V0dGluZ3N9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNldChrZXlQYXRoLCB2YWx1ZSwgb3B0cyA9IHt9KSB7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHR5cGVvZiBrZXlQYXRoLCAnc3RyaW5nJywgJ0ZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIGEgc3RyaW5nLiBEaWQgeW91IG1lYW4gdG8gdXNlIGBzZXRBbGwoKWAgaW5zdGVhZD8nKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIG9wdHMsICdvYmplY3QnLCAnU2Vjb25kIHBhcmFtZXRlciBtdXN0IGJlIGFuIG9iamVjdCcpO1xuXG4gICAgdGhpcy5fc2V0VmFsdWVBdEtleVBhdGgoa2V5UGF0aCwgdmFsdWUsIG9wdHMpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhbGwgc2V0dGluZ3MuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLnByZXR0aWZ5PWZhbHNlXVxuICAgKiBAcmV0dXJucyB7U2V0dGluZ3N9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNldEFsbChvYmosIG9wdHMgPSB7fSkge1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Ygb2JqLCAnb2JqZWN0JywgJ0ZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIGFuIG9iamVjdCcpO1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Ygb3B0cywgJ29iamVjdCcsICdTZWNvbmQgcGFyYW1ldGVyIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG5cbiAgICB0aGlzLl9zZXRWYWx1ZUF0S2V5UGF0aCgnJywgb2JqLCBvcHRzKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIGF0IHRoZSBnaXZlbiBrZXkgcGF0aCwgb3Igc2V0cyB0aGUgdmFsdWUgYXQgdGhhdCBrZXlcbiAgICogcGF0aCB0byB0aGUgZGVmYXVsdCB2YWx1ZSwgaWYgcHJvdmlkZWQsIGlmIHRoZSBrZXkgZG9lcyBub3QgZXhpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlQYXRoXG4gICAqIEBwYXJhbSB7YW55fSBbZGVmYXVsdFZhbHVlXVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdHM9e31dXG4gICAqIEByZXR1cm5zIHthbnl9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGdldChrZXlQYXRoLCBkZWZhdWx0VmFsdWUsIG9wdHMgPSB7fSkge1xuICAgIGFzc2VydC5zdHJpY3RFcXVhbCh0eXBlb2Yga2V5UGF0aCwgJ3N0cmluZycsICdGaXJzdCBwYXJhbWV0ZXIgbXVzdCBiZSBhIHN0cmluZy4gRGlkIHlvdSBtZWFuIHRvIHVzZSBgZ2V0QWxsKClgIGluc3RlYWQ/Jyk7XG5cbiAgICByZXR1cm4gdGhpcy5fZ2V0VmFsdWVBdEtleVBhdGgoa2V5UGF0aCwgZGVmYXVsdFZhbHVlLCBvcHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBzZXR0aW5ncy5cbiAgICpcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRWYWx1ZUF0S2V5UGF0aCgnJyk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyB0aGUga2V5IGFuZCB2YWx1ZSBhdCB0aGUgZ2l2ZW4ga2V5IHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlQYXRoXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cz17fV1cbiAgICogQHBhcmFtIHtib29sZWFufSBbb3B0cy5wcmV0dGlmeT1mYWxzZV1cbiAgICogQHJldHVybnMge1NldHRpbmdzfVxuICAgKiBAcHVibGljXG4gICAqL1xuICBkZWxldGUoa2V5UGF0aCwgb3B0cyA9IHt9KSB7XG4gICAgYXNzZXJ0LnN0cmljdEVxdWFsKHR5cGVvZiBrZXlQYXRoLCAnc3RyaW5nJywgJ0ZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIGEgc3RyaW5nLiBEaWQgeW91IG1lYW4gdG8gdXNlIGBkZWxldGVBbGwoKWAgaW5zdGVhZD8nKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIG9wdHMsICdvYmplY3QnLCAnU2Vjb25kIHBhcmFtZXRlciBtdXN0IGJlIGFuIG9iamVjdCcpO1xuXG4gICAgdGhpcy5fZGVsZXRlVmFsdWVBdEtleVBhdGgoa2V5UGF0aCwgb3B0cyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGFsbCBzZXR0aW5ncy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRzPXt9XVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLnByZXR0aWZ5PWZhbHNlXVxuICAgKiBAcmV0dXJucyB7U2V0dGluZ3N9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIGRlbGV0ZUFsbChvcHRzID0ge30pIHtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIG9wdHMsICdvYmplY3QnLCAnRmlyc3QgcGFyYW1ldGVyIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG5cbiAgICB0aGlzLl9kZWxldGVWYWx1ZUF0S2V5UGF0aCgnJywgb3B0cyk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBXYXRjaGVzIHRoZSBnaXZlbiBrZXkgcGF0aCBmb3IgY2hhbmdlcyBhbmQgY2FsbHMgdGhlIGdpdmVuIGhhbmRsZXJcbiAgICogaWYgdGhlIHZhbHVlIGNoYW5nZXMuIFRvIHVuc3Vic2NyaWJlIGZyb20gY2hhbmdlcywgY2FsbCBgZGlzcG9zZSgpYFxuICAgKiBvbiB0aGUgT2JzZXJ2ZXIgaW5zdGFuY2UgdGhhdCBpcyByZXR1cm5lZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVBhdGhcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaGFuZGxlclxuICAgKiBAcmV0dXJucyB7T2JzZXJ2ZXJ9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHdhdGNoKGtleVBhdGgsIGhhbmRsZXIpIHtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIGtleVBhdGgsICdzdHJpbmcnLCAnRmlyc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIGhhbmRsZXIsICdmdW5jdGlvbicsICdTZWNvbmQgcGFyYW1ldGVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gICAgcmV0dXJuIHRoaXMuX3dhdGNoVmFsdWVBdEtleVBhdGgoa2V5UGF0aCwgaGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIGN1c3RvbSBzZXR0aW5ncyBmaWxlIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aFxuICAgKiBAcmV0dXJucyB7U2V0dGluZ3N9XG4gICAqIEBwdWJsaWNcbiAgICovXG4gIHNldFBhdGgoZmlsZVBhdGgpIHtcbiAgICBhc3NlcnQuc3RyaWN0RXF1YWwodHlwZW9mIGZpbGVQYXRoLCAnc3RyaW5nJywgJ0ZpcnN0IHBhcmFtZXRlciBtdXN0IGJlIGEgc3RyaW5nJyk7XG5cbiAgICB0aGlzLl9zZXRTZXR0aW5nc0ZpbGVQYXRoKGZpbGVQYXRoKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgY3VzdG9tIHNldHRpbmdzIGZpbGUgcGF0aC5cbiAgICpcbiAgICogQHJldHVybnMge1NldHRpbmdzfVxuICAgKiBAcHVibGljXG4gICAqL1xuICBjbGVhclBhdGgoKSB7XG4gICAgdGhpcy5fY2xlYXJTZXR0aW5nc0ZpbGVQYXRoKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHdoZXJlIHRoZSBzZXR0aW5ncyBmaWxlIGlzIG9yIHdpbGwgYmUgc3RvcmVkLlxuICAgKlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKiBAcHVibGljXG4gICAqL1xuICBmaWxlKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRTZXR0aW5nc0ZpbGVQYXRoKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFbGVjdHJvblNldHRpbmdzIGV2ZW50IG5hbWVzLlxuICpcbiAqIEBlbnVtIHtzdHJpbmd9XG4gKiBAcmVhZG9ubHlcbiAqL1xuU2V0dGluZ3MuRlNXYXRjaGVyRXZlbnRzID0ge1xuICBDSEFOR0U6ICdjaGFuZ2UnLFxuICBSRU5BTUU6ICdyZW5hbWUnXG59O1xuXG4vKipcbiAqIEVsZWN0cm9uU2V0dGluZ3MgZXZlbnQgbmFtZXMuXG4gKlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICovXG5TZXR0aW5ncy5FdmVudHMgPSB7XG4gIENIQU5HRTogJ2NoYW5nZSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0dGluZ3M7XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-settings/lib/settings.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nfunction _electronDevtoolsInstaller() {\n  const data = _interopRequireWildcard(__webpack_require__(/*! electron-devtools-installer */ \"electron-devtools-installer\"));\n\n  _electronDevtoolsInstaller = function () {\n    return data;\n  };\n\n  return data;\n}\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }\n\n// install vue-devtools\n__webpack_require__(/*! electron */ \"electron\").app.on(\"ready\", () => {\n  (0, _electronDevtoolsInstaller().default)(_electronDevtoolsInstaller().VUEJS_DEVTOOLS).catch(error => {\n    console.log(\"Unable to install `vue-devtools`: \\n\", error);\n  });\n}); \n//# sourceMappingURL=vue-main-dev-entry.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvY29uZmlndXJhdG9ycy92dWUvdnVlLW1haW4tZGV2LWVudHJ5LmpzP2FlZDciXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSx1Q0FBdUMsNkJBQTZCLFlBQVksRUFBRSxPQUFPLGlCQUFpQixtQkFBbUIsdUJBQXVCLHNEQUFzRCxzSEFBc0gsNEJBQTRCLDBDQUEwQyxFQUFFLE9BQU8sd0JBQXdCLEVBQUUsRUFBRSxFQUFFLEVBQUUsc0JBQXNCLGVBQWUsRUFBRTs7QUFFdGQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQyxFO0FBQ0QiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvY29uZmlndXJhdG9ycy92dWUvdnVlLW1haW4tZGV2LWVudHJ5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9lbGVjdHJvbkRldnRvb2xzSW5zdGFsbGVyKCkge1xuICBjb25zdCBkYXRhID0gX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQocmVxdWlyZShcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiKSk7XG5cbiAgX2VsZWN0cm9uRGV2dG9vbHNJbnN0YWxsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHsgdmFyIGRlc2MgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkgJiYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpIDoge307IGlmIChkZXNjLmdldCB8fCBkZXNjLnNldCkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3T2JqLCBrZXksIGRlc2MpOyB9IGVsc2UgeyBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gfSB9IG5ld09iai5kZWZhdWx0ID0gb2JqOyByZXR1cm4gbmV3T2JqOyB9IH1cblxuLy8gaW5zdGFsbCB2dWUtZGV2dG9vbHNcbnJlcXVpcmUoXCJlbGVjdHJvblwiKS5hcHAub24oXCJyZWFkeVwiLCAoKSA9PiB7XG4gICgwLCBfZWxlY3Ryb25EZXZ0b29sc0luc3RhbGxlcigpLmRlZmF1bHQpKF9lbGVjdHJvbkRldnRvb2xzSW5zdGFsbGVyKCkuVlVFSlNfREVWVE9PTFMpLmNhdGNoKGVycm9yID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlVuYWJsZSB0byBpbnN0YWxsIGB2dWUtZGV2dG9vbHNgOiBcXG5cIiwgZXJyb3IpO1xuICB9KTtcbn0pOyBcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZ1ZS1tYWluLWRldi1lbnRyeS5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js\n");

/***/ }),

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0QsNEpBQXdGOzs7QUFHeEY7QUFDQTtBQUNBLENBQUMsRTtBQUNEIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./node_modules/graceful-fs/fs.js":
/*!****************************************!*\
  !*** ./node_modules/graceful-fs/fs.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar fs = __webpack_require__(/*! fs */ \"fs\")\n\nmodule.exports = clone(fs)\n\nfunction clone (obj) {\n  if (obj === null || typeof obj !== 'object')\n    return obj\n\n  if (obj instanceof Object)\n    var copy = { __proto__: obj.__proto__ }\n  else\n    var copy = Object.create(null)\n\n  Object.getOwnPropertyNames(obj).forEach(function (key) {\n    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))\n  })\n\n  return copy\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvZnMuanM/MTJmYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2dyYWNlZnVsLWZzL2ZzLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZShmcylcblxuZnVuY3Rpb24gY2xvbmUgKG9iaikge1xuICBpZiAob2JqID09PSBudWxsIHx8IHR5cGVvZiBvYmogIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBvYmpcblxuICBpZiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KVxuICAgIHZhciBjb3B5ID0geyBfX3Byb3RvX186IG9iai5fX3Byb3RvX18gfVxuICBlbHNlXG4gICAgdmFyIGNvcHkgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29weSwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwga2V5KSlcbiAgfSlcblxuICByZXR1cm4gY29weVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/graceful-fs/fs.js\n");

/***/ }),

/***/ "./node_modules/graceful-fs/graceful-fs.js":
/*!*************************************************!*\
  !*** ./node_modules/graceful-fs/graceful-fs.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var fs = __webpack_require__(/*! fs */ \"fs\")\nvar polyfills = __webpack_require__(/*! ./polyfills.js */ \"./node_modules/graceful-fs/polyfills.js\")\nvar legacy = __webpack_require__(/*! ./legacy-streams.js */ \"./node_modules/graceful-fs/legacy-streams.js\")\nvar queue = []\n\nvar util = __webpack_require__(/*! util */ \"util\")\n\nfunction noop () {}\n\nvar debug = noop\nif (util.debuglog)\n  debug = util.debuglog('gfs4')\nelse if (/\\bgfs4\\b/i.test(process.env.NODE_DEBUG || ''))\n  debug = function() {\n    var m = util.format.apply(util, arguments)\n    m = 'GFS4: ' + m.split(/\\n/).join('\\nGFS4: ')\n    console.error(m)\n  }\n\nif (/\\bgfs4\\b/i.test(process.env.NODE_DEBUG || '')) {\n  process.on('exit', function() {\n    debug(queue)\n    __webpack_require__(/*! assert */ \"assert\").equal(queue.length, 0)\n  })\n}\n\nmodule.exports = patch(__webpack_require__(/*! ./fs.js */ \"./node_modules/graceful-fs/fs.js\"))\nif (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH) {\n  module.exports = patch(fs)\n}\n\n// Always patch fs.close/closeSync, because we want to\n// retry() whenever a close happens *anywhere* in the program.\n// This is essential when multiple graceful-fs instances are\n// in play at the same time.\nmodule.exports.close =\nfs.close = (function (fs$close) { return function (fd, cb) {\n  return fs$close.call(fs, fd, function (err) {\n    if (!err)\n      retry()\n\n    if (typeof cb === 'function')\n      cb.apply(this, arguments)\n  })\n}})(fs.close)\n\nmodule.exports.closeSync =\nfs.closeSync = (function (fs$closeSync) { return function (fd) {\n  // Note that graceful-fs also retries when fs.closeSync() fails.\n  // Looks like a bug to me, although it's probably a harmless one.\n  var rval = fs$closeSync.apply(fs, arguments)\n  retry()\n  return rval\n}})(fs.closeSync)\n\nfunction patch (fs) {\n  // Everything that references the open() function needs to be in here\n  polyfills(fs)\n  fs.gracefulify = patch\n  fs.FileReadStream = ReadStream;  // Legacy name.\n  fs.FileWriteStream = WriteStream;  // Legacy name.\n  fs.createReadStream = createReadStream\n  fs.createWriteStream = createWriteStream\n  var fs$readFile = fs.readFile\n  fs.readFile = readFile\n  function readFile (path, options, cb) {\n    if (typeof options === 'function')\n      cb = options, options = null\n\n    return go$readFile(path, options, cb)\n\n    function go$readFile (path, options, cb) {\n      return fs$readFile(path, options, function (err) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$readFile, [path, options, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  var fs$writeFile = fs.writeFile\n  fs.writeFile = writeFile\n  function writeFile (path, data, options, cb) {\n    if (typeof options === 'function')\n      cb = options, options = null\n\n    return go$writeFile(path, data, options, cb)\n\n    function go$writeFile (path, data, options, cb) {\n      return fs$writeFile(path, data, options, function (err) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$writeFile, [path, data, options, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  var fs$appendFile = fs.appendFile\n  if (fs$appendFile)\n    fs.appendFile = appendFile\n  function appendFile (path, data, options, cb) {\n    if (typeof options === 'function')\n      cb = options, options = null\n\n    return go$appendFile(path, data, options, cb)\n\n    function go$appendFile (path, data, options, cb) {\n      return fs$appendFile(path, data, options, function (err) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$appendFile, [path, data, options, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  var fs$readdir = fs.readdir\n  fs.readdir = readdir\n  function readdir (path, options, cb) {\n    var args = [path]\n    if (typeof options !== 'function') {\n      args.push(options)\n    } else {\n      cb = options\n    }\n    args.push(go$readdir$cb)\n\n    return go$readdir(args)\n\n    function go$readdir$cb (err, files) {\n      if (files && files.sort)\n        files.sort()\n\n      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n        enqueue([go$readdir, [args]])\n      else {\n        if (typeof cb === 'function')\n          cb.apply(this, arguments)\n        retry()\n      }\n    }\n  }\n\n  function go$readdir (args) {\n    return fs$readdir.apply(fs, args)\n  }\n\n  if (process.version.substr(0, 4) === 'v0.8') {\n    var legStreams = legacy(fs)\n    ReadStream = legStreams.ReadStream\n    WriteStream = legStreams.WriteStream\n  }\n\n  var fs$ReadStream = fs.ReadStream\n  ReadStream.prototype = Object.create(fs$ReadStream.prototype)\n  ReadStream.prototype.open = ReadStream$open\n\n  var fs$WriteStream = fs.WriteStream\n  WriteStream.prototype = Object.create(fs$WriteStream.prototype)\n  WriteStream.prototype.open = WriteStream$open\n\n  fs.ReadStream = ReadStream\n  fs.WriteStream = WriteStream\n\n  function ReadStream (path, options) {\n    if (this instanceof ReadStream)\n      return fs$ReadStream.apply(this, arguments), this\n    else\n      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)\n  }\n\n  function ReadStream$open () {\n    var that = this\n    open(that.path, that.flags, that.mode, function (err, fd) {\n      if (err) {\n        if (that.autoClose)\n          that.destroy()\n\n        that.emit('error', err)\n      } else {\n        that.fd = fd\n        that.emit('open', fd)\n        that.read()\n      }\n    })\n  }\n\n  function WriteStream (path, options) {\n    if (this instanceof WriteStream)\n      return fs$WriteStream.apply(this, arguments), this\n    else\n      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)\n  }\n\n  function WriteStream$open () {\n    var that = this\n    open(that.path, that.flags, that.mode, function (err, fd) {\n      if (err) {\n        that.destroy()\n        that.emit('error', err)\n      } else {\n        that.fd = fd\n        that.emit('open', fd)\n      }\n    })\n  }\n\n  function createReadStream (path, options) {\n    return new ReadStream(path, options)\n  }\n\n  function createWriteStream (path, options) {\n    return new WriteStream(path, options)\n  }\n\n  var fs$open = fs.open\n  fs.open = open\n  function open (path, flags, mode, cb) {\n    if (typeof mode === 'function')\n      cb = mode, mode = null\n\n    return go$open(path, flags, mode, cb)\n\n    function go$open (path, flags, mode, cb) {\n      return fs$open(path, flags, mode, function (err, fd) {\n        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))\n          enqueue([go$open, [path, flags, mode, cb]])\n        else {\n          if (typeof cb === 'function')\n            cb.apply(this, arguments)\n          retry()\n        }\n      })\n    }\n  }\n\n  return fs\n}\n\nfunction enqueue (elem) {\n  debug('ENQUEUE', elem[0].name, elem[1])\n  queue.push(elem)\n}\n\nfunction retry () {\n  var elem = queue.shift()\n  if (elem) {\n    debug('RETRY', elem[0].name, elem[1])\n    elem[0].apply(null, elem[1])\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvZ3JhY2VmdWwtZnMuanM/MGRhNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSCxFQUFFOztBQUVGO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvZ3JhY2VmdWwtZnMuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgcG9seWZpbGxzID0gcmVxdWlyZSgnLi9wb2x5ZmlsbHMuanMnKVxudmFyIGxlZ2FjeSA9IHJlcXVpcmUoJy4vbGVnYWN5LXN0cmVhbXMuanMnKVxudmFyIHF1ZXVlID0gW11cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJylcblxuZnVuY3Rpb24gbm9vcCAoKSB7fVxuXG52YXIgZGVidWcgPSBub29wXG5pZiAodXRpbC5kZWJ1Z2xvZylcbiAgZGVidWcgPSB1dGlsLmRlYnVnbG9nKCdnZnM0JylcbmVsc2UgaWYgKC9cXGJnZnM0XFxiL2kudGVzdChwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnKSlcbiAgZGVidWcgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbSA9IHV0aWwuZm9ybWF0LmFwcGx5KHV0aWwsIGFyZ3VtZW50cylcbiAgICBtID0gJ0dGUzQ6ICcgKyBtLnNwbGl0KC9cXG4vKS5qb2luKCdcXG5HRlM0OiAnKVxuICAgIGNvbnNvbGUuZXJyb3IobSlcbiAgfVxuXG5pZiAoL1xcYmdmczRcXGIvaS50ZXN0KHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJycpKSB7XG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBmdW5jdGlvbigpIHtcbiAgICBkZWJ1ZyhxdWV1ZSlcbiAgICByZXF1aXJlKCdhc3NlcnQnKS5lcXVhbChxdWV1ZS5sZW5ndGgsIDApXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2gocmVxdWlyZSgnLi9mcy5qcycpKVxuaWYgKHByb2Nlc3MuZW52LlRFU1RfR1JBQ0VGVUxfRlNfR0xPQkFMX1BBVENIKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcGF0Y2goZnMpXG59XG5cbi8vIEFsd2F5cyBwYXRjaCBmcy5jbG9zZS9jbG9zZVN5bmMsIGJlY2F1c2Ugd2Ugd2FudCB0b1xuLy8gcmV0cnkoKSB3aGVuZXZlciBhIGNsb3NlIGhhcHBlbnMgKmFueXdoZXJlKiBpbiB0aGUgcHJvZ3JhbS5cbi8vIFRoaXMgaXMgZXNzZW50aWFsIHdoZW4gbXVsdGlwbGUgZ3JhY2VmdWwtZnMgaW5zdGFuY2VzIGFyZVxuLy8gaW4gcGxheSBhdCB0aGUgc2FtZSB0aW1lLlxubW9kdWxlLmV4cG9ydHMuY2xvc2UgPVxuZnMuY2xvc2UgPSAoZnVuY3Rpb24gKGZzJGNsb3NlKSB7IHJldHVybiBmdW5jdGlvbiAoZmQsIGNiKSB7XG4gIHJldHVybiBmcyRjbG9zZS5jYWxsKGZzLCBmZCwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmICghZXJyKVxuICAgICAgcmV0cnkoKVxuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgfSlcbn19KShmcy5jbG9zZSlcblxubW9kdWxlLmV4cG9ydHMuY2xvc2VTeW5jID1cbmZzLmNsb3NlU3luYyA9IChmdW5jdGlvbiAoZnMkY2xvc2VTeW5jKSB7IHJldHVybiBmdW5jdGlvbiAoZmQpIHtcbiAgLy8gTm90ZSB0aGF0IGdyYWNlZnVsLWZzIGFsc28gcmV0cmllcyB3aGVuIGZzLmNsb3NlU3luYygpIGZhaWxzLlxuICAvLyBMb29rcyBsaWtlIGEgYnVnIHRvIG1lLCBhbHRob3VnaCBpdCdzIHByb2JhYmx5IGEgaGFybWxlc3Mgb25lLlxuICB2YXIgcnZhbCA9IGZzJGNsb3NlU3luYy5hcHBseShmcywgYXJndW1lbnRzKVxuICByZXRyeSgpXG4gIHJldHVybiBydmFsXG59fSkoZnMuY2xvc2VTeW5jKVxuXG5mdW5jdGlvbiBwYXRjaCAoZnMpIHtcbiAgLy8gRXZlcnl0aGluZyB0aGF0IHJlZmVyZW5jZXMgdGhlIG9wZW4oKSBmdW5jdGlvbiBuZWVkcyB0byBiZSBpbiBoZXJlXG4gIHBvbHlmaWxscyhmcylcbiAgZnMuZ3JhY2VmdWxpZnkgPSBwYXRjaFxuICBmcy5GaWxlUmVhZFN0cmVhbSA9IFJlYWRTdHJlYW07ICAvLyBMZWdhY3kgbmFtZS5cbiAgZnMuRmlsZVdyaXRlU3RyZWFtID0gV3JpdGVTdHJlYW07ICAvLyBMZWdhY3kgbmFtZS5cbiAgZnMuY3JlYXRlUmVhZFN0cmVhbSA9IGNyZWF0ZVJlYWRTdHJlYW1cbiAgZnMuY3JlYXRlV3JpdGVTdHJlYW0gPSBjcmVhdGVXcml0ZVN0cmVhbVxuICB2YXIgZnMkcmVhZEZpbGUgPSBmcy5yZWFkRmlsZVxuICBmcy5yZWFkRmlsZSA9IHJlYWRGaWxlXG4gIGZ1bmN0aW9uIHJlYWRGaWxlIChwYXRoLCBvcHRpb25zLCBjYikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgIGNiID0gb3B0aW9ucywgb3B0aW9ucyA9IG51bGxcblxuICAgIHJldHVybiBnbyRyZWFkRmlsZShwYXRoLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJHJlYWRGaWxlIChwYXRoLCBvcHRpb25zLCBjYikge1xuICAgICAgcmV0dXJuIGZzJHJlYWRGaWxlKHBhdGgsIG9wdGlvbnMsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciAmJiAoZXJyLmNvZGUgPT09ICdFTUZJTEUnIHx8IGVyci5jb2RlID09PSAnRU5GSUxFJykpXG4gICAgICAgICAgZW5xdWV1ZShbZ28kcmVhZEZpbGUsIFtwYXRoLCBvcHRpb25zLCBjYl1dKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJldHJ5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkd3JpdGVGaWxlID0gZnMud3JpdGVGaWxlXG4gIGZzLndyaXRlRmlsZSA9IHdyaXRlRmlsZVxuICBmdW5jdGlvbiB3cml0ZUZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKVxuICAgICAgY2IgPSBvcHRpb25zLCBvcHRpb25zID0gbnVsbFxuXG4gICAgcmV0dXJuIGdvJHdyaXRlRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJHdyaXRlRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpIHtcbiAgICAgIHJldHVybiBmcyR3cml0ZUZpbGUocGF0aCwgZGF0YSwgb3B0aW9ucywgZnVuY3Rpb24gKGVycikge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyR3cml0ZUZpbGUsIFtwYXRoLCBkYXRhLCBvcHRpb25zLCBjYl1dKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJldHJ5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkYXBwZW5kRmlsZSA9IGZzLmFwcGVuZEZpbGVcbiAgaWYgKGZzJGFwcGVuZEZpbGUpXG4gICAgZnMuYXBwZW5kRmlsZSA9IGFwcGVuZEZpbGVcbiAgZnVuY3Rpb24gYXBwZW5kRmlsZSAocGF0aCwgZGF0YSwgb3B0aW9ucywgY2IpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYiA9IG9wdGlvbnMsIG9wdGlvbnMgPSBudWxsXG5cbiAgICByZXR1cm4gZ28kYXBwZW5kRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBjYilcblxuICAgIGZ1bmN0aW9uIGdvJGFwcGVuZEZpbGUgKHBhdGgsIGRhdGEsIG9wdGlvbnMsIGNiKSB7XG4gICAgICByZXR1cm4gZnMkYXBwZW5kRmlsZShwYXRoLCBkYXRhLCBvcHRpb25zLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICAgIGVucXVldWUoW2dvJGFwcGVuZEZpbGUsIFtwYXRoLCBkYXRhLCBvcHRpb25zLCBjYl1dKVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICAgIHJldHJ5KClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICB2YXIgZnMkcmVhZGRpciA9IGZzLnJlYWRkaXJcbiAgZnMucmVhZGRpciA9IHJlYWRkaXJcbiAgZnVuY3Rpb24gcmVhZGRpciAocGF0aCwgb3B0aW9ucywgY2IpIHtcbiAgICB2YXIgYXJncyA9IFtwYXRoXVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJncy5wdXNoKG9wdGlvbnMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNiID0gb3B0aW9uc1xuICAgIH1cbiAgICBhcmdzLnB1c2goZ28kcmVhZGRpciRjYilcblxuICAgIHJldHVybiBnbyRyZWFkZGlyKGFyZ3MpXG5cbiAgICBmdW5jdGlvbiBnbyRyZWFkZGlyJGNiIChlcnIsIGZpbGVzKSB7XG4gICAgICBpZiAoZmlsZXMgJiYgZmlsZXMuc29ydClcbiAgICAgICAgZmlsZXMuc29ydCgpXG5cbiAgICAgIGlmIChlcnIgJiYgKGVyci5jb2RlID09PSAnRU1GSUxFJyB8fCBlcnIuY29kZSA9PT0gJ0VORklMRScpKVxuICAgICAgICBlbnF1ZXVlKFtnbyRyZWFkZGlyLCBbYXJnc11dKVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgICByZXRyeSgpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ28kcmVhZGRpciAoYXJncykge1xuICAgIHJldHVybiBmcyRyZWFkZGlyLmFwcGx5KGZzLCBhcmdzKVxuICB9XG5cbiAgaWYgKHByb2Nlc3MudmVyc2lvbi5zdWJzdHIoMCwgNCkgPT09ICd2MC44Jykge1xuICAgIHZhciBsZWdTdHJlYW1zID0gbGVnYWN5KGZzKVxuICAgIFJlYWRTdHJlYW0gPSBsZWdTdHJlYW1zLlJlYWRTdHJlYW1cbiAgICBXcml0ZVN0cmVhbSA9IGxlZ1N0cmVhbXMuV3JpdGVTdHJlYW1cbiAgfVxuXG4gIHZhciBmcyRSZWFkU3RyZWFtID0gZnMuUmVhZFN0cmVhbVxuICBSZWFkU3RyZWFtLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoZnMkUmVhZFN0cmVhbS5wcm90b3R5cGUpXG4gIFJlYWRTdHJlYW0ucHJvdG90eXBlLm9wZW4gPSBSZWFkU3RyZWFtJG9wZW5cblxuICB2YXIgZnMkV3JpdGVTdHJlYW0gPSBmcy5Xcml0ZVN0cmVhbVxuICBXcml0ZVN0cmVhbS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGZzJFdyaXRlU3RyZWFtLnByb3RvdHlwZSlcbiAgV3JpdGVTdHJlYW0ucHJvdG90eXBlLm9wZW4gPSBXcml0ZVN0cmVhbSRvcGVuXG5cbiAgZnMuUmVhZFN0cmVhbSA9IFJlYWRTdHJlYW1cbiAgZnMuV3JpdGVTdHJlYW0gPSBXcml0ZVN0cmVhbVxuXG4gIGZ1bmN0aW9uIFJlYWRTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFJlYWRTdHJlYW0pXG4gICAgICByZXR1cm4gZnMkUmVhZFN0cmVhbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLCB0aGlzXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFJlYWRTdHJlYW0uYXBwbHkoT2JqZWN0LmNyZWF0ZShSZWFkU3RyZWFtLnByb3RvdHlwZSksIGFyZ3VtZW50cylcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlYWRTdHJlYW0kb3BlbiAoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzXG4gICAgb3Blbih0aGF0LnBhdGgsIHRoYXQuZmxhZ3MsIHRoYXQubW9kZSwgZnVuY3Rpb24gKGVyciwgZmQpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKHRoYXQuYXV0b0Nsb3NlKVxuICAgICAgICAgIHRoYXQuZGVzdHJveSgpXG5cbiAgICAgICAgdGhhdC5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQuZmQgPSBmZFxuICAgICAgICB0aGF0LmVtaXQoJ29wZW4nLCBmZClcbiAgICAgICAgdGhhdC5yZWFkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gV3JpdGVTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFdyaXRlU3RyZWFtKVxuICAgICAgcmV0dXJuIGZzJFdyaXRlU3RyZWFtLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksIHRoaXNcbiAgICBlbHNlXG4gICAgICByZXR1cm4gV3JpdGVTdHJlYW0uYXBwbHkoT2JqZWN0LmNyZWF0ZShXcml0ZVN0cmVhbS5wcm90b3R5cGUpLCBhcmd1bWVudHMpXG4gIH1cblxuICBmdW5jdGlvbiBXcml0ZVN0cmVhbSRvcGVuICgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXNcbiAgICBvcGVuKHRoYXQucGF0aCwgdGhhdC5mbGFncywgdGhhdC5tb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGF0LmRlc3Ryb3koKVxuICAgICAgICB0aGF0LmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5mZCA9IGZkXG4gICAgICAgIHRoYXQuZW1pdCgnb3BlbicsIGZkKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVSZWFkU3RyZWFtIChwYXRoLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZWFkU3RyZWFtKHBhdGgsIG9wdGlvbnMpXG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVXcml0ZVN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgV3JpdGVTdHJlYW0ocGF0aCwgb3B0aW9ucylcbiAgfVxuXG4gIHZhciBmcyRvcGVuID0gZnMub3BlblxuICBmcy5vcGVuID0gb3BlblxuICBmdW5jdGlvbiBvcGVuIChwYXRoLCBmbGFncywgbW9kZSwgY2IpIHtcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdmdW5jdGlvbicpXG4gICAgICBjYiA9IG1vZGUsIG1vZGUgPSBudWxsXG5cbiAgICByZXR1cm4gZ28kb3BlbihwYXRoLCBmbGFncywgbW9kZSwgY2IpXG5cbiAgICBmdW5jdGlvbiBnbyRvcGVuIChwYXRoLCBmbGFncywgbW9kZSwgY2IpIHtcbiAgICAgIHJldHVybiBmcyRvcGVuKHBhdGgsIGZsYWdzLCBtb2RlLCBmdW5jdGlvbiAoZXJyLCBmZCkge1xuICAgICAgICBpZiAoZXJyICYmIChlcnIuY29kZSA9PT0gJ0VNRklMRScgfHwgZXJyLmNvZGUgPT09ICdFTkZJTEUnKSlcbiAgICAgICAgICBlbnF1ZXVlKFtnbyRvcGVuLCBbcGF0aCwgZmxhZ3MsIG1vZGUsIGNiXV0pXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBjYi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICAgICAgcmV0cnkoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmc1xufVxuXG5mdW5jdGlvbiBlbnF1ZXVlIChlbGVtKSB7XG4gIGRlYnVnKCdFTlFVRVVFJywgZWxlbVswXS5uYW1lLCBlbGVtWzFdKVxuICBxdWV1ZS5wdXNoKGVsZW0pXG59XG5cbmZ1bmN0aW9uIHJldHJ5ICgpIHtcbiAgdmFyIGVsZW0gPSBxdWV1ZS5zaGlmdCgpXG4gIGlmIChlbGVtKSB7XG4gICAgZGVidWcoJ1JFVFJZJywgZWxlbVswXS5uYW1lLCBlbGVtWzFdKVxuICAgIGVsZW1bMF0uYXBwbHkobnVsbCwgZWxlbVsxXSlcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/graceful-fs/graceful-fs.js\n");

/***/ }),

/***/ "./node_modules/graceful-fs/legacy-streams.js":
/*!****************************************************!*\
  !*** ./node_modules/graceful-fs/legacy-streams.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var Stream = __webpack_require__(/*! stream */ \"stream\").Stream\n\nmodule.exports = legacy\n\nfunction legacy (fs) {\n  return {\n    ReadStream: ReadStream,\n    WriteStream: WriteStream\n  }\n\n  function ReadStream (path, options) {\n    if (!(this instanceof ReadStream)) return new ReadStream(path, options);\n\n    Stream.call(this);\n\n    var self = this;\n\n    this.path = path;\n    this.fd = null;\n    this.readable = true;\n    this.paused = false;\n\n    this.flags = 'r';\n    this.mode = 438; /*=0666*/\n    this.bufferSize = 64 * 1024;\n\n    options = options || {};\n\n    // Mixin options into this\n    var keys = Object.keys(options);\n    for (var index = 0, length = keys.length; index < length; index++) {\n      var key = keys[index];\n      this[key] = options[key];\n    }\n\n    if (this.encoding) this.setEncoding(this.encoding);\n\n    if (this.start !== undefined) {\n      if ('number' !== typeof this.start) {\n        throw TypeError('start must be a Number');\n      }\n      if (this.end === undefined) {\n        this.end = Infinity;\n      } else if ('number' !== typeof this.end) {\n        throw TypeError('end must be a Number');\n      }\n\n      if (this.start > this.end) {\n        throw new Error('start must be <= end');\n      }\n\n      this.pos = this.start;\n    }\n\n    if (this.fd !== null) {\n      process.nextTick(function() {\n        self._read();\n      });\n      return;\n    }\n\n    fs.open(this.path, this.flags, this.mode, function (err, fd) {\n      if (err) {\n        self.emit('error', err);\n        self.readable = false;\n        return;\n      }\n\n      self.fd = fd;\n      self.emit('open', fd);\n      self._read();\n    })\n  }\n\n  function WriteStream (path, options) {\n    if (!(this instanceof WriteStream)) return new WriteStream(path, options);\n\n    Stream.call(this);\n\n    this.path = path;\n    this.fd = null;\n    this.writable = true;\n\n    this.flags = 'w';\n    this.encoding = 'binary';\n    this.mode = 438; /*=0666*/\n    this.bytesWritten = 0;\n\n    options = options || {};\n\n    // Mixin options into this\n    var keys = Object.keys(options);\n    for (var index = 0, length = keys.length; index < length; index++) {\n      var key = keys[index];\n      this[key] = options[key];\n    }\n\n    if (this.start !== undefined) {\n      if ('number' !== typeof this.start) {\n        throw TypeError('start must be a Number');\n      }\n      if (this.start < 0) {\n        throw new Error('start must be >= zero');\n      }\n\n      this.pos = this.start;\n    }\n\n    this.busy = false;\n    this._queue = [];\n\n    if (this.fd === null) {\n      this._open = fs.open;\n      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);\n      this.flush();\n    }\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvbGVnYWN5LXN0cmVhbXMuanM/YzAyZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0I7QUFDcEI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZDQUE2QyxnQkFBZ0I7QUFDN0Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLGdCQUFnQjtBQUM3RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2dyYWNlZnVsLWZzL2xlZ2FjeS1zdHJlYW1zLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpLlN0cmVhbVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxlZ2FjeVxuXG5mdW5jdGlvbiBsZWdhY3kgKGZzKSB7XG4gIHJldHVybiB7XG4gICAgUmVhZFN0cmVhbTogUmVhZFN0cmVhbSxcbiAgICBXcml0ZVN0cmVhbTogV3JpdGVTdHJlYW1cbiAgfVxuXG4gIGZ1bmN0aW9uIFJlYWRTdHJlYW0gKHBhdGgsIG9wdGlvbnMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVhZFN0cmVhbSkpIHJldHVybiBuZXcgUmVhZFN0cmVhbShwYXRoLCBvcHRpb25zKTtcblxuICAgIFN0cmVhbS5jYWxsKHRoaXMpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLmZkID0gbnVsbDtcbiAgICB0aGlzLnJlYWRhYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5mbGFncyA9ICdyJztcbiAgICB0aGlzLm1vZGUgPSA0Mzg7IC8qPTA2NjYqL1xuICAgIHRoaXMuYnVmZmVyU2l6ZSA9IDY0ICogMTAyNDtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gTWl4aW4gb3B0aW9ucyBpbnRvIHRoaXNcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5jb2RpbmcpIHRoaXMuc2V0RW5jb2RpbmcodGhpcy5lbmNvZGluZyk7XG5cbiAgICBpZiAodGhpcy5zdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoJ251bWJlcicgIT09IHR5cGVvZiB0aGlzLnN0YXJ0KSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignc3RhcnQgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5lbmQgPSBJbmZpbml0eTtcbiAgICAgIH0gZWxzZSBpZiAoJ251bWJlcicgIT09IHR5cGVvZiB0aGlzLmVuZCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ2VuZCBtdXN0IGJlIGEgTnVtYmVyJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnN0YXJ0ID4gdGhpcy5lbmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzdGFydCBtdXN0IGJlIDw9IGVuZCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvcyA9IHRoaXMuc3RhcnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZmQgIT09IG51bGwpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYuX3JlYWQoKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZzLm9wZW4odGhpcy5wYXRoLCB0aGlzLmZsYWdzLCB0aGlzLm1vZGUsIGZ1bmN0aW9uIChlcnIsIGZkKSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHNlbGYuZW1pdCgnZXJyb3InLCBlcnIpO1xuICAgICAgICBzZWxmLnJlYWRhYmxlID0gZmFsc2U7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5mZCA9IGZkO1xuICAgICAgc2VsZi5lbWl0KCdvcGVuJywgZmQpO1xuICAgICAgc2VsZi5fcmVhZCgpO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBXcml0ZVN0cmVhbSAocGF0aCwgb3B0aW9ucykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBXcml0ZVN0cmVhbSkpIHJldHVybiBuZXcgV3JpdGVTdHJlYW0ocGF0aCwgb3B0aW9ucyk7XG5cbiAgICBTdHJlYW0uY2FsbCh0aGlzKTtcblxuICAgIHRoaXMucGF0aCA9IHBhdGg7XG4gICAgdGhpcy5mZCA9IG51bGw7XG4gICAgdGhpcy53cml0YWJsZSA9IHRydWU7XG5cbiAgICB0aGlzLmZsYWdzID0gJ3cnO1xuICAgIHRoaXMuZW5jb2RpbmcgPSAnYmluYXJ5JztcbiAgICB0aGlzLm1vZGUgPSA0Mzg7IC8qPTA2NjYqL1xuICAgIHRoaXMuYnl0ZXNXcml0dGVuID0gMDtcblxuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gTWl4aW4gb3B0aW9ucyBpbnRvIHRoaXNcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9wdGlvbnMpO1xuICAgIGZvciAodmFyIGluZGV4ID0gMCwgbGVuZ3RoID0ga2V5cy5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICB0aGlzW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCdudW1iZXInICE9PSB0eXBlb2YgdGhpcy5zdGFydCkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ3N0YXJ0IG11c3QgYmUgYSBOdW1iZXInKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXJ0IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YXJ0IG11c3QgYmUgPj0gemVybycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvcyA9IHRoaXMuc3RhcnQ7XG4gICAgfVxuXG4gICAgdGhpcy5idXN5ID0gZmFsc2U7XG4gICAgdGhpcy5fcXVldWUgPSBbXTtcblxuICAgIGlmICh0aGlzLmZkID09PSBudWxsKSB7XG4gICAgICB0aGlzLl9vcGVuID0gZnMub3BlbjtcbiAgICAgIHRoaXMuX3F1ZXVlLnB1c2goW3RoaXMuX29wZW4sIHRoaXMucGF0aCwgdGhpcy5mbGFncywgdGhpcy5tb2RlLCB1bmRlZmluZWRdKTtcbiAgICAgIHRoaXMuZmx1c2goKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./node_modules/graceful-fs/legacy-streams.js\n");

/***/ }),

/***/ "./node_modules/graceful-fs/polyfills.js":
/*!***********************************************!*\
  !*** ./node_modules/graceful-fs/polyfills.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var fs = __webpack_require__(/*! ./fs.js */ \"./node_modules/graceful-fs/fs.js\")\nvar constants = __webpack_require__(/*! constants */ \"constants\")\n\nvar origCwd = process.cwd\nvar cwd = null\n\nvar platform = process.env.GRACEFUL_FS_PLATFORM || process.platform\n\nprocess.cwd = function() {\n  if (!cwd)\n    cwd = origCwd.call(process)\n  return cwd\n}\ntry {\n  process.cwd()\n} catch (er) {}\n\nvar chdir = process.chdir\nprocess.chdir = function(d) {\n  cwd = null\n  chdir.call(process, d)\n}\n\nmodule.exports = patch\n\nfunction patch (fs) {\n  // (re-)implement some things that are known busted or missing.\n\n  // lchmod, broken prior to 0.6.2\n  // back-port the fix here.\n  if (constants.hasOwnProperty('O_SYMLINK') &&\n      process.version.match(/^v0\\.6\\.[0-2]|^v0\\.5\\./)) {\n    patchLchmod(fs)\n  }\n\n  // lutimes implementation, or no-op\n  if (!fs.lutimes) {\n    patchLutimes(fs)\n  }\n\n  // https://github.com/isaacs/node-graceful-fs/issues/4\n  // Chown should not fail on einval or eperm if non-root.\n  // It should not fail on enosys ever, as this just indicates\n  // that a fs doesn't support the intended operation.\n\n  fs.chown = chownFix(fs.chown)\n  fs.fchown = chownFix(fs.fchown)\n  fs.lchown = chownFix(fs.lchown)\n\n  fs.chmod = chmodFix(fs.chmod)\n  fs.fchmod = chmodFix(fs.fchmod)\n  fs.lchmod = chmodFix(fs.lchmod)\n\n  fs.chownSync = chownFixSync(fs.chownSync)\n  fs.fchownSync = chownFixSync(fs.fchownSync)\n  fs.lchownSync = chownFixSync(fs.lchownSync)\n\n  fs.chmodSync = chmodFixSync(fs.chmodSync)\n  fs.fchmodSync = chmodFixSync(fs.fchmodSync)\n  fs.lchmodSync = chmodFixSync(fs.lchmodSync)\n\n  fs.stat = statFix(fs.stat)\n  fs.fstat = statFix(fs.fstat)\n  fs.lstat = statFix(fs.lstat)\n\n  fs.statSync = statFixSync(fs.statSync)\n  fs.fstatSync = statFixSync(fs.fstatSync)\n  fs.lstatSync = statFixSync(fs.lstatSync)\n\n  // if lchmod/lchown do not exist, then make them no-ops\n  if (!fs.lchmod) {\n    fs.lchmod = function (path, mode, cb) {\n      if (cb) process.nextTick(cb)\n    }\n    fs.lchmodSync = function () {}\n  }\n  if (!fs.lchown) {\n    fs.lchown = function (path, uid, gid, cb) {\n      if (cb) process.nextTick(cb)\n    }\n    fs.lchownSync = function () {}\n  }\n\n  // on Windows, A/V software can lock the directory, causing this\n  // to fail with an EACCES or EPERM if the directory contains newly\n  // created files.  Try again on failure, for up to 60 seconds.\n\n  // Set the timeout this long because some Windows Anti-Virus, such as Parity\n  // bit9, may lock files for up to a minute, causing npm package install\n  // failures. Also, take care to yield the scheduler. Windows scheduling gives\n  // CPU to a busy looping process, which can cause the program causing the lock\n  // contention to be starved of CPU by node, so the contention doesn't resolve.\n  if (platform === \"win32\") {\n    fs.rename = (function (fs$rename) { return function (from, to, cb) {\n      var start = Date.now()\n      var backoff = 0;\n      fs$rename(from, to, function CB (er) {\n        if (er\n            && (er.code === \"EACCES\" || er.code === \"EPERM\")\n            && Date.now() - start < 60000) {\n          setTimeout(function() {\n            fs.stat(to, function (stater, st) {\n              if (stater && stater.code === \"ENOENT\")\n                fs$rename(from, to, CB);\n              else\n                cb(er)\n            })\n          }, backoff)\n          if (backoff < 100)\n            backoff += 10;\n          return;\n        }\n        if (cb) cb(er)\n      })\n    }})(fs.rename)\n  }\n\n  // if read() returns EAGAIN, then just try it again.\n  fs.read = (function (fs$read) { return function (fd, buffer, offset, length, position, callback_) {\n    var callback\n    if (callback_ && typeof callback_ === 'function') {\n      var eagCounter = 0\n      callback = function (er, _, __) {\n        if (er && er.code === 'EAGAIN' && eagCounter < 10) {\n          eagCounter ++\n          return fs$read.call(fs, fd, buffer, offset, length, position, callback)\n        }\n        callback_.apply(this, arguments)\n      }\n    }\n    return fs$read.call(fs, fd, buffer, offset, length, position, callback)\n  }})(fs.read)\n\n  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {\n    var eagCounter = 0\n    while (true) {\n      try {\n        return fs$readSync.call(fs, fd, buffer, offset, length, position)\n      } catch (er) {\n        if (er.code === 'EAGAIN' && eagCounter < 10) {\n          eagCounter ++\n          continue\n        }\n        throw er\n      }\n    }\n  }})(fs.readSync)\n}\n\nfunction patchLchmod (fs) {\n  fs.lchmod = function (path, mode, callback) {\n    fs.open( path\n           , constants.O_WRONLY | constants.O_SYMLINK\n           , mode\n           , function (err, fd) {\n      if (err) {\n        if (callback) callback(err)\n        return\n      }\n      // prefer to return the chmod error, if one occurs,\n      // but still try to close, and report closing errors if they occur.\n      fs.fchmod(fd, mode, function (err) {\n        fs.close(fd, function(err2) {\n          if (callback) callback(err || err2)\n        })\n      })\n    })\n  }\n\n  fs.lchmodSync = function (path, mode) {\n    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)\n\n    // prefer to return the chmod error, if one occurs,\n    // but still try to close, and report closing errors if they occur.\n    var threw = true\n    var ret\n    try {\n      ret = fs.fchmodSync(fd, mode)\n      threw = false\n    } finally {\n      if (threw) {\n        try {\n          fs.closeSync(fd)\n        } catch (er) {}\n      } else {\n        fs.closeSync(fd)\n      }\n    }\n    return ret\n  }\n}\n\nfunction patchLutimes (fs) {\n  if (constants.hasOwnProperty(\"O_SYMLINK\")) {\n    fs.lutimes = function (path, at, mt, cb) {\n      fs.open(path, constants.O_SYMLINK, function (er, fd) {\n        if (er) {\n          if (cb) cb(er)\n          return\n        }\n        fs.futimes(fd, at, mt, function (er) {\n          fs.close(fd, function (er2) {\n            if (cb) cb(er || er2)\n          })\n        })\n      })\n    }\n\n    fs.lutimesSync = function (path, at, mt) {\n      var fd = fs.openSync(path, constants.O_SYMLINK)\n      var ret\n      var threw = true\n      try {\n        ret = fs.futimesSync(fd, at, mt)\n        threw = false\n      } finally {\n        if (threw) {\n          try {\n            fs.closeSync(fd)\n          } catch (er) {}\n        } else {\n          fs.closeSync(fd)\n        }\n      }\n      return ret\n    }\n\n  } else {\n    fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }\n    fs.lutimesSync = function () {}\n  }\n}\n\nfunction chmodFix (orig) {\n  if (!orig) return orig\n  return function (target, mode, cb) {\n    return orig.call(fs, target, mode, function (er) {\n      if (chownErOk(er)) er = null\n      if (cb) cb.apply(this, arguments)\n    })\n  }\n}\n\nfunction chmodFixSync (orig) {\n  if (!orig) return orig\n  return function (target, mode) {\n    try {\n      return orig.call(fs, target, mode)\n    } catch (er) {\n      if (!chownErOk(er)) throw er\n    }\n  }\n}\n\n\nfunction chownFix (orig) {\n  if (!orig) return orig\n  return function (target, uid, gid, cb) {\n    return orig.call(fs, target, uid, gid, function (er) {\n      if (chownErOk(er)) er = null\n      if (cb) cb.apply(this, arguments)\n    })\n  }\n}\n\nfunction chownFixSync (orig) {\n  if (!orig) return orig\n  return function (target, uid, gid) {\n    try {\n      return orig.call(fs, target, uid, gid)\n    } catch (er) {\n      if (!chownErOk(er)) throw er\n    }\n  }\n}\n\n\nfunction statFix (orig) {\n  if (!orig) return orig\n  // Older versions of Node erroneously returned signed integers for\n  // uid + gid.\n  return function (target, cb) {\n    return orig.call(fs, target, function (er, stats) {\n      if (!stats) return cb.apply(this, arguments)\n      if (stats.uid < 0) stats.uid += 0x100000000\n      if (stats.gid < 0) stats.gid += 0x100000000\n      if (cb) cb.apply(this, arguments)\n    })\n  }\n}\n\nfunction statFixSync (orig) {\n  if (!orig) return orig\n  // Older versions of Node erroneously returned signed integers for\n  // uid + gid.\n  return function (target) {\n    var stats = orig.call(fs, target)\n    if (stats.uid < 0) stats.uid += 0x100000000\n    if (stats.gid < 0) stats.gid += 0x100000000\n    return stats;\n  }\n}\n\n// ENOSYS means that the fs doesn't support the op. Just ignore\n// that, because it doesn't matter.\n//\n// if there's no getuid, or if getuid() is something other\n// than 0, and the error is EINVAL or EPERM, then just ignore\n// it.\n//\n// This specific case is a silent failure in cp, install, tar,\n// and most other unix tools that manage permissions.\n//\n// When running as root, or if other types of errors are\n// encountered, then it's strict.\nfunction chownErOk (er) {\n  if (!er)\n    return true\n\n  if (er.code === \"ENOSYS\")\n    return true\n\n  var nonroot = !process.getuid || process.getuid() !== 0\n  if (nonroot) {\n    if (er.code === \"EINVAL\" || er.code === \"EPERM\")\n      return true\n  }\n\n  return false\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZ3JhY2VmdWwtZnMvcG9seWZpbGxzLmpzP2EwYTMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE1BQU07QUFDTjs7QUFFQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNULE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNILDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9ncmFjZWZ1bC1mcy9wb2x5ZmlsbHMuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCcuL2ZzLmpzJylcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCdjb25zdGFudHMnKVxuXG52YXIgb3JpZ0N3ZCA9IHByb2Nlc3MuY3dkXG52YXIgY3dkID0gbnVsbFxuXG52YXIgcGxhdGZvcm0gPSBwcm9jZXNzLmVudi5HUkFDRUZVTF9GU19QTEFURk9STSB8fCBwcm9jZXNzLnBsYXRmb3JtXG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24oKSB7XG4gIGlmICghY3dkKVxuICAgIGN3ZCA9IG9yaWdDd2QuY2FsbChwcm9jZXNzKVxuICByZXR1cm4gY3dkXG59XG50cnkge1xuICBwcm9jZXNzLmN3ZCgpXG59IGNhdGNoIChlcikge31cblxudmFyIGNoZGlyID0gcHJvY2Vzcy5jaGRpclxucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uKGQpIHtcbiAgY3dkID0gbnVsbFxuICBjaGRpci5jYWxsKHByb2Nlc3MsIGQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hcblxuZnVuY3Rpb24gcGF0Y2ggKGZzKSB7XG4gIC8vIChyZS0paW1wbGVtZW50IHNvbWUgdGhpbmdzIHRoYXQgYXJlIGtub3duIGJ1c3RlZCBvciBtaXNzaW5nLlxuXG4gIC8vIGxjaG1vZCwgYnJva2VuIHByaW9yIHRvIDAuNi4yXG4gIC8vIGJhY2stcG9ydCB0aGUgZml4IGhlcmUuXG4gIGlmIChjb25zdGFudHMuaGFzT3duUHJvcGVydHkoJ09fU1lNTElOSycpICYmXG4gICAgICBwcm9jZXNzLnZlcnNpb24ubWF0Y2goL152MFxcLjZcXC5bMC0yXXxedjBcXC41XFwuLykpIHtcbiAgICBwYXRjaExjaG1vZChmcylcbiAgfVxuXG4gIC8vIGx1dGltZXMgaW1wbGVtZW50YXRpb24sIG9yIG5vLW9wXG4gIGlmICghZnMubHV0aW1lcykge1xuICAgIHBhdGNoTHV0aW1lcyhmcylcbiAgfVxuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pc2FhY3Mvbm9kZS1ncmFjZWZ1bC1mcy9pc3N1ZXMvNFxuICAvLyBDaG93biBzaG91bGQgbm90IGZhaWwgb24gZWludmFsIG9yIGVwZXJtIGlmIG5vbi1yb290LlxuICAvLyBJdCBzaG91bGQgbm90IGZhaWwgb24gZW5vc3lzIGV2ZXIsIGFzIHRoaXMganVzdCBpbmRpY2F0ZXNcbiAgLy8gdGhhdCBhIGZzIGRvZXNuJ3Qgc3VwcG9ydCB0aGUgaW50ZW5kZWQgb3BlcmF0aW9uLlxuXG4gIGZzLmNob3duID0gY2hvd25GaXgoZnMuY2hvd24pXG4gIGZzLmZjaG93biA9IGNob3duRml4KGZzLmZjaG93bilcbiAgZnMubGNob3duID0gY2hvd25GaXgoZnMubGNob3duKVxuXG4gIGZzLmNobW9kID0gY2htb2RGaXgoZnMuY2htb2QpXG4gIGZzLmZjaG1vZCA9IGNobW9kRml4KGZzLmZjaG1vZClcbiAgZnMubGNobW9kID0gY2htb2RGaXgoZnMubGNobW9kKVxuXG4gIGZzLmNob3duU3luYyA9IGNob3duRml4U3luYyhmcy5jaG93blN5bmMpXG4gIGZzLmZjaG93blN5bmMgPSBjaG93bkZpeFN5bmMoZnMuZmNob3duU3luYylcbiAgZnMubGNob3duU3luYyA9IGNob3duRml4U3luYyhmcy5sY2hvd25TeW5jKVxuXG4gIGZzLmNobW9kU3luYyA9IGNobW9kRml4U3luYyhmcy5jaG1vZFN5bmMpXG4gIGZzLmZjaG1vZFN5bmMgPSBjaG1vZEZpeFN5bmMoZnMuZmNobW9kU3luYylcbiAgZnMubGNobW9kU3luYyA9IGNobW9kRml4U3luYyhmcy5sY2htb2RTeW5jKVxuXG4gIGZzLnN0YXQgPSBzdGF0Rml4KGZzLnN0YXQpXG4gIGZzLmZzdGF0ID0gc3RhdEZpeChmcy5mc3RhdClcbiAgZnMubHN0YXQgPSBzdGF0Rml4KGZzLmxzdGF0KVxuXG4gIGZzLnN0YXRTeW5jID0gc3RhdEZpeFN5bmMoZnMuc3RhdFN5bmMpXG4gIGZzLmZzdGF0U3luYyA9IHN0YXRGaXhTeW5jKGZzLmZzdGF0U3luYylcbiAgZnMubHN0YXRTeW5jID0gc3RhdEZpeFN5bmMoZnMubHN0YXRTeW5jKVxuXG4gIC8vIGlmIGxjaG1vZC9sY2hvd24gZG8gbm90IGV4aXN0LCB0aGVuIG1ha2UgdGhlbSBuby1vcHNcbiAgaWYgKCFmcy5sY2htb2QpIHtcbiAgICBmcy5sY2htb2QgPSBmdW5jdGlvbiAocGF0aCwgbW9kZSwgY2IpIHtcbiAgICAgIGlmIChjYikgcHJvY2Vzcy5uZXh0VGljayhjYilcbiAgICB9XG4gICAgZnMubGNobW9kU3luYyA9IGZ1bmN0aW9uICgpIHt9XG4gIH1cbiAgaWYgKCFmcy5sY2hvd24pIHtcbiAgICBmcy5sY2hvd24gPSBmdW5jdGlvbiAocGF0aCwgdWlkLCBnaWQsIGNiKSB7XG4gICAgICBpZiAoY2IpIHByb2Nlc3MubmV4dFRpY2soY2IpXG4gICAgfVxuICAgIGZzLmxjaG93blN5bmMgPSBmdW5jdGlvbiAoKSB7fVxuICB9XG5cbiAgLy8gb24gV2luZG93cywgQS9WIHNvZnR3YXJlIGNhbiBsb2NrIHRoZSBkaXJlY3RvcnksIGNhdXNpbmcgdGhpc1xuICAvLyB0byBmYWlsIHdpdGggYW4gRUFDQ0VTIG9yIEVQRVJNIGlmIHRoZSBkaXJlY3RvcnkgY29udGFpbnMgbmV3bHlcbiAgLy8gY3JlYXRlZCBmaWxlcy4gIFRyeSBhZ2FpbiBvbiBmYWlsdXJlLCBmb3IgdXAgdG8gNjAgc2Vjb25kcy5cblxuICAvLyBTZXQgdGhlIHRpbWVvdXQgdGhpcyBsb25nIGJlY2F1c2Ugc29tZSBXaW5kb3dzIEFudGktVmlydXMsIHN1Y2ggYXMgUGFyaXR5XG4gIC8vIGJpdDksIG1heSBsb2NrIGZpbGVzIGZvciB1cCB0byBhIG1pbnV0ZSwgY2F1c2luZyBucG0gcGFja2FnZSBpbnN0YWxsXG4gIC8vIGZhaWx1cmVzLiBBbHNvLCB0YWtlIGNhcmUgdG8geWllbGQgdGhlIHNjaGVkdWxlci4gV2luZG93cyBzY2hlZHVsaW5nIGdpdmVzXG4gIC8vIENQVSB0byBhIGJ1c3kgbG9vcGluZyBwcm9jZXNzLCB3aGljaCBjYW4gY2F1c2UgdGhlIHByb2dyYW0gY2F1c2luZyB0aGUgbG9ja1xuICAvLyBjb250ZW50aW9uIHRvIGJlIHN0YXJ2ZWQgb2YgQ1BVIGJ5IG5vZGUsIHNvIHRoZSBjb250ZW50aW9uIGRvZXNuJ3QgcmVzb2x2ZS5cbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcbiAgICBmcy5yZW5hbWUgPSAoZnVuY3Rpb24gKGZzJHJlbmFtZSkgeyByZXR1cm4gZnVuY3Rpb24gKGZyb20sIHRvLCBjYikge1xuICAgICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKVxuICAgICAgdmFyIGJhY2tvZmYgPSAwO1xuICAgICAgZnMkcmVuYW1lKGZyb20sIHRvLCBmdW5jdGlvbiBDQiAoZXIpIHtcbiAgICAgICAgaWYgKGVyXG4gICAgICAgICAgICAmJiAoZXIuY29kZSA9PT0gXCJFQUNDRVNcIiB8fCBlci5jb2RlID09PSBcIkVQRVJNXCIpXG4gICAgICAgICAgICAmJiBEYXRlLm5vdygpIC0gc3RhcnQgPCA2MDAwMCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBmcy5zdGF0KHRvLCBmdW5jdGlvbiAoc3RhdGVyLCBzdCkge1xuICAgICAgICAgICAgICBpZiAoc3RhdGVyICYmIHN0YXRlci5jb2RlID09PSBcIkVOT0VOVFwiKVxuICAgICAgICAgICAgICAgIGZzJHJlbmFtZShmcm9tLCB0bywgQ0IpO1xuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY2IoZXIpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sIGJhY2tvZmYpXG4gICAgICAgICAgaWYgKGJhY2tvZmYgPCAxMDApXG4gICAgICAgICAgICBiYWNrb2ZmICs9IDEwO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2IpIGNiKGVyKVxuICAgICAgfSlcbiAgICB9fSkoZnMucmVuYW1lKVxuICB9XG5cbiAgLy8gaWYgcmVhZCgpIHJldHVybnMgRUFHQUlOLCB0aGVuIGp1c3QgdHJ5IGl0IGFnYWluLlxuICBmcy5yZWFkID0gKGZ1bmN0aW9uIChmcyRyZWFkKSB7IHJldHVybiBmdW5jdGlvbiAoZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uLCBjYWxsYmFja18pIHtcbiAgICB2YXIgY2FsbGJhY2tcbiAgICBpZiAoY2FsbGJhY2tfICYmIHR5cGVvZiBjYWxsYmFja18gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBlYWdDb3VudGVyID0gMFxuICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbiAoZXIsIF8sIF9fKSB7XG4gICAgICAgIGlmIChlciAmJiBlci5jb2RlID09PSAnRUFHQUlOJyAmJiBlYWdDb3VudGVyIDwgMTApIHtcbiAgICAgICAgICBlYWdDb3VudGVyICsrXG4gICAgICAgICAgcmV0dXJuIGZzJHJlYWQuY2FsbChmcywgZmQsIGJ1ZmZlciwgb2Zmc2V0LCBsZW5ndGgsIHBvc2l0aW9uLCBjYWxsYmFjaylcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFja18uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZnMkcmVhZC5jYWxsKGZzLCBmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24sIGNhbGxiYWNrKVxuICB9fSkoZnMucmVhZClcblxuICBmcy5yZWFkU3luYyA9IChmdW5jdGlvbiAoZnMkcmVhZFN5bmMpIHsgcmV0dXJuIGZ1bmN0aW9uIChmZCwgYnVmZmVyLCBvZmZzZXQsIGxlbmd0aCwgcG9zaXRpb24pIHtcbiAgICB2YXIgZWFnQ291bnRlciA9IDBcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGZzJHJlYWRTeW5jLmNhbGwoZnMsIGZkLCBidWZmZXIsIG9mZnNldCwgbGVuZ3RoLCBwb3NpdGlvbilcbiAgICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICAgIGlmIChlci5jb2RlID09PSAnRUFHQUlOJyAmJiBlYWdDb3VudGVyIDwgMTApIHtcbiAgICAgICAgICBlYWdDb3VudGVyICsrXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBlclxuICAgICAgfVxuICAgIH1cbiAgfX0pKGZzLnJlYWRTeW5jKVxufVxuXG5mdW5jdGlvbiBwYXRjaExjaG1vZCAoZnMpIHtcbiAgZnMubGNobW9kID0gZnVuY3Rpb24gKHBhdGgsIG1vZGUsIGNhbGxiYWNrKSB7XG4gICAgZnMub3BlbiggcGF0aFxuICAgICAgICAgICAsIGNvbnN0YW50cy5PX1dST05MWSB8IGNvbnN0YW50cy5PX1NZTUxJTktcbiAgICAgICAgICAgLCBtb2RlXG4gICAgICAgICAgICwgZnVuY3Rpb24gKGVyciwgZmQpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhlcnIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgLy8gcHJlZmVyIHRvIHJldHVybiB0aGUgY2htb2QgZXJyb3IsIGlmIG9uZSBvY2N1cnMsXG4gICAgICAvLyBidXQgc3RpbGwgdHJ5IHRvIGNsb3NlLCBhbmQgcmVwb3J0IGNsb3NpbmcgZXJyb3JzIGlmIHRoZXkgb2NjdXIuXG4gICAgICBmcy5mY2htb2QoZmQsIG1vZGUsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgZnMuY2xvc2UoZmQsIGZ1bmN0aW9uKGVycjIpIHtcbiAgICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKGVyciB8fCBlcnIyKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgZnMubGNobW9kU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBtb2RlKSB7XG4gICAgdmFyIGZkID0gZnMub3BlblN5bmMocGF0aCwgY29uc3RhbnRzLk9fV1JPTkxZIHwgY29uc3RhbnRzLk9fU1lNTElOSywgbW9kZSlcblxuICAgIC8vIHByZWZlciB0byByZXR1cm4gdGhlIGNobW9kIGVycm9yLCBpZiBvbmUgb2NjdXJzLFxuICAgIC8vIGJ1dCBzdGlsbCB0cnkgdG8gY2xvc2UsIGFuZCByZXBvcnQgY2xvc2luZyBlcnJvcnMgaWYgdGhleSBvY2N1ci5cbiAgICB2YXIgdGhyZXcgPSB0cnVlXG4gICAgdmFyIHJldFxuICAgIHRyeSB7XG4gICAgICByZXQgPSBmcy5mY2htb2RTeW5jKGZkLCBtb2RlKVxuICAgICAgdGhyZXcgPSBmYWxzZVxuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAodGhyZXcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmcy5jbG9zZVN5bmMoZmQpXG4gICAgICAgIH0gY2F0Y2ggKGVyKSB7fVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cblxuZnVuY3Rpb24gcGF0Y2hMdXRpbWVzIChmcykge1xuICBpZiAoY29uc3RhbnRzLmhhc093blByb3BlcnR5KFwiT19TWU1MSU5LXCIpKSB7XG4gICAgZnMubHV0aW1lcyA9IGZ1bmN0aW9uIChwYXRoLCBhdCwgbXQsIGNiKSB7XG4gICAgICBmcy5vcGVuKHBhdGgsIGNvbnN0YW50cy5PX1NZTUxJTkssIGZ1bmN0aW9uIChlciwgZmQpIHtcbiAgICAgICAgaWYgKGVyKSB7XG4gICAgICAgICAgaWYgKGNiKSBjYihlcilcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBmcy5mdXRpbWVzKGZkLCBhdCwgbXQsIGZ1bmN0aW9uIChlcikge1xuICAgICAgICAgIGZzLmNsb3NlKGZkLCBmdW5jdGlvbiAoZXIyKSB7XG4gICAgICAgICAgICBpZiAoY2IpIGNiKGVyIHx8IGVyMilcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBmcy5sdXRpbWVzU3luYyA9IGZ1bmN0aW9uIChwYXRoLCBhdCwgbXQpIHtcbiAgICAgIHZhciBmZCA9IGZzLm9wZW5TeW5jKHBhdGgsIGNvbnN0YW50cy5PX1NZTUxJTkspXG4gICAgICB2YXIgcmV0XG4gICAgICB2YXIgdGhyZXcgPSB0cnVlXG4gICAgICB0cnkge1xuICAgICAgICByZXQgPSBmcy5mdXRpbWVzU3luYyhmZCwgYXQsIG10KVxuICAgICAgICB0aHJldyA9IGZhbHNlXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAodGhyZXcpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZnMuY2xvc2VTeW5jKGZkKVxuICAgICAgICAgIH0gY2F0Y2ggKGVyKSB7fVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZzLmNsb3NlU3luYyhmZClcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldFxuICAgIH1cblxuICB9IGVsc2Uge1xuICAgIGZzLmx1dGltZXMgPSBmdW5jdGlvbiAoX2EsIF9iLCBfYywgY2IpIHsgaWYgKGNiKSBwcm9jZXNzLm5leHRUaWNrKGNiKSB9XG4gICAgZnMubHV0aW1lc1N5bmMgPSBmdW5jdGlvbiAoKSB7fVxuICB9XG59XG5cbmZ1bmN0aW9uIGNobW9kRml4IChvcmlnKSB7XG4gIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIG1vZGUsIGNiKSB7XG4gICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCBtb2RlLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgIGlmIChjaG93bkVyT2soZXIpKSBlciA9IG51bGxcbiAgICAgIGlmIChjYikgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gY2htb2RGaXhTeW5jIChvcmlnKSB7XG4gIGlmICghb3JpZykgcmV0dXJuIG9yaWdcbiAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIG1vZGUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCBtb2RlKVxuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICBpZiAoIWNob3duRXJPayhlcikpIHRocm93IGVyXG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gY2hvd25GaXggKG9yaWcpIHtcbiAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwgdWlkLCBnaWQsIGNiKSB7XG4gICAgcmV0dXJuIG9yaWcuY2FsbChmcywgdGFyZ2V0LCB1aWQsIGdpZCwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICBpZiAoY2hvd25Fck9rKGVyKSkgZXIgPSBudWxsXG4gICAgICBpZiAoY2IpIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIGNob3duRml4U3luYyAob3JpZykge1xuICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCB1aWQsIGdpZCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gb3JpZy5jYWxsKGZzLCB0YXJnZXQsIHVpZCwgZ2lkKVxuICAgIH0gY2F0Y2ggKGVyKSB7XG4gICAgICBpZiAoIWNob3duRXJPayhlcikpIHRocm93IGVyXG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gc3RhdEZpeCAob3JpZykge1xuICBpZiAoIW9yaWcpIHJldHVybiBvcmlnXG4gIC8vIE9sZGVyIHZlcnNpb25zIG9mIE5vZGUgZXJyb25lb3VzbHkgcmV0dXJuZWQgc2lnbmVkIGludGVnZXJzIGZvclxuICAvLyB1aWQgKyBnaWQuXG4gIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBjYikge1xuICAgIHJldHVybiBvcmlnLmNhbGwoZnMsIHRhcmdldCwgZnVuY3Rpb24gKGVyLCBzdGF0cykge1xuICAgICAgaWYgKCFzdGF0cykgcmV0dXJuIGNiLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICAgIGlmIChzdGF0cy51aWQgPCAwKSBzdGF0cy51aWQgKz0gMHgxMDAwMDAwMDBcbiAgICAgIGlmIChzdGF0cy5naWQgPCAwKSBzdGF0cy5naWQgKz0gMHgxMDAwMDAwMDBcbiAgICAgIGlmIChjYikgY2IuYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RhdEZpeFN5bmMgKG9yaWcpIHtcbiAgaWYgKCFvcmlnKSByZXR1cm4gb3JpZ1xuICAvLyBPbGRlciB2ZXJzaW9ucyBvZiBOb2RlIGVycm9uZW91c2x5IHJldHVybmVkIHNpZ25lZCBpbnRlZ2VycyBmb3JcbiAgLy8gdWlkICsgZ2lkLlxuICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBzdGF0cyA9IG9yaWcuY2FsbChmcywgdGFyZ2V0KVxuICAgIGlmIChzdGF0cy51aWQgPCAwKSBzdGF0cy51aWQgKz0gMHgxMDAwMDAwMDBcbiAgICBpZiAoc3RhdHMuZ2lkIDwgMCkgc3RhdHMuZ2lkICs9IDB4MTAwMDAwMDAwXG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG5cbi8vIEVOT1NZUyBtZWFucyB0aGF0IHRoZSBmcyBkb2Vzbid0IHN1cHBvcnQgdGhlIG9wLiBKdXN0IGlnbm9yZVxuLy8gdGhhdCwgYmVjYXVzZSBpdCBkb2Vzbid0IG1hdHRlci5cbi8vXG4vLyBpZiB0aGVyZSdzIG5vIGdldHVpZCwgb3IgaWYgZ2V0dWlkKCkgaXMgc29tZXRoaW5nIG90aGVyXG4vLyB0aGFuIDAsIGFuZCB0aGUgZXJyb3IgaXMgRUlOVkFMIG9yIEVQRVJNLCB0aGVuIGp1c3QgaWdub3JlXG4vLyBpdC5cbi8vXG4vLyBUaGlzIHNwZWNpZmljIGNhc2UgaXMgYSBzaWxlbnQgZmFpbHVyZSBpbiBjcCwgaW5zdGFsbCwgdGFyLFxuLy8gYW5kIG1vc3Qgb3RoZXIgdW5peCB0b29scyB0aGF0IG1hbmFnZSBwZXJtaXNzaW9ucy5cbi8vXG4vLyBXaGVuIHJ1bm5pbmcgYXMgcm9vdCwgb3IgaWYgb3RoZXIgdHlwZXMgb2YgZXJyb3JzIGFyZVxuLy8gZW5jb3VudGVyZWQsIHRoZW4gaXQncyBzdHJpY3QuXG5mdW5jdGlvbiBjaG93bkVyT2sgKGVyKSB7XG4gIGlmICghZXIpXG4gICAgcmV0dXJuIHRydWVcblxuICBpZiAoZXIuY29kZSA9PT0gXCJFTk9TWVNcIilcbiAgICByZXR1cm4gdHJ1ZVxuXG4gIHZhciBub25yb290ID0gIXByb2Nlc3MuZ2V0dWlkIHx8IHByb2Nlc3MuZ2V0dWlkKCkgIT09IDBcbiAgaWYgKG5vbnJvb3QpIHtcbiAgICBpZiAoZXIuY29kZSA9PT0gXCJFSU5WQUxcIiB8fCBlci5jb2RlID09PSBcIkVQRVJNXCIpXG4gICAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/graceful-fs/polyfills.js\n");

/***/ }),

/***/ "./node_modules/jsonfile/index.js":
/*!****************************************!*\
  !*** ./node_modules/jsonfile/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var _fs\ntry {\n  _fs = __webpack_require__(/*! graceful-fs */ \"./node_modules/graceful-fs/graceful-fs.js\")\n} catch (_) {\n  _fs = __webpack_require__(/*! fs */ \"fs\")\n}\n\nfunction readFile (file, options, callback) {\n  if (callback == null) {\n    callback = options\n    options = {}\n  }\n\n  if (typeof options === 'string') {\n    options = {encoding: options}\n  }\n\n  options = options || {}\n  var fs = options.fs || _fs\n\n  var shouldThrow = true\n  if ('throws' in options) {\n    shouldThrow = options.throws\n  }\n\n  fs.readFile(file, options, function (err, data) {\n    if (err) return callback(err)\n\n    data = stripBom(data)\n\n    var obj\n    try {\n      obj = JSON.parse(data, options ? options.reviver : null)\n    } catch (err2) {\n      if (shouldThrow) {\n        err2.message = file + ': ' + err2.message\n        return callback(err2)\n      } else {\n        return callback(null, null)\n      }\n    }\n\n    callback(null, obj)\n  })\n}\n\nfunction readFileSync (file, options) {\n  options = options || {}\n  if (typeof options === 'string') {\n    options = {encoding: options}\n  }\n\n  var fs = options.fs || _fs\n\n  var shouldThrow = true\n  if ('throws' in options) {\n    shouldThrow = options.throws\n  }\n\n  try {\n    var content = fs.readFileSync(file, options)\n    content = stripBom(content)\n    return JSON.parse(content, options.reviver)\n  } catch (err) {\n    if (shouldThrow) {\n      err.message = file + ': ' + err.message\n      throw err\n    } else {\n      return null\n    }\n  }\n}\n\nfunction stringify (obj, options) {\n  var spaces\n  var EOL = '\\n'\n  if (typeof options === 'object' && options !== null) {\n    if (options.spaces) {\n      spaces = options.spaces\n    }\n    if (options.EOL) {\n      EOL = options.EOL\n    }\n  }\n\n  var str = JSON.stringify(obj, options ? options.replacer : null, spaces)\n\n  return str.replace(/\\n/g, EOL) + EOL\n}\n\nfunction writeFile (file, obj, options, callback) {\n  if (callback == null) {\n    callback = options\n    options = {}\n  }\n  options = options || {}\n  var fs = options.fs || _fs\n\n  var str = ''\n  try {\n    str = stringify(obj, options)\n  } catch (err) {\n    // Need to return whether a callback was passed or not\n    if (callback) callback(err, null)\n    return\n  }\n\n  fs.writeFile(file, str, options, callback)\n}\n\nfunction writeFileSync (file, obj, options) {\n  options = options || {}\n  var fs = options.fs || _fs\n\n  var str = stringify(obj, options)\n  // not sure if fs.writeFileSync returns anything, but just in case\n  return fs.writeFileSync(file, str, options)\n}\n\nfunction stripBom (content) {\n  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified\n  if (Buffer.isBuffer(content)) content = content.toString('utf8')\n  content = content.replace(/^\\uFEFF/, '')\n  return content\n}\n\nvar jsonfile = {\n  readFile: readFile,\n  readFileSync: readFileSync,\n  writeFile: writeFile,\n  writeFileSync: writeFileSync\n}\n\nmodule.exports = jsonfile\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanNvbmZpbGUvaW5kZXguanM/YzMxMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiIuL25vZGVfbW9kdWxlcy9qc29uZmlsZS9pbmRleC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfZnNcbnRyeSB7XG4gIF9mcyA9IHJlcXVpcmUoJ2dyYWNlZnVsLWZzJylcbn0gY2F0Y2ggKF8pIHtcbiAgX2ZzID0gcmVxdWlyZSgnZnMnKVxufVxuXG5mdW5jdGlvbiByZWFkRmlsZSAoZmlsZSwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpIHtcbiAgICBvcHRpb25zID0ge2VuY29kaW5nOiBvcHRpb25zfVxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGZzID0gb3B0aW9ucy5mcyB8fCBfZnNcblxuICB2YXIgc2hvdWxkVGhyb3cgPSB0cnVlXG4gIGlmICgndGhyb3dzJyBpbiBvcHRpb25zKSB7XG4gICAgc2hvdWxkVGhyb3cgPSBvcHRpb25zLnRocm93c1xuICB9XG5cbiAgZnMucmVhZEZpbGUoZmlsZSwgb3B0aW9ucywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG5cbiAgICBkYXRhID0gc3RyaXBCb20oZGF0YSlcblxuICAgIHZhciBvYmpcbiAgICB0cnkge1xuICAgICAgb2JqID0gSlNPTi5wYXJzZShkYXRhLCBvcHRpb25zID8gb3B0aW9ucy5yZXZpdmVyIDogbnVsbClcbiAgICB9IGNhdGNoIChlcnIyKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgICAgZXJyMi5tZXNzYWdlID0gZmlsZSArICc6ICcgKyBlcnIyLm1lc3NhZ2VcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycjIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbnVsbClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxsYmFjayhudWxsLCBvYmopXG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRGaWxlU3luYyAoZmlsZSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgb3B0aW9ucyA9IHtlbmNvZGluZzogb3B0aW9uc31cbiAgfVxuXG4gIHZhciBmcyA9IG9wdGlvbnMuZnMgfHwgX2ZzXG5cbiAgdmFyIHNob3VsZFRocm93ID0gdHJ1ZVxuICBpZiAoJ3Rocm93cycgaW4gb3B0aW9ucykge1xuICAgIHNob3VsZFRocm93ID0gb3B0aW9ucy50aHJvd3NcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgb3B0aW9ucylcbiAgICBjb250ZW50ID0gc3RyaXBCb20oY29udGVudClcbiAgICByZXR1cm4gSlNPTi5wYXJzZShjb250ZW50LCBvcHRpb25zLnJldml2ZXIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgZXJyLm1lc3NhZ2UgPSBmaWxlICsgJzogJyArIGVyci5tZXNzYWdlXG4gICAgICB0aHJvdyBlcnJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5IChvYmosIG9wdGlvbnMpIHtcbiAgdmFyIHNwYWNlc1xuICB2YXIgRU9MID0gJ1xcbidcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zICE9PSBudWxsKSB7XG4gICAgaWYgKG9wdGlvbnMuc3BhY2VzKSB7XG4gICAgICBzcGFjZXMgPSBvcHRpb25zLnNwYWNlc1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5FT0wpIHtcbiAgICAgIEVPTCA9IG9wdGlvbnMuRU9MXG4gICAgfVxuICB9XG5cbiAgdmFyIHN0ciA9IEpTT04uc3RyaW5naWZ5KG9iaiwgb3B0aW9ucyA/IG9wdGlvbnMucmVwbGFjZXIgOiBudWxsLCBzcGFjZXMpXG5cbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXG4vZywgRU9MKSArIEVPTFxufVxuXG5mdW5jdGlvbiB3cml0ZUZpbGUgKGZpbGUsIG9iaiwgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgaWYgKGNhbGxiYWNrID09IG51bGwpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnNcbiAgICBvcHRpb25zID0ge31cbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIHZhciBzdHIgPSAnJ1xuICB0cnkge1xuICAgIHN0ciA9IHN0cmluZ2lmeShvYmosIG9wdGlvbnMpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIC8vIE5lZWQgdG8gcmV0dXJuIHdoZXRoZXIgYSBjYWxsYmFjayB3YXMgcGFzc2VkIG9yIG5vdFxuICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyLCBudWxsKVxuICAgIHJldHVyblxuICB9XG5cbiAgZnMud3JpdGVGaWxlKGZpbGUsIHN0ciwgb3B0aW9ucywgY2FsbGJhY2spXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmlsZVN5bmMgKGZpbGUsIG9iaiwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICB2YXIgZnMgPSBvcHRpb25zLmZzIHx8IF9mc1xuXG4gIHZhciBzdHIgPSBzdHJpbmdpZnkob2JqLCBvcHRpb25zKVxuICAvLyBub3Qgc3VyZSBpZiBmcy53cml0ZUZpbGVTeW5jIHJldHVybnMgYW55dGhpbmcsIGJ1dCBqdXN0IGluIGNhc2VcbiAgcmV0dXJuIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgc3RyLCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzdHJpcEJvbSAoY29udGVudCkge1xuICAvLyB3ZSBkbyB0aGlzIGJlY2F1c2UgSlNPTi5wYXJzZSB3b3VsZCBjb252ZXJ0IGl0IHRvIGEgdXRmOCBzdHJpbmcgaWYgZW5jb2Rpbmcgd2Fzbid0IHNwZWNpZmllZFxuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNvbnRlbnQpKSBjb250ZW50ID0gY29udGVudC50b1N0cmluZygndXRmOCcpXG4gIGNvbnRlbnQgPSBjb250ZW50LnJlcGxhY2UoL15cXHVGRUZGLywgJycpXG4gIHJldHVybiBjb250ZW50XG59XG5cbnZhciBqc29uZmlsZSA9IHtcbiAgcmVhZEZpbGU6IHJlYWRGaWxlLFxuICByZWFkRmlsZVN5bmM6IHJlYWRGaWxlU3luYyxcbiAgd3JpdGVGaWxlOiB3cml0ZUZpbGUsXG4gIHdyaXRlRmlsZVN5bmM6IHdyaXRlRmlsZVN5bmNcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqc29uZmlsZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/jsonfile/index.js\n");

/***/ }),

/***/ "./src/main/database/connection.js":
/*!*****************************************!*\
  !*** ./src/main/database/connection.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mysql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mysql */ \"mysql\");\n/* harmony import */ var mysql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mysql__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar extractCount = function extractCount(response) {\n  return response['results'][0]['count(1)'];\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  /**\n   * Create a connection to a database for the given credentials.\n   * If a connection already exists, disconnect and create a new connection.\n   *\n   * When calling the callback, we can pass in an argument to make it handle an error.\n   *\n   * @param {Object} credentials\n   * @param {Function} callback\n   */\n  createConnection: function createConnection(credentials, callback) {\n    this.database = credentials.database;\n    this.credentials = credentials;\n\n    if (this.connection) {\n      try {\n        this.disconnect();\n      } catch (error) {\n        return callback(error);\n      }\n    }\n\n    this.connection = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.createConnection(credentials);\n    return this.connection.connect(callback);\n  },\n\n  /**\n   * A wrapper method for the createConnection method that returns a Promise.\n   *\n   * @returns {Promise}\n   */\n  connect: function connect(credentials) {\n    var _this = this;\n\n    return new Promise(function (resolve, reject) {\n      _this.createConnection(credentials, function (error) {\n        if (error) {\n          console.error('connect', error);\n          reject({\n            success: false,\n            message: error.message || error.sqlMessage || error.code\n          });\n        } else {\n          resolve({\n            success: true,\n            message: 'Successfully connected.'\n          });\n        }\n      });\n    });\n  },\n  disconnect: function disconnect() {\n    this.connection.end(function (error) {\n      if (error) {\n        console.error('disconnect', error);\n        throw error;\n      }\n    });\n    this.connection = undefined;\n  },\n\n  /**\n   * Execute a prepared query.\n   *\n   * @param {String} query Prepared query\n   * @returns {Promise}\n   */\n  executeQuery: function executeQuery(query) {\n    var _this2 = this;\n\n    return new Promise(function (resolve, reject) {\n      _this2.connection.query(query, function (error, results, fields) {\n        if (error) {\n          reject({\n            success: false,\n            message: error.sqlMessage\n          });\n        } else {\n          resolve({\n            success: true,\n            results: results,\n            fields: fields\n          });\n        }\n      });\n    });\n  },\n\n  /**\n   * Count table records and resolve it as a number.\n   *\n   * @param {String} table Table  name\n   *\n   * @returns {Promise<Number>}\n   */\n  count: function count(table) {\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT count(1) FROM ??', [table]);\n    return this.executeQuery(query).then(function (response) {\n      return extractCount(response);\n    });\n  },\n\n  /**\n   * Get all the databases for the connection.\n   *\n   * @returns {Promise}\n   */\n  databases: function databases() {\n    return this.executeQuery('SHOW DATABASES');\n  },\n\n  /**\n   * Get all the tables for the current database.\n   *\n   * @returns {Promise}\n   */\n  tables: function tables() {\n    return this.executeQuery('SHOW TABLES');\n  },\n\n  /**\n   * Change the database for the current connection.\n   *\n   * @param {String} database Database name\n   * @returns {Promise}\n   */\n  changeDatabase: function changeDatabase(database) {\n    var _this3 = this;\n\n    return new Promise(function (resolve, reject) {\n      _this3.connection.changeUser({\n        database: database\n      }, function (error) {\n        if (error) {\n          reject({\n            success: false,\n            message: error.sqlMessage\n          });\n        } else {\n          resolve({\n            success: true\n          });\n        }\n      });\n    });\n  },\n\n  /**\n   * Change to the given database and get all it's tables.\n   *\n   * @param {String} database Database name\n   * @returns {Promise}\n   */\n  tablesForDatabase: function tablesForDatabase(database) {\n    var _this4 = this;\n\n    return this.changeDatabase(database).then(function () {\n      return _this4.tables();\n    });\n  },\n\n  /**\n   * Perform a select query for a table.\n   *\n   * @param {String} table Table name\n   * @param {Number} limit\n   * @param {Number} offset\n   *\n   * @returns {Promise}\n   */\n  getTableData: function getTableData(table) {\n    var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;\n    var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT * FROM ?? LIMIT ? OFFSET ?', [table, limit, offset]);\n    return Promise.all([this.executeQuery(query), this.count(table)]).then(function (responses) {\n      return Object.assign(responses[0], {\n        total_results: responses[1]\n      });\n    });\n  },\n\n  /**\n   * Perform a describe query for a table.\n   *\n   * @param {String} table Table name\n   *\n   * @returns {Promise}\n   */\n  describeTable: function describeTable(table) {\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('DESCRIBE ??', [table]);\n    return this.executeQuery(query);\n  },\n\n  /**\n   * Prepare and execute an insert query.\n   *\n   * @param {String} table Table name\n   * @param {Object} data key:value pairs of data to be inserted\n   *\n   * @returns {Promise}\n   */\n  insert: function insert(table, data) {\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('INSERT INTO ?? SET ?', [table, data]);\n    return this.executeQuery(query);\n  },\n\n  /**\n   * Get nav data\n   *\n   * @param {country} country select\n   */\n  searchByCountry: function searchByCountry(country) {\n    var query1 = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT platform_type FROM base_info where `attr_info_nationality` = ?', [country]);\n    var query2 = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT count(1) FROM base_info where `attr_info_nationality` = ?', [country]);\n    return Promise.all([this.executeQuery(query1), this.executeQuery(query2).then(function (response) {\n      return extractCount(response);\n    })]).then(function (responses) {\n      return Object.assign(responses[0], {\n        total_results: responses[1]\n      });\n    });\n  },\n\n  /**\n   * Get nav data(Components)\n   *\n   * @param platform_type\n   */\n  searchComponentsByType: function searchComponentsByType(platform_type) {\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT category,type FROM components where belong_to_type=?', [platform_type]);\n    return this.executeQuery(query);\n  },\n\n  /**\n   * getPlatformInfo\n   * @param platform_type\n   * @returns {*|Promise}\n   */\n  getPlatformInfo: function getPlatformInfo(platform_type) {\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT * FROM base_info where platform_type=?', [platform_type]);\n    return this.executeQuery(query);\n  },\n  getPlatformTE: function getPlatformTE(platform_type) {\n    var query = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.format('SELECT time,event FROM platform_time_event where belong_to_type = ?', [platform_type]);\n    return this.executeQuery(query);\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9kYXRhYmFzZS9jb25uZWN0aW9uLmpzPzdlOGIiXSwibmFtZXMiOlsiZXh0cmFjdENvdW50IiwicmVzcG9uc2UiLCJjcmVhdGVDb25uZWN0aW9uIiwiY3JlZGVudGlhbHMiLCJjYWxsYmFjayIsImRhdGFiYXNlIiwiY29ubmVjdGlvbiIsImRpc2Nvbm5lY3QiLCJlcnJvciIsIm15c3FsIiwiY29ubmVjdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiY29uc29sZSIsInN1Y2Nlc3MiLCJtZXNzYWdlIiwic3FsTWVzc2FnZSIsImNvZGUiLCJlbmQiLCJ1bmRlZmluZWQiLCJleGVjdXRlUXVlcnkiLCJxdWVyeSIsInJlc3VsdHMiLCJmaWVsZHMiLCJjb3VudCIsInRhYmxlIiwiZm9ybWF0IiwidGhlbiIsImRhdGFiYXNlcyIsInRhYmxlcyIsImNoYW5nZURhdGFiYXNlIiwiY2hhbmdlVXNlciIsInRhYmxlc0ZvckRhdGFiYXNlIiwiZ2V0VGFibGVEYXRhIiwibGltaXQiLCJvZmZzZXQiLCJhbGwiLCJPYmplY3QiLCJhc3NpZ24iLCJyZXNwb25zZXMiLCJ0b3RhbF9yZXN1bHRzIiwiZGVzY3JpYmVUYWJsZSIsImluc2VydCIsImRhdGEiLCJzZWFyY2hCeUNvdW50cnkiLCJjb3VudHJ5IiwicXVlcnkxIiwicXVlcnkyIiwic2VhcmNoQ29tcG9uZW50c0J5VHlwZSIsInBsYXRmb3JtX3R5cGUiLCJnZXRQbGF0Zm9ybUluZm8iLCJnZXRQbGF0Zm9ybVRFIl0sIm1hcHBpbmdzIjoiOzs7QUFBQTs7QUFFQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsUUFBRDtBQUFBLFNBQWNBLFNBQVMsU0FBVCxFQUFvQixDQUFwQixFQUF1QixVQUF2QixDQUFkO0FBQUEsQ0FBckI7O0FBRUEsK0RBQWU7QUFDYjs7Ozs7Ozs7O0FBU0FDLGtCQVZhLDRCQVVJQyxXQVZKLEVBVWlCQyxRQVZqQixFQVUyQjtBQUN0QyxTQUFLQyxRQUFMLEdBQWdCRixZQUFZRSxRQUE1QjtBQUNBLFNBQUtGLFdBQUwsR0FBbUJBLFdBQW5COztBQUVBLFFBQUksS0FBS0csVUFBVCxFQUFxQjtBQUNuQixVQUFJO0FBQ0YsYUFBS0MsVUFBTDtBQUNELE9BRkQsQ0FFRSxPQUFPQyxLQUFQLEVBQWM7QUFDZCxlQUFPSixTQUFTSSxLQUFULENBQVA7QUFDRDtBQUNGOztBQUVELFNBQUtGLFVBQUwsR0FBa0IsNENBQUFHLENBQU1QLGdCQUFOLENBQXVCQyxXQUF2QixDQUFsQjtBQUVBLFdBQU8sS0FBS0csVUFBTCxDQUFnQkksT0FBaEIsQ0FBd0JOLFFBQXhCLENBQVA7QUFDRCxHQXpCWTs7QUEyQmI7Ozs7O0FBS0FNLFNBaENhLG1CQWdDTFAsV0FoQ0ssRUFnQ1E7QUFBQTs7QUFDbkIsV0FBTyxJQUFJUSxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3RDLFlBQUtYLGdCQUFMLENBQXNCQyxXQUF0QixFQUFtQyxVQUFVSyxLQUFWLEVBQWlCO0FBQ2xELFlBQUlBLEtBQUosRUFBVztBQUNUTSxrQkFBUU4sS0FBUixDQUFjLFNBQWQsRUFBeUJBLEtBQXpCO0FBQ0FLLGlCQUFPO0FBQUNFLHFCQUFTLEtBQVY7QUFBaUJDLHFCQUFTUixNQUFNUSxPQUFOLElBQWlCUixNQUFNUyxVQUF2QixJQUFxQ1QsTUFBTVU7QUFBckUsV0FBUDtBQUNELFNBSEQsTUFHTztBQUNMTixrQkFBUTtBQUFDRyxxQkFBUyxJQUFWO0FBQWdCQyxxQkFBUztBQUF6QixXQUFSO0FBQ0Q7QUFDRixPQVBEO0FBUUQsS0FUTSxDQUFQO0FBVUQsR0EzQ1k7QUE2Q2JULFlBN0NhLHdCQTZDQTtBQUNYLFNBQUtELFVBQUwsQ0FBZ0JhLEdBQWhCLENBQW9CLFVBQVVYLEtBQVYsRUFBaUI7QUFDbkMsVUFBSUEsS0FBSixFQUFXO0FBQ1RNLGdCQUFRTixLQUFSLENBQWMsWUFBZCxFQUE0QkEsS0FBNUI7QUFDQSxjQUFNQSxLQUFOO0FBQ0Q7QUFDRixLQUxEO0FBT0EsU0FBS0YsVUFBTCxHQUFrQmMsU0FBbEI7QUFDRCxHQXREWTs7QUF3RGI7Ozs7OztBQU1BQyxjQTlEYSx3QkE4REFDLEtBOURBLEVBOERPO0FBQUE7O0FBQ2xCLFdBQU8sSUFBSVgsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxhQUFLUCxVQUFMLENBQWdCZ0IsS0FBaEIsQ0FBc0JBLEtBQXRCLEVBQTZCLFVBQVVkLEtBQVYsRUFBaUJlLE9BQWpCLEVBQTBCQyxNQUExQixFQUFrQztBQUM3RCxZQUFJaEIsS0FBSixFQUFXO0FBQ1RLLGlCQUFPO0FBQUNFLHFCQUFTLEtBQVY7QUFBaUJDLHFCQUFTUixNQUFNUztBQUFoQyxXQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0xMLGtCQUFRO0FBQUNHLHFCQUFTLElBQVY7QUFBZ0JRLDRCQUFoQjtBQUF5QkM7QUFBekIsV0FBUjtBQUNEO0FBQ0YsT0FORDtBQU9ELEtBUk0sQ0FBUDtBQVNELEdBeEVZOztBQTBFYjs7Ozs7OztBQU9BQyxPQWpGYSxpQkFpRlBDLEtBakZPLEVBaUZBO0FBQ1gsUUFBTUosUUFBUSw0Q0FBQWIsQ0FBTWtCLE1BQU4sQ0FBYSx5QkFBYixFQUF3QyxDQUFDRCxLQUFELENBQXhDLENBQWQ7QUFFQSxXQUFPLEtBQUtMLFlBQUwsQ0FBa0JDLEtBQWxCLEVBQ0pNLElBREksQ0FDQztBQUFBLGFBQVk1QixhQUFhQyxRQUFiLENBQVo7QUFBQSxLQURELENBQVA7QUFFRCxHQXRGWTs7QUF3RmI7Ozs7O0FBS0E0QixXQTdGYSx1QkE2RkQ7QUFDVixXQUFPLEtBQUtSLFlBQUwsQ0FBa0IsZ0JBQWxCLENBQVA7QUFDRCxHQS9GWTs7QUFpR2I7Ozs7O0FBS0FTLFFBdEdhLG9CQXNHSjtBQUNQLFdBQU8sS0FBS1QsWUFBTCxDQUFrQixhQUFsQixDQUFQO0FBQ0QsR0F4R1k7O0FBMEdiOzs7Ozs7QUFNQVUsZ0JBaEhhLDBCQWdIRTFCLFFBaEhGLEVBZ0hZO0FBQUE7O0FBQ3ZCLFdBQU8sSUFBSU0sT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxhQUFLUCxVQUFMLENBQWdCMEIsVUFBaEIsQ0FBMkI7QUFBQzNCO0FBQUQsT0FBM0IsRUFBdUMsVUFBVUcsS0FBVixFQUFpQjtBQUN0RCxZQUFJQSxLQUFKLEVBQVc7QUFDVEssaUJBQU87QUFBQ0UscUJBQVMsS0FBVjtBQUFpQkMscUJBQVNSLE1BQU1TO0FBQWhDLFdBQVA7QUFDRCxTQUZELE1BRU87QUFDTEwsa0JBQVE7QUFBQ0cscUJBQVM7QUFBVixXQUFSO0FBQ0Q7QUFDRixPQU5EO0FBT0QsS0FSTSxDQUFQO0FBU0QsR0ExSFk7O0FBNEhiOzs7Ozs7QUFNQWtCLG1CQWxJYSw2QkFrSUs1QixRQWxJTCxFQWtJZTtBQUFBOztBQUMxQixXQUFPLEtBQUswQixjQUFMLENBQW9CMUIsUUFBcEIsRUFDSnVCLElBREksQ0FDQztBQUFBLGFBQU0sT0FBS0UsTUFBTCxFQUFOO0FBQUEsS0FERCxDQUFQO0FBRUQsR0FySVk7O0FBdUliOzs7Ozs7Ozs7QUFTQUksY0FoSmEsd0JBZ0pBUixLQWhKQSxFQWdKK0I7QUFBQSxRQUF4QlMsS0FBd0IsdUVBQWhCLEVBQWdCO0FBQUEsUUFBWkMsTUFBWSx1RUFBSCxDQUFHO0FBQzFDLFFBQU1kLFFBQVEsNENBQUFiLENBQU1rQixNQUFOLENBQWEsbUNBQWIsRUFBa0QsQ0FBQ0QsS0FBRCxFQUFRUyxLQUFSLEVBQWVDLE1BQWYsQ0FBbEQsQ0FBZDtBQUVBLFdBQU96QixRQUFRMEIsR0FBUixDQUFZLENBQUMsS0FBS2hCLFlBQUwsQ0FBa0JDLEtBQWxCLENBQUQsRUFBMkIsS0FBS0csS0FBTCxDQUFXQyxLQUFYLENBQTNCLENBQVosRUFDSkUsSUFESSxDQUNDO0FBQUEsYUFBYVUsT0FBT0MsTUFBUCxDQUFjQyxVQUFVLENBQVYsQ0FBZCxFQUE0QjtBQUFDQyx1QkFBZUQsVUFBVSxDQUFWO0FBQWhCLE9BQTVCLENBQWI7QUFBQSxLQURELENBQVA7QUFFRCxHQXJKWTs7QUF1SmI7Ozs7Ozs7QUFPQUUsZUE5SmEseUJBOEpDaEIsS0E5SkQsRUE4SlE7QUFDbkIsUUFBTUosUUFBUSw0Q0FBQWIsQ0FBTWtCLE1BQU4sQ0FBYSxhQUFiLEVBQTRCLENBQUNELEtBQUQsQ0FBNUIsQ0FBZDtBQUVBLFdBQU8sS0FBS0wsWUFBTCxDQUFrQkMsS0FBbEIsQ0FBUDtBQUNELEdBbEtZOztBQW9LYjs7Ozs7Ozs7QUFRQXFCLFFBNUthLGtCQTRLTmpCLEtBNUtNLEVBNEtDa0IsSUE1S0QsRUE0S087QUFDbEIsUUFBTXRCLFFBQVEsNENBQUFiLENBQU1rQixNQUFOLENBQWEsc0JBQWIsRUFBcUMsQ0FBQ0QsS0FBRCxFQUFRa0IsSUFBUixDQUFyQyxDQUFkO0FBRUEsV0FBTyxLQUFLdkIsWUFBTCxDQUFrQkMsS0FBbEIsQ0FBUDtBQUNELEdBaExZOztBQWtMYjs7Ozs7QUFLQXVCLGlCQXZMYSwyQkF1TEdDLE9BdkxILEVBdUxZO0FBQ3ZCLFFBQU1DLFNBQVMsNENBQUF0QyxDQUFNa0IsTUFBTixDQUFhLHVFQUFiLEVBQXNGLENBQUNtQixPQUFELENBQXRGLENBQWY7QUFDQSxRQUFNRSxTQUFTLDRDQUFBdkMsQ0FBTWtCLE1BQU4sQ0FBYSxrRUFBYixFQUFpRixDQUFDbUIsT0FBRCxDQUFqRixDQUFmO0FBQ0EsV0FBT25DLFFBQVEwQixHQUFSLENBQVksQ0FBQyxLQUFLaEIsWUFBTCxDQUFrQjBCLE1BQWxCLENBQUQsRUFBNEIsS0FBSzFCLFlBQUwsQ0FBa0IyQixNQUFsQixFQUM1Q3BCLElBRDRDLENBQ3ZDO0FBQUEsYUFBWTVCLGFBQWFDLFFBQWIsQ0FBWjtBQUFBLEtBRHVDLENBQTVCLENBQVosRUFFSjJCLElBRkksQ0FFQztBQUFBLGFBQWFVLE9BQU9DLE1BQVAsQ0FBY0MsVUFBVSxDQUFWLENBQWQsRUFBNEI7QUFBQ0MsdUJBQWVELFVBQVUsQ0FBVjtBQUFoQixPQUE1QixDQUFiO0FBQUEsS0FGRCxDQUFQO0FBR0QsR0E3TFk7O0FBK0xiOzs7OztBQUtBUyx3QkFwTWEsa0NBb01VQyxhQXBNVixFQW9NeUI7QUFDcEMsUUFBTTVCLFFBQVEsNENBQUFiLENBQU1rQixNQUFOLENBQWEsNkRBQWIsRUFBNEUsQ0FBQ3VCLGFBQUQsQ0FBNUUsQ0FBZDtBQUNBLFdBQU8sS0FBSzdCLFlBQUwsQ0FBa0JDLEtBQWxCLENBQVA7QUFDRCxHQXZNWTs7QUF5TWI7Ozs7O0FBS0E2QixpQkE5TWEsMkJBOE1HRCxhQTlNSCxFQThNaUI7QUFDNUIsUUFBTTVCLFFBQVEsNENBQUFiLENBQU1rQixNQUFOLENBQWEsK0NBQWIsRUFBOEQsQ0FBQ3VCLGFBQUQsQ0FBOUQsQ0FBZDtBQUNBLFdBQU8sS0FBSzdCLFlBQUwsQ0FBa0JDLEtBQWxCLENBQVA7QUFDRCxHQWpOWTtBQW1OYjhCLGVBbk5hLHlCQW1OQ0YsYUFuTkQsRUFtTmU7QUFDMUIsUUFBTTVCLFFBQVEsNENBQUFiLENBQU1rQixNQUFOLENBQWEscUVBQWIsRUFBb0YsQ0FBQ3VCLGFBQUQsQ0FBcEYsQ0FBZDtBQUNBLFdBQU8sS0FBSzdCLFlBQUwsQ0FBa0JDLEtBQWxCLENBQVA7QUFDRDtBQXROWSxDQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vZGF0YWJhc2UvY29ubmVjdGlvbi5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBteXNxbCBmcm9tICdteXNxbCdcblxuY29uc3QgZXh0cmFjdENvdW50ID0gKHJlc3BvbnNlKSA9PiByZXNwb25zZVsncmVzdWx0cyddWzBdWydjb3VudCgxKSddXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIGNvbm5lY3Rpb24gdG8gYSBkYXRhYmFzZSBmb3IgdGhlIGdpdmVuIGNyZWRlbnRpYWxzLlxuICAgKiBJZiBhIGNvbm5lY3Rpb24gYWxyZWFkeSBleGlzdHMsIGRpc2Nvbm5lY3QgYW5kIGNyZWF0ZSBhIG5ldyBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBXaGVuIGNhbGxpbmcgdGhlIGNhbGxiYWNrLCB3ZSBjYW4gcGFzcyBpbiBhbiBhcmd1bWVudCB0byBtYWtlIGl0IGhhbmRsZSBhbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGNyZWRlbnRpYWxzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBjcmVhdGVDb25uZWN0aW9uKGNyZWRlbnRpYWxzLCBjYWxsYmFjaykge1xuICAgIHRoaXMuZGF0YWJhc2UgPSBjcmVkZW50aWFscy5kYXRhYmFzZVxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBjcmVkZW50aWFsc1xuXG4gICAgaWYgKHRoaXMuY29ubmVjdGlvbikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcilcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKGNyZWRlbnRpYWxzKVxuXG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbi5jb25uZWN0KGNhbGxiYWNrKVxuICB9LFxuXG4gIC8qKlxuICAgKiBBIHdyYXBwZXIgbWV0aG9kIGZvciB0aGUgY3JlYXRlQ29ubmVjdGlvbiBtZXRob2QgdGhhdCByZXR1cm5zIGEgUHJvbWlzZS5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBjb25uZWN0KGNyZWRlbnRpYWxzKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY3JlYXRlQ29ubmVjdGlvbihjcmVkZW50aWFscywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Nvbm5lY3QnLCBlcnJvcilcbiAgICAgICAgICByZWplY3Qoe3N1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIHx8IGVycm9yLnNxbE1lc3NhZ2UgfHwgZXJyb3IuY29kZX0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZSh7c3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1N1Y2Nlc3NmdWxseSBjb25uZWN0ZWQuJ30pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcblxuICBkaXNjb25uZWN0KCkge1xuICAgIHRoaXMuY29ubmVjdGlvbi5lbmQoZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZGlzY29ubmVjdCcsIGVycm9yKVxuICAgICAgICB0aHJvdyBlcnJvclxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSB1bmRlZmluZWRcbiAgfSxcblxuICAvKipcbiAgICogRXhlY3V0ZSBhIHByZXBhcmVkIHF1ZXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gcXVlcnkgUHJlcGFyZWQgcXVlcnlcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBleGVjdXRlUXVlcnkocXVlcnkpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5jb25uZWN0aW9uLnF1ZXJ5KHF1ZXJ5LCBmdW5jdGlvbiAoZXJyb3IsIHJlc3VsdHMsIGZpZWxkcykge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3Qoe3N1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnJvci5zcWxNZXNzYWdlfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHtzdWNjZXNzOiB0cnVlLCByZXN1bHRzLCBmaWVsZHN9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgLyoqXG4gICAqIENvdW50IHRhYmxlIHJlY29yZHMgYW5kIHJlc29sdmUgaXQgYXMgYSBudW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0YWJsZSBUYWJsZSAgbmFtZVxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxOdW1iZXI+fVxuICAgKi9cbiAgY291bnQodGFibGUpIHtcbiAgICBjb25zdCBxdWVyeSA9IG15c3FsLmZvcm1hdCgnU0VMRUNUIGNvdW50KDEpIEZST00gPz8nLCBbdGFibGVdKVxuXG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5KVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gZXh0cmFjdENvdW50KHJlc3BvbnNlKSlcbiAgfSxcblxuICAvKipcbiAgICogR2V0IGFsbCB0aGUgZGF0YWJhc2VzIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAqL1xuICBkYXRhYmFzZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZVF1ZXJ5KCdTSE9XIERBVEFCQVNFUycpXG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBhbGwgdGhlIHRhYmxlcyBmb3IgdGhlIGN1cnJlbnQgZGF0YWJhc2UuXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgdGFibGVzKCkge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVRdWVyeSgnU0hPVyBUQUJMRVMnKVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdGhlIGRhdGFiYXNlIGZvciB0aGUgY3VycmVudCBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgRGF0YWJhc2UgbmFtZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGNoYW5nZURhdGFiYXNlKGRhdGFiYXNlKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbi5jaGFuZ2VVc2VyKHtkYXRhYmFzZX0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICByZWplY3Qoe3N1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiBlcnJvci5zcWxNZXNzYWdlfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXNvbHZlKHtzdWNjZXNzOiB0cnVlfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuXG4gIC8qKlxuICAgKiBDaGFuZ2UgdG8gdGhlIGdpdmVuIGRhdGFiYXNlIGFuZCBnZXQgYWxsIGl0J3MgdGFibGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0YWJhc2UgRGF0YWJhc2UgbmFtZVxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIHRhYmxlc0ZvckRhdGFiYXNlKGRhdGFiYXNlKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlRGF0YWJhc2UoZGF0YWJhc2UpXG4gICAgICAudGhlbigoKSA9PiB0aGlzLnRhYmxlcygpKVxuICB9LFxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGEgc2VsZWN0IHF1ZXJ5IGZvciBhIHRhYmxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGFibGUgVGFibGUgbmFtZVxuICAgKiBAcGFyYW0ge051bWJlcn0gbGltaXRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldFxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGdldFRhYmxlRGF0YSh0YWJsZSwgbGltaXQgPSAxMCwgb2Zmc2V0ID0gMCkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gbXlzcWwuZm9ybWF0KCdTRUxFQ1QgKiBGUk9NID8/IExJTUlUID8gT0ZGU0VUID8nLCBbdGFibGUsIGxpbWl0LCBvZmZzZXRdKVxuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt0aGlzLmV4ZWN1dGVRdWVyeShxdWVyeSksIHRoaXMuY291bnQodGFibGUpXSlcbiAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBPYmplY3QuYXNzaWduKHJlc3BvbnNlc1swXSwge3RvdGFsX3Jlc3VsdHM6IHJlc3BvbnNlc1sxXX0pKVxuICB9LFxuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGEgZGVzY3JpYmUgcXVlcnkgZm9yIGEgdGFibGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0YWJsZSBUYWJsZSBuYW1lXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgKi9cbiAgZGVzY3JpYmVUYWJsZSh0YWJsZSkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gbXlzcWwuZm9ybWF0KCdERVNDUklCRSA/PycsIFt0YWJsZV0pXG5cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlUXVlcnkocXVlcnkpXG4gIH0sXG5cbiAgLyoqXG4gICAqIFByZXBhcmUgYW5kIGV4ZWN1dGUgYW4gaW5zZXJ0IHF1ZXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGFibGUgVGFibGUgbmFtZVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBrZXk6dmFsdWUgcGFpcnMgb2YgZGF0YSB0byBiZSBpbnNlcnRlZFxuICAgKlxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGluc2VydCh0YWJsZSwgZGF0YSkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gbXlzcWwuZm9ybWF0KCdJTlNFUlQgSU5UTyA/PyBTRVQgPycsIFt0YWJsZSwgZGF0YV0pXG5cbiAgICByZXR1cm4gdGhpcy5leGVjdXRlUXVlcnkocXVlcnkpXG4gIH0sXG5cbiAgLyoqXG4gICAqIEdldCBuYXYgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge2NvdW50cnl9IGNvdW50cnkgc2VsZWN0XG4gICAqL1xuICBzZWFyY2hCeUNvdW50cnkoY291bnRyeSkge1xuICAgIGNvbnN0IHF1ZXJ5MSA9IG15c3FsLmZvcm1hdCgnU0VMRUNUIHBsYXRmb3JtX3R5cGUgRlJPTSBiYXNlX2luZm8gd2hlcmUgYGF0dHJfaW5mb19uYXRpb25hbGl0eWAgPSA/JywgW2NvdW50cnldKVxuICAgIGNvbnN0IHF1ZXJ5MiA9IG15c3FsLmZvcm1hdCgnU0VMRUNUIGNvdW50KDEpIEZST00gYmFzZV9pbmZvIHdoZXJlIGBhdHRyX2luZm9fbmF0aW9uYWxpdHlgID0gPycsIFtjb3VudHJ5XSlcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3RoaXMuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5MSksIHRoaXMuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5MilcbiAgICAgIC50aGVuKHJlc3BvbnNlID0+IGV4dHJhY3RDb3VudChyZXNwb25zZSkpXSlcbiAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBPYmplY3QuYXNzaWduKHJlc3BvbnNlc1swXSwge3RvdGFsX3Jlc3VsdHM6IHJlc3BvbnNlc1sxXX0pKVxuICB9LFxuXG4gIC8qKlxuICAgKiBHZXQgbmF2IGRhdGEoQ29tcG9uZW50cylcbiAgICpcbiAgICogQHBhcmFtIHBsYXRmb3JtX3R5cGVcbiAgICovXG4gIHNlYXJjaENvbXBvbmVudHNCeVR5cGUocGxhdGZvcm1fdHlwZSkge1xuICAgIGNvbnN0IHF1ZXJ5ID0gbXlzcWwuZm9ybWF0KCdTRUxFQ1QgY2F0ZWdvcnksdHlwZSBGUk9NIGNvbXBvbmVudHMgd2hlcmUgYmVsb25nX3RvX3R5cGU9PycsIFtwbGF0Zm9ybV90eXBlXSlcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlUXVlcnkocXVlcnkpXG4gIH0sXG5cbiAgLyoqXG4gICAqIGdldFBsYXRmb3JtSW5mb1xuICAgKiBAcGFyYW0gcGxhdGZvcm1fdHlwZVxuICAgKiBAcmV0dXJucyB7KnxQcm9taXNlfVxuICAgKi9cbiAgZ2V0UGxhdGZvcm1JbmZvKHBsYXRmb3JtX3R5cGUpe1xuICAgIGNvbnN0IHF1ZXJ5ID0gbXlzcWwuZm9ybWF0KCdTRUxFQ1QgKiBGUk9NIGJhc2VfaW5mbyB3aGVyZSBwbGF0Zm9ybV90eXBlPT8nLCBbcGxhdGZvcm1fdHlwZV0pXG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5KVxuICB9LFxuXG4gIGdldFBsYXRmb3JtVEUocGxhdGZvcm1fdHlwZSl7XG4gICAgY29uc3QgcXVlcnkgPSBteXNxbC5mb3JtYXQoJ1NFTEVDVCB0aW1lLGV2ZW50IEZST00gcGxhdGZvcm1fdGltZV9ldmVudCB3aGVyZSBiZWxvbmdfdG9fdHlwZSA9ID8nLCBbcGxhdGZvcm1fdHlwZV0pXG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZVF1ZXJ5KHF1ZXJ5KVxuICB9XG5cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/database/connection.js\n");

/***/ }),

/***/ "./src/main/index.js":
/*!***************************!*\
  !*** ./src/main/index.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url */ \"url\");\n/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! electron-settings */ \"./node_modules/electron-settings/index.js\");\n/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(electron_settings__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _ipc_reply_provider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ipc/reply-provider */ \"./src/main/ipc/reply-provider.js\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n\n\n\n\nvar isDevelopment = \"development\" === 'development'; // Keep a global reference of the window object, if you don't, the window will\n// be closed automatically when the JavaScript object is garbage collected.\n\nvar mainWindow;\n\nvar createWindow = function createWindow() {\n  // Load window state or set defaults\n  var windowState = {\n    isMaximized: false,\n    bounds: {\n      x: undefined,\n      y: undefined,\n      width: 1200,\n      height: 600\n    }\n  };\n\n  if (electron_settings__WEBPACK_IMPORTED_MODULE_3___default.a.has('window_state')) {\n    windowState = electron_settings__WEBPACK_IMPORTED_MODULE_3___default.a.get('window_state');\n  } // Create the browser window.\n\n\n  mainWindow = new electron__WEBPACK_IMPORTED_MODULE_2__[\"BrowserWindow\"](_objectSpread({\n    title: 'platform'\n  }, windowState.bounds, {\n    icon: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(\"C:\\\\Users\\\\27700\\\\Desktop\\\\platform-electron\\\\static\", '/logo.jpg'),\n    webPreferences: {\n      webSecurity: false\n    }\n  }));\n\n  if (windowState.isMaximized) {\n    mainWindow.maximize();\n  } // Open the DevTools.\n\n\n  if (isDevelopment) {\n    __webpack_require__(/*! devtron */ \"./node_modules/devtron/api.js\").install();\n\n    mainWindow.webContents.openDevTools();\n  } // and load the index.html of the app.\n\n\n  if (isDevelopment) {\n    mainWindow.loadURL(\"http://localhost:\".concat(process.env.ELECTRON_WEBPACK_WDS_PORT));\n  } else {\n    mainWindow.loadURL(Object(url__WEBPACK_IMPORTED_MODULE_1__[\"formatUrl\"])({\n      pathname: path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname, 'index.html'),\n      protocol: 'file',\n      slashes: true\n    }));\n  } // Emitted when the window is closed.\n\n\n  mainWindow.on('closed', function () {\n    // Dereference the window object, usually you would store windows\n    // in an array if your app supports multi windows, this is the time\n    // when you should delete the corresponding element.\n    mainWindow = null;\n  });\n  ['resize', 'move', 'close'].forEach(function (e) {\n    mainWindow.on(e, function () {\n      windowState.isMaximized = mainWindow.isMaximized();\n\n      if (!windowState.isMaximized) {\n        // only update bounds if the window isn’t currently maximized\n        windowState.bounds = mainWindow.getBounds();\n      }\n\n      electron_settings__WEBPACK_IMPORTED_MODULE_3___default.a.set('window_state', windowState);\n    });\n  }); // Remove application menu\n\n  electron__WEBPACK_IMPORTED_MODULE_2__[\"Menu\"].setApplicationMenu(null);\n  _ipc_reply_provider__WEBPACK_IMPORTED_MODULE_4__[\"default\"].registerReplies();\n}; // This method will be called when Electron has finished\n// initialization and is ready to create browser windows.\n// Some APIs can only be used after this event occurs.\n\n\nelectron__WEBPACK_IMPORTED_MODULE_2__[\"app\"].on('ready', createWindow); // Quit when all windows are closed.\n\nelectron__WEBPACK_IMPORTED_MODULE_2__[\"app\"].on('window-all-closed', function () {\n  // On OS X it is common for applications and their menu bar\n  // to stay active until the user quits explicitly with Cmd + Q\n  if (process.platform !== 'darwin') {\n    electron__WEBPACK_IMPORTED_MODULE_2__[\"app\"].quit();\n  }\n});\nelectron__WEBPACK_IMPORTED_MODULE_2__[\"app\"].on('activate', function () {\n  // On OS X it's common to re-create a window in the app when the\n  // dock icon is clicked and there are no other windows open.\n  if (mainWindow === null) {\n    createWindow();\n  }\n});\nprocess.on('uncaughtException', function (error) {\n  console.error('uncaught', error);\n}); // In this file you can include the rest of your app's specific main process\n// code. You can also put them in separate files and import them here.\n/* WEBPACK VAR INJECTION */}.call(this, \"src\\\\main\"))//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC5qcz9lNTlhIl0sIm5hbWVzIjpbImlzRGV2ZWxvcG1lbnQiLCJtYWluV2luZG93IiwiY3JlYXRlV2luZG93Iiwid2luZG93U3RhdGUiLCJpc01heGltaXplZCIsImJvdW5kcyIsIngiLCJ1bmRlZmluZWQiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJzZXR0aW5ncyIsImhhcyIsImdldCIsInRpdGxlIiwiaWNvbiIsInBhdGgiLCJqb2luIiwid2ViUHJlZmVyZW5jZXMiLCJ3ZWJTZWN1cml0eSIsIm1heGltaXplIiwicmVxdWlyZSIsImluc3RhbGwiLCJ3ZWJDb250ZW50cyIsIm9wZW5EZXZUb29scyIsImxvYWRVUkwiLCJwcm9jZXNzIiwiZW52IiwiRUxFQ1RST05fV0VCUEFDS19XRFNfUE9SVCIsImZvcm1hdFVybCIsInBhdGhuYW1lIiwiX19kaXJuYW1lIiwicHJvdG9jb2wiLCJzbGFzaGVzIiwib24iLCJmb3JFYWNoIiwiZSIsImdldEJvdW5kcyIsInNldCIsIk1lbnUiLCJzZXRBcHBsaWNhdGlvbk1lbnUiLCJSZXBseVByb3ZpZGVyIiwicmVnaXN0ZXJSZXBsaWVzIiwiYXBwIiwicGxhdGZvcm0iLCJxdWl0IiwiZXJyb3IiLCJjb25zb2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxJQUFNQSxnQkFBZ0Isa0JBQXlCLGFBQS9DLEMsQ0FFQTtBQUNBOztBQUNBLElBQUlDLFVBQUo7O0FBRUEsSUFBTUMsZUFBZSxTQUFmQSxZQUFlLEdBQU07QUFDekI7QUFDQSxNQUFJQyxjQUFjO0FBQ2hCQyxpQkFBYSxLQURHO0FBRWhCQyxZQUFRO0FBQUVDLFNBQUdDLFNBQUw7QUFBZ0JDLFNBQUdELFNBQW5CO0FBQThCRSxhQUFPLElBQXJDO0FBQTJDQyxjQUFRO0FBQW5EO0FBRlEsR0FBbEI7O0FBS0EsTUFBSSx3REFBQUMsQ0FBU0MsR0FBVCxDQUFhLGNBQWIsQ0FBSixFQUFrQztBQUNoQ1Qsa0JBQWMsd0RBQUFRLENBQVNFLEdBQVQsQ0FBYSxjQUFiLENBQWQ7QUFDRCxHQVR3QixDQVd6Qjs7O0FBQ0FaLGVBQWEsSUFBSSxzREFBSjtBQUNYYSxXQUFPO0FBREksS0FFUlgsWUFBWUUsTUFGSjtBQUdYVSxVQUFNLDJDQUFBQyxDQUFLQyxJQUFMLENBQVUsc0RBQVYsRUFBb0IsV0FBcEIsQ0FISztBQUlYQyxvQkFBZ0I7QUFDZEMsbUJBQWE7QUFEQztBQUpMLEtBQWI7O0FBU0EsTUFBSWhCLFlBQVlDLFdBQWhCLEVBQTZCO0FBQzNCSCxlQUFXbUIsUUFBWDtBQUNELEdBdkJ3QixDQXlCekI7OztBQUNBLE1BQUlwQixhQUFKLEVBQW1CO0FBQ2pCcUIsSUFBQSxtQkFBQUEsQ0FBUSw4Q0FBUixFQUFtQkMsT0FBbkI7O0FBQ0FyQixlQUFXc0IsV0FBWCxDQUF1QkMsWUFBdkI7QUFDRCxHQTdCd0IsQ0ErQnpCOzs7QUFDQSxNQUFJeEIsYUFBSixFQUFtQjtBQUNqQkMsZUFBV3dCLE9BQVgsNEJBQXVDQyxRQUFRQyxHQUFSLENBQVlDLHlCQUFuRDtBQUNELEdBRkQsTUFFTztBQUNMM0IsZUFBV3dCLE9BQVgsQ0FBbUIscURBQUFJLENBQVU7QUFDM0JDLGdCQUFVLDJDQUFBZCxDQUFLQyxJQUFMLENBQVVjLFNBQVYsRUFBcUIsWUFBckIsQ0FEaUI7QUFFM0JDLGdCQUFVLE1BRmlCO0FBRzNCQyxlQUFTO0FBSGtCLEtBQVYsQ0FBbkI7QUFLRCxHQXhDd0IsQ0EwQ3pCOzs7QUFDQWhDLGFBQVdpQyxFQUFYLENBQWMsUUFBZCxFQUF3QixZQUFNO0FBQzVCO0FBQ0E7QUFDQTtBQUNBakMsaUJBQWEsSUFBYjtBQUNELEdBTEQ7QUFPQSxHQUFDLFFBQUQsRUFBVyxNQUFYLEVBQW1CLE9BQW5CLEVBQTRCa0MsT0FBNUIsQ0FBb0MsYUFBSztBQUN2Q2xDLGVBQVdpQyxFQUFYLENBQWNFLENBQWQsRUFBaUIsWUFBTTtBQUNyQmpDLGtCQUFZQyxXQUFaLEdBQTBCSCxXQUFXRyxXQUFYLEVBQTFCOztBQUVBLFVBQUksQ0FBQ0QsWUFBWUMsV0FBakIsRUFBOEI7QUFDNUI7QUFDQUQsb0JBQVlFLE1BQVosR0FBcUJKLFdBQVdvQyxTQUFYLEVBQXJCO0FBQ0Q7O0FBRUQxQixNQUFBLHdEQUFBQSxDQUFTMkIsR0FBVCxDQUFhLGNBQWIsRUFBNkJuQyxXQUE3QjtBQUNELEtBVEQ7QUFVRCxHQVhELEVBbER5QixDQStEekI7O0FBQ0FvQyxFQUFBLDZDQUFBQSxDQUFLQyxrQkFBTCxDQUF3QixJQUF4QjtBQUVBQyxFQUFBLDJEQUFBQSxDQUFjQyxlQUFkO0FBQ0QsQ0FuRUQsQyxDQXFFQTtBQUNBO0FBQ0E7OztBQUNBLDRDQUFBQyxDQUFJVCxFQUFKLENBQU8sT0FBUCxFQUFnQmhDLFlBQWhCLEUsQ0FFQTs7QUFDQSw0Q0FBQXlDLENBQUlULEVBQUosQ0FBTyxtQkFBUCxFQUE0QixZQUFNO0FBQ2hDO0FBQ0E7QUFDQSxNQUFJUixRQUFRa0IsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQ0QsSUFBQSw0Q0FBQUEsQ0FBSUUsSUFBSjtBQUNEO0FBQ0YsQ0FORDtBQVFBLDRDQUFBRixDQUFJVCxFQUFKLENBQU8sVUFBUCxFQUFtQixZQUFNO0FBQ3ZCO0FBQ0E7QUFDQSxNQUFJakMsZUFBZSxJQUFuQixFQUF5QjtBQUN2QkM7QUFDRDtBQUNGLENBTkQ7QUFRQXdCLFFBQVFRLEVBQVIsQ0FBVyxtQkFBWCxFQUFnQyxVQUFVWSxLQUFWLEVBQWlCO0FBQy9DQyxVQUFRRCxLQUFSLENBQWMsVUFBZCxFQUEwQkEsS0FBMUI7QUFDRCxDQUZELEUsQ0FJQTtBQUNBLHNFIiwiZmlsZSI6Ii4vc3JjL21haW4vaW5kZXguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZm9ybWF0VXJsIH0gZnJvbSAndXJsJ1xuaW1wb3J0IHsgYXBwLCBCcm93c2VyV2luZG93LCBNZW51IH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgc2V0dGluZ3MgZnJvbSAnZWxlY3Ryb24tc2V0dGluZ3MnXG5pbXBvcnQgUmVwbHlQcm92aWRlciBmcm9tICcuL2lwYy9yZXBseS1wcm92aWRlcidcblxuY29uc3QgaXNEZXZlbG9wbWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnXG5cbi8vIEtlZXAgYSBnbG9iYWwgcmVmZXJlbmNlIG9mIHRoZSB3aW5kb3cgb2JqZWN0LCBpZiB5b3UgZG9uJ3QsIHRoZSB3aW5kb3cgd2lsbFxuLy8gYmUgY2xvc2VkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgSmF2YVNjcmlwdCBvYmplY3QgaXMgZ2FyYmFnZSBjb2xsZWN0ZWQuXG5sZXQgbWFpbldpbmRvd1xuXG5jb25zdCBjcmVhdGVXaW5kb3cgPSAoKSA9PiB7XG4gIC8vIExvYWQgd2luZG93IHN0YXRlIG9yIHNldCBkZWZhdWx0c1xuICBsZXQgd2luZG93U3RhdGUgPSB7XG4gICAgaXNNYXhpbWl6ZWQ6IGZhbHNlLFxuICAgIGJvdW5kczogeyB4OiB1bmRlZmluZWQsIHk6IHVuZGVmaW5lZCwgd2lkdGg6IDEyMDAsIGhlaWdodDogNjAwIH1cbiAgfVxuXG4gIGlmIChzZXR0aW5ncy5oYXMoJ3dpbmRvd19zdGF0ZScpKSB7XG4gICAgd2luZG93U3RhdGUgPSBzZXR0aW5ncy5nZXQoJ3dpbmRvd19zdGF0ZScpXG4gIH1cblxuICAvLyBDcmVhdGUgdGhlIGJyb3dzZXIgd2luZG93LlxuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIHRpdGxlOiAncGxhdGZvcm0nLFxuICAgIC4uLndpbmRvd1N0YXRlLmJvdW5kcyxcbiAgICBpY29uOiBwYXRoLmpvaW4oX19zdGF0aWMsICcvbG9nby5qcGcnKSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgd2ViU2VjdXJpdHk6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIGlmICh3aW5kb3dTdGF0ZS5pc01heGltaXplZCkge1xuICAgIG1haW5XaW5kb3cubWF4aW1pemUoKTtcbiAgfVxuXG4gIC8vIE9wZW4gdGhlIERldlRvb2xzLlxuICBpZiAoaXNEZXZlbG9wbWVudCkge1xuICAgIHJlcXVpcmUoJ2RldnRyb24nKS5pbnN0YWxsKClcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpXG4gIH1cblxuICAvLyBhbmQgbG9hZCB0aGUgaW5kZXguaHRtbCBvZiB0aGUgYXBwLlxuICBpZiAoaXNEZXZlbG9wbWVudCkge1xuICAgIG1haW5XaW5kb3cubG9hZFVSTChgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LkVMRUNUUk9OX1dFQlBBQ0tfV0RTX1BPUlR9YClcbiAgfSBlbHNlIHtcbiAgICBtYWluV2luZG93LmxvYWRVUkwoZm9ybWF0VXJsKHtcbiAgICAgIHBhdGhuYW1lOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgcHJvdG9jb2w6ICdmaWxlJyxcbiAgICAgIHNsYXNoZXM6IHRydWVcbiAgICB9KSlcbiAgfVxuXG4gIC8vIEVtaXR0ZWQgd2hlbiB0aGUgd2luZG93IGlzIGNsb3NlZC5cbiAgbWFpbldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgIC8vIERlcmVmZXJlbmNlIHRoZSB3aW5kb3cgb2JqZWN0LCB1c3VhbGx5IHlvdSB3b3VsZCBzdG9yZSB3aW5kb3dzXG4gICAgLy8gaW4gYW4gYXJyYXkgaWYgeW91ciBhcHAgc3VwcG9ydHMgbXVsdGkgd2luZG93cywgdGhpcyBpcyB0aGUgdGltZVxuICAgIC8vIHdoZW4geW91IHNob3VsZCBkZWxldGUgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudC5cbiAgICBtYWluV2luZG93ID0gbnVsbFxuICB9KTtcblxuICBbJ3Jlc2l6ZScsICdtb3ZlJywgJ2Nsb3NlJ10uZm9yRWFjaChlID0+IHtcbiAgICBtYWluV2luZG93Lm9uKGUsICgpID0+IHtcbiAgICAgIHdpbmRvd1N0YXRlLmlzTWF4aW1pemVkID0gbWFpbldpbmRvdy5pc01heGltaXplZCgpXG5cbiAgICAgIGlmICghd2luZG93U3RhdGUuaXNNYXhpbWl6ZWQpIHtcbiAgICAgICAgLy8gb25seSB1cGRhdGUgYm91bmRzIGlmIHRoZSB3aW5kb3cgaXNu4oCZdCBjdXJyZW50bHkgbWF4aW1pemVkXG4gICAgICAgIHdpbmRvd1N0YXRlLmJvdW5kcyA9IG1haW5XaW5kb3cuZ2V0Qm91bmRzKClcbiAgICAgIH1cblxuICAgICAgc2V0dGluZ3Muc2V0KCd3aW5kb3dfc3RhdGUnLCB3aW5kb3dTdGF0ZSlcbiAgICB9KVxuICB9KVxuXG4gIC8vIFJlbW92ZSBhcHBsaWNhdGlvbiBtZW51XG4gIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KG51bGwpXG5cbiAgUmVwbHlQcm92aWRlci5yZWdpc3RlclJlcGxpZXMoKVxufVxuXG4vLyBUaGlzIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aGVuIEVsZWN0cm9uIGhhcyBmaW5pc2hlZFxuLy8gaW5pdGlhbGl6YXRpb24gYW5kIGlzIHJlYWR5IHRvIGNyZWF0ZSBicm93c2VyIHdpbmRvd3MuXG4vLyBTb21lIEFQSXMgY2FuIG9ubHkgYmUgdXNlZCBhZnRlciB0aGlzIGV2ZW50IG9jY3Vycy5cbmFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpXG5cbi8vIFF1aXQgd2hlbiBhbGwgd2luZG93cyBhcmUgY2xvc2VkLlxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgLy8gT24gT1MgWCBpdCBpcyBjb21tb24gZm9yIGFwcGxpY2F0aW9ucyBhbmQgdGhlaXIgbWVudSBiYXJcbiAgLy8gdG8gc3RheSBhY3RpdmUgdW50aWwgdGhlIHVzZXIgcXVpdHMgZXhwbGljaXRseSB3aXRoIENtZCArIFFcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgYXBwLnF1aXQoKVxuICB9XG59KVxuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAvLyBPbiBPUyBYIGl0J3MgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBpbiB0aGUgYXBwIHdoZW4gdGhlXG4gIC8vIGRvY2sgaWNvbiBpcyBjbGlja2VkIGFuZCB0aGVyZSBhcmUgbm8gb3RoZXIgd2luZG93cyBvcGVuLlxuICBpZiAobWFpbldpbmRvdyA9PT0gbnVsbCkge1xuICAgIGNyZWF0ZVdpbmRvdygpXG4gIH1cbn0pXG5cbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gIGNvbnNvbGUuZXJyb3IoJ3VuY2F1Z2h0JywgZXJyb3IpXG59KVxuXG4vLyBJbiB0aGlzIGZpbGUgeW91IGNhbiBpbmNsdWRlIHRoZSByZXN0IG9mIHlvdXIgYXBwJ3Mgc3BlY2lmaWMgbWFpbiBwcm9jZXNzXG4vLyBjb2RlLiBZb3UgY2FuIGFsc28gcHV0IHRoZW0gaW4gc2VwYXJhdGUgZmlsZXMgYW5kIGltcG9ydCB0aGVtIGhlcmUuXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/index.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/connect-reply.js":
/*!***********************************************!*\
  !*** ./src/main/ipc/replies/connect-reply.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\n/* harmony import */ var _settings_settings_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../settings/settings-manager */ \"./src/main/settings/settings-manager.js\");\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, credentials) {\n    _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].connect(credentials).then(function (response) {\n      var saved_connections = Object(_settings_settings_manager__WEBPACK_IMPORTED_MODULE_1__[\"saveConnectionIfNotExists\"])(credentials);\n      event.sender.send('get-connections-response', {\n        success: true,\n        saved_connections: saved_connections\n      });\n      event.sender.send('connect-response', response);\n    }).catch(function (error) {\n      console.error('connect reply', error);\n      event.sender.send('connect-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9jb25uZWN0LXJlcGx5LmpzPzk3YTMiXSwibmFtZXMiOlsiaGFuZGxlIiwiZXZlbnQiLCJjcmVkZW50aWFscyIsImNvbm5lY3Rpb24iLCJjb25uZWN0IiwidGhlbiIsInNhdmVkX2Nvbm5lY3Rpb25zIiwic2F2ZUNvbm5lY3Rpb25JZk5vdEV4aXN0cyIsInNlbmRlciIsInNlbmQiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJjYXRjaCIsImNvbnNvbGUiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTtBQUVBLCtEQUFlO0FBQ2JBLFFBRGEsa0JBQ0xDLEtBREssRUFDRUMsV0FERixFQUNlO0FBQzFCQyxJQUFBLDREQUFBQSxDQUFXQyxPQUFYLENBQW1CRixXQUFuQixFQUNHRyxJQURILENBQ1Esb0JBQVk7QUFDaEIsVUFBTUMsb0JBQW9CLDRGQUFBQyxDQUEwQkwsV0FBMUIsQ0FBMUI7QUFFQUQsWUFBTU8sTUFBTixDQUFhQyxJQUFiLENBQWtCLDBCQUFsQixFQUE4QztBQUFFQyxpQkFBUyxJQUFYO0FBQWlCSjtBQUFqQixPQUE5QztBQUNBTCxZQUFNTyxNQUFOLENBQWFDLElBQWIsQ0FBa0Isa0JBQWxCLEVBQXNDRSxRQUF0QztBQUNELEtBTkgsRUFPR0MsS0FQSCxDQU9TLGlCQUFTO0FBQ2RDLGNBQVFDLEtBQVIsQ0FBYyxlQUFkLEVBQStCQSxLQUEvQjtBQUNBYixZQUFNTyxNQUFOLENBQWFDLElBQWIsQ0FBa0Isa0JBQWxCLEVBQXNDSyxLQUF0QztBQUNELEtBVkg7QUFXRDtBQWJZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9jb25uZWN0LXJlcGx5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbm5lY3Rpb24gZnJvbSAnLi4vLi4vZGF0YWJhc2UvY29ubmVjdGlvbidcbmltcG9ydCB7IHNhdmVDb25uZWN0aW9uSWZOb3RFeGlzdHMgfSBmcm9tICcuLi8uLi9zZXR0aW5ncy9zZXR0aW5ncy1tYW5hZ2VyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGhhbmRsZSAoZXZlbnQsIGNyZWRlbnRpYWxzKSB7XG4gICAgY29ubmVjdGlvbi5jb25uZWN0KGNyZWRlbnRpYWxzKVxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBjb25zdCBzYXZlZF9jb25uZWN0aW9ucyA9IHNhdmVDb25uZWN0aW9uSWZOb3RFeGlzdHMoY3JlZGVudGlhbHMpXG5cbiAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ2dldC1jb25uZWN0aW9ucy1yZXNwb25zZScsIHsgc3VjY2VzczogdHJ1ZSwgc2F2ZWRfY29ubmVjdGlvbnMgfSlcbiAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ2Nvbm5lY3QtcmVzcG9uc2UnLCByZXNwb25zZSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdjb25uZWN0IHJlcGx5JywgZXJyb3IpXG4gICAgICAgIGV2ZW50LnNlbmRlci5zZW5kKCdjb25uZWN0LXJlc3BvbnNlJywgZXJyb3IpXG4gICAgICB9KVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/connect-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/databases-reply.js":
/*!*************************************************!*\
  !*** ./src/main/ipc/replies/databases-reply.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event) {\n    return _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].databases().then(function (response) {\n      event.sender.send('databases-response', response);\n    }).catch(function (error) {\n      console.log(error);\n      event.sender.send('databases-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9kYXRhYmFzZXMtcmVwbHkuanM/OWVkNSJdLCJuYW1lcyI6WyJoYW5kbGUiLCJldmVudCIsImNvbm5lY3Rpb24iLCJkYXRhYmFzZXMiLCJ0aGVuIiwic2VuZGVyIiwic2VuZCIsInJlc3BvbnNlIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQSwrREFBZTtBQUViQSxRQUZhLGtCQUVMQyxLQUZLLEVBRUU7QUFDYixXQUFPLDREQUFBQyxDQUFXQyxTQUFYLEdBQ0pDLElBREksQ0FDQyxvQkFBWTtBQUNoQkgsWUFBTUksTUFBTixDQUFhQyxJQUFiLENBQWtCLG9CQUFsQixFQUF3Q0MsUUFBeEM7QUFDRCxLQUhJLEVBSUpDLEtBSkksQ0FJRSxpQkFBUztBQUNkQyxjQUFRQyxHQUFSLENBQVlDLEtBQVo7QUFDQVYsWUFBTUksTUFBTixDQUFhQyxJQUFiLENBQWtCLG9CQUFsQixFQUF3Q0ssS0FBeEM7QUFDRCxLQVBJLENBQVA7QUFRRDtBQVhZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9kYXRhYmFzZXMtcmVwbHkuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29ubmVjdGlvbiBmcm9tICcuLi8uLi9kYXRhYmFzZS9jb25uZWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgaGFuZGxlIChldmVudCkge1xuICAgIHJldHVybiBjb25uZWN0aW9uLmRhdGFiYXNlcygpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGV2ZW50LnNlbmRlci5zZW5kKCdkYXRhYmFzZXMtcmVzcG9uc2UnLCByZXNwb25zZSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ2RhdGFiYXNlcy1yZXNwb25zZScsIGVycm9yKVxuICAgICAgfSlcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/databases-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/delete-connection-reply.js":
/*!*********************************************************!*\
  !*** ./src/main/ipc/replies/delete-connection-reply.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _settings_settings_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../settings/settings-manager */ \"./src/main/settings/settings-manager.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, connection_index) {\n    var saved_connections = Object(_settings_settings_manager__WEBPACK_IMPORTED_MODULE_0__[\"deleteConnection\"])(connection_index);\n    event.sender.send('delete-connection-response', {\n      success: true,\n      saved_connections: saved_connections\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9kZWxldGUtY29ubmVjdGlvbi1yZXBseS5qcz84NWE3Il0sIm5hbWVzIjpbImhhbmRsZSIsImV2ZW50IiwiY29ubmVjdGlvbl9pbmRleCIsInNhdmVkX2Nvbm5lY3Rpb25zIiwiZGVsZXRlQ29ubmVjdGlvbiIsInNlbmRlciIsInNlbmQiLCJzdWNjZXNzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBRUEsK0RBQWU7QUFDYkEsUUFEYSxrQkFDTEMsS0FESyxFQUNFQyxnQkFERixFQUNvQjtBQUMvQixRQUFJQyxvQkFBb0IsbUZBQUFDLENBQWlCRixnQkFBakIsQ0FBeEI7QUFFQUQsVUFBTUksTUFBTixDQUFhQyxJQUFiLENBQWtCLDRCQUFsQixFQUFnRDtBQUM5Q0MsZUFBUyxJQURxQztBQUU5Q0o7QUFGOEMsS0FBaEQ7QUFJRDtBQVJZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9kZWxldGUtY29ubmVjdGlvbi1yZXBseS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRlbGV0ZUNvbm5lY3Rpb24gfSBmcm9tICcuLi8uLi9zZXR0aW5ncy9zZXR0aW5ncy1tYW5hZ2VyJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGhhbmRsZSAoZXZlbnQsIGNvbm5lY3Rpb25faW5kZXgpIHtcbiAgICBsZXQgc2F2ZWRfY29ubmVjdGlvbnMgPSBkZWxldGVDb25uZWN0aW9uKGNvbm5lY3Rpb25faW5kZXgpXG5cbiAgICBldmVudC5zZW5kZXIuc2VuZCgnZGVsZXRlLWNvbm5lY3Rpb24tcmVzcG9uc2UnLCB7XG4gICAgICBzdWNjZXNzOiB0cnVlLFxuICAgICAgc2F2ZWRfY29ubmVjdGlvbnNcbiAgICB9KVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/delete-connection-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/describe-table-reply.js":
/*!******************************************************!*\
  !*** ./src/main/ipc/replies/describe-table-reply.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, table) {\n    return _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].describeTable(table).then(function (response) {\n      var data = _objectSpread({}, response, {\n        table: table\n      });\n\n      event.sender.send('describe-table-response', data);\n    }).catch(function (error) {\n      console.log(error);\n      event.sender.send('describe-table-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9kZXNjcmliZS10YWJsZS1yZXBseS5qcz8xY2YyIl0sIm5hbWVzIjpbImhhbmRsZSIsImV2ZW50IiwidGFibGUiLCJjb25uZWN0aW9uIiwiZGVzY3JpYmVUYWJsZSIsInRoZW4iLCJkYXRhIiwicmVzcG9uc2UiLCJzZW5kZXIiLCJzZW5kIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUEsK0RBQWU7QUFDYkEsUUFEYSxrQkFDTEMsS0FESyxFQUNFQyxLQURGLEVBQ1M7QUFDcEIsV0FBTyw0REFBQUMsQ0FBV0MsYUFBWCxDQUF5QkYsS0FBekIsRUFDSkcsSUFESSxDQUNDLG9CQUFZO0FBQ2hCLFVBQU1DLHlCQUFZQyxRQUFaO0FBQXNCTDtBQUF0QixRQUFOOztBQUVBRCxZQUFNTyxNQUFOLENBQWFDLElBQWIsQ0FBa0IseUJBQWxCLEVBQTZDSCxJQUE3QztBQUNELEtBTEksRUFNSkksS0FOSSxDQU1FLGlCQUFTO0FBQ2RDLGNBQVFDLEdBQVIsQ0FBWUMsS0FBWjtBQUNBWixZQUFNTyxNQUFOLENBQWFDLElBQWIsQ0FBa0IseUJBQWxCLEVBQTZDSSxLQUE3QztBQUNELEtBVEksQ0FBUDtBQVVEO0FBWlksQ0FBZiIsImZpbGUiOiIuL3NyYy9tYWluL2lwYy9yZXBsaWVzL2Rlc2NyaWJlLXRhYmxlLXJlcGx5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbm5lY3Rpb24gZnJvbSAnLi4vLi4vZGF0YWJhc2UvY29ubmVjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQge1xuICBoYW5kbGUgKGV2ZW50LCB0YWJsZSkge1xuICAgIHJldHVybiBjb25uZWN0aW9uLmRlc2NyaWJlVGFibGUodGFibGUpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7IC4uLnJlc3BvbnNlLCB0YWJsZSB9XG5cbiAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ2Rlc2NyaWJlLXRhYmxlLXJlc3BvbnNlJywgZGF0YSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ2Rlc2NyaWJlLXRhYmxlLXJlc3BvbnNlJywgZXJyb3IpXG4gICAgICB9KVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/describe-table-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/disconnect-reply.js":
/*!**************************************************!*\
  !*** ./src/main/ipc/replies/disconnect-reply.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event) {\n    event.sender.send('disconnect-response', {\n      success: true\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9kaXNjb25uZWN0LXJlcGx5LmpzP2JhNGIiXSwibmFtZXMiOlsiaGFuZGxlIiwiZXZlbnQiLCJzZW5kZXIiLCJzZW5kIiwic3VjY2VzcyJdLCJtYXBwaW5ncyI6IjtBQUFBLCtEQUFlO0FBQ2JBLFFBRGEsa0JBQ0xDLEtBREssRUFDRTtBQUNiQSxVQUFNQyxNQUFOLENBQWFDLElBQWIsQ0FBa0IscUJBQWxCLEVBQXlDO0FBQUVDLGVBQVM7QUFBWCxLQUF6QztBQUNEO0FBSFksQ0FBZiIsImZpbGUiOiIuL3NyYy9tYWluL2lwYy9yZXBsaWVzL2Rpc2Nvbm5lY3QtcmVwbHkuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGhhbmRsZSAoZXZlbnQpIHtcbiAgICBldmVudC5zZW5kZXIuc2VuZCgnZGlzY29ubmVjdC1yZXNwb25zZScsIHsgc3VjY2VzczogdHJ1ZSB9KVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/disconnect-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/get-connections-reply.js":
/*!*******************************************************!*\
  !*** ./src/main/ipc/replies/get-connections-reply.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _settings_settings_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../settings/settings-manager */ \"./src/main/settings/settings-manager.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event) {\n    var saved_connections = Object(_settings_settings_manager__WEBPACK_IMPORTED_MODULE_0__[\"getSavedConnections\"])();\n    event.sender.send('get-connections-response', {\n      success: true,\n      saved_connections: saved_connections\n    });\n  },\n  handleSync: function handleSync(event) {\n    var saved_connections = Object(_settings_settings_manager__WEBPACK_IMPORTED_MODULE_0__[\"getSavedConnections\"])();\n    event.returnValue = saved_connections;\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9nZXQtY29ubmVjdGlvbnMtcmVwbHkuanM/OGMwMiJdLCJuYW1lcyI6WyJoYW5kbGUiLCJldmVudCIsInNhdmVkX2Nvbm5lY3Rpb25zIiwiZ2V0U2F2ZWRDb25uZWN0aW9ucyIsInNlbmRlciIsInNlbmQiLCJzdWNjZXNzIiwiaGFuZGxlU3luYyIsInJldHVyblZhbHVlIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBRUEsK0RBQWU7QUFDYkEsUUFEYSxrQkFDTEMsS0FESyxFQUNFO0FBQ2IsUUFBTUMsb0JBQW9CLHNGQUFBQyxFQUExQjtBQUVBRixVQUFNRyxNQUFOLENBQWFDLElBQWIsQ0FBa0IsMEJBQWxCLEVBQThDO0FBQzVDQyxlQUFTLElBRG1DO0FBRTVDSjtBQUY0QyxLQUE5QztBQUlELEdBUlk7QUFVYkssWUFWYSxzQkFVRE4sS0FWQyxFQVVNO0FBQ2pCLFFBQUlDLG9CQUFvQixzRkFBQUMsRUFBeEI7QUFFQUYsVUFBTU8sV0FBTixHQUFvQk4saUJBQXBCO0FBQ0Q7QUFkWSxDQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vaXBjL3JlcGxpZXMvZ2V0LWNvbm5lY3Rpb25zLXJlcGx5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2F2ZWRDb25uZWN0aW9ucyB9IGZyb20gJy4uLy4uL3NldHRpbmdzL3NldHRpbmdzLW1hbmFnZXInXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgaGFuZGxlIChldmVudCkge1xuICAgIGNvbnN0IHNhdmVkX2Nvbm5lY3Rpb25zID0gZ2V0U2F2ZWRDb25uZWN0aW9ucygpXG5cbiAgICBldmVudC5zZW5kZXIuc2VuZCgnZ2V0LWNvbm5lY3Rpb25zLXJlc3BvbnNlJywge1xuICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgIHNhdmVkX2Nvbm5lY3Rpb25zXG4gICAgfSlcbiAgfSxcblxuICBoYW5kbGVTeW5jIChldmVudCkge1xuICAgIGxldCBzYXZlZF9jb25uZWN0aW9ucyA9IGdldFNhdmVkQ29ubmVjdGlvbnMoKVxuXG4gICAgZXZlbnQucmV0dXJuVmFsdWUgPSBzYXZlZF9jb25uZWN0aW9uc1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/get-connections-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/get-copo-chart-reply.js":
/*!******************************************************!*\
  !*** ./src/main/ipc/replies/get-copo-chart-reply.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, node) {\n    console.log(node);\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9nZXQtY29wby1jaGFydC1yZXBseS5qcz85ZTQyIl0sIm5hbWVzIjpbImhhbmRsZSIsImV2ZW50Iiwibm9kZSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQSwrREFBZTtBQUViQSxRQUZhLGtCQUVOQyxLQUZNLEVBRUNDLElBRkQsRUFFTztBQUNsQkMsWUFBUUMsR0FBUixDQUFZRixJQUFaO0FBQ0Q7QUFKWSxDQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vaXBjL3JlcGxpZXMvZ2V0LWNvcG8tY2hhcnQtcmVwbHkuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29ubmVjdGlvbiBmcm9tICcuLi8uLi9kYXRhYmFzZS9jb25uZWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgaGFuZGxlKGV2ZW50LCBub2RlKSB7XG4gICAgY29uc29sZS5sb2cobm9kZSlcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/get-copo-chart-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/get-platform-chart-reply.js":
/*!**********************************************************!*\
  !*** ./src/main/ipc/replies/get-platform-chart-reply.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, node) {\n    return _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getPlatformInfo(node.label).then(function (res1) {\n      _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].searchComponentsByType(node.label).then(function (res2) {\n        Object.assign(res1, {\n          components: res2\n        });\n        _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getPlatformTE(node.label).then(function (res3) {\n          Object.assign(res1, {\n            time_event: res3\n          });\n          event.sender.send('platform-chart-response', res1);\n        });\n      });\n    }).catch(function (error) {\n      console.log(error);\n      event.sender.send('platform-chart-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9nZXQtcGxhdGZvcm0tY2hhcnQtcmVwbHkuanM/YWM0NCJdLCJuYW1lcyI6WyJoYW5kbGUiLCJldmVudCIsIm5vZGUiLCJjb25uZWN0aW9uIiwiZ2V0UGxhdGZvcm1JbmZvIiwibGFiZWwiLCJ0aGVuIiwic2VhcmNoQ29tcG9uZW50c0J5VHlwZSIsIk9iamVjdCIsImFzc2lnbiIsInJlczEiLCJjb21wb25lbnRzIiwicmVzMiIsImdldFBsYXRmb3JtVEUiLCJ0aW1lX2V2ZW50IiwicmVzMyIsInNlbmRlciIsInNlbmQiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUVBLCtEQUFlO0FBRWJBLFFBRmEsa0JBRU5DLEtBRk0sRUFFQ0MsSUFGRCxFQUVPO0FBQ2xCLFdBQU8sNERBQUFDLENBQVdDLGVBQVgsQ0FBMkJGLEtBQUtHLEtBQWhDLEVBQ0pDLElBREksQ0FDQyxnQkFBUTtBQUNaSCxNQUFBLDREQUFBQSxDQUFXSSxzQkFBWCxDQUFrQ0wsS0FBS0csS0FBdkMsRUFDR0MsSUFESCxDQUNRLGdCQUFRO0FBQ1pFLGVBQU9DLE1BQVAsQ0FBY0MsSUFBZCxFQUFvQjtBQUFDQyxzQkFBWUM7QUFBYixTQUFwQjtBQUNBVCxRQUFBLDREQUFBQSxDQUFXVSxhQUFYLENBQXlCWCxLQUFLRyxLQUE5QixFQUNHQyxJQURILENBQ1EsZ0JBQU07QUFDVkUsaUJBQU9DLE1BQVAsQ0FBY0MsSUFBZCxFQUFvQjtBQUFDSSx3QkFBWUM7QUFBYixXQUFwQjtBQUNBZCxnQkFBTWUsTUFBTixDQUFhQyxJQUFiLENBQWtCLHlCQUFsQixFQUE2Q1AsSUFBN0M7QUFDRCxTQUpIO0FBTUQsT0FUSDtBQVVELEtBWkksRUFhSlEsS0FiSSxDQWFFLGlCQUFTO0FBQ2RDLGNBQVFDLEdBQVIsQ0FBWUMsS0FBWjtBQUNBcEIsWUFBTWUsTUFBTixDQUFhQyxJQUFiLENBQWtCLHlCQUFsQixFQUE2Q0ksS0FBN0M7QUFDRCxLQWhCSSxDQUFQO0FBaUJEO0FBcEJZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9nZXQtcGxhdGZvcm0tY2hhcnQtcmVwbHkuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29ubmVjdGlvbiBmcm9tICcuLi8uLi9kYXRhYmFzZS9jb25uZWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgaGFuZGxlKGV2ZW50LCBub2RlKSB7XG4gICAgcmV0dXJuIGNvbm5lY3Rpb24uZ2V0UGxhdGZvcm1JbmZvKG5vZGUubGFiZWwpXG4gICAgICAudGhlbihyZXMxID0+IHtcbiAgICAgICAgY29ubmVjdGlvbi5zZWFyY2hDb21wb25lbnRzQnlUeXBlKG5vZGUubGFiZWwpXG4gICAgICAgICAgLnRoZW4ocmVzMiA9PiB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlczEsIHtjb21wb25lbnRzOiByZXMyfSlcbiAgICAgICAgICAgIGNvbm5lY3Rpb24uZ2V0UGxhdGZvcm1URShub2RlLmxhYmVsKVxuICAgICAgICAgICAgICAudGhlbihyZXMzPT57XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXMxLCB7dGltZV9ldmVudDogcmVzM30pXG4gICAgICAgICAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ3BsYXRmb3JtLWNoYXJ0LXJlc3BvbnNlJywgcmVzMSlcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIGV2ZW50LnNlbmRlci5zZW5kKCdwbGF0Zm9ybS1jaGFydC1yZXNwb25zZScsIGVycm9yKVxuICAgICAgfSlcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/get-platform-chart-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/nav-reply.js":
/*!*******************************************!*\
  !*** ./src/main/ipc/replies/nav-reply.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event) {\n    var countries = ['美国', '日本', '印度', '台湾', '俄罗斯', '韩国'];\n    countries.forEach(function (value, index) {\n      _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].searchByCountry(value).then(function (response) {\n        //console.log(response.results[0].platform_type)\n        function f(i) {\n          if (i < response.results.length) {\n            _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].searchComponentsByType(response.results[i].platform_type).then(function (res) {\n              Object.assign(response.results[i], {\n                components: res\n              });\n              f(++i);\n            });\n          } else {\n            Object.assign(response, {\n              country: index\n            });\n            event.sender.send('nav-data-response', response);\n          }\n        }\n\n        var num = 0;\n        f(num);\n      }).catch(function (error) {\n        console.log(error);\n        event.sender.send('nav-data-response', error);\n      });\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9uYXYtcmVwbHkuanM/YjEwMSJdLCJuYW1lcyI6WyJoYW5kbGUiLCJldmVudCIsImNvdW50cmllcyIsImZvckVhY2giLCJ2YWx1ZSIsImluZGV4IiwiY29ubmVjdGlvbiIsInNlYXJjaEJ5Q291bnRyeSIsInRoZW4iLCJmIiwiaSIsInJlc3BvbnNlIiwicmVzdWx0cyIsImxlbmd0aCIsInNlYXJjaENvbXBvbmVudHNCeVR5cGUiLCJwbGF0Zm9ybV90eXBlIiwiT2JqZWN0IiwiYXNzaWduIiwiY29tcG9uZW50cyIsInJlcyIsImNvdW50cnkiLCJzZW5kZXIiLCJzZW5kIiwibnVtIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFFQSwrREFBZTtBQUViQSxRQUZhLGtCQUVOQyxLQUZNLEVBRUM7QUFFWixRQUFJQyxZQUFZLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLEtBQXpCLEVBQWdDLElBQWhDLENBQWhCO0FBRUFBLGNBQVVDLE9BQVYsQ0FBa0IsVUFBVUMsS0FBVixFQUFpQkMsS0FBakIsRUFBd0I7QUFDeENDLE1BQUEsNERBQUFBLENBQVdDLGVBQVgsQ0FBMkJILEtBQTNCLEVBQ0dJLElBREgsQ0FDUSxvQkFBWTtBQUNoQjtBQUVBLGlCQUFTQyxDQUFULENBQVdDLENBQVgsRUFBYztBQUNaLGNBQUlBLElBQUlDLFNBQVNDLE9BQVQsQ0FBaUJDLE1BQXpCLEVBQWlDO0FBQy9CUCxZQUFBLDREQUFBQSxDQUFXUSxzQkFBWCxDQUFrQ0gsU0FBU0MsT0FBVCxDQUFpQkYsQ0FBakIsRUFBb0JLLGFBQXRELEVBQ0dQLElBREgsQ0FDUSxlQUFPO0FBQ1hRLHFCQUFPQyxNQUFQLENBQWNOLFNBQVNDLE9BQVQsQ0FBaUJGLENBQWpCLENBQWQsRUFBbUM7QUFBQ1EsNEJBQVlDO0FBQWIsZUFBbkM7QUFDQVYsZ0JBQUUsRUFBRUMsQ0FBSjtBQUNELGFBSkg7QUFLRCxXQU5ELE1BTU87QUFDTE0sbUJBQU9DLE1BQVAsQ0FBY04sUUFBZCxFQUF3QjtBQUFDUyx1QkFBU2Y7QUFBVixhQUF4QjtBQUNBSixrQkFBTW9CLE1BQU4sQ0FBYUMsSUFBYixDQUFrQixtQkFBbEIsRUFBdUNYLFFBQXZDO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJWSxNQUFNLENBQVY7QUFFQWQsVUFBRWMsR0FBRjtBQUdELE9BdEJILEVBdUJHQyxLQXZCSCxDQXVCUyxpQkFBUztBQUNkQyxnQkFBUUMsR0FBUixDQUFZQyxLQUFaO0FBQ0ExQixjQUFNb0IsTUFBTixDQUFhQyxJQUFiLENBQWtCLG1CQUFsQixFQUF1Q0ssS0FBdkM7QUFDRCxPQTFCSDtBQTJCRCxLQTVCRDtBQStCRDtBQXJDWSxDQUFmIiwiZmlsZSI6Ii4vc3JjL21haW4vaXBjL3JlcGxpZXMvbmF2LXJlcGx5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbm5lY3Rpb24gZnJvbSAnLi4vLi4vZGF0YWJhc2UvY29ubmVjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGhhbmRsZShldmVudCkge1xuXG4gICAgdmFyIGNvdW50cmllcyA9IFsn576O5Zu9JywgJ+aXpeacrCcsICfljbDluqYnLCAn5Y+w5rm+JywgJ+S/hOe9l+aWrycsICfpn6nlm70nXVxuXG4gICAgY291bnRyaWVzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBpbmRleCkge1xuICAgICAgY29ubmVjdGlvbi5zZWFyY2hCeUNvdW50cnkodmFsdWUpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3BvbnNlLnJlc3VsdHNbMF0ucGxhdGZvcm1fdHlwZSlcblxuICAgICAgICAgIGZ1bmN0aW9uIGYoaSkge1xuICAgICAgICAgICAgaWYgKGkgPCByZXNwb25zZS5yZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICBjb25uZWN0aW9uLnNlYXJjaENvbXBvbmVudHNCeVR5cGUocmVzcG9uc2UucmVzdWx0c1tpXS5wbGF0Zm9ybV90eXBlKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlc3BvbnNlLnJlc3VsdHNbaV0sIHtjb21wb25lbnRzOiByZXN9KVxuICAgICAgICAgICAgICAgICAgZigrK2kpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVzcG9uc2UsIHtjb3VudHJ5OiBpbmRleH0pXG4gICAgICAgICAgICAgIGV2ZW50LnNlbmRlci5zZW5kKCduYXYtZGF0YS1yZXNwb25zZScsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbnVtID0gMDtcblxuICAgICAgICAgIGYobnVtKVxuXG5cbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgICBldmVudC5zZW5kZXIuc2VuZCgnbmF2LWRhdGEtcmVzcG9uc2UnLCBlcnJvcilcbiAgICAgICAgfSlcbiAgICB9KVxuXG5cbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/nav-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/new-record-reply.js":
/*!**************************************************!*\
  !*** ./src/main/ipc/replies/new-record-reply.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, _ref) {\n    var table = _ref.table,\n        data = _ref.data;\n    return _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].insert(table, data).then(function (original_response) {\n      var response = _objectSpread({}, original_response, {\n        table: table\n      });\n\n      event.sender.send('new-record-response', response);\n    }).catch(function (error) {\n      console.log(error);\n      event.sender.send('new-record-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9uZXctcmVjb3JkLXJlcGx5LmpzPzYxMzQiXSwibmFtZXMiOlsiaGFuZGxlIiwiZXZlbnQiLCJ0YWJsZSIsImRhdGEiLCJjb25uZWN0aW9uIiwiaW5zZXJ0IiwidGhlbiIsInJlc3BvbnNlIiwib3JpZ2luYWxfcmVzcG9uc2UiLCJzZW5kZXIiLCJzZW5kIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUEsK0RBQWU7QUFDYkEsUUFEYSxrQkFDTEMsS0FESyxRQUNtQjtBQUFBLFFBQWZDLEtBQWUsUUFBZkEsS0FBZTtBQUFBLFFBQVJDLElBQVEsUUFBUkEsSUFBUTtBQUM5QixXQUFPLDREQUFBQyxDQUFXQyxNQUFYLENBQWtCSCxLQUFsQixFQUF5QkMsSUFBekIsRUFDSkcsSUFESSxDQUNDLDZCQUFxQjtBQUN6QixVQUFNQyw2QkFBZ0JDLGlCQUFoQjtBQUFtQ047QUFBbkMsUUFBTjs7QUFDQUQsWUFBTVEsTUFBTixDQUFhQyxJQUFiLENBQWtCLHFCQUFsQixFQUF5Q0gsUUFBekM7QUFDRCxLQUpJLEVBS0pJLEtBTEksQ0FLRSxpQkFBUztBQUNkQyxjQUFRQyxHQUFSLENBQVlDLEtBQVo7QUFDQWIsWUFBTVEsTUFBTixDQUFhQyxJQUFiLENBQWtCLHFCQUFsQixFQUF5Q0ksS0FBekM7QUFDRCxLQVJJLENBQVA7QUFTRDtBQVhZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy9uZXctcmVjb3JkLXJlcGx5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbm5lY3Rpb24gZnJvbSAnLi4vLi4vZGF0YWJhc2UvY29ubmVjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQge1xuICBoYW5kbGUgKGV2ZW50LCB7IHRhYmxlLCBkYXRhIH0pIHtcbiAgICByZXR1cm4gY29ubmVjdGlvbi5pbnNlcnQodGFibGUsIGRhdGEpXG4gICAgICAudGhlbihvcmlnaW5hbF9yZXNwb25zZSA9PiB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0geyAuLi5vcmlnaW5hbF9yZXNwb25zZSwgdGFibGUgfVxuICAgICAgICBldmVudC5zZW5kZXIuc2VuZCgnbmV3LXJlY29yZC1yZXNwb25zZScsIHJlc3BvbnNlKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKVxuICAgICAgICBldmVudC5zZW5kZXIuc2VuZCgnbmV3LXJlY29yZC1yZXNwb25zZScsIGVycm9yKVxuICAgICAgfSlcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/new-record-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/table-data-reply.js":
/*!**************************************************!*\
  !*** ./src/main/ipc/replies/table-data-reply.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, _ref) {\n    var table = _ref.table,\n        limit = _ref.limit,\n        offset = _ref.offset;\n    return _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].getTableData(table, limit, offset).then(function (response) {\n      var data = _objectSpread({}, response, {\n        table: table,\n        limit: limit,\n        offset: offset\n      });\n\n      event.sender.send('table-data-response', data);\n    }).catch(function (error) {\n      console.log(error);\n      event.sender.send('table-data-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy90YWJsZS1kYXRhLXJlcGx5LmpzP2I4YjAiXSwibmFtZXMiOlsiaGFuZGxlIiwiZXZlbnQiLCJ0YWJsZSIsImxpbWl0Iiwib2Zmc2V0IiwiY29ubmVjdGlvbiIsImdldFRhYmxlRGF0YSIsInRoZW4iLCJkYXRhIiwicmVzcG9uc2UiLCJzZW5kZXIiLCJzZW5kIiwiY2F0Y2giLCJjb25zb2xlIiwibG9nIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRUEsK0RBQWU7QUFDYkEsUUFEYSxrQkFDTEMsS0FESyxRQUM0QjtBQUFBLFFBQXhCQyxLQUF3QixRQUF4QkEsS0FBd0I7QUFBQSxRQUFqQkMsS0FBaUIsUUFBakJBLEtBQWlCO0FBQUEsUUFBVkMsTUFBVSxRQUFWQSxNQUFVO0FBQ3ZDLFdBQU8sNERBQUFDLENBQVdDLFlBQVgsQ0FBd0JKLEtBQXhCLEVBQStCQyxLQUEvQixFQUFzQ0MsTUFBdEMsRUFDSkcsSUFESSxDQUNDLG9CQUFZO0FBRWhCLFVBQU1DLHlCQUFZQyxRQUFaO0FBQXNCUCxvQkFBdEI7QUFBNkJDLG9CQUE3QjtBQUFvQ0M7QUFBcEMsUUFBTjs7QUFFQUgsWUFBTVMsTUFBTixDQUFhQyxJQUFiLENBQWtCLHFCQUFsQixFQUF5Q0gsSUFBekM7QUFDRCxLQU5JLEVBT0pJLEtBUEksQ0FPRSxpQkFBUztBQUNkQyxjQUFRQyxHQUFSLENBQVlDLEtBQVo7QUFDQWQsWUFBTVMsTUFBTixDQUFhQyxJQUFiLENBQWtCLHFCQUFsQixFQUF5Q0ksS0FBekM7QUFDRCxLQVZJLENBQVA7QUFXRDtBQWJZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy90YWJsZS1kYXRhLXJlcGx5LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbm5lY3Rpb24gZnJvbSAnLi4vLi4vZGF0YWJhc2UvY29ubmVjdGlvbidcblxuZXhwb3J0IGRlZmF1bHQge1xuICBoYW5kbGUgKGV2ZW50LCB7IHRhYmxlLCBsaW1pdCwgb2Zmc2V0IH0pIHtcbiAgICByZXR1cm4gY29ubmVjdGlvbi5nZXRUYWJsZURhdGEodGFibGUsIGxpbWl0LCBvZmZzZXQpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IHsgLi4ucmVzcG9uc2UsIHRhYmxlLCBsaW1pdCwgb2Zmc2V0IH1cblxuICAgICAgICBldmVudC5zZW5kZXIuc2VuZCgndGFibGUtZGF0YS1yZXNwb25zZScsIGRhdGEpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpXG4gICAgICAgIGV2ZW50LnNlbmRlci5zZW5kKCd0YWJsZS1kYXRhLXJlc3BvbnNlJywgZXJyb3IpXG4gICAgICB9KVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/table-data-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/replies/tables-reply.js":
/*!**********************************************!*\
  !*** ./src/main/ipc/replies/tables-reply.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _database_connection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../database/connection */ \"./src/main/database/connection.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  handle: function handle(event, database) {\n    return _database_connection__WEBPACK_IMPORTED_MODULE_0__[\"default\"].tablesForDatabase(database).then(function (response) {\n      event.sender.send('tables-response', response);\n    }).catch(function (error) {\n      console.log(error);\n      event.sender.send('tables-response', error);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbGllcy90YWJsZXMtcmVwbHkuanM/MTkxMyJdLCJuYW1lcyI6WyJoYW5kbGUiLCJldmVudCIsImRhdGFiYXNlIiwiY29ubmVjdGlvbiIsInRhYmxlc0ZvckRhdGFiYXNlIiwidGhlbiIsInNlbmRlciIsInNlbmQiLCJyZXNwb25zZSIsImNhdGNoIiwiY29uc29sZSIsImxvZyIsImVycm9yIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBRUEsK0RBQWU7QUFDYkEsUUFEYSxrQkFDTEMsS0FESyxFQUNFQyxRQURGLEVBQ1k7QUFDdkIsV0FBTyw0REFBQUMsQ0FBV0MsaUJBQVgsQ0FBNkJGLFFBQTdCLEVBQ0pHLElBREksQ0FDQyxvQkFBWTtBQUNoQkosWUFBTUssTUFBTixDQUFhQyxJQUFiLENBQWtCLGlCQUFsQixFQUFxQ0MsUUFBckM7QUFDRCxLQUhJLEVBSUpDLEtBSkksQ0FJRSxpQkFBUztBQUNkQyxjQUFRQyxHQUFSLENBQVlDLEtBQVo7QUFDQVgsWUFBTUssTUFBTixDQUFhQyxJQUFiLENBQWtCLGlCQUFsQixFQUFxQ0ssS0FBckM7QUFDRCxLQVBJLENBQVA7QUFRRDtBQVZZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbGllcy90YWJsZXMtcmVwbHkuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29ubmVjdGlvbiBmcm9tICcuLi8uLi9kYXRhYmFzZS9jb25uZWN0aW9uJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGhhbmRsZSAoZXZlbnQsIGRhdGFiYXNlKSB7XG4gICAgcmV0dXJuIGNvbm5lY3Rpb24udGFibGVzRm9yRGF0YWJhc2UoZGF0YWJhc2UpXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgIGV2ZW50LnNlbmRlci5zZW5kKCd0YWJsZXMtcmVzcG9uc2UnLCByZXNwb25zZSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcilcbiAgICAgICAgZXZlbnQuc2VuZGVyLnNlbmQoJ3RhYmxlcy1yZXNwb25zZScsIGVycm9yKVxuICAgICAgfSlcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/main/ipc/replies/tables-reply.js\n");

/***/ }),

/***/ "./src/main/ipc/reply-provider.js":
/*!****************************************!*\
  !*** ./src/main/ipc/reply-provider.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ \"electron\");\n/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _replies_connect_reply__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./replies/connect-reply */ \"./src/main/ipc/replies/connect-reply.js\");\n/* harmony import */ var _replies_get_connections_reply__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./replies/get-connections-reply */ \"./src/main/ipc/replies/get-connections-reply.js\");\n/* harmony import */ var _replies_delete_connection_reply__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./replies/delete-connection-reply */ \"./src/main/ipc/replies/delete-connection-reply.js\");\n/* harmony import */ var _replies_disconnect_reply__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./replies/disconnect-reply */ \"./src/main/ipc/replies/disconnect-reply.js\");\n/* harmony import */ var _replies_databases_reply__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./replies/databases-reply */ \"./src/main/ipc/replies/databases-reply.js\");\n/* harmony import */ var _replies_tables_reply__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./replies/tables-reply */ \"./src/main/ipc/replies/tables-reply.js\");\n/* harmony import */ var _replies_table_data_reply__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./replies/table-data-reply */ \"./src/main/ipc/replies/table-data-reply.js\");\n/* harmony import */ var _replies_describe_table_reply__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./replies/describe-table-reply */ \"./src/main/ipc/replies/describe-table-reply.js\");\n/* harmony import */ var _replies_new_record_reply__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./replies/new-record-reply */ \"./src/main/ipc/replies/new-record-reply.js\");\n/* harmony import */ var _replies_nav_reply__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./replies/nav-reply */ \"./src/main/ipc/replies/nav-reply.js\");\n/* harmony import */ var _replies_get_platform_chart_reply__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./replies/get-platform-chart-reply */ \"./src/main/ipc/replies/get-platform-chart-reply.js\");\n/* harmony import */ var _replies_get_copo_chart_reply__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./replies/get-copo-chart-reply */ \"./src/main/ipc/replies/get-copo-chart-reply.js\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n/**\n * Define which request channels gets handled by which function.\n */\n\nvar channels = {\n  'get-connections-request': _replies_get_connections_reply__WEBPACK_IMPORTED_MODULE_2__[\"default\"].handle,\n  'get-connections-request-sync': _replies_get_connections_reply__WEBPACK_IMPORTED_MODULE_2__[\"default\"].handleSync,\n  'delete-connection-request': _replies_delete_connection_reply__WEBPACK_IMPORTED_MODULE_3__[\"default\"].handle,\n  'connect-request': _replies_connect_reply__WEBPACK_IMPORTED_MODULE_1__[\"default\"].handle,\n  'disconnect-request': _replies_disconnect_reply__WEBPACK_IMPORTED_MODULE_4__[\"default\"].handle,\n  'databases-request': _replies_databases_reply__WEBPACK_IMPORTED_MODULE_5__[\"default\"].handle,\n  'tables-request': _replies_tables_reply__WEBPACK_IMPORTED_MODULE_6__[\"default\"].handle,\n  'table-data-request': _replies_table_data_reply__WEBPACK_IMPORTED_MODULE_7__[\"default\"].handle,\n  'describe-table-request': _replies_describe_table_reply__WEBPACK_IMPORTED_MODULE_8__[\"default\"].handle,\n  'new-record-request': _replies_new_record_reply__WEBPACK_IMPORTED_MODULE_9__[\"default\"].handle,\n  'nav-request': _replies_nav_reply__WEBPACK_IMPORTED_MODULE_10__[\"default\"].handle,\n  'get-platform-chart-request': _replies_get_platform_chart_reply__WEBPACK_IMPORTED_MODULE_11__[\"default\"].handle,\n  'get-copo-chart-request': _replies_get_copo_chart_reply__WEBPACK_IMPORTED_MODULE_12__[\"default\"].handle\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  /**\n   * Register each defined reply handler to it's channel.\n   */\n  registerReplies: function registerReplies() {\n    Object.keys(channels).forEach(function (channel) {\n      electron__WEBPACK_IMPORTED_MODULE_0__[\"ipcMain\"].on(channel, channels[channel]);\n    });\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pcGMvcmVwbHktcHJvdmlkZXIuanM/NTY2OCJdLCJuYW1lcyI6WyJjaGFubmVscyIsIkdldENvbm5lY3Rpb25zUmVwbHkiLCJoYW5kbGUiLCJoYW5kbGVTeW5jIiwiRGVsZXRlQ29ubmVjdGlvblJlcGx5IiwiQ29ubmVjdFJlcGx5IiwiRGlzY29ubmVjdFJlcGx5IiwiRGF0YWJhc2VzUmVwbHkiLCJUYWJsZXNSZXBseSIsIlRhYmxlRGF0YVJlcGx5IiwiRGVzY3JpYmVUYWJsZVJlcGx5IiwiTmV3UmVjb3JkUmVwbHkiLCJOYXZSZXBseSIsIkdldFBsYXRmb3JtQ2hhcnRSZXBseSIsIkdldENvcG9DaGFydFJlcGx5IiwicmVnaXN0ZXJSZXBsaWVzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJpcGNNYWluIiwib24iLCJjaGFubmVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7O0FBR0EsSUFBSUEsV0FBVztBQUNiLDZCQUEyQixzRUFBQUMsQ0FBb0JDLE1BRGxDO0FBRWIsa0NBQWdDLHNFQUFBRCxDQUFvQkUsVUFGdkM7QUFHYiwrQkFBNkIsd0VBQUFDLENBQXNCRixNQUh0QztBQUliLHFCQUFtQiw4REFBQUcsQ0FBYUgsTUFKbkI7QUFLYix3QkFBc0IsaUVBQUFJLENBQWdCSixNQUx6QjtBQU1iLHVCQUFxQixnRUFBQUssQ0FBZUwsTUFOdkI7QUFPYixvQkFBa0IsNkRBQUFNLENBQVlOLE1BUGpCO0FBUWIsd0JBQXNCLGlFQUFBTyxDQUFlUCxNQVJ4QjtBQVNiLDRCQUEwQixxRUFBQVEsQ0FBbUJSLE1BVGhDO0FBVWIsd0JBQXNCLGlFQUFBUyxDQUFlVCxNQVZ4QjtBQVdiLGlCQUFlLDJEQUFBVSxDQUFTVixNQVhYO0FBWWIsZ0NBQThCLDBFQUFBVyxDQUFzQlgsTUFadkM7QUFhYiw0QkFBMEIsc0VBQUFZLENBQWtCWjtBQWIvQixDQUFmO0FBZ0JBLCtEQUFlO0FBQ2I7OztBQUdBYSxpQkFKYSw2QkFJTTtBQUNqQkMsV0FBT0MsSUFBUCxDQUFZakIsUUFBWixFQUNHa0IsT0FESCxDQUNXLG1CQUFXO0FBQ2xCQyxNQUFBLGdEQUFBQSxDQUFRQyxFQUFSLENBQVdDLE9BQVgsRUFBb0JyQixTQUFTcUIsT0FBVCxDQUFwQjtBQUNELEtBSEg7QUFJRDtBQVRZLENBQWYiLCJmaWxlIjoiLi9zcmMvbWFpbi9pcGMvcmVwbHktcHJvdmlkZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpcGNNYWluIH0gZnJvbSAnZWxlY3Ryb24nXG5pbXBvcnQgQ29ubmVjdFJlcGx5IGZyb20gJy4vcmVwbGllcy9jb25uZWN0LXJlcGx5J1xuaW1wb3J0IEdldENvbm5lY3Rpb25zUmVwbHkgZnJvbSAnLi9yZXBsaWVzL2dldC1jb25uZWN0aW9ucy1yZXBseSdcbmltcG9ydCBEZWxldGVDb25uZWN0aW9uUmVwbHkgZnJvbSAnLi9yZXBsaWVzL2RlbGV0ZS1jb25uZWN0aW9uLXJlcGx5J1xuaW1wb3J0IERpc2Nvbm5lY3RSZXBseSBmcm9tICcuL3JlcGxpZXMvZGlzY29ubmVjdC1yZXBseSdcbmltcG9ydCBEYXRhYmFzZXNSZXBseSBmcm9tICcuL3JlcGxpZXMvZGF0YWJhc2VzLXJlcGx5J1xuaW1wb3J0IFRhYmxlc1JlcGx5IGZyb20gJy4vcmVwbGllcy90YWJsZXMtcmVwbHknXG5pbXBvcnQgVGFibGVEYXRhUmVwbHkgZnJvbSAnLi9yZXBsaWVzL3RhYmxlLWRhdGEtcmVwbHknXG5pbXBvcnQgRGVzY3JpYmVUYWJsZVJlcGx5IGZyb20gJy4vcmVwbGllcy9kZXNjcmliZS10YWJsZS1yZXBseSdcbmltcG9ydCBOZXdSZWNvcmRSZXBseSBmcm9tICAnLi9yZXBsaWVzL25ldy1yZWNvcmQtcmVwbHknXG5pbXBvcnQgTmF2UmVwbHkgZnJvbSAnLi9yZXBsaWVzL25hdi1yZXBseSdcbmltcG9ydCBHZXRQbGF0Zm9ybUNoYXJ0UmVwbHkgZnJvbSAnLi9yZXBsaWVzL2dldC1wbGF0Zm9ybS1jaGFydC1yZXBseSdcbmltcG9ydCBHZXRDb3BvQ2hhcnRSZXBseSBmcm9tICcuL3JlcGxpZXMvZ2V0LWNvcG8tY2hhcnQtcmVwbHknXG5cbi8qKlxuICogRGVmaW5lIHdoaWNoIHJlcXVlc3QgY2hhbm5lbHMgZ2V0cyBoYW5kbGVkIGJ5IHdoaWNoIGZ1bmN0aW9uLlxuICovXG5sZXQgY2hhbm5lbHMgPSB7XG4gICdnZXQtY29ubmVjdGlvbnMtcmVxdWVzdCc6IEdldENvbm5lY3Rpb25zUmVwbHkuaGFuZGxlLFxuICAnZ2V0LWNvbm5lY3Rpb25zLXJlcXVlc3Qtc3luYyc6IEdldENvbm5lY3Rpb25zUmVwbHkuaGFuZGxlU3luYyxcbiAgJ2RlbGV0ZS1jb25uZWN0aW9uLXJlcXVlc3QnOiBEZWxldGVDb25uZWN0aW9uUmVwbHkuaGFuZGxlLFxuICAnY29ubmVjdC1yZXF1ZXN0JzogQ29ubmVjdFJlcGx5LmhhbmRsZSxcbiAgJ2Rpc2Nvbm5lY3QtcmVxdWVzdCc6IERpc2Nvbm5lY3RSZXBseS5oYW5kbGUsXG4gICdkYXRhYmFzZXMtcmVxdWVzdCc6IERhdGFiYXNlc1JlcGx5LmhhbmRsZSxcbiAgJ3RhYmxlcy1yZXF1ZXN0JzogVGFibGVzUmVwbHkuaGFuZGxlLFxuICAndGFibGUtZGF0YS1yZXF1ZXN0JzogVGFibGVEYXRhUmVwbHkuaGFuZGxlLFxuICAnZGVzY3JpYmUtdGFibGUtcmVxdWVzdCc6IERlc2NyaWJlVGFibGVSZXBseS5oYW5kbGUsXG4gICduZXctcmVjb3JkLXJlcXVlc3QnOiBOZXdSZWNvcmRSZXBseS5oYW5kbGUsXG4gICduYXYtcmVxdWVzdCc6IE5hdlJlcGx5LmhhbmRsZSxcbiAgJ2dldC1wbGF0Zm9ybS1jaGFydC1yZXF1ZXN0JzogR2V0UGxhdGZvcm1DaGFydFJlcGx5LmhhbmRsZSxcbiAgJ2dldC1jb3BvLWNoYXJ0LXJlcXVlc3QnOiBHZXRDb3BvQ2hhcnRSZXBseS5oYW5kbGUsXG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGVhY2ggZGVmaW5lZCByZXBseSBoYW5kbGVyIHRvIGl0J3MgY2hhbm5lbC5cbiAgICovXG4gIHJlZ2lzdGVyUmVwbGllcyAoKSB7XG4gICAgT2JqZWN0LmtleXMoY2hhbm5lbHMpXG4gICAgICAuZm9yRWFjaChjaGFubmVsID0+IHtcbiAgICAgICAgaXBjTWFpbi5vbihjaGFubmVsLCBjaGFubmVsc1tjaGFubmVsXSlcbiAgICAgIH0pXG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/ipc/reply-provider.js\n");

/***/ }),

/***/ "./src/main/settings/settings-manager.js":
/*!***********************************************!*\
  !*** ./src/main/settings/settings-manager.js ***!
  \***********************************************/
/*! exports provided: getSavedConnections, saveConnectionIfNotExists, deleteConnection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getSavedConnections\", function() { return getSavedConnections; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"saveConnectionIfNotExists\", function() { return saveConnectionIfNotExists; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteConnection\", function() { return deleteConnection; });\n/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron-settings */ \"./node_modules/electron-settings/index.js\");\n/* harmony import */ var electron_settings__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron_settings__WEBPACK_IMPORTED_MODULE_0__);\n\nvar getSavedConnections = function getSavedConnections() {\n  return electron_settings__WEBPACK_IMPORTED_MODULE_0___default.a.has('saved_connections') ? electron_settings__WEBPACK_IMPORTED_MODULE_0___default.a.get('saved_connections') : [];\n};\nvar saveConnectionIfNotExists = function saveConnectionIfNotExists(credentials) {\n  // We don't store the password in the settings file.\n  delete credentials.password; // Stringify credentials for later use in comparison\n\n  var json_credentials = JSON.stringify(credentials); // Grab the saved connections or initialize to an empty array\n\n  var saved_connections = electron_settings__WEBPACK_IMPORTED_MODULE_0___default.a.get('saved_connections') || []; // Check if a connection exists with the same credentials\n\n  var conn_exists = saved_connections.findIndex(function (con) {\n    return JSON.stringify(con) === json_credentials;\n  }) > -1;\n\n  if (!conn_exists) {\n    saved_connections.push(credentials);\n    electron_settings__WEBPACK_IMPORTED_MODULE_0___default.a.set('saved_connections', saved_connections);\n  }\n\n  return saved_connections;\n};\nvar deleteConnection = function deleteConnection(connection_index) {\n  var saved_connections = electron_settings__WEBPACK_IMPORTED_MODULE_0___default.a.get('saved_connections');\n  saved_connections.splice(connection_index, 1);\n  electron_settings__WEBPACK_IMPORTED_MODULE_0___default.a.set('saved_connections', saved_connections);\n  return saved_connections;\n};//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9zZXR0aW5ncy9zZXR0aW5ncy1tYW5hZ2VyLmpzPzIzYmIiXSwibmFtZXMiOlsiZ2V0U2F2ZWRDb25uZWN0aW9ucyIsInNldHRpbmdzIiwiaGFzIiwiZ2V0Iiwic2F2ZUNvbm5lY3Rpb25JZk5vdEV4aXN0cyIsImNyZWRlbnRpYWxzIiwicGFzc3dvcmQiLCJqc29uX2NyZWRlbnRpYWxzIiwiSlNPTiIsInN0cmluZ2lmeSIsInNhdmVkX2Nvbm5lY3Rpb25zIiwiY29ubl9leGlzdHMiLCJmaW5kSW5kZXgiLCJjb24iLCJwdXNoIiwic2V0IiwiZGVsZXRlQ29ubmVjdGlvbiIsImNvbm5lY3Rpb25faW5kZXgiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBRU8sSUFBTUEsc0JBQXNCLFNBQXRCQSxtQkFBc0IsR0FBWTtBQUM3QyxTQUFPLHdEQUFBQyxDQUFTQyxHQUFULENBQWEsbUJBQWIsSUFBb0Msd0RBQUFELENBQVNFLEdBQVQsQ0FBYSxtQkFBYixDQUFwQyxHQUF3RSxFQUEvRTtBQUNELENBRk07QUFJQSxJQUFNQyw0QkFBNEIsU0FBNUJBLHlCQUE0QixDQUFVQyxXQUFWLEVBQXVCO0FBQzlEO0FBQ0EsU0FBT0EsWUFBWUMsUUFBbkIsQ0FGOEQsQ0FJOUQ7O0FBQ0EsTUFBTUMsbUJBQW1CQyxLQUFLQyxTQUFMLENBQWVKLFdBQWYsQ0FBekIsQ0FMOEQsQ0FPOUQ7O0FBQ0EsTUFBTUssb0JBQW9CLHdEQUFBVCxDQUFTRSxHQUFULENBQWEsbUJBQWIsS0FBcUMsRUFBL0QsQ0FSOEQsQ0FVOUQ7O0FBQ0EsTUFBTVEsY0FBY0Qsa0JBQWtCRSxTQUFsQixDQUE0QjtBQUFBLFdBQzlDSixLQUFLQyxTQUFMLENBQWVJLEdBQWYsTUFBd0JOLGdCQURzQjtBQUFBLEdBQTVCLElBQzBCLENBQUMsQ0FEL0M7O0FBR0EsTUFBSSxDQUFDSSxXQUFMLEVBQWtCO0FBQ2hCRCxzQkFBa0JJLElBQWxCLENBQXVCVCxXQUF2QjtBQUNBSixJQUFBLHdEQUFBQSxDQUFTYyxHQUFULENBQWEsbUJBQWIsRUFBa0NMLGlCQUFsQztBQUNEOztBQUVELFNBQU9BLGlCQUFQO0FBQ0QsQ0FwQk07QUFzQkEsSUFBTU0sbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBVUMsZ0JBQVYsRUFBNEI7QUFDMUQsTUFBSVAsb0JBQW9CLHdEQUFBVCxDQUFTRSxHQUFULENBQWEsbUJBQWIsQ0FBeEI7QUFDQU8sb0JBQWtCUSxNQUFsQixDQUF5QkQsZ0JBQXpCLEVBQTJDLENBQTNDO0FBQ0FoQixFQUFBLHdEQUFBQSxDQUFTYyxHQUFULENBQWEsbUJBQWIsRUFBa0NMLGlCQUFsQztBQUVBLFNBQU9BLGlCQUFQO0FBQ0QsQ0FOTSIsImZpbGUiOiIuL3NyYy9tYWluL3NldHRpbmdzL3NldHRpbmdzLW1hbmFnZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2V0dGluZ3MgZnJvbSAnZWxlY3Ryb24tc2V0dGluZ3MnXG5cbmV4cG9ydCBjb25zdCBnZXRTYXZlZENvbm5lY3Rpb25zID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gc2V0dGluZ3MuaGFzKCdzYXZlZF9jb25uZWN0aW9ucycpID8gc2V0dGluZ3MuZ2V0KCdzYXZlZF9jb25uZWN0aW9ucycpIDogW11cbn1cblxuZXhwb3J0IGNvbnN0IHNhdmVDb25uZWN0aW9uSWZOb3RFeGlzdHMgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgLy8gV2UgZG9uJ3Qgc3RvcmUgdGhlIHBhc3N3b3JkIGluIHRoZSBzZXR0aW5ncyBmaWxlLlxuICBkZWxldGUgY3JlZGVudGlhbHMucGFzc3dvcmRcblxuICAvLyBTdHJpbmdpZnkgY3JlZGVudGlhbHMgZm9yIGxhdGVyIHVzZSBpbiBjb21wYXJpc29uXG4gIGNvbnN0IGpzb25fY3JlZGVudGlhbHMgPSBKU09OLnN0cmluZ2lmeShjcmVkZW50aWFscylcblxuICAvLyBHcmFiIHRoZSBzYXZlZCBjb25uZWN0aW9ucyBvciBpbml0aWFsaXplIHRvIGFuIGVtcHR5IGFycmF5XG4gIGNvbnN0IHNhdmVkX2Nvbm5lY3Rpb25zID0gc2V0dGluZ3MuZ2V0KCdzYXZlZF9jb25uZWN0aW9ucycpIHx8IFtdXG5cbiAgLy8gQ2hlY2sgaWYgYSBjb25uZWN0aW9uIGV4aXN0cyB3aXRoIHRoZSBzYW1lIGNyZWRlbnRpYWxzXG4gIGNvbnN0IGNvbm5fZXhpc3RzID0gc2F2ZWRfY29ubmVjdGlvbnMuZmluZEluZGV4KGNvbiA9PlxuICAgIEpTT04uc3RyaW5naWZ5KGNvbikgPT09IGpzb25fY3JlZGVudGlhbHMpID4gLTFcblxuICBpZiAoIWNvbm5fZXhpc3RzKSB7XG4gICAgc2F2ZWRfY29ubmVjdGlvbnMucHVzaChjcmVkZW50aWFscylcbiAgICBzZXR0aW5ncy5zZXQoJ3NhdmVkX2Nvbm5lY3Rpb25zJywgc2F2ZWRfY29ubmVjdGlvbnMpXG4gIH1cblxuICByZXR1cm4gc2F2ZWRfY29ubmVjdGlvbnNcbn1cblxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNvbm5lY3Rpb24gPSBmdW5jdGlvbiAoY29ubmVjdGlvbl9pbmRleCkge1xuICBsZXQgc2F2ZWRfY29ubmVjdGlvbnMgPSBzZXR0aW5ncy5nZXQoJ3NhdmVkX2Nvbm5lY3Rpb25zJylcbiAgc2F2ZWRfY29ubmVjdGlvbnMuc3BsaWNlKGNvbm5lY3Rpb25faW5kZXgsIDEpXG4gIHNldHRpbmdzLnNldCgnc2F2ZWRfY29ubmVjdGlvbnMnLCBzYXZlZF9jb25uZWN0aW9ucylcblxuICByZXR1cm4gc2F2ZWRfY29ubmVjdGlvbnNcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/main/settings/settings-manager.js\n");

/***/ }),

/***/ 0:
/*!****************************************************************************************************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js ./src/main/index.js ***!
  \****************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\27700\Desktop\platform-electron\node_modules\electron-webpack\out\electron-main-hmr\main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
__webpack_require__(/*! C:\Users\27700\Desktop\platform-electron\node_modules\electron-webpack\out\configurators\vue\vue-main-dev-entry.js */"./node_modules/electron-webpack/out/configurators/vue/vue-main-dev-entry.js");
module.exports = __webpack_require__(/*! C:\Users\27700\Desktop\platform-electron\src\main\index.js */"./src/main/index.js");


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"assert\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhc3NlcnRcIj84MTcyIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImFzc2VydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///assert\n");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"constants\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb25zdGFudHNcIj83MzU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImNvbnN0YW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvbnN0YW50c1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///constants\n");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiPzA0ZjMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZWxlY3Ryb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron\n");

/***/ }),

/***/ "electron-devtools-installer":
/*!**********************************************!*\
  !*** external "electron-devtools-installer" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-devtools-installer\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIj9jZThjIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-devtools-installer\n");

/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"events\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudHNcIj83YTdlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImV2ZW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///events\n");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiP2E0MGQiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///fs\n");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mysql\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJteXNxbFwiP2MyNGEiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoibXlzcWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJteXNxbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///mysql\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"stream\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzdHJlYW1cIj83NTdmIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InN0cmVhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInN0cmVhbVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///stream\n");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"url\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIj82MWU4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///url\n");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dGlsXCI/YmUwYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///util\n");

/***/ })

/******/ });