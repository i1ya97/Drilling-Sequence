/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * Entry point from which you should import all public core APIs.
 */
export { Attribute, ANALYZE_FOR_ENTRY_COMPONENTS, ContentChild, ContentChildren, Query, ViewChild, ViewChildren, Component, Directive, HostBinding, HostListener, Input, Output, Pipe, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, ViewEncapsulation } from './metadata';
export { Version, VERSION } from './version';
export { InjectFlags, ɵɵdefineInjectable, defineInjectable, ɵɵdefineInjector, forwardRef, resolveForwardRef, Injectable, Injector, ɵɵinject, inject, INJECTOR, ReflectiveInjector, ResolvedReflectiveFactory, ReflectiveKey, InjectionToken, Inject, Optional, Self, SkipSelf, Host } from './di';
export { createPlatform, assertPlatform, destroyPlatform, getPlatform, PlatformRef, ApplicationRef, createPlatformFactory, NgProbeToken } from './application_ref';
export { enableProdMode, isDevMode } from './util/is_dev_mode';
export { APP_ID, PACKAGE_ROOT_URL, PLATFORM_INITIALIZER, PLATFORM_ID, APP_BOOTSTRAP_LISTENER } from './application_tokens';
export { APP_INITIALIZER, ApplicationInitStatus } from './application_init';
export { NgZone, ɵNoopNgZone } from './zone';
export { RenderComponentType, Renderer, Renderer2, RendererFactory2, RendererStyleFlags2, RootRenderer } from './render';
export { COMPILER_OPTIONS, Compiler, CompilerFactory, ModuleWithComponentFactories, ComponentFactory, ComponentRef, ComponentFactoryResolver, ElementRef, NgModuleFactory, NgModuleRef, NgModuleFactoryLoader, getModuleFactory, QueryList, SystemJsNgModuleLoader, SystemJsNgModuleLoaderConfig, TemplateRef, ViewContainerRef, EmbeddedViewRef, ViewRef } from './linker';
export { DebugElement, DebugEventListener, DebugNode, asNativeElements, getDebugNode } from './debug/debug_node';
export { Testability, TestabilityRegistry, setTestabilityGetter } from './testability/testability';
export { ChangeDetectionStrategy, ChangeDetectorRef, DefaultIterableDiffer, IterableDiffers, KeyValueDiffers, SimpleChange, WrappedValue } from './change_detection';
export { platformCore } from './platform_core_providers';
export { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID, MissingTranslationStrategy } from './i18n/tokens';
export { ApplicationModule } from './application_module';
export { wtfCreateScope, wtfLeave, wtfStartTimeRange, wtfEndTimeRange } from './profile/profile';
export { Type } from './interface/type';
export { EventEmitter } from './event_emitter';
export { ErrorHandler } from './error_handler';
export { ɵALLOW_MULTIPLE_PLATFORMS, ɵAPP_ID_RANDOM_PROVIDER, ɵdefaultIterableDiffers, ɵdefaultKeyValueDiffers, ɵdevModeEqual, ɵisListLikeIterable, ɵChangeDetectorStatus, ɵisDefaultChangeDetectionStrategy, ɵConsole, ɵsetCurrentInjector, ɵgetInjectableDef, ɵAPP_ROOT, ɵDEFAULT_LOCALE_ID, ɵivyEnabled, ɵComponentFactory, ɵCodegenComponentFactoryResolver, ɵclearResolutionOfComponentResourcesQueue, ɵresolveComponentResources, ɵReflectionCapabilities, ɵRenderDebugInfo, ɵ_sanitizeHtml, ɵ_sanitizeStyle, ɵ_sanitizeUrl, ɵglobal, ɵlooseIdentical, ɵstringify, ɵmakeDecorator, ɵisObservable, ɵisPromise, ɵclearOverrides, ɵinitServicesIfNeeded, ɵoverrideComponentView, ɵoverrideProvider, ɵNOT_FOUND_CHECK_ONLY_ELEMENT_INJECTOR, ɵgetLocalePluralCase, ɵfindLocaleData, ɵLOCALE_DATA, ɵLocaleDataIndex } from './core_private_export';
export { ɵɵattribute, ɵɵattributeInterpolate1, ɵɵattributeInterpolate2, ɵɵattributeInterpolate3, ɵɵattributeInterpolate4, ɵɵattributeInterpolate5, ɵɵattributeInterpolate6, ɵɵattributeInterpolate7, ɵɵattributeInterpolate8, ɵɵattributeInterpolateV, ɵɵdefineBase, ɵɵdefineComponent, ɵɵdefineDirective, ɵɵdefinePipe, ɵɵdefineNgModule, ɵdetectChanges, ɵrenderComponent, ɵRender3ComponentFactory, ɵRender3ComponentRef, ɵɵdirectiveInject, ɵɵinjectAttribute, ɵɵinjectPipeChangeDetectorRef, ɵɵgetFactoryOf, ɵɵgetInheritedFactory, ɵɵsetComponentScope, ɵɵsetNgModuleScope, ɵɵtemplateRefExtractor, ɵɵProvidersFeature, ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature, ɵLifecycleHooksFeature, ɵRender3NgModuleRef, ɵmarkDirty, ɵNgModuleFactory, ɵNO_CHANGE, ɵɵcontainer, ɵɵnextContext, ɵɵelementStart, ɵɵnamespaceHTML, ɵɵnamespaceMathML, ɵɵnamespaceSVG, ɵɵelement, ɵɵlistener, ɵɵtext, ɵɵtextInterpolate, ɵɵtextInterpolate1, ɵɵtextInterpolate2, ɵɵtextInterpolate3, ɵɵtextInterpolate4, ɵɵtextInterpolate5, ɵɵtextInterpolate6, ɵɵtextInterpolate7, ɵɵtextInterpolate8, ɵɵtextInterpolateV, ɵɵembeddedViewStart, ɵɵprojection, ɵɵpipeBind1, ɵɵpipeBind2, ɵɵpipeBind3, ɵɵpipeBind4, ɵɵpipeBindV, ɵɵpureFunction0, ɵɵpureFunction1, ɵɵpureFunction2, ɵɵpureFunction3, ɵɵpureFunction4, ɵɵpureFunction5, ɵɵpureFunction6, ɵɵpureFunction7, ɵɵpureFunction8, ɵɵpureFunctionV, ɵɵgetCurrentView, ɵgetDirectives, ɵgetHostElement, ɵɵrestoreView, ɵɵcontainerRefreshStart, ɵɵcontainerRefreshEnd, ɵɵqueryRefresh, ɵɵviewQuery, ɵɵstaticViewQuery, ɵɵstaticContentQuery, ɵɵloadViewQuery, ɵɵcontentQuery, ɵɵloadContentQuery, ɵɵelementEnd, ɵɵhostProperty, ɵɵproperty, ɵɵpropertyInterpolate, ɵɵpropertyInterpolate1, ɵɵpropertyInterpolate2, ɵɵpropertyInterpolate3, ɵɵpropertyInterpolate4, ɵɵpropertyInterpolate5, ɵɵpropertyInterpolate6, ɵɵpropertyInterpolate7, ɵɵpropertyInterpolate8, ɵɵpropertyInterpolateV, ɵɵupdateSyntheticHostBinding, ɵɵcomponentHostSyntheticListener, ɵɵprojectionDef, ɵɵreference, ɵɵenableBindings, ɵɵdisableBindings, ɵɵallocHostVars, ɵɵelementContainerStart, ɵɵelementContainerEnd, ɵɵelementContainer, ɵɵstyling, ɵɵstyleMap, ɵɵstyleSanitizer, ɵɵclassMap, ɵɵclassMapInterpolate1, ɵɵclassMapInterpolate2, ɵɵclassMapInterpolate3, ɵɵclassMapInterpolate4, ɵɵclassMapInterpolate5, ɵɵclassMapInterpolate6, ɵɵclassMapInterpolate7, ɵɵclassMapInterpolate8, ɵɵclassMapInterpolateV, ɵɵstyleProp, ɵɵstylePropInterpolate1, ɵɵstylePropInterpolate2, ɵɵstylePropInterpolate3, ɵɵstylePropInterpolate4, ɵɵstylePropInterpolate5, ɵɵstylePropInterpolate6, ɵɵstylePropInterpolate7, ɵɵstylePropInterpolate8, ɵɵstylePropInterpolateV, ɵɵstylingApply, ɵɵclassProp, ɵɵelementHostAttrs, ɵɵselect, ɵɵtextBinding, ɵɵtemplate, ɵɵembeddedViewEnd, ɵstore, ɵɵload, ɵɵpipe, ɵwhenRendered, ɵɵi18n, ɵɵi18nAttributes, ɵɵi18nExp, ɵɵi18nStart, ɵɵi18nEnd, ɵɵi18nApply, ɵɵi18nPostprocess, ɵi18nConfigureLocalize, ɵɵi18nLocalize, ɵsetLocaleId, ɵsetClassMetadata, ɵɵresolveWindow, ɵɵresolveDocument, ɵɵresolveBody, ɵcompileComponent, ɵcompileDirective, ɵcompileNgModule, ɵcompileNgModuleDefs, ɵpatchComponentDefWithScope, ɵresetCompiledComponents, ɵflushModuleScopingQueueAsMuchAsPossible, ɵtransitiveScopesFor, ɵcompilePipe, ɵɵsanitizeHtml, ɵɵsanitizeStyle, ɵɵdefaultStyleSanitizer, ɵɵsanitizeScript, ɵɵsanitizeUrl, ɵɵsanitizeResourceUrl, ɵɵsanitizeUrlOrResourceUrl, ɵbypassSanitizationTrustHtml, ɵbypassSanitizationTrustStyle, ɵbypassSanitizationTrustScript, ɵbypassSanitizationTrustUrl, ɵbypassSanitizationTrustResourceUrl, ɵgetLContext, ɵNG_ELEMENT_ID, ɵNG_COMPONENT_DEF, ɵNG_DIRECTIVE_DEF, ɵNG_PIPE_DEF, ɵNG_MODULE_DEF, ɵNG_BASE_DEF, ɵNG_INJECTABLE_DEF, ɵNG_INJECTOR_DEF, ɵcompileNgModuleFactory__POST_R3__, ɵisBoundToModule__POST_R3__, ɵSWITCH_COMPILE_COMPONENT__POST_R3__, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__, ɵSWITCH_COMPILE_PIPE__POST_R3__, ɵSWITCH_COMPILE_NGMODULE__POST_R3__, ɵgetDebugNode__POST_R3__, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__, ɵSWITCH_IVY_ENABLED__POST_R3__, ɵSWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__, ɵCompiler_compileModuleSync__POST_R3__, ɵCompiler_compileModuleAsync__POST_R3__, ɵCompiler_compileModuleAndAllComponentsSync__POST_R3__, ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__, ɵSWITCH_ELEMENT_REF_FACTORY__POST_R3__, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__, ɵSWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__, ɵSWITCH_RENDERER2_FACTORY__POST_R3__, ɵgetModuleFactory__POST_R3__, ɵregisterNgModuleType, ɵpublishGlobalUtil, ɵpublishDefaultGlobalUtils, ɵcreateInjector, ɵINJECTOR_IMPL__POST_R3__ } from './core_render3_private_export';
export { Sanitizer, SecurityContext } from './sanitization/security';
export { ɵregisterModuleFactory, ɵEMPTY_ARRAY, ɵEMPTY_MAP, ɵand, ɵccf, ɵcmf, ɵcrt, ɵdid, ɵeld, ɵgetComponentViewDefinitionFactory, ɵinlineInterpolate, ɵinterpolate, ɵmod, ɵmpd, ɵncd, ɵnov, ɵpid, ɵprd, ɵpad, ɵpod, ɵppd, ɵqud, ɵted, ɵunv, ɵvid } from './codegen_private_exports';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NvcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQWFBLG9RQUFjLFlBQVksQ0FBQztBQUMzQixpQ0FBYyxXQUFXLENBQUM7QUFFMUIsMlJBQWMsTUFBTSxDQUFDO0FBQ3JCLE9BQU8sRUFBQyxjQUFjLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxxQkFBcUIsRUFBRSxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqSyxPQUFPLEVBQUMsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzdELE9BQU8sRUFBQyxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsV0FBVyxFQUFFLHNCQUFzQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDekgsT0FBTyxFQUFDLGVBQWUsRUFBRSxxQkFBcUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzFFLG9DQUFjLFFBQVEsQ0FBQztBQUN2Qiw4R0FBYyxVQUFVLENBQUM7QUFDekIsaVdBQWMsVUFBVSxDQUFDO0FBQ3pCLE9BQU8sRUFBQyxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLFlBQVksRUFBWSxNQUFNLG9CQUFvQixDQUFDO0FBQzFILE9BQU8sRUFBaUIsV0FBVyxFQUFFLG1CQUFtQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDakgsZ0pBQWMsb0JBQW9CLENBQUM7QUFDbkMsNkJBQWMsMkJBQTJCLENBQUM7QUFDMUMsT0FBTyxFQUFDLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkcsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdkQsT0FBTyxFQUFDLGNBQWMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsZUFBZSxFQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDM0csT0FBTyxFQUFlLElBQUksRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsMnhCQUFjLHVCQUF1QixDQUFDO0FBQ3RDLHMzSUFBYywrQkFBK0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsU0FBUyxFQUFFLGVBQWUsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ25FLHlQQUFjLDJCQUEyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogRW50cnkgcG9pbnQgZnJvbSB3aGljaCB5b3Ugc2hvdWxkIGltcG9ydCBhbGwgcHVibGljIGNvcmUgQVBJcy5cbiAqL1xuZXhwb3J0ICogZnJvbSAnLi9tZXRhZGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL3ZlcnNpb24nO1xuZXhwb3J0IHtUeXBlRGVjb3JhdG9yfSBmcm9tICcuL3V0aWwvZGVjb3JhdG9ycyc7XG5leHBvcnQgKiBmcm9tICcuL2RpJztcbmV4cG9ydCB7Y3JlYXRlUGxhdGZvcm0sIGFzc2VydFBsYXRmb3JtLCBkZXN0cm95UGxhdGZvcm0sIGdldFBsYXRmb3JtLCBQbGF0Zm9ybVJlZiwgQXBwbGljYXRpb25SZWYsIGNyZWF0ZVBsYXRmb3JtRmFjdG9yeSwgTmdQcm9iZVRva2VufSBmcm9tICcuL2FwcGxpY2F0aW9uX3JlZic7XG5leHBvcnQge2VuYWJsZVByb2RNb2RlLCBpc0Rldk1vZGV9IGZyb20gJy4vdXRpbC9pc19kZXZfbW9kZSc7XG5leHBvcnQge0FQUF9JRCwgUEFDS0FHRV9ST09UX1VSTCwgUExBVEZPUk1fSU5JVElBTElaRVIsIFBMQVRGT1JNX0lELCBBUFBfQk9PVFNUUkFQX0xJU1RFTkVSfSBmcm9tICcuL2FwcGxpY2F0aW9uX3Rva2Vucyc7XG5leHBvcnQge0FQUF9JTklUSUFMSVpFUiwgQXBwbGljYXRpb25Jbml0U3RhdHVzfSBmcm9tICcuL2FwcGxpY2F0aW9uX2luaXQnO1xuZXhwb3J0ICogZnJvbSAnLi96b25lJztcbmV4cG9ydCAqIGZyb20gJy4vcmVuZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vbGlua2VyJztcbmV4cG9ydCB7RGVidWdFbGVtZW50LCBEZWJ1Z0V2ZW50TGlzdGVuZXIsIERlYnVnTm9kZSwgYXNOYXRpdmVFbGVtZW50cywgZ2V0RGVidWdOb2RlLCBQcmVkaWNhdGV9IGZyb20gJy4vZGVidWcvZGVidWdfbm9kZSc7XG5leHBvcnQge0dldFRlc3RhYmlsaXR5LCBUZXN0YWJpbGl0eSwgVGVzdGFiaWxpdHlSZWdpc3RyeSwgc2V0VGVzdGFiaWxpdHlHZXR0ZXJ9IGZyb20gJy4vdGVzdGFiaWxpdHkvdGVzdGFiaWxpdHknO1xuZXhwb3J0ICogZnJvbSAnLi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vcGxhdGZvcm1fY29yZV9wcm92aWRlcnMnO1xuZXhwb3J0IHtUUkFOU0xBVElPTlMsIFRSQU5TTEFUSU9OU19GT1JNQVQsIExPQ0FMRV9JRCwgTWlzc2luZ1RyYW5zbGF0aW9uU3RyYXRlZ3l9IGZyb20gJy4vaTE4bi90b2tlbnMnO1xuZXhwb3J0IHtBcHBsaWNhdGlvbk1vZHVsZX0gZnJvbSAnLi9hcHBsaWNhdGlvbl9tb2R1bGUnO1xuZXhwb3J0IHt3dGZDcmVhdGVTY29wZSwgd3RmTGVhdmUsIHd0ZlN0YXJ0VGltZVJhbmdlLCB3dGZFbmRUaW1lUmFuZ2UsIFd0ZlNjb3BlRm59IGZyb20gJy4vcHJvZmlsZS9wcm9maWxlJztcbmV4cG9ydCB7QWJzdHJhY3RUeXBlLCBUeXBlfSBmcm9tICcuL2ludGVyZmFjZS90eXBlJztcbmV4cG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICcuL2V2ZW50X2VtaXR0ZXInO1xuZXhwb3J0IHtFcnJvckhhbmRsZXJ9IGZyb20gJy4vZXJyb3JfaGFuZGxlcic7XG5leHBvcnQgKiBmcm9tICcuL2NvcmVfcHJpdmF0ZV9leHBvcnQnO1xuZXhwb3J0ICogZnJvbSAnLi9jb3JlX3JlbmRlcjNfcHJpdmF0ZV9leHBvcnQnO1xuZXhwb3J0IHtTYW5pdGl6ZXIsIFNlY3VyaXR5Q29udGV4dH0gZnJvbSAnLi9zYW5pdGl6YXRpb24vc2VjdXJpdHknO1xuZXhwb3J0ICogZnJvbSAnLi9jb2RlZ2VuX3ByaXZhdGVfZXhwb3J0cyc7XG4iXX0=