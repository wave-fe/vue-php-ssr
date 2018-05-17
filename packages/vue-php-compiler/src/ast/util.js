import path from 'path';
import esquery from 'esquery';
import WeakMap from 'es6-weak-map';
import {analyze} from 'escope';
import {baseDir, defaultExportName} from '../config';
import parseOptions from './parseOptions';

let globalVar = [
    'Object', 'Function', 'Array', 'Number', 'Infinity',
    'NaN', 'Boolean', 'String', 'Symbol', 'Date',
    'Promise', 'RegExp', 'Error', 'EvalError', 'RangeError',
    'ReferenceError', 'SyntaxError', 'TypeError', 'URIError', 'JSON',
    'Math', 'Intl', 'ArrayBuffer', 'Uint8Array', 'Int8Array',
    'Uint16Array', 'Int16Array', 'Uint32Array', 'Int32Array', 'Float32Array',
    'Float64Array', 'Uint8ClampedArray', 'DataView', 'Map', 'Set',
    'WeakMap', 'WeakSet', 'Proxy', 'Reflect', 'ByteLengthQueuingStrategy',
    'CountQueuingStrategy', 'ReadableStream', 'WritableStream', 'WebSocket', 'WebGLVertexArrayObject',
    'WebGLUniformLocation', 'WebGLTransformFeedback', 'WebGLTexture', 'WebGLSync', 'WebGLShaderPrecisionFormat',
    'WebGLShader', 'WebGLSampler', 'WebGLRenderbuffer', 'WebGLQuery', 'WebGLProgram',
    'WebGLFramebuffer', 'WebGLContextEvent', 'WebGLBuffer', 'WebGLActiveInfo', 'WaveShaperNode',
    'TextEncoder', 'TextDecoder', 'SyncManager', 'SubtleCrypto', 'StorageEvent',
    'Storage', 'StereoPannerNode', 'SourceBufferList', 'SourceBuffer', 'ServiceWorkerRegistration',
    'ServiceWorkerContainer', 'ServiceWorker', 'ScriptProcessorNode', 'ScreenOrientation', 'RTCTrackEvent',
    'RTCStatsReport', 'RTCSessionDescription', 'RTCRtpSender', 'RTCRtpReceiver', 'RTCRtpContributingSource',
    'RTCPeerConnectionIceEvent', 'RTCPeerConnection', 'RTCIceCandidate', 'RTCDataChannelEvent', 'RTCDataChannel',
    'RTCDTMFToneChangeEvent', 'RTCDTMFSender', 'RTCCertificate', 'Plugin', 'PluginArray',
    'PhotoCapabilities', 'PeriodicWave', 'PannerNode', 'OverconstrainedError', 'OscillatorNode',
    'OfflineAudioContext', 'OfflineAudioCompletionEvent', 'NetworkInformation', 'MimeType', 'MimeTypeArray',
    'MediaStreamTrackEvent', 'MediaStreamTrack', 'MediaStreamEvent', 'MediaStream', 'MediaStreamAudioSourceNode',
    'MediaStreamAudioDestinationNode', 'MediaSource', 'MediaSettingsRange', 'MediaRecorder', 'MediaKeySystemAccess',
    'MediaKeyStatusMap', 'MediaKeySession', 'MediaKeyMessageEvent', 'MediaEncryptedEvent', 'MediaElementAudioSourceNode',
    'MediaDevices', 'MediaDeviceInfo', 'MediaCapabilities', 'MIDIPort', 'MIDIOutputMap',
    'MIDIOutput', 'MIDIMessageEvent', 'MIDIInputMap', 'MIDIInput', 'MIDIConnectionEvent',
    'MIDIAccess', 'ImageCapture', 'ImageBitmapRenderingContext', 'IIRFilterNode', 'IDBVersionChangeEvent',
    'IDBTransaction', 'IDBRequest', 'IDBOpenDBRequest', 'IDBObjectStore', 'IDBKeyRange',
    'IDBIndex', 'IDBFactory', 'IDBDatabase', 'IDBCursorWithValue', 'IDBCursor',
    'GamepadEvent', 'Gamepad', 'GamepadButton', 'GainNode', 'EventSource',
    'DynamicsCompressorNode', 'DeviceOrientationEvent', 'DeviceMotionEvent', 'DelayNode', 'DOMError',
    'CryptoKey', 'Crypto', 'ConvolverNode', 'ConstantSourceNode', 'CloseEvent',
    'ChannelSplitterNode', 'ChannelMergerNode', 'CanvasRenderingContext2D', 'CanvasCaptureMediaStreamTrack', 'BroadcastChannel',
    'BlobEvent', 'BiquadFilterNode', 'BeforeInstallPromptEvent', 'BatteryManager', 'BaseAudioContext',
    'AudioWorkletNode', 'AudioScheduledSourceNode', 'AudioProcessingEvent', 'AudioParamMap', 'AudioParam',
    'AudioNode', 'AudioListener', 'AudioDestinationNode', 'AudioContext', 'AudioBufferSourceNode',
    'AudioBuffer', 'AnalyserNode', 'XPathResult', 'XPathExpression', 'XPathEvaluator',
    'XMLSerializer', 'XMLHttpRequestUpload', 'XMLHttpRequestEventTarget', 'XMLHttpRequest', 'XMLDocument',
    'Worker', 'Window', 'WheelEvent', 'ValidityState', 'VTTCue',
    'URLSearchParams', 'URL', 'UIEvent', 'TreeWalker', 'TransitionEvent',
    'TrackEvent', 'TouchList', 'TouchEvent', 'Touch', 'TimeRanges',
    'TextTrackList', 'TextTrackCueList', 'TextTrackCue', 'TextTrack', 'TextMetrics',
    'TextEvent', 'Text', 'TaskAttributionTiming', 'StyleSheetList', 'StyleSheet',
    'StaticRange', 'ShadowRoot', 'Selection', 'SecurityPolicyViolationEvent', 'Screen',
    'SVGViewElement', 'SVGUseElement', 'SVGUnitTypes', 'SVGTransformList', 'SVGTransform',
    'SVGTitleElement', 'SVGTextPositioningElement', 'SVGTextPathElement', 'SVGTextElement', 'SVGTextContentElement',
    'SVGTSpanElement', 'SVGSymbolElement', 'SVGSwitchElement', 'SVGStyleElement', 'SVGStringList',
    'SVGStopElement', 'SVGSetElement', 'SVGScriptElement', 'SVGSVGElement', 'SVGRectElement',
    'SVGRect', 'SVGRadialGradientElement', 'SVGPreserveAspectRatio', 'SVGPolylineElement', 'SVGPolygonElement',
    'SVGPointList', 'SVGPoint', 'SVGPatternElement', 'SVGPathElement', 'SVGNumberList',
    'SVGNumber', 'SVGMetadataElement', 'SVGMatrix', 'SVGMaskElement', 'SVGMarkerElement',
    'SVGLinearGradientElement', 'SVGLineElement', 'SVGLengthList', 'SVGLength', 'SVGImageElement',
    'SVGGraphicsElement', 'SVGGradientElement', 'SVGGeometryElement', 'SVGGElement', 'SVGForeignObjectElement',
    'SVGFilterElement', 'SVGFETurbulenceElement', 'SVGFETileElement', 'SVGFESpotLightElement', 'SVGFESpecularLightingElement',
    'SVGFEPointLightElement', 'SVGFEOffsetElement', 'SVGFEMorphologyElement', 'SVGFEMergeNodeElement', 'SVGFEMergeElement',
    'SVGFEImageElement', 'SVGFEGaussianBlurElement', 'SVGFEFuncRElement', 'SVGFEFuncGElement', 'SVGFEFuncBElement',
    'SVGFEFuncAElement', 'SVGFEFloodElement', 'SVGFEDropShadowElement', 'SVGFEDistantLightElement', 'SVGFEDisplacementMapElement',
    'SVGFEDiffuseLightingElement', 'SVGFEConvolveMatrixElement', 'SVGFECompositeElement', 'SVGFEComponentTransferElement', 'SVGFEColorMatrixElement',
    'SVGFEBlendElement', 'SVGEllipseElement', 'SVGElement', 'SVGDescElement', 'SVGDefsElement',
    'SVGComponentTransferFunctionElement', 'SVGClipPathElement', 'SVGCircleElement', 'SVGAnimatedTransformList', 'SVGAnimatedString',
    'SVGAnimatedRect', 'SVGAnimatedPreserveAspectRatio', 'SVGAnimatedNumberList', 'SVGAnimatedNumber', 'SVGAnimatedLengthList',
    'SVGAnimatedLength', 'SVGAnimatedInteger', 'SVGAnimatedEnumeration', 'SVGAnimatedBoolean', 'SVGAnimatedAngle',
    'SVGAnimateTransformElement', 'SVGAnimateMotionElement', 'SVGAnimateElement', 'SVGAngle', 'SVGAElement',
    'Response', 'Request', 'Range', 'RadioNodeList', 'PromiseRejectionEvent',
    'ProgressEvent', 'ProcessingInstruction', 'PopStateEvent', 'PointerEvent', 'PerformanceTiming',
    'PerformanceResourceTiming', 'PerformanceObserverEntryList', 'PerformanceObserver', 'PerformanceNavigation', 'PerformanceMeasure',
    'PerformanceMark', 'PerformanceLongTaskTiming', 'PerformanceEntry', 'Performance', 'PageTransitionEvent',
    'NodeList', 'NodeIterator', 'NodeFilter', 'Node', 'Navigator',
    'NamedNodeMap', 'MutationRecord', 'MutationObserver', 'MutationEvent', 'MouseEvent',
    'MessagePort', 'MessageEvent', 'MessageChannel', 'MediaQueryListEvent', 'MediaQueryList',
    'MediaList', 'MediaError', 'Location', 'KeyboardEvent', 'IntersectionObserverEntry',
    'IntersectionObserver', 'InputEvent', 'InputDeviceCapabilities', 'ImageData', 'ImageBitmap',
    'IdleDeadline', 'History', 'Headers', 'HashChangeEvent', 'HTMLVideoElement',
    'HTMLUnknownElement', 'HTMLUListElement', 'HTMLTrackElement', 'HTMLTitleElement', 'HTMLTimeElement',
    'HTMLTextAreaElement', 'HTMLTemplateElement', 'HTMLTableSectionElement', 'HTMLTableRowElement', 'HTMLTableElement',
    'HTMLTableColElement', 'HTMLTableCellElement', 'HTMLTableCaptionElement', 'HTMLStyleElement', 'HTMLSpanElement',
    'HTMLSourceElement', 'HTMLSlotElement', 'HTMLShadowElement', 'HTMLSelectElement', 'HTMLScriptElement',
    'HTMLQuoteElement', 'HTMLProgressElement', 'HTMLPreElement', 'HTMLPictureElement', 'HTMLParamElement',
    'HTMLParagraphElement', 'HTMLOutputElement', 'HTMLOptionsCollection', 'Option', 'HTMLOptionElement',
    'HTMLOptGroupElement', 'HTMLObjectElement', 'HTMLOListElement', 'HTMLModElement', 'HTMLMeterElement',
    'HTMLMetaElement', 'HTMLMenuElement', 'HTMLMediaElement', 'HTMLMarqueeElement', 'HTMLMapElement',
    'HTMLLinkElement', 'HTMLLegendElement', 'HTMLLabelElement', 'HTMLLIElement', 'HTMLInputElement',
    'Image', 'HTMLImageElement', 'HTMLIFrameElement', 'HTMLHtmlElement', 'HTMLHeadingElement',
    'HTMLHeadElement', 'HTMLHRElement', 'HTMLFrameSetElement', 'HTMLFrameElement', 'HTMLFormElement',
    'HTMLFormControlsCollection', 'HTMLFontElement', 'HTMLFieldSetElement', 'HTMLEmbedElement', 'HTMLElement',
    'HTMLDocument', 'HTMLDivElement', 'HTMLDirectoryElement', 'HTMLDialogElement', 'HTMLDetailsElement',
    'HTMLDataListElement', 'HTMLDataElement', 'HTMLDListElement', 'HTMLContentElement', 'HTMLCollection',
    'HTMLCanvasElement', 'HTMLButtonElement', 'HTMLBodyElement', 'HTMLBaseElement', 'HTMLBRElement',
    'Audio', 'HTMLAudioElement', 'HTMLAreaElement', 'HTMLAnchorElement', 'HTMLAllCollection',
    'FormData', 'FontFaceSetLoadEvent', 'FocusEvent', 'FileReader', 'FileList',
    'File', 'EventTarget', 'Event', 'ErrorEvent', 'Element',
    'DragEvent', 'DocumentType', 'DocumentFragment', 'Document', 'DataTransferItemList',
    'DataTransferItem', 'DataTransfer', 'DOMTokenList', 'DOMStringMap', 'DOMStringList',
    'DOMParser', 'DOMImplementation', 'DOMException', 'CustomEvent', 'CustomElementRegistry',
    'CompositionEvent', 'Comment', 'ClipboardEvent', 'CharacterData', 'CSSSupportsRule',
    'CSSStyleSheet', 'CSSStyleRule', 'CSSStyleDeclaration', 'CSSRuleList', 'CSSRule',
    'CSSPageRule', 'CSSNamespaceRule', 'CSSMediaRule', 'CSSKeyframesRule', 'CSSKeyframeRule',
    'CSSImportRule', 'CSSGroupingRule', 'CSSFontFaceRule', 'CSS', 'CSSConditionRule',
    'CDATASection', 'Blob', 'BeforeUnloadEvent', 'BarProp', 'Attr',
    'ApplicationCacheErrorEvent', 'ApplicationCache', 'AnimationEvent', 'AbortSignal', 'AbortController',
    'WebKitCSSMatrix', 'WebKitMutationObserver', 'WebKitAnimationEvent', 'WebKitTransitionEvent', 'WebAssembly',
    'MediaCapabilitiesInfo', 'CSSImageValue', 'CSSKeywordValue', 'CSSMathInvert', 'CSSMathMax',
    'CSSMathMin', 'CSSMathNegate', 'CSSMathProduct', 'CSSMathSum', 'CSSMathValue',
    'CSSMatrixComponent', 'CSSNumericArray', 'CSSNumericValue', 'CSSPerspective', 'CSSPositionValue',
    'CSSRotate', 'CSSScale', 'CSSSkew', 'CSSSkewX', 'CSSSkewY',
    'CSSStyleValue', 'CSSTransformComponent', 'CSSTransformValue', 'CSSTranslate', 'CSSUnitValue',
    'CSSUnparsedValue', 'CSSVariableReferenceValue', 'StylePropertyMap', 'StylePropertyMapReadOnly', 'DOMMatrix',
    'DOMMatrixReadOnly', 'DOMPoint', 'DOMPointReadOnly', 'DOMQuad', 'DOMRect',
    'DOMRectReadOnly', 'PerformanceNavigationTiming', 'PerformancePaintTiming', 'ResizeObserver', 'ResizeObserverEntry',
    'SVGAnimationElement', 'SVGDiscardElement', 'SVGMPathElement', 'PerformanceServerTiming', 'SharedWorker',
    'FontFace', 'VisualViewport', 'XSLTProcessor', 'BudgetService', 'Notification',
    'PaymentAddress', 'PaymentRequest', 'PaymentRequestUpdateEvent', 'PaymentResponse', 'Permissions',
    'PermissionStatus', 'Presentation', 'PresentationAvailability', 'PresentationConnection', 'PresentationConnectionAvailableEvent',
    'PresentationConnectionCloseEvent', 'PresentationConnectionList', 'PresentationReceiver', 'PresentationRequest', 'PushManager',
    'PushSubscription', 'PushSubscriptionOptions', 'RemotePlayback', 'SpeechSynthesisEvent', 'SpeechSynthesisUtterance',
    'CanvasGradient', 'CanvasPattern', 'Path2D', 'WebGL2RenderingContext', 'WebGLRenderingContext',
    'Bluetooth', 'BluetoothCharacteristicProperties', 'BluetoothDevice', 'BluetoothRemoteGATTCharacteristic', 'BluetoothRemoteGATTDescriptor',
    'BluetoothRemoteGATTServer', 'BluetoothRemoteGATTService', 'BluetoothUUID', 'USB', 'USBAlternateInterface',
    'USBConfiguration', 'USBConnectionEvent', 'USBDevice', 'USBEndpoint', 'USBInterface',
    'USBInTransferResult', 'USBIsochronousInTransferPacket', 'USBIsochronousInTransferResult', 'USBIsochronousOutTransferPacket', 'USBIsochronousOutTransferResult',
    'USBOutTransferResult'
];

