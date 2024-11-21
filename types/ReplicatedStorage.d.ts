interface ReplicatedStorage extends Instance {
	TS: Folder & {
		module: ModuleScript;
		utils: Folder & {
			log: ModuleScript;
			["object-utils"]: ModuleScript;
			functions: Folder & {
				randomNumbers: ModuleScript;
				getColor3FromLevel: ModuleScript;
				objectKeys: ModuleScript;
				getPlayerByName: ModuleScript;
				spawnSound: ModuleScript;
				tweenUtil: ModuleScript;
				toTitleCase: ModuleScript;
				calculateReward: ModuleScript;
				getPlayerMultiplier: ModuleScript;
				createForcefield: ModuleScript;
				isCharacterPart: ModuleScript;
				getCharacter: ModuleScript;
				randomColor: ModuleScript;
				forEveryPlayer: ModuleScript;
				getLevel: ModuleScript;
			};
		};
		network: ModuleScript;
		configs: Folder & {
			items: ModuleScript & {
				hats: ModuleScript;
				cases: ModuleScript;
				emotes: ModuleScript;
			};
			currency: ModuleScript;
			action: ModuleScript;
			announcer: ModuleScript;
			queue: ModuleScript;
			places: ModuleScript;
			gui: ModuleScript;
		};
		store: ModuleScript & {
			slices: Folder & {
				players: ModuleScript & {
					utils: ModuleScript;
					wins: ModuleScript;
					actionTickets: ModuleScript;
					items: ModuleScript;
					balance: ModuleScript;
					playTime: ModuleScript;
					xp: ModuleScript;
					types: ModuleScript;
					equipped: ModuleScript;
					loggedIn: ModuleScript;
				};
				client: ModuleScript & {
					gui: ModuleScript;
				};
			};
			selectors: Folder & {
				players: ModuleScript;
				client: ModuleScript;
			};
		};
		components: Folder;
	};
	Assets: Folder & {
		Sounds: Folder & {
			UnboxCommon: Sound;
			Countdown2: Sound;
			Buzz: Sound & {
				PitchShiftSoundEffect: PitchShiftSoundEffect;
			};
			["GO!!!"]: Sound;
			PugilHit: Sound;
			Character: Sound;
			Countdown1: Sound;
			BabyBoy: Sound;
			UnboxRare: Sound;
			PugilSwing: Sound;
			UnboxLegendary: Sound;
			Boom: Sound;
		};
		Accessory: Accessory & {
			Handle: Part & {
				HatAttachment: Attachment;
				Mesh: SpecialMesh;
				TouchInterest: TouchTransmitter;
			};
		};
		Animations: Folder & {
			PugilActivated: Animation;
			PugilIdle: Animation;
		};
		Objects: Folder & {
			MediumMoney: Model & {
				Part: Part & {
					Dollars: NumberValue;
				};
			};
			Kanye: Model & {
				Handle: Part & {
					OriginalSize: Vector3Value;
					HatAttachment: Attachment;
					SpecialMesh: SpecialMesh;
					AvatarPartScaleType: StringValue;
				};
			};
			SmallMoney: Model & {
				Part: Part & {
					Dollars: NumberValue;
				};
			};
			LargeMoney: Model & {
				Part: Part & {
					Dollars: NumberValue;
				};
			};
			Box: Model & {
				Cardboard: MeshPart;
			};
			Briefcase: Model & {
				Part: Part & {
					Mesh: SpecialMesh;
					BillboardGui: BillboardGui & {
						TextLabel: TextLabel;
					};
				};
			};
			Forcefield: Part & {
				Mesh: SpecialMesh;
			};
			BriefcaseStand: Model & {
				Part: Part;
				Primary: Part;
			};
			FlagPole: Model & {
				Flag: Part;
				WeldConstraint: WeldConstraint;
				Pole: Part;
			};
		};
		Gui: Folder & {
			DollarBGUI: BillboardGui & {
				TextLabel: TextLabel;
			};
			ClaimBGUI: BillboardGui & {
				TextLabel: TextLabel;
			};
			UnboxBGUI: BillboardGui & {
				UIListLayout: UIListLayout;
				ItemName: TextLabel;
				Rarity: TextLabel;
			};
		};
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			["@flamework"]: Folder & {
				core: Folder & {
					node_modules: Folder & {
						["@rbxts"]: Folder & {
							t: Folder & {
								lib: Folder & {
									ts: ModuleScript;
								};
							};
						};
					};
					out: ModuleScript & {
						flamework: ModuleScript;
						utility: ModuleScript;
						reflect: ModuleScript;
						modding: ModuleScript;
						metadata: ModuleScript;
					};
				};
				components: Folder & {
					out: ModuleScript & {
						components: ModuleScript;
						baseComponent: ModuleScript;
						componentTracker: ModuleScript;
						utility: ModuleScript;
					};
				};
				networking: Folder & {
					node_modules: Folder & {
						["@rbxts"]: Folder & {
							t: Folder & {
								lib: Folder & {
									ts: ModuleScript;
								};
							};
						};
					};
					out: ModuleScript & {
						["function"]: Folder & {
							createFunctionSender: ModuleScript;
							createFunctionReceiver: ModuleScript;
							errors: ModuleScript;
						};
						events: Folder & {
							createServerMethod: ModuleScript;
							createNetworkingEvent: ModuleScript;
							createGenericHandler: ModuleScript;
							createClientMethod: ModuleScript;
						};
						functions: Folder & {
							createServerMethod: ModuleScript;
							createNetworkingFunction: ModuleScript;
							createGenericHandler: ModuleScript;
							createClientMethod: ModuleScript;
						};
						util: Folder & {
							createSignalContainer: ModuleScript;
							getNamespaceConfig: ModuleScript;
							timeoutPromise: ModuleScript;
						};
						event: Folder & {
							createEvent: ModuleScript;
							createRemoteInstance: ModuleScript;
						};
						middleware: Folder & {
							createMiddlewareProcessor: ModuleScript;
							createGuardMiddleware: ModuleScript;
							skip: ModuleScript;
						};
					};
				};
			};
			["@rbxts"]: Folder & {
				["ui-labs"]: Folder & {
					src: ModuleScript & {
						Controls: Folder & {
							Utils: ModuleScript;
							PrimitiveControls: ModuleScript;
							ControlUtils: ModuleScript;
							DatatypeControls: ModuleScript;
							AdvancedControls: ModuleScript;
						};
						Libraries: Folder;
						StoryCreators: ModuleScript;
						Environment: ModuleScript;
						Utils: ModuleScript;
						ControlTypings: Folder;
						Typing: Folder;
					};
				};
				RegExp: ModuleScript & {
					RegEx: ModuleScript;
					["Regexp.global"]: ModuleScript;
				};
				["react-roblox"]: ModuleScript;
				roact: Folder & {
					src: ModuleScript & {
						createSpy: ModuleScript;
						createSignal: ModuleScript;
						oneChild: ModuleScript;
						Component: ModuleScript;
						createElement: ModuleScript;
						createReconciler: ModuleScript;
						GlobalConfig: ModuleScript;
						strict: ModuleScript;
						createRef: ModuleScript;
						Type: ModuleScript;
						Portal: ModuleScript;
						Symbol: ModuleScript;
						PropMarkers: Folder & {
							Ref: ModuleScript;
							Change: ModuleScript;
							Children: ModuleScript;
							Event: ModuleScript;
						};
						ComponentLifecyclePhase: ModuleScript;
						Config: ModuleScript;
						assign: ModuleScript;
						assertDeepEqual: ModuleScript;
						getDefaultInstanceProperty: ModuleScript;
						Binding: ModuleScript;
						NoopRenderer: ModuleScript;
						forwardRef: ModuleScript;
						ts: ModuleScript;
						internalAssert: ModuleScript;
						createReconcilerCompat: ModuleScript;
						createFragment: ModuleScript;
						RobloxRenderer: ModuleScript;
						PureComponent: ModuleScript;
						invalidSetStateMessages: ModuleScript;
						ElementKind: ModuleScript;
						createContext: ModuleScript;
						Logging: ModuleScript;
						ElementUtils: ModuleScript;
						SingleEventManager: ModuleScript;
						None: ModuleScript;
					};
				};
				["message-templates"]: Folder & {
					out: ModuleScript & {
						MessageTemplateRenderer: ModuleScript;
						PlainTextMessageTemplateRenderer: ModuleScript;
						RbxSerializer: ModuleScript;
						MessageTemplate: ModuleScript;
						MessageTemplateToken: ModuleScript;
						MessageTemplateParser: ModuleScript;
					};
				};
				log: Folder & {
					out: ModuleScript & {
						Core: ModuleScript & {
							LogEventCallbackSink: ModuleScript;
							LogEventPropertyEnricher: ModuleScript;
							LogEventRobloxOutputSink: ModuleScript;
						};
						Configuration: ModuleScript;
						Logger: ModuleScript;
					};
				};
				["object-utils"]: ModuleScript;
				["reverse-array"]: Folder & {
					out: ModuleScript & {
						functions: Folder & {
							ReverseArray: ModuleScript;
						};
					};
				};
				["react-motion"]: Folder & {
					node_modules: Folder & {
						["@rbxts"]: Folder & {
							t: Folder & {
								lib: Folder & {
									ts: ModuleScript;
								};
							};
						};
					};
					out: ModuleScript & {
						["bezier-tween"]: Folder & {
							src: ModuleScript;
						};
						useAnimation: ModuleScript;
						motion: ModuleScript;
					};
				};
				testez: Folder & {
					src: ModuleScript & {
						TestPlanner: ModuleScript;
						TestRunner: ModuleScript;
						TestBootstrap: ModuleScript;
						TestSession: ModuleScript;
						LifecycleHooks: ModuleScript;
						Reporters: Folder & {
							TextReporter: ModuleScript;
							TextReporterQuiet: ModuleScript;
							TeamCityReporter: ModuleScript;
						};
						TestPlan: ModuleScript;
						TestResults: ModuleScript;
						TestEnum: ModuleScript;
						Context: ModuleScript;
						Expectation: ModuleScript;
					};
				};
				["format-number"]: Folder & {
					src: ModuleScript & {
						DoubleConversion: Folder & {
							proxy: ModuleScript;
							diy_fp: ModuleScript;
							LICENSE: ModuleScript;
							uint64_t: ModuleScript;
							DoubleToStringConverter: ModuleScript;
							ieee: ModuleScript;
							strtod: ModuleScript;
							cached_power: ModuleScript;
							grisu3: ModuleScript;
							DoubleToDecimalConverter: ModuleScript;
							bignum_dtoa: ModuleScript;
							bignum: ModuleScript;
							DecimalToDoubleConverter: ModuleScript;
						};
						_aux: ModuleScript;
						config: ModuleScript;
					};
				};
				react: ModuleScript & {
					tags: ModuleScript;
				};
				["react-reflex"]: ModuleScript & {
					React: ModuleScript;
					hooks: Folder & {
						useSelector: ModuleScript;
						useSelectorCreator: ModuleScript;
						useProducer: ModuleScript;
					};
					components: Folder & {
						ReflexContext: ModuleScript;
						ReflexProvider: ModuleScript;
					};
					Reflex: ModuleScript;
				};
				signal: ModuleScript;
				types: Folder & {
					include: Folder & {
						generated: Folder;
					};
				};
				["set-timeout"]: Folder & {
					out: ModuleScript & {
						["set-countdown"]: ModuleScript;
						["set-interval"]: ModuleScript;
						["debounce.spec"]: ModuleScript;
						["set-timeout"]: ModuleScript;
						throttle: ModuleScript;
						["set-timeout.spec"]: ModuleScript;
						["throttle.spec"]: ModuleScript;
						["set-interval.spec"]: ModuleScript;
						["set-countdown.spec"]: ModuleScript;
						debounce: ModuleScript;
					};
				};
				["cubic-bezier"]: ModuleScript;
				make: ModuleScript & {
					node_modules: Folder & {
						["@rbxts"]: Folder & {
							["compiler-types"]: Folder & {
								types: Folder;
							};
						};
					};
				};
				vide: Folder & {
					src: ModuleScript & {
						defaults: ModuleScript;
						action: ModuleScript;
						mount: ModuleScript;
						changed: ModuleScript;
						bind: ModuleScript;
						jsx: ModuleScript;
						tags: ModuleScript;
						show: ModuleScript;
						apply: ModuleScript;
						untrack: ModuleScript;
						graph: ModuleScript;
						maps: ModuleScript;
						effect: ModuleScript;
						root: ModuleScript;
						["switch"]: ModuleScript;
						derive: ModuleScript;
						spring: ModuleScript;
						flags: ModuleScript;
						read: ModuleScript;
						source: ModuleScript;
						["throw"]: ModuleScript;
						cleanup: ModuleScript;
						create: ModuleScript;
						components: ModuleScript;
						batch: ModuleScript;
					};
				};
				["validate-tree"]: ModuleScript;
				t: Folder & {
					lib: Folder & {
						ts: ModuleScript;
					};
				};
				["compiler-types"]: Folder & {
					types: Folder;
				};
				["promise-character"]: ModuleScript & {
					node_modules: Folder & {
						["@rbxts"]: Folder & {
							["compiler-types"]: Folder & {
								types: Folder;
							};
						};
					};
				};
				reflex: Folder & {
					src: ModuleScript & {
						createProducer: ModuleScript;
						broadcast: ModuleScript & {
							createBroadcastReceiver: ModuleScript;
							createBroadcaster: ModuleScript;
							hydrate: ModuleScript;
						};
						Promise: ModuleScript;
						createSelector: ModuleScript;
						utils: Folder & {
							shallowEqual: ModuleScript;
							testSelector: ModuleScript;
							createSelectArrayDiffs: ModuleScript;
							setInterval: ModuleScript;
						};
						combineProducers: ModuleScript;
						middleware: Folder & {
							loggerMiddleware: ModuleScript;
						};
						applyMiddleware: ModuleScript;
						types: ModuleScript;
					};
				};
				remap: Folder & {
					src: ModuleScript;
				};
				profileservice: Folder & {
					src: ModuleScript;
				};
				services: ModuleScript;
				janitor: Folder & {
					src: ModuleScript & {
						Promise: ModuleScript;
					};
				};
				maid: Folder & {
					Maid: ModuleScript;
				};
				cmdr: Folder & {
					Cmdr: ModuleScript & {
						CreateGui: ModuleScript;
						Shared: Folder & {
							Registry: ModuleScript;
							Dispatcher: ModuleScript;
							Command: ModuleScript;
							Argument: ModuleScript;
							Util: ModuleScript;
						};
						BuiltInTypes: Folder & {
							PlayerId: ModuleScript;
							URL: ModuleScript;
							Duration: ModuleScript;
							StoredKey: ModuleScript;
							Primitives: ModuleScript;
							Vector: ModuleScript;
							Command: ModuleScript;
							ConditionFunction: ModuleScript;
							JSON: ModuleScript;
							Type: ModuleScript;
							UserInput: ModuleScript;
							Player: ModuleScript;
							Color3: ModuleScript;
							Team: ModuleScript;
							BindableResource: ModuleScript;
							MathOperator: ModuleScript;
							BrickColor: ModuleScript;
						};
						BuiltInCommands: Folder & {
							help: ModuleScript;
							Admin: Folder & {
								gotoPlaceServer: ModuleScript;
								kill: ModuleScript;
								teleport: ModuleScript;
								kickServer: ModuleScript;
								killServer: ModuleScript;
								respawn: ModuleScript;
								respawnServer: ModuleScript;
								gotoPlace: ModuleScript;
								kick: ModuleScript;
								teleportServer: ModuleScript;
								announce: ModuleScript;
								announceServer: ModuleScript;
							};
							Debug: Folder & {
								getPlayerPlaceInstance: ModuleScript;
								version: ModuleScript;
								thru: ModuleScript;
								blink: ModuleScript;
								uptime: ModuleScript;
								position: ModuleScript;
								fetchServer: ModuleScript;
								uptimeServer: ModuleScript;
								getPlayerPlaceInstanceServer: ModuleScript;
								fetch: ModuleScript;
							};
							Utility: Folder & {
								rand: ModuleScript;
								jsonArrayEncode: ModuleScript;
								pick: ModuleScript;
								echo: ModuleScript;
								bind: ModuleScript;
								["var"]: ModuleScript;
								math: ModuleScript;
								alias: ModuleScript;
								clear: ModuleScript;
								varSetServer: ModuleScript;
								varServer: ModuleScript;
								jsonArrayDecode: ModuleScript;
								varSet: ModuleScript;
								unbind: ModuleScript;
								run: ModuleScript;
								runLines: ModuleScript;
								runif: ModuleScript;
								history: ModuleScript;
								hover: ModuleScript;
								replace: ModuleScript;
								len: ModuleScript;
								resolve: ModuleScript;
								convertTimestamp: ModuleScript;
								edit: ModuleScript;
							};
						};
						CmdrClient: ModuleScript & {
							CmdrInterface: ModuleScript & {
								AutoComplete: ModuleScript;
								Window: ModuleScript;
							};
							DefaultEventHandlers: ModuleScript;
						};
						Initialize: ModuleScript;
					};
					TS: ModuleScript;
				};
				ReactLua: Folder & {
					node_modules: Folder & {
						["@jsdotlua"]: Folder & {
							number: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									MAX_SAFE_INTEGER: ModuleScript;
									isSafeInteger: ModuleScript;
									toExponential: ModuleScript;
									isNaN: ModuleScript;
									isInteger: ModuleScript;
									isFinite: ModuleScript;
									MIN_SAFE_INTEGER: ModuleScript;
								};
							};
							console: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									makeConsoleImpl: ModuleScript;
								};
							};
							["react-roblox"]: ModuleScript & {
								client: Folder & {
									roblox: Folder & {
										RobloxComponentProps: ModuleScript;
										SingleEventManager: ModuleScript;
										getDefaultInstanceProperty: ModuleScript;
									};
									ReactRobloxHostConfig: ModuleScript;
									ReactRobloxRoot: ModuleScript;
									ReactRoblox: ModuleScript;
									ReactRobloxComponentTree: ModuleScript;
									["ReactRobloxHostTypes.roblox"]: ModuleScript;
									ReactRobloxComponent: ModuleScript;
								};
								["ReactReconciler.roblox"]: ModuleScript;
							};
							["react-devtools-shared"]: ModuleScript & {
								hook: ModuleScript;
								bridge: ModuleScript;
								constants: ModuleScript;
								utils: ModuleScript;
								devtools: ModuleScript & {
									views: Folder & {
										Components: Folder & {
											types: ModuleScript;
										};
										Profiler: Folder & {
											InteractionsChartBuilder: ModuleScript;
											utils: ModuleScript;
											CommitTreeBuilder: ModuleScript;
											RankedChartBuilder: ModuleScript;
											FlamegraphChartBuilder: ModuleScript;
											types: ModuleScript;
										};
									};
									utils: ModuleScript;
									cache: ModuleScript;
									types: ModuleScript;
									ProfilingCache: ModuleScript;
									store: ModuleScript;
									ProfilerStore: ModuleScript;
								};
								events: ModuleScript;
								hydration: ModuleScript;
								["clipboardjs.mock"]: ModuleScript;
								storage: ModuleScript;
								backend: ModuleScript & {
									console: ModuleScript;
									utils: ModuleScript;
									ReactSymbols: ModuleScript;
									renderer: ModuleScript;
									agent: ModuleScript;
									NativeStyleEditor: Folder & {
										types: ModuleScript;
									};
									types: ModuleScript;
								};
								types: ModuleScript;
							};
							["instance-of"]: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									["instanceof"]: ModuleScript;
								};
							};
							["react-cache"]: ModuleScript & {
								ReactCacheOld: ModuleScript;
								LRU: ModuleScript;
							};
							["luau-polyfill"]: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									Promise: ModuleScript;
									["extends"]: ModuleScript;
									AssertionError: ModuleScript & {
										["AssertionError.global"]: ModuleScript;
									};
									Error: ModuleScript & {
										["Error.global"]: ModuleScript;
									};
									encodeURIComponent: ModuleScript;
								};
							};
							math: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									clz32: ModuleScript;
								};
							};
							timers: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									makeIntervalImpl: ModuleScript;
									makeTimerImpl: ModuleScript;
								};
							};
							["react-test-renderer"]: ModuleScript & {
								ReactTestRenderer: ModuleScript;
								roblox: Folder & {
									RobloxComponentProps: ModuleScript;
								};
								ReactTestHostConfig: ModuleScript;
							};
							promise: Folder & {
								lib: ModuleScript;
								["package"]: ModuleScript;
							};
							string: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									endsWith: ModuleScript;
									indexOf: ModuleScript;
									lastIndexOf: ModuleScript;
									trimStart: ModuleScript;
									trim: ModuleScript;
									findOr: ModuleScript;
									substr: ModuleScript;
									slice: ModuleScript;
									startsWith: ModuleScript;
									charCodeAt: ModuleScript;
									trimEnd: ModuleScript;
									includes: ModuleScript;
									split: ModuleScript;
								};
							};
							shared: ModuleScript & {
								["UninitializedState.roblox"]: ModuleScript;
								console: ModuleScript;
								ReactComponentStackFrame: ModuleScript;
								invariant: ModuleScript;
								ReactTypes: ModuleScript;
								objectIs: ModuleScript;
								ReactInstanceMap: ModuleScript;
								["Type.roblox"]: ModuleScript;
								["ConsolePatchingDev.roblox"]: ModuleScript;
								["ErrorHandling.roblox"]: ModuleScript;
								shallowEqual: ModuleScript;
								ReactElementType: ModuleScript;
								isValidElementType: ModuleScript;
								invokeGuardedCallbackImpl: ModuleScript;
								getComponentName: ModuleScript;
								formatProdErrorMessage: ModuleScript;
								ReactFeatureFlags: ModuleScript;
								PropMarkers: Folder & {
									Change: ModuleScript;
									Event: ModuleScript;
									Tag: ModuleScript;
								};
								consoleWithStackDev: ModuleScript;
								ReactErrorUtils: ModuleScript;
								["enqueueTask.roblox"]: ModuleScript;
								checkPropTypes: ModuleScript;
								ReactSharedInternals: ModuleScript & {
									ReactDebugCurrentFrame: ModuleScript;
									ReactCurrentOwner: ModuleScript;
									ReactCurrentDispatcher: ModuleScript;
									IsSomeRendererActing: ModuleScript;
									ReactCurrentBatchConfig: ModuleScript;
								};
								ReactVersion: ModuleScript;
								ReactSymbols: ModuleScript;
								["flowtypes.roblox"]: ModuleScript;
								["Symbol.roblox"]: ModuleScript;
								ExecutionEnvironment: ModuleScript;
								ReactFiberHostConfig: ModuleScript & {
									WithNoTestSelectors: ModuleScript;
									WithNoHydration: ModuleScript;
									WithNoPersistence: ModuleScript;
								};
							};
							scheduler: ModuleScript & {
								SchedulerPriorities: ModuleScript;
								TracingSubscriptions: ModuleScript;
								SchedulerMinHeap: ModuleScript;
								Scheduler: ModuleScript;
								Tracing: ModuleScript;
								forks: Folder & {
									["SchedulerHostConfig.mock"]: ModuleScript;
									["SchedulerHostConfig.default"]: ModuleScript;
								};
								unstable_mock: ModuleScript;
								SchedulerProfiling: ModuleScript;
								SchedulerHostConfig: ModuleScript;
								SchedulerFeatureFlags: ModuleScript;
							};
							["roact-compat"]: ModuleScript & {
								warnOnce: ModuleScript;
								Portal: ModuleScript;
								setGlobalConfig: ModuleScript;
								oneChild: ModuleScript;
								createFragment: ModuleScript;
								RoactTree: ModuleScript;
							};
							["react-shallow-renderer"]: ModuleScript;
							collections: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									Map: ModuleScript & {
										Map: ModuleScript;
										coerceToTable: ModuleScript;
										coerceToMap: ModuleScript;
									};
									Object: ModuleScript & {
										values: ModuleScript;
										assign: ModuleScript;
										is: ModuleScript;
										seal: ModuleScript;
										entries: ModuleScript;
										preventExtensions: ModuleScript;
										isFrozen: ModuleScript;
										keys: ModuleScript;
										freeze: ModuleScript;
										None: ModuleScript;
									};
									Set: ModuleScript;
									Array: ModuleScript & {
										flat: ModuleScript;
										indexOf: ModuleScript;
										every: ModuleScript;
										slice: ModuleScript;
										sort: ModuleScript;
										shift: ModuleScript;
										map: ModuleScript;
										isArray: ModuleScript;
										findIndex: ModuleScript;
										unshift: ModuleScript;
										splice: ModuleScript;
										filter: ModuleScript;
										find: ModuleScript;
										forEach: ModuleScript;
										reverse: ModuleScript;
										includes: ModuleScript;
										concat: ModuleScript;
										from: ModuleScript & {
											fromString: ModuleScript;
											fromArray: ModuleScript;
											fromSet: ModuleScript;
											fromMap: ModuleScript;
										};
										join: ModuleScript;
										flatMap: ModuleScript;
										reduce: ModuleScript;
										some: ModuleScript;
									};
									inspect: ModuleScript;
									WeakMap: ModuleScript;
								};
							};
							["react-devtools-extensions"]: ModuleScript & {
								backend: ModuleScript;
							};
							["react-reconciler"]: ModuleScript & {
								ReactRootTags: ModuleScript;
								["ReactFiberDevToolsHook.new"]: ModuleScript;
								["ReactFiberWorkLoop.new"]: ModuleScript;
								ReactTestSelectors: ModuleScript;
								["ReactFiberHotReloading.new"]: ModuleScript;
								ReactCapturedValue: ModuleScript;
								["ReactFiberUnwindWork.new"]: ModuleScript;
								["ReactFiberNewContext.new"]: ModuleScript;
								["ReactProfilerTimer.new"]: ModuleScript;
								ReactInternalTypes: ModuleScript;
								["ReactFiber.new"]: ModuleScript;
								["ReactFiberCommitWork.new"]: ModuleScript;
								ReactFiberTransition: ModuleScript;
								forks: Folder & {
									["ReactFiberHostConfig.test"]: ModuleScript;
								};
								["ReactStrictModeWarnings.new"]: ModuleScript;
								ReactPortal: ModuleScript;
								SchedulingProfiler: ModuleScript;
								["SchedulerWithReactIntegration.new"]: ModuleScript;
								ReactWorkTags: ModuleScript;
								ReactFiberHostConfig: ModuleScript;
								ReactTypeOfMode: ModuleScript;
								ReactFiberOffscreenComponent: ModuleScript;
								["ReactUpdateQueue.new"]: ModuleScript;
								ReactFiberLane: ModuleScript;
								["ReactFiberClassComponent.new"]: ModuleScript;
								ReactHookEffectTags: ModuleScript;
								ReactFiberWorkInProgress: ModuleScript;
								ReactFiberTreeReflection: ModuleScript;
								["ReactChildFiber.new"]: ModuleScript;
								MaxInts: ModuleScript;
								["ReactFiberLazyComponent.new"]: ModuleScript;
								ReactFiberErrorDialog: ModuleScript;
								["ReactFiberBeginWork.new"]: ModuleScript;
								ReactFiberFlags: ModuleScript;
								DebugTracing: ModuleScript;
								ReactFiberErrorLogger: ModuleScript;
								["ReactFiberHooks.new"]: ModuleScript;
								["ReactFiberSchedulerPriorities.roblox"]: ModuleScript;
								["ReactFiberHydrationContext.new"]: ModuleScript;
								ReactFiberReconciler: ModuleScript;
								["ReactFiberContext.new"]: ModuleScript;
								["ReactFiberSuspenseContext.new"]: ModuleScript;
								["ReactFiberStack.new"]: ModuleScript;
								["ReactFiberHostContext.new"]: ModuleScript;
								["ReactMutableSource.new"]: ModuleScript;
								ReactCurrentFiber: ModuleScript;
								ReactFiberComponentStack: ModuleScript;
								["ReactFiberSuspenseComponent.new"]: ModuleScript;
								["ReactFiberCompleteWork.new"]: ModuleScript;
								["ReactFiberReconciler.new"]: ModuleScript;
								["ReactFiberRoot.new"]: ModuleScript;
								["ReactFiberThrow.new"]: ModuleScript;
							};
							["react-is"]: ModuleScript;
							react: ModuleScript & {
								["None.roblox"]: ModuleScript;
								ReactLazy: ModuleScript;
								ReactElementValidator: ModuleScript;
								["createSignal.roblox"]: ModuleScript;
								ReactElement: ModuleScript;
								ReactMutableSource: ModuleScript;
								ReactContext: ModuleScript;
								ReactBaseClasses: ModuleScript;
								ReactNoopUpdateQueue: ModuleScript;
								ReactMemo: ModuleScript;
								ReactCreateRef: ModuleScript;
								ReactForwardRef: ModuleScript;
								React: ModuleScript;
								["ReactBinding.roblox"]: ModuleScript;
								ReactHooks: ModuleScript;
								ReactChildren: ModuleScript;
							};
							["es7-types"]: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript;
							};
							boolean: Folder & {
								["package"]: ModuleScript;
								src: ModuleScript & {
									toJSBoolean: ModuleScript;
								};
							};
							ReactDebugTools: ModuleScript & {
								ReactDebugTools: ModuleScript;
								ReactDebugHooks: ModuleScript;
							};
						};
						commander: Folder & {
							["package-support"]: ModuleScript;
							["package"]: ModuleScript;
							lib: Folder;
							typings: Folder;
						};
						[".luau-aliases"]: Folder & {
							["@jsdotlua"]: Folder & {
								number: ModuleScript;
								console: ModuleScript;
								["react-roblox"]: ModuleScript;
								["react-is"]: ModuleScript;
								["instance-of"]: ModuleScript;
								["react-cache"]: ModuleScript;
								["es7-types"]: ModuleScript;
								math: ModuleScript;
								["react-debug-tools"]: ModuleScript;
								["react-test-renderer"]: ModuleScript;
								promise: ModuleScript;
								timers: ModuleScript;
								string: ModuleScript;
								shared: ModuleScript;
								scheduler: ModuleScript;
								["roact-compat"]: ModuleScript;
								["react-reconciler"]: ModuleScript;
								["react-devtools-extensions"]: ModuleScript;
								["react-shallow-renderer"]: ModuleScript;
								collections: ModuleScript;
								react: ModuleScript;
								["react-devtools-shared"]: ModuleScript;
								boolean: ModuleScript;
								["luau-polyfill"]: ModuleScript;
							};
							["symbol-luau"]: ModuleScript;
						};
						["symbol-luau"]: Folder & {
							["package"]: ModuleScript;
							src: ModuleScript & {
								["Registry.global"]: ModuleScript;
								Symbol: ModuleScript;
							};
							LICENSE: StringValue;
						};
						npmluau: Folder & {
							["package"]: ModuleScript;
							src: Folder;
							["luau-types-re-export"]: Folder & {
								pkg: Folder & {
									["package"]: ModuleScript;
								};
							};
							LICENSE: StringValue;
						};
						walkdir: Folder & {
							["package"]: ModuleScript;
							test: Folder & {
								dir: Folder & {
									["nested-symlink"]: Folder;
									symlinks: Folder & {
										dir1: Folder;
										dir2: Folder;
									};
									foo: Folder & {
										a: Folder & {
											b: Folder & {
												c: Folder;
											};
										};
									};
								};
								comparison: Folder & {
									["package"]: ModuleScript;
								};
							};
						};
						[".bin"]: Folder;
					};
					ReactShallowRenderer: ModuleScript;
					ReactRoblox: ModuleScript;
					ReactDevtoolsShared: ModuleScript;
					ReactIs: ModuleScript;
					Shared: ModuleScript;
					ReactReconciler: ModuleScript;
					RoactCompat: ModuleScript;
					Scheduler: ModuleScript;
					ReactTestRenderer: ModuleScript;
					React: ModuleScript;
					ReactDevtoolsExtensions: ModuleScript;
					ReactDebugTools: ModuleScript;
					ReactCache: ModuleScript;
				};
			};
		};
	};
}
