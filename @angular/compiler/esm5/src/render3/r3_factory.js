/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { StaticSymbol } from '../aot/static_symbol';
import { tokenReference } from '../compile_metadata';
import { Identifiers } from '../identifiers';
import * as o from '../output/output_ast';
import { Identifiers as R3 } from '../render3/r3_identifiers';
import { unsupported } from './view/util';
export var R3FactoryDelegateType;
(function (R3FactoryDelegateType) {
    R3FactoryDelegateType[R3FactoryDelegateType["Class"] = 0] = "Class";
    R3FactoryDelegateType[R3FactoryDelegateType["Function"] = 1] = "Function";
    R3FactoryDelegateType[R3FactoryDelegateType["Factory"] = 2] = "Factory";
})(R3FactoryDelegateType || (R3FactoryDelegateType = {}));
/**
 * Resolved type of a dependency.
 *
 * Occasionally, dependencies will have special significance which is known statically. In that
 * case the `R3ResolvedDependencyType` informs the factory generator that a particular dependency
 * should be generated specially (usually by calling a special injection function instead of the
 * standard one).
 */
export var R3ResolvedDependencyType;
(function (R3ResolvedDependencyType) {
    /**
     * A normal token dependency.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Token"] = 0] = "Token";
    /**
     * The dependency is for an attribute.
     *
     * The token expression is a string representing the attribute name.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["Attribute"] = 1] = "Attribute";
    /**
     * Injecting the `ChangeDetectorRef` token. Needs special handling when injected into a pipe.
     */
    R3ResolvedDependencyType[R3ResolvedDependencyType["ChangeDetectorRef"] = 2] = "ChangeDetectorRef";
})(R3ResolvedDependencyType || (R3ResolvedDependencyType = {}));
/**
 * Construct a factory function expression for the given `R3FactoryMetadata`.
 */
export function compileFactoryFunction(meta, isPipe) {
    if (isPipe === void 0) { isPipe = false; }
    var t = o.variable('t');
    var statements = [];
    // The type to instantiate via constructor invocation. If there is no delegated factory, meaning
    // this type is always created by constructor invocation, then this is the type-to-create
    // parameter provided by the user (t) if specified, or the current type if not. If there is a
    // delegated factory (which is used to create the current type) then this is only the type-to-
    // create parameter (t).
    var typeForCtor = !isDelegatedMetadata(meta) ? new o.BinaryOperatorExpr(o.BinaryOperator.Or, t, meta.type) : t;
    var ctorExpr = null;
    if (meta.deps !== null) {
        // There is a constructor (either explicitly or implicitly defined).
        if (meta.deps !== 'invalid') {
            ctorExpr =
                new o.InstantiateExpr(typeForCtor, injectDependencies(meta.deps, meta.injectFn, isPipe));
        }
    }
    else {
        var baseFactory = o.variable("\u0275" + meta.name + "_BaseFactory");
        var getInheritedFactory = o.importExpr(R3.getInheritedFactory);
        var baseFactoryStmt = baseFactory.set(getInheritedFactory.callFn([meta.type])).toDeclStmt(o.INFERRED_TYPE, [
            o.StmtModifier.Exported, o.StmtModifier.Final
        ]);
        statements.push(baseFactoryStmt);
        // There is no constructor, use the base class' factory to construct typeForCtor.
        ctorExpr = baseFactory.callFn([typeForCtor]);
    }
    var ctorExprFinal = ctorExpr;
    var body = [];
    var retExpr = null;
    function makeConditionalFactory(nonCtorExpr) {
        var r = o.variable('r');
        body.push(r.set(o.NULL_EXPR).toDeclStmt());
        var ctorStmt = null;
        if (ctorExprFinal !== null) {
            ctorStmt = r.set(ctorExprFinal).toStmt();
        }
        else {
            ctorStmt = makeErrorStmt(meta.name);
        }
        body.push(o.ifStmt(t, [ctorStmt], [r.set(nonCtorExpr).toStmt()]));
        return r;
    }
    if (isDelegatedMetadata(meta) && meta.delegateType === R3FactoryDelegateType.Factory) {
        var delegateFactory = o.variable("\u0275" + meta.name + "_BaseFactory");
        var getFactoryOf = o.importExpr(R3.getFactoryOf);
        if (meta.delegate.isEquivalent(meta.type)) {
            throw new Error("Illegal state: compiling factory that delegates to itself");
        }
        var delegateFactoryStmt = delegateFactory.set(getFactoryOf.callFn([meta.delegate])).toDeclStmt(o.INFERRED_TYPE, [
            o.StmtModifier.Exported, o.StmtModifier.Final
        ]);
        statements.push(delegateFactoryStmt);
        retExpr = makeConditionalFactory(delegateFactory.callFn([]));
    }
    else if (isDelegatedMetadata(meta)) {
        // This type is created with a delegated factory. If a type parameter is not specified, call
        // the factory instead.
        var delegateArgs = injectDependencies(meta.delegateDeps, meta.injectFn, isPipe);
        // Either call `new delegate(...)` or `delegate(...)` depending on meta.useNewForDelegate.
        var factoryExpr = new (meta.delegateType === R3FactoryDelegateType.Class ?
            o.InstantiateExpr :
            o.InvokeFunctionExpr)(meta.delegate, delegateArgs);
        retExpr = makeConditionalFactory(factoryExpr);
    }
    else if (isExpressionFactoryMetadata(meta)) {
        // TODO(alxhub): decide whether to lower the value here or in the caller
        retExpr = makeConditionalFactory(meta.expression);
    }
    else {
        retExpr = ctorExpr;
    }
    if (retExpr !== null) {
        body.push(new o.ReturnStatement(retExpr));
    }
    else {
        body.push(makeErrorStmt(meta.name));
    }
    return {
        factory: o.fn([new o.FnParam('t', o.DYNAMIC_TYPE)], body, o.INFERRED_TYPE, undefined, meta.name + "_Factory"),
        statements: statements,
    };
}
function injectDependencies(deps, injectFn, isPipe) {
    return deps.map(function (dep) { return compileInjectDependency(dep, injectFn, isPipe); });
}
function compileInjectDependency(dep, injectFn, isPipe) {
    // Interpret the dependency according to its resolved type.
    switch (dep.resolved) {
        case R3ResolvedDependencyType.Token:
        case R3ResolvedDependencyType.ChangeDetectorRef:
            // Build up the injection flags according to the metadata.
            var flags = 0 /* Default */ | (dep.self ? 2 /* Self */ : 0) |
                (dep.skipSelf ? 4 /* SkipSelf */ : 0) | (dep.host ? 1 /* Host */ : 0) |
                (dep.optional ? 8 /* Optional */ : 0);
            // If this dependency is optional or otherwise has non-default flags, then additional
            // parameters describing how to inject the dependency must be passed to the inject function
            // that's being used.
            var flagsParam = (flags !== 0 /* Default */ || dep.optional) ? o.literal(flags) : null;
            // We have a separate instruction for injecting ChangeDetectorRef into a pipe.
            if (isPipe && dep.resolved === R3ResolvedDependencyType.ChangeDetectorRef) {
                return o.importExpr(R3.injectPipeChangeDetectorRef).callFn(flagsParam ? [flagsParam] : []);
            }
            // Build up the arguments to the injectFn call.
            var injectArgs = [dep.token];
            if (flagsParam) {
                injectArgs.push(flagsParam);
            }
            return o.importExpr(injectFn).callFn(injectArgs);
        case R3ResolvedDependencyType.Attribute:
            // In the case of attributes, the attribute name in question is given as the token.
            return o.importExpr(R3.injectAttribute).callFn([dep.token]);
        default:
            return unsupported("Unknown R3ResolvedDependencyType: " + R3ResolvedDependencyType[dep.resolved]);
    }
}
/**
 * A helper function useful for extracting `R3DependencyMetadata` from a Render2
 * `CompileTypeMetadata` instance.
 */