export function isGlobalVariable(ident) {
    let ret = globalVar.findIndex(item => item === ident.name) !== -1;
    return ret;
}

export function isParam(ident, parent) {
    if (ident.type !== 'Identifier') {
        return false;
    }
    if (!/Function/.test(parent.type)) {
        return false;
    }
    return !!parent.params.find(item => {
        if (item.type === 'Identifier') {
            return item === ident;
        }
        else {
            return item.left === ident;
        }
    });
}

export function isClosureVariable(ident, currentScope) {
    let scope = currentScope;
    while (scope) {
        let variables = scope.variables;
        for (var j = 0; j < variables.length; j++) {
            if (variables[j].name === ident.name) {
                return true;
            }
        }
        scope = scope.upper;
    }
    return false;
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function addNamespace(ast, namespace, namespaceConverted) {
    esquery(ast, 'ClassDeclaration').map(clazz => clazz.namespace = namespaceConverted);
    let programBody = ast.body;
    programBody.unshift({
        type: 'NamespaceDeclaration',
        id: {
            type: 'Identifier',
            name: namespace
        }
    });
}

function getNamespaceFromFilepath(filePath) {
    let {dir, name} = path.parse(filePath);
    let filePathWithoutExt = path.resolve(dir, name);
    let relativeToRoot = path.relative(baseDir, filePathWithoutExt);
    // for example
    // src/main/xxx.js#function yyy
    // namespace => src.main.xxx
    let namespace = relativeToRoot.split(path.sep).join('.').replace(/-/g, '');
    let namespaceConverted = '\\' + namespace.split('.').join('\\');
    // useNamespace => src.main.xxx.yyy
    let useNamespace = namespace + '.' + defaultExportName;
    // useNamespaceConverted => src\main\xxx\yyy
    let useNamespaceConverted = '\\' + useNamespace.split('.').join('\\');
    return {
        namespace,
        namespaceConverted,
        useNamespace,
        useNamespaceConverted
    };
}

export function getPackageInfo(filePath) {
    if (!filePath) {
        return {};
    }
    let {dir, name} = path.parse(filePath);
    let {
        namespace,
        namespaceConverted,
        useNamespace,
        useNamespaceConverted
    } = getNamespaceFromFilepath(filePath);
    return {
        name,
        dir,
        useNamespace,
        useNamespaceConverted,
        namespace,
        namespaceConverted
    };
}

export function defAnalyze(ast) {
    let scopes = analyze(ast, {
        sourceType: parseOptions.sourceType,
        ecmaVersion: parseOptions.ecmaFeatures.ecmaVersion
    }).scopes;

    let map = new WeakMap();
    var scope;

    while (scope = scopes.shift()) {
        scope.references.map(function (reference) {
            if (!map.has(reference.identifier)) {
                if (reference.resolved) {
                    map.set(reference.identifier, reference.resolved.defs[0]);
                }
            }
        });
        scopes = scopes.concat(scope.childScopes);
    }

    return function (identifier) {
        return map.get(identifier);
    };
}

export function defaultExport2NamedExport(ast) {
    let exportObject = esquery(ast, 'ExportDefaultDeclaration')[0];
    if (!exportObject) {
        return;
    }

    if (exportObject.declaration.type === 'ClassDeclaration') {
        let namedExport = clone(exportObject);
        namedExport.type = 'ExportNamedDeclaration';
        namedExport.declaration.id.name = defaultExportName;
        let programAst = esquery(ast, 'Program')[0];
        programAst.body.push(namedExport);
    }
    else {
        // 不是class的就直接变量导出

        let originDeclaration = clone(exportObject.declaration);
        exportObject = exportObject.declaration;
        exportObject.type = 'ExportNamedDeclaration';
        exportObject.declaration = {
            type: 'VariableDeclaration',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'Identifier',
                        name: defaultExportName
                    },
                    init: originDeclaration
                }
            ],
            kind: 'const'
        };
    }
}