export function dependenciesFromGlobalMetadata(type, outputCtx, reflector) {
    var e_1, _a;
    // Use the `CompileReflector` to look up references to some well-known Angular types. These will
    // be compared with the token to statically determine whether the token has significance to
    // Angular, and set the correct `R3ResolvedDependencyType` as a result.
    var injectorRef = reflector.resolveExternalReference(Identifiers.Injector);
    // Iterate through the type's DI dependencies and produce `R3DependencyMetadata` for each of them.
    var deps = [];
    try {
        for (var _b = tslib_1.__values(type.diDeps), _c = _b.next(); !_c.done; _c = _b.next()) {
            var dependency = _c.value;
            if (dependency.token) {
                var tokenRef = tokenReference(dependency.token);
                var resolved = dependency.isAttribute ?
                    R3ResolvedDependencyType.Attribute :
                    R3ResolvedDependencyType.Token;
                // In the case of most dependencies, the token will be a reference to a type. Sometimes,
                // however, it can be a string, in the case of older Angular code or @Attribute injection.
                var token = tokenRef instanceof StaticSymbol ? outputCtx.importExpr(tokenRef) : o.literal(tokenRef);
                // Construct the dependency.
                deps.push({
                    token: token,
                    resolved: resolved,
                    host: !!dependency.isHost,
                    optional: !!dependency.isOptional,
                    self: !!dependency.isSelf,
                    skipSelf: !!dependency.isSkipSelf,
                });
            }
            else {
                unsupported('dependency without a token');
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return deps;
}
function makeErrorStmt(name) {
    return new o.ThrowStmt(new o.InstantiateExpr(new o.ReadVarExpr('Error'), [
        o.literal(name + " has a constructor which is not compatible with Dependency Injection. It should probably not be @Injectable().")
    ]));
}
function isDelegatedMetadata(meta) {
    return meta.delegateType !== undefined;
}
function isExpressionFactoryMetadata(meta) {
    return meta.expression !== undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3IzX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQXNCLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBR3hFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEtBQUssQ0FBQyxNQUFNLHNCQUFzQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxXQUFXLElBQUksRUFBRSxFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFHNUQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQXNDeEMsTUFBTSxDQUFOLElBQVkscUJBSVg7QUFKRCxXQUFZLHFCQUFxQjtJQUMvQixtRUFBSyxDQUFBO0lBQ0wseUVBQVEsQ0FBQTtJQUNSLHVFQUFPLENBQUE7QUFDVCxDQUFDLEVBSlcscUJBQXFCLEtBQXJCLHFCQUFxQixRQUloQztBQW9CRDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxDQUFOLElBQVksd0JBaUJYO0FBakJELFdBQVksd0JBQXdCO0lBQ2xDOztPQUVHO0lBQ0gseUVBQVMsQ0FBQTtJQUVUOzs7O09BSUc7SUFDSCxpRkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCxpR0FBcUIsQ0FBQTtBQUN2QixDQUFDLEVBakJXLHdCQUF3QixLQUF4Qix3QkFBd0IsUUFpQm5DO0FBc0NEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLHNCQUFzQixDQUNsQyxJQUF1QixFQUFFLE1BQWM7SUFBZCx1QkFBQSxFQUFBLGNBQWM7SUFDekMsSUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJ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QUksQ0FBQztvQkFDUixLQUFLLE9BQUE7b0JBQ0wsUUFBUSxVQUFBO29CQUNSLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU07b0JBQ3pCLFFBQVEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVU7b0JBQ2pDLElBQUksRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU07b0JBQ3pCLFFBQVEsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLFVBQVU7aUJBQ2xDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO2FBQzNDO1NBQ0Y7Ozs7Ozs7OztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQVk7SUFDakMsT0FBTyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN2RSxDQUFDLENBQUMsT0FBTyxDQUNGLElBQUksbUhBQWdILENBQUM7S0FDN0gsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxJQUF1QjtJQUVsRCxPQUFRLElBQVksQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDO0FBQ2xELENBQUM7QUFFRCxTQUFTLDJCQUEyQixDQUFDLElBQXVCO0lBQzFELE9BQVEsSUFBWSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7QUFDaEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtTdGF0aWNTeW1ib2x9IGZyb20gJy4uL2FvdC9zdGF0aWNfc3ltYm9sJztcbmltcG9ydCB7Q29tcGlsZVR5cGVNZXRhZGF0YSwgdG9rZW5SZWZlcmVuY2V9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtDb21waWxlUmVmbGVjdG9yfSBmcm9tICcuLi9jb21waWxlX3JlZmxlY3Rvcic7XG5pbXBvcnQge0luamVjdEZsYWdzfSBmcm9tICcuLi9jb3JlJztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4uL2lkZW50aWZpZXJzJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtJZGVudGlmaWVycyBhcyBSM30gZnJvbSAnLi4vcmVuZGVyMy9yM19pZGVudGlmaWVycyc7XG5pbXBvcnQge091dHB1dENvbnRleHR9IGZyb20gJy4uL3V0aWwnO1xuXG5pbXBvcnQge3Vuc3VwcG9ydGVkfSBmcm9tICcuL3ZpZXcvdXRpbCc7XG5cblxuLyoqXG4gKiBNZXRhZGF0YSByZXF1aXJlZCBieSB0aGUgZmFjdG9yeSBnZW5lcmF0b3IgdG8gZ2VuZXJhdGUgYSBgZmFjdG9yeWAgZnVuY3Rpb24gZm9yIGEgdHlwZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSM0NvbnN0cnVjdG9yRmFjdG9yeU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIFN0cmluZyBuYW1lIG9mIHRoZSB0eXBlIGJlaW5nIGdlbmVyYXRlZCAodXNlZCB0byBuYW1lIHRoZSBmYWN0b3J5IGZ1bmN0aW9uKS5cbiAgICovXG4gIG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiByZXByZXNlbnRpbmcgdGhlIGZ1bmN0aW9uIChvciBjb25zdHJ1Y3Rvcikgd2hpY2ggd2lsbCBpbnN0YW50aWF0ZSB0aGUgcmVxdWVzdGVkXG4gICAqIHR5cGUuXG4gICAqXG4gICAqIFRoaXMgY291bGQgYmUgYSByZWZlcmVuY2UgdG8gYSBjb25zdHJ1Y3RvciB0eXBlLCBvciB0byBhIHVzZXItZGVmaW5lZCBmYWN0b3J5IGZ1bmN0aW9uLiBUaGVcbiAgICogYHVzZU5ld2AgcHJvcGVydHkgZGV0ZXJtaW5lcyB3aGV0aGVyIGl0IHdpbGwgYmUgY2FsbGVkIGFzIGEgY29uc3RydWN0b3Igb3Igbm90LlxuICAgKi9cbiAgdHlwZTogby5FeHByZXNzaW9uO1xuXG4gIC8qKlxuICAgKiBSZWdhcmRsZXNzIG9mIHdoZXRoZXIgYGZuT3JDbGFzc2AgaXMgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBvciBhIHVzZXItZGVmaW5lZCBmYWN0b3J5LCBpdFxuICAgKiBtYXkgaGF2ZSAwIG9yIG1vcmUgcGFyYW1ldGVycywgd2hpY2ggd2lsbCBiZSBpbmplY3RlZCBhY2NvcmRpbmcgdG8gdGhlIGBSM0RlcGVuZGVuY3lNZXRhZGF0YWBcbiAgICogZm9yIHRob3NlIHBhcmFtZXRlcnMuIElmIHRoaXMgaXMgYG51bGxgLCB0aGVuIHRoZSB0eXBlJ3MgY29uc3RydWN0b3IgaXMgbm9uZXhpc3RlbnQgYW5kIHdpbGxcbiAgICogYmUgaW5oZXJpdGVkIGZyb20gYGZuT3JDbGFzc2Agd2hpY2ggaXMgaW50ZXJwcmV0ZWQgYXMgdGhlIGN1cnJlbnQgdHlwZS4gSWYgdGhpcyBpcyBgJ2ludmFsaWQnYCxcbiAgICogdGhlbiBvbmUgb3IgbW9yZSBvZiB0aGUgcGFyYW1ldGVycyB3YXNuJ3QgcmVzb2x2YWJsZSBhbmQgYW55IGF0dGVtcHQgdG8gdXNlIHRoZXNlIGRlcHMgd2lsbFxuICAgKiByZXN1bHQgaW4gYSBydW50aW1lIGVycm9yLlxuICAgKi9cbiAgZGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXXwnaW52YWxpZCd8bnVsbDtcblxuICAvKipcbiAgICogQW4gZXhwcmVzc2lvbiBmb3IgdGhlIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgdXNlZCB0byBpbmplY3QgZGVwZW5kZW5jaWVzLiBUaGUgQVBJIG9mIHRoaXNcbiAgICogZnVuY3Rpb24gY291bGQgYmUgZGlmZmVyZW50LCBhbmQgb3RoZXIgb3B0aW9ucyBjb250cm9sIGhvdyBpdCB3aWxsIGJlIGludm9rZWQuXG4gICAqL1xuICBpbmplY3RGbjogby5FeHRlcm5hbFJlZmVyZW5jZTtcbn1cblxuZXhwb3J0IGVudW0gUjNGYWN0b3J5RGVsZWdhdGVUeXBlIHtcbiAgQ2xhc3MsXG4gIEZ1bmN0aW9uLFxuICBGYWN0b3J5LFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzRGVsZWdhdGVkRmFjdG9yeU1ldGFkYXRhIGV4dGVuZHMgUjNDb25zdHJ1Y3RvckZhY3RvcnlNZXRhZGF0YSB7XG4gIGRlbGVnYXRlOiBvLkV4cHJlc3Npb247XG4gIGRlbGVnYXRlVHlwZTogUjNGYWN0b3J5RGVsZWdhdGVUeXBlLkZhY3Rvcnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNEZWxlZ2F0ZWRGbk9yQ2xhc3NNZXRhZGF0YSBleHRlbmRzIFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEge1xuICBkZWxlZ2F0ZTogby5FeHByZXNzaW9uO1xuICBkZWxlZ2F0ZVR5cGU6IFIzRmFjdG9yeURlbGVnYXRlVHlwZS5DbGFzc3xSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUuRnVuY3Rpb247XG4gIGRlbGVnYXRlRGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0V4cHJlc3Npb25GYWN0b3J5TWV0YWRhdGEgZXh0ZW5kcyBSM0NvbnN0cnVjdG9yRmFjdG9yeU1ldGFkYXRhIHtcbiAgZXhwcmVzc2lvbjogby5FeHByZXNzaW9uO1xufVxuXG5leHBvcnQgdHlwZSBSM0ZhY3RvcnlNZXRhZGF0YSA9IFIzQ29uc3RydWN0b3JGYWN0b3J5TWV0YWRhdGEgfCBSM0RlbGVnYXRlZEZhY3RvcnlNZXRhZGF0YSB8XG4gICAgUjNEZWxlZ2F0ZWRGbk9yQ2xhc3NNZXRhZGF0YSB8IFIzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YTtcblxuLyoqXG4gKiBSZXNvbHZlZCB0eXBlIG9mIGEgZGVwZW5kZW5jeS5cbiAqXG4gKiBPY2Nhc2lvbmFsbHksIGRlcGVuZGVuY2llcyB3aWxsIGhhdmUgc3BlY2lhbCBzaWduaWZpY2FuY2Ugd2hpY2ggaXMga25vd24gc3RhdGljYWxseS4gSW4gdGhhdFxuICogY2FzZSB0aGUgYFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZWAgaW5mb3JtcyB0aGUgZmFjdG9yeSBnZW5lcmF0b3IgdGhhdCBhIHBhcnRpY3VsYXIgZGVwZW5kZW5jeVxuICogc2hvdWxkIGJlIGdlbmVyYXRlZCBzcGVjaWFsbHkgKHVzdWFsbHkgYnkgY2FsbGluZyBhIHNwZWNpYWwgaW5qZWN0aW9uIGZ1bmN0aW9uIGluc3RlYWQgb2YgdGhlXG4gKiBzdGFuZGFyZCBvbmUpLlxuICovXG5leHBvcnQgZW51bSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUge1xuICAvKipcbiAgICogQSBub3JtYWwgdG9rZW4gZGVwZW5kZW5jeS5cbiAgICovXG4gIFRva2VuID0gMCxcblxuICAvKipcbiAgICogVGhlIGRlcGVuZGVuY3kgaXMgZm9yIGFuIGF0dHJpYnV0ZS5cbiAgICpcbiAgICogVGhlIHRva2VuIGV4cHJlc3Npb24gaXMgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBhdHRyaWJ1dGUgbmFtZS5cbiAgICovXG4gIEF0dHJpYnV0ZSA9IDEsXG5cbiAgLyoqXG4gICAqIEluamVjdGluZyB0aGUgYENoYW5nZURldGVjdG9yUmVmYCB0b2tlbi4gTmVlZHMgc3BlY2lhbCBoYW5kbGluZyB3aGVuIGluamVjdGVkIGludG8gYSBwaXBlLlxuICAgKi9cbiAgQ2hhbmdlRGV0ZWN0b3JSZWYgPSAyLFxufVxuXG4vKipcbiAqIE1ldGFkYXRhIHJlcHJlc2VudGluZyBhIHNpbmdsZSBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gYSBjb25zdHJ1Y3RvciBvciBmdW5jdGlvbiBjYWxsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFIzRGVwZW5kZW5jeU1ldGFkYXRhIHtcbiAgLyoqXG4gICAqIEFuIGV4cHJlc3Npb24gcmVwcmVzZW50aW5nIHRoZSB0b2tlbiBvciB2YWx1ZSB0byBiZSBpbmplY3RlZC5cbiAgICovXG4gIHRva2VuOiBvLkV4cHJlc3Npb247XG5cbiAgLyoqXG4gICAqIEFuIGVudW0gaW5kaWNhdGluZyB3aGV0aGVyIHRoaXMgZGVwZW5kZW5jeSBoYXMgc3BlY2lhbCBtZWFuaW5nIHRvIEFuZ3VsYXIgYW5kIG5lZWRzIHRvIGJlXG4gICAqIGluamVjdGVkIHNwZWNpYWxseS5cbiAgICovXG4gIHJlc29sdmVkOiBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGFuIEBIb3N0IHF1YWxpZmllci5cbiAgICovXG4gIGhvc3Q6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGRlcGVuZGVuY3kgaGFzIGFuIEBPcHRpb25hbCBxdWFsaWZpZXIuXG4gICAqL1xuICBvcHRpb25hbDogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGVwZW5kZW5jeSBoYXMgYW4gQFNlbGYgcXVhbGlmaWVyLlxuICAgKi9cbiAgc2VsZjogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZGVwZW5kZW5jeSBoYXMgYW4gQFNraXBTZWxmIHF1YWxpZmllci5cbiAgICovXG4gIHNraXBTZWxmOiBib29sZWFuO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIGZhY3RvcnkgZnVuY3Rpb24gZXhwcmVzc2lvbiBmb3IgdGhlIGdpdmVuIGBSM0ZhY3RvcnlNZXRhZGF0YWAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21waWxlRmFjdG9yeUZ1bmN0aW9uKFxuICAgIG1ldGE6IFIzRmFjdG9yeU1ldGFkYXRhLCBpc1BpcGUgPSBmYWxzZSk6IHtmYWN0b3J5OiBvLkV4cHJlc3Npb24sIHN0YXRlbWVudHM6IG8uU3RhdGVtZW50W119IHtcbiAgY29uc3QgdCA9IG8udmFyaWFibGUoJ3QnKTtcbiAgY29uc3Qgc3RhdGVtZW50czogby5TdGF0ZW1lbnRbXSA9IFtdO1xuXG4gIC8vIFRoZSB0eXBlIHRvIGluc3RhbnRpYXRlIHZpYSBjb25zdHJ1Y3RvciBpbnZvY2F0aW9uLiBJZiB0aGVyZSBpcyBubyBkZWxlZ2F0ZWQgZmFjdG9yeSwgbWVhbmluZ1xuICAvLyB0aGlzIHR5cGUgaXMgYWx3YXlzIGNyZWF0ZWQgYnkgY29uc3RydWN0b3IgaW52b2NhdGlvbiwgdGhlbiB0aGlzIGlzIHRoZSB0eXBlLXRvLWNyZWF0ZVxuICAvLyBwYXJhbWV0ZXIgcHJvdmlkZWQgYnkgdGhlIHVzZXIgKHQpIGlmIHNwZWNpZmllZCwgb3IgdGhlIGN1cnJlbnQgdHlwZSBpZiBub3QuIElmIHRoZXJlIGlzIGFcbiAgLy8gZGVsZWdhdGVkIGZhY3RvcnkgKHdoaWNoIGlzIHVzZWQgdG8gY3JlYXRlIHRoZSBjdXJyZW50IHR5cGUpIHRoZW4gdGhpcyBpcyBvbmx5IHRoZSB0eXBlLXRvLVxuICAvLyBjcmVhdGUgcGFyYW1ldGVyICh0KS5cbiAgY29uc3QgdHlwZUZvckN0b3IgPVxuICAgICAgIWlzRGVsZWdhdGVkTWV0YWRhdGEobWV0YSkgPyBuZXcgby5CaW5hcnlPcGVyYXRvckV4cHIoby5CaW5hcnlPcGVyYXRvci5PciwgdCwgbWV0YS50eXBlKSA6IHQ7XG5cbiAgbGV0IGN0b3JFeHByOiBvLkV4cHJlc3Npb258bnVsbCA9IG51bGw7XG4gIGlmIChtZXRhLmRlcHMgIT09IG51bGwpIHtcbiAgICAvLyBUaGVyZSBpcyBhIGNvbnN0cnVjdG9yIChlaXRoZXIgZXhwbGljaXRseSBvciBpbXBsaWNpdGx5IGRlZmluZWQpLlxuICAgIGlmIChtZXRhLmRlcHMgIT09ICdpbnZhbGlkJykge1xuICAgICAgY3RvckV4cHIgPVxuICAgICAgICAgIG5ldyBvLkluc3RhbnRpYXRlRXhwcih0eXBlRm9yQ3RvciwgaW5qZWN0RGVwZW5kZW5jaWVzKG1ldGEuZGVwcywgbWV0YS5pbmplY3RGbiwgaXNQaXBlKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJhc2VGYWN0b3J5ID0gby52YXJpYWJsZShgybUke21ldGEubmFtZX1fQmFzZUZhY3RvcnlgKTtcbiAgICBjb25zdCBnZXRJbmhlcml0ZWRGYWN0b3J5ID0gby5pbXBvcnRFeHByKFIzLmdldEluaGVyaXRlZEZhY3RvcnkpO1xuICAgIGNvbnN0IGJhc2VGYWN0b3J5U3RtdCA9XG4gICAgICAgIGJhc2VGYWN0b3J5LnNldChnZXRJbmhlcml0ZWRGYWN0b3J5LmNhbGxGbihbbWV0YS50eXBlXSkpLnRvRGVjbFN0bXQoby5JTkZFUlJFRF9UWVBFLCBbXG4gICAgICAgICAgby5TdG10TW9kaWZpZXIuRXhwb3J0ZWQsIG8uU3RtdE1vZGlmaWVyLkZpbmFsXG4gICAgICAgIF0pO1xuICAgIHN0YXRlbWVudHMucHVzaChiYXNlRmFjdG9yeVN0bXQpO1xuXG4gICAgLy8gVGhlcmUgaXMgbm8gY29uc3RydWN0b3IsIHVzZSB0aGUgYmFzZSBjbGFzcycgZmFjdG9yeSB0byBjb25zdHJ1Y3QgdHlwZUZvckN0b3IuXG4gICAgY3RvckV4cHIgPSBiYXNlRmFjdG9yeS5jYWxsRm4oW3R5cGVGb3JDdG9yXSk7XG4gIH1cbiAgY29uc3QgY3RvckV4cHJGaW5hbCA9IGN0b3JFeHByO1xuXG4gIGNvbnN0IGJvZHk6IG8uU3RhdGVtZW50W10gPSBbXTtcbiAgbGV0IHJldEV4cHI6IG8uRXhwcmVzc2lvbnxudWxsID0gbnVsbDtcblxuICBmdW5jdGlvbiBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KG5vbkN0b3JFeHByOiBvLkV4cHJlc3Npb24pOiBvLlJlYWRWYXJFeHByIHtcbiAgICBjb25zdCByID0gby52YXJpYWJsZSgncicpO1xuICAgIGJvZHkucHVzaChyLnNldChvLk5VTExfRVhQUikudG9EZWNsU3RtdCgpKTtcbiAgICBsZXQgY3RvclN0bXQ6IG8uU3RhdGVtZW50fG51bGwgPSBudWxsO1xuICAgIGlmIChjdG9yRXhwckZpbmFsICE9PSBudWxsKSB7XG4gICAgICBjdG9yU3RtdCA9IHIuc2V0KGN0b3JFeHByRmluYWwpLnRvU3RtdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdG9yU3RtdCA9IG1ha2VFcnJvclN0bXQobWV0YS5uYW1lKTtcbiAgICB9XG4gICAgYm9keS5wdXNoKG8uaWZTdG10KHQsIFtjdG9yU3RtdF0sIFtyLnNldChub25DdG9yRXhwcikudG9TdG10KCldKSk7XG4gICAgcmV0dXJuIHI7XG4gIH1cblxuICBpZiAoaXNEZWxlZ2F0ZWRNZXRhZGF0YShtZXRhKSAmJiBtZXRhLmRlbGVnYXRlVHlwZSA9PT0gUjNGYWN0b3J5RGVsZWdhdGVUeXBlLkZhY3RvcnkpIHtcbiAgICBjb25zdCBkZWxlZ2F0ZUZhY3RvcnkgPSBvLnZhcmlhYmxlKGDJtSR7bWV0YS5uYW1lfV9CYXNlRmFjdG9yeWApO1xuICAgIGNvbnN0IGdldEZhY3RvcnlPZiA9IG8uaW1wb3J0RXhwcihSMy5nZXRGYWN0b3J5T2YpO1xuICAgIGlmIChtZXRhLmRlbGVnYXRlLmlzRXF1aXZhbGVudChtZXRhLnR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYElsbGVnYWwgc3RhdGU6IGNvbXBpbGluZyBmYWN0b3J5IHRoYXQgZGVsZWdhdGVzIHRvIGl0c2VsZmApO1xuICAgIH1cbiAgICBjb25zdCBkZWxlZ2F0ZUZhY3RvcnlTdG10ID1cbiAgICAgICAgZGVsZWdhdGVGYWN0b3J5LnNldChnZXRGYWN0b3J5T2YuY2FsbEZuKFttZXRhLmRlbGVnYXRlXSkpLnRvRGVjbFN0bXQoby5JTkZFUlJFRF9UWVBFLCBbXG4gICAgICAgICAgby5TdG10TW9kaWZpZXIuRXhwb3J0ZWQsIG8uU3RtdE1vZGlmaWVyLkZpbmFsXG4gICAgICAgIF0pO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKGRlbGVnYXRlRmFjdG9yeVN0bXQpO1xuICAgIHJldEV4cHIgPSBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KGRlbGVnYXRlRmFjdG9yeS5jYWxsRm4oW10pKTtcbiAgfSBlbHNlIGlmIChpc0RlbGVnYXRlZE1ldGFkYXRhKG1ldGEpKSB7XG4gICAgLy8gVGhpcyB0eXBlIGlzIGNyZWF0ZWQgd2l0aCBhIGRlbGVnYXRlZCBmYWN0b3J5LiBJZiBhIHR5cGUgcGFyYW1ldGVyIGlzIG5vdCBzcGVjaWZpZWQsIGNhbGxcbiAgICAvLyB0aGUgZmFjdG9yeSBpbnN0ZWFkLlxuICAgIGNvbnN0IGRlbGVnYXRlQXJncyA9IGluamVjdERlcGVuZGVuY2llcyhtZXRhLmRlbGVnYXRlRGVwcywgbWV0YS5pbmplY3RGbiwgaXNQaXBlKTtcbiAgICAvLyBFaXRoZXIgY2FsbCBgbmV3IGRlbGVnYXRlKC4uLilgIG9yIGBkZWxlZ2F0ZSguLi4pYCBkZXBlbmRpbmcgb24gbWV0YS51c2VOZXdGb3JEZWxlZ2F0ZS5cbiAgICBjb25zdCBmYWN0b3J5RXhwciA9IG5ldyAoXG4gICAgICAgIG1ldGEuZGVsZWdhdGVUeXBlID09PSBSM0ZhY3RvcnlEZWxlZ2F0ZVR5cGUuQ2xhc3MgP1xuICAgICAgICAgICAgby5JbnN0YW50aWF0ZUV4cHIgOlxuICAgICAgICAgICAgby5JbnZva2VGdW5jdGlvbkV4cHIpKG1ldGEuZGVsZWdhdGUsIGRlbGVnYXRlQXJncyk7XG4gICAgcmV0RXhwciA9IG1ha2VDb25kaXRpb25hbEZhY3RvcnkoZmFjdG9yeUV4cHIpO1xuICB9IGVsc2UgaWYgKGlzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YShtZXRhKSkge1xuICAgIC8vIFRPRE8oYWx4aHViKTogZGVjaWRlIHdoZXRoZXIgdG8gbG93ZXIgdGhlIHZhbHVlIGhlcmUgb3IgaW4gdGhlIGNhbGxlclxuICAgIHJldEV4cHIgPSBtYWtlQ29uZGl0aW9uYWxGYWN0b3J5KG1ldGEuZXhwcmVzc2lvbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0RXhwciA9IGN0b3JFeHByO1xuICB9XG5cbiAgaWYgKHJldEV4cHIgIT09IG51bGwpIHtcbiAgICBib2R5LnB1c2gobmV3IG8uUmV0dXJuU3RhdGVtZW50KHJldEV4cHIpKTtcbiAgfSBlbHNlIHtcbiAgICBib2R5LnB1c2gobWFrZUVycm9yU3RtdChtZXRhLm5hbWUpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZmFjdG9yeTogby5mbihcbiAgICAgICAgW25ldyBvLkZuUGFyYW0oJ3QnLCBvLkRZTkFNSUNfVFlQRSldLCBib2R5LCBvLklORkVSUkVEX1RZUEUsIHVuZGVmaW5lZCxcbiAgICAgICAgYCR7bWV0YS5uYW1lfV9GYWN0b3J5YCksXG4gICAgc3RhdGVtZW50cyxcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5qZWN0RGVwZW5kZW5jaWVzKFxuICAgIGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhW10sIGluamVjdEZuOiBvLkV4dGVybmFsUmVmZXJlbmNlLCBpc1BpcGU6IGJvb2xlYW4pOiBvLkV4cHJlc3Npb25bXSB7XG4gIHJldHVybiBkZXBzLm1hcChkZXAgPT4gY29tcGlsZUluamVjdERlcGVuZGVuY3koZGVwLCBpbmplY3RGbiwgaXNQaXBlKSk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVJbmplY3REZXBlbmRlbmN5KFxuICAgIGRlcDogUjNEZXBlbmRlbmN5TWV0YWRhdGEsIGluamVjdEZuOiBvLkV4dGVybmFsUmVmZXJlbmNlLCBpc1BpcGU6IGJvb2xlYW4pOiBvLkV4cHJlc3Npb24ge1xuICAvLyBJbnRlcnByZXQgdGhlIGRlcGVuZGVuY3kgYWNjb3JkaW5nIHRvIGl0cyByZXNvbHZlZCB0eXBlLlxuICBzd2l0Y2ggKGRlcC5yZXNvbHZlZCkge1xuICAgIGNhc2UgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLlRva2VuOlxuICAgIGNhc2UgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLkNoYW5nZURldGVjdG9yUmVmOlxuICAgICAgLy8gQnVpbGQgdXAgdGhlIGluamVjdGlvbiBmbGFncyBhY2NvcmRpbmcgdG8gdGhlIG1ldGFkYXRhLlxuICAgICAgY29uc3QgZmxhZ3MgPSBJbmplY3RGbGFncy5EZWZhdWx0IHwgKGRlcC5zZWxmID8gSW5qZWN0RmxhZ3MuU2VsZiA6IDApIHxcbiAgICAgICAgICAoZGVwLnNraXBTZWxmID8gSW5qZWN0RmxhZ3MuU2tpcFNlbGYgOiAwKSB8IChkZXAuaG9zdCA/IEluamVjdEZsYWdzLkhvc3QgOiAwKSB8XG4gICAgICAgICAgKGRlcC5vcHRpb25hbCA/IEluamVjdEZsYWdzLk9wdGlvbmFsIDogMCk7XG5cbiAgICAgIC8vIElmIHRoaXMgZGVwZW5kZW5jeSBpcyBvcHRpb25hbCBvciBvdGhlcndpc2UgaGFzIG5vbi1kZWZhdWx0IGZsYWdzLCB0aGVuIGFkZGl0aW9uYWxcbiAgICAgIC8vIHBhcmFtZXRlcnMgZGVzY3JpYmluZyBob3cgdG8gaW5qZWN0IHRoZSBkZXBlbmRlbmN5IG11c3QgYmUgcGFzc2VkIHRvIHRoZSBpbmplY3QgZnVuY3Rpb25cbiAgICAgIC8vIHRoYXQncyBiZWluZyB1c2VkLlxuICAgICAgbGV0IGZsYWdzUGFyYW06IG8uTGl0ZXJhbEV4cHJ8bnVsbCA9XG4gICAgICAgICAgKGZsYWdzICE9PSBJbmplY3RGbGFncy5EZWZhdWx0IHx8IGRlcC5vcHRpb25hbCkgPyBvLmxpdGVyYWwoZmxhZ3MpIDogbnVsbDtcblxuICAgICAgLy8gV2UgaGF2ZSBhIHNlcGFyYXRlIGluc3RydWN0aW9uIGZvciBpbmplY3RpbmcgQ2hhbmdlRGV0ZWN0b3JSZWYgaW50byBhIHBpcGUuXG4gICAgICBpZiAoaXNQaXBlICYmIGRlcC5yZXNvbHZlZCA9PT0gUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLkNoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoUjMuaW5qZWN0UGlwZUNoYW5nZURldGVjdG9yUmVmKS5jYWxsRm4oZmxhZ3NQYXJhbSA/IFtmbGFnc1BhcmFtXSA6IFtdKTtcbiAgICAgIH1cblxuICAgICAgLy8gQnVpbGQgdXAgdGhlIGFyZ3VtZW50cyB0byB0aGUgaW5qZWN0Rm4gY2FsbC5cbiAgICAgIGNvbnN0IGluamVjdEFyZ3MgPSBbZGVwLnRva2VuXTtcbiAgICAgIGlmIChmbGFnc1BhcmFtKSB7XG4gICAgICAgIGluamVjdEFyZ3MucHVzaChmbGFnc1BhcmFtKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvLmltcG9ydEV4cHIoaW5qZWN0Rm4pLmNhbGxGbihpbmplY3RBcmdzKTtcbiAgICBjYXNlIFIzUmVzb2x2ZWREZXBlbmRlbmN5VHlwZS5BdHRyaWJ1dGU6XG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhdHRyaWJ1dGVzLCB0aGUgYXR0cmlidXRlIG5hbWUgaW4gcXVlc3Rpb24gaXMgZ2l2ZW4gYXMgdGhlIHRva2VuLlxuICAgICAgcmV0dXJuIG8uaW1wb3J0RXhwcihSMy5pbmplY3RBdHRyaWJ1dGUpLmNhbGxGbihbZGVwLnRva2VuXSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB1bnN1cHBvcnRlZChcbiAgICAgICAgICBgVW5rbm93biBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU6ICR7UjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlW2RlcC5yZXNvbHZlZF19YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGhlbHBlciBmdW5jdGlvbiB1c2VmdWwgZm9yIGV4dHJhY3RpbmcgYFIzRGVwZW5kZW5jeU1ldGFkYXRhYCBmcm9tIGEgUmVuZGVyMlxuICogYENvbXBpbGVUeXBlTWV0YWRhdGFgIGluc3RhbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwZW5kZW5jaWVzRnJvbUdsb2JhbE1ldGFkYXRhKFxuICAgIHR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsIG91dHB1dEN0eDogT3V0cHV0Q29udGV4dCxcbiAgICByZWZsZWN0b3I6IENvbXBpbGVSZWZsZWN0b3IpOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdIHtcbiAgLy8gVXNlIHRoZSBgQ29tcGlsZVJlZmxlY3RvcmAgdG8gbG9vayB1cCByZWZlcmVuY2VzIHRvIHNvbWUgd2VsbC1rbm93biBBbmd1bGFyIHR5cGVzLiBUaGVzZSB3aWxsXG4gIC8vIGJlIGNvbXBhcmVkIHdpdGggdGhlIHRva2VuIHRvIHN0YXRpY2FsbHkgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHRva2VuIGhhcyBzaWduaWZpY2FuY2UgdG9cbiAgLy8gQW5ndWxhciwgYW5kIHNldCB0aGUgY29ycmVjdCBgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlYCBhcyBhIHJlc3VsdC5cbiAgY29uc3QgaW5qZWN0b3JSZWYgPSByZWZsZWN0b3IucmVzb2x2ZUV4dGVybmFsUmVmZXJlbmNlKElkZW50aWZpZXJzLkluamVjdG9yKTtcblxuICAvLyBJdGVyYXRlIHRocm91Z2ggdGhlIHR5cGUncyBESSBkZXBlbmRlbmNpZXMgYW5kIHByb2R1Y2UgYFIzRGVwZW5kZW5jeU1ldGFkYXRhYCBmb3IgZWFjaCBvZiB0aGVtLlxuICBjb25zdCBkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YVtdID0gW107XG4gIGZvciAobGV0IGRlcGVuZGVuY3kgb2YgdHlwZS5kaURlcHMpIHtcbiAgICBpZiAoZGVwZW5kZW5jeS50b2tlbikge1xuICAgICAgY29uc3QgdG9rZW5SZWYgPSB0b2tlblJlZmVyZW5jZShkZXBlbmRlbmN5LnRva2VuKTtcbiAgICAgIGxldCByZXNvbHZlZDogUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlID0gZGVwZW5kZW5jeS5pc0F0dHJpYnV0ZSA/XG4gICAgICAgICAgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLkF0dHJpYnV0ZSA6XG4gICAgICAgICAgUjNSZXNvbHZlZERlcGVuZGVuY3lUeXBlLlRva2VuO1xuXG4gICAgICAvLyBJbiB0aGUgY2FzZSBvZiBtb3N0IGRlcGVuZGVuY2llcywgdGhlIHRva2VuIHdpbGwgYmUgYSByZWZlcmVuY2UgdG8gYSB0eXBlLiBTb21ldGltZXMsXG4gICAgICAvLyBob3dldmVyLCBpdCBjYW4gYmUgYSBzdHJpbmcsIGluIHRoZSBjYXNlIG9mIG9sZGVyIEFuZ3VsYXIgY29kZSBvciBAQXR0cmlidXRlIGluamVjdGlvbi5cbiAgICAgIGNvbnN0IHRva2VuID1cbiAgICAgICAgICB0b2tlblJlZiBpbnN0YW5jZW9mIFN0YXRpY1N5bWJvbCA/IG91dHB1dEN0eC5pbXBvcnRFeHByKHRva2VuUmVmKSA6IG8ubGl0ZXJhbCh0b2tlblJlZik7XG5cbiAgICAgIC8vIENvbnN0cnVjdCB0aGUgZGVwZW5kZW5jeS5cbiAgICAgIGRlcHMucHVzaCh7XG4gICAgICAgIHRva2VuLFxuICAgICAgICByZXNvbHZlZCxcbiAgICAgICAgaG9zdDogISFkZXBlbmRlbmN5LmlzSG9zdCxcbiAgICAgICAgb3B0aW9uYWw6ICEhZGVwZW5kZW5jeS5pc09wdGlvbmFsLFxuICAgICAgICBzZWxmOiAhIWRlcGVuZGVuY3kuaXNTZWxmLFxuICAgICAgICBza2lwU2VsZjogISFkZXBlbmRlbmN5LmlzU2tpcFNlbGYsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zdXBwb3J0ZWQoJ2RlcGVuZGVuY3kgd2l0aG91dCBhIHRva2VuJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlcHM7XG59XG5cbmZ1bmN0aW9uIG1ha2VFcnJvclN0bXQobmFtZTogc3RyaW5nKTogby5TdGF0ZW1lbnQge1xuICByZXR1cm4gbmV3IG8uVGhyb3dTdG10KG5ldyBvLkluc3RhbnRpYXRlRXhwcihuZXcgby5SZWFkVmFyRXhwcignRXJyb3InKSwgW1xuICAgIG8ubGl0ZXJhbChcbiAgICAgICAgYCR7bmFtZX0gaGFzIGEgY29uc3RydWN0b3Igd2hpY2ggaXMgbm90IGNvbXBhdGlibGUgd2l0aCBEZXBlbmRlbmN5IEluamVjdGlvbi4gSXQgc2hvdWxkIHByb2JhYmx5IG5vdCBiZSBASW5qZWN0YWJsZSgpLmApXG4gIF0pKTtcbn1cblxuZnVuY3Rpb24gaXNEZWxlZ2F0ZWRNZXRhZGF0YShtZXRhOiBSM0ZhY3RvcnlNZXRhZGF0YSk6IG1ldGEgaXMgUjNEZWxlZ2F0ZWRGYWN0b3J5TWV0YWRhdGF8XG4gICAgUjNEZWxlZ2F0ZWRGbk9yQ2xhc3NNZXRhZGF0YSB7XG4gIHJldHVybiAobWV0YSBhcyBhbnkpLmRlbGVnYXRlVHlwZSAhPT0gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBpc0V4cHJlc3Npb25GYWN0b3J5TWV0YWRhdGEobWV0YTogUjNGYWN0b3J5TWV0YWRhdGEpOiBtZXRhIGlzIFIzRXhwcmVzc2lvbkZhY3RvcnlNZXRhZGF0YSB7XG4gIHJldHVybiAobWV0YSBhcyBhbnkpLmV4cHJlc3Npb24gIT09IHVuZGVmaW5lZDtcbn1cbiJdfQ==